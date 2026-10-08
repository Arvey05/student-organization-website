import { redirect } from "next/navigation";

import { MemberShell } from "@/components/member/member-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, first_name, last_name, username, profile_picture_url")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.username ||
    user.email ||
    "Member";

  return (
    <MemberShell
      displayName={displayName}
      email={user.email}
      profilePictureUrl={profile?.profile_picture_url}
      role={profile?.role}
    >
      {children}
    </MemberShell>
  );
}
