import assert from "node:assert/strict";
import test from "node:test";

import {
  VERIFIED_AT,
  applyMigration,
  createSessionHelpers,
  createSupabaseFixtureDatabase,
  migrations,
  readMigration,
} from "./helpers/database.mjs";

const ids = {
  core: "00000000-0000-0000-0000-000000000001",
  executive: "00000000-0000-0000-0000-000000000002",
  member: "00000000-0000-0000-0000-000000000003",
  unverified: "00000000-0000-0000-0000-000000000004",
  autoconfirmed: "00000000-0000-0000-0000-000000000005",
  legacy: "00000000-0000-0000-0000-000000000006",
};

test("executive access is enforced by PostgreSQL triggers and RLS", async (suite) => {
  const db = await createSupabaseFixtureDatabase();
  suite.after(() => db.close());
  const { asUser, createUser } = createSessionHelpers(db);

  await applyMigration(db, migrations.initialSchema);
  await applyMigration(db, migrations.eventUpgrades);
  await applyMigration(db, migrations.profileCompletion);
  await db.query("insert into auth.users (id, email) values ($1, 'legacy@example.test')", [ids.legacy]);
  await db.query("update public.profiles set role = 'president' where id = $1", [ids.legacy]);
  await applyMigration(db, migrations.executiveRoles);
  await applyMigration(db, migrations.rosterAccess);
  // The administrator migration redefines the shared role function, so every
  // access rule below is verified against the final production schema.
  await applyMigration(db, migrations.adminProvisioning);

  async function access(id) {
    return asUser(id, async () => {
      const { rows } = await db.query("select public.is_event_creator($1) as allowed", [id]);
      return rows[0].allowed;
    });
  }

  async function insertEvent(userId) {
    return asUser(userId, () => db.query(`
      insert into public.activities (name, starts_at, short_description, location, created_by)
      values ('Security test event', now() + interval '1 day', 'Local test only', 'Test room', $1)
      returning id
    `, [userId]));
  }

  await db.exec(`
    insert into private.approved_executives (email, full_name, position, role) values
      ('core@example.test', 'Core Test', 'President', 'core_executive'),
      ('executive@example.test', 'Executive Test', 'Director', 'executive'),
      ('unverified@example.test', 'Unverified Test', 'Secretary', 'core_executive'),
      ('autoconfirmed@example.test', 'Auto Test', 'Lead', 'executive');
  `);

  await suite.test("sign-up checks email normalization, approved category, and unknown emails", async () => {
    const { rows } = await db.query(`select
      public.executive_signup_is_allowed(' CORE@EXAMPLE.TEST ', 'core_executive') as approved,
      public.executive_signup_is_allowed('core@example.test', 'executive') as wrong_tier,
      public.executive_signup_is_allowed('outsider@example.test', 'core_executive') as outsider`);
    assert.deepEqual(rows[0], { approved: true, wrong_tier: false, outsider: false });
    await assert.rejects(
      createUser("00000000-0000-0000-0000-000000000099", "outsider@example.test", { requestedRole: "core_executive" }),
      /not approved/,
    );
    await assert.rejects(
      createUser("00000000-0000-0000-0000-000000000098", "core@example.test", { requestedRole: "executive" }),
      /not approved/,
    );
    await assert.rejects(
      createUser("00000000-0000-0000-0000-000000000097", "outsider@example.test", { requestedRole: "president" }),
      /Invalid membership/,
    );
  });

  await createUser(ids.core, "core@example.test", { requestedRole: "core_executive" });
  await createUser(ids.executive, "executive@example.test", { requestedRole: "executive" });
  await createUser(ids.member, "member@example.test", { requestedRole: "member" });
  await createUser(ids.unverified, "unverified@example.test", { requestedRole: "core_executive", verified: false });
  await createUser(ids.autoconfirmed, "autoconfirmed@example.test", {
    requestedRole: "executive",
    confirmationSent: false,
  });

  await suite.test("both verified EB tiers can create events; other accounts cannot", async () => {
    for (const id of [ids.core, ids.executive]) {
      assert.equal(await access(id), true);
      assert.equal((await insertEvent(id)).rows.length, 1);
    }
    for (const id of [ids.member, ids.unverified, ids.autoconfirmed, ids.legacy]) {
      assert.equal(await access(id), false);
      await assert.rejects(insertEvent(id), /row-level security/);
    }
    const { rows } = await db.query("select role from public.profiles where id = $1", [ids.legacy]);
    assert.equal(rows[0].role, "member");
  });

  await suite.test("a member cannot gain access through profile emails, role writes, or metadata", async () => {
    await asUser(ids.member, () => db.query(`
      update public.profiles set role = 'core_executive', personal_email = 'core@example.test',
        bulsu_email = 'core@example.test' where id = $1
    `, [ids.member]));
    await db.query("update auth.users set raw_user_meta_data = '{\"requested_role\":\"core_executive\",\"role\":\"president\"}' where id = $1", [ids.member]);
    const { rows } = await db.query("select role from public.profiles where id = $1", [ids.member]);
    assert.equal(rows[0].role, "member");
    assert.equal(await access(ids.member), false);
    await asUser(ids.member, async () => {
      const { rows: other } = await db.query("select public.is_event_creator($1) as allowed", [ids.core]);
      assert.equal(other[0].allowed, false);
      await assert.rejects(db.query("update public.profiles set member_status = 'inactive' where id = $1", [ids.member]), /member status/);
    });
  });

  await suite.test("anonymous users and members cannot read or edit the private allowlist", async () => {
    for (const [id, role] of [[null, "anon"], [ids.member, "authenticated"]]) {
      await asUser(id, async () => {
        await assert.rejects(db.query("select * from private.approved_executives"), /permission denied/);
        await assert.rejects(db.query("update private.approved_executives set role = 'core_executive'"), /permission denied/);
        await assert.rejects(db.query("select private.executive_role_for_user($1)", [ids.core]), /permission denied/);
      }, role);
    }
    await asUser(null, () => assert.rejects(db.query(`
      insert into public.activities (name, starts_at, short_description, location)
      values ('Anonymous', now(), 'Blocked', 'Nowhere')
    `), /permission denied/), "anon");
  });

  await suite.test("email verification activates an approved account", async () => {
    await db.query("update auth.users set email_confirmed_at = $2 where id = $1", [ids.unverified, VERIFIED_AT]);
    assert.equal(await access(ids.unverified), true);
    const { rows } = await db.query("select role from public.profiles where id = $1", [ids.unverified]);
    assert.equal(rows[0].role, "core_executive");
  });

  await suite.test("email changes, inactive status, and roster removal revoke access immediately", async () => {
    await db.query("update auth.users set email = 'changed@example.test' where id = $1", [ids.unverified]);
    assert.equal(await access(ids.unverified), false);
    await db.query("update public.profiles set member_status = 'inactive' where id = $1", [ids.executive]);
    assert.equal(await access(ids.executive), false);
    await db.query("update public.profiles set member_status = 'active' where id = $1", [ids.executive]);
    await db.query("update private.approved_executives set active = false where email = 'executive@example.test'");
    assert.equal(await access(ids.executive), false);
    await assert.rejects(insertEvent(ids.executive), /row-level security/);
    await db.query("update private.approved_executives set active = true, role = 'core_executive' where email = 'executive@example.test'");
    assert.equal(await access(ids.executive), true);
    const { rows } = await db.query("select role from public.profiles where id = $1", [ids.executive]);
    assert.equal(rows[0].role, "core_executive");
    await db.query("delete from private.approved_executives where email = 'executive@example.test'");
    assert.equal(await access(ids.executive), false);
  });

  await suite.test("regular members can register for an event, but cannot register another user", async () => {
    const { rows: events } = await db.query("select id from public.activities limit 1");
    await asUser(ids.member, async () => {
      const { rows } = await db.query(`
        insert into public.activity_registrations (activity_id, user_id)
        values ($1, $2) returning id
      `, [events[0].id, ids.member]);
      assert.equal(rows.length, 1);
      await assert.rejects(db.query(`
        insert into public.activity_registrations (activity_id, user_id)
        values ($1, $2)
      `, [events[0].id, ids.core]), /row-level security/);
    });
  });

  await suite.test("reapplying the roster and administrator migrations is safe", async () => {
    await db.exec(await readMigration(migrations.rosterAccess));
    await db.exec(await readMigration(migrations.adminProvisioning));
    assert.equal(await access(ids.core), true);
    assert.equal(await access(ids.member), false);
  });
});
