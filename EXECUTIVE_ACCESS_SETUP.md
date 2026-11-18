# Executive Board access setup

The approved roster has **33 accounts: 4 core executive members and 29 executive members**. Core positions are President, Vice President for Internal Affairs, Vice President for External Affairs, and Executive Secretary. All other positions in the supplied workbook are executive members. Login addresses come from its **Email Address** column, including the three rows whose personal contact email differs.

This replaces the earlier President/VPIA/VPEA-only event permission. Both approved EB tiers can create and manage events. Regular members can view and register for events. A sign-up choice alone never grants executive access.

## Prepared private files

These files are local and excluded from Git. Keep them outside the public website and deployment assets:

- `.private/executive-board-roster.json`: only names, login emails, positions, and assigned EB tiers.
- `.private/executive-board-seed.sql`: the complete approved database roster.
- `.private/executive-board-credentials.md`: all 33 email/password pairs and account statuses.
- `.private/executive-board-accounts.json`: resumable account provisioning state and prepared passwords.

No birthdays, home addresses, school IDs, phone numbers, pictures, signatures, or documents are imported. Passwords are unique and randomly generated. **Prepared credentials are not live accounts.** Existing accounts retain their current passwords when provisioning runs.

## 1. Apply database changes

In the project's Supabase SQL Editor, run each of these files **separately and in order**:

1. `supabase/migrations/20261025000000_add_executive_roles.sql`
2. `supabase/migrations/20261025000100_executive_roster_access.sql`
3. `supabase/migrations/20261118000000_admin_executive_provisioning.sql`
4. `.private/executive-board-seed.sql` (optional; see the next section)

Commit the first file before running the second because PostgreSQL cannot use newly added enum values until their transaction has committed. The original project migrations must already be applied. The private seed deactivates any earlier allowlist entries outside this roster. Keep roster data private rather than committing the seed to Git.

## Administrators and the provisioning page

Executive Board access is no longer requested at registration. The Sign Up form has no membership type: everyone registers as a regular member. An administrator approves a person on the roster instead, and their role and event permissions activate automatically once they verify their login email.

Administrators are a separate allowlist (`private.site_administrators`), deliberately not derived from the Executive Board roster, so being an executive never grants the power to approve more executives. Add the first administrator once, from the SQL Editor, with a real address (never commit real addresses):

```sql
insert into private.site_administrators (email, note)
values ('maintainer@example.com', 'Website maintainer')
on conflict (email) do update set active = true;
```

An administrator must verify that email and have an active member profile. Administrators see an **Admin** link in the member navigation. **Admin → Executive provisioning** (`/admin/executives`) lets them:

- add a core executive or executive member (name, login email, position, tier) before or after the person signs up;
- change a member's name, position, or tier;
- deactivate or reactivate access, which takes effect immediately, including for open sessions;
- remove an entry that was added by mistake.

The **Admin dashboard** (`/admin`) shows roster counts and recent changes. Every change is recorded in a private audit table (`private.executive_provisioning_audit`) with who made it. This table is separate from `event_logs`, which every event creator can read.

The web application never holds a service role key for this: the roster tables have no grants for any application role, and administrators reach them only through `admin_*` database functions that verify the caller. Administrators themselves are managed only through SQL.

The private seed above remains a convenient way to import the initial 33-person roster in one step, but the page can do the same one entry at a time.

The database grants event access only when the authenticated account has an active roster entry, an active profile, and a completed email verification cycle. Legacy manually assigned officer roles and edited personal contact emails do not grant access. Removing or deactivating an approval revokes event access for existing sessions as well.

## 2. Configure email verification

In Supabase Auth, enable email confirmations. Set the site URL and allow `/email-confirmed` as a redirect at your actual site origin. For this preview, use `http://127.0.0.1:3000` and allow `http://127.0.0.1:3000/email-confirmed`. Set `NEXT_PUBLIC_SITE_URL` to that origin locally, and to the deployment origin in Vercel.

Executive access deliberately rejects auto-confirmed accounts that have not completed an email confirmation cycle. If an existing approved account was previously auto-confirmed, an administrator must require fresh email verification before it receives EB access. Do not bypass the database verification check.

## 3. Create the prepared accounts

Add the following server-only value to the ignored `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Keep the existing `NEXT_PUBLIC_SUPABASE_URL` and publishable key configuration. Do not prefix the service role key with `NEXT_PUBLIC_`, put it in frontend code, or paste it into chat. No database connection string is needed for the SQL Editor workflow above.

From the project directory, run:

```powershell
npm run eb:create
```

The script verifies that all 33 local entries match the database allowlist before creating any account. It creates missing Auth accounts with the prepared passwords and email confirmation pending. It never resets an existing account's password, grants a role through editable user metadata, auto-confirms an email, or sends email. It writes per-account results to the private credentials file after each account, so interrupted runs can be resumed.

Each new EB member can request their verification email from **Log In → Need to verify your email? Resend verification**, verify the link in their own inbox, and then log in with the prepared password. People may instead register themselves on Sign Up with their roster email and set their own password. There is no membership type to choose; once they verify that email, the roster grants their tier automatically. In that case, their prepared password is not used.

To prepare or refresh local credential records without making remote changes:

```powershell
npm run eb:prepare
```

This preserves previously generated passwords. Keep the JSON provisioning state beside the credentials document.

## 4. Verify the result

```powershell
npm test
npm run lint
npm run build
```

`npm test` runs the unit tests for the roster rules (`tests/unit`, Node 22.18 or newer) and the security tests (`npm run test:security`). The security tests execute the real project migrations and RLS rules in a temporary PostgreSQL database using PGlite. They cover both EB tiers, unknown emails, mismatched tiers, unverified and auto-confirmed accounts, forged profile roles/contact emails/metadata, direct event inserts, roster revocation, inactive members, ordinary member registration, and the administrator provisioning functions: who counts as an administrator, rejection of everyone else (including core executives and anonymous callers), input validation, duplicates, promotion and revocation, and the audit trail. They use synthetic accounts and make no calls to Supabase.

After setup, log in as a verified core member and as a verified executive member and create a sample event. A regular member should be able to register but should not see event management controls or be able to call event creation directly.

This setup concerns EB access and Auth verification emails. Event registration confirmation emails are not implemented by this change.
