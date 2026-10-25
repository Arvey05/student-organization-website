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
      "A student body where members have the support and experience to lead responsibly.",
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
      <section className="border-b border-white/10 bg-[#02001f] py-20">
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

          <div className="grid gap-4 md:grid-cols-3">
            {values.map((item, index) => {
              const Icon = item.icon;
              const glowClass = index === 0 ? "msc-card-glow-blue" : index === 1 ? "msc-card-glow-lime" : "msc-card-glow-amber";

              return (
                <article
                  key={item.title}
                  className={`msc-card-hover group border border-white/10 bg-[#001431]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-msc-blue/50 ${glowClass}`}
                >
                  <div className="flex size-12 items-center justify-center border border-msc-blue/30 bg-msc-blue/15 text-msc-blue transition-transform duration-300 group-hover:scale-110">
                    <Icon className="msc-icon-spring size-5" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-msc-amber">
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

<<<<<<< Updated upstream
      <section className="bg-[#000d20] py-20">
=======
      <section className="bg-[#060b2b] py-20">
>>>>>>> Stashed changes
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="border border-white/10 bg-[#001431]/70 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center border border-msc-blue/30 bg-msc-blue/15 text-msc-blue">
                <UsersRound className="size-5" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                Organization officers
              </h2>
            </div>
            <div className="mt-6 grid gap-3">
              {officers.map((officer) => (
                <div
                  key={officer}
                  className="group flex items-center justify-between border-l-2 border-msc-blue bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:translate-x-1.5 hover:border-msc-amber hover:bg-white/[0.08] hover:text-white"
                >
<<<<<<< Updated upstream
                  <span>{officer}</span>
                  <span className="font-mono text-xs text-white/30 transition-colors duration-200 group-hover:text-msc-amber">MSC</span>
=======
                  <span className="text-sm font-semibold text-white">
                    {officer.role}
                  </span>
                  <span className="text-xs font-sans text-yellow-300/80">
                    {officer.name}
                  </span>
>>>>>>> Stashed changes
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
                Organization committees
              </h2>
            </div>
            <div className="mt-6 grid gap-3">
              {committees.map((committee) => (
                <div
                  key={committee}
                  className="group flex items-center justify-between border-l-2 border-msc-lime bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:translate-x-1.5 hover:border-msc-lime hover:bg-white/[0.08] hover:text-white"
                >
                  <span>{committee}</span>
                  <span className="font-mono text-xs text-white/30 transition-colors duration-200 group-hover:text-msc-lime">TEAM</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
