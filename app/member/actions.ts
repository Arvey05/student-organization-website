"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ensureMemberProfile } from "@/lib/member/ensure-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canCreateEvents } from "@/lib/supabase/roles";

const MAX_PUBLIC_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function getOptionalString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function isInvalidTimeFrame(startsAt: string, endsAt: string | null): boolean {
  return Boolean(endsAt && new Date(endsAt) < new Date(startsAt));
}

function getOptionalFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function getImageExtension(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && /^[a-z0-9]+$/.test(extension)) {
    return extension;
  }

  return file.type.split("/")[1] ?? "jpg";
}

async function uploadPublicImage(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  bucket: "activity-images" | "announcement-images",
  userId: string,
  folder: string,
  file: File | null,
): Promise<{ imageUrl: string | null; error: "type" | "size" | "upload" | null }> {
  if (!file) {
    return { imageUrl: null, error: null };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { imageUrl: null, error: "type" };
  }

  if (file.size > MAX_PUBLIC_IMAGE_SIZE) {
    return { imageUrl: null, error: "size" };
  }

  const extension = getImageExtension(file);
  const path = `${userId}/${folder}/${randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return { imageUrl: null, error: "upload" };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return { imageUrl: data.publicUrl, error: null };
}

async function uploadProfilePicture(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  file: File | null,
): Promise<{ imageUrl: string | null; error: "type" | "size" | "upload" | null }> {
  if (!file) {
    return { imageUrl: null, error: null };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { imageUrl: null, error: "type" };
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    return { imageUrl: null, error: "size" };
  }

  const extension = getImageExtension(file);
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

async function uploadEventCover(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  file: File | null,
) {
  return uploadPublicImage(supabase, "activity-images", userId, "events", file);
}

async function uploadAnnouncementImage(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  file: File | null,
) {
  return uploadPublicImage(
    supabase,
    "announcement-images",
    userId,
    "announcements",
    file,
  );
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

  const profilePictureFile = getOptionalFile(formData, "profile_picture");
  const profilePictureUpload = await uploadProfilePicture(
    supabase,
    user.id,
    profilePictureFile,
  );

  if (profilePictureUpload.error) {
    redirect(`/profile/edit?error=profile_picture_${profilePictureUpload.error}`);
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
      ...(profilePictureUpload.imageUrl
        ? { profile_picture_url: profilePictureUpload.imageUrl }
        : {}),
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
  const endsAt = getOptionalString(formData, "ends_at");
  const shortDescription = getOptionalString(formData, "short_description");
  const location = getOptionalString(formData, "location");
  const coverFile = getOptionalFile(formData, "cover_image");

  if (!name || !startsAt || !shortDescription || !location) {
    redirect("/officer/events/new?error=missing_fields");
  }

  if (isInvalidTimeFrame(startsAt, endsAt)) {
    redirect("/officer/events/new?error=invalid_time_frame");
  }

  const upload = await uploadEventCover(supabase, user.id, coverFile);

  if (upload.error) {
    redirect(`/officer/events/new?error=cover_${upload.error}`);
  }

  const { error } = await supabase.from("activities").insert({
    name,
    starts_at: startsAt,
    ends_at: endsAt,
    short_description: shortDescription,
    location,
    image_url: upload.imageUrl,
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

export async function registerForActivity(formData: FormData) {
  const activityId = getOptionalString(formData, "activity_id");

  if (!activityId) {
    redirect("/member/activities");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("activity_registrations").upsert(
    {
      activity_id: activityId,
      user_id: user.id,
      status: "registered",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "activity_id,user_id" },
  );

  if (error) {
    redirect(`/member/activities/${activityId}?error=registration_failed`);
  }

  revalidatePath(`/member/activities/${activityId}`);
  revalidatePath("/member/activities");
  revalidatePath("/my-activities");
  revalidatePath("/dashboard");
  redirect(`/member/activities/${activityId}`);
}

export async function cancelActivityRegistration(formData: FormData) {
  const activityId = getOptionalString(formData, "activity_id");

  if (!activityId) {
    redirect("/member/activities");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("activity_registrations")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("activity_id", activityId)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error) {
    redirect(`/member/activities/${activityId}?error=cancellation_failed`);
  }

  revalidatePath(`/member/activities/${activityId}`);
  revalidatePath("/member/activities");
  revalidatePath("/my-activities");
  revalidatePath("/dashboard");
  redirect(`/member/activities/${activityId}`);
}

export async function updateOfficerEvent(formData: FormData) {
  const activityId = getOptionalString(formData, "activity_id");

  if (!activityId) {
    redirect("/member/activities");
  }

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
  const endsAt = getOptionalString(formData, "ends_at");
  const shortDescription = getOptionalString(formData, "short_description");
  const location = getOptionalString(formData, "location");
  const status = getOptionalString(formData, "status");
  const coverFile = getOptionalFile(formData, "cover_image");

  if (!name || !startsAt || !shortDescription || !location) {
    redirect(`/officer/events/${activityId}/edit?error=missing_fields`);
  }

  if (isInvalidTimeFrame(startsAt, endsAt)) {
    redirect(`/officer/events/${activityId}/edit?error=invalid_time_frame`);
  }

  if (status !== "upcoming" && status !== "completed" && status !== "past") {
    redirect(`/officer/events/${activityId}/edit?error=invalid_status`);
  }

  const upload = await uploadEventCover(supabase, user.id, coverFile);

  if (upload.error) {
    redirect(`/officer/events/${activityId}/edit?error=cover_${upload.error}`);
  }

  const { error } = await supabase
    .from("activities")
    .update({
      name,
      starts_at: startsAt,
      ends_at: endsAt,
      short_description: shortDescription,
      location,
      status,
      ...(upload.imageUrl ? { image_url: upload.imageUrl } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", activityId)
    .select("id")
    .single();

  if (error) {
    redirect(`/officer/events/${activityId}/edit?error=update_failed`);
  }

  revalidatePath(`/member/activities/${activityId}`);
  revalidatePath("/activities");
  revalidatePath("/member/activities");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  redirect(`/member/activities/${activityId}`);
}

export async function archiveOfficerEvent(formData: FormData) {
  const activityId = getOptionalString(formData, "activity_id");

  if (!activityId) {
    redirect("/member/activities");
  }

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

  const { error } = await supabase
    .from("activities")
    .update({
      archived_at: new Date().toISOString(),
      archived_by: user.id,
      archive_reason: "Officer deleted event",
      updated_at: new Date().toISOString(),
    })
    .eq("id", activityId)
    .is("archived_at", null)
    .select("id")
    .single();

  if (error) {
    redirect(`/member/activities/${activityId}?error=delete_failed`);
  }

  revalidatePath(`/member/activities/${activityId}`);
  revalidatePath("/activities");
  revalidatePath("/member/activities");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  revalidatePath("/my-activities");
  redirect("/member/activities?event=deleted");
}

export async function createOfficerAnnouncement(formData: FormData) {
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

  const title = getOptionalString(formData, "title");
  const content = getOptionalString(formData, "content");
  const startsAt = getOptionalString(formData, "starts_at");
  const endsAt = getOptionalString(formData, "ends_at");
  const location = getOptionalString(formData, "location");
  const imageFile = getOptionalFile(formData, "image");
  const isPublic = formData.get("is_public") === "on";

  if (!title || !content) {
    redirect("/officer/announcements/new?error=missing_fields");
  }

  if (startsAt && isInvalidTimeFrame(startsAt, endsAt)) {
    redirect("/officer/announcements/new?error=invalid_time_frame");
  }

  const upload = await uploadAnnouncementImage(supabase, user.id, imageFile);

  if (upload.error) {
    redirect(`/officer/announcements/new?error=image_${upload.error}`);
  }

  const { error } = await supabase.from("announcements").insert({
    title,
    content,
    starts_at: startsAt,
    ends_at: endsAt,
    location,
    image_url: upload.imageUrl,
    is_public: isPublic,
    published_at: startsAt ?? new Date().toISOString(),
    created_by: user.id,
  });

  if (error) {
    redirect("/officer/announcements/new?error=create_failed");
  }

  revalidatePath("/announcements");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  redirect("/announcements?announcement=created");
}

export async function updateOfficerAnnouncement(formData: FormData) {
  const announcementId = getOptionalString(formData, "announcement_id");

  if (!announcementId) {
    redirect("/announcements");
  }

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

  const title = getOptionalString(formData, "title");
  const content = getOptionalString(formData, "content");
  const startsAt = getOptionalString(formData, "starts_at");
  const endsAt = getOptionalString(formData, "ends_at");
  const location = getOptionalString(formData, "location");
  const imageFile = getOptionalFile(formData, "image");
  const isPublic = formData.get("is_public") === "on";

  if (!title || !content) {
    redirect(`/officer/announcements/${announcementId}/edit?error=missing_fields`);
  }

  if (startsAt && isInvalidTimeFrame(startsAt, endsAt)) {
    redirect(
      `/officer/announcements/${announcementId}/edit?error=invalid_time_frame`,
    );
  }

  const upload = await uploadAnnouncementImage(supabase, user.id, imageFile);

  if (upload.error) {
    redirect(
      `/officer/announcements/${announcementId}/edit?error=image_${upload.error}`,
    );
  }

  const { error } = await supabase
    .from("announcements")
    .update({
      title,
      content,
      starts_at: startsAt,
      ends_at: endsAt,
      location,
      is_public: isPublic,
      published_at: startsAt ?? new Date().toISOString(),
      ...(upload.imageUrl ? { image_url: upload.imageUrl } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", announcementId)
    .select("id")
    .single();

  if (error) {
    redirect(`/officer/announcements/${announcementId}/edit?error=update_failed`);
  }

  revalidatePath("/announcements");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  redirect("/announcements?announcement=updated");
}

export async function archiveOfficerAnnouncement(formData: FormData) {
  const announcementId = getOptionalString(formData, "announcement_id");

  if (!announcementId) {
    redirect("/announcements");
  }

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

  const { error } = await supabase
    .from("announcements")
    .update({
      archived_at: new Date().toISOString(),
      archived_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", announcementId)
    .is("archived_at", null)
    .select("id")
    .single();

  if (error) {
    redirect("/announcements?error=delete_failed");
  }

  revalidatePath("/announcements");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  redirect("/announcements?announcement=deleted");
}
