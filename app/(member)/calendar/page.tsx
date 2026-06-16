import { CalendarDays } from "lucide-react";

import { MemberPageHeader } from "@/components/member/page-header";
import { getActivities } from "@/lib/member/activity-data";
import { formatDateTime, getCalendarDateParts } from "@/lib/member/display";

export default async function CalendarPage() {
  const activities = await getActivities();

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MemberPageHeader
          eyebrow="Calendar"
          title="University and organization calendar"
          description="Track upcoming activities, deadlines, and organization events from your member account."
        />

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {activities.length ? (
            activities.map((activity) => {
              const date = getCalendarDateParts(activity.starts_at);

              return (
                <article
                  key={activity.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                      <span className="text-xs font-bold uppercase">
                        {date.month}
                      </span>
                      <span className="text-2xl font-black">{date.day}</span>
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                        <CalendarDays className="size-4" aria-hidden="true" />
                        {formatDateTime(activity.starts_at)}
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-slate-950">
                        {activity.name}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        {activity.location}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <article className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm sm:col-span-2">
              No calendar events available yet.
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
