import { MapPin, Megaphone, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { archiveOfficerAnnouncement } from "@/app/member/actions";
import { MemberPageHeader } from "@/components/member/page-header";
import { getAnnouncements } from "@/lib/member/activity-data";
import { formatDateTime, formatDateTimeRange } from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";
import { canCreateEvents } from "@/lib/supabase/roles";

export default async function AnnouncementsPage() {
  const [announcements, { profile }] = await Promise.all([
    getAnnouncements(),
    getCurrentMemberProfile(),
  ]);
  const isOfficerEventCreator = canCreateEvents(profile?.role);

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <MemberPageHeader
          eyebrow="Announcements"
          title="Member announcements"
          description="View organization updates intended for authenticated members."
        />

        {isOfficerEventCreator ? (
          <div className="mt-6 flex justify-end">
            <Link
              href="/officer/announcements/new"
              className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              Add Announcement
            </Link>
          </div>
        ) : null}

        <section className="mt-8 space-y-4">
          {announcements.length ? (
            announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
              >
                {announcement.image_url ? (
                  <div className="relative mb-5 aspect-video overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src={announcement.image_url}
                      alt={`${announcement.title} cover`}
                      fill
                      sizes="(min-width: 1024px) 1024px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Megaphone className="size-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-600">
                      {announcement.starts_at
                        ? formatDateTimeRange(
                            announcement.starts_at,
                            announcement.ends_at,
                          )
                        : formatDateTime(
                            announcement.published_at ??
                              announcement.created_at,
                          )}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">
                      {announcement.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {announcement.content}
                    </p>
                    {announcement.location ? (
                      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <MapPin className="size-4" aria-hidden="true" />
                        {announcement.location}
                      </p>
                    ) : null}
                    {isOfficerEventCreator ? (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          href={`/officer/announcements/${announcement.id}/edit`}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm"
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                          Edit
                        </Link>
                        <form action={archiveOfficerAnnouncement}>
                          <input
                            type="hidden"
                            name="announcement_id"
                            value={announcement.id}
                          />
                          <button
                            type="submit"
                            className="inline-flex h-10 items-center justify-center rounded-full border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 shadow-sm"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    ) : null}
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
