import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  CircuitBoard,
  Clock,
  Handshake,
  IdCard,
  Layers3,
  MapPin,
  Megaphone,
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

export const dynamic = "force-dynamic";

type PartnerRow = Database["public"]["Tables"]["partners"]["Row"];

const identityItems = [
  {
    title: "Leadership",
    description:
      "Training and hands-on roles for students who want to lead well.",
    icon: ShieldCheck,
    color: "var(--msc-blue)",
    accent: "var(--msc-blue-dim)",
  },
  {
    title: "Service",
    description:
      "Projects that give members practical ways to support the community.",
    icon: Handshake,
    color: "var(--msc-lime)",
    accent: "rgba(127, 186, 0, 0.12)",
  },
  {
    title: "Community",
    description: "One place for members to hear what is happening and take part.",
    icon: UsersRound,
    color: "var(--msc-amber)",
    accent: "rgba(255, 185, 0, 0.12)",
  },
  {
    title: "Academic Technology",
    description:
      "Simple online tools for the day-to-day work of the organization.",
    icon: CircuitBoard,
    color: "var(--msc-blue)",
    accent: "var(--msc-blue-dim)",
  },
];

const benefits = [
  { title: "Access official announcements",          icon: Bell,           color: "var(--msc-amber)" },
  { title: "Join organization activities",           icon: Sparkles,       color: "var(--msc-lime)"  },
  { title: "Track registered events",                icon: UserRoundCheck, color: "var(--msc-blue)"  },
  { title: "View calendar updates",                  icon: CalendarDays,   color: "var(--msc-amber)" },
  { title: "Manage member profile",                  icon: IdCard,         color: "var(--msc-lime)"  },
  { title: "Stay connected with officers & partners",icon: Radio,          color: "var(--msc-blue)"  },
];

function getAnnouncementDate(announcement: AnnouncementRow) {
  return (
    announcement.starts_at ??
    announcement.published_at ??
    announcement.created_at
  );
}

