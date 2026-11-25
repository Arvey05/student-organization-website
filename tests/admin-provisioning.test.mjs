import assert from "node:assert/strict";
import test from "node:test";

import {
  VERIFIED_AT,
  applyMigration,
  assertSqlError,
  createSessionHelpers,
  createSupabaseFixtureDatabase,
  migrations,
  readMigration,
} from "./helpers/database.mjs";

const ids = {
  admin: "00000000-0000-0000-0000-0000000000a1",
  unverifiedAdmin: "00000000-0000-0000-0000-0000000000a2",
  autoconfirmedAdmin: "00000000-0000-0000-0000-0000000000a3",
  inactiveAdmin: "00000000-0000-0000-0000-0000000000a4",
  deactivatedAdmin: "00000000-0000-0000-0000-0000000000a5",
  member: "00000000-0000-0000-0000-0000000000b1",
  coreExecutive: "00000000-0000-0000-0000-0000000000b2",
  promoted: "00000000-0000-0000-0000-0000000000b3",
  newcomer: "00000000-0000-0000-0000-0000000000b4",
};

const notAdministrators = [
  ["a regular member", ids.member],
  ["a core executive", ids.coreExecutive],
  ["an administrator with an unverified email", ids.unverifiedAdmin],
  ["an administrator whose email was auto-confirmed", ids.autoconfirmedAdmin],
  ["an administrator with an inactive profile", ids.inactiveAdmin],
  ["a deactivated administrator", ids.deactivatedAdmin],
];

