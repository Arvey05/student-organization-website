import { randomUUID } from "node:crypto";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const MAX_PROFILE_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isValidUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function isValidBirthdate(dateString: string): boolean {
  const dob = new Date(dateString);
  if (Number.isNaN(dob.getTime())) {
    return false;
  }

  const now = new Date();
  const maxDob = new Date(
    now.getFullYear() - 14,
    now.getMonth(),
    now.getDate(),
  );
  const minDob = new Date(
    now.getFullYear() - 100,
    now.getMonth(),
    now.getDate(),
  );

  return dob <= maxDob && dob >= minDob;
}

export type ProfilePictureUploadResult = {
  imageUrl: string | null;
  error: "type" | "size" | "upload" | null;
};

export async function uploadMemberProfilePicture(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File | null,
): Promise<ProfilePictureUploadResult> {
  if (!file) {
    return { imageUrl: null, error: null };
  }

  const extension = MIME_TO_EXTENSION[file.type];
  if (!extension) {
    return { imageUrl: null, error: "type" };
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    return { imageUrl: null, error: "size" };
  }

  const path = `${userId}/profile-${randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("profile-pictures")
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return { imageUrl: null, error: "upload" };
  }

  const { data } = supabase.storage.from("profile-pictures").getPublicUrl(path);

  return { imageUrl: data.publicUrl, error: null };
}
