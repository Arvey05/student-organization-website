import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Handshake,
  LogIn,
  MapPin,
  Megaphone,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  getAnnouncements,
  getPublicActivities,
  type ActivityRow,
  type AnnouncementRow,
} from "@/lib/member/activity-data";
import { formatDateTime, formatDateTimeRange } from "@/lib/member/display";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const benefits = [
  {
    title: "One member hub",
    description:
      "Access profile details, activities, announcements, calendars, and registered programs from a focused portal.",
    icon: UsersRound,
  },
  {
    title: "Verified organization updates",
    description:
      "Follow public announcements and member-only notices published through officer-controlled workflows.",
    icon: BadgeCheck,
  },
  {
    title: "Role-ready operations",
    description:
      "Presidents and vice presidents get protected tools for publishing official events and announcements.",
    icon: ShieldCheck,
  },
];

function getAnnouncementDate(announcement: AnnouncementRow) {
  return (
    announcement.starts_at ??
    announcement.published_at ??
    announcement.created_at
  );
}

function ActivityVisual({
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
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.68),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(14,165,233,0.26),transparent_25%),linear-gradient(135deg,#020617,#0f172a_50%,#1d4ed8)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_18px)] opacity-25" />
      <div className="absolute bottom-4 left-6 right-6 h-20 rounded-full bg-blue-500/20 blur-3xl" />
    </div>
  );
}

