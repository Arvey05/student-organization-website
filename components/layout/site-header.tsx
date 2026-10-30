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
                className="brand-interactive inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-300 hover:text-blue-200"
              >
                <LayoutDashboard className="size-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="brand-interactive inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-300 hover:text-blue-200"
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
                className="brand-interactive inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-300 hover:text-blue-200"
              >
                <LogIn className="size-4" aria-hidden="true" />
                Log In
              </Link>
              <Link
                href="/signup"
                className="brand-interactive inline-flex h-10 items-center justify-center gap-2 rounded-full bg-blue-500 px-5 text-sm font-bold text-white hover:bg-blue-400"
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
          className="brand-interactive inline-flex h-10 items-center justify-center gap-2 px-2 text-sm font-semibold text-slate-200 hover:text-blue-200 sm:hidden"
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
        className="no-scrollbar flex gap-4 overflow-x-auto border-t border-white/10 px-4 py-2 lg:hidden"
      >
        <SiteNavLinks items={activeNavItems} mobile />
      </nav>
    </header>
  );
}
