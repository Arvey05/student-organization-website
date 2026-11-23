import type { Metadata } from "next";
import {
  BookOpenCheck,
  CalendarRange,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";

import { ExecutiveBoard } from "@/components/about/executive-board";
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
            <p className="text-sm font-semibold text-blue-200">
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
              <p className="text-sm font-semibold text-msc-amber">
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
                  Bernard M. Tiongson, Noel Pangan Lomerio &amp; Orlando R. Bernaldez
                </div>
                <div>
                  <span className="font-semibold text-white">Lead Peer Mentors:</span>{" "}
                  Dave Anthony R. De Jesus &amp; Glen Justine P. Batis
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className={`border border-white/10 bg-[#001431]/80 p-6 transition-colors hover:border-msc-blue/50`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center border border-msc-blue/30 bg-msc-blue/15 text-msc-blue">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-msc-amber">
                        {item.subtitle}
                      </p>
                      <h3 className="font-display text-xl font-bold text-white">
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

      <ExecutiveBoard />

      <section className="bg-[#02001f] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-200">
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
                  <p className="mt-4 text-sm font-semibold text-msc-amber">
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
