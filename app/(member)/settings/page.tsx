import Link from "next/link";
import { KeyRound, Trash2, UserRound } from "lucide-react";

import { MemberPageHeader } from "@/components/member/page-header";

export default function SettingsPage() {
  const settings = [
    {
      title: "Profile",
      description: "Edit personal information and prepare profile picture updates.",
      href: "/profile/edit",
      icon: UserRound,
    },
    {
      title: "Password",
      description: "Change your account password using Supabase Auth.",
      href: "/settings/password",
      icon: KeyRound,
    },
    {
      title: "Delete account",
      description: "Contact the organization email for account deletion concerns.",
      href: "mailto:bulsu.officialmsc@gmail.com",
      icon: Trash2,
    },
  ];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MemberPageHeader
          eyebrow="Settings"
          title="Account settings"
          description="Manage profile details, password changes, and account-related requests."
        />

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {settings.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="border-t border-white/10 bg-[#02040a] p-6 transition hover:border-blue-300/40"
              >
                <div className="flex size-12 items-center justify-center rounded-md bg-blue-500/15 text-blue-100">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-white">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
