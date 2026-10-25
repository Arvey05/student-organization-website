import { LogIn } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { PublicPageShell } from "@/components/layout/public-page-shell";

export default function LoginPage() {
  return (
    <PublicPageShell
      eyebrow="Member access"
      title="Log in to your member account"
      description="Use your registered email and password to access protected member pages."
    >
<<<<<<< Updated upstream
      <section
        className="relative overflow-hidden py-20"
        style={{ background: "var(--bg-base)" }}
      >
        <div
          className="absolute left-1/2 top-10 h-64 w-2/3 -translate-x-1/2 blur-3xl"
          style={{ background: "rgba(0, 108, 249, 0.12)" }}
        />
=======
      <section className="relative overflow-hidden bg-[#02001f] py-20">
        <div className="absolute left-1/2 top-10 h-64 w-2/3 -translate-x-1/2 bg-blue-500/15 blur-3xl" />
>>>>>>> Stashed changes
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
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
                style={{ background: "var(--msc-blue-dim)" }}
              >
                <LogIn className="size-5" aria-hidden="true" style={{ color: "var(--msc-blue)" }} />
              </div>
              <div>
                <h2
                  className="text-xl font-black"
                  style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}
                >
                  Welcome back
                </h2>
                <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                  Use your registered email address.
                </p>
              </div>
            </div>
            <LoginForm />
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
