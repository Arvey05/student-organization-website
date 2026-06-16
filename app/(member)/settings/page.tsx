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
      href: "mailto:organization@example.edu",
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
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
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
