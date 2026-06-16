import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Handshake,
  LogIn,
  Megaphone,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getAnnouncements,
  getPublicActivities,
  type ActivityRow,
  type AnnouncementRow,
} from "@/lib/member/activity-data";
import { formatDateTime, formatDateTimeRange } from "@/lib/member/display";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const highlights = [
  {
    title: "Member-first dashboard",
    description:
      "Give students one organized place for updates, activities, calendars, membership status, and profile details.",
    icon: UsersRound,
  },
  {
    title: "Officer-ready workflows",
    description:
      "Prepare clear role-based paths for presidents and vice presidents to publish official events and programs.",
    icon: ShieldCheck,
  },
  {
    title: "Student-friendly design",
    description:
      "Use a clean, responsive interface that feels modern while staying simple enough for daily organization use.",
    icon: Sparkles,
  },
];

function getAnnouncementDate(announcement: AnnouncementRow) {
  return (
    announcement.starts_at ??
    announcement.published_at ??
    announcement.created_at
  );
}

function PublicActivityCard({
  activity,
  userHref,
}: {
  activity: ActivityRow;
  userHref: string;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/60">
      <div className="relative aspect-video bg-slate-100">
        {activity.image_url ? (
          <Image
            src={activity.image_url}
            alt={`${activity.name} cover`}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.36),transparent_32%),linear-gradient(135deg,#dbeafe,#ede9fe)]" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-blue-700 backdrop-blur">
          {activity.status}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-950">{activity.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {activity.short_description}
        </p>
        <p className="mt-4 flex items-start gap-2 text-sm font-semibold text-slate-700">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-blue-600" />
          {formatDateTimeRange(activity.starts_at, activity.ends_at)}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href={userHref} className="gap-2">
            Join
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/activities" variant="secondary">
            View Activities
          </ButtonLink>
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
    <article className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">
      {announcement.image_url ? (
        <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={announcement.image_url}
            alt={`${announcement.title} cover`}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="mb-4 flex aspect-video items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
          <Megaphone className="size-8" aria-hidden="true" />
        </div>
      )}
      <p className="text-sm font-semibold text-violet-700">
        {announcement.starts_at
          ? formatDateTimeRange(announcement.starts_at, announcement.ends_at)
          : formatDateTime(date)}
      </p>
      <h3 className="mt-2 text-lg font-bold text-slate-950">
        {announcement.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
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
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <main>
        <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white">
          {featuredActivity?.image_url ? (
            <Image
              src={featuredActivity.image_url}
              alt={`${featuredActivity.name} cover`}
              fill
              priority
              sizes="100vw"
              className="-z-20 object-cover opacity-18"
            />
          ) : null}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(226,232,240,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.8)_1px,transparent_1px)] bg-[size:44px_44px]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.2),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.16),transparent_26%),linear-gradient(180deg,rgba(248,250,252,0.86),#f8fafc_82%)]" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
                <BadgeCheck className="size-4" aria-hidden="true" />
                Official Student Organization Platform
              </div>

              <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Empowering Students Through Leadership, Service, and Community
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                A modern digital home for members to discover programs, follow
                announcements, manage profiles, and stay connected with the
                organization throughout the academic year.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:w-auto sm:flex-row">
                <ButtonLink href={user ? "/dashboard" : "/signup"} className="gap-2">
                  {user ? "Open Portal" : "Join Now"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={activitiesHref} variant="secondary">
                  View Activities
                </ButtonLink>
              </div>
            </div>

            <div className="grid content-start gap-4">
              {featuredActivity ? (
                <article className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-2xl shadow-slate-200/70 backdrop-blur">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      <CalendarDays className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Featured activity
                      </p>
                      <h2 className="mt-1 text-xl font-black text-slate-950">
                        {featuredActivity.name}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {formatDateTimeRange(
                          featuredActivity.starts_at,
                          featuredActivity.ends_at,
                        )}
                      </p>
                    </div>
                  </div>
                </article>
              ) : (
                <article className="rounded-3xl border border-dashed border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur">
                  <p className="text-sm font-semibold text-slate-600">
                    No public activities yet.
                  </p>
                </article>
              )}

              {featuredAnnouncement ? (
                <article className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-xl shadow-slate-200/70 backdrop-blur">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                      <Megaphone className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Latest announcement
                      </p>
                      <h2 className="mt-1 text-xl font-black text-slate-950">
                        {featuredAnnouncement.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {featuredAnnouncement.content}
                      </p>
                    </div>
                  </div>
                </article>
              ) : null}

              <article className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-xl shadow-slate-200/70 backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Handshake className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Partners
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      Campus offices and community links
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="What members get"
              title="A clearer way to participate in organization life"
              description="The platform is designed around the common student workflows: joining, checking updates, reviewing activities, and keeping profile information current."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-100/60"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Public activities
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Upcoming opportunities to join
                </h2>
              </div>
              <ButtonLink href="/activities" variant="secondary">
                Browse All
              </ButtonLink>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {upcomingActivities.length ? (
                upcomingActivities.map((activity) => (
                  <PublicActivityCard
                    key={activity.id}
                    activity={activity}
                    userHref={joinHref}
                  />
                ))
              ) : (
                <article className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 lg:col-span-3">
                  No public upcoming activities are available yet.
                </article>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">
                  Announcements
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Booths, bazaars, reminders, and updates
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  Public announcements appear here when officers publish updates
                  for students and visitors.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={user ? "/dashboard" : "/login"} className="gap-2">
                    {user ? "Open Dashboard" : "Log In for Member Updates"}
                    <LogIn className="size-4" aria-hidden="true" />
                  </ButtonLink>
                  <ButtonLink href="/about" variant="secondary">
                    Learn About Us
                  </ButtonLink>
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
                  <article className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 md:col-span-2">
                    No public announcements are available yet.
                  </article>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
