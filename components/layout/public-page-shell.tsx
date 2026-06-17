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
    <div className="min-h-screen bg-[#02040a] text-white">
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#02040a]">
          <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#02040a_0%,#061121_58%,#02040a_100%)]" />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_62%,rgba(37,99,235,0.24),transparent_28%),radial-gradient(circle_at_78%_16%,rgba(124,58,237,0.18),transparent_26%)]" />
          <div className="absolute inset-x-[-18%] bottom-0 -z-10 h-2/3 origin-bottom bg-[linear-gradient(rgba(96,165,250,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.11)_1px,transparent_1px)] bg-[size:52px_52px] opacity-80 [transform:perspective(580px)_rotateX(65deg)]" />
          <div className="absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.38)_0.7px,transparent_0.7px)] [background-size:24px_24px]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-4xl">
              <p className="inline-flex border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                {eyebrow}
              </p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
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
