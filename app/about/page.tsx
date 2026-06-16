import { Award, Eye, HeartHandshake, Target, UsersRound } from "lucide-react";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { SectionHeading } from "@/components/ui/section-heading";

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
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Who we are"
            title="Organized, student-led, and community-focused"
            description="The organization connects students with programs, announcements, partners, and opportunities that support growth inside and outside the university."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-100/60"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-slate-950">
                    {item.title}
                  </h2>
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
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <UsersRound className="size-6 text-blue-600" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-slate-950">
                Organization officers
              </h2>
            </div>
            <div className="mt-6 grid gap-3">
              {officers.map((officer) => (
                <div
                  key={officer}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  {officer}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Award className="size-6 text-violet-600" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-slate-950">
                Organization committees
              </h2>
            </div>
            <div className="mt-6 grid gap-3">
              {committees.map((committee) => (
                <div
                  key={committee}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
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
