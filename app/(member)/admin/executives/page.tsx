import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ExecutiveProvisioningForm } from "@/components/admin/executive-provisioning-form";
import { ExecutiveRosterList } from "@/components/admin/executive-roster-list";
import { MemberPageHeader } from "@/components/member/page-header";
import { requireSiteAdmin } from "@/lib/admin/access";
import { listExecutiveRoster } from "@/lib/admin/executive-roster-data";

export const metadata: Metadata = {
  title: "Executive provisioning – BulSU MSC",
};

const accessSteps = [
  "Add the person’s login email here, with their tier and position.",
  "They register on the normal Sign Up page with that email. There is no membership choice on registration.",
  "Once they verify the email, their role and event permissions activate automatically.",
  "Deactivating or removing an entry revokes access immediately, including open sessions.",
];

export default async function ExecutiveProvisioningPage() {
  const { supabase } = await requireSiteAdmin();
  const roster = await listExecutiveRoster(supabase);

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Admin dashboard
        </Link>

        <div className="mt-4">
          <MemberPageHeader
            eyebrow="Administration"
            title="Executive provisioning"
            description="Provision core executive and executive members. The roster decides Executive Board access; members cannot request it themselves."
          />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[22rem_1fr] xl:grid-cols-[24rem_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-t border-white/10 bg-black/15 p-6">
              <ExecutiveProvisioningForm />
            </div>

            <section
              aria-labelledby="access-steps-heading"
              className="mt-6 border-t border-white/10 p-6"
            >
              <h2
                id="access-steps-heading"
                className="text-sm font-bold uppercase tracking-[0.12em] text-blue-200"
              >
                How access works
              </h2>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                {accessSteps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-6 shrink-0 items-center justify-center border border-white/15 text-xs font-bold text-blue-100"
                    >
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <ExecutiveRosterList entries={roster} />
        </div>
      </div>
    </main>
  );
}
