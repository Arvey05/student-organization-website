import type { Metadata } from "next";
import { MailCheck, UserPlus } from "lucide-react";

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
      <section className="relative overflow-hidden bg-[#02001f] py-20">
        <div className="absolute left-1/2 top-10 h-72 w-2/3 -translate-x-1/2 bg-blue-500/15 blur-3xl" />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Brand gradient top strip */}
          <div
            aria-hidden="true"
            className="h-1 w-full"
            style={{ background: "var(--msc-grad-sweep)" }}
          />
          <div
            className="relative p-7"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 24px 48px rgba(0, 36, 83, 0.5)",
            }}
          >
            {emailSent ? (
              /* ── Email sent confirmation state ── */
              <div className="flex flex-col items-center py-4 text-center">
                <div
                  className="flex size-16 items-center justify-center"
                  style={{ background: "var(--msc-lime-dim)" }}
                >
                  <MailCheck
                    className="size-8"
                    aria-hidden="true"
                    style={{ color: "var(--msc-lime)" }}
                  />
                </div>
                <h2
                  className="mt-6 text-2xl font-black"
                  style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}
                >
                  Check your email
                </h2>
                <p
                  className="mt-3 max-w-sm text-sm leading-7"
                  style={{ color: "var(--fg-muted)" }}
                >
                  We sent a verification link to your email address. Click the
                  link to confirm your BulSU MSC account and then log in.
                </p>
                <p className="mt-4 text-xs" style={{ color: "var(--fg-muted)" }}>
                  Can&apos;t find the email? Check your spam or junk folder.
                  The link expires in 24 hours.
                </p>
              </div>
            ) : (
              /* ── Registration form state ── */
              <>
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-12 items-center justify-center"
                    style={{ background: "var(--msc-lime-dim)" }}
                  >
                    <UserPlus className="size-5" aria-hidden="true" style={{ color: "var(--msc-lime)" }} />
                  </div>
                  <div>
                    <h2
                      className="text-xl font-black"
                      style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}
                    >
                      Member registration
                    </h2>
                    <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                      Create your BulSU MSC member account.
                    </p>
                  </div>
                </div>
                <SignupForm />
              </>
            )}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
