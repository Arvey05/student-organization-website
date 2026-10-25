"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SiteNavLinksProps = {
  items: {
    label: string;
    href: string;
  }[];
  mobile?: boolean;
};

export function SiteNavLinks({ items, mobile = false }: SiteNavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        if (mobile) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md px-3 py-2 text-xs font-semibold uppercase transition-all duration-200 active:scale-95"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.2em",
                color: isActive ? "var(--msc-amber)" : "var(--fg-muted)",
                background: isActive ? "rgba(255, 185, 0, 0.08)" : "transparent",
              }}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
<<<<<<< Updated upstream
            className="group relative px-2.5 py-2 text-xs font-semibold uppercase transition-all duration-200 hover:text-[var(--fg-primary)]"
            style={{
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.2em",
              color: isActive ? "var(--fg-primary)" : "var(--fg-muted)",
            }}
=======
            className={
              mobile
                ? `brand-interactive shrink-0 rounded-full px-3 py-2 text-sm font-semibold ${
                    isActive
                      ? "text-blue-100"
                      : "text-slate-400 hover:text-blue-200"
                  }`
                : `brand-interactive relative px-1 py-2 text-xs font-semibold tracking-[0.02em] after:absolute after:inset-x-1 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-blue-300 after:transition-transform after:duration-300 ${
                    isActive
                      ? "text-white after:scale-x-100"
                      : "text-slate-500 hover:text-blue-200 hover:after:scale-x-100"
                  }`
            }
>>>>>>> Stashed changes
          >
            {item.label}
            {/* Active persistent indicator */}
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute inset-x-2 bottom-0 h-0.5 rounded-full"
                style={{
                  background: "var(--msc-grad-sweep)",
                  boxShadow: "0 0 8px rgba(0, 108, 249, 0.5)",
                }}
              />
            )}
            {/* Hover sweep indicator when inactive */}
            {!isActive && (
              <span
                aria-hidden="true"
                className="absolute inset-x-2 bottom-0 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-x-100"
                style={{ background: "var(--msc-grad-sweep)" }}
              />
            )}
          </Link>
        );
      })}
    </>
  );
}
