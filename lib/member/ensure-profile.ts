import type { AuthUser, SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Supabase = SupabaseClient<Database>;

type EnsureProfileOptions = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  college?: string | null;
  program?: string | null;
  major?: string | null;
  yearLevel?: string | null;
  gender?: string | null;
};

function getMetadataString(user: AuthUser, key: string): string | null {
  const value = user.user_metadata[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function ensureMemberProfile(
  supabase: Supabase,
  user: AuthUser,
  options: EnsureProfileOptions = {},
) {
  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    return { error: selectError };
  }

  if (existingProfile) {
    return { error: null };
  }

  const firstName = options.firstName ?? getMetadataString(user, "first_name");
  const lastName = options.lastName ?? getMetadataString(user, "last_name");
  const email = options.email ?? user.email ?? null;
  const college = options.college ?? getMetadataString(user, "college");
  const program = options.program ?? getMetadataString(user, "program");
  const major = options.major ?? getMetadataString(user, "major");
  const yearLevel = options.yearLevel ?? getMetadataString(user, "year_level");
  const gender = options.gender ?? getMetadataString(user, "gender");

  // A profile is complete if core academic info is provided
  const hasCompletedProfile = Boolean(
    firstName && lastName && college && program,
  );

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    first_name: firstName,
    last_name: lastName,
    personal_email: email,
    college: college ?? null,
    program: program ?? null,
    major: major ?? null,
    year_level: yearLevel ?? null,
    gender: gender ?? null,
    role: "member",
    member_status: "active",
    has_completed_profile: hasCompletedProfile,
  });

  return { error };
}
