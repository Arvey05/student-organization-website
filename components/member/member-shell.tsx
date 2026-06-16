import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Settings,
  SquarePlus,
  UserRound,
} from "lucide-react";

import { logout } from "@/app/auth/actions";
import type { UserRole } from "@/types/database";
import { canCreateEvents } from "@/lib/supabase/roles";

const memberNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Announcements", href: "/announcements", icon: Megaphone },
  { label: "Activities", href: "/activities", icon: ClipboardList },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Registered", href: "/my-activities", icon: ClipboardList },
  { label: "Settings", href: "/settings", icon: Settings },
];

type MemberShellProps = {
  children: React.ReactNode;
  role?: UserRole | null;
};

export function MemberShell({ children, role }: MemberShellProps) {
  const navItems = canCreateEvents(role)
    ? [
        ...memberNav,
        {
          label: "Add Event",
          href: "/officer/events/new",
          icon: SquarePlus,
        },
      ]
    : memberNav;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white/90 p-4 backdrop-blur xl:block">
        <Link href="/" className="flex items-center gap-3 px-2 py-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
            MSC
          </span>
          <span>
            <span className="block text-sm font-black">BulSU MSC</span>
            <span className="block text-xs text-slate-500">Member Portal</span>
          </span>
        </Link>

        <nav className="mt-8 space-y-1" aria-label="Member navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action={logout} className="absolute inset-x-4 bottom-4">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </button>
        </form>
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur xl:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="font-black text-slate-950">
            BulSU MSC
          </Link>
          <Link
            href="/"
            className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
            aria-label="Go to public home"
          >
            <Home className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-4" aria-label="Member mobile navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="xl:pl-72">{children}</div>
    </div>
  );
}