test("administrators provision Executive Board access through audited database functions", async (suite) => {
  const db = await createSupabaseFixtureDatabase();
  suite.after(() => db.close());
  const { asUser, createUser } = createSessionHelpers(db);

  for (const name of Object.values(migrations)) {
    await applyMigration(db, name);
  }

  const call = (userId, sql, params = [], role = "authenticated") =>
    asUser(userId, () => db.query(sql, params), role);
  const addExecutive = (actor, email, fullName, position, role) =>
    call(actor, "select public.admin_add_executive($1, $2, $3, $4)", [email, fullName, position, role]);
  const updateExecutive = (actor, email, fullName, position, role) =>
    call(actor, "select public.admin_update_executive($1, $2, $3, $4)", [email, fullName, position, role]);
  const setActive = (actor, email, active) =>
    call(actor, "select public.admin_set_executive_active($1, $2)", [email, active]);
  const removeExecutive = (actor, email) =>
    call(actor, "select public.admin_remove_executive($1)", [email]);
  const listRoster = async (actor = ids.admin) =>
    (await call(actor, "select * from public.admin_list_executives()")).rows;
  const rosterEntry = async (email, actor = ids.admin) =>
    (await listRoster(actor)).find((entry) => entry.email === email);
  const activity = async (limit = 100) =>
    (await call(ids.admin, "select * from public.admin_list_provisioning_activity($1)", [limit])).rows;

  async function profileRole(id) {
    const { rows } = await db.query("select role from public.profiles where id = $1", [id]);
    return rows[0].role;
  }

  async function canCreateEvents(id) {
    const { rows } = await call(id, "select public.is_event_creator($1) as allowed", [id]);
    return rows[0].allowed;
  }

  async function insertEvent(id) {
    return call(id, `
      insert into public.activities (name, starts_at, short_description, location, created_by)
      values ('Provisioning test event', now() + interval '1 day', 'Local test only', 'Test room', $1)
      returning id
    `, [id]);
  }

  await createUser(ids.admin, "admin@example.test");
  await createUser(ids.unverifiedAdmin, "unverified-admin@example.test", { verified: false });
  await createUser(ids.autoconfirmedAdmin, "auto-admin@example.test", { confirmationSent: false });
  await createUser(ids.inactiveAdmin, "inactive-admin@example.test");
  await createUser(ids.deactivatedAdmin, "deactivated-admin@example.test");
  await createUser(ids.member, "member@example.test");
  await createUser(ids.coreExecutive, "core@example.test");
  await createUser(ids.promoted, "promoted@example.test");

  await db.exec(`
    insert into private.approved_executives (email, full_name, position, role)
      values ('core@example.test', 'Core Test', 'President', 'core_executive');
    insert into private.site_administrators (email, note, active) values
      ('admin@example.test', 'Maintainer', true),
      ('unverified-admin@example.test', null, true),
      ('auto-admin@example.test', null, true),
      ('inactive-admin@example.test', null, true),
      ('deactivated-admin@example.test', null, false);
    update public.profiles set member_status = 'inactive'
      where id = '${ids.inactiveAdmin}';
    update public.profiles set first_name = 'Ada', last_name = 'Admin'
      where id = '${ids.admin}';
  `);

  await suite.test("only verified, active, listed administrators are site administrators", async () => {
    const { rows } = await call(ids.admin, "select public.is_site_admin() as allowed");
    assert.equal(rows[0].allowed, true);

    for (const [, id] of notAdministrators) {
      const { rows: denied } = await call(id, "select public.is_site_admin() as allowed");
      assert.equal(denied[0].allowed, false);
    }
    await assertSqlError(call(null, "select public.is_site_admin()", [], "anon"), {
      code: "42501",
      message: /permission denied/,
    });
  });

  await suite.test("every administrator function rejects everyone else", async () => {
    const attempts = [
      "select * from public.admin_list_executives()",
      "select public.admin_add_executive('intruder@example.test', 'Intruder', 'Director', 'executive')",
      "select public.admin_update_executive('core@example.test', 'Core Test', 'President', 'executive')",
      "select public.admin_set_executive_active('core@example.test', false)",
      "select public.admin_remove_executive('core@example.test')",
      "select * from public.admin_list_provisioning_activity(10)",
    ];

    for (const [description, id] of notAdministrators) {
      for (const sql of attempts) {
        await assertSqlError(call(id, sql), {
          code: "42501",
          message: /Administrator access is required/,
        });
      }
      assert.ok(description);
    }
    for (const sql of attempts) {
      await assertSqlError(asUser(null, () => db.query(sql), "anon"), {
        code: "42501",
        message: /permission denied/,
      });
    }

    const { rows } = await db.query("select email, role, active from private.approved_executives order by email");
    assert.deepEqual(rows, [{ email: "core@example.test", role: "core_executive", active: true }]);
  });

  await suite.test("administrators reach the private tables only through the functions", async () => {
    for (const table of [
      "private.approved_executives",
      "private.site_administrators",
      "private.executive_provisioning_audit",
    ]) {
      await assertSqlError(call(ids.admin, `select * from ${table}`), {
        code: "42501",
        message: /permission denied/,
      });
    }
    await assertSqlError(
      call(ids.admin, "insert into private.site_administrators (email) values ('self@example.test')"),
      { code: "42501", message: /permission denied/ },
    );
  });

  await suite.test("a person provisioned before sign-up gets access only after verifying their email", async () => {
    await addExecutive(ids.admin, "  Newcomer@Example.Test ", "  Nia   Newcomer ", " Executive   Secretary ", "core_executive");

    const { rows } = await db.query(
      "select email, full_name, position, role, active, updated_by from private.approved_executives where email = 'newcomer@example.test'",
    );
    assert.deepEqual(rows, [{
      email: "newcomer@example.test",
      full_name: "Nia Newcomer",
      position: "Executive Secretary",
      role: "core_executive",
      active: true,
      updated_by: ids.admin,
    }]);

    let entry = await rosterEntry("newcomer@example.test");
    assert.equal(entry.account_status, "no_account");
    assert.equal(entry.has_access, false);

    // Registration no longer carries a membership type, so the account starts as
    // an ordinary unverified member even though the email is on the roster.
    await createUser(ids.newcomer, "newcomer@example.test", { verified: false });
    assert.equal(await profileRole(ids.newcomer), "member");
    assert.equal(await canCreateEvents(ids.newcomer), false);
    entry = await rosterEntry("newcomer@example.test");
    assert.equal(entry.account_status, "awaiting_verification");
    assert.equal(entry.has_access, false);
    await assert.rejects(insertEvent(ids.newcomer), /row-level security/);

    await db.query("update auth.users set email_confirmed_at = $2 where id = $1", [ids.newcomer, VERIFIED_AT]);
    assert.equal(await profileRole(ids.newcomer), "core_executive");
    assert.equal(await canCreateEvents(ids.newcomer), true);
    assert.equal((await insertEvent(ids.newcomer)).rows.length, 1);
    entry = await rosterEntry("newcomer@example.test");
    assert.equal(entry.account_status, "verified");
    assert.equal(entry.has_access, true);
  });

  await suite.test("provisioning an existing member promotes them, and deactivation revokes access at once", async () => {
    assert.equal(await profileRole(ids.promoted), "member");
    await addExecutive(ids.admin, "promoted@example.test", "Pia Promoted", "Committee Head", "executive");
    assert.equal(await profileRole(ids.promoted), "executive");
    assert.equal(await canCreateEvents(ids.promoted), true);

    await setActive(ids.admin, "promoted@example.test", false);
    assert.equal(await profileRole(ids.promoted), "member");
    assert.equal(await canCreateEvents(ids.promoted), false);
    await assert.rejects(insertEvent(ids.promoted), /row-level security/);
    const deactivated = await rosterEntry("promoted@example.test");
    assert.equal(deactivated.active, false);
    assert.equal(deactivated.has_access, false);
    assert.equal(deactivated.account_status, "verified");

    await setActive(ids.admin, "promoted@example.test", true);
    assert.equal(await profileRole(ids.promoted), "executive");
    assert.equal(await canCreateEvents(ids.promoted), true);
  });

  await suite.test("changing a tier updates the member's role, and an unchanged update is not logged", async () => {
    await updateExecutive(ids.admin, "newcomer@example.test", "Nia Newcomer", "Director for Events", "executive");
    assert.equal(await profileRole(ids.newcomer), "executive");
    const entry = await rosterEntry("newcomer@example.test");
    assert.equal(entry.position, "Director for Events");
    assert.equal(entry.role, "executive");

    const before = (await activity()).length;
    await updateExecutive(ids.admin, "NEWCOMER@example.test", "Nia  Newcomer", "Director for Events", "executive");
    assert.equal((await activity()).length, before);

    const [latest] = await activity();
    assert.equal(latest.action, "updated");
    assert.deepEqual(latest.details, {
      from: { role: "core_executive", position: "Executive Secretary", full_name: "Nia Newcomer" },
      to: { role: "executive", position: "Director for Events", full_name: "Nia Newcomer" },
    });
  });

  await suite.test("invalid roster entries are rejected with a clear message", async () => {
    const valid = { email: "valid@example.test", name: "Valid Person", position: "Director", role: "executive" };
    const cases = [
      ["an empty email", { email: "" }, /valid login email/],
      ["an email without a domain", { email: "nobody" }, /valid login email/],
      ["an email without a top-level domain", { email: "nobody@example" }, /valid login email/],
      ["an email containing spaces", { email: "two words@example.test" }, /valid login email/],
      ["an over-long email", { email: `${"a".repeat(250)}@example.test` }, /valid login email/],
      ["an empty name", { name: "   " }, /full name/],
      ["an over-long name", { name: "N".repeat(121) }, /full name/],
      ["an empty position", { position: " " }, /position/],
      ["an over-long position", { position: "P".repeat(121) }, /position/],
      ["the member role", { role: "member" }, /core executive or executive/],
      ["a legacy officer role", { role: "president" }, /core executive or executive/],
      ["a missing role", { role: null }, /core executive or executive/],
    ];

    for (const [description, override, message] of cases) {
      const input = { ...valid, ...override };
      await assertSqlError(
        addExecutive(ids.admin, input.email, input.name, input.position, input.role),
        { code: "22023", message },
      );
      assert.ok(description);
    }
    await assertSqlError(setActive(ids.admin, "valid@example.test", null), { code: "22023" });
    assert.equal(await rosterEntry("valid@example.test"), undefined);
  });

  await suite.test("duplicate emails and unknown entries are reported, not silently changed", async () => {
    await assertSqlError(
      addExecutive(ids.admin, " NEWCOMER@example.test", "Someone Else", "Intern", "executive"),
      { code: "23505", message: /already on the roster/ },
    );
    const entry = await rosterEntry("newcomer@example.test");
    assert.equal(entry.full_name, "Nia Newcomer");

    const missing = { code: "P0002", message: /not on the roster/ };
    await assertSqlError(updateExecutive(ids.admin, "ghost@example.test", "Ghost", "Director", "executive"), missing);
    await assertSqlError(setActive(ids.admin, "ghost@example.test", false), missing);
    await assertSqlError(removeExecutive(ids.admin, "ghost@example.test"), missing);
  });

  await suite.test("removing an entry deletes it and revokes access", async () => {
    await removeExecutive(ids.admin, "newcomer@example.test");
    assert.equal(await profileRole(ids.newcomer), "member");
    assert.equal(await canCreateEvents(ids.newcomer), false);
    assert.equal(await rosterEntry("newcomer@example.test"), undefined);
    const { rows } = await db.query("select 1 from private.approved_executives where email = 'newcomer@example.test'");
    assert.equal(rows.length, 0);
  });

  await suite.test("the audit trail records each change with its actor, newest first", async () => {
    const rows = await activity();
    assert.deepEqual(
      rows.map((row) => [row.action, row.target_email]),
      [
        ["removed", "newcomer@example.test"],
        ["updated", "newcomer@example.test"],
        ["activated", "promoted@example.test"],
        ["deactivated", "promoted@example.test"],
        ["added", "promoted@example.test"],
        ["added", "newcomer@example.test"],
      ],
    );
    for (const row of rows) {
      assert.equal(row.actor_email, "admin@example.test");
      assert.equal(row.actor_name, "Ada Admin");
    }
    assert.deepEqual(rows.at(-1).details, {
      role: "core_executive",
      position: "Executive Secretary",
      full_name: "Nia Newcomer",
    });

    assert.equal((await activity(2)).length, 2);
    assert.equal((await activity(0)).length, 1, "limits below one are raised to one");
    const { rows: defaults } = await call(ids.admin, "select * from public.admin_list_provisioning_activity()");
    assert.equal(defaults.length, rows.length);
  });

  await suite.test("the roster lists active core entries first, then active executives, then inactive entries", async () => {
    await addExecutive(ids.admin, "b-exec@example.test", "Bea Executive", "Director", "executive");
    await addExecutive(ids.admin, "a-core@example.test", "Cal Core", "Vice President", "core_executive");
    await addExecutive(ids.admin, "c-core@example.test", "Abe Core", "President", "core_executive");
    await setActive(ids.admin, "a-core@example.test", false);

    const order = (await listRoster())
      .map((entry) => entry.email)
      .filter((email) => ["a-core", "b-exec", "c-core"].some((name) => email.startsWith(name)));
    assert.deepEqual(order, ["c-core@example.test", "b-exec@example.test", "a-core@example.test"]);
  });

  await suite.test("the roster membership check is not callable by anonymous or signed-in users", async () => {
    for (const [id, role] of [[null, "anon"], [ids.member, "authenticated"]]) {
      await assertSqlError(
        call(id, "select public.executive_signup_is_allowed('core@example.test', 'core_executive')", [], role),
        { code: "42501", message: /permission denied/ },
      );
    }
  });

  await suite.test("reapplying the migration keeps roster data and administrator access", async () => {
    const before = await listRoster();
    await db.exec(await readMigration(migrations.adminProvisioning));
    assert.deepEqual(await listRoster(), before);
    assert.equal((await call(ids.admin, "select public.is_site_admin() as allowed")).rows[0].allowed, true);
  });
});
