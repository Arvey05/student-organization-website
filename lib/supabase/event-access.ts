import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, UserRole } from "@/types/database";

export function isApprovedExecutiveTier(role: UserRole | null | undefined): boolean {
  return role === "core_executive" || role === "executive";
}

/** The database checks the private roster and verified Auth email on every call. */
export async function getEventCreatorAccess(
  supabase: SupabaseClient<Database>,
  userId: string,
  knownRole?: UserRole | null,
): Promise<boolean> {
  if (knownRole !== undefined) {
    if (!isApprovedExecutiveTier(knownRole)) {
      return false;
    }

    const access = await supabase.rpc("is_event_creator", { user_id: userId });
    return !access.error && access.data === true;
  }

  const [profile, access] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", userId).maybeSingle(),
    supabase.rpc("is_event_creator", { user_id: userId }),
  ]);

  // The explicit tier check also denies legacy officer roles while a deployment
  // still has the old is_event_creator function installed.
  const approvedTier = isApprovedExecutiveTier(profile.data?.role);
  return !profile.error && approvedTier && !access.error && access.data === true;
}
