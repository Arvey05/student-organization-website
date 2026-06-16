import { Megaphone } from "lucide-react";

import { MemberPageHeader } from "@/components/member/page-header";
import { getAnnouncements } from "@/lib/member/activity-data";
import { formatDateTime } from "@/lib/member/display";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <MemberPageHeader
          eyebrow="Announcements"
          title="Member announcements"
          description="View organization updates intended for authenticated members."
        />

        <section className="mt-8 space-y-4">
          {announcements.length ? (
            announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Megaphone className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-600">
                      {formatDateTime(
                        announcement.published_at ?? announcement.created_at,
                      )}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">
                      {announcement.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {announcement.content}
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <article className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              No announcements yet.
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
