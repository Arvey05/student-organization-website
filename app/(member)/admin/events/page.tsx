import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus } from "lucide-react";

import { archiveOfficerEvent } from "@/app/member/actions";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { MemberPageHeader } from "@/components/member/page-header";
import { requireEventCreator } from "@/lib/admin/access";
import { getActivities } from "@/lib/member/activity-data";
import { formatDateTimeRange } from "@/lib/member/display";

export const metadata: Metadata = { title: "Manage events – BulSU MSC" };

const STATUS_TONES = {
  upcoming: "border-emerald-300/35 text-emerald-100",
  completed: "border-blue-300/35 text-blue-100",
  past: "border-white/15 text-slate-300",
} as const;

export default async function ManageEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; error?: string }>;
}) {
  await requireEventCreator();
  const [events, params] = await Promise.all([getActivities(), searchParams]);

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
            title="Events and activities"
            description="Create, edit, and delete the events members see on the Activities and Calendar pages."
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-400" aria-live="polite">
            {events.length} {events.length === 1 ? "event" : "events"}
          </p>
          <Link
            href="/officer/events/new"
            className="inline-flex h-11 items-center gap-2 bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
          >
            <Plus className="size-4" aria-hidden="true" />
            New event
          </Link>
        </div>

        {params.deleted ? (
          <p role="status" className="mt-4 border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-100">
            Event deleted.
          </p>
        ) : null}
        {params.error ? (
          <p role="alert" className="mt-4 border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100">
            That could not be completed. Please try again.
          </p>
        ) : null}

        {events.length ? (
          <ul role="list" className="mt-4">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-4 border-t border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-white">{event.name}</h2>
                    <span
                      className={`border px-2.5 py-1 text-[0.7rem] font-semibold capitalize ${STATUS_TONES[event.status]}`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    {formatDateTimeRange(event.starts_at, event.ends_at)}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {event.location}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
                    href={`/officer/events/${event.id}/edit`}
                    aria-label={`Edit ${event.name}`}
                    className="inline-flex h-9 items-center gap-2 border border-white/15 px-3 text-xs font-semibold text-slate-200 transition hover:border-blue-300/50 hover:text-white"
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                    Edit
                  </Link>
                  <ConfirmDelete
                    action={archiveOfficerEvent}
                    fields={{ activity_id: event.id }}
                    returnTo="/admin/events"
                    name={event.name}
                    noun="event"
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 border border-dashed border-white/15 bg-[#02001f]/60 p-6 text-sm text-slate-300">
            No events yet.{" "}
            <Link href="/officer/events/new" className="font-semibold text-blue-200 underline underline-offset-4 hover:text-white">
              Create the first one
            </Link>
            .
          </p>
        )}
      </div>
    </main>
  );
}
