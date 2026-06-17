import Link from "next/link";
import {
  CalendarDays,
  LayoutDashboard,
  LogIn,
  LogOut,
  Sparkles,
  UserPlus,
  UserRound,
} from "lucide-react";

import { logout } from "@/app/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SiteNavLinks } from "@/components/layout/site-nav-links";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Activities", href: "/activities" },
  { label: "Partners", href: "/partners" },
  { label: "Announcements", href: "/announcements" },
  { label: "Calendar", href: "/calendar" },
];

const authenticatedNavItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Activities", href: "/member/activities" },
  { label: "Calendar", href: "/calendar" },
  { label: "My Activities", href: "/my-activities" },
  { label: "Settings", href: "/settings" },
];

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const activeNavItems = user ? authenticatedNavItems : navItems;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#02040a]/90 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center border border-blue-300/25 bg-blue-500/15 text-blue-100 shadow-[0_0_22px_rgba(37,99,235,0.25)]">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black tracking-[0.02em] text-white">
              BulSU MSC
            </span>
            <span className="block text-xs font-medium text-slate-400">
              Student Organization
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-2 lg:flex"
        >
          <SiteNavLinks items={activeNavItems} />
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center gap-2 border border-white/10 px-4 text-sm font-semibold text-slate-200 transition hover:border-blue-300/40 hover:text-white"
              >
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-2 bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400"
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
                className="inline-flex h-10 items-center justify-center gap-2 px-3 text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                <LogIn className="size-4" aria-hidden="true" />
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-10 items-center justify-center gap-2 bg-blue-500 px-4 text-sm font-semibold text-white shadow-[0_0_22px_rgba(37,99,235,0.35)] transition hover:bg-blue-400"
              >
                <UserPlus className="size-4" aria-hidden="true" />
                Sign Up
              </Link>
            </>
          )}
        </div>

        <Link
          href={user ? "/dashboard" : "/calendar"}
          className="inline-flex h-10 items-center justify-center gap-2 border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-blue-300/40 sm:hidden"
        >
          {user ? (
            <UserRound className="size-4" aria-hidden="true" />
          ) : (
            <CalendarDays className="size-4" aria-hidden="true" />
          )}
          {user ? "Portal" : "Calendar"}
        </Link>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="flex gap-4 overflow-x-auto border-t border-white/10 px-4 py-2 lg:hidden"
      >
        <SiteNavLinks items={activeNavItems} mobile />
      </nav>
    </header>
  );
}
