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

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              mobile
                ? `shrink-0 px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "text-blue-100"
                      : "text-slate-400 hover:text-blue-200"
                  }`
                : `relative px-1 py-2 font-mono text-xs uppercase tracking-[0.12em] transition after:absolute after:inset-x-1 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-blue-300 after:transition ${
                    isActive
                      ? "text-white after:scale-x-100"
                      : "text-slate-500 hover:text-blue-200 hover:after:scale-x-100"
                  }`
            }
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
