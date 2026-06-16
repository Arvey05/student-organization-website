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
  getActivities,
  getAnnouncements,
  getRegisteredActivities,
} from "@/lib/member/activity-data";
import {
  formatDateTime,
  formatRole,
  getCalendarDateParts,
} from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";
import { canCreateEvents } from "@/lib/supabase/roles";

export default async function DashboardPage() {
  const { displayName, profile, user } = await getCurrentMemberProfile();
  const [activities, announcements, registeredActivities] = await Promise.all([
    getActivities(),
    getAnnouncements(),
    getRegisteredActivities(user.id),
  ]);
  const isOfficerEventCreator = canCreateEvents(profile?.role);
  const preRegisteredCount = registeredActivities.filter(
    ({ registration }) => registration.status === "pre_registered",
  ).length;
  const registeredCount = registeredActivities.filter(
    ({ registration }) => registration.status === "registered",
  ).length;

  const stats = [
    {
      label: "Membership Status",
      value: profile?.member_status ?? "active",
      icon: ShieldCheck,
    },
    {
      label: "Events Joined",
      value: String(registeredCount),
      icon: ClipboardCheck,
    },
    {
      label: "Pre-Registered",
      value: String(preRegisteredCount),
      icon: CalendarDays,
    },
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
              {announcements.length ? (
                announcements.slice(0, 2).map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-blue-600">
                      {formatDateTime(item.published_at ?? item.created_at)}
                    </p>
                    <h3 className="mt-1 font-bold text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  No important updates at the moment.
                </p>
              )}
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
              {registeredActivities.length ? (
                registeredActivities
                  .slice(0, 3)
                  .map(({ activity, registration }) => (
                    <div
                      key={registration.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <Link
                        href={`/member/activities/${activity.id}`}
                        className="font-bold text-slate-950 transition hover:text-blue-700"
                      >
                        {activity.name}
                      </Link>
                      <p className="mt-1 text-sm capitalize text-slate-600">
                        {formatDateTime(activity.starts_at)} -{" "}
                        {registration.status.replace("_", " ")}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  You have not registered for any activities yet.
                </p>
              )}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              University calendar
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {activities.length ? (
                activities.slice(0, 4).map((item) => {
                  const date = getCalendarDateParts(item.starts_at);

                  return (
                    <Link
                      key={item.id}
                      href={`/member/activities/${item.id}`}
                      className="rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50"
                    >
                      <p className="text-sm font-black text-blue-700">
                        {date.month} {date.day}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {item.name}
                      </p>
                    </Link>
                  );
                })
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:col-span-2">
                  No calendar events available yet.
                </p>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