function PublicActivityCard({
  activity,
  joinHref,
}: {
  activity: ActivityRow;
  joinHref: string;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/20 ring-1 ring-white/5 transition hover:-translate-y-1 hover:border-blue-300/40">
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <ActivityVisual activity={activity} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-slate-950/70 px-3 py-1 text-xs font-semibold capitalize text-white backdrop-blur">
          {activity.status}
        </span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-lg font-black text-white">
          {activity.name}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
          {activity.short_description}
        </p>
        <p className="mt-4 flex items-start gap-2 text-sm font-semibold text-blue-100">
          <CalendarDays className="mt-0.5 size-4 shrink-0" />
          {formatDateTimeRange(activity.starts_at, activity.ends_at)}
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
          <MapPin className="size-4 shrink-0 text-blue-200" />
          <span className="truncate">{activity.location}</span>
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={joinHref}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
          >
            Join
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/activities"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

function PublicAnnouncementCard({
  announcement,
}: {
  announcement: AnnouncementRow;
}) {
  const date = getAnnouncementDate(announcement);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/20 ring-1 ring-white/5 transition hover:-translate-y-1 hover:border-violet-300/35">
      {announcement.image_url ? (
        <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
          <Image
            src={announcement.image_url}
            alt={`${announcement.title} cover`}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
        </div>
      ) : (
        <div className="mb-4 flex aspect-video items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-100">
          <Megaphone className="size-8" aria-hidden="true" />
        </div>
      )}
      <p className="text-sm font-semibold text-violet-200">
        {announcement.starts_at
          ? formatDateTimeRange(announcement.starts_at, announcement.ends_at)
          : formatDateTime(date)}
      </p>
      <h3 className="mt-2 text-lg font-black text-white">
        {announcement.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
        {announcement.content}
      </p>
    </article>
  );
}

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [activities, announcements] = await Promise.all([
    getPublicActivities(),
    getAnnouncements(),
  ]);
  const upcomingActivities = activities
    .filter((activity) => activity.status === "upcoming")
    .slice(0, 3);
  const publicAnnouncements = announcements
    .filter((announcement) => announcement.is_public)
    .slice(0, 3);
  const featuredActivity = upcomingActivities[0] ?? activities[0];
  const featuredAnnouncement = publicAnnouncements[0];
  const activitiesHref = user ? "/member/activities" : "/activities";
  const joinHref = user ? "/member/activities" : "/login";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />

      <main>
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-slate-950">
          {featuredActivity?.image_url ? (
            <Image
              src={featuredActivity.image_url}
              alt={`${featuredActivity.name} cover`}
              fill
              priority
              sizes="100vw"
              className="-z-30 object-cover opacity-30"
            />
          ) : null}
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_12%,rgba(37,99,235,0.48),transparent_30%),radial-gradient(circle_at_82%_4%,rgba(14,165,233,0.2),transparent_24%),linear-gradient(180deg,#020617,#0f172a_78%,#020617)]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/82 to-slate-950/35" />

          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 shadow-lg shadow-black/20 backdrop-blur">
                <BadgeCheck className="size-4" aria-hidden="true" />
                Official Student Organization Platform
              </div>

              <h1 className="mt-8 text-5xl font-black tracking-tight sm:text-7xl">
                Empowering students through leadership, service, and community.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                A polished digital home for members to discover public
                programs, follow official updates, and move into a secure member
                portal when they are ready to participate.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={user ? "/dashboard" : "/signup"}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-slate-950 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5"
                >
                  {user ? "Open Dashboard" : "Join Now"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href={activitiesHref}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  View Activities
                </Link>
              </div>
            </div>

            <div className="grid content-end gap-4">
              {featuredActivity ? (
                <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.08] shadow-2xl shadow-black/30 ring-1 ring-white/5 backdrop-blur">
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <ActivityVisual activity={featuredActivity} priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                      Featured activity
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white">
                      {featuredActivity.name}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {formatDateTimeRange(
                        featuredActivity.starts_at,
                        featuredActivity.ends_at,
                      )}
                    </p>
                    <Link
                      href={joinHref}
                      className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-blue-500 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-400"
                    >
                      {user ? "Open Activity" : "Log in to Join"}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ) : (
                <article className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.05] p-6 text-sm text-slate-300">
                  No public activities yet.
                </article>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {featuredAnnouncement ? (
                  <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/20 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
                      Latest announcement
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-lg font-black text-white">
                      {featuredAnnouncement.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                      {featuredAnnouncement.content}
                    </p>
                  </article>
                ) : null}

                <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/20 backdrop-blur">
                  <Handshake className="size-6 text-blue-200" aria-hidden="true" />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Campus credibility
                  </p>
                  <p className="mt-2 font-bold text-white">
                    Connected with school offices, partners, and community
                    programs.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-slate-950 py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
                Organization identity
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Built for students who organize, serve, and lead.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                BulSU MSC needs a platform that feels credible to visitors and
                useful to members. The public site introduces the organization;
                the authenticated portal handles the work.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/20 ring-1 ring-white/5 transition hover:-translate-y-1 hover:border-blue-300/35"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-100 ring-1 ring-blue-300/20">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-xl font-black text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
                  Public activities
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Upcoming opportunities to participate
                </h2>
              </div>
              <Link
                href="/activities"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Browse All
              </Link>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {upcomingActivities.length ? (
                upcomingActivities.map((activity) => (
                  <PublicActivityCard
                    key={activity.id}
                    activity={activity}
                    joinHref={joinHref}
                  />
                ))
              ) : (
                <article className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-sm text-slate-300 lg:col-span-3">
                  No public upcoming activities are available yet.
                </article>
              )}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-slate-900/60 py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">
                Announcements
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Public updates from the organization
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                Visitors see only public announcements. Members can log in for
                the full announcement feed and member-only updates.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={user ? "/dashboard" : "/login"}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  {user ? "Open Dashboard" : "Log In for Member Updates"}
                  <LogIn className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Learn About Us
                </Link>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {publicAnnouncements.length ? (
                publicAnnouncements.map((announcement) => (
                  <PublicAnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                  />
                ))
              ) : (
                <article className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-sm text-slate-300 md:col-span-2">
                  No public announcements are available yet.
                </article>
              )}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/25 ring-1 ring-white/5 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
                    Partners and credibility
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-white">
                    A public face for official student organization work.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    The website keeps public visitors informed while giving
                    members a secure space for registration, calendars, and
                    official updates.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {["School Logo", "OSOA Logo", "Government Logo"].map((item) => (
                    <div
                      key={item}
                      className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-950/50 px-3 text-center text-xs font-semibold text-slate-400"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
