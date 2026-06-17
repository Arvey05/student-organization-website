import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Clock,
  Megaphone,
  MapPin,
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

function getAnnouncementDate(
  announcement: Awaited<ReturnType<typeof getAnnouncements>>[number],
) {
  return (
    announcement.starts_at ??
    announcement.published_at ??
    announcement.created_at
  );
}

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
  const upcomingActivities = activities.filter(
    (activity) => activity.status === "upcoming",
  );
  const completedRegisteredCount = registeredActivities.filter(
    ({ activity }) =>
      activity.status === "completed" || activity.status === "past",
  );
  const completedCount = completedRegisteredCount.length;
  const calendarPreviewItems = [
    ...upcomingActivities.map((activity) => ({
      id: activity.id,
      type: "Activity",
      title: activity.name,
      date: activity.starts_at,
      href: `/member/activities/${activity.id}`,
      tone: "border-blue-400/30 bg-blue-500/15 text-blue-100",
    })),
    ...announcements.map((announcement) => ({
      id: announcement.id,
      type: "Announcement",
      title: announcement.title,
      date: getAnnouncementDate(announcement),
      href: "/announcements",
      tone: "border-slate-700 bg-slate-950 text-white",
    })),
  ]
    .sort(
      (firstItem, secondItem) =>
        new Date(firstItem.date).getTime() - new Date(secondItem.date).getTime(),
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Registered",
      value: String(registeredCount),
      description: "Active registrations",
      icon: ClipboardCheck,
      tone: "bg-blue-600 text-white",
    },
    {
      label: "Upcoming",
      value: String(upcomingActivities.length),
      description: "Published activities",
      icon: CalendarDays,
      tone: "bg-slate-950 text-white",
    },
    {
      label: "Completed",
      value: String(completedCount),
      description: "Registered completed/past",
      icon: ShieldCheck,
      tone: "bg-emerald-500/15 text-emerald-200",
    },
    {
      label: "Pre-Registered",
      value: String(preRegisteredCount),
      description: "Awaiting activity status",
      icon: Clock,
      tone: "bg-violet-500/15 text-violet-200",
    },
  ];

  return (
    <main className="bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden border-y border-white/10 bg-slate-950 p-6 text-white sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.5),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.28),transparent_25%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-950/60 to-transparent" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-blue-100">
                <Sparkles className="size-4" aria-hidden="true" />
                Member dashboard
              </p>
              <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
                Welcome, {displayName}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Your central workspace for membership, announcements,
                registered activities, and upcoming organization dates.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold capitalize text-emerald-100">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  {profile?.member_status ?? "active"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-100">
                  <UserRound className="size-4" aria-hidden="true" />
                  {formatRole(profile?.role)}
                </span>
              </div>
            </div>

            <aside className="border-l border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-blue-500/15 text-blue-100">
                  <UserRound className="size-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">{displayName}</h2>
                  <p className="mt-1 truncate text-sm text-slate-300">
                    {user.email}
                  </p>
                  <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-white/10">
                    {formatRole(profile?.role)}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-200">
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
                  className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-blue-50"
                >
                  View Profile
                </Link>
                <Link
                  href="/profile/edit"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-white/20 bg-white/[0.06] px-4 text-sm font-semibold text-white transition hover:border-blue-300/40"
                >
                  Edit Profile
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="border-t border-white/10 bg-slate-950/70 p-5 transition hover:border-blue-300/40"
              >
                <div className={`flex size-11 items-center justify-center rounded-md ${stat.tone}`}>
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

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="border-t border-white/10 bg-slate-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Updates
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
                  Latest announcements
                </h2>
              </div>
              <Link
                href="/announcements"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-300/40 hover:text-white"
              >
                View all announcements
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {announcements.length ? (
                announcements.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href="/announcements"
                    className="grid gap-4 border-t border-white/10 bg-slate-950/60 p-4 transition hover:border-blue-300/40 sm:grid-cols-[10rem_1fr]"
                  >
                    {item.image_url ? (
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-200">
                        <Image
                          src={item.image_url}
                          alt={`${item.title} cover`}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-950 text-blue-100">
                        <Megaphone className="size-7" aria-hidden="true" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-blue-200">
                        {item.starts_at
                          ? formatDateTimeRange(item.starts_at, item.ends_at)
                          : formatDateTime(item.published_at ?? item.created_at)}
                      </p>
                      <h3 className="mt-2 line-clamp-1 font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                        {item.content}
                      </p>
                      {item.location ? (
                        <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <MapPin className="size-3.5" aria-hidden="true" />
                          {item.location}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="border border-dashed border-white/15 bg-slate-950/60 p-5 text-sm text-slate-300">
                  No announcements yet.
                </p>
              )}
            </div>
          </article>

          <article className="border-t border-white/10 bg-slate-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Activities
                </p>
                <h2 className="mt-1 text-2xl font-black text-white">
                  My Activities
                </h2>
              </div>
              <Link
                href="/my-activities"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-300/40 hover:text-white"
              >
                View all
                <ArrowRight className="size-4" aria-hidden="true" />
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
                      className="flex gap-4 border-t border-white/10 bg-slate-950/60 p-3 transition hover:border-blue-300/40"
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
                        <h3 className="truncate font-bold text-white">
                          {activity.name}
                        </h3>
                        <p className="mt-1 text-xs capitalize text-blue-200">
                          {registration.status.replace("_", " ")}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {formatDateTimeRange(
                            activity.starts_at,
                            activity.ends_at,
                          )}
                        </p>
                      </div>
                    </Link>
                  ))
              ) : (
                <p className="border border-dashed border-white/15 bg-slate-950/60 p-4 text-sm text-slate-300">
                  You have not registered for any activities yet.
                </p>
              )}
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="border-t border-white/10 bg-slate-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Calendar
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Upcoming dates
                </h2>
              </div>
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-300/40 hover:text-white"
              >
                Calendar
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {calendarPreviewItems.length ? (
                calendarPreviewItems.map((item) => {
                  const date = getCalendarDateParts(item.date);

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-4 border-t border-white/10 bg-slate-950/60 p-4 transition hover:border-blue-300/40"
                    >
                      <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-md bg-black text-white">
                        <span className="text-xs font-bold uppercase text-blue-200">
                          {date.month}
                        </span>
                        <span className="text-xl font-black">{date.day}</span>
                      </span>
                      <span className="min-w-0">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${item.tone}`}>
                          {item.type}
                        </span>
                        <span className="mt-2 block truncate text-sm font-bold text-white">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {formatDateTime(item.date)}
                        </span>
                      </span>
                    </Link>
                  );
                })
              ) : (
                <p className="border border-dashed border-white/15 bg-slate-950/60 p-4 text-sm text-slate-300">
                  No calendar events available yet.
                </p>
              )}
            </div>
          </article>

          <article className="border-t border-white/10 bg-slate-950 p-6 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
                  Profile summary
                </p>
                <h2 className="mt-1 text-2xl font-black">{displayName}</h2>
                <p className="mt-2 text-sm text-slate-300">{user.email}</p>
              </div>
              <div className="flex size-16 shrink-0 items-center justify-center rounded-md bg-blue-500/15 text-blue-100">
                <UserRound className="size-7" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Role", formatRole(profile?.role)],
                ["Program", profile?.program ?? "Not set"],
                ["College", profile?.college ?? "Not set"],
                ["MSC ID", profile?.msc_id_code ?? "Not set"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-t border-white/10 bg-slate-950/70 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/profile"
                className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-blue-50"
              >
                View Profile
              </Link>
              <Link
                href="/profile/edit"
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/20 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:border-blue-300/40"
              >
                Edit Profile
              </Link>
            </div>
          </article>
        </section>

        {isOfficerEventCreator ? (
          <section className="mt-6 grid gap-4 border-y border-blue-300/30 bg-gradient-to-r from-blue-950 via-blue-900/70 to-slate-950 p-6 text-white sm:grid-cols-2">
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
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-blue-700"
              >
                <PlusCircle className="size-4" aria-hidden="true" />
                Add Event
              </Link>
              <Link
                href="/officer/announcements/new"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/30 bg-white/[0.06] px-5 text-sm font-semibold text-white"
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
