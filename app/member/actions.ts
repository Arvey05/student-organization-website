"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ensureMemberProfile } from "@/lib/member/ensure-profile";
import {
  isValidBirthdate,
  isValidUuid,
  uploadMemberProfilePicture,
} from "@/lib/member/profile-validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getEventCreatorAccess } from "@/lib/supabase/event-access";
import {
  validateCollegeProgramMajor,
  VALID_YEAR_LEVEL_VALUES,
  VALID_GENDER_VALUES,
} from "@/lib/member/colleges";

const MIN_PASSWORD_LENGTH = 8;

/** Lets admin pages send people back to the list they came from. Only /admin paths. */
function getAdminReturnPath(formData: FormData): string | null {
  const value = formData.get("return_to");
  return typeof value === "string" && /^\/admin(\/[a-z-]+)?$/.test(value)
    ? value
    : null;
}

function getOptionalString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function getOptionalImageUrl(formData: FormData): string | null {
  const imageUrl = getOptionalString(formData, "image_url");

  if (!imageUrl) {
    return null;
  }

  if (/[\s<>"']/.test(imageUrl)) {
    return null;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (/^[a-z0-9][a-z0-9/_-]*\.[a-z0-9]+$/i.test(imageUrl)) {
    return imageUrl;
  }

  return null;
}

function hasInvalidImageUrl(formData: FormData): boolean {
  return Boolean(getOptionalString(formData, "image_url")) && !getOptionalImageUrl(formData);
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

  const removePicture =
    getOptionalString(formData, "remove_profile_picture") === "1";
  const profilePictureFile = getOptionalFile(formData, "profile_picture");
  const profilePictureUpload = await uploadMemberProfilePicture(
    supabase,
    user.id,
    profilePictureFile,
  );

  if (profilePictureUpload.error) {
    redirect(`/profile/edit?error=profile_picture_${profilePictureUpload.error}`);
  }

  // ── Task 3: Server-side validation of college/program/major ──────────
  const college = getOptionalString(formData, "college");
  const program = getOptionalString(formData, "program");
  const major = getOptionalString(formData, "major");
  const collegeProgramMajorError = validateCollegeProgramMajor(
    college,
    program,
    major,
  );

  if (collegeProgramMajorError) {
    redirect("/profile/edit?error=invalid_college_program_major");
  }

  // ── Task 3: Server-side validation of year level ──────────────────────
  const yearLevel = getOptionalString(formData, "year_level");

  if (yearLevel && !VALID_YEAR_LEVEL_VALUES.has(yearLevel)) {
    redirect("/profile/edit?error=invalid_year_level");
  }

  // ── Task 3: Server-side validation of gender ─────────────────────────
  const gender = getOptionalString(formData, "gender");

  if (gender && !VALID_GENDER_VALUES.has(gender)) {
    redirect("/profile/edit?error=invalid_gender");
  }

  // ── Task 4: Server-side validation of birthdate ───────────────────────
  const dateOfBirth = getOptionalString(formData, "date_of_birth");
  if (dateOfBirth && !isValidBirthdate(dateOfBirth)) {
    redirect("/profile/edit?error=invalid_birthdate");
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
      college: college,
      program: program,
      major: major,
      year_level: yearLevel,
      section: getOptionalString(formData, "section"),
      phone: getOptionalString(formData, "phone"),
      personal_email: getOptionalString(formData, "personal_email"),
      bulsu_email: getOptionalString(formData, "bulsu_email"),
      social_media_url: getOptionalString(formData, "social_media_url"),
      address: getOptionalString(formData, "address"),
      date_of_birth: dateOfBirth,
      gender: gender,
      guardian_name: getOptionalString(formData, "guardian_name"),
      guardian_relationship: getOptionalString(
        formData,
        "guardian_relationship",
      ),
      guardian_phone: getOptionalString(formData, "guardian_phone"),
      guardian_address: getOptionalString(formData, "guardian_address"),
      has_completed_profile: true,
      ...(profilePictureUpload.imageUrl
        ? { profile_picture_url: profilePictureUpload.imageUrl }
        : removePicture
          ? { profile_picture_url: null }
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

  if (password.length < MIN_PASSWORD_LENGTH) {
    redirect("/settings/password?error=password_too_short");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: oldPassword,
  });

  if (verifyError) {
    redirect("/settings/password?error=incorrect_old_password");
  }

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

  if (!(await getEventCreatorAccess(supabase, user.id))) {
    redirect("/dashboard?error=officer_required");
  }

  const name = getOptionalString(formData, "name");
  const startsAt = getOptionalString(formData, "starts_at");
  const endsAt = getOptionalString(formData, "ends_at");
  const shortDescription = getOptionalString(formData, "short_description");
  const location = getOptionalString(formData, "location");
  const imageUrl = getOptionalImageUrl(formData);

  if (!name || !startsAt || !shortDescription || !location) {
    redirect("/officer/events/new?error=missing_fields");
  }

  if (isInvalidTimeFrame(startsAt, endsAt)) {
    redirect("/officer/events/new?error=invalid_time_frame");
  }

  if (hasInvalidImageUrl(formData)) {
    redirect("/officer/events/new?error=invalid_image_url");
  }

  const { error } = await supabase.from("activities").insert({
    name,
    starts_at: startsAt,
    ends_at: endsAt,
    short_description: shortDescription,
    location,
    image_url: imageUrl,
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

  if (!activityId || !isValidUuid(activityId)) {
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

  if (!activityId || !isValidUuid(activityId)) {
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

  if (!activityId || !isValidUuid(activityId)) {
    redirect("/member/activities");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!(await getEventCreatorAccess(supabase, user.id))) {
    redirect("/dashboard?error=officer_required");
  }

  const name = getOptionalString(formData, "name");
  const startsAt = getOptionalString(formData, "starts_at");
  const endsAt = getOptionalString(formData, "ends_at");
  const shortDescription = getOptionalString(formData, "short_description");
  const location = getOptionalString(formData, "location");
  const status = getOptionalString(formData, "status");
  const imageUrl = getOptionalImageUrl(formData);

  if (!name || !startsAt || !shortDescription || !location) {
    redirect(`/officer/events/${activityId}/edit?error=missing_fields`);
  }

  if (isInvalidTimeFrame(startsAt, endsAt)) {
    redirect(`/officer/events/${activityId}/edit?error=invalid_time_frame`);
  }

  if (status !== "upcoming" && status !== "completed" && status !== "past") {
    redirect(`/officer/events/${activityId}/edit?error=invalid_status`);
  }

  if (hasInvalidImageUrl(formData)) {
    redirect(`/officer/events/${activityId}/edit?error=invalid_image_url`);
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
      ...(imageUrl ? { image_url: imageUrl } : {}),
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

  if (!activityId || !isValidUuid(activityId)) {
    redirect("/member/activities");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!(await getEventCreatorAccess(supabase, user.id))) {
    redirect("/dashboard?error=officer_required");
  }

  const returnTo = getAdminReturnPath(formData);
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
    redirect(returnTo ? `${returnTo}?error=delete_failed` : `/member/activities/${activityId}?error=delete_failed`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/events");

  revalidatePath(`/member/activities/${activityId}`);
  revalidatePath("/activities");
  revalidatePath("/member/activities");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  revalidatePath("/my-activities");
  redirect(returnTo ? `${returnTo}?deleted=1` : "/member/activities?event=deleted");
}

export async function createOfficerAnnouncement(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!(await getEventCreatorAccess(supabase, user.id))) {
    redirect("/dashboard?error=officer_required");
  }

  const title = getOptionalString(formData, "title");
  const content = getOptionalString(formData, "content");
  const startsAt = getOptionalString(formData, "starts_at");
  const endsAt = getOptionalString(formData, "ends_at");
  const location = getOptionalString(formData, "location");
  const imageUrl = getOptionalImageUrl(formData);
  const isPublic = formData.get("is_public") === "on";

  if (!title || !content) {
    redirect("/officer/announcements/new?error=missing_fields");
  }

  if (startsAt && isInvalidTimeFrame(startsAt, endsAt)) {
    redirect("/officer/announcements/new?error=invalid_time_frame");
  }

  if (hasInvalidImageUrl(formData)) {
    redirect("/officer/announcements/new?error=invalid_image_url");
  }

  const { error } = await supabase.from("announcements").insert({
    title,
    content,
    starts_at: startsAt,
    ends_at: endsAt,
    location,
    image_url: imageUrl,
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

  if (!announcementId || !isValidUuid(announcementId)) {
    redirect("/announcements");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!(await getEventCreatorAccess(supabase, user.id))) {
    redirect("/dashboard?error=officer_required");
  }

  const title = getOptionalString(formData, "title");
  const content = getOptionalString(formData, "content");
  const startsAt = getOptionalString(formData, "starts_at");
  const endsAt = getOptionalString(formData, "ends_at");
  const location = getOptionalString(formData, "location");
  const imageUrl = getOptionalImageUrl(formData);
  const isPublic = formData.get("is_public") === "on";

  if (!title || !content) {
    redirect(`/officer/announcements/${announcementId}/edit?error=missing_fields`);
  }

  if (startsAt && isInvalidTimeFrame(startsAt, endsAt)) {
    redirect(
      `/officer/announcements/${announcementId}/edit?error=invalid_time_frame`,
    );
  }

  if (hasInvalidImageUrl(formData)) {
    redirect(`/officer/announcements/${announcementId}/edit?error=invalid_image_url`);
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
      ...(imageUrl ? { image_url: imageUrl } : {}),
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

  if (!announcementId || !isValidUuid(announcementId)) {
    redirect("/announcements");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!(await getEventCreatorAccess(supabase, user.id))) {
    redirect("/dashboard?error=officer_required");
  }

  const returnTo = getAdminReturnPath(formData);
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
    redirect(returnTo ? `${returnTo}?error=delete_failed` : "/announcements?error=delete_failed");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/announcements");

  revalidatePath("/announcements");
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  redirect(returnTo ? `${returnTo}?deleted=1` : "/announcements?announcement=deleted");
}
