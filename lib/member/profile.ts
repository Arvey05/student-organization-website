import type { AuthUser } from "@supabase/supabase-js";

import { ensureMemberProfile } from "@/lib/member/ensure-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type MemberProfile = {
  user: AuthUser;
  profile: ProfileRow | null;
  displayName: string;
  email: string;
};

export async function getCurrentMemberProfile(): Promise<MemberProfile> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Authenticated user is required.");
  }

  const {
    data: initialProfile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Unable to load member profile: ${profileError.message}`);
  }

  let profile = initialProfile;

  if (!profile) {
    const { error: ensureError } = await ensureMemberProfile(supabase, user);

    if (ensureError) {
      throw new Error(`Unable to create member profile: ${ensureError.message}`);
    }

    const retry = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (retry.error) {
      throw new Error(`Unable to reload member profile: ${retry.error.message}`);
    }

    profile = retry.data;
  }

  const firstName =
    profile?.first_name ??
    (typeof user.user_metadata.first_name === "string"
      ? user.user_metadata.first_name
      : "");
  const lastName =
    profile?.last_name ??
    (typeof user.user_metadata.last_name === "string"
      ? user.user_metadata.last_name
      : "");
  const displayName =
    [firstName, lastName].filter(Boolean).join(" ") || user.email || "Member";

  return {
    user,
    profile,
    displayName,
    email: user.email ?? profile?.personal_email ?? "No email on file",
  };
}
