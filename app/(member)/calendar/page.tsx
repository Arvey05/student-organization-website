import { CalendarDays, MapPin, Megaphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MemberPageHeader } from "@/components/member/page-header";
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

function getItemClasses(item: CalendarItem) {
  if (item.kind === "announcement") {
    return "border-violet-200 bg-violet-50 text-violet-800";
  }

  if (item.isRegistered) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  return "border-blue-200 bg-blue-50 text-blue-800";
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
  const itemsByDate = new Map<string, CalendarItem[]>();

  calendarItems.forEach((item) => {
    const key = getDateKey(item.startsAt);
    const dayItems = itemsByDate.get(key) ?? [];
    dayItems.push(item);
    itemsByDate.set(key, dayItems);
  });

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <MemberPageHeader
          eyebrow="Calendar"
          title="University and organization calendar"
          description="Track upcoming activities, deadlines, and organization events from your member account."
        />

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {getMonthLabel(anchorDate)}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Month overview for activities and announcements.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-700">
                Activity
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700">
                Registered
              </span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-violet-700">
                Announcement
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-7 border-b border-l border-slate-200 text-center text-xs font-bold uppercase text-slate-500">
            {weekDays.map((day) => (
              <div key={day} className="border-r border-t border-slate-200 py-3">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 border-l border-slate-200 sm:grid-cols-7">
            {monthDays.map((day) => {
              const key = getDateKey(day);
              const dayItems = itemsByDate.get(key) ?? [];
              const isOutsideMonth = day.getMonth() !== currentMonth;

              return (
                <div
                  key={key}
                  className="min-h-36 border-b border-r border-slate-200 bg-white p-3"
                >
                  <p
                    className={`text-sm font-bold ${
                      isOutsideMonth ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {getDayNumber(day)}
                  </p>
                  <div className="mt-3 space-y-2">
                    {dayItems.slice(0, 3).map((item) =>
                      item.href ? (
                        <Link
                          key={`${item.kind}-${item.id}`}
                          href={item.href}
                          className={`block rounded-xl border px-3 py-2 text-left text-xs font-semibold transition hover:-translate-y-0.5 ${getItemClasses(
                            item,
                          )}`}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <div
                          key={`${item.kind}-${item.id}`}
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold ${getItemClasses(
                            item,
                          )}`}
                        >
                          {item.title}
                        </div>
                      ),
                    )}
                    {dayItems.length > 3 ? (
                      <p className="text-xs font-semibold text-slate-500">
                        +{dayItems.length - 3} more
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Activity agenda
            </h2>
            <div className="mt-5 space-y-4">
              {calendarItems.filter((item) => item.kind === "activity")
                .length ? (
                calendarItems
                  .filter((item) => item.kind === "activity")
                  .map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`block rounded-2xl border p-4 transition hover:-translate-y-1 ${getItemClasses(
                        item,
                      )}`}
                    >
                      <div className="flex gap-4">
                        {item.imageUrl ? (
                          <div className="relative hidden aspect-video w-36 shrink-0 overflow-hidden rounded-xl sm:block">
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
                          <p className="flex items-center gap-2 text-sm font-semibold">
                            <CalendarDays
                              className="size-4"
                              aria-hidden="true"
                            />
                            {formatDateTimeRange(item.startsAt, item.endsAt)}
                          </p>
                          <h3 className="mt-2 text-lg font-bold text-slate-950">
                            {item.title}
                          </h3>
                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="size-4" aria-hidden="true" />
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  No activities available yet.
                </p>
              )}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Announcement details
            </h2>
            <div className="mt-5 space-y-4">
              {calendarItems.filter((item) => item.kind === "announcement")
                .length ? (
                calendarItems
                  .filter((item) => item.kind === "announcement")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-violet-200 bg-violet-50 p-4"
                    >
                      {item.imageUrl ? (
                        <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                          <Image
                            src={item.imageUrl}
                            alt={`${item.title} cover`}
                            fill
                            sizes="(min-width: 1024px) 40vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <p className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                        <Megaphone className="size-4" aria-hidden="true" />
                        {item.endsAt
                          ? formatDateTimeRange(item.startsAt, item.endsAt)
                          : formatDateTime(item.startsAt)}
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                      {item.location ? (
                        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
                          <MapPin className="size-4" aria-hidden="true" />
                          {item.location}
                        </p>
                      ) : null}
                    </div>
                  ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
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
