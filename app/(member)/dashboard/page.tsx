import Link from "next/link";
import {
  CalendarDays,
  ClipboardCheck,
  Megaphone,
  PlusCircle,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { MemberPageHeader } from "@/components/member/page-header";
import {
  calendarPreview,
  formatRole,
  memberActivities,
  memberAnnouncements,
} from "@/lib/member/mock-data";
import { getCurrentMemberProfile } from "@/lib/member/profile";
import { canCreateEvents } from "@/lib/supabase/roles";

export default async function DashboardPage() {
  const { displayName, profile, user } = await getCurrentMemberProfile();
  const isOfficerEventCreator = canCreateEvents(profile?.role);

  const stats = [
    {
      label: "Membership Status",
      value: profile?.member_status ?? "active",
      icon: ShieldCheck,
    },
    { label: "Events Joined", value: "1", icon: ClipboardCheck },
    { label: "Pre-Registered", value: "1", icon: CalendarDays },
  ];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <MemberPageHeader
          eyebrow="Dashboard"
          title={`Welcome, ${displayName}`}
          description="Track organization updates, profile status, activities, and calendar items from one member workspace."
        />

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-black capitalize text-slate-950">
                      {stat.value}
                    </p>
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-950">
                Member profile
              </h2>
              <UserRound className="size-5 text-blue-600" aria-hidden="true" />
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <p>
                <span className="font-semibold text-slate-500">Email:</span>{" "}
                {user.email}
              </p>
              <p>
                <span className="font-semibold text-slate-500">Role:</span>{" "}
                {formatRole(profile?.role)}
              </p>
              <p>
                <span className="font-semibold text-slate-500">Program:</span>{" "}
                {profile?.program ?? "Not set"}
              </p>
              <p>
                <span className="font-semibold text-slate-500">MSC ID:</span>{" "}
                {profile?.msc_id_code ?? "Not set"}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/profile"
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white"
              >
                View Profile
              </Link>
              <Link
                href="/settings/password"
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
              >
                Change Password
              </Link>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-950">
                Important updates
              </h2>
              <Megaphone className="size-5 text-violet-600" aria-hidden="true" />
            </div>
            <div className="mt-5 space-y-4">
              {memberAnnouncements.slice(0, 2).map((item) => (
                <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-blue-600">
                    {item.date}
                  </p>
                  <h3 className="mt-1 font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {isOfficerEventCreator ? (
          <section className="mt-6 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-600 to-violet-600 p-6 text-white shadow-xl shadow-blue-500/20">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
                  Officer access
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Add an event or program
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-50">
                  Your role can publish upcoming organization activities using
                  the officer-only event form.
                </p>
              </div>
              <Link
                href="/officer/events/new"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-blue-700 shadow-sm"
              >
                <PlusCircle className="size-4" aria-hidden="true" />
                Add Event
              </Link>
            </div>
          </section>
        ) : null}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              My registered activities
            </h2>
            <div className="mt-5 space-y-3">
              {memberActivities.map((activity) => (
                <div
                  key={activity.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-bold text-slate-950">{activity.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {activity.date} - {activity.status}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              University calendar
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {calendarPreview.map((item) => (
                <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-black text-blue-700">
                    {item.month} {item.day}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
