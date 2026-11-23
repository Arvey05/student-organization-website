import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type ActivityRow = Database["public"]["Tables"]["activities"]["Row"];
export type AnnouncementRow =
  Database["public"]["Tables"]["announcements"]["Row"];
export type ActivityRegistrationRow =
  Database["public"]["Tables"]["activity_registrations"]["Row"];

export type RegisteredActivity = {
  registration: ActivityRegistrationRow;
  activity: ActivityRow;
};

export async function getActivities(): Promise<ActivityRow[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .is("archived_at", null)
      .order("starts_at", { ascending: true });

    if (error) {
      console.error(`Unable to load activities: ${error.message}`);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("Unable to load activities:", error);
    return [];
  }
}

export async function getActivityById(
  activityId: string,
): Promise<ActivityRow | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("id", activityId)
      .is("archived_at", null)
      .maybeSingle();

    if (error) {
      console.error(`Unable to load activity: ${error.message}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unable to load activity:", error);
    return null;
  }
}

export async function getPublicActivities(): Promise<ActivityRow[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("is_public", true)
      .is("archived_at", null)
      .order("starts_at", { ascending: true });

    if (error) {
      console.error(`Unable to load public activities: ${error.message}`);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("Unable to load public activities:", error);
    return [];
  }
}

export async function getAnnouncements(): Promise<AnnouncementRow[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .is("archived_at", null)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Unable to load announcements: ${error.message}`);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("Unable to load announcements:", error);
    return [];
  }
}

export async function getAnnouncementById(
  announcementId: string,
): Promise<AnnouncementRow | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", announcementId)
      .is("archived_at", null)
      .maybeSingle();

    if (error) {
      console.error(`Unable to load announcement: ${error.message}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unable to load announcement:", error);
    return null;
  }
}

export async function getRegisteredActivities(
  userId: string,
): Promise<RegisteredActivity[]> {
  const supabase = await createSupabaseServerClient();
  const { data: registrations, error: registrationError } = await supabase
    .from("activity_registrations")
    .select("*")
    .eq("user_id", userId)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false });

  if (registrationError) {
    throw new Error(
      `Unable to load registered activities: ${registrationError.message}`,
    );
  }

  if (!registrations?.length) {
    return [];
  }

  const activityIds = registrations.map(
    (registration) => registration.activity_id,
  );
  const { data: activities, error: activityError } = await supabase
    .from("activities")
    .select("*")
    .in("id", activityIds)
    .is("archived_at", null);

  if (activityError) {
    throw new Error(
      `Unable to load registered activity details: ${activityError.message}`,
    );
  }

  const activityById = new Map(
    (activities ?? []).map((activity) => [activity.id, activity]),
  );

  return registrations.flatMap((registration) => {
    const activity = activityById.get(registration.activity_id);
    return activity ? [{ registration, activity }] : [];
  });
}

export async function getCurrentUserRegistration(activityId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("activity_registrations")
    .select("*")
    .eq("activity_id", activityId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load registration: ${error.message}`);
  }

  return data;
}
