import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  CircuitBoard,
  Clock,
  Compass,
  Handshake,
  IdCard,
  Layers3,
  MapPin,
  Megaphone,
  Orbit,
  Radio,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  UsersRound,
  Zap,
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
import type { Database } from "@/types/database";

type PartnerRow = Database["public"]["Tables"]["partners"]["Row"];

const identityItems = [
  {
    title: "Leadership",
    description: "Programs that sharpen initiative, accountability, and service.",
    icon: ShieldCheck,
  },
  {
    title: "Service",
    description: "Community-centered projects with clear coordination and follow-through.",
    icon: Handshake,
  },
  {
    title: "Community",
    description: "A connected member base for updates, participation, and recognition.",
    icon: UsersRound,
  },
  {
    title: "Academic Technology",
    description: "A digital operating layer for student organization work.",
    icon: CircuitBoard,
  },
];

const benefits = [
  { title: "Access official announcements", icon: Bell },
  { title: "Join organization activities", icon: Sparkles },
  { title: "Track registered events", icon: UserRoundCheck },
  { title: "View calendar updates", icon: CalendarDays },
  { title: "Manage member profile", icon: IdCard },
  { title: "Stay connected with officers and partners", icon: Radio },
];

function getAnnouncementDate(announcement: AnnouncementRow) {
  return (
    announcement.starts_at ??
    announcement.published_at ??
    announcement.created_at
  );
}

