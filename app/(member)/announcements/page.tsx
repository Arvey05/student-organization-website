import { Eye, Lock, MapPin, Megaphone, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { archiveOfficerAnnouncement } from "@/app/member/actions";
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
    <main className="min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/30 ring-1 ring-white/5 backdrop-blur sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(37,99,235,0.35),transparent_28%),radial-gradient(circle_at_85%_0%,rgba(124,58,237,0.18),transparent_24%)]" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
                <Megaphone className="size-4" aria-hidden="true" />
                Announcements
              </p>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                Member announcements
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Official organization updates, reminders, and event notices in
                a focused member feed.
              </p>
            </div>

            {isOfficerEventCreator ? (
              <Link
                href="/officer/announcements/new"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-blue-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-400"
              >
                <PlusCircle className="size-4" aria-hidden="true" />
                Add Announcement
              </Link>
            ) : null}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/25 ring-1 ring-white/5 backdrop-blur">
          {announcements.length ? (
            announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="border-b border-white/10 p-5 transition hover:bg-white/[0.04] last:border-b-0 sm:p-6"
              >
                <div className="flex gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-blue-300/20 bg-blue-500/15 text-blue-100">
                    <Megaphone className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-blue-200">
                        Official update
                      </p>
                      <span className="text-sm text-slate-500">&middot;</span>
                      <p className="text-sm text-slate-400">
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
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          announcement.is_public
                            ? "border-teal-300/30 bg-teal-400/10 text-teal-100"
                            : "border-slate-300/20 bg-white/5 text-slate-300"
                        }`}
                      >
                        {announcement.is_public ? (
                          <Eye className="size-3" aria-hidden="true" />
                        ) : (
                          <Lock className="size-3" aria-hidden="true" />
                        )}
                        {announcement.is_public ? "Public" : "Members only"}
                      </span>
                    </div>

                    <h2 className="mt-2 text-xl font-black tracking-tight text-white">
                      {announcement.title}
                    </h2>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
                      {announcement.content}
                    </p>

                    {announcement.location ? (
                      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
                        <MapPin className="size-4 text-blue-200" aria-hidden="true" />
                        {announcement.location}
                      </p>
                    ) : null}

                    {announcement.image_url ? (
                      <div className="relative mt-5 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                        <Image
                          src={announcement.image_url}
                          alt={`${announcement.title} cover`}
                          fill
                          sizes="(min-width: 1024px) 1024px, 100vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
                      </div>
                    ) : null}

                    {isOfficerEventCreator ? (
                      <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-4">
                        <Link
                          href={`/officer/announcements/${announcement.id}/edit`}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                          Edit Announcement
                        </Link>
                        <form action={archiveOfficerAnnouncement}>
                          <input
                            type="hidden"
                            name="announcement_id"
                            value={announcement.id}
                          />
                          <button
                            type="submit"
                            className="inline-flex h-10 items-center justify-center rounded-full border border-red-300/40 bg-red-500/10 px-4 text-sm font-semibold text-red-100 transition hover:-translate-y-0.5 hover:bg-red-500/15"
                          >
                            Delete Announcement
                          </button>
                        </form>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <article className="p-6">
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-sm text-slate-300">
                No announcements yet.
              </div>
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
