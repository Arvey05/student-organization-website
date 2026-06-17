import {
  ArrowRight,
  CalendarCheck,
  Clock,
  MapPin,
  TicketCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  cancelActivityRegistration,
  registerForActivity,
} from "@/app/member/actions";
import {
  getActivities,
  getRegisteredActivities,
  type ActivityRow,
  type RegisteredActivity,
} from "@/lib/member/activity-data";
import { formatDateTimeRange } from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";

function isOngoingOrNear(activity: ActivityRow, now: Date) {
  const startsAt = new Date(activity.starts_at);
  const endsAt = activity.ends_at ? new Date(activity.ends_at) : startsAt;
  const oneWeekFromNow = new Date(now);
  oneWeekFromNow.setDate(now.getDate() + 7);

  return (
    (startsAt <= now && endsAt >= now) ||
    (startsAt >= now && startsAt <= oneWeekFromNow)
  );
}

function getFeaturedActivity(activities: ActivityRow[], now: Date) {
  const ongoingOrNear = activities
    .filter((activity) => activity.status === "upcoming")
    .filter((activity) => isOngoingOrNear(activity, now))
    .sort(
      (firstActivity, secondActivity) =>
        new Date(firstActivity.starts_at).getTime() -
        new Date(secondActivity.starts_at).getTime(),
    );

  if (ongoingOrNear[0]) {
    return ongoingOrNear[0];
  }

  return [...activities]
    .filter(
      (activity) =>
        activity.status === "past" || activity.status === "completed",
    )
    .sort(
      (firstActivity, secondActivity) =>
        new Date(secondActivity.starts_at).getTime() -
        new Date(firstActivity.starts_at).getTime(),
    )[0];
}

function getRegistrationByActivityId(registeredActivities: RegisteredActivity[]) {
  return new Map(
    registeredActivities.map(({ activity, registration }) => [
      activity.id,
      registration,
    ]),
  );
}

function ActivityAction({
  activity,
  registeredActivities,
}: {
  activity: ActivityRow;
  registeredActivities: RegisteredActivity[];
}) {
  const registration = getRegistrationByActivityId(registeredActivities).get(
    activity.id,
  );
  const activeRegistration =
    registration && registration.status !== "cancelled" ? registration : null;

  if (activity.status !== "upcoming") {
    return (
      <Link
        href={`/member/activities/${activity.id}`}
        className="inline-flex h-11 items-center justify-center rounded-md border border-white/20 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:border-blue-300/40"
      >
        View Details
      </Link>
    );
  }

  return activeRegistration ? (
    <form action={cancelActivityRegistration}>
      <input type="hidden" name="activity_id" value={activity.id} />
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md border border-red-300/40 bg-red-500/10 px-5 text-sm font-semibold text-red-100 transition hover:bg-red-500/15"
      >
        Cancel Registration
      </button>
    </form>
  ) : (
    <form action={registerForActivity}>
      <input type="hidden" name="activity_id" value={activity.id} />
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md bg-blue-500 px-5 text-sm font-semibold text-white transition hover:bg-blue-400"
      >
        Join Event
      </button>
    </form>
  );
}

