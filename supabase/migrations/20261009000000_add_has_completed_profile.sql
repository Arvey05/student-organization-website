-- Migration: Add has_completed_profile flag to profiles
-- Apply this in the Supabase SQL editor or via Supabase CLI.
-- 
-- Logic for backfill:
--   Existing users who have filled in their college, program, and first/last name
--   are considered to have a complete profile, so we set the flag to TRUE for them.
--   All others get FALSE so they will be prompted to complete their profile.

alter table public.profiles
  add column if not exists has_completed_profile boolean not null default false;

-- Backfill: mark profiles as complete if they have core fields filled in
update public.profiles
  set has_completed_profile = true
  where
    first_name is not null and first_name <> '' and
    last_name  is not null and last_name  <> '' and
    college    is not null and college    <> '' and
    program    is not null and program    <> '';

-- Also update the type definition (TypeScript types must be manually updated).
-- See types/database.ts: add `has_completed_profile: boolean;` to profiles Row/Insert/Update.
