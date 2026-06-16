import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  Handshake,
  Megaphone,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";

const floatingCards = [
  {
    label: "Upcoming Event",
    value: "Leadership Forum",
    detail: "June 28, 2026",
    icon: CalendarDays,
    className: "lg:left-2 lg:top-16 lg:-rotate-3",
  },
  {
    label: "Active Members",
    value: "500+",
    detail: "Students connected",
    icon: UsersRound,
    className: "lg:right-0 lg:top-24 lg:rotate-3",
  },
  {
    label: "Announcement",
    value: "Membership drive",
    detail: "Now open",
    icon: Megaphone,
    className: "lg:bottom-14 lg:left-24 lg:rotate-2",
  },
  {
    label: "Partners",
    value: "Campus offices",
    detail: "OSOA and community links",
    icon: Handshake,
    className: "lg:bottom-20 lg:right-20 lg:-rotate-2",
  },
];

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

const activities = [
  "Leadership development sessions",
  "Community service programs",
  "Academic and student support drives",
  "Partner-led campus activities",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <main>
        <section className="relative isolate overflow-hidden border-b border-slate-200 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:44px_44px]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.16),transparent_26%),linear-gradient(180deg,rgba(248,250,252,0.78),#f8fafc_78%)]" />
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="relative mx-auto max-w-5xl">
              <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  Official Student Organization Platform
                </div>

                <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  Empowering Students Through Leadership, Service, and
                  Community
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  A modern digital home for members to discover programs, follow
                  announcements, manage profiles, and stay connected with the
                  organization throughout the academic year.
                </p>

                <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                  <ButtonLink href="/signup" className="gap-2">
                    Join Now
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </ButtonLink>
                  <ButtonLink href="/activities" variant="secondary">
                    View Activities
                  </ButtonLink>
                </div>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:block">
                {floatingCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div
                      key={card.label}
                      className={`rounded-3xl border border-white/80 bg-white/75 p-5 shadow-xl shadow-slate-200/70 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl lg:absolute lg:w-64 ${card.className}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {card.label}
                          </p>
                          <p className="mt-1 font-bold text-slate-950">
                            {card.value}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-500">{card.detail}</p>
                    </div>
                  );
                })}
              </div>
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
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">
                Organization snapshot
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Built for public discovery now, ready for member tools next
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                This first phase establishes the public experience: a strong
                landing page, accessible navigation, reusable sections, and a
                footer prepared for official logos and social links.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/about" variant="secondary">
                  Learn About Us
                </ButtonLink>
                <ButtonLink href="/partners" variant="ghost">
                  Meet Partners
                </ButtonLink>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-2xl shadow-slate-200/70 backdrop-blur">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-blue-200">
                      Academic Year Theme
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      Lead with purpose. Serve with impact.
                    </h3>
                  </div>
                  <GraduationCap className="size-10 text-blue-200" aria-hidden="true" />
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {activities.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-medium text-slate-100"
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
