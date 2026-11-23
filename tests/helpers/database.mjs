import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { PGlite } from "@electric-sql/pglite";

/** A confirmation email sent at CONFIRMATION_SENT_AT and confirmed afterwards. */
export const CONFIRMATION_SENT_AT = "2026-11-18T01:00:00Z";
export const VERIFIED_AT = "2026-11-18T02:00:00Z";

/** Project migrations in the order they are applied to a real database. */
export const migrations = {
  initialSchema: "20260616000000_initial_schema_and_rls.sql",
  eventUpgrades: "20260616090000_phase_9_event_announcement_upgrades.sql",
  profileCompletion: "20261009000000_add_has_completed_profile.sql",
  executiveRoles: "20261025000000_add_executive_roles.sql",
  rosterAccess: "20261025000100_executive_roster_access.sql",
  adminProvisioning: "20261118000000_admin_executive_provisioning.sql",
};

export async function readMigration(name) {
  return readFile(new URL(`../../supabase/migrations/${name}`, import.meta.url), "utf8");
}

export async function applyMigration(db, name) {
  const sql = await readMigration(name);
  // PGlite has core gen_random_uuid(); pgcrypto is a Supabase-provided extension.
  await db.exec(sql.replace("create extension if not exists pgcrypto;", ""));
}

/**
 * Creates an in-memory PostgreSQL with stand-ins for the Supabase-owned parts
 * (roles, auth.users, auth.uid(), storage). The application schema, triggers and
 * policies come from the real migrations, never from re-implemented test logic.
 */
export async function createSupabaseFixtureDatabase() {
  const db = new PGlite();
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users (
      id uuid primary key,
      email text unique,
      raw_user_meta_data jsonb default '{}',
      email_confirmed_at timestamptz,
      confirmation_sent_at timestamptz
    );
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    create function auth.role() returns text language sql stable as $$
      select current_setting('request.jwt.claim.role', true)
    $$;
    grant usage on schema auth to anon, authenticated;
    create schema storage;
    create table storage.buckets (id text primary key, name text, public boolean);
    create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
    alter table storage.objects enable row level security;
    grant usage on schema storage to anon, authenticated;
    grant select, insert, update on storage.objects to authenticated;
    create function storage.foldername(name text) returns text[] language sql immutable as $$
      select string_to_array(name, '/')
    $$;
  `);
  return db;
}

/** Session helpers that behave like a PostgREST request for a given user. */
export function createSessionHelpers(db) {
  async function asUser(id, action, role = "authenticated") {
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id ?? ""]);
    await db.query("select set_config('request.jwt.claim.role', $1, false)", [role]);
    await db.exec(`set role ${role}`);
    try {
      return await action();
    } finally {
      await db.exec("reset role");
      await db.query("select set_config('request.jwt.claim.sub', '', false)");
      await db.query("select set_config('request.jwt.claim.role', '', false)");
    }
  }

  /**
   * Inserts an Auth account. `confirmationSent` false models an auto-confirmed
   * signup that never completed an email-confirmation cycle.
   */
  async function createUser(
    id,
    email,
    { requestedRole, verified = true, confirmationSent = true } = {},
  ) {
    await db.query(
      `
      insert into auth.users (id, email, raw_user_meta_data, email_confirmed_at, confirmation_sent_at)
      values ($1, $2, $3::jsonb, $4::timestamptz, $5::timestamptz)
    `,
      [
        id,
        email,
        JSON.stringify(requestedRole ? { requested_role: requestedRole } : {}),
        verified ? VERIFIED_AT : null,
        confirmationSent ? CONFIRMATION_SENT_AT : null,
      ],
    );
  }

  return { asUser, createUser };
}

/** Asserts that a statement fails with the given SQLSTATE and message pattern. */
export async function assertSqlError(promise, { code, message }) {
  await assert.rejects(promise, (error) => {
    if (code) assert.equal(error.code, code, `Unexpected SQLSTATE: ${error.message}`);
    if (message) assert.match(error.message, message);
    return true;
  });
}
