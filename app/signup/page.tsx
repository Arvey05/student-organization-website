import { UserPlus } from "lucide-react";

import { SignupForm } from "@/components/auth/signup-form";
import { PublicPageShell } from "@/components/layout/public-page-shell";

export default function SignUpPage() {
  return (
    <PublicPageShell
      eyebrow="Join the organization"
      title="Create your member account"
      description="Register a member account with Supabase Auth. Profile completion will be expanded in the member profile phase."
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
                  Start with your basic account details.
                </p>
              </div>
            </div>
            <SignupForm />
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
