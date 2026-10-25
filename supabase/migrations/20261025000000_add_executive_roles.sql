-- Apply and commit this migration before the roster migration. PostgreSQL
-- requires newly added enum values to be committed before they can be used.
alter type public.user_role add value if not exists 'core_executive';
alter type public.user_role add value if not exists 'executive';
