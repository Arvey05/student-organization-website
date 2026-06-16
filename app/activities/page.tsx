import { CalendarCheck, Clock, MapPin } from "lucide-react";

import { PublicPageShell } from "@/components/layout/public-page-shell";

const activityGroups = [
  {
    title: "Upcoming",
    items: [
      {
        name: "Leadership Forum",
        date: "June 28, 2026",
        location: "University Function Hall",
      },
      {
        name: "Membership Orientation",
        date: "July 5, 2026",
        location: "Student Center",
      },
    ],
  },
  {
    title: "Completed",
    items: [
      {
        name: "Community Service Drive",
        date: "May 18, 2026",
        location: "Partner community",
      },
      {
        name: "Academic Support Session",
        date: "April 22, 2026",
        location: "Learning Hub",
      },
    ],
  },
  {
    title: "Past Activities",
    items: [
      {
        name: "Year-End Recognition",
        date: "March 15, 2026",
        location: "Main Auditorium",
      },
      {
        name: "Partner Appreciation Day",
        date: "February 20, 2026",
        location: "Campus Grounds",
      },
    ],
  },
];

export default function ActivitiesPage() {
  return (
    <PublicPageShell
      eyebrow="Activities"
      title="Programs and events for members and the campus community"
      description="Browse upcoming, completed, and past activities. Registration and personalized activity tracking will be added after authentication is implemented."
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
                {group.items.map((item) => (
                  <article
                    key={item.name}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-blue-100/60"
                  >
                    <h3 className="font-bold text-slate-950">{item.name}</h3>
                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="size-4" aria-hidden="true" />
                      {item.date}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="size-4" aria-hidden="true" />
                      {item.location}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </PublicPageShell>
  );
}
