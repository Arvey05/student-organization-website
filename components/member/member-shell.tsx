"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  Settings,
  SquarePlus,
  UserRound,
  X,
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
  displayName: string;
  email?: string;
  profilePictureUrl?: string | null;
  role?: UserRole | null;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "M";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";

  return `${first}${second}`.toUpperCase();
}

export function MemberShell({
  children,
  displayName,
  email,
  profilePictureUrl,
  role,
}: MemberShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
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
      <header className="sticky top-0 z-40 bg-[#02040a]/95">
        <div className="mx-auto flex max-w-[96rem] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="group flex shrink-0 items-center gap-3 text-white transition hover:text-blue-100"
          >
            <span className="relative flex size-9 items-center justify-center border border-white/15 text-[0.62rem] font-black text-blue-100 transition group-hover:border-blue-300/50">
              <span className="absolute -right-1 -top-1 size-1.5 bg-orange-400" />
              MSC
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-sm font-black tracking-tight">
                BulSU MSC
              </span>
              <span className="mt-1 block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-500">
                Member portal
              </span>
            </span>
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center gap-4 overflow-x-auto lg:flex"
            aria-label="Member navigation"
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
                className={`relative inline-flex shrink-0 items-center gap-2 px-1 py-2 font-mono text-xs uppercase tracking-[0.1em] transition ${
                  isActive
                    ? "text-blue-100 after:absolute after:inset-x-1 after:-bottom-4 after:h-px after:bg-blue-300"
                    : "text-slate-500 hover:text-blue-200"
                }`}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          </nav>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <Link
              href="/profile"
              className="flex max-w-52 items-center gap-3 text-slate-300 transition hover:text-blue-200"
            >
              <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden border border-white/10 text-xs font-black text-blue-100">
                {profilePictureUrl ? (
                  <Image
                    src={profilePictureUrl}
                    alt={`${displayName} profile picture`}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  getInitials(displayName)
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">
                  {displayName}
                </span>
                {email ? (
                  <span className="block truncate text-xs text-slate-500">
                    {email}
                  </span>
                ) : null}
              </span>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-2 py-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 transition hover:text-blue-200"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Logout
              </button>
            </form>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="ml-auto inline-flex size-10 items-center justify-center border border-white/10 text-slate-200 transition hover:border-blue-300/40 hover:text-blue-200 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="member-mobile-nav"
            aria-label="Toggle member navigation"
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {mobileOpen ? (
          <div
            id="member-mobile-nav"
            className="border-t border-white/10 px-4 py-4 sm:px-6 lg:hidden"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden border border-white/10 text-xs font-black text-blue-100">
                {profilePictureUrl ? (
                  <Image
                    src={profilePictureUrl}
                    alt={`${displayName} profile picture`}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  getInitials(displayName)
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {displayName}
                </p>
                {email ? (
                  <p className="truncate text-xs text-slate-500">{email}</p>
                ) : null}
              </div>
            </div>
            <nav className="grid gap-1 sm:grid-cols-2" aria-label="Member mobile navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    onClick={() => setMobileOpen(false)}
                    className={`inline-flex items-center gap-3 border-l px-3 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "border-blue-300 bg-blue-500/10 text-blue-100"
                        : "border-transparent text-slate-300 hover:text-blue-200"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-3 border-l border-transparent px-3 py-3 text-sm font-semibold text-slate-300 transition hover:text-blue-200"
              >
                <UserRound className="size-4" aria-hidden="true" />
                Profile
              </Link>
            </nav>
            <form action={logout} className="mt-3 border-t border-white/10 pt-3">
              <button
                type="submit"
                className="inline-flex w-full items-center gap-3 px-3 py-3 text-sm font-semibold text-slate-300 transition hover:text-blue-200"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Logout
              </button>
            </form>
          </div>
        ) : null}
      </header>

      <div className="mx-auto w-full max-w-[96rem]">
        {children}
      </div>
    </div>
  );
}
