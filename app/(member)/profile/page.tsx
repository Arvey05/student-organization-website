import Link from "next/link";
import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { MemberPageHeader } from "@/components/member/page-header";
import { formatRole } from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";

export default async function ProfilePage() {
  const { displayName, email, profile } = await getCurrentMemberProfile();

  const profileItems = [
    ["MSC ID Code", profile?.msc_id_code ?? "Not set"],
    ["School ID Code", profile?.school_id_code ?? "Not set"],
    ["Program", profile?.program ?? "Not set"],
    ["College", profile?.college ?? "Not set"],
    ["Year Level", profile?.year_level ?? "Not set"],
    ["Section", profile?.section ?? "Not set"],
    ["Phone", profile?.phone ?? "Not set"],
    ["Gender", profile?.gender ?? "Not set"],
  ];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MemberPageHeader
          eyebrow="Profile"
          title="Member profile"
          description="Review your membership, school, contact, and personal information."
        />

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
                <UserRound className="size-10" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-slate-950">
                {displayName}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <Mail className="size-4" aria-hidden="true" />
                {email}
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <ShieldCheck className="size-4" aria-hidden="true" />
                {formatRole(profile?.role)}
              </p>
              <Link
                href="/profile/edit"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Personal information
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {profileItems.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
