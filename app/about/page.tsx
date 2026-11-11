import type { Metadata } from "next";
import {
  Award,
  BookOpenCheck,
  CalendarRange,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";

import { PublicPageShell } from "@/components/layout/public-page-shell";

export const metadata: Metadata = {
  title: "About – BulSU MSC",
  description:
    "Learn about the Bulacan State University – Microsoft Student Community (BulSU MSC), our Constitution and By-Laws, Preamble, Mission, Vision, Executive Board, and Standing Committees.",
  openGraph: {
    title: "About – BulSU MSC",
    description:
      "Learn about the Bulacan State University – Microsoft Student Community (BulSU MSC), our Mission ('Inspire. Teach. Promote.'), Vision, Executive Board, and Standing Committees.",
  },
};

const values = [
  {
    title: "Mission",
    subtitle: "Inspire. Teach. Promote.",
    description:
      "We empower students with the knowledge and skills needed to excel in the ever-changing field of technology through engaging activities, educational initiatives, and industry partnerships, equipping them with the tools and resources necessary to thrive in the digital age.",
    icon: Target,
  },
  {
    title: "Vision",
    subtitle: "A Force for Good",
    description:
      "We, as a catalyst for positive change and a community of excellence. We cultivate a generation endowed with technological expertise, embracing innovation and leveraging technology for societal advancement, while remaining attuned to the evolving needs of our community. By fostering an environment of collaboration, continuous learning, and ethical practices, we aspire to be a force for good, making a meaningful and lasting impact on society.",
    icon: Eye,
  },
  {
    title: "Purpose & MLSA Affiliation",
    subtitle: "Article II & Article III",
    description:
      "We connect students at Bulacan State University to inspire, teach, and promote the use of technology and Microsoft products and services. As a Microsoft Learn Student Ambassador (MLSA) chapter, we host technical workshops, study groups, and collaborative initiatives across BulSU and beyond.",
    icon: HeartHandshake,
  },
];

const executiveBoard = [
  { role: "President", name: "Glen Justine P. Batis" },
  {
    role: "Vice President for Internal Affairs",
    name: "Raphael M. De Castro",
  },
  {
    role: "Vice President for External Affairs",
    name: "Dave Anthony R. De Jesus",
  },
  {
    role: "Secretary / Executive Secretary",
    name: "Mariel Lorenz R. Gonzales",
  },
  { role: "Associate Secretary", name: "Princess Ann S. Nicolas" },
  {
    role: "Treasurer / Director for Finance & Student Adviser",
    name: "Allan Iverson A. Reyes",
  },
  { role: "Auditor / Director for Audit", name: "Mary Katherine C. Dela Cruz" },
  { role: "Public Information Officer", name: "Jhanna Bea Y. Jimenez" },
  {
    role: "Programs Committee Officer & Student Adviser",
    name: "Axl Louis P. Coronel",
  },
  { role: "Head, Membership Committee", name: "Gerome L. Dela Peña" },
  { role: "Head, Programs Committee", name: "Patrick Landre D. Crisostomo" },
  { role: "Head, Creatives Committee", name: "Ichiro H. Miyahashi" },
  { role: "External Affairs Associate", name: "Tamira Marie A. Laki" },
];

const committees = [
  {
    name: "Relations Committee",
    supervision: "Chaired & Supervised by the VP for External Affairs",
    roles: "Sponsors Lead • Partnership Lead",
    desc: "Builds and maintains relationships with external organizations, industry sponsors, and partner student communities.",
  },
  {
    name: "Finance Committee",
    supervision:
      "Supervised by the President • Chaired by Directors for Finance & Audit",
    roles: "Resource Manager • Procurement Officer",
    desc: "Oversees the financial health, budgeting, transparent procurement, and auditing of the organization.",
  },
  {
    name: "Student Development Committee",
    supervision:
      "Supervised by VP Internal • Chaired by Directors for Student Development & Events",
    roles:
      "Membership Coordinators • Research Leads • Event Analysts • Logistics Officers • MLSA Lead",
    desc: "Enhances the technical skills, knowledge, and engagement of BulSU MSC members and guides aspiring Microsoft Learn Student Ambassadors.",
  },
  {
    name: "Media Creatives Committee",
    supervision:
      "Supervised by VP Internal • Chaired by Directors for Creatives & Media",
    roles:
      "Creative Designers • Documentation Officers • Technical Supports • Digital Managers • Content Lead",
    desc: "Leads visual brand identity, event photo/video documentation, audio-visual technical support, and digital communications.",
  },
];

const traditions = [
  {
    title: "Annual Membership Drive",
    article: "Article IV, Section 2",
    description:
      "Open to all bona fide BulSU students at the beginning of each academic year (3–4 weeks) to welcome new technology enthusiasts and renew active members.",
    icon: UsersRound,
  },
  {
    title: "General Assembly (GA)",
    article: "Article VIII",
    description:
      "Held in the first semester as our cornerstone community event to introduce the year's roadmap, foster camaraderie, and connect members across colleges.",
    icon: CalendarRange,
  },
  {
    title: "The Executive Board Hunt",
    article: "Article VII",
    description:
      "Conducted annually from April to May by the Selection Council, culminating in the Turnover Ceremony and Officer Oath-Taking for the new term starting in July.",
    icon: ShieldCheck,
  },
  {
    title: "Democratic Governance",
    article: "Article VI & Article XII",
    description:
      "Guided by monthly regular meetings, transparent resolutions, and one-member-one-vote participation in organizational policies and initiatives.",
    icon: BookOpenCheck,
  },
];

export default function AboutPage() {
  return (
    <PublicPageShell
      eyebrow="About BulSU MSC"
      title="Inspire. Teach. Promote."
      description="Established under the Office of the Student Organizations and Activities (OSOA) at Bulacan State University – Main Campus, BulSU MSC is a community of technology enthusiasts, aspiring developers, and future leaders."
    >
      <section className="border-b border-white/10 bg-[#02001f] py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Preamble &amp; Identity
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Bulacan State University &ndash; Microsoft Student Community
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              &ldquo;We, the Bulacan State University - Microsoft Student
              Community (BulSU MSC), are dedicated to fostering a community of
              technology enthusiasts, aspiring developers, and future leaders.
              We provide opportunities for learning, collaboration, and
              innovation in the field of technology while creating an inclusive
              and welcoming environment that promotes personal and professional
              growth.&rdquo;
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              &ldquo;Through our activities, events, and initiatives, BulSU MSC
              extends the resources of Bulacan State University to a broader
              community, contributing to the advancement of technology
              education. By promoting inclusivity and embracing diversity, we
              create a vibrant and supportive camaraderie for the future.&rdquo;
            </p>

            <div className="mt-6 border border-white/10 bg-[#001431]/70 p-5 text-xs leading-6 text-slate-300">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-msc-amber">
                Constitution &amp; By-Laws (Updated April 2025 &bull; Rev. No. 003)
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div>
                  <span className="font-semibold text-white">Official Shortened Names:</span>{" "}
                  BulSU Microsoft Student Community / BulSU MSC
                </div>
                <div>
                  <span className="font-semibold text-white">Founder:</span>{" "}
                  Ryka Gene M. Austria
                </div>
                <div>
                  <span className="font-semibold text-white">Faculty Advisers:</span>{" "}
                  Adrian P. Maroma &amp; Noel P. Lomerio Jr., MAEd
                </div>
                <div>
                  <span className="font-semibold text-white">Student Advisers:</span>{" "}
                  Allan Iverson A. Reyes &amp; Axl Louis P. Coronel
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {values.map((item, index) => {
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
                  className={`msc-card-hover group border border-white/10 bg-[#001431]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-msc-blue/50 ${glowClass}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center border border-msc-blue/30 bg-msc-blue/15 text-msc-blue transition-transform duration-300 group-hover:scale-110">
                      <Icon className="msc-icon-spring size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-msc-amber">
                        {item.subtitle}
                      </p>
                      <h3 className="font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-msc-amber">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#060b2b] py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="border border-white/10 bg-[#001431]/70 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center border border-msc-blue/30 bg-msc-blue/15 text-msc-blue">
                <UsersRound className="size-5" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                Executive Board &amp; Leadership
              </h2>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Article V &amp; Article XIV CBL Signatories &mdash; Highest policy-making and governing body of BulSU MSC
            </p>
            <div className="mt-6 grid gap-2.5">
              {executiveBoard.map((officer) => (
                <div
                  key={officer.role}
                  className="group flex flex-col justify-between border-l-2 border-msc-blue bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:translate-x-1.5 hover:border-msc-amber hover:bg-white/[0.08] hover:text-white sm:flex-row sm:items-center"
                >
                  <span className="text-sm font-semibold text-white">
                    {officer.role}
                  </span>
                  <span className="text-xs font-mono text-blue-200">
                    {officer.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-[#001431]/70 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center border border-msc-lime/30 bg-msc-lime/15 text-msc-lime">
                <Award className="size-5" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                Standing Committees
              </h2>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Article V, Section 2 &amp; 3.2 &mdash; Core committees reporting to the Executive Board
            </p>
            <div className="mt-6 grid gap-4">
              {committees.map((committee) => (
                <div
                  key={committee.name}
                  className="group border-l-2 border-msc-lime bg-white/[0.03] px-4 py-4 transition-all duration-200 hover:translate-x-1.5 hover:border-msc-lime hover:bg-white/[0.08]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-bold text-white">
                        {committee.name}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium text-blue-200">
                        {committee.supervision}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-white/40 transition-colors duration-200 group-hover:text-msc-lime">
                      COMMITTEE
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-slate-300">
                    {committee.desc}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-msc-amber">
                    {committee.roles}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#02001f] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              How Our Community Operates
            </p>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
              Traditions, Assemblies &amp; Democratic Governance
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Guided by our Constitution and By-Laws, every academic year follows
              a structured rhythm of member onboarding, general assemblies,
              regular meetings, and leadership transition.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {traditions.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="border border-white/10 bg-[#001431]/70 p-6 transition-all duration-300 hover:border-msc-blue/50"
                >
                  <div className="flex size-10 items-center justify-center border border-msc-blue/30 bg-msc-blue/15 text-msc-blue">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-msc-amber">
                    {item.article}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-slate-300">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
