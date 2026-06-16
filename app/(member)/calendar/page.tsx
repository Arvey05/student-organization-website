import { CalendarDays } from "lucide-react";

import { MemberPageHeader } from "@/components/member/page-header";
import { calendarPreview } from "@/lib/member/mock-data";

export default function CalendarPage() {
  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MemberPageHeader
          eyebrow="Calendar"
          title="University and organization calendar"
          description="Track upcoming activities, deadlines, and organization events from your member account."
        />

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {calendarPreview.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                  <span className="text-xs font-bold uppercase">
                    {item.month}
                  </span>
                  <span className="text-2xl font-black">{item.day}</span>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    Member calendar
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-950">
                    {item.title}
                  </h2>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