function ActivityCover({
  activity,
  priority = false,
}: {
  activity: ActivityRow;
  priority?: boolean;
}) {
  if (activity.image_url) {
    return (
      <Image
        src={activity.image_url}
        alt={`${activity.name} cover`}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 1280px, 100vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#02040a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(37,99,235,0.72),transparent_28%),radial-gradient(circle_at_80%_12%,rgba(14,165,233,0.32),transparent_24%),linear-gradient(135deg,#020617,#0f172a_45%,#1d4ed8)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_18px)] opacity-30" />
      <div className="absolute bottom-4 left-5 right-5 h-16  bg-blue-500/20 blur-2xl" />
    </div>
  );
}

function ActivityLandscapeCard({
  activity,
  registeredActivities,
}: {
  activity: ActivityRow;
  registeredActivities: RegisteredActivity[];
}) {
  return (
    <article className="group relative aspect-video w-[min(86vw,28rem)] shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#02040a] transition duration-300 hover:border-blue-300/50">
      <div className="absolute inset-0 bg-slate-900">
        <ActivityCover activity={activity} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent opacity-80" />
      <span className="absolute left-4 top-4 border border-white/15 bg-black/70 px-3 py-1 text-xs font-semibold capitalize text-white">
        {activity.status}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <Link
          href={`/member/activities/${activity.id}`}
          className="line-clamp-2 text-lg font-black tracking-tight text-white transition hover:text-blue-200"
        >
          {activity.name}
        </Link>
        <p className="mt-2 flex items-start gap-2 text-xs font-semibold leading-5 text-slate-200">
          <Clock
            className="mt-0.5 size-3.5 shrink-0 text-blue-200"
            aria-hidden="true"
          />
          {formatDateTimeRange(activity.starts_at, activity.ends_at)}
        </p>
        <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-200">
          <MapPin
            className="size-3.5 shrink-0 text-blue-200"
            aria-hidden="true"
          />
          <span className="truncate">{activity.location}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ActivityAction
            activity={activity}
            registeredActivities={registeredActivities}
          />
          {activity.status === "upcoming" ? (
            <Link
              href={`/member/activities/${activity.id}`}
              className="inline-flex h-11 items-center justify-center rounded-md border border-white/20 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:border-blue-300/40"
            >
              Details
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ActivityRowSection({
  title,
  activities,
  registeredActivities,
}: {
  title: string;
  activities: ActivityRow[];
  registeredActivities: RegisteredActivity[];
}) {
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
            Browse
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
            {title}
          </h2>
        </div>
        <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-semibold text-slate-300">
          {activities.length} {activities.length === 1 ? "event" : "events"}
        </span>
      </div>

      {activities.length ? (
        <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-5 [scrollbar-color:rgba(96,165,250,0.45)_transparent]">
          {activities.map((activity) => (
            <ActivityLandscapeCard
              key={activity.id}
              activity={activity}
              registeredActivities={registeredActivities}
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 border-y border-dashed border-white/15 bg-[#02040a] p-5 text-sm text-slate-300">
          No activities available in this section yet.
        </p>
      )}
    </section>
  );
}

export default async function MemberActivitiesPage() {
  const { user } = await getCurrentMemberProfile();
  const [activities, registeredActivities] = await Promise.all([
    getActivities(),
    getRegisteredActivities(user.id),
  ]);
  const now = new Date();
  const featuredActivity = getFeaturedActivity(activities, now);
  const upcomingActivities = activities.filter(
    (activity) => activity.status === "upcoming",
  );
  const pastActivities = activities.filter(
    (activity) =>
      activity.status === "past" || activity.status === "completed",
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#02040a] pb-12 text-white">
      <section className="relative min-h-[36rem] overflow-hidden">
        {featuredActivity ? (
          <>
            <ActivityCover activity={featuredActivity} priority />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/78 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 to-transparent" />
            <div className="relative z-10 mx-auto flex min-h-[36rem] max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-blue-100">
                  <CalendarCheck className="size-4" aria-hidden="true" />
                  Featured Activity
                </p>
                <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
                  {featuredActivity.name}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
                  {featuredActivity.short_description}
                </p>
                <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-200 sm:grid-cols-2">
                  <p className="flex items-start gap-2 rounded-md border border-white/10 bg-white/[0.06] p-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-blue-200" aria-hidden="true" />
                    {formatDateTimeRange(
                      featuredActivity.starts_at,
                      featuredActivity.ends_at,
                    )}
                  </p>
                  <p className="flex items-start gap-2 rounded-md border border-white/10 bg-white/[0.06] p-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-blue-200" aria-hidden="true" />
                    {featuredActivity.location}
                  </p>
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ActivityAction
                    activity={featuredActivity}
                    registeredActivities={registeredActivities}
                  />
                  <Link
                    href={`/member/activities/${featuredActivity.id}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/30 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:border-blue-300/40"
                  >
                    View Details
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="relative mx-auto flex min-h-[30rem] max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.28),transparent_30%)]" />
            <div className="relative border-y border-white/10 bg-[#02040a] p-8">
              <p className="flex items-center gap-2 text-sm font-semibold text-blue-200">
                <TicketCheck className="size-4" aria-hidden="true" />
                Activities
              </p>
              <h1 className="mt-3 text-4xl font-black">No activities yet</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Upcoming activities and past event highlights will appear here
                once officers publish real organization events.
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="absolute -top-28 left-1/2 h-56 w-[42rem] -translate-x-1/2  bg-blue-500/15 blur-3xl" />
        <div className="relative -mt-2 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
                Activities
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                Discover and join organization events
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Browse real upcoming programs and past activity highlights from
                the organization.
              </p>
            </div>
            <Link
              href="/my-activities"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-blue-500 px-5 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              My Activities
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <ActivityRowSection
            title="Upcoming activities"
            activities={upcomingActivities}
            registeredActivities={registeredActivities}
          />
          <ActivityRowSection
            title="Past activities"
            activities={pastActivities}
            registeredActivities={registeredActivities}
          />
        </div>
      </div>
    </main>
  );
}
