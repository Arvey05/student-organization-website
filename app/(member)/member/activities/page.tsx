import { CalendarCheck, Clock, MapPin, TicketCheck } from "lucide-react";
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
    .filter((activity) => activity.status === "past")
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
        className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
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
        className="inline-flex h-11 items-center justify-center rounded-full border border-red-200 bg-white px-5 text-sm font-semibold text-red-700 shadow-sm"
      >
        Cancel Registration
      </button>
    </form>
  ) : (
    <form action={registerForActivity}>
      <input type="hidden" name="activity_id" value={activity.id} />
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20"
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
        className="object-cover"
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.55),transparent_32%),linear-gradient(135deg,#0f172a,#1d4ed8_52%,#7c3aed)]" />
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
    <article className="w-[min(78vw,22rem)] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/60">
      <Link
        href={`/member/activities/${activity.id}`}
        className="relative block aspect-video bg-slate-200"
      >
        <ActivityCover activity={activity} />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-slate-800 backdrop-blur">
          {activity.status}
        </span>
      </Link>
      <div className="p-4">
        <Link
          href={`/member/activities/${activity.id}`}
          className="line-clamp-2 text-base font-bold text-slate-950 transition hover:text-blue-700"
        >
          {activity.name}
        </Link>
        <p className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {formatDateTimeRange(activity.starts_at, activity.ends_at)}
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{activity.location}</span>
        </p>
        <div className="mt-4">
          <ActivityAction
            activity={activity}
            registeredActivities={registeredActivities}
          />
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
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-950">{title}</h2>
        <span className="text-sm font-semibold text-slate-500">
          {activities.length} {activities.length === 1 ? "event" : "events"}
        </span>
      </div>

      {activities.length ? (
        <div className="mt-4 flex gap-4 overflow-x-auto pb-4">
          {activities.map((activity) => (
            <ActivityLandscapeCard
              key={activity.id}
              activity={activity}
              registeredActivities={registeredActivities}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-600">
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
  const upcomingActivities = activities
    .filter((activity) => activity.status === "upcoming")
    .filter((activity) => activity.id !== featuredActivity?.id);
  const pastActivities = activities
    .filter((activity) => activity.status === "past")
    .filter((activity) => activity.id !== featuredActivity?.id);

  return (
    <main className="bg-slate-950 pb-10 text-white">
      <section className="relative min-h-[34rem] overflow-hidden">
        {featuredActivity ? (
          <>
            <ActivityCover activity={featuredActivity} priority />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/10" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
            <div className="relative z-10 mx-auto flex min-h-[34rem] max-w-7xl flex-col justify-end px-4 py-10 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur">
                  <CalendarCheck className="size-4" aria-hidden="true" />
                  Featured Activity
                </p>
                <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
                  {featuredActivity.name}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
                  {featuredActivity.short_description}
                </p>
                <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-200 sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <Clock className="size-4" aria-hidden="true" />
                    {formatDateTimeRange(
                      featuredActivity.starts_at,
                      featuredActivity.ends_at,
                    )}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4" aria-hidden="true" />
                    {featuredActivity.location}
                  </p>
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  {featuredActivity.status === "upcoming" ? (
                    <ActivityAction
                      activity={featuredActivity}
                      registeredActivities={registeredActivities}
                    />
                  ) : null}
                  <Link
                    href={`/member/activities/${featuredActivity.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto flex min-h-[26rem] max-w-7xl flex-col justify-end px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-4 rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                Activities
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Discover and join organization events
              </h2>
            </div>
            <Link
              href="/my-activities"
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-slate-950 px-5 text-sm font-semibold text-white"
            >
              My Activities
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
