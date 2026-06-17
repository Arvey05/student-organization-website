import Link from "next/link";
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
    <header className="sticky top-0 z-50 bg-[#02040a]/95 text-white">
      <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 text-white transition hover:text-blue-100"
        >
          <span className="relative flex size-9 items-center justify-center border border-white/15 text-[0.62rem] font-black tracking-tight text-blue-100 transition group-hover:border-blue-300/50">
            <span className="absolute -right-1 -top-1 size-1.5 bg-orange-400" />
            MSC
          </span>
          <span className="leading-none">
            <span className="block text-sm font-black tracking-tight">
              BulSU MSC
            </span>
            <span className="mt-1 block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-500">
              Student org
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 lg:flex"
        >
          <SiteNavLinks items={activeNavItems} />
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-300 transition hover:text-blue-200"
              >
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-300 transition hover:text-blue-200"
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
                className="inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-300 transition hover:text-blue-200"
              >
                <LogIn className="size-4" aria-hidden="true" />
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-10 items-center justify-center gap-2 bg-white px-4 text-sm font-black text-slate-950 transition hover:bg-blue-100"
              >
                <UserPlus className="size-4" aria-hidden="true" />
                Sign Up
              </Link>
            </>
          )}
        </div>

        <Link
          href={user ? "/dashboard" : "/calendar"}
          className="inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-200 transition hover:text-blue-200 sm:hidden"
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
