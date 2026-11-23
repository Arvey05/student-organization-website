import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  CircuitBoard,
  Clock,
  GraduationCap,
  Handshake,
  Layers3,
  MapPin,
  Megaphone,
  Orbit,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PixelBackground } from "@/components/ui/pixel-background";
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
    title: "Inspire",
    description:
      "Fostering an inclusive, welcoming home for technology enthusiasts, aspiring developers, and future leaders across BulSU.",
    icon: Sparkles,
    color: "var(--msc-blue)",
    accent: "var(--msc-blue-dim)",
  },
  {
    title: "Teach",
    description:
      "Organizing technical workshops, study groups, and hands-on training sessions around Microsoft technologies and modern tools.",
    icon: BookOpen,
    color: "var(--msc-lime)",
    accent: "rgba(127, 186, 0, 0.12)",
  },
  {
    title: "Promote",
    description:
      "Extending Bulacan State University's resources to the wider community to advance technology education and collaborative camaraderie.",
    icon: UsersRound,
    color: "var(--msc-amber)",
    accent: "rgba(255, 185, 0, 0.12)",
  },
  {
    title: "MLSA Chapter & Force for Good",
    description:
      "Representing the Microsoft Learn Student Ambassador program at BulSU while leveraging innovation and ethics for lasting societal impact.",
    icon: CircuitBoard,
    color: "var(--msc-blue)",
    accent: "var(--msc-blue-dim)",
  },
];

