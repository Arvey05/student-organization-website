import Link from "next/link";
import Image from "next/image";
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

const logoItems = [
  {
    label: "Bulacan State University seal",
    src: "/brand/bulsu-seal.webp",
    imageClassName: "",
  },
  {
    label: "OSOA seal",
    src: "/brand/osoa-seal.png",
    imageClassName: "brightness-0 invert",
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-[#02001f] text-white">
      <div className="brand-accent-line absolute inset-x-0 top-0 h-px opacity-65" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex flex-col items-start gap-3">
            <Image
              src="/brand/msc-horizontal-reversed.png"
              alt="BulSU Microsoft Student Community"
              width={1400}
              height={465}
              className="h-12 w-auto max-w-[166px] object-contain"
            />
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

          <div className="mt-6 grid max-w-xs grid-cols-2 gap-3">
            {logoItems.map((item) => (
              <div
                key={item.label}
                className="flex aspect-[4/3] items-center justify-center px-3"
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  width={120}
                  height={120}
                  className={`h-20 w-20 object-contain sm:h-24 sm:w-24 ${item.imageClassName}`}
                />
              </div>
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
              className="flex items-center gap-3 transition hover:text-blue-200"
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
