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
  { label: "Dashboard",    href: "/dashboard",         icon: LayoutDashboard },
  { label: "Activities",   href: "/member/activities", icon: ClipboardList   },
  { label: "Calendar",     href: "/calendar",          icon: CalendarDays    },
  { label: "My Activities",href: "/my-activities",     icon: ClipboardList   },
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
      if (!profileMenuRef.current?.contains(target)) setProfileOpen(false);
      if (!officerMenuRef.current?.contains(target)) setOfficerOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--fg-primary)" }}>
      {/* ── Member header ── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "color-mix(in srgb, var(--bg-base) 92%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {/* Brand gradient top accent bar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "var(--msc-grad-sweep)" }}
        />

        <div className="mx-auto flex max-w-[96rem] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="group flex shrink-0 items-center gap-3"
            style={{ color: "var(--fg-primary)" }}
          >
            <span
              className="relative flex h-9 w-9 flex-col items-center justify-center leading-none"
              style={{
                background: "linear-gradient(135deg, var(--msc-navy), var(--msc-midnight))",
                border: "1.5px solid rgba(0, 108, 249, 0.45)",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontStretch: "125%",
                letterSpacing: "-0.065em",
                color: "#FDFBFB",
              }}
            >
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 h-1.5 w-1.5"
                style={{ background: "var(--msc-amber)" }}
              />
              <span style={{ fontSize: "0.44rem", lineHeight: 1 }}>BULSU</span>
              <span style={{ fontSize: "0.68rem", lineHeight: 1 }}>MSC</span>
            </span>
            <span className="hidden leading-none sm:block">
              <span
                className="block text-sm"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontStretch: "125%", letterSpacing: "-0.04em" }}
              >
                BulSU MSC
              </span>
              <span
                className="mt-0.5 block text-[0.6rem] uppercase"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.24em", color: "var(--fg-muted)" }}
              >
                Member Portal
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
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
                  className="group relative inline-flex shrink-0 items-center gap-2 px-2.5 py-2 text-xs font-semibold uppercase transition-all duration-200 hover:text-[var(--fg-primary)]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.14em",
                    color: isActive ? "var(--fg-primary)" : "var(--fg-muted)",
                  }}
                >
                  <Icon className="size-3.5 shrink-0 transition-transform duration-200 group-hover:scale-115" aria-hidden="true" />
                  <span>{item.label}</span>
                  {/* Active persistent indicator */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-1 bottom-0 h-0.5 rounded-full"
                      style={{
                        background: "var(--msc-grad-sweep)",
                        boxShadow: "0 0 8px rgba(0, 108, 249, 0.5)",
                      }}
                    />
                  )}
                  {/* Inactive hover sweep indicator */}
                  {!isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-1 bottom-0 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-x-100"
                      style={{ background: "var(--msc-grad-sweep)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Officer quick-add */}
            {isOfficerEventCreator ? (
              <div ref={officerMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setOfficerOpen((v) => !v)}
                  className="inline-flex size-9 items-center justify-center transition-all duration-200 hover:scale-105 hover:border-[var(--msc-amber)] hover:shadow-[0_0_14px_rgba(255,185,0,0.4)] active:scale-95"
                  style={{
                    background: "rgba(255, 185, 0, 0.1)",
                    border: "1px solid rgba(255, 185, 0, 0.35)",
                    borderRadius: "50%",
                    color: "var(--msc-amber)",
                  }}
                  aria-expanded={officerOpen}
                  aria-label="Open officer quick actions"
                >
                  <SquarePlus className="size-4" aria-hidden="true" />
                </button>
                {officerOpen ? (
                  <div
                    className="msc-card absolute right-0 top-11 w-56 p-2 rounded-xl"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-subtle)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <Link
                      href="/officer/events/new"
                      onClick={() => setOfficerOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      <SquarePlus className="size-4" aria-hidden="true" style={{ color: "var(--msc-amber)" }} />
                      Add Event
                    </Link>
                    <Link
                      href="/officer/announcements/new"
                      onClick={() => setOfficerOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      <Megaphone className="size-4" aria-hidden="true" style={{ color: "var(--msc-amber)" }} />
                      Add Announcement
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Profile dropdown */}
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="inline-flex items-center gap-2 p-1 pr-2.5 transition-all duration-200 hover:border-[var(--msc-blue)] hover:shadow-[0_0_12px_rgba(0,108,249,0.3)] active:scale-95"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "9999px",
                  color: "var(--fg-muted)",
                }}
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
              >
                <MemberAvatar
                  displayName={displayName}
                  imageUrl={profilePictureUrl}
                  size={32}
                  className="rounded-full"
                />
                <ChevronDown className="size-3.5 transition-transform duration-200" style={{ transform: profileOpen ? "rotate(180deg)" : "none" }} aria-hidden="true" />
              </button>
              {profileOpen ? (
                <div
                  className="msc-card absolute right-0 top-11 w-64 p-2 rounded-xl"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div
                    className="px-3 py-3"
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  >
                    <p className="truncate text-sm font-bold" style={{ color: "var(--fg-primary)", fontFamily: "var(--font-display)" }}>
                      {displayName}
                    </p>
                    {email ? (
                      <p className="mt-1 truncate text-xs" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                        {email}
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    <UserRound className="size-4" aria-hidden="true" style={{ color: "var(--msc-blue)" }} />
                    Member Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    <Settings className="size-4" aria-hidden="true" style={{ color: "var(--msc-blue)" }} />
                    Settings
                  </Link>
                  <form
                    action={logout}
                    style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem", marginTop: "0.25rem" }}
                  >
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      <LogOut className="size-4" aria-hidden="true" style={{ color: "var(--msc-amber)" }} />
                      Logout
                    </button>
                  </form>
                </div>
              ) : null}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex size-9 items-center justify-center transition lg:hidden"
              style={{
                border: "1px solid var(--border-subtle)",
                color: "var(--fg-muted)",
              }}
              aria-expanded={mobileOpen}
              aria-controls="member-mobile-nav"
              aria-label="Toggle member navigation"
            >
              {mobileOpen ? (
                <X className="size-4" aria-hidden="true" />
              ) : (
                <Menu className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileOpen ? (
          <div
            id="member-mobile-nav"
            className="px-4 py-4 sm:px-6 lg:hidden"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <div className="mb-4 flex items-center gap-3">
              <MemberAvatar displayName={displayName} imageUrl={profilePictureUrl} size={38} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold" style={{ color: "var(--fg-primary)", fontFamily: "var(--font-display)" }}>
                  {displayName}
                </p>
                {email ? (
                  <p className="truncate text-xs" style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                    {email}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Brand accent bar */}
            <div aria-hidden="true" className="msc-accent-bar-full mb-4 h-0.5" />

            <nav className="grid gap-1 sm:grid-cols-2" aria-label="Member mobile navigation">
              {memberNav.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center gap-3 border-l px-3 py-3 text-xs font-semibold uppercase transition"
                    style={{
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.1em",
                      borderColor: isActive ? "var(--msc-amber)" : "transparent",
                      color: isActive ? "var(--msc-amber)" : "var(--fg-muted)",
                    }}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-3 border-l border-transparent px-3 py-3 text-xs font-semibold uppercase transition"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--fg-muted)" }}
              >
                <UserRound className="size-4" aria-hidden="true" />
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-3 border-l border-transparent px-3 py-3 text-xs font-semibold uppercase transition"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--fg-muted)" }}
              >
                <Settings className="size-4" aria-hidden="true" />
                Settings
              </Link>
            </nav>
            <form
              action={logout}
              style={{ marginTop: "0.75rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}
            >
              <button
                type="submit"
                className="inline-flex w-full items-center gap-3 px-3 py-3 text-xs font-semibold uppercase transition"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--fg-muted)" }}
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
