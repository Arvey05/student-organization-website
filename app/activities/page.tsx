import { CalendarCheck, Clock, MapPin } from "lucide-react";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { getPublicActivities } from "@/lib/member/activity-data";
import { formatDateTime } from "@/lib/member/display";

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
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {activityGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <CalendarCheck className="size-5" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-slate-950">
                  {group.title}
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {group.items.length ? (
                  group.items.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-blue-100/60"
                    >
                      <h3 className="font-bold text-slate-950">{item.name}</h3>
                      <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="size-4" aria-hidden="true" />
                        {formatDateTime(item.starts_at)}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="size-4" aria-hidden="true" />
                        {item.location}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
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