async function getPublicPartners(): Promise<PartnerRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Unable to load public partners: ${error.message}`);
  }

  return data ?? [];
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(37,99,235,0.62),transparent_32%),radial-gradient(circle_at_80%_8%,rgba(124,58,237,0.36),transparent_28%),linear-gradient(135deg,#020617,#07111f_48%,#0f2a5f)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(147,197,253,0.12)_0_1px,transparent_1px_18px)] opacity-25" />
      <div className="absolute bottom-0 left-1/2 h-24 w-2/3 -translate-x-1/2 bg-blue-500/25 blur-3xl" />
    </div>
  );
}

function PlatformPreview({
  featuredActivity,
  featuredAnnouncement,
}: {
  featuredActivity?: ActivityRow;
  featuredAnnouncement?: AnnouncementRow;
}) {
  return (
    <div className="relative mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-x-8 -top-10 h-32 bg-blue-500/25 blur-3xl" />
      <div className="relative overflow-hidden border border-white/10 bg-[#020712] shadow-2xl shadow-blue-950/50">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
            <Orbit className="size-4" aria-hidden="true" />
            Member portal preview
          </div>
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <span className="size-2 bg-blue-400" />
            Live public data
          </div>
        </div>

        <div className="grid gap-px bg-white/10 lg:grid-cols-[0.85fr_1.15fr_0.85fr]">
          <div className="bg-slate-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Dashboard
            </p>
            <div className="mt-5 space-y-3">
              {["Profile status", "Activities joined", "Calendar sync"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <span className="text-sm text-slate-300">{item}</span>
                    <span className="text-xs font-semibold text-blue-200">
                      {index === 0 ? "Ready" : "Portal"}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="bg-slate-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              Upcoming activity
            </p>
            {featuredActivity ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="group relative aspect-video overflow-hidden bg-slate-900">
                  <ActivityVisual activity={featuredActivity} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                </div>
                <div>
                  <h3 className="line-clamp-2 text-xl font-black text-white">
                    {featuredActivity.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                    {featuredActivity.short_description}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-blue-100">
                    {formatDateTimeRange(
                      featuredActivity.starts_at,
                      featuredActivity.ends_at,
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm text-slate-400">
                No public activity is available for the preview yet.
              </div>
            )}
          </div>

          <div className="bg-slate-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
              Announcement feed
            </p>
            {featuredAnnouncement ? (
              <div className="mt-4 border-l border-blue-400/40 pl-4">
                <h3 className="line-clamp-2 text-lg font-black text-white">
                  {featuredAnnouncement.title}
                </h3>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-300">
                  {featuredAnnouncement.content}
                </p>
              </div>
            ) : (
              <div className="mt-4 border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm text-slate-400">
                No public announcements yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityTile({ activity }: { activity: ActivityRow }) {
  return (
    <article className="group min-w-[280px] overflow-hidden border border-white/10 bg-slate-950 sm:min-w-[340px]">
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <ActivityVisual activity={activity} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
            {activity.status}
          </span>
          <h3 className="mt-1 line-clamp-2 text-lg font-black text-white">
            {activity.name}
          </h3>
          <p className="mt-2 line-clamp-1 text-xs text-slate-300">
            {formatDateTimeRange(activity.starts_at, activity.ends_at)}
          </p>
        </div>
      </div>
    </article>
  );
}

function AnnouncementCard({ announcement }: { announcement: AnnouncementRow }) {
  const date = getAnnouncementDate(announcement);

  return (
    <article className="grid gap-4 border-t border-white/10 py-6 sm:grid-cols-[120px_1fr]">
      <div className="relative aspect-video overflow-hidden border border-white/10 bg-slate-900 sm:aspect-square">
        {announcement.image_url ? (
          <Image
            src={announcement.image_url}
            alt={`${announcement.title} cover`}
            fill
            sizes="120px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-blue-500/10 text-blue-100">
            <Megaphone className="size-7" aria-hidden="true" />
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
          {announcement.starts_at
            ? formatDateTimeRange(announcement.starts_at, announcement.ends_at)
            : formatDateTime(date)}
        </p>
        <h3 className="mt-2 text-xl font-black text-white">
          {announcement.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
          {announcement.content}
        </p>
      </div>
    </article>
  );
}

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [activities, announcements, partners] = await Promise.all([
    getPublicActivities(),
    getAnnouncements(),
    getPublicPartners(),
  ]);

  const upcomingActivities = activities.filter(
    (activity) => activity.status === "upcoming",
  );
  const featuredActivity = upcomingActivities[0] ?? activities[0];
  const activityTiles = activities
    .filter((activity) => activity.id !== featuredActivity?.id)
    .slice(0, 6);
  const publicAnnouncements = announcements
    .filter((announcement) => announcement.is_public)
    .slice(0, 4);
  const featuredAnnouncement = publicAnnouncements[0];
  const joinHref = user ? "/dashboard" : "/signup";
  const registerHref = user ? "/member/activities" : "/login";
  const activitiesHref = user ? "/member/activities" : "/activities";

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      <SiteHeader />

      <main>
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#02040a]">
          <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#02040a_0%,#061121_52%,#02040a_100%)]" />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_58%,rgba(37,99,235,0.34),transparent_25%),radial-gradient(circle_at_50%_82%,rgba(124,58,237,0.28),transparent_28%)]" />
          <div className="absolute inset-x-[-20%] bottom-0 -z-10 h-[46%] origin-bottom bg-[linear-gradient(rgba(96,165,250,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.16)_1px,transparent_1px)] bg-[size:56px_56px] [transform:perspective(520px)_rotateX(62deg)]" />
          <div className="absolute inset-0 -z-10 opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.4)_0.7px,transparent_0.7px)] [background-size:24px_24px]" />
          <div className="absolute left-1/2 top-[46%] -z-10 h-px w-[70vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

          <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col items-center px-4 pb-16 pt-24 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
              <BadgeCheck className="size-4" aria-hidden="true" />
              Official Student Organization Platform
            </div>

            <h1 className="mt-8 max-w-5xl text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
              Empowering Students Through Leadership, Service, and Community
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              A modern digital home for members to discover activities, follow
              announcements, join programs, and stay connected with the
              organization.
            </p>

            <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <Link
                href={joinHref}
                className="inline-flex h-12 items-center justify-center gap-2 bg-blue-500 px-7 text-sm font-black text-white shadow-[0_0_34px_rgba(37,99,235,0.55)] transition hover:bg-blue-400"
              >
                {user ? "Open Dashboard" : "Join Now"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={activitiesHref}
                className="inline-flex h-12 items-center justify-center border border-white/15 bg-white/[0.04] px-7 text-sm font-black text-white transition hover:border-blue-300/50 hover:bg-blue-400/10"
              >
                View Activities
              </Link>
            </div>

            <PlatformPreview
              featuredActivity={featuredActivity}
              featuredAnnouncement={featuredAnnouncement}
            />
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#02040a] py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                Who we are
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                A student organization built for visible impact and disciplined
                execution.
              </h2>
              <div className="mt-8 grid gap-6 text-sm leading-7 text-slate-300 sm:grid-cols-2">
                <p>
                  BulSU MSC serves as a leadership and service community for
                  students who want to contribute to campus life through
                  organized programs and collaborative initiatives.
                </p>
                <p>
                  The platform gives that work a clear digital layer: public
                  discovery, official announcements, member tools, calendars,
                  and secure access for registered members.
                </p>
              </div>
            </div>

            <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              {identityItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="bg-slate-950 p-6">
                    <Icon className="size-7 text-blue-200" aria-hidden="true" />
                    <h3 className="mt-6 text-xl font-black">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#030814] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                Member benefits
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Everything members need to stay aligned.
              </h2>
            </div>

            <div className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="flex items-center gap-4 bg-slate-950 p-5"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center bg-blue-500/15 text-blue-100">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <p className="font-semibold text-slate-100">
                      {benefit.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#02040a] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Featured public activity
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                  The next public signal from the organization.
                </h2>
              </div>
              <Link
                href="/activities"
                className="inline-flex h-11 items-center justify-center border border-white/15 px-5 text-sm font-semibold text-white transition hover:border-blue-300/50"
              >
                Browse public activities
              </Link>
            </div>

            {featuredActivity ? (
              <article className="group mt-10 overflow-hidden border border-white/10 bg-slate-950 lg:grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative min-h-[320px] overflow-hidden bg-slate-900">
                  <ActivityVisual activity={featuredActivity} priority />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/30" />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <span className="w-fit border border-blue-300/25 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                    {featuredActivity.status}
                  </span>
                  <h3 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                    {featuredActivity.name}
                  </h3>
                  <p className="mt-5 text-base leading-8 text-slate-300">
                    {featuredActivity.short_description}
                  </p>
                  <div className="mt-6 space-y-3 text-sm text-slate-300">
                    <p className="flex gap-3">
                      <Clock className="mt-0.5 size-4 text-blue-200" />
                      {formatDateTimeRange(
                        featuredActivity.starts_at,
                        featuredActivity.ends_at,
                      )}
                    </p>
                    <p className="flex gap-3">
                      <MapPin className="mt-0.5 size-4 text-blue-200" />
                      {featuredActivity.location}
                    </p>
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/activities"
                      className="inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
                    >
                      View Details
                    </Link>
                    <Link
                      href={registerHref}
                      className="inline-flex h-11 items-center justify-center border border-blue-300/40 px-5 text-sm font-bold text-blue-100 transition hover:bg-blue-400/10"
                    >
                      {user ? "Join/Register" : "Log in to Join/Register"}
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <div className="mt-10 border border-dashed border-white/15 bg-slate-950 p-8 text-slate-300">
                No public activities available yet.
              </div>
            )}

            <div className="mt-10">
              <div className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                <Layers3 className="size-4" aria-hidden="true" />
                Public activities row
              </div>
              {activityTiles.length ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {activityTiles.map((activity) => (
                    <ActivityTile key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="border-y border-dashed border-white/15 bg-slate-950 p-6 text-sm text-slate-300">
                  No additional public activities available yet.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#030814] py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                Latest announcements
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Official public updates, kept clean and current.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                Public visitors see only announcements marked public in
                Supabase. Member-only updates remain behind authenticated
                access.
              </p>
            </div>

            <div>
              {publicAnnouncements.length ? (
                publicAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                  />
                ))
              ) : (
                <div className="border-y border-dashed border-white/15 bg-slate-950 p-6 text-sm text-slate-300">
                  No public announcements yet.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#02040a] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Partners and credibility
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                  Connected to campus and community work.
                </h2>
              </div>
              <Handshake className="hidden size-10 text-blue-200 sm:block" />
            </div>

            {partners.length ? (
              <div className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
                {partners.slice(0, 8).map((partner) => (
                  <article
                    key={partner.id}
                    className="flex min-h-40 items-center justify-center bg-slate-950 p-6 text-center"
                  >
                    {partner.logo_url ? (
                      <Image
                        src={partner.logo_url}
                        alt={`${partner.name} logo`}
                        width={180}
                        height={90}
                        className="max-h-20 w-auto object-contain"
                      />
                    ) : (
                      <div>
                        <p className="font-black text-white">{partner.name}</p>
                        {partner.description ? (
                          <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                            {partner.description}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-10 border-y border-dashed border-white/15 bg-slate-950 p-6 text-sm text-slate-300">
                Partners will be displayed here soon.
              </div>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#02040a] py-24 text-center">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-64 w-2/3 -translate-x-1/2 -translate-y-1/2 bg-blue-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Compass className="mx-auto size-10 text-blue-200" aria-hidden="true" />
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              Ready to be part of the organization?
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Create your account to access member tools, register for
              activities, and stay updated.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="inline-flex h-12 items-center justify-center gap-2 bg-blue-500 px-7 text-sm font-black text-white transition hover:bg-blue-400"
              >
                {user ? "Open Dashboard" : "Sign Up"}
                <Zap className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={user ? "/dashboard" : "/login"}
                className="inline-flex h-12 items-center justify-center border border-white/15 px-7 text-sm font-black text-white transition hover:border-blue-300/50"
              >
                {user ? "Dashboard" : "Log In"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
