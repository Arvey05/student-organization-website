import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type PublicPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PublicPageShell({
  eyebrow,
  title,
  description,
  children,
}: PublicPageShellProps) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--fg-primary)" }}>
      <SiteHeader />
      <main>
        {/* Hero section with brand gradient */}
        <section
          className="relative isolate overflow-hidden"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          {/* Background gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-30"
            style={{
              background: `
                radial-gradient(60% 80% at 0% 65%, rgba(0, 108, 249, 0.18), transparent 60%),
                linear-gradient(135deg, #060062, var(--msc-midnight) 58%)
              `,
            }}
          />

          {/* Grid overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          {/* Bottom amber glow */}
          <div
            aria-hidden="true"
            className="msc-pulse-slow absolute inset-x-[-8%] bottom-0 -z-20 h-32 blur-3xl"
            style={{ background: "radial-gradient(ellipse at center, rgba(255, 185, 0, 0.14), transparent 62%)" }}
          />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-4xl">
              {/* Eyebrow badge */}
              <p
                className="msc-badge msc-badge-blue msc-enter inline-flex"
              >
                {eyebrow}
              </p>

              {/* Brand accent bar */}
              <span className="msc-sweep-bar mt-4 block h-1 w-20 rounded-full" />

              <h1
                className="mt-5 text-4xl tracking-tight msc-enter msc-enter-delay-1 sm:text-6xl"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontStretch: "118%",
                  color: "var(--fg-primary)",
                }}
              >
                {title}
              </h1>
              <p
                className="mt-5 max-w-3xl text-base leading-8 msc-enter msc-enter-delay-2 sm:text-lg"
                style={{ color: "var(--fg-muted)", fontFamily: "var(--font-body)" }}
              >
                {description}
              </p>
            </div>
          </div>
        </section>

        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
