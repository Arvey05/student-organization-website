"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  ChevronDown,
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
import { MemberAvatar } from "@/components/member/member-avatar";

const memberNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Activities", href: "/member/activities", icon: ClipboardList },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "My Activities", href: "/my-activities", icon: ClipboardList },
];

type MemberShellProps = {
  children: React.ReactNode;
  displayName: string;
  email?: string;
  profilePictureUrl?: string | null;
  role?: UserRole | null;
};

export function MemberShell({
  children,
  displayName,
  email,
  profilePictureUrl,
  role,
}: MemberShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [officerOpen, setOfficerOpen] = React.useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);
  const officerMenuRef = React.useRef<HTMLDivElement>(null);
  const isOfficerEventCreator = canCreateEvents(role);

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (!profileMenuRef.current?.contains(target)) {
        setProfileOpen(false);
      }

      if (!officerMenuRef.current?.contains(target)) {
        setOfficerOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#02040a]/95">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/25 to-transparent" />
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
            className="hidden min-w-0 flex-1 items-center justify-center gap-6 overflow-x-auto lg:flex"
            aria-label="Member navigation"
          >
          {memberNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`relative inline-flex shrink-0 items-center gap-2 px-1 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "text-white after:absolute after:inset-x-2 after:-bottom-4 after:h-px after:bg-blue-300"
                    : "text-slate-400 hover:text-blue-100"
                }`}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {isOfficerEventCreator ? (
              <div ref={officerMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setOfficerOpen((value) => !value)}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-orange-300/25 bg-orange-300/10 text-orange-100 shadow-lg shadow-orange-950/20 transition hover:border-orange-200/50 hover:bg-orange-300/15"
                  aria-expanded={officerOpen}
                  aria-label="Open officer quick actions"
                >
                  <SquarePlus className="size-4" aria-hidden="true" />
                </button>
                {officerOpen ? (
                  <div className="absolute right-0 top-12 w-56 border border-white/10 bg-[#05070d] p-2 shadow-2xl shadow-black/40">
                    <Link
                      href="/officer/events/new"
                      onClick={() => setOfficerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.04] hover:text-orange-100"
                    >
                      <SquarePlus className="size-4" aria-hidden="true" />
                      Add Event
                    </Link>
                    <Link
                      href="/officer/announcements/new"
                      onClick={() => setOfficerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.04] hover:text-orange-100"
                    >
                      <Megaphone className="size-4" aria-hidden="true" />
                      Add Announcement
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1 pr-2 text-slate-300 transition hover:border-blue-300/35 hover:text-blue-100"
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
              >
                <MemberAvatar
                  displayName={displayName}
                  imageUrl={profilePictureUrl}
                  size={34}
                  className="rounded-full"
                />
                <ChevronDown className="size-4" aria-hidden="true" />
              </button>
              {profileOpen ? (
                <div className="absolute right-0 top-12 w-64 border border-white/10 bg-[#05070d] p-2 shadow-2xl shadow-black/40">
                  <div className="border-b border-white/10 px-3 py-3">
                    <p className="truncate text-sm font-bold text-white">
                      {displayName}
                    </p>
                    {email ? (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {email}
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="mt-2 flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.04] hover:text-blue-100"
                  >
                    <UserRound className="size-4" aria-hidden="true" />
                    Member Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.04] hover:text-blue-100"
                  >
                    <Settings className="size-4" aria-hidden="true" />
                    Settings
                  </Link>
                  <form action={logout} className="border-t border-white/10 pt-2">
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/[0.04] hover:text-blue-100"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      Logout
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex size-10 items-center justify-center border border-white/10 text-slate-200 transition hover:border-blue-300/40 hover:text-blue-200 lg:hidden"
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
              <MemberAvatar
                displayName={displayName}
                imageUrl={profilePictureUrl}
                size={40}
              />
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
              {memberNav.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    onClick={() => setMobileOpen(false)}
                    className={`inline-flex items-center gap-3 border-l px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.1em] transition ${
                      isActive
                        ? "border-blue-300 text-blue-100"
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
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-3 border-l border-transparent px-3 py-3 text-sm font-semibold text-slate-300 transition hover:text-blue-200"
              >
                <Settings className="size-4" aria-hidden="true" />
                Settings
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
