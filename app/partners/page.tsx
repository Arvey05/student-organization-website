import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Handshake } from "lucide-react";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type PartnerRow = Database["public"]["Tables"]["partners"]["Row"];

async function getPublicPartners(): Promise<PartnerRow[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.warn(`Unable to load public partners: ${error.message}`);
      return [];
    }

    return data ?? [];
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      (error as { digest: string }).digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
    console.warn("Unable to load public partners:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const partners = await getPublicPartners();

  return (
    <PublicPageShell
      eyebrow="Partners"
      title="Collaborators who help strengthen student programs"
      description="Official partners and collaborators will appear here when they are published by the organization."
    >
      <section className="bg-[#02040a] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                Our partners
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
                Organizations that support our work on campus.
              </h2>
            </div>
            <Handshake className="hidden size-10 text-blue-200 sm:block" />
          </div>

          {partners.length ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {partners.map((partner) => {
                const content = (
                  <article className="msc-card-hover group flex min-h-52 flex-col justify-between border border-white/10 bg-[#001431]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-msc-blue/50 hover:shadow-[0_12px_28px_rgba(0,108,249,0.15)]">
                    <div>
                      <div className="flex min-h-24 items-center justify-center border border-white/10 bg-[#000918]/60 p-4 transition-transform duration-300 group-hover:scale-[1.02]">
                        {partner.logo_url ? (
                          <Image
                            src={partner.logo_url}
                            alt={`${partner.name} logo`}
                            width={180}
                            height={90}
                            className="msc-img-zoom max-h-20 w-auto object-contain"
                          />
                        ) : (
                          <p className="font-display text-center text-lg font-bold text-white">
                            {partner.name}
                          </p>
                        )}
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold text-white transition-colors duration-300 group-hover:text-msc-amber">
                        {partner.name}
                      </h3>
                      {partner.description ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                          {partner.description}
                        </p>
                      ) : null}
                    </div>
                    {partner.website_url ? (
                      <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-msc-blue transition-colors duration-200 group-hover:text-msc-lime">
                        Visit partner
                        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                      </p>
                    ) : null}
                  </article>
                );

                return partner.website_url ? (
                  <Link
                    key={partner.id}
                    href={partner.website_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={partner.id}>{content}</div>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 border-y border-dashed border-white/15 bg-slate-950 p-6 text-sm text-slate-300">
              Partners will be displayed here soon.
            </div>
          )}
        </div>
      </section>
    </PublicPageShell>
  );
}
