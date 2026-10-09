"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  validateCollegeProgramMajor,
  VALID_YEAR_LEVEL_VALUES,
  VALID_GENDER_VALUES,
} from "@/lib/member/colleges";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function getOptional(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function getImageExtension(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && /^[a-z0-9]+$/.test(ext)) return ext;
  return file.type.split("/")[1] ?? "jpg";
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
  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const now = new Date();
    const maxDob = new Date(now.getFullYear() - 14, now.getMonth(), now.getDate());
    const minDob = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    if (isNaN(dob.getTime()) || dob > maxDob || dob < minDob) {
      return { error: "Please enter a valid birthdate (minimum age: 14)." };
    }
  }

  // ── Profile picture upload ──────────────────────────────────────────
  let profilePictureUrl: string | undefined;
  const profilePictureFile = formData.get("profile_picture");
  if (profilePictureFile instanceof File && profilePictureFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.has(profilePictureFile.type)) {
      return { error: "Only JPG, PNG, or WebP profile pictures are accepted." };
    }
    if (profilePictureFile.size > MAX_IMAGE_SIZE) {
      return {
        error: `Image must be 1 MB or less. Your file is ${(profilePictureFile.size / (1024 * 1024)).toFixed(1)} MB.`,
      };
    }
    const ext = getImageExtension(profilePictureFile);
    const path = `${user.id}/profile-${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(path, profilePictureFile, {
        cacheControl: "3600",
        contentType: profilePictureFile.type,
        upsert: false,
      });
    if (uploadError) {
      return { error: "Profile picture upload failed. Please try again." };
    }
    const { data: publicData } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(path);
    profilePictureUrl = publicData.publicUrl;
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
      ...(profilePictureUrl
        ? { profile_picture_url: profilePictureUrl }
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
