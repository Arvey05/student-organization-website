"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Settings,
  SquarePlus,
} from "lucide-react";

import { logout } from "@/app/auth/actions";
import type { UserRole } from "@/types/database";
import { canCreateEvents } from "@/lib/supabase/roles";

const memberNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Activities", href: "/member/activities", icon: ClipboardList },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "My Activities", href: "/my-activities", icon: ClipboardList },
  { label: "Settings", href: "/settings", icon: Settings },
];

type MemberShellProps = {
  children: React.ReactNode;
  role?: UserRole | null;
};

export function MemberShell({ children, role }: MemberShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const navItems = canCreateEvents(role)
    ? [
        ...memberNav,
        {
          label: "Add Event",
          href: "/officer/events/new",
          icon: SquarePlus,
        },
        {
          label: "Add Announcement",
          href: "/officer/announcements/new",
          icon: Megaphone,
        },
      ]
    : memberNav;

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 bg-[#02040a]/95 p-4 backdrop-blur-md transition-[width] xl:block ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className={`flex min-w-0 items-center gap-3 py-2 ${
              collapsed ? "justify-center" : "px-2"
            }`}
            title="BulSU MSC"
          >
            <span className="flex size-11 shrink-0 items-center justify-center border border-blue-300/25 bg-blue-500/15 text-sm font-black text-blue-100 shadow-[0_0_22px_rgba(37,99,235,0.25)]">
              MSC
            </span>
            {!collapsed ? (
              <span className="min-w-0">
                <span className="block truncate text-sm font-black">
                  BulSU MSC
                </span>
                <span className="block truncate text-xs text-slate-400">
                  Member Portal
                </span>
              </span>
            ) : null}
          </Link>

          {!collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="inline-flex size-9 items-center justify-center border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-blue-300/40 hover:text-white"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-4 inline-flex size-10 items-center justify-center border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-blue-300/40 hover:text-white"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        ) : null}

        <nav className="mt-8 space-y-1" aria-label="Member navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`relative flex items-center gap-3 px-3 py-3 text-sm font-semibold transition ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "border-l border-blue-300 bg-blue-500/10 text-blue-100"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <form action={logout} className="absolute inset-x-4 bottom-4">
          <button
            type="submit"
            title="Logout"
            className={`flex w-full items-center gap-3 border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-semibold text-slate-300 transition hover:border-blue-300/40 hover:text-white ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            {!collapsed ? "Logout" : null}
          </button>
        </form>
      </aside>

      <header
        className="sticky top-0 z-30 border-b border-white/10 bg-[#02040a]/95 backdrop-blur-md xl:hidden"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            href="/dashboard"
            className="font-black text-white"
          >
            BulSU MSC
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="inline-flex size-10 items-center justify-center border border-white/10 bg-white/[0.04] text-white"
              aria-label={collapsed ? "Expand navigation labels" : "Collapse navigation labels"}
            >
              {collapsed ? (
                <ChevronRight className="size-4" aria-hidden="true" />
              ) : (
                <ChevronLeft className="size-4" aria-hidden="true" />
              )}
            </button>
            <Link
              href="/"
              className="inline-flex size-10 items-center justify-center border border-white/10 bg-white/[0.04] text-white"
              aria-label="Go to public home"
            >
              <Home className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <nav
          className="flex gap-2 overflow-x-auto px-4 pb-4"
          aria-label="Member mobile navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`inline-flex shrink-0 items-center gap-2 border px-3 py-2 text-sm font-semibold ${
                  isActive
                    ? "border-blue-300/40 bg-blue-500/15 text-blue-100"
                    : "border-white/10 bg-white/5 text-slate-200"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {!collapsed ? item.label : null}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className={collapsed ? "xl:pl-20" : "xl:pl-72"}>{children}</div>
    </div>
  );
}
