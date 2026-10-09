import type { Metadata } from "next";
import { UserPlus, MailCheck } from "lucide-react";

import { SignupForm } from "@/components/auth/signup-form";
import { PublicPageShell } from "@/components/layout/public-page-shell";

export const metadata: Metadata = {
  title: "Sign Up – BulSU MSC",
  description:
    "Register a member account for BulSU MSC (Bulacan State University Microsoft Student Community).",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ email_sent?: string }>;
}) {
  const params = await searchParams;
  const emailSent = params.email_sent === "1";

  return (
    <PublicPageShell
      eyebrow="Join the organization"
      title="Create your member account"
      description="Register a member account for BulSU MSC. After signing up, check your email to verify your account."
    >
      <section className="relative overflow-hidden bg-[#02040a] py-20">
        <div className="absolute left-1/2 top-10 h-72 w-2/3 -translate-x-1/2 bg-blue-500/15 blur-3xl" />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {emailSent ? (
            /* ── Email sent confirmation state ── */
            <div className="relative border border-emerald-400/30 bg-slate-950 p-8 shadow-2xl shadow-blue-950/30">
              <div className="flex flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center bg-emerald-500/15">
                  <MailCheck
                    className="size-8 text-emerald-300"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="mt-6 text-2xl font-black text-white">
                  Check your email
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">
                  We sent a verification link to your email address. Click the
                  link to confirm your BulSU MSC account and then log in.
                </p>
                <p className="mt-4 text-xs text-slate-500">
                  Can&apos;t find the email? Check your spam or junk folder.
                  The link expires in 24 hours.
                </p>
              </div>
            </div>
          ) : (
            /* ── Registration form state ── */
            <div className="relative border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-blue-950/30">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center bg-blue-500/15 text-blue-100">
                  <UserPlus className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    Member registration
                  </h2>
                  <p className="text-sm text-slate-400">
                    Create your BulSU MSC member account.
                  </p>
                </div>
              </div>
              <SignupForm />
            </div>
          )}
        </div>
      </section>
    </PublicPageShell>
  );
}
