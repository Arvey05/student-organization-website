import { Award, Eye, HeartHandshake, Target, UsersRound } from "lucide-react";

import { PublicPageShell } from "@/components/layout/public-page-shell";

const values = [
  {
    title: "Mission",
    description:
      "Create meaningful student experiences through leadership, service, academic support, and community-building programs.",
    icon: Target,
  },
  {
    title: "Vision",
    description:
      "A connected student body where members are empowered to lead responsibly and contribute with confidence.",
    icon: Eye,
  },
  {
    title: "What we do",
    description:
      "Organize activities, coordinate partnerships, publish announcements, and support members throughout the academic year.",
    icon: HeartHandshake,
  },
];

const officers = [
  "President",
  "Vice President for Internal Affairs",
  "Vice President for External Affairs",
  "Secretary",
  "Treasurer",
];

const committees = [
  "Membership and Records",
  "Programs and Events",
  "Creatives and Documentation",
  "Partnerships and External Relations",
];

export default function AboutPage() {
  return (
    <PublicPageShell
      eyebrow="About the organization"
      title="A student organization built around leadership and service"
      description="Learn who we are, what guides our work, and how officers and committees support members across the academic year."
    >
      <section className="border-b border-white/10 bg-[#02040a] py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Who we are
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Organized, student-led, and community-focused
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              The organization connects students with programs, announcements,
              partners, and opportunities that support growth inside and
              outside the university.
            </p>
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
                  <h2 className="mt-5 text-xl font-black text-white">
                    {item.title}
                  </h2>
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
                Organization officers
              </h2>
            </div>
            <div className="mt-6 grid gap-3">
              {officers.map((officer) => (
                <div
                  key={officer}
                  className="border-l border-blue-300/40 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300"
                >
                  {officer}
                </div>
              ))}
            </div>
          </div>

          <div className="border-y border-white/10 bg-slate-950 p-6">
            <div className="flex items-center gap-3">
              <Award className="size-6 text-blue-200" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white">
                Organization committees
              </h2>
            </div>
            <div className="mt-6 grid gap-3">
              {committees.map((committee) => (
                <div
                  key={committee}
                  className="border-l border-violet-300/35 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300"
                >
                  {committee}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