const benefits = [
  {
    title: "Microsoft & Learning Resources",
    description: "Software, training materials, mentorship, and technology platforms (Art. III & IV).",
    icon: BookOpen,
    color: "var(--msc-amber)",
  },
  {
    title: "Real-Time Skill Development",
    description: "Hands-on technical workshops, study groups, and projects aligned with industry trends.",
    icon: Sparkles,
    color: "var(--msc-lime)",
  },
  {
    title: "Industry & Peer Networking",
    description: "Collaborate with fellow developers, guest speakers, and Microsoft representatives.",
    icon: UsersRound,
    color: "var(--msc-blue)",
  },
  {
    title: "MLSA Pathway & Competitions",
    description: "Represent the Microsoft Learn Student Ambassador program and join exclusive events.",
    icon: GraduationCap,
    color: "var(--msc-amber)",
  },
  {
    title: "Leadership & Committee Roles",
    description: "Grow across Student Development, Relations, Finance, and Media Creatives committees.",
    icon: ShieldCheck,
    color: "var(--msc-lime)",
  },
  {
    title: "Recognition & Certifications",
    description: "Earn official certificates and MLSA milestones that highlight your contributions.",
    icon: Award,
    color: "var(--msc-blue)",
  },
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
      console.error(`Unable to load public partners: ${error.message}`);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("Unable to load public partners:", error);
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
    <div className="absolute inset-0 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(0,108,249,0.62),transparent_32%),radial-gradient(circle_at_80%_8%,rgba(127,186,0,0.36),transparent_28%),linear-gradient(135deg,#02001f,#07111f_48%,#0f2a5f)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,108,249,0.12)_0_1px,transparent_1px_18px)] opacity-25" />
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
    <div className="relative mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:mt-12 lg:px-8">
      <div className="absolute inset-x-8 -top-10 h-32 bg-blue-500/25 blur-3xl" />
      <div className="brand-card relative overflow-hidden bg-[#060b2b]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
            <Orbit className="size-4" aria-hidden="true" />
            BulSU MSC Member Portal
          </div>
          <div
            className="hidden items-center gap-2 text-xs sm:flex"
            style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
          >
            <span
              className="msc-radar-ring relative h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--msc-lime)" }}
            />
            Inspire &bull; Teach &bull; Promote
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
              Member Hub
            </p>
            <div className="mt-5 space-y-2.5">
              {["MSC Member Profile", "Workshops & Assemblies", "Event Calendar"].map(
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
                      {index === 0 ? "Active" : "Portal"}
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
              Featured program
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
                Upcoming workshops, study groups, and General Assembly schedules will appear here.
              </div>
            )}
          </div>

          {/* Announcements col */}
          <div className="p-5" style={{ background: "var(--bg-surface)" }}>
            <p
              className="text-xs font-semibold uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em", color: "var(--msc-lime)" }}
            >
              Community notices
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
                Official notices from the Executive Board will be posted here.
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
    <div className="min-h-screen bg-[#02001f] text-white">
      <SiteHeader />

      <main>
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#02001f]">
          <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#02001f_0%,#060b2b_58%,#02001f_100%)]" />
          <div className="absolute inset-x-0 top-0 -z-20 h-[34rem] bg-[radial-gradient(circle_at_25%_18%,rgba(0,108,249,0.28),transparent_28%),radial-gradient(circle_at_78%_28%,rgba(127,186,0,0.18),transparent_25%)]" />
          <div className="absolute inset-x-[-8%] bottom-0 -z-20 h-64 bg-[radial-gradient(ellipse_at_center,rgba(255,185,0,0.22),transparent_62%)]" />
          <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(0,108,249,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,108,249,0.12)_1px,transparent_1px)] [background-size:64px_64px]" />
          <div className="absolute left-1/2 top-[57%] -z-10 h-px w-[78vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-300/30 to-transparent" />
          <PixelBackground />

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

              <div className="brand-hero-enter relative z-10 flex w-full flex-col items-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-[0.03em] text-blue-100">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  BulSU OSOA-Recognized &bull; Microsoft Learn Student Ambassador Chapter
                </div>

                <h1 className="mt-7 max-w-5xl text-[clamp(2.8rem,7.5vw,6.4rem)] font-black leading-[0.94] tracking-tight text-white">
                  Inspire.{" "}
                  <span className="bg-gradient-to-r from-blue-200 via-blue-400 to-violet-300 bg-clip-text text-transparent">
                    Teach.
                  </span>{" "}
                  Promote.{" "}
                  <span className="font-semibold text-orange-200">
                    A force for good.
                  </span>
                </h1>

                <p
                  className="mt-7 max-w-2xl text-sm leading-7 msc-enter msc-enter-delay-2"
                  style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
                >
                  We, the Bulacan State University &ndash; Microsoft Student
                  Community (BulSU MSC), foster an inclusive community of
                  technology enthusiasts, aspiring developers, and future leaders
                  through learning, collaboration, and innovation.
                </p>

                <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                  <Link
                    href={joinHref}
                    className="brand-interactive inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue-500 px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,108,249,0.22)] hover:bg-blue-400"
                  >
                    {user ? "Open Dashboard" : "Join BulSU MSC"}
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href={activitiesHref}
                    className="brand-interactive inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-6 text-sm font-bold text-white hover:border-blue-300/50 hover:text-blue-100"
                  >
                    Explore Programs &amp; Events
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

        <section className="border-b border-white/10 bg-[#02001f] py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="msc-eyebrow">Preamble &amp; Purpose</p>
              <span className="msc-accent-bar mt-3 block" />
              <h2
                className="mt-5 text-3xl tracking-tight sm:text-5xl"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                A catalyst for positive change and a{" "}
                <span style={{ color: "var(--msc-lime)" }}>community of excellence.</span>
              </h2>
              <div
                className="mt-8 grid gap-6 text-sm leading-7 sm:grid-cols-2"
                style={{ color: "var(--fg-muted)" }}
              >
                <p>
                  We empower BulSU students with the knowledge and skills needed
                  to excel in the ever-changing field of technology through
                  engaging activities, educational initiatives, and industry
                  partnerships.
                </p>
                <p>
                  Proudly affiliated with Microsoft and operating as a Microsoft
                  Learn Student Ambassador (MLSA) chapter at BulSU Main Campus,
                  we promote inclusivity, diversity, and a vibrant camaraderie
                  built to make a lasting impact on society.
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

        <section className="border-b border-white/10 bg-[#060b2b] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="msc-eyebrow">Article IV &bull; Privileges of Membership</p>
              <span className="msc-accent-bar mt-3 block" />
              <h2
                className="mt-5 text-3xl tracking-tight sm:text-5xl"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                Open to all bona fide BulSU students ready to{" "}
                <span style={{ color: "var(--msc-amber)" }}>thrive in the digital age.</span>
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
                    className="group flex items-start gap-4 p-6 transition-all duration-300 hover:bg-[#0c0944] hover:translate-x-1 hover:border-[var(--msc-blue)] cursor-pointer"
                    style={{ background: "var(--bg-surface)" }}
                  >
                    <div
                      className="flex size-11 shrink-0 items-center justify-center transition-all duration-300 group-hover:scale-115 group-hover:rotate-6 group-hover:shadow-[0_0_12px_rgba(0,108,249,0.35)]"
                      style={{ background: "var(--bg-elevated)" }}
                    >
                      <Icon className="size-5" aria-hidden="true" style={{ color: benefit.color }} />
                    </div>
                    <div>
                      <p
                        className="font-semibold transition-colors duration-200 group-hover:text-white"
                        style={{ color: "var(--fg-primary)", fontFamily: "var(--font-body)" }}
                      >
                        {benefit.title}
                      </p>
                      <p className="mt-1 text-xs leading-5" style={{ color: "var(--fg-muted)" }}>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#02001f] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="msc-eyebrow">Workshops, Study Groups &amp; Assemblies</p>
                <span className="msc-accent-bar mt-3 block" />
                <h2
                  className="mt-5 text-3xl tracking-tight sm:text-5xl"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  Hands-on learning &amp; events across the{" "}
                  <span style={{ color: "var(--msc-blue)" }}>BulSU community.</span>
                </h2>
              </div>
              <Link
                href="/activities"
                className="msc-btn-outline shrink-0"
              >
                Browse all activities
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
                No public activities scheduled yet. Check back for our First-Semester General Assembly and technical workshops.
              </div>
            )}

            {/* Activity row */}
            <div className="mt-12">
              <div
                className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--fg-muted)" }}
              >
                <Layers3 className="size-4" aria-hidden="true" />
                More BulSU MSC programs &amp; events
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
                  Additional workshops, seminars, and study groups will be posted here throughout the academic year.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#060b2b] py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="msc-eyebrow">Official Notices &amp; Resolutions</p>
              <span className="msc-accent-bar mt-3 block" />
              <h2
                className="mt-5 text-3xl tracking-tight sm:text-5xl"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                Updates from the{" "}
                <span style={{ color: "var(--msc-lime)" }}>Executive Board</span> &amp; committees.
              </h2>
              <p className="mt-5 text-base leading-8" style={{ color: "var(--fg-muted)" }}>
                Stay informed on Membership Drive schedules, General Assembly
                notices, Executive Board Hunt applications, and official
                university announcements.
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
                  No public announcements posted yet.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#02001f] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="msc-eyebrow">Article III &bull; Affiliation &amp; Alliances</p>
                <span className="msc-accent-bar mt-3 block" />
                <h2
                  className="mt-5 text-3xl tracking-tight sm:text-5xl"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  Collaborating with industry &amp;{" "}
                  <span style={{ color: "var(--msc-amber)" }}>student communities.</span>
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
                Official Microsoft-affiliated student organizations, university colleges, and industry partners will be featured here.
              </div>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#02001f] py-24 text-center">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-64 w-2/3 -translate-x-1/2 -translate-y-1/2 bg-blue-500/20 blur-3xl" />
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
              Be a{" "}
              <span className="text-grad-brand">force for good</span>{" "}
              with BulSU MSC.
            </h2>

            <p className="mt-5 text-base leading-8" style={{ color: "var(--fg-muted)" }}>
              Open to all bona fide Bulacan State University students. Join our
              annual Membership Drive, attend the General Assembly, and grow
              with fellow developers and student leaders.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="brand-interactive inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue-500 px-7 text-sm font-bold text-white hover:bg-blue-400"
              >
                {user ? "Open Dashboard" : "Create Member Account"}
                <Zap className="size-4 transition-transform duration-200 group-hover:scale-125 group-hover:rotate-12" aria-hidden="true" />
              </Link>
              <Link
                href={user ? "/dashboard" : "/login"}
                className="brand-interactive inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-7 text-sm font-bold text-white hover:border-blue-300/50"
              >
                {user ? "Dashboard" : "Member Log In"}
              </Link>
            </div>

            {/* Bottom tagline */}
            <p
              className="mt-10 text-xs uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.3em", color: "var(--fg-muted)" }}
            >
              BulSU Microsoft Student Community &mdash; Inspire. Teach. Promote.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
