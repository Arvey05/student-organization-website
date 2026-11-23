import Link from "next/link";
import { KeyRound, Trash2, UserRound } from "lucide-react";

import { MemberPageHeader } from "@/components/member/page-header";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  const params = await searchParams;
  const passwordUpdated = params.password === "updated";

  const settings = [
    {
      title: "Profile",
      description: "Edit personal information and prepare profile picture updates.",
      href: "/profile/edit",
      icon: UserRound,
      external: false,
    },
    {
      title: "Password",
      description: "Change your account password using Supabase Auth.",
      href: "/settings/password",
      icon: KeyRound,
      external: false,
    },
    {
      title: "Delete account",
      description: "Contact the organization email for account deletion concerns.",
      href: "mailto:bulsu.officialmsc@gmail.com",
      icon: Trash2,
      external: true,
    },
  ];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[96rem]">
        <MemberPageHeader
          eyebrow="Settings"
          title="Account settings"
          description="Manage profile details, password changes, and account-related requests."
        />

        {passwordUpdated ? (
          <p
            role="status"
            className="mt-6 border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-100"
          >
            Your password has been updated.
          </p>
        ) : null}

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {settings.map((item) => {
            const Icon = item.icon;
            const cardClass =
              "border-t border-white/10 bg-black/15 p-6 transition hover:border-blue-300/40";
            const content = (
              <>
                <div className="flex size-12 items-center justify-center border border-white/10 text-blue-100">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-white">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.description}
                </p>
              </>
            );

            return item.external ? (
              <a key={item.title} href={item.href} className={cardClass}>
                {content}
              </a>
            ) : (
              <Link key={item.title} href={item.href} className={cardClass}>
                {content}
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
