import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  LayoutDashboard,
  LogIn,
  LogOut,
  UserPlus,
  UserRound,
} from "lucide-react";

import { logout } from "@/app/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SiteNavLinks } from "@/components/layout/site-nav-links";

const navItems = [
  { label: "Home",          href: "/" },
  { label: "About",         href: "/about" },
  { label: "Activities",    href: "/activities" },
  { label: "Partners",      href: "/partners" },
  { label: "Announcements", href: "/announcements" },
  { label: "Calendar",      href: "/calendar" },
];

const authenticatedNavItems = [
  { label: "Dashboard",    href: "/dashboard" },
  { label: "Activities",   href: "/member/activities" },
  { label: "Calendar",     href: "/calendar" },
  { label: "My Activities",href: "/my-activities" },
  { label: "Settings",     href: "/settings" },
];

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const activeNavItems = user ? authenticatedNavItems : navItems;

  return (
<<<<<<< Updated upstream
    <header
      className="sticky top-0 z-50"
      style={{
        background: "color-mix(in srgb, var(--bg-base) 88%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {/* Top gradient accent line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--msc-grad-sweep)" }}
      />

      <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 transition-opacity duration-200 hover:opacity-95"
          style={{ color: "var(--fg-primary)" }}
        >
          {/* Wordmark box */}
          <span
            className="relative flex h-9 w-9 flex-col items-center justify-center leading-none transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--msc-blue)]"
            style={{
              background: "linear-gradient(135deg, var(--msc-navy), var(--msc-midnight))",
              border: "1.5px solid rgba(0, 108, 249, 0.45)",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "0.52rem",
              letterSpacing: "-0.065em",
              fontStretch: "125%",
              color: "#FDFBFB",
              boxShadow: "0 0 0 0 rgba(0, 108, 249, 0)",
            }}
          >
            {/* Amber pixel dot — brand barcode corner */}
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 h-1.5 w-1.5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-45 group-hover:shadow-[0_0_8px_var(--msc-amber)]"
              style={{ background: "var(--msc-amber)" }}
            />
            <span style={{ fontSize: "0.48rem", lineHeight: 1 }}>BULSU</span>
            <span style={{ fontSize: "0.72rem", lineHeight: 1 }}>MSC</span>
          </span>

          <span className="hidden leading-none sm:block">
            <span
              className="block text-sm transition-colors duration-200 group-hover:text-[#a5c8ff]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontStretch: "125%", letterSpacing: "-0.04em" }}
            >
              BulSU MSC
            </span>
            <span
              className="mt-0.5 block text-[0.6rem] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.24em", color: "var(--fg-muted)" }}
            >
              Student Org
            </span>
          </span>
=======
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#02001f]/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="brand-interactive group flex shrink-0 items-center text-white hover:opacity-90"
        >
          <Image
            src="/brand/msc-horizontal-reversed.png"
            alt="BulSU Microsoft Student Community"
            width={1400}
            height={465}
            priority
            className="h-10 w-auto max-w-[138px] object-contain sm:h-11 sm:max-w-[154px]"
          />
>>>>>>> Stashed changes
        </Link>

        {/* ── Desktop nav ── */}
        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
          <SiteNavLinks items={activeNavItems} />
        </nav>

        {/* ── Auth actions ── */}
        <div className="hidden items-center gap-2 sm:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
<<<<<<< Updated upstream
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-all duration-200 hover:bg-white/5 hover:text-[var(--fg-primary)] active:scale-95"
                style={{
                  color: "var(--fg-muted)",
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.02em",
                }}
=======
                className="brand-interactive inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-300 hover:text-blue-200"
>>>>>>> Stashed changes
              >
                <LayoutDashboard className="size-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
<<<<<<< Updated upstream
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-all duration-200 hover:bg-red-500/10 hover:text-red-300 active:scale-95"
                  style={{
                    color: "var(--fg-muted)",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.02em",
                  }}
=======
                  className="brand-interactive inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-300 hover:text-blue-200"
>>>>>>> Stashed changes
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
<<<<<<< Updated upstream
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-all duration-200 hover:bg-white/5 hover:text-[var(--fg-primary)] active:scale-95"
                style={{
                  color: "var(--fg-muted)",
                  fontFamily: "var(--font-body)",
                }}
=======
                className="brand-interactive inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-300 hover:text-blue-200"
>>>>>>> Stashed changes
              >
                <LogIn className="size-4" aria-hidden="true" />
                Log In
              </Link>
              <Link
                href="/signup"
<<<<<<< Updated upstream
                className="msc-btn-primary"
                style={{ height: "2.25rem" }}
=======
                className="brand-interactive inline-flex h-10 items-center justify-center gap-2 rounded-full bg-blue-500 px-5 text-sm font-bold text-white hover:bg-blue-400"
>>>>>>> Stashed changes
              >
                <UserPlus className="size-3.5" aria-hidden="true" />
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile icon ── */}
        <Link
          href={user ? "/dashboard" : "/calendar"}
<<<<<<< Updated upstream
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-semibold transition-all duration-200 hover:bg-white/5 hover:text-[var(--fg-primary)] active:scale-95 sm:hidden"
          style={{ color: "var(--fg-muted)" }}
=======
          className="brand-interactive inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-200 hover:text-blue-200 sm:hidden"
>>>>>>> Stashed changes
        >
          {user ? (
            <UserRound className="size-4" aria-hidden="true" />
          ) : (
            <CalendarDays className="size-4" aria-hidden="true" />
          )}
          {user ? "Portal" : "Calendar"}
        </Link>
      </div>

      {/* ── Mobile scrollable nav row ── */}
      <nav
        aria-label="Mobile navigation"
<<<<<<< Updated upstream
        className="flex gap-4 overflow-x-auto px-4 py-2 lg:hidden"
        style={{
          borderTop: "1px solid var(--border-subtle)",
          scrollbarWidth: "none",
        }}
=======
        className="no-scrollbar flex gap-4 overflow-x-auto border-t border-white/10 px-4 py-2 lg:hidden"
>>>>>>> Stashed changes
      >
        <SiteNavLinks items={activeNavItems} mobile />
      </nav>
    </header>
  );
}
