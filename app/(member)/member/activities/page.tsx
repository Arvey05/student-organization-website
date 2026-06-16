import { CalendarCheck, CheckCircle2, Clock, MapPin } from "lucide-react";
import Link from "next/link";

import { MemberPageHeader } from "@/components/member/page-header";
import { getActivities } from "@/lib/member/activity-data";
import { formatDateTime } from "@/lib/member/display";

export default async function MemberActivitiesPage() {
  const activities = await getActivities();
  const activitySections = [
    {
      title: "Upcoming activities",
      description: "Activities open for registration or pre-registration.",
      items: activities.filter((activity) => activity.status === "upcoming"),
    },
    {
      title: "Completed activities",
      description: "Activities you have already joined or completed.",
      items: activities.filter((activity) => activity.status === "completed"),
    },
    {
      title: "Past activities",
      description: "Previous organization activities kept for member reference.",
      items: activities.filter((activity) => activity.status === "past"),
    },
  ];

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <MemberPageHeader
          eyebrow="Member activities"
          title="Activities workspace"
          description="Track upcoming, completed, and past activities from inside your authenticated member portal."
        />

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {activitySections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {section.description}
                  </p>
                </div>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <CalendarCheck className="size-5" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {section.items.length ? (
                  section.items.map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-slate-950">
                          {activity.name}
                        </h3>
                        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                          {activity.status}
                        </span>
                      </div>
                      <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="size-4" aria-hidden="true" />
                        {formatDateTime(activity.starts_at)}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="size-4" aria-hidden="true" />
                        {activity.location}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    No activities available yet.
                  </p>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Registration status
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                My registered activities are tracked separately
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Use the Registered page for a focused list of activities you
                joined or pre-registered for.
              </p>
            </div>
            <Link
              href="/my-activities"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-blue-700 shadow-sm"
            >
              View Registered
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
