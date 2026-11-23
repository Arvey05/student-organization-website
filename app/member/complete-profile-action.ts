"use server";

import { revalidatePath } from "next/cache";

import { ensureMemberProfile } from "@/lib/member/ensure-profile";
import {
  isValidBirthdate,
  uploadMemberProfilePicture,
} from "@/lib/member/profile-validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  validateCollegeProgramMajor,
  VALID_YEAR_LEVEL_VALUES,
  VALID_GENDER_VALUES,
} from "@/lib/member/colleges";

function getOptional(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

type CompleteProfileResult = { error?: string } | undefined;

export async function completeProfile(
  formData: FormData,
): Promise<CompleteProfileResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { error: ensureError } = await ensureMemberProfile(supabase, user);
  if (ensureError) {
    return { error: "Profile setup failed. Please try again." };
  }

  // ── Validate college / program / major ──────────────────────────────
  const college = getOptional(formData, "college");
  const program = getOptional(formData, "program");
  const major = getOptional(formData, "major");
  const cpmError = validateCollegeProgramMajor(college, program, major);
  if (cpmError) return { error: cpmError };

  // ── Validate year level ─────────────────────────────────────────────
  const yearLevel = getOptional(formData, "year_level");
  if (yearLevel && !VALID_YEAR_LEVEL_VALUES.has(yearLevel)) {
    return { error: "Invalid year level selected." };
  }

  // ── Validate gender ─────────────────────────────────────────────────
  const gender = getOptional(formData, "gender");
  if (gender && !VALID_GENDER_VALUES.has(gender)) {
    return { error: "Invalid gender selected." };
  }

  // ── Validate birthdate ──────────────────────────────────────────────
  const dateOfBirth = getOptional(formData, "date_of_birth");
  if (dateOfBirth && !isValidBirthdate(dateOfBirth)) {
    return { error: "Please enter a valid birthdate (minimum age: 14)." };
  }

  // ── Profile picture upload ──────────────────────────────────────────
  const rawFile = formData.get("profile_picture");
  const profilePictureFile =
    rawFile instanceof File && rawFile.size > 0 ? rawFile : null;
  const uploadResult = await uploadMemberProfilePicture(
    supabase,
    user.id,
    profilePictureFile,
  );

  if (uploadResult.error === "type") {
    return { error: "Only JPG, PNG, or WebP profile pictures are accepted." };
  }
  if (uploadResult.error === "size" && profilePictureFile) {
    return {
      error: `Image must be 1 MB or less. Your file is ${(profilePictureFile.size / (1024 * 1024)).toFixed(1)} MB.`,
    };
  }
  if (uploadResult.error === "upload") {
    return { error: "Profile picture upload failed. Please try again." };
  }

  const removePicture = formData.get("remove_profile_picture") === "1";

  // ── Update profile and set flag ─────────────────────────────────────
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: getOptional(formData, "first_name"),
      last_name: getOptional(formData, "last_name"),
      college,
      program,
      major,
      year_level: yearLevel,
      gender,
      date_of_birth: dateOfBirth,
      phone: getOptional(formData, "phone"),
      personal_email: getOptional(formData, "personal_email"),
      has_completed_profile: true,
      ...(uploadResult.imageUrl
        ? { profile_picture_url: uploadResult.imageUrl }
        : removePicture
          ? { profile_picture_url: null }
          : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select("id")
    .single();

  if (error) {
    return { error: "Failed to save profile. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return undefined; // success
}
