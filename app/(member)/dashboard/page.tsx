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
      tone: "border-slate-700 bg-[#02040a] text-white",
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
      tone: "border-blue-300/30 text-blue-100",
    },
    {
      label: "Upcoming",
      value: String(upcomingActivities.length),
      description: "Published activities",
      icon: CalendarDays,
      tone: "bg-[#02040a] text-white",
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
    <main className="relative overflow-hidden bg-[#02040a] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.22),transparent_30%),radial-gradient(circle_at_80%_4%,rgba(249,115,22,0.12),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(147,197,253,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,253,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="mx-auto max-w-[96rem]">
        <section className="relative overflow-hidden border-y border-white/10 bg-[#02040a]/90 p-6 text-white sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/30 to-transparent" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-52 w-96 bg-orange-500/10 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 border border-blue-300/25 px-4 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-blue-100">
                <Sparkles className="size-4" aria-hidden="true" />
                Member portal
              </p>
              <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-tight sm:text-6xl">
                Welcome,{" "}
                <span className="bg-gradient-to-r from-blue-100 via-blue-300 to-violet-200 bg-clip-text text-transparent">
                  {displayName}
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Your central workspace for membership, announcements,
                registered activities, and upcoming organization dates.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 border border-emerald-300/30 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-emerald-100">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  {profile?.member_status ?? "active"}
                </span>
                <span className="inline-flex items-center gap-2 border border-blue-300/30 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-blue-100">
                  <UserRound className="size-4" aria-hidden="true" />
                  {formatRole(profile?.role)}
                </span>
              </div>
            </div>

            <aside className="border-l border-white/10 bg-black/20 p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center border border-white/10 text-blue-100">
                  <UserRound className="size-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">{displayName}</h2>
                  <p className="mt-1 truncate text-sm text-slate-300">
                    {user.email}
                  </p>
                  <p className="mt-3 inline-flex border border-white/10 px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-blue-100">
                    {formatRole(profile?.role)}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 border-y border-white/10 py-4 text-sm text-slate-200">
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
                  className="inline-flex h-10 items-center justify-center bg-white px-4 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
                >
                  View Profile
                </Link>
                <Link
                  href="/profile/edit"
                  className="inline-flex h-10 items-center justify-center border border-white/15 px-4 text-sm font-semibold text-white transition hover:border-blue-300/50 hover:text-blue-100"
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
                className="border-t border-white/10 bg-black/15 p-5 transition hover:border-blue-300/40"
              >
                <div className={`flex size-11 items-center justify-center border ${stat.tone}`}>
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
          <article className="border-t border-white/10 bg-black/15 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
                  Updates
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
                  Latest announcements
                </h2>
              </div>
              <Link
                href="/announcements"
                className="inline-flex items-center gap-2 border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-300/40 hover:text-blue-100"
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
                    className="grid gap-4 border-t border-white/10 p-4 transition hover:border-blue-300/40 sm:grid-cols-[10rem_1fr]"
                  >
                    {item.image_url ? (
                      <div className="relative aspect-video overflow-hidden  bg-slate-900">
                        <Image
                          src={item.image_url}
                          alt={`${item.title} cover`}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center  bg-[#02040a] text-blue-100">
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
                <p className="border border-dashed border-white/15 bg-[#02040a]/60 p-5 text-sm text-slate-300">
                  No announcements yet.
                </p>
              )}
            </div>
          </article>

          <article className="border-t border-white/10 bg-black/15 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
                  Activities
                </p>
                <h2 className="mt-1 text-2xl font-black text-white">
                  My Activities
                </h2>
              </div>
              <Link
                href="/my-activities"
                className="inline-flex items-center gap-2 border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-300/40 hover:text-blue-100"
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
                      className="flex gap-4 border-t border-white/10 p-3 transition hover:border-blue-300/40"
                    >
                      <div className="relative aspect-video w-28 shrink-0 overflow-hidden  bg-slate-900">
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
                <p className="border border-dashed border-white/15 bg-[#02040a]/60 p-4 text-sm text-slate-300">
                  You have not registered for any activities yet.
                </p>
              )}
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="border-t border-white/10 bg-black/15 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
                  Calendar
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Upcoming dates
                </h2>
              </div>
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-300/40 hover:text-blue-100"
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
                      className="flex items-center gap-4 border-t border-white/10 p-4 transition hover:border-blue-300/40"
                    >
                      <span className="flex size-14 shrink-0 flex-col items-center justify-center border border-white/10 bg-black/40 text-white">
                        <span className="text-xs font-bold uppercase text-blue-200">
                          {date.month}
                        </span>
                        <span className="text-xl font-black">{date.day}</span>
                      </span>
                      <span className="min-w-0">
                        <span className={`inline-flex  border px-2.5 py-1 text-xs font-semibold ${item.tone}`}>
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
                <p className="border border-dashed border-white/15 bg-[#02040a]/60 p-4 text-sm text-slate-300">
                  No calendar events available yet.
                </p>
              )}
            </div>
          </article>

          <article className="border-t border-white/10 bg-black/15 p-6 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
                  Profile summary
                </p>
                <h2 className="mt-1 text-2xl font-black">{displayName}</h2>
                <p className="mt-2 text-sm text-slate-300">{user.email}</p>
              </div>
              <div className="flex size-16 shrink-0 items-center justify-center border border-white/10 text-blue-100">
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
                  className="border-t border-white/10 p-4"
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
                className="inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
              >
                View Profile
              </Link>
              <Link
                href="/profile/edit"
                className="inline-flex h-11 items-center justify-center border border-white/20 px-5 text-sm font-semibold text-white transition hover:border-blue-300/40 hover:text-blue-100"
              >
                Edit Profile
              </Link>
            </div>
          </article>
        </section>

        {isOfficerEventCreator ? (
          <section className="relative mt-6 grid gap-4 overflow-hidden border-y border-white/10 bg-black/20 p-6 text-white sm:grid-cols-2">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/35 to-transparent" />
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-orange-100">
                Officer access
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Publish organization updates
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Create official events and announcements from the officer tools.
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3 sm:justify-end">
              <Link
                href="/officer/events/new"
                className="inline-flex h-11 items-center justify-center gap-2 bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
              >
                <PlusCircle className="size-4" aria-hidden="true" />
                Add Event
              </Link>
              <Link
                href="/officer/announcements/new"
                className="inline-flex h-11 items-center justify-center gap-2 border border-white/30 px-5 text-sm font-semibold text-white transition hover:border-blue-300/50 hover:text-blue-100"
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
