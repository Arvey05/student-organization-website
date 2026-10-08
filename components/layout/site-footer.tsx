import Link from "next/link";
import { Mail, MapPin, Share2 } from "lucide-react";

const footerLinks = [
  { label: "Home",          href: "/" },
  { label: "About",         href: "/about" },
  { label: "Activities",    href: "/activities" },
  { label: "Partners",      href: "/partners" },
  { label: "Announcements", href: "/announcements" },
  { label: "Calendar",      href: "/calendar" },
  { label: "Login",         href: "/login" },
  { label: "Sign Up",       href: "/signup" },
];

export function SiteFooter() {
  return (
    <footer
      style={{
        background: "var(--msc-midnight)",
        borderTop: "1px solid var(--border-subtle)",
        color: "var(--fg-primary)",
      }}
    >
      {/* Brand accent top bar */}
      <div
        aria-hidden="true"
        className="h-1 w-full"
        style={{ background: "var(--msc-grad-sweep)" }}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        {/* ── Brand block ── */}
        <div>
          <div className="group flex w-fit items-center gap-3 cursor-pointer">
            {/* Wordmark */}
            <div
              className="relative flex h-12 w-12 flex-col items-center justify-center leading-none transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--msc-blue)] group-hover:shadow-[0_0_16px_rgba(0,108,249,0.35)]"
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
                className="absolute -right-1 -top-1 h-2 w-2 transition-all duration-300 group-hover:rotate-45 group-hover:scale-125 group-hover:shadow-[0_0_8px_var(--msc-amber)]"
                style={{ background: "var(--msc-amber)" }}
              />
              <span style={{ fontSize: "0.5rem", lineHeight: 1 }}>BULSU</span>
              <span style={{ fontSize: "0.8rem", lineHeight: 1 }}>MSC</span>
            </div>
            <div>
              <p
                className="text-base font-bold transition-colors duration-200 group-hover:text-[#a5c8ff]"
                style={{ fontFamily: "var(--font-display)", fontStretch: "125%", color: "var(--fg-primary)" }}
              >
                BulSU MSC
              </p>
              <p
                className="mt-0.5 text-xs"
                style={{ color: "var(--fg-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
              >
                Microsoft Student Community
              </p>
            </div>
          </div>

          <p
            className="mt-5 max-w-xs text-sm leading-7"
            style={{ color: "var(--fg-muted)" }}
          >
            Leadership, service, and community for every member.
            Together, we go further.
          </p>

          {/* Barcode motif with hover opacity animation */}
          <div
            aria-hidden="true"
            className="msc-barcode group mt-6 cursor-default transition-all duration-300 hover:opacity-100"
            style={{ color: "rgba(0, 108, 249, 0.4)", gap: 0 }}
          >
            {Array.from({ length: 28 }).map((_, k) => (
              <i
                key={k}
                className="transition-transform duration-200 group-hover:scale-y-125"
                style={{
                  width: `${1 + (k * 7 + k * k) % 4}px`,
                  marginRight: `${1 + k % 3}px`,
                  opacity: 0.4 + ((k * 13) % 6) * 0.1,
                  transitionDelay: `${k * 15}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Explore links ── */}
        <div>
          <h2
            className="text-xs font-bold uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.3em",
              color: "var(--msc-amber)",
            }}
          >
            Explore
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center text-sm font-medium transition-all duration-200 hover:translate-x-1 hover:text-[var(--msc-blue)]"
                style={{
                  color: "var(--fg-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <span className="mr-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ color: "var(--msc-blue)" }}>
                  &rsaquo;
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Connect ── */}
        <div>
          <h2
            className="text-xs font-bold uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.3em",
              color: "var(--msc-lime)",
            }}
          >
            Connect
          </h2>
          <div className="mt-5 space-y-4 text-sm" style={{ color: "var(--fg-muted)" }}>
            <a
              href="https://www.facebook.com/bulsumsc"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 transition-colors duration-200 hover:text-white"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Share2 className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-125 group-hover:rotate-12" aria-hidden="true" style={{ color: "var(--msc-blue)" }} />
              Facebook page
            </a>
            <a
              href="mailto:bulsu.officialmsc@gmail.com"
              className="group flex items-center gap-3 transition-colors duration-200 hover:text-white"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Mail className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-125 group-hover:rotate-12" aria-hidden="true" style={{ color: "var(--msc-blue)" }} />
              bulsu.officialmsc@gmail.com
            </a>
            <p className="group flex items-center gap-3" style={{ fontFamily: "var(--font-body)" }}>
              <MapPin className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-125" aria-hidden="true" style={{ color: "var(--msc-blue)" }} />
              <a
                href="https://www.bulsu.edu.ph/"
                target="_blank"
                rel="noreferrer"
                className="transition-colors duration-200 hover:text-white"
              >
                Bulacan State University
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="px-4 py-5 text-center text-xs"
        style={{
          borderTop: "1px solid var(--border-subtle)",
          color: "var(--fg-muted)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.1em",
        }}
      >
        &copy; 2026 BulSU MSC &mdash; Together, we go further.
      </div>
    </footer>
  );
}
