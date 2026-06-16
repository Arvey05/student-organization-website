import Image from "next/image";
import { redirect } from "next/navigation";

import { archiveOfficerEvent, updateOfficerEvent } from "@/app/member/actions";
import { MemberPageHeader } from "@/components/member/page-header";
import { getActivityById } from "@/lib/member/activity-data";
import { formatDateTimeLocalInput } from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";
import { canCreateEvents } from "@/lib/supabase/roles";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditOfficerEventPage({ params }: PageProps) {
  const { id } = await params;
  const [{ profile }, activity] = await Promise.all([
    getCurrentMemberProfile(),
    getActivityById(id),
  ]);

  if (!canCreateEvents(profile?.role)) {
    redirect("/dashboard?error=officer_required");
  }

  if (!activity) {
    redirect("/member/activities");
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <MemberPageHeader
          eyebrow="Officer tools"
          title="Edit event or program"
          description="Update official organization activity details."
        />

        <form
          action={updateOfficerEvent}
          encType="multipart/form-data"
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <input type="hidden" name="activity_id" value={activity.id} />

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Event / Program Name
            </span>
            <input
              name="name"
              required
              defaultValue={activity.name}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Start Date and Time
              </span>
              <input
                name="starts_at"
                type="datetime-local"
                required
                defaultValue={formatDateTimeLocalInput(activity.starts_at)}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                End Date and Time
              </span>
              <input
                name="ends_at"
                type="datetime-local"
                defaultValue={
                  activity.ends_at
                    ? formatDateTimeLocalInput(activity.ends_at)
                    : undefined
                }
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              Short Description
            </span>
            <textarea
              name="short_description"
              required
              rows={4}
              defaultValue={activity.short_description}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              Location
            </span>
            <input
              name="location"
              required
              defaultValue={activity.location}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select
              name="status"
              required
              defaultValue={activity.status}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="past">Past</option>
            </select>
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              Cover Image
            </span>
            <input
              name="cover_image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            <span className="mt-2 block text-xs text-slate-500">
              JPG, PNG, WebP, or GIF. Maximum file size is 10 MB. Leave blank to
              keep the current cover.
            </span>
          </label>

          {activity.image_url ? (
            <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <Image
                src={activity.image_url}
                alt={`${activity.name} cover`}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <button
            type="submit"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            Save Event
          </button>
        </form>

        <form
          action={archiveOfficerEvent}
          className="mt-4 rounded-3xl border border-red-200 bg-red-50 p-6"
        >
          <input type="hidden" name="activity_id" value={activity.id} />
          <h2 className="text-lg font-bold text-red-950">Delete event</h2>
          <p className="mt-2 text-sm leading-6 text-red-800">
            This archives the event so it no longer appears in activity,
            calendar, or registration views. Existing registration records are
            kept for history.
          </p>
          <button
            type="submit"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-red-200 bg-white px-5 text-sm font-semibold text-red-700 shadow-sm"
          >
            Delete Event
          </button>
        </form>
      </div>
    </main>
  );
}
