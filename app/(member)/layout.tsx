import { redirect } from "next/navigation";

import { MemberShell } from "@/components/member/member-shell";
import { FirstLoginModal } from "@/components/member/first-login-modal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "role, first_name, last_name, username, profile_picture_url, has_completed_profile, college, program, major, year_level, gender, date_of_birth, phone, personal_email",
    )
    .eq("id", user.id)
    .maybeSingle();

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
      role={profile?.role}
    >
      {children}
      {showFirstLoginModal && profile && (
        <FirstLoginModal
          profile={{
            ...profile,
            id: user.id,
            role: profile.role ?? "member",
            member_status: "active",
            msc_id_code: null,
            school_id_code: null,
            middle_name: null,
            extension: null,
            section: null,
            username: null,
            address: null,
            social_media_url: null,
            bulsu_email: null,
            guardian_name: null,
            guardian_relationship: null,
            guardian_phone: null,
            guardian_address: null,
            has_completed_profile: profile.has_completed_profile ?? false,
            member_since: null,
            last_login_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }}
          displayName={displayName}
          userEmail={user.email}
        />
      )}
    </MemberShell>
  );
}
