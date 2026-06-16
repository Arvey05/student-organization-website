import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ClipboardCheck,
  Megaphone,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  getActivities,
  getAnnouncements,
  getRegisteredActivities,
} from "@/lib/member/activity-data";
import {
  formatDateTime,
  formatDateTimeRange,
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
  const nextActivity = activities.find(
    (activity) => activity.status === "upcoming",
  );

  const stats = [
    {
      label: "Membership",
      value: profile?.member_status ?? "active",
      icon: ShieldCheck,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Registered",
      value: String(registeredCount),
      icon: ClipboardCheck,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Pre-Registered",
      value: String(preRegisteredCount),
      icon: CalendarDays,
      tone: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Sparkles className="size-4" aria-hidden="true" />
                Member Home
              </p>
              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Welcome, {displayName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Track your profile, registered activities, announcements, and
                calendar items from one workspace.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <article
                      key={stat.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div
                        className={`flex size-10 items-center justify-center rounded-xl ${stat.tone}`}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-2xl font-black capitalize text-slate-950">
                        {stat.value}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <UserRound className="size-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">{displayName}</h2>
                  <p className="mt-1 truncate text-sm text-slate-300">
                    {user.email}
                  </p>
                  <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
                    {formatRole(profile?.role)}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-slate-200">
                <p>
                  <span className="text-slate-400">Program:</span>{" "}
                  {profile?.program ?? "Not set"}
                </p>
                <p>
                  <span className="text-slate-400">College:</span>{" "}
                  {profile?.college ?? "Not set"}
                </p>
                <p>
                  <span className="text-slate-400">MSC ID:</span>{" "}
                  {profile?.msc_id_code ?? "Not set"}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/profile"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-slate-950"
                >
                  View Profile
                </Link>
                <Link
                  href="/profile/edit"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 px-4 text-sm font-semibold text-white"
                >
                  Edit Profile
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">
                  Updates
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  Important announcements
                </h2>
              </div>
              <Link
                href="/announcements"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                View all
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {announcements.length ? (
                announcements.slice(0, 2).map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                    {item.image_url ? (
                      <div className="relative mb-3 aspect-video overflow-hidden rounded-xl">
                        <Image
                          src={item.image_url}
                          alt={`${item.title} cover`}
                          fill
                          sizes="(min-width: 1024px) 30vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mb-3 flex aspect-video items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                        <Megaphone className="size-8" aria-hidden="true" />
                      </div>
                    )}
                    <p className="text-xs font-semibold text-violet-700">
                      {item.starts_at
                        ? formatDateTimeRange(item.starts_at, item.ends_at)
                        : formatDateTime(item.published_at ?? item.created_at)}
                    </p>
                    <h3 className="mt-2 font-bold text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                      {item.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 md:col-span-2">
                  No important updates at the moment.
                </p>
              )}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Activities
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  My Activities
                </h2>
              </div>
              <Link
                href="/my-activities"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                View all
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {registeredActivities.length ? (
                registeredActivities
                  .slice(0, 3)
                  .map(({ activity, registration }) => (
                    <Link
                      key={registration.id}
                      href={`/member/activities/${activity.id}`}
                      className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-blue-50"
                    >
                      <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                        {activity.image_url ? (
                          <Image
                            src={activity.image_url}
                            alt={`${activity.name} cover`}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-950">
                          {activity.name}
                        </h3>
                        <p className="mt-1 text-xs capitalize text-blue-700">
                          {registration.status.replace("_", " ")}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {formatDateTimeRange(
                            activity.starts_at,
                            activity.ends_at,
                          )}
                        </p>
                      </div>
                    </Link>
                  ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  You have not registered for any activities yet.
                </p>
              )}
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Calendar preview
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
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {formatDateTimeRange(item.starts_at, item.ends_at)}
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

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Next up</h2>
            {nextActivity ? (
              <div className="mt-5 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-200">
                  {nextActivity.image_url ? (
                    <Image
                      src={nextActivity.image_url}
                      alt={`${nextActivity.name} cover`}
                      fill
                      sizes="(min-width: 1024px) 35vw, 100vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    {formatDateTimeRange(
                      nextActivity.starts_at,
                      nextActivity.ends_at,
                    )}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-slate-950">
                    {nextActivity.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {nextActivity.short_description}
                  </p>
                  <Link
                    href={`/member/activities/${nextActivity.id}`}
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-semibold text-white"
                  >
                    View Activity
                  </Link>
                </div>
              </div>
            ) : (
              <p className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No upcoming activity is available yet.
              </p>
            )}
          </article>
        </section>

        {isOfficerEventCreator ? (
          <section className="mt-6 grid gap-4 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-600 to-violet-600 p-6 text-white shadow-xl shadow-blue-500/20 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
                Officer access
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Publish organization updates
              </h2>
              <p className="mt-3 text-sm leading-7 text-blue-50">
                Create official events and announcements from the officer tools.
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3 sm:justify-end">
              <Link
                href="/officer/events/new"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-blue-700 shadow-sm"
              >
                <PlusCircle className="size-4" aria-hidden="true" />
                Add Event
              </Link>
              <Link
                href="/officer/announcements/new"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white"
              >
                <Megaphone className="size-4" aria-hidden="true" />
                Add Announcement
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
