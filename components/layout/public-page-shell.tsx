import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PixelBackground } from "@/components/ui/pixel-background";

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
<<<<<<< Updated upstream
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
=======
    <div className="min-h-screen bg-[#02001f] text-white">
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#02001f]">
          <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#02001f_0%,#0b1740_58%,#02001f_100%)]" />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_62%,rgba(0,108,249,0.24),transparent_28%),radial-gradient(circle_at_78%_16%,rgba(127,186,0,0.18),transparent_26%)]" />
          <div className="absolute inset-x-[-18%] bottom-0 -z-10 h-2/3 origin-bottom bg-[linear-gradient(rgba(0,108,249,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(0,108,249,0.11)_1px,transparent_1px)] bg-[size:52px_52px] opacity-80 [transform:perspective(580px)_rotateX(65deg)]" />
          <div className="absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.38)_0.7px,transparent_0.7px)] [background-size:24px_24px]" />
          <PixelBackground />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="brand-hero-enter max-w-4xl">
              <p className="inline-flex rounded-full border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-xs font-semibold tracking-[0.04em] text-blue-100">
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

=======
        <div className="brand-accent-line h-1 w-full" />
>>>>>>> Stashed changes
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
