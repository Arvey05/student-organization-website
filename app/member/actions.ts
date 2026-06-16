"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ensureMemberProfile } from "@/lib/member/ensure-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canCreateEvents } from "@/lib/supabase/roles";

function getOptionalString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error: ensureError } = await ensureMemberProfile(supabase, user);

  if (ensureError) {
    redirect("/profile/edit?error=profile_setup_failed");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      msc_id_code: getOptionalString(formData, "msc_id_code"),
      school_id_code: getOptionalString(formData, "school_id_code"),
      last_name: getOptionalString(formData, "last_name"),
      first_name: getOptionalString(formData, "first_name"),
      middle_name: getOptionalString(formData, "middle_name"),
      extension: getOptionalString(formData, "extension"),
      college: getOptionalString(formData, "college"),
      program: getOptionalString(formData, "program"),
      major: getOptionalString(formData, "major"),
      year_level: getOptionalString(formData, "year_level"),
      section: getOptionalString(formData, "section"),
      phone: getOptionalString(formData, "phone"),
      personal_email: getOptionalString(formData, "personal_email"),
      bulsu_email: getOptionalString(formData, "bulsu_email"),
      social_media_url: getOptionalString(formData, "social_media_url"),
      address: getOptionalString(formData, "address"),
      date_of_birth: getOptionalString(formData, "date_of_birth"),
      gender: getOptionalString(formData, "gender"),
      guardian_name: getOptionalString(formData, "guardian_name"),
      guardian_relationship: getOptionalString(
        formData,
        "guardian_relationship",
      ),
      guardian_phone: getOptionalString(formData, "guardian_phone"),
      guardian_address: getOptionalString(formData, "guardian_address"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select("id")
    .single();

  if (error) {
    redirect("/profile/edit?error=update_failed");
  }

  revalidatePath("/profile");
  redirect("/profile");
}

export async function changePassword(formData: FormData) {
  const oldPassword = getOptionalString(formData, "old_password");
  const password = getOptionalString(formData, "new_password");
  const confirmPassword = getOptionalString(formData, "confirm_password");

  if (!oldPassword || !password || password !== confirmPassword) {
    redirect("/settings/password?error=password_mismatch");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/settings/password?error=update_failed");
  }

  redirect("/settings?password=updated");
}

export async function createOfficerEvent(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!canCreateEvents(profile?.role)) {
    redirect("/dashboard?error=officer_required");
  }

  const name = getOptionalString(formData, "name");
  const startsAt = getOptionalString(formData, "starts_at");
  const shortDescription = getOptionalString(formData, "short_description");
  const location = getOptionalString(formData, "location");

  if (!name || !startsAt || !shortDescription || !location) {
    redirect("/officer/events/new?error=missing_fields");
  }

  const { error } = await supabase.from("activities").insert({
    name,
    starts_at: startsAt,
    short_description: shortDescription,
    location,
    status: "upcoming",
    is_public: true,
    created_by: user.id,
  });

  if (error) {
    redirect("/officer/events/new?error=create_failed");
  }

  revalidatePath("/activities");
  revalidatePath("/member/activities");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  redirect("/dashboard?event=created");
}
