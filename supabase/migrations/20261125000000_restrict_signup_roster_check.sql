-- The roster is private: stop anonymous and signed-in callers from probing whether
-- an email is on it. The signup trigger calls this as the function owner, and the
-- provisioning script uses the service role, so neither needs these grants.
revoke execute on function public.executive_signup_is_allowed(text, text) from public, anon, authenticated;
grant execute on function public.executive_signup_is_allowed(text, text) to service_role;
