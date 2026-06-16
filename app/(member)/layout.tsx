import { redirect } from "next/navigation";

import { MemberShell } from "@/components/member/member-shell";
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
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return <MemberShell role={profile?.role}>{children}</MemberShell>;
}
