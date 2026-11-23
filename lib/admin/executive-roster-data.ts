import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ExecutiveRosterRow,
  ProvisioningActivityRow,
} from "@/lib/admin/executive-roster";
import type { Database } from "@/types/database";

type Supabase = SupabaseClient<Database>;

/**
 * Reads go through administrator-only database functions because the roster is
 * private: no table grant exists for any application role. These helpers must
 * only be called after requireSiteAdmin().
 */
export async function listExecutiveRoster(
  supabase: Supabase,
): Promise<ExecutiveRosterRow[]> {
  const { data, error } = await supabase.rpc("admin_list_executives");

  if (error) {
    throw new Error(`Unable to load the executive roster: ${error.message}`);
  }

  return data ?? [];
}

export async function listProvisioningActivity(
  supabase: Supabase,
  limit = 20,
): Promise<ProvisioningActivityRow[]> {
  const { data, error } = await supabase.rpc(
    "admin_list_provisioning_activity",
    { p_limit: limit },
  );

  if (error) {
    throw new Error(`Unable to load provisioning activity: ${error.message}`);
  }

  return data ?? [];
}
