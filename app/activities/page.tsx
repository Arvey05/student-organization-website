import { CalendarCheck, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { getPublicActivities } from "@/lib/member/activity-data";
import { formatDateTimeRange } from "@/lib/member/display";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  const activities = (await getPublicActivities()) ?? [];
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
      eyebrow="Activities"
      title="Programs and events for members and the campus community"
      description="Browse public upcoming, completed, and past activities from the organization."
    >
      <section className="bg-[#02001f] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {activityGroups.map((group) => (
            <section
              key={group.title}
              className="border-t border-white/10 pt-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center border border-msc-blue/30 bg-msc-blue/15 text-msc-blue transition-transform duration-300 group-hover:scale-110">
                  <CalendarCheck className="size-5" aria-hidden="true" />
                </div>
                <h2 className="font-display text-xl font-bold tracking-tight text-white">
                  {group.title}
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {group.items.length ? (
                  group.items.map((item) => (
                    <article
                      key={item.id}
                      className="msc-card-hover group overflow-hidden border border-white/10 bg-[#001431]/80 backdrop-blur-md transition-all duration-300 hover:border-msc-blue/50"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-900">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={`${item.name} cover`}
                            fill
                            sizes="(min-width: 1024px) 33vw, 100vw"
                            className="msc-img-zoom object-cover"
                          />
                        ) : (
<<<<<<< Updated upstream
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(0,108,249,0.5),transparent_40%),radial-gradient(circle_at_80%_8%,rgba(127,186,0,0.25),transparent_35%),linear-gradient(135deg,#001431,#002453_50%,#000918)]" />
=======
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(0,108,249,0.62),transparent_32%),radial-gradient(circle_at_80%_8%,rgba(127,186,0,0.3),transparent_28%),linear-gradient(135deg,#02001f,#07111f_48%,#0f2a5f)]" />
>>>>>>> Stashed changes
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#001431] via-[#001431]/40 to-transparent" />
                        <span className="msc-badge msc-badge-blue absolute left-4 top-4 transition-transform duration-300 group-hover:scale-105">
                          {item.status}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="line-clamp-2 font-display text-lg font-bold text-white transition-colors duration-300 group-hover:text-msc-amber">
                          {item.name}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">
                          {item.short_description}
                        </p>
                        <p className="mt-4 flex items-start gap-2 text-sm text-slate-300">
                          <Clock className="mt-0.5 size-4 shrink-0 text-msc-blue" aria-hidden="true" />
                          {formatDateTimeRange(item.starts_at, item.ends_at)}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                          <MapPin className="size-4 shrink-0 text-msc-lime" aria-hidden="true" />
                          <span className="truncate">{item.location}</span>
                        </p>
                        {item.status === "upcoming" ? (
                          <Link
                            href="/login"
                            className="msc-btn-primary mt-5 inline-flex h-10 w-full items-center justify-center text-xs tracking-wider"
                          >
                            Log in to Join
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="border border-dashed border-white/10 bg-[#001431]/40 p-5 text-sm text-slate-400">
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
