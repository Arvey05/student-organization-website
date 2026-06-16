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
  { label: "Profile", href: "/profile" },
  { label: "Activities", href: "/member/activities" },
  { label: "Calendar", href: "/calendar" },
];

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const activeNavItems = user ? authenticatedNavItems : navItems;

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black tracking-tight text-slate-950">
              BulSU MSC
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Student Organization
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm lg:flex"
        >
          {activeNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
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
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/20"
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
        className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 lg:hidden"
      >
        {activeNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
