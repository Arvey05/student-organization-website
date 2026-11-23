import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  History,
  ShieldCheck,
  UserX,
  Users,
} from "lucide-react";

import { MemberPageHeader } from "@/components/member/page-header";
import { requireSiteAdmin } from "@/lib/admin/access";
import {
  describeProvisioningEvent,
  summarizeRoster,
} from "@/lib/admin/executive-roster";
import {
  listExecutiveRoster,
  listProvisioningActivity,
} from "@/lib/admin/executive-roster-data";
import { formatDateTime } from "@/lib/member/display";

export const metadata: Metadata = {
  title: "Admin dashboard – BulSU MSC",
};

export default async function AdminDashboardPage() {
  const { supabase } = await requireSiteAdmin();
  const [roster, activity] = await Promise.all([
    listExecutiveRoster(supabase),
    listProvisioningActivity(supabase, 8),
  ]);
  const summary = summarizeRoster(roster);

  const stats = [
    {
      label: "Core executive members",
      value: summary.activeCore,
      description: "Active entries",
      icon: ShieldCheck,
      tone: "border-amber-300/30 text-amber-100",
    },
    {
      label: "Executive members",
      value: summary.activeExecutive,
      description: "Active entries",
      icon: Users,
      tone: "border-blue-300/30 text-blue-100",
    },
    {
      label: "Awaiting setup",
      value: summary.awaitingSetup,
      description: "Not signed up or not verified yet",
      icon: Clock,
      tone: "border-violet-300/30 text-violet-100",
    },
    {
      label: "Deactivated",
      value: summary.deactivated,
      description: "Access revoked",
      icon: UserX,
      tone: "border-red-300/30 text-red-100",
    },
  ];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MemberPageHeader
          eyebrow="Administration"
          title="Admin dashboard"
          description="Manage who holds Executive Board access. Changes apply immediately and are recorded in the activity log."
        />

        <section
          aria-label="Roster summary"
          className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="border-t border-white/10 bg-black/15 p-5"
              >
                <div
                  className={`flex size-11 items-center justify-center border ${stat.tone}`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-3xl font-black text-white">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-medium text-slate-500">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section aria-labelledby="admin-tools-heading">
            <h2
              id="admin-tools-heading"
              className="text-xl font-black text-white"
            >
              Tools
            </h2>
            <Link
              href="/admin/executives"
              className="group mt-4 block border-t border-white/10 bg-black/15 p-6 transition hover:border-blue-300/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-white">
                    Executive provisioning
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Add core executive and executive members, change their
                    tier or position, and deactivate or remove access.
                  </p>
                  <p className="mt-3 text-xs text-slate-500">
                    {summary.total} on the roster
                  </p>
                </div>
                <ArrowRight
                  className="mt-1 size-5 shrink-0 text-blue-200 transition group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </section>

          <section aria-labelledby="admin-activity-heading">
            <h2
              id="admin-activity-heading"
              className="flex items-center gap-2 text-xl font-black text-white"
            >
              <History className="size-5 text-blue-200" aria-hidden="true" />
              Recent activity
            </h2>
            {activity.length ? (
              <ol className="mt-4">
                {activity.map((event) => (
                  <li
                    key={event.id}
                    className="border-t border-white/10 py-4 first:border-t-0"
                  >
                    <p className="text-sm font-semibold text-white">
                      {describeProvisioningEvent(event)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDateTime(event.created_at)} · by{" "}
                      {event.actor_name ?? event.actor_email ?? "a removed account"}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 border border-dashed border-white/15 bg-[#02001f]/60 p-5 text-sm text-slate-300">
                Roster changes will appear here.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
