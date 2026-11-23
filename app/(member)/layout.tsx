import { redirect } from "next/navigation";

import { MemberShell } from "@/components/member/member-shell";
import { FirstLoginModal } from "@/components/member/first-login-modal";
import { getSiteAdminAccess } from "@/lib/admin/access";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isApprovedExecutiveTier } from "@/lib/supabase/event-access";

export const dynamic = "force-dynamic";

export default async function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile and role RPCs in parallel (avoids redundant profiles query).
  // The nav links are convenience only; every admin/officer page and action re-checks.
  const [{ data: profile, error: profileError }, eventCreatorRpc, isSiteAdmin] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "role, first_name, last_name, username, profile_picture_url, has_completed_profile, college, program, major, year_level, gender, date_of_birth, phone, personal_email",
        )
        .eq("id", user.id)
        .maybeSingle(),
      supabase.rpc("is_event_creator", { user_id: user.id }),
      getSiteAdminAccess(supabase),
    ]);

  const isEventCreator =
    !profileError &&
    isApprovedExecutiveTier(profile?.role) &&
    !eventCreatorRpc.error &&
    eventCreatorRpc.data === true;

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.username ||
    user.email ||
    "Member";

  // Show the first-login modal only when has_completed_profile is explicitly false
  const showFirstLoginModal =
    profile !== null &&
    profile !== undefined &&
    profile.has_completed_profile === false;

  return (
    <MemberShell
      displayName={displayName}
      email={user.email}
      profilePictureUrl={profile?.profile_picture_url}
      isEventCreator={isEventCreator}
      isSiteAdmin={isSiteAdmin}
    >
      {children}
      {showFirstLoginModal && profile && (
        <FirstLoginModal
          profile={profile}
          displayName={displayName}
          userEmail={user.email}
        />
      )}
    </MemberShell>
  );
}
