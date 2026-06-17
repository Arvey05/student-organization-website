import { CalendarCheck, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { getPublicActivities } from "@/lib/member/activity-data";
import { formatDateTimeRange } from "@/lib/member/display";

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
      eyebrow="Activities"
      title="Programs and events for members and the campus community"
      description="Browse public upcoming, completed, and past activities from the organization."
    >
      <section className="bg-slate-950 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {activityGroups.map((group) => (
            <section
              key={group.title}
              className="border-t border-white/10 pt-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-md bg-blue-500/15 text-blue-100">
                  <CalendarCheck className="size-5" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {group.title}
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {group.items.length ? (
                  group.items.map((item) => (
                    <article
                      key={item.id}
                      className="group overflow-hidden border-t border-white/10 bg-slate-950 transition hover:border-blue-300/40"
                    >
                      <div className="relative mb-4 aspect-video overflow-hidden rounded-md bg-slate-900">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={`${item.name} cover`}
                            fill
                            sizes="(min-width: 1024px) 33vw, 100vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.6),transparent_30%),linear-gradient(135deg,#020617,#0f172a_50%,#1d4ed8)]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
                      </div>
                      <h3 className="font-bold text-white">{item.name}</h3>
                      <p className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                        <Clock className="size-4 text-blue-200" aria-hidden="true" />
                        {formatDateTimeRange(item.starts_at, item.ends_at)}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                        <MapPin className="size-4 text-blue-200" aria-hidden="true" />
                        {item.location}
                      </p>
                      {item.status === "upcoming" ? (
                        <Link
                          href="/login"
                          className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-blue-50"
                        >
                          Log in to Join
                        </Link>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <p className="border-y border-dashed border-white/15 bg-slate-950 p-4 text-sm text-slate-300">
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
