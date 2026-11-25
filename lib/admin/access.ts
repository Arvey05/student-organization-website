import type { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { getEventCreatorAccess } from "@/lib/supabase/event-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Supabase = SupabaseClient<Database>;

/**
 * The database decides who is a site administrator: a listed address with a
 * completed email verification and an active member profile. Fails closed.
 */
export async function getSiteAdminAccess(supabase: Supabase): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_site_admin");
  return !error && data === true;
}

/**
 * Call this at the top of every administrator page and Server Action. A layout
 * check is not enough: layouts do not re-render on client navigation, and Server
 * Actions are reachable by direct POST. The database re-checks inside every
 * admin_* function regardless.
 */
export async function requireSiteAdmin(): Promise<{
  supabase: Supabase;
  user: User;
}> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!(await getSiteAdminAccess(supabase))) {
    redirect("/dashboard?error=admin_required");
  }

  return { supabase, user };
}

/**
 * The admin area is for Executive Board members who can manage events and
 * announcements, plus site administrators. Regular members are turned away.
 * Individual tools still check their own, narrower permission.
 */
export async function requireAdminAreaAccess(): Promise<{
  supabase: Supabase;
  user: User;
  isEventCreator: boolean;
  isSiteAdmin: boolean;
}> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [isEventCreator, isSiteAdmin] = await Promise.all([
    getEventCreatorAccess(supabase, user.id),
    getSiteAdminAccess(supabase),
  ]);

  if (!isEventCreator && !isSiteAdmin) {
    redirect("/dashboard?error=admin_required");
  }

  return { supabase, user, isEventCreator, isSiteAdmin };
}

export async function requireEventCreator() {
  const access = await requireAdminAreaAccess();

  if (!access.isEventCreator) {
    redirect("/admin");
  }

  return access;
}
