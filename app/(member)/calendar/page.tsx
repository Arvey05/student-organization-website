import {
  CalendarDays,
  CheckCircle2,
  Circle,
  MapPin,
  Megaphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  getActivities,
  getAnnouncements,
  getRegisteredActivities,
  type ActivityRow,
  type AnnouncementRow,
} from "@/lib/member/activity-data";
import {
  formatDateTime,
  formatDateTimeRange,
} from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";

type CalendarItem =
  | {
      id: string;
      kind: "activity";
      title: string;
      startsAt: string;
      endsAt: string | null;
      description: string;
      location: string;
      imageUrl: string | null;
      href: string;
      isRegistered: boolean;
    }
  | {
      id: string;
      kind: "announcement";
      title: string;
      startsAt: string;
      endsAt: string | null;
      description: string;
      location: string | null;
      imageUrl: string | null;
      href: null;
      isRegistered: false;
    };

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + days);
  return nextDate;
}

function getDateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getDayNumber(date: Date) {
  return new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
}

function getCalendarDays(anchorDate: Date) {
  const monthStart = startOfMonth(anchorDate);
  const monthEnd = endOfMonth(anchorDate);
  const gridStart = addDays(monthStart, -monthStart.getDay());
  const gridEnd = addDays(monthEnd, 6 - monthEnd.getDay());
  const days: Date[] = [];

  for (
    let currentDate = gridStart;
    currentDate <= gridEnd;
    currentDate = addDays(currentDate, 1)
  ) {
    days.push(currentDate);
  }

  return days;
}

function activityToCalendarItem(
  activity: ActivityRow,
  registeredActivityIds: Set<string>,
): CalendarItem {
  return {
    id: activity.id,
    kind: "activity",
    title: activity.name,
    startsAt: activity.starts_at,
    endsAt: activity.ends_at,
    description: activity.short_description,
    location: activity.location,
    imageUrl: activity.image_url,
    href: `/member/activities/${activity.id}`,
    isRegistered: registeredActivityIds.has(activity.id),
  };
}

function announcementToCalendarItem(
  announcement: AnnouncementRow,
): CalendarItem {
  return {
    id: announcement.id,
    kind: "announcement",
    title: announcement.title,
    startsAt:
      announcement.starts_at ??
      announcement.published_at ??
      announcement.created_at,
    endsAt: announcement.ends_at,
    description: announcement.content,
    location: announcement.location,
    imageUrl: announcement.image_url,
    href: null,
    isRegistered: false,
  };
}

function getChipClasses(item: CalendarItem) {
  if (item.kind === "announcement") {
    return "border-violet-300/30 bg-violet-400/15 text-violet-100 hover:border-violet-200/60 hover:bg-violet-400/25";
  }

  if (item.isRegistered) {
    return "border-teal-300/30 bg-teal-400/15 text-teal-100 hover:border-teal-200/60 hover:bg-teal-400/25";
  }

  return "border-blue-300/30 text-blue-100 hover:border-blue-200/60 hover:bg-blue-400/10";
}

function getAgendaClasses(item: CalendarItem) {
  if (item.kind === "announcement") {
    return "border-violet-300/20 bg-violet-400/10";
  }

  if (item.isRegistered) {
    return "border-teal-300/20 bg-teal-400/10";
  }

  return "border-blue-300/20 bg-black/15";
}

function isActivityItem(
  item: CalendarItem,
): item is Extract<CalendarItem, { kind: "activity" }> {
  return item.kind === "activity";
}

function isAnnouncementItem(
  item: CalendarItem,
): item is Extract<CalendarItem, { kind: "announcement" }> {
  return item.kind === "announcement";
}

