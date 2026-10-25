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
3. `.private/executive-board-seed.sql`

Commit the first file before running the second because PostgreSQL cannot use newly added enum values until their transaction has committed. The original project migrations must already be applied. The private seed deactivates any earlier allowlist entries outside this roster. Keep roster data private rather than committing the seed to Git.

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

Each new EB member can request their verification email from **Log In → Need to verify your email? Resend verification**, verify the link in their own inbox, and then log in with the prepared password. People registering themselves instead can choose their approved membership type and set their own password on Sign Up. In that case, their prepared password is not used.

To prepare or refresh local credential records without making remote changes:

```powershell
npm run eb:prepare
```

This preserves previously generated passwords. Keep the JSON provisioning state beside the credentials document.

## 4. Verify the result

```powershell
npm run test:security
npm run lint
npm run build
```

The security tests execute the real project migrations and RLS rules in a temporary PostgreSQL database using PGlite. They cover both EB tiers, unknown emails, mismatched tiers, unverified and auto-confirmed accounts, forged profile roles/contact emails/metadata, direct event inserts, roster revocation, inactive members, and ordinary member registration. They use synthetic accounts and make no calls to Supabase.

After setup, log in as a verified core member and as a verified executive member and create a sample event. A regular member should be able to register but should not see event management controls or be able to call event creation directly.

This setup concerns EB access and Auth verification emails. Event registration confirmation emails are not implemented by this change.
