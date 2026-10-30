import { Suspense } from "react";
import type { Metadata } from "next";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { EmailConfirmedContent } from "./email-confirmed-content";

export const metadata: Metadata = {
  title: "Email Confirmed – BulSU MSC",
  description:
    "Your BulSU MSC member account email verification status.",
};

export default function EmailConfirmedPage() {
  return (
    <PublicPageShell
      eyebrow="Email verification"
      title="Account verification"
      description="Check the status of your BulSU MSC account email verification."
    >
      <section className="relative overflow-hidden bg-[#02001f] py-20">
        <div className="absolute left-1/2 top-10 h-72 w-2/3 -translate-x-1/2 bg-blue-500/15 blur-3xl" />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="relative border border-white/10 bg-slate-950 p-8 shadow-2xl shadow-blue-950/30">
            {/* Suspense is required because EmailConfirmedContent uses useSearchParams */}
            <Suspense
              fallback={
                <p className="text-center text-sm text-slate-400">
                  Loading…
                </p>
              }
            >
              <EmailConfirmedContent />
            </Suspense>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
