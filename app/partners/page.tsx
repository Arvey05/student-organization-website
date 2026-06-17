import { Building2, Camera, Handshake, Star } from "lucide-react";

import { PublicPageShell } from "@/components/layout/public-page-shell";

const partners = [
  {
    name: "Office of Student Organizations and Activities",
    type: "University partner",
    icon: Building2,
  },
  {
    name: "Official Year-Long Photography Partner",
    type: "Creative partner",
    icon: Camera,
  },
  {
    name: "Campus Program Collaborators",
    type: "Activity partner",
    icon: Handshake,
  },
  {
    name: "Student Support Advocates",
    type: "Community partner",
    icon: Star,
  },
];

export default function PartnersPage() {
  return (
    <PublicPageShell
      eyebrow="Partners"
      title="Collaborators who help strengthen student programs"
      description="This page is prepared for official partner profiles, logos, and links that support the organization's activities."
    >
      <section className="bg-slate-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
              Our partners
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Built for official logos and partner recognition
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Partner cards are prepared for official logos, names, and links
              that support the organization&apos;s activities.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner) => {
              const Icon = partner.icon;

              return (
                <article
                  key={partner.name}
                  className="border-t border-white/10 bg-slate-950 p-6 text-center transition hover:border-blue-300/35"
                >
                  <div className="mx-auto flex aspect-square w-24 items-center justify-center rounded-md border border-dashed border-white/15 bg-black text-blue-100">
                    <Icon className="size-8" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 text-base font-bold text-white">
                    {partner.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">{partner.type}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
