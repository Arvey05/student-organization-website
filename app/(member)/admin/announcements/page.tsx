import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

import { archiveOfficerAnnouncement } from "@/app/member/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { MemberPageHeader } from "@/components/member/page-header";
import { requireEventCreator } from "@/lib/admin/access";
import { getAnnouncements } from "@/lib/member/activity-data";
import { formatDateTime } from "@/lib/member/display";

export const metadata: Metadata = { title: "Manage announcements – BulSU MSC" };

export default async function ManageAnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; error?: string }>;
}) {
  await requireEventCreator();
  const [announcements, params] = await Promise.all([
    getAnnouncements(),
    searchParams,
  ]);

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Admin dashboard
        </Link>
        <div className="mt-4">
          <MemberPageHeader
            eyebrow="Administration"
            title="Announcements"
            description="Post, edit, and delete announcements. Public ones also appear to visitors who are not signed in."
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-400" aria-live="polite">
            {announcements.length}{" "}
            {announcements.length === 1 ? "announcement" : "announcements"}
          </p>
          <Link
            href="/officer/announcements/new"
            className="inline-flex h-11 items-center gap-2 bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
          >
            <Plus className="size-4" aria-hidden="true" />
            New announcement
          </Link>
        </div>

        {params.deleted ? (
          <p role="status" className="mt-4 border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-100">
            Announcement deleted.
          </p>
        ) : null}
        {params.error ? (
          <p role="alert" className="mt-4 border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100">
            That could not be completed. Please try again.
          </p>
        ) : null}

        {announcements.length ? (
          <ul role="list" className="mt-4">
            {announcements.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-4 border-t border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-white">{item.title}</h2>
                    <span
                      className={`border px-2.5 py-1 text-[0.7rem] font-semibold ${item.is_public ? "border-blue-300/35 text-blue-100" : "border-white/15 text-slate-300"}`}
                    >
                      {item.is_public ? "Public" : "Members only"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {formatDateTime(
                      item.starts_at ?? item.published_at ?? item.created_at,
                    )}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-300">
                    {item.content}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
                    href={`/officer/announcements/${item.id}/edit`}
                    aria-label={`Edit ${item.title}`}
                    className="inline-flex h-9 items-center gap-2 border border-white/15 px-3 text-xs font-semibold text-slate-200 transition hover:border-blue-300/50 hover:text-white"
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                    Edit
                  </Link>
                  <ConfirmDelete
                    action={archiveOfficerAnnouncement}
                    fields={{ announcement_id: item.id }}
                    returnTo="/admin/announcements"
                    name={item.title}
                    noun="announcement"
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 border border-dashed border-white/15 bg-[#02001f]/60 p-6 text-sm text-slate-300">
            No announcements yet.{" "}
            <Link href="/officer/announcements/new" className="font-semibold text-blue-200 underline underline-offset-4 hover:text-white">
              Post the first one
            </Link>
            .
          </p>
        )}
      </div>
    </main>
  );
}