async function getPublicPartners(): Promise<PartnerRow[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.warn(`Unable to load public partners: ${error.message}`);
      return [];
    }

    return data ?? [];
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      (error as { digest: string }).digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.warn("Unable to load public partners:", error);
    return [];
  }
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
    <div className="absolute inset-0 overflow-hidden" style={{ background: "var(--msc-midnight)" }}>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 28% 20%, rgba(0, 108, 249, 0.55), transparent 32%),
            radial-gradient(circle at 80% 8%,  rgba(127, 186, 0, 0.3), transparent 28%),
            linear-gradient(135deg, var(--msc-midnight), var(--msc-navy) 60%, #060062)
          `,
        }}
      />
      {/* Brand grid texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-24 w-2/3 -translate-x-1/2 blur-3xl"
        style={{ background: "rgba(0, 108, 249, 0.3)" }}
      />
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
    <div className="relative mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:mt-14 lg:px-8">
      {/* Glow above preview */}
      <div
        aria-hidden="true"
        className="msc-pulse-slow absolute inset-x-8 -top-10 h-32 blur-3xl"
        style={{ background: "rgba(0, 108, 249, 0.25)" }}
      />

      {/* Browser-chrome card */}
      <div
        className="msc-card-hover relative overflow-hidden"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "0 32px 64px -16px rgba(0, 36, 83, 0.6)",
        }}
      >
        {/* Top accent gradient bar */}
        <div
          aria-hidden="true"
          className="h-0.5 w-full"
          style={{ background: "var(--msc-grad-sweep)" }}
        />

        {/* Chrome bar */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div
            className="flex items-center gap-2.5 text-xs font-semibold uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.24em",
              color: "var(--msc-blue)",
            }}
          >
            <span
              className="msc-radar-ring relative h-2 w-2 rounded-full"
              style={{ background: "var(--msc-blue)", boxShadow: "0 0 8px var(--msc-blue-glow)" }}
            />
            Member Portal Preview
          </div>
          <div
            className="hidden items-center gap-2 text-xs sm:flex"
            style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
          >
            <span
              className="msc-radar-ring relative h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--msc-lime)" }}
            />
            Live public data
          </div>
        </div>

        {/* Content grid */}
        <div
          className="grid gap-px lg:grid-cols-[0.85fr_1.15fr_0.85fr]"
          style={{ background: "var(--border-subtle)" }}
        >
          {/* Dashboard col */}
          <div className="p-5" style={{ background: "var(--bg-surface)" }}>
            <p
              className="text-xs font-semibold uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em", color: "var(--fg-muted)" }}
            >
              Dashboard
            </p>
            <div className="mt-5 space-y-2.5">
              {["Profile status", "Activities joined", "Calendar sync"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="group flex items-center justify-between px-4 py-3 transition-all duration-200 hover:translate-x-1 hover:border-[var(--msc-blue)] hover:bg-white/[0.04] cursor-pointer"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span className="text-sm transition-colors duration-200 group-hover:text-white" style={{ color: "var(--fg-muted)" }}>{item}</span>
                    <span
                      className="text-xs font-semibold transition-transform duration-200 group-hover:scale-105"
                      style={{ color: index === 0 ? "var(--msc-lime)" : "var(--msc-blue)" }}
                    >
                      {index === 0 ? "Ready" : "Portal"}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Upcoming activity col */}
          <div className="p-5" style={{ background: "var(--bg-surface)" }}>
            <p
              className="text-xs font-semibold uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em", color: "var(--msc-blue)" }}
            >
              Upcoming activity
            </p>
            {featuredActivity ? (
              <div className="group mt-4 grid gap-4 sm:grid-cols-[0.9fr_1.1fr] cursor-pointer">
                <div
                  className="relative aspect-video overflow-hidden"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <ActivityVisual activity={featuredActivity} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div>
                  <h3 className="line-clamp-2 text-xl font-black transition-colors duration-200 group-hover:text-[var(--msc-amber)]" style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}>
                    {featuredActivity.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6" style={{ color: "var(--fg-muted)" }}>
                    {featuredActivity.short_description}
                  </p>
                  <p className="mt-4 text-sm font-semibold" style={{ color: "var(--msc-amber)" }}>
                    {formatDateTimeRange(featuredActivity.starts_at, featuredActivity.ends_at)}
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="mt-4 border border-dashed p-6 text-sm"
                style={{ borderColor: "var(--border-subtle)", color: "var(--fg-muted)" }}
              >
                No public activity available for the preview yet.
              </div>
            )}
          </div>

          {/* Announcements col */}
          <div className="p-5" style={{ background: "var(--bg-surface)" }}>
            <p
              className="text-xs font-semibold uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em", color: "var(--msc-lime)" }}
            >
              Announcement feed
            </p>
            {featuredAnnouncement ? (
              <div
                className="group mt-4 pl-4 transition-all duration-200 hover:translate-x-1 cursor-pointer"
                style={{ borderLeft: "2px solid var(--msc-amber)" }}
              >
                <h3 className="line-clamp-2 text-lg font-black transition-colors duration-200 group-hover:text-[var(--msc-lime)]" style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}>
                  {featuredAnnouncement.title}
                </h3>
                <p className="mt-3 line-clamp-4 text-sm leading-6" style={{ color: "var(--fg-muted)" }}>
                  {featuredAnnouncement.content}
                </p>
              </div>
            ) : (
              <div
                className="mt-4 border border-dashed p-5 text-sm"
                style={{ borderColor: "var(--border-subtle)", color: "var(--fg-muted)" }}
              >
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
    <article
      className="group min-w-[280px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[var(--border-accent)] hover:shadow-[0_20px_40px_-10px_rgba(0,108,249,0.35)] cursor-pointer sm:min-w-[340px]"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="relative aspect-video overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
        <ActivityVisual activity={activity} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span
            className="text-xs font-semibold uppercase transition-all duration-200 group-hover:tracking-widest"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--msc-amber)" }}
          >
            {activity.status}
          </span>
          <h3
            className="mt-1 line-clamp-2 text-lg font-black transition-colors duration-200 group-hover:text-[var(--msc-amber)]"
            style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}
          >
            {activity.name}
          </h3>
          <p className="mt-2 line-clamp-1 text-xs" style={{ color: "var(--fg-muted)" }}>
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
    <article
      className="group grid gap-4 rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.03] hover:shadow-[0_12px_32px_-8px_rgba(255,185,0,0.18)] cursor-pointer sm:grid-cols-[120px_1fr]"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <div
        className="relative aspect-video overflow-hidden rounded-lg sm:aspect-square"
        style={{ border: "1px solid var(--border-subtle)", background: "var(--bg-elevated)" }}
      >
        {announcement.image_url ? (
          <Image
            src={announcement.image_url}
            alt={`${announcement.title} cover`}
            fill
            sizes="120px"
            className="msc-img-zoom object-cover"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ background: "var(--msc-blue-dim)" }}
          >
            <Megaphone className="size-7 msc-icon-spring" aria-hidden="true" style={{ color: "var(--msc-blue)" }} />
          </div>
        )}
      </div>
      <div>
        <p
          className="text-xs font-semibold uppercase transition-all duration-200 group-hover:tracking-wider"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--msc-amber)" }}
        >
          {announcement.starts_at
            ? formatDateTimeRange(announcement.starts_at, announcement.ends_at)
            : formatDateTime(date)}
        </p>
        <h3
          className="mt-2 text-xl font-black transition-colors duration-200 group-hover:text-[var(--msc-amber)]"
          style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}
        >
          {announcement.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6" style={{ color: "var(--fg-muted)" }}>
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
    <div className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--fg-primary)" }}>
      <SiteHeader />

      <main>
        {/* ═══════════════════════════════════════
            § 01 HERO
        ═══════════════════════════════════════ */}
        <section
          className="relative isolate overflow-hidden"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          {/* Hero gradient background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-30"
            style={{
              background: `
                radial-gradient(60% 80% at 0% 65%, rgba(0, 108, 249, 0.22), transparent 60%),
                linear-gradient(135deg, #060062, var(--msc-midnight) 58%)
              `,
            }}
          />

          {/* Radial glow spots */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-20 h-[34rem]"
            style={{
              background: `
                radial-gradient(circle at 25% 18%, rgba(0, 108, 249, 0.25), transparent 28%),
                radial-gradient(circle at 78% 28%, rgba(127, 186, 0, 0.12), transparent 25%)
              `,
            }}
          />

          {/* Bottom amber glow */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[-8%] bottom-0 -z-20 h-48 blur-3xl"
            style={{ background: "radial-gradient(ellipse at center, rgba(255, 185, 0, 0.16), transparent 62%)" }}
          />

          {/* Grid overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-15"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          {/* Horizontal scan line */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[57%] -z-10 h-px w-[78vw] -translate-x-1/2"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255, 185, 0, 0.28), transparent)" }}
          />

          {/* Ambient orbit circle */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-80 -top-96 h-[900px] w-[900px] rounded-full opacity-40"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              animation: "msc-drift 18s ease-in-out infinite alternate",
            }}
          />

          <div
            className="mx-auto flex min-h-[calc(100dvh-72px)] max-w-[96rem] flex-col px-4 pb-12 pt-14 sm:px-6 sm:pt-20 lg:px-8"
          >
            <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center justify-center py-6 text-center">

              {/* Corner tick marks */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 top-12 hidden h-[21rem] sm:block"
                style={{ border: "1px solid var(--border-subtle)" }}
              >
                <span className="absolute -left-1 -top-1 size-2" style={{ background: "var(--msc-amber)" }} />
                <span className="absolute -right-1 -top-1 size-2" style={{ background: "var(--msc-lime)" }} />
                <span className="absolute -bottom-1 -left-1 size-2" style={{ background: "var(--msc-blue)" }} />
                <span className="absolute -bottom-1 -right-1 size-2" style={{ background: "var(--msc-amber)" }} />
              </div>

              <div className="relative z-10 flex w-full flex-col items-center">
                {/* Badge */}
                <div
                  className="msc-badge msc-badge-blue msc-enter"
                  style={{ animationDelay: "0ms" }}
                >
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Official Student Organization Platform
                </div>

                {/* Side labels */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2 top-32 hidden -translate-x-full items-center gap-2 lg:flex"
                >
                  <span className="h-px w-12" style={{ background: "rgba(255, 185, 0, 0.4)" }} />
                  <span
                    className="px-3 py-1 text-[0.62rem] font-bold uppercase"
                    style={{
                      background: "var(--msc-amber)",
                      color: "var(--msc-midnight)",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    student-led
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 top-24 hidden translate-x-full items-center gap-2 lg:flex"
                >
                  <span
                    className="px-3 py-1 text-[0.62rem] font-bold uppercase"
                    style={{
                      background: "var(--msc-lime)",
                      color: "var(--msc-midnight)",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    verified
                  </span>
                  <span className="h-px w-12" style={{ background: "rgba(127, 186, 0, 0.4)" }} />
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-28 right-12 hidden items-center gap-2 lg:flex"
                >
                  <span className="size-2" style={{ background: "var(--msc-blue)" }} />
                  <span
                    className="px-3 py-1 text-[0.62rem] font-bold uppercase"
                    style={{
                      border: "1px solid rgba(0, 108, 249, 0.35)",
                      color: "rgba(165, 200, 255, 0.9)",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    member tools
                  </span>
                </div>

                {/* Main headline */}
                <h1
                  className="mt-7 max-w-5xl msc-enter msc-enter-delay-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontStretch: "118%",
                    fontSize: "clamp(2.8rem, 8vw, 7rem)",
                    lineHeight: 0.92,
                    letterSpacing: "-0.04em",
                    color: "var(--fg-primary)",
                  }}
                >
                  Building student{" "}
                  <span className="text-grad-lime-blue">leadership</span>
                  {" "}for a digital{" "}
                  <span style={{ color: "var(--msc-amber)" }}>campus.</span>
                </h1>

                <p
                  className="mt-7 max-w-2xl text-sm leading-7 msc-enter msc-enter-delay-2"
                  style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
                >
                  Check upcoming activities, read official announcements, join
                  programs, and manage your membership — all in one place.
                </p>

                {/* CTAs */}
                <div
                  className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row msc-enter msc-enter-delay-3"
                >
                  <Link href={joinHref} className="group msc-btn-primary" style={{ height: "2.875rem", padding: "0 1.75rem" }}>
                    {user ? "Open Dashboard" : "Join Now"}
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" aria-hidden="true" />
                  </Link>
                  <Link href={activitiesHref} className="msc-btn-outline" style={{ height: "2.875rem", padding: "0 1.75rem" }}>
                    View Activities
                  </Link>
                </div>

                {/* Brand accent bar below CTAs */}
                <div className="mt-10 msc-enter msc-enter-delay-4" aria-hidden="true">
                  <span
                    className="msc-sweep-bar block h-1 rounded-full"
                    style={{ width: "120px", marginInline: "auto" }}
                  />
                </div>
              </div>
            </div>

            {/* Platform preview */}
            <PlatformPreview
              featuredActivity={featuredActivity}
              featuredAnnouncement={featuredAnnouncement}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════
            § 02 WHO WE ARE — Identity pillars
        ═══════════════════════════════════════ */}
        <section
          className="py-24"
          style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}
        >
          <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="msc-eyebrow">Who we are</p>
              <span className="msc-accent-bar mt-3 block" />
              <h2
                className="mt-5 text-3xl tracking-tight sm:text-5xl"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                Student-led programs with room for members to do{" "}
                <span style={{ color: "var(--msc-lime)" }}>real work.</span>
              </h2>
              <div
                className="mt-8 grid gap-6 text-sm leading-7 sm:grid-cols-2"
                style={{ color: "var(--fg-muted)" }}
              >
                <p>
                  BulSU MSC gives students a place to lead projects, serve the
                  community, and contribute to campus life through Microsoft
                  technologies.
                </p>
                <p>
                  This site keeps the practical details together: official
                  announcements, activity registration, calendars, and member
                  profiles.
                </p>
              </div>
            </div>

            {/* Identity tiles */}
            <div
              className="grid gap-px sm:grid-cols-2"
              style={{ background: "var(--border-subtle)" }}
            >
              {identityItems.map((item, index) => {
                const Icon = item.icon;
                const glowClass =
                  index === 0
                    ? "msc-card-glow-blue"
                    : index === 1
                      ? "msc-card-glow-lime"
                      : "msc-card-glow-amber";

                return (
                  <article
                    key={item.title}
                    className={`group p-6 ${glowClass} cursor-pointer`}
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div
                      className="flex size-11 items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: item.accent }}
                    >
                      <Icon className="size-5 msc-icon-spring" aria-hidden="true" style={{ color: item.color }} />
                    </div>
                    <h3
                      className="mt-5 text-lg font-black transition-colors duration-200 group-hover:text-white"
                      style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6" style={{ color: "var(--fg-muted)" }}>
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            § 03 BENEFITS — Member tools grid
        ═══════════════════════════════════════ */}
        <section
          className="py-24"
          style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-base)" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="msc-eyebrow">Member benefits</p>
              <span className="msc-accent-bar mt-3 block" />
              <h2
                className="mt-5 text-3xl tracking-tight sm:text-5xl"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                The details members need, without chasing{" "}
                <span style={{ color: "var(--msc-amber)" }}>separate updates.</span>
              </h2>
            </div>

            <div
              className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-3"
              style={{ background: "var(--border-subtle)" }}
            >
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="group flex items-center gap-4 p-5 transition-all duration-300 hover:bg-[#0c0944] hover:translate-x-1 hover:border-[var(--msc-blue)] cursor-pointer"
                    style={{ background: "var(--bg-surface)" }}
                  >
                    <div
                      className="flex size-11 shrink-0 items-center justify-center transition-all duration-300 group-hover:scale-115 group-hover:rotate-6 group-hover:shadow-[0_0_12px_rgba(0,108,249,0.35)]"
                      style={{ background: "var(--bg-elevated)" }}
                    >
                      <Icon className="size-5" aria-hidden="true" style={{ color: benefit.color }} />
                    </div>
                    <p
                      className="font-semibold transition-colors duration-200 group-hover:text-white"
                      style={{ color: "var(--fg-primary)", fontFamily: "var(--font-body)" }}
                    >
                      {benefit.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            § 04 FEATURED ACTIVITY
        ═══════════════════════════════════════ */}
        <section
          className="py-24"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="msc-eyebrow">Featured public activity</p>
                <span className="msc-accent-bar mt-3 block" />
                <h2
                  className="mt-5 text-3xl tracking-tight sm:text-5xl"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  The next public signal from the{" "}
                  <span style={{ color: "var(--msc-blue)" }}>organization.</span>
                </h2>
              </div>
              <Link
                href="/activities"
                className="msc-btn-outline shrink-0"
              >
                Browse public activities
              </Link>
            </div>

            {featuredActivity ? (
              <article
                className="msc-card-hover group mt-12 overflow-hidden lg:grid lg:grid-cols-[1.15fr_0.85fr]"
                style={{
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-elevated)",
                }}
              >
                <div
                  className="relative min-h-[320px] overflow-hidden"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <ActivityVisual activity={featuredActivity} priority />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <span
                    className="w-fit px-3 py-1 text-xs font-semibold uppercase transition-all duration-200 group-hover:scale-105"
                    style={{
                      border: "1px solid rgba(255, 185, 0, 0.4)",
                      background: "rgba(255, 185, 0, 0.1)",
                      color: "var(--msc-amber)",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.16em",
                    }}
                  >
                    {featuredActivity.status}
                  </span>
                  <h3
                    className="mt-5 text-3xl tracking-tight transition-colors duration-200 group-hover:text-[var(--msc-amber)] sm:text-4xl"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--fg-primary)" }}
                  >
                    {featuredActivity.name}
                  </h3>
                  <p className="mt-5 text-base leading-8" style={{ color: "var(--fg-muted)" }}>
                    {featuredActivity.short_description}
                  </p>
                  <div className="mt-6 space-y-3 text-sm" style={{ color: "var(--fg-muted)" }}>
                    <p className="flex gap-3">
                      <Clock className="mt-0.5 size-4 shrink-0 transition-transform duration-200 group-hover:scale-115" aria-hidden="true" style={{ color: "var(--msc-blue)" }} />
                      {formatDateTimeRange(featuredActivity.starts_at, featuredActivity.ends_at)}
                    </p>
                    <p className="flex gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0 transition-transform duration-200 group-hover:scale-115" aria-hidden="true" style={{ color: "var(--msc-blue)" }} />
                      {featuredActivity.location}
                    </p>
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link href="/activities" className="msc-btn-primary">
                      View Details
                    </Link>
                    <Link href={registerHref} className="msc-btn-outline">
                      {user ? "Join / Register" : "Log in to Join"}
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <div
                className="mt-12 border border-dashed p-8"
                style={{ borderColor: "var(--border-subtle)", color: "var(--fg-muted)", background: "var(--bg-elevated)" }}
              >
                No public activities available yet.
              </div>
            )}

            {/* Activity row */}
            <div className="mt-12">
              <div
                className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--fg-muted)" }}
              >
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
                <div
                  className="border-y border-dashed p-6 text-sm"
                  style={{ borderColor: "var(--border-subtle)", color: "var(--fg-muted)", background: "var(--bg-elevated)" }}
                >
                  No additional public activities available yet.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            § 05 ANNOUNCEMENTS
        ═══════════════════════════════════════ */}
        <section
          className="py-24"
          style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-base)" }}
        >
          <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="msc-eyebrow">Latest announcements</p>
              <span className="msc-accent-bar mt-3 block" />
              <h2
                className="mt-5 text-3xl tracking-tight sm:text-5xl"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                Official public updates,{" "}
                <span style={{ color: "var(--msc-lime)" }}>kept clean</span> and current.
              </h2>
              <p className="mt-5 text-base leading-8" style={{ color: "var(--fg-muted)" }}>
                Public visitors see only announcements marked public. Member-only
                updates remain behind authenticated access.
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
                <div
                  className="border-y border-dashed p-6 text-sm"
                  style={{ borderColor: "var(--border-subtle)", color: "var(--fg-muted)", background: "var(--bg-elevated)" }}
                >
                  No public announcements yet.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            § 06 PARTNERS
        ═══════════════════════════════════════ */}
        <section
          className="py-24"
          style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="msc-eyebrow">Partners and credibility</p>
                <span className="msc-accent-bar mt-3 block" />
                <h2
                  className="mt-5 text-3xl tracking-tight sm:text-5xl"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  Connected to campus and{" "}
                  <span style={{ color: "var(--msc-amber)" }}>community work.</span>
                </h2>
              </div>
              <Handshake className="hidden size-10 sm:block" style={{ color: "var(--msc-blue)" }} />
            </div>

            {partners.length ? (
              <div
                className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-4"
                style={{ background: "var(--border-subtle)" }}
              >
                {partners.slice(0, 8).map((partner) => (
                  <article
                    key={partner.id}
                    className="group flex min-h-40 items-center justify-center p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--msc-blue)] hover:bg-[#0c0944] hover:shadow-[0_16px_36px_-10px_rgba(0,108,249,0.35)] cursor-pointer"
                    style={{ background: "var(--bg-elevated)" }}
                  >
                    {partner.logo_url ? (
                      <Image
                        src={partner.logo_url}
                        alt={`${partner.name} logo`}
                        width={180}
                        height={90}
                        className="max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div>
                        <p className="font-black transition-colors duration-200 group-hover:text-[var(--msc-amber)]" style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}>
                          {partner.name}
                        </p>
                        {partner.description ? (
                          <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--fg-muted)" }}>
                            {partner.description}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div
                className="mt-12 border-y border-dashed p-6 text-sm"
                style={{ borderColor: "var(--border-subtle)", color: "var(--fg-muted)", background: "var(--bg-elevated)" }}
              >
                Partners will be displayed here soon.
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            § 07 CTA SECTION
        ═══════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-28 text-center"
          style={{ background: "var(--bg-base)" }}
        >
          {/* Top accent line */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--msc-blue), transparent)" }}
          />

          {/* Blue glow orb */}
          <div
            aria-hidden="true"
            className="msc-pulse-slow absolute left-1/2 top-1/2 h-64 w-2/3 -translate-x-1/2 -translate-y-1/2 blur-3xl"
            style={{ background: "rgba(0, 108, 249, 0.2)" }}
          />

          {/* Amber glow orb */}
          <div
            aria-hidden="true"
            className="msc-pulse-slow absolute bottom-0 left-1/4 h-40 w-72 -translate-x-1/2 blur-3xl"
            style={{ background: "rgba(255, 185, 0, 0.14)" }}
          />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Barcode motif above headline */}
            <div
              aria-hidden="true"
              className="msc-barcode group mx-auto mb-6 justify-center cursor-default"
              style={{ color: "rgba(0, 108, 249, 0.4)", height: "22px" }}
            >
              {Array.from({ length: 22 }).map((_, k) => (
                <i
                  key={k}
                  className="transition-transform duration-200 group-hover:scale-y-125"
                  style={{
                    width: `${1 + (k * 7 + k * k) % 4}px`,
                    marginRight: `${1 + k % 3}px`,
                    transitionDelay: `${k * 20}ms`,
                  }}
                />
              ))}
            </div>

            <h2
              className="text-4xl tracking-tight sm:text-6xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontStretch: "118%", color: "var(--fg-primary)" }}
            >
              Ready to be part of the{" "}
              <span className="text-grad-brand">organization?</span>
            </h2>

            <p className="mt-5 text-base leading-8" style={{ color: "var(--fg-muted)" }}>
              Create your account to access member tools, register for activities,
              and stay updated with everything BulSU MSC.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="group msc-btn-primary"
                style={{ height: "3rem", padding: "0 2rem", fontSize: "0.875rem" }}
              >
                {user ? "Open Dashboard" : "Sign Up Free"}
                <Zap className="size-4 transition-transform duration-200 group-hover:scale-125 group-hover:rotate-12" aria-hidden="true" />
              </Link>
              <Link
                href={user ? "/dashboard" : "/login"}
                className="msc-btn-outline"
                style={{ height: "3rem", padding: "0 2rem", fontSize: "0.875rem" }}
              >
                {user ? "Dashboard" : "Log In"}
              </Link>
            </div>

            {/* Bottom tagline */}
            <p
              className="mt-10 text-xs uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.3em", color: "var(--fg-muted)" }}
            >
              BulSU MSC &mdash; Together, we go further.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
