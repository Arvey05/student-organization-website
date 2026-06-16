import Link from "next/link";
import { Mail, MapPin, Share2 } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Activities", href: "/activities" },
  { label: "Partners", href: "/partners" },
  { label: "Announcements", href: "/announcements" },
  { label: "Calendar", href: "/calendar" },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

const logoItems = ["School Logo", "OSOA Logo", "Government Logo"];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
              MSC
            </div>
            <div>
              <p className="text-base font-bold text-slate-950">
                BulSU MSC Student Organization
              </p>
              <p className="text-sm text-slate-500">
                Leadership, service, and community for every member.
              </p>
            </div>
          </div>

          <div className="mt-6 grid max-w-md grid-cols-3 gap-3">
            {logoItems.map((item) => (
              <div
                key={item}
                className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 text-center text-xs font-semibold text-slate-500"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
            Explore
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
            Connect
          </h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <a
              href="https://www.facebook.com/bulsumsc"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 transition hover:text-blue-700"
            >
              <Share2 className="size-4" aria-hidden="true" />
              Facebook page
            </a>
            <a
              href="mailto:bulsu.officialmsc@gmail.com "
              className="flex items-center gap-3 transition hover:text-blue-700"
            >
              <Mail className="size-4" aria-hidden="true" />
              bulsu.officialmsc@gmail.com 
            </a>
            <p className="flex items-center gap-3">
              <MapPin className="size-4" aria-hidden="true" />
              <a href="https://www.bulsu.edu.ph/" 
                target="_blank" 
                rel="noreferrer" 
                className="transition hover:text-blue-700">
                Bulacan State University
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-5 text-center text-sm text-slate-500">
        (c) 2026 BulSU MSC. All rights reserved.
      </div>
    </footer>
  );
}