export default async function CalendarPage() {
  const { user } = await getCurrentMemberProfile();
  const [activities, announcements, registeredActivities] = await Promise.all([
    getActivities(),
    getAnnouncements(),
    getRegisteredActivities(user.id),
  ]);
  const registeredActivityIds = new Set(
    registeredActivities.map(({ activity }) => activity.id),
  );
  const calendarItems = [
    ...activities.map((activity) =>
      activityToCalendarItem(activity, registeredActivityIds),
    ),
    ...announcements.map(announcementToCalendarItem),
  ].sort(
    (firstItem, secondItem) =>
      new Date(firstItem.startsAt).getTime() -
      new Date(secondItem.startsAt).getTime(),
  );
  const anchorDate = calendarItems.length
    ? new Date(calendarItems[0].startsAt)
    : new Date();
  const monthDays = getCalendarDays(anchorDate);
  const currentMonth = anchorDate.getMonth();
  const todayKey = getDateKey(new Date());
  const itemsByDate = new Map<string, CalendarItem[]>();
  const activityItems = calendarItems.filter(isActivityItem);
  const announcementItems = calendarItems.filter(isAnnouncementItem);

  calendarItems.forEach((item) => {
    const key = getDateKey(item.startsAt);
    const dayItems = itemsByDate.get(key) ?? [];
    dayItems.push(item);
    itemsByDate.set(key, dayItems);
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02001f] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_18%_8%,rgba(0,108,249,0.18),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(255,185,0,0.1),transparent_24%)]" />
      <div className="mx-auto max-w-[96rem]">
        <section className="overflow-hidden border-y border-white/10 bg-black/15">
          <div className="relative border-b border-white/10 bg-[#02001f]/90 p-6 text-white sm:p-8">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/30 to-transparent" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 border border-blue-300/25 px-4 py-2 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-blue-100">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Calendar
                </p>
                <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                  {getMonthLabel(anchorDate)}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Track organization activities and announcements in one clean
                  month view.
                </p>
              </div>

              <div className="grid gap-2 text-xs font-semibold sm:grid-cols-3">
                <span className="inline-flex items-center gap-2 border border-teal-300/30 px-3 py-2 text-teal-100">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Registered activities
                </span>
                <span className="inline-flex items-center gap-2 border border-blue-300/30 px-3 py-2 text-blue-100">
                  <Circle className="size-3.5" aria-hidden="true" />
                  Not registered
                </span>
                <span className="inline-flex items-center gap-2 border border-violet-300/30 px-3 py-2 text-violet-100">
                  <Megaphone className="size-3.5" aria-hidden="true" />
                  Announcements
                </span>
              </div>
            </div>
          </div>

          {calendarItems.length ? (
            <>
              <div className="grid grid-cols-7 border-b border-white/10 bg-white/[0.03] text-center text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                {weekDays.map((day) => (
                  <div key={day} className="border-r border-white/10 py-3 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 bg-white/10 sm:grid-cols-7 sm:gap-px">
                {monthDays.map((day) => {
                  const key = getDateKey(day);
                  const dayItems = itemsByDate.get(key) ?? [];
                  const isOutsideMonth = day.getMonth() !== currentMonth;
                  const isToday = key === todayKey;

                  return (
                    <div
                      key={key}
                      className={`min-h-36 bg-[#02001f]/70 p-3 transition hover:bg-slate-900/90 ${
                        isOutsideMonth ? "bg-[#02001f]/35" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`flex size-8 items-center justify-center  text-sm font-bold ${
                            isToday
                              ? "border border-blue-300 text-blue-100"
                              : isOutsideMonth
                                ? "text-slate-600"
                                : "text-slate-200"
                          }`}
                        >
                          {getDayNumber(day)}
                        </p>
                        {dayItems.length ? (
                          <span className="text-xs font-semibold text-slate-500">
                            {dayItems.length}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {dayItems.slice(0, 4).map((item) =>
                          item.href ? (
                            <Link
                              key={`${item.kind}-${item.id}`}
                              href={item.href}
                              className={`block truncate rounded-md border px-2.5 py-1.5 text-left text-xs font-semibold transition ${getChipClasses(
                                item,
                              )}`}
                            >
                              {item.title}
                            </Link>
                          ) : (
                            <a
                              key={`${item.kind}-${item.id}`}
                              href={`#announcement-${item.id}`}
                              className={`block truncate rounded-md border px-2.5 py-1.5 text-left text-xs font-semibold transition ${getChipClasses(
                                item,
                              )}`}
                            >
                              {item.title}
                            </a>
                          ),
                        )}
                        {dayItems.length > 4 ? (
                          <p className="rounded-md bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-slate-400">
                            +{dayItems.length - 4} more
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="p-6">
              <p className="border-y border-dashed border-white/15 bg-[#02001f] p-6 text-sm text-slate-300">
                No calendar events or announcements are available yet.
              </p>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="border-y border-white/10 bg-black/15 p-5">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
                Agenda
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                Activity schedule
              </h2>
            </div>
            <div className="mt-5 space-y-4">
              {activityItems.length ? (
                activityItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`block border-t p-4 transition hover:border-blue-200/40 ${getAgendaClasses(
                        item,
                      )}`}
                    >
                      <div className="flex gap-4">
                        {item.imageUrl ? (
                          <div className="relative hidden aspect-video w-36 shrink-0 overflow-hidden rounded-md sm:block">
                            <Image
                              src={item.imageUrl}
                              alt={`${item.title} cover`}
                              fill
                              sizes="144px"
                              className="object-cover"
                            />
                          </div>
                        ) : null}
                        <div>
                          <p className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                            <CalendarDays
                              className="size-4"
                              aria-hidden="true"
                            />
                            {formatDateTimeRange(item.startsAt, item.endsAt)}
                          </p>
                          <h3 className="mt-2 text-lg font-bold text-white">
                            {item.title}
                          </h3>
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                            <MapPin className="size-4" aria-hidden="true" />
                            {item.location}
                          </p>
                          <p className="mt-3 inline-flex rounded-md border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-200">
                            {item.isRegistered
                              ? "Registered"
                              : "Not registered"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
              ) : (
                <p className="border-y border-dashed border-white/15 bg-[#02001f] p-4 text-sm text-slate-300">
                  No activities available yet.
                </p>
              )}
            </div>
          </article>

          <article className="border-y border-white/10 bg-black/15 p-5">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-violet-200">
                Announcements
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                Announcement details
              </h2>
            </div>
            <div className="mt-5 space-y-4">
              {announcementItems.length ? (
                announcementItems.map((item) => (
                    <div
                      key={item.id}
                      id={`announcement-${item.id}`}
                      className="scroll-mt-24 border-t border-blue-300/20 p-4 transition target:ring-2 target:ring-blue-300/25"
                    >
                      {item.imageUrl ? (
                        <div className="relative mb-4 aspect-video overflow-hidden rounded-md">
                          <Image
                            src={item.imageUrl}
                            alt={`${item.title} cover`}
                            fill
                            sizes="(min-width: 1024px) 40vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <p className="flex items-center gap-2 text-sm font-semibold text-blue-200">
                        <Megaphone className="size-4" aria-hidden="true" />
                        {item.endsAt
                          ? formatDateTimeRange(item.startsAt, item.endsAt)
                          : formatDateTime(item.startsAt)}
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {item.description}
                      </p>
                      {item.location ? (
                        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
                          <MapPin className="size-4" aria-hidden="true" />
                          {item.location}
                        </p>
                      ) : null}
                    </div>
                  ))
              ) : (
                <p className="border-y border-dashed border-white/15 bg-[#02001f] p-4 text-sm text-slate-300">
                  No announcements available yet.
                </p>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
