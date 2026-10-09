import type { Metadata } from "next";
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { getPublicActivities } from "@/lib/member/activity-data";
import { formatDateTimeRange } from "@/lib/member/display";

export const metadata: Metadata = {
  title: "Activities & Programs – BulSU MSC",
  description:
    "Explore upcoming, completed, and past activities, workshops, and tech seminars hosted by BulSU MSC.",
  openGraph: {
    title: "Activities & Programs – BulSU MSC",
    description:
      "Explore upcoming, completed, and past activities, workshops, and tech seminars hosted by BulSU MSC.",
  },
};

export default async function ActivitiesPage() {
  const activities = await getPublicActivities();
  const activityGroups = [
    {
      title: "Upcoming",
      items: activities.filter((activity) => activity.status === "upcoming"),
    },
    {
      title: "Completed",
      items: activities.filter((activity) => activity.status === "completed"),
    },
    {
      title: "Past Activities",
      items: activities.filter((activity) => activity.status === "past"),
    },
  ];

  return (
    <PublicPageShell
      eyebrow="BulSU MSC Activities"
      title="Programs, workshops, and events for BulSU members"
      description="Browse upcoming, completed, and past events hosted by BulSU MSC for the university community."
    >
      <section className="bg-[#02040a] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {activityGroups.map((group) => (
            <section
              key={group.title}
              className="border-t border-white/10 pt-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center bg-blue-500/15 text-blue-100">
                  <CalendarCheck className="size-5" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-black text-white">
                  {group.title}
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {group.items.length ? (
                  group.items.map((item) => (
                    <article
                      key={item.id}
                      className="group overflow-hidden border border-white/10 bg-slate-950 transition hover:border-blue-300/40"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-900">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={`${item.name} cover`}
                            fill
                            sizes="(min-width: 1024px) 33vw, 100vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(37,99,235,0.62),transparent_32%),radial-gradient(circle_at_80%_8%,rgba(124,58,237,0.3),transparent_28%),linear-gradient(135deg,#020617,#07111f_48%,#0f2a5f)]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                        <span className="absolute left-4 top-4 border border-blue-300/25 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-100">
                          {item.status}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="line-clamp-2 text-lg font-black text-white">
                          {item.name}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">
                          {item.short_description}
                        </p>
                        <p className="mt-4 flex items-start gap-2 text-sm text-slate-300">
                          <Clock className="mt-0.5 size-4 shrink-0 text-blue-200" aria-hidden="true" />
                          {formatDateTimeRange(item.starts_at, item.ends_at)}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                          <MapPin className="size-4 shrink-0 text-blue-200" aria-hidden="true" />
                          <span className="truncate">{item.location}</span>
                        </p>
                        {item.status === "upcoming" ? (
                          <Link
                            href="/login"
                            className="mt-5 inline-flex h-10 items-center justify-center bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400"
                          >
                            Log in to Join
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="border-y border-dashed border-white/15 bg-slate-950 p-5 text-sm text-slate-300">
                    No activities available yet.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
