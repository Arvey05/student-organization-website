import type { Metadata } from "next";
import { Award, Eye, HeartHandshake, Target, UsersRound } from "lucide-react";

import { PublicPageShell } from "@/components/layout/public-page-shell";

export const metadata: Metadata = {
  title: "About – BulSU MSC",
  description:
    "Learn about the Bulacan State University Microsoft Student Community (BulSU MSC), our mission, vision, officers, and committees.",
  openGraph: {
    title: "About – BulSU MSC",
    description:
      "Learn about the Bulacan State University Microsoft Student Community (BulSU MSC), our mission, vision, officers, and committees.",
  },
};

const values = [
  {
    title: "Mission",
    description:
      "Create meaningful student experiences through leadership, technology workshops, academic support, and community-building programs across Bulacan State University.",
    icon: Target,
  },
  {
    title: "Vision",
    description:
      "A proactive student community where BulSU members develop technical excellence, professional skills, and collaborative leadership to thrive in the modern technology ecosystem.",
    icon: Eye,
  },
  {
    title: "What We Do",
    description:
      "Organize tech bootcamps, community activities, collaborative hackathons, official university announcements, and member development throughout the academic year.",
    icon: HeartHandshake,
  },
];

const officers = [
  { role: "President", name: "TODO: Add BulSU MSC President Name" },
  {
    role: "Vice President for Internal Affairs",
    name: "TODO: Add BulSU MSC VP Internal Affairs Name",
  },
  {
    role: "Vice President for External Affairs",
    name: "TODO: Add BulSU MSC VP External Affairs Name",
  },
  { role: "Secretary", name: "TODO: Add BulSU MSC Secretary Name" },
  { role: "Treasurer", name: "TODO: Add BulSU MSC Treasurer Name" },
  { role: "Auditor", name: "TODO: Add BulSU MSC Auditor Name" },
  {
    role: "Public Relations Officer",
    name: "TODO: Add BulSU MSC PRO Name",
  },
];

const committees = [
  {
    name: "Membership and Records",
    desc: "Oversees member onboarding, roster management, and student records.",
  },
  {
    name: "Programs and Events",
    desc: "Plans and executes workshops, technical seminars, and student gatherings.",
  },
  {
    name: "Creatives and Documentation",
    desc: "Produces branding, media coverage, photography, and publication materials.",
  },
  {
    name: "Partnerships and External Relations",
    desc: "Fosters connections with university departments, tech companies, and partner student orgs.",
  },
];

export default function AboutPage() {
  return (
    <PublicPageShell
      eyebrow="About BulSU MSC"
      title="Empowering BulSU students through technology and leadership"
      description="Learn about the Bulacan State University Microsoft Student Community (BulSU MSC), our founding values, and how officers and committees support students."
    >
      <section className="border-b border-white/10 bg-[#02040a] py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Who We Are
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              BulSU Microsoft Student Community
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              BulSU MSC is an officially recognized student organization at
              Bulacan State University. We connect students across disciplines
              with technology events, hands-on learning, leadership
              opportunities, and peer networks.
            </p>
            <div className="mt-6 border border-dashed border-white/15 bg-white/[0.02] p-4 text-xs text-slate-400">
              <span className="font-semibold text-yellow-300">TODO:</span> Verify
              BulSU MSC founding year, constitution details, and faculty
              adviser info with org records.
            </div>
          </div>

          <div className="grid gap-px bg-white/10 md:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="bg-slate-950 p-6 transition hover:bg-slate-900/80"
                >
                  <div className="flex size-12 items-center justify-center bg-blue-500/15 text-blue-100">
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

      <section className="bg-[#030814] py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="border-y border-white/10 bg-slate-950 p-6">
            <div className="flex items-center gap-3">
              <UsersRound className="size-6 text-blue-200" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white">
                Executive Officers
              </h2>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              BulSU MSC Executive Board
            </p>
            <div className="mt-6 grid gap-3">
              {officers.map((officer) => (
                <div
                  key={officer.role}
                  className="flex flex-col justify-between border-l border-blue-300/40 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center"
                >
                  <span className="text-sm font-semibold text-white">
                    {officer.role}
                  </span>
                  <span className="text-xs font-mono text-yellow-300/80">
                    {officer.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-y border-white/10 bg-slate-950 p-6">
            <div className="flex items-center gap-3">
              <Award className="size-6 text-blue-200" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white">
                Organization Committees
              </h2>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Standing committees serving BulSU members
            </p>
            <div className="mt-6 grid gap-3">
              {committees.map((committee) => (
                <div
                  key={committee.name}
                  className="border-l border-violet-300/35 bg-white/[0.03] px-4 py-3"
                >
                  <p className="text-sm font-semibold text-white">
                    {committee.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{committee.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
