import { Building2, Camera, Handshake, Star } from "lucide-react";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { SectionHeading } from "@/components/ui/section-heading";

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
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our partners"
            title="Built for official logos and partner recognition"
            description="Partner cards currently use placeholders until final logos, names, and links are provided."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner) => {
              const Icon = partner.icon;

              return (
                <article
                  key={partner.name}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-100/60"
                >
                  <div className="mx-auto flex aspect-square w-24 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white text-blue-700">
                    <Icon className="size-8" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 text-base font-bold text-slate-950">
                    {partner.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">{partner.type}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
