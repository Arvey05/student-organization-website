import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type PublicPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PublicPageShell({
  eyebrow,
  title,
  description,
  children,
}: PublicPageShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(37,99,235,0.14),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(124,58,237,0.12),transparent_26%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                {eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                {description}
              </p>
            </div>
          </div>
        </section>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
