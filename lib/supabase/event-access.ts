import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/** The database checks the private roster and verified Auth email on every call. */
export async function getEventCreatorAccess(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<boolean> {
  const [profile, access] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", userId).maybeSingle(),
    supabase.rpc("is_event_creator", { user_id: userId }),
  ]);

  // The explicit tier check also denies legacy officer roles while a deployment
  // still has the old is_event_creator function installed.
  const approvedTier = profile.data?.role === "core_executive" ||
    profile.data?.role === "executive";
  return !profile.error && approvedTier && !access.error && access.data === true;
}
