import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";
import nextEnv from "@next/env";

const privateDirectory = resolve(".private");
const rosterPath = resolve(privateDirectory, "executive-board-roster.json");
const accountsPath = resolve(privateDirectory, "executive-board-accounts.json");
const credentialsPath = resolve(privateDirectory, "executive-board-credentials.md");

async function readJsonIfPresent(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function validateRoster(roster) {
  if (!Array.isArray(roster) || roster.length === 0) {
    throw new Error("The private executive roster is missing or empty.");
  }
  const emails = new Set();
  for (const entry of roster) {
    if (
      !entry.full_name || !entry.position ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email) ||
      entry.email !== entry.email.trim().toLowerCase() ||
      !["core_executive", "executive"].includes(entry.role) ||
      emails.has(entry.email)
    ) {
      throw new Error("The roster contains an invalid or duplicated entry.");
    }
    emails.add(entry.email);
  }
}

function markdownCell(value) {
  return String(value ?? "").replaceAll("|", "\\|").replace(/[\r\n]/g, " ");
}

async function saveAccounts(accounts) {
  await mkdir(privateDirectory, { recursive: true });
  await writeFile(accountsPath, JSON.stringify(accounts, null, 2) + "\n", { mode: 0o600 });
  const rows = accounts.map((entry) => [
    entry.full_name,
    entry.position,
    entry.role === "core_executive" ? "Core executive member" : "Executive member",
    entry.email,
    entry.status === "existing_account" ? "Use existing password" : `\`${entry.password}\``,
    entry.status === "created_pending_verification" ? "Created; email verification required" :
      entry.status === "existing_account" ? "Existing account; password unchanged" : "Prepared only; account not created",
  ].map(markdownCell).join(" | "));
  await writeFile(credentialsPath, [
    "# Executive Board account credentials",
    "",
    "Private account setup file. Each new account has its own randomly generated password.",
    "Prepared passwords become usable only after the account is created and its email is verified.",
    "Existing accounts keep their current password. No emails are sent by the provisioning script.",
    "",
    "| Name | Position | Membership type | Login email | Initial password | Status |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row} |`),
    "",
  ].join("\n"), { mode: 0o600 });
}

export async function provisionExecutives({ create = false } = {}) {
  const roster = await readJsonIfPresent(rosterPath);
  validateRoster(roster);
  const previous = await readJsonIfPresent(accountsPath) ?? [];
  const accounts = roster.map((entry) => {
    const saved = previous.find((account) => account.email === entry.email);
    return {
      ...entry,
      password: saved?.password ?? `Msc!${randomBytes(18).toString("base64url")}7a`,
      status: saved?.status ?? "prepared",
      ...(saved?.user_id ? { user_id: saved.user_id } : {}),
    };
  });
  await saveAccounts(accounts);
  if (!create) {
    console.log(`Prepared ${accounts.length} unique account credentials in .private/. No accounts created.`);
    return;
  }

  nextEnv.loadEnvConfig(process.cwd());
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) {
    throw new Error("Configure NEXT_PUBLIC_SUPABASE_URL and the server-only SUPABASE_SERVICE_ROLE_KEY in .env.local before using --create.");
  }
  const supabase = createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Validate the entire allowlist before creating even one account.
  for (const entry of accounts) {
    const { data, error } = await supabase.rpc("executive_signup_is_allowed", {
      signup_email: entry.email,
      requested_role: entry.role,
    });
    if (error || data !== true) {
      throw new Error("The database roster is not ready or differs from the local roster. Apply the migrations and private seed first.");
    }
  }

  const existing = new Map();
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`Unable to inspect existing accounts: ${error.message}`);
    for (const user of data.users) existing.set(user.email?.trim().toLowerCase(), user);
    if (data.users.length < 1000) break;
  }

  for (const entry of accounts) {
    const user = existing.get(entry.email);
    if (user) {
      if (entry.user_id !== user.id) entry.status = "existing_account";
      entry.user_id = user.id;
      await saveAccounts(accounts);
      continue;
    }
    const { data, error } = await supabase.auth.admin.createUser({
      email: entry.email,
      password: entry.password,
      email_confirm: false,
      user_metadata: { full_name: entry.full_name, requested_role: entry.role },
    });
    if (error) throw new Error(`Account provisioning stopped: ${error.message}`);
    entry.user_id = data.user.id;
    entry.status = "created_pending_verification";
    await saveAccounts(accounts);
  }
  console.log("Account setup complete. See .private/executive-board-credentials.md for per-account status. No emails sent.");
}

const argumentsList = process.argv.slice(2);
if (argumentsList.length !== 1 || !["--prepare", "--create"].includes(argumentsList[0])) {
  console.error("Usage: node scripts/provision-executives.mjs --prepare | --create");
  process.exitCode = 1;
} else {
  provisionExecutives({ create: argumentsList[0] === "--create" }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
