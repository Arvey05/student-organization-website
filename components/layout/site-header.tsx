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
import { ButtonLink } from "@/components/ui/button-link";

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-md bg-blue-600 text-white">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black tracking-tight text-white">
              BulSU MSC
            </span>
            <span className="block text-xs font-medium text-slate-400">
              Student Organization
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 border border-white/10 bg-slate-950 p-1 lg:flex"
        >
          {activeNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          {user ? (
            <>
              <ButtonLink href="/dashboard" variant="secondary" className="gap-2">
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Dashboard
              </ButtonLink>
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="secondary" className="gap-2">
                <LogIn className="size-4" aria-hidden="true" />
                Log In
              </ButtonLink>
              <ButtonLink href="/signup" className="gap-2">
                <UserPlus className="size-4" aria-hidden="true" />
                Sign Up
              </ButtonLink>
            </>
          )}
        </div>

        <ButtonLink
          href={user ? "/dashboard" : "/calendar"}
          variant="secondary"
          className="gap-2 sm:hidden"
        >
          {user ? (
            <UserRound className="size-4" aria-hidden="true" />
          ) : (
            <CalendarDays className="size-4" aria-hidden="true" />
          )}
          {user ? "Portal" : "Calendar"}
        </ButtonLink>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 lg:hidden"
      >
        {activeNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-md border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-blue-300/40 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
