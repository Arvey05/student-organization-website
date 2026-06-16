import Image from "next/image";
import { redirect } from "next/navigation";

import {
  archiveOfficerAnnouncement,
  updateOfficerAnnouncement,
} from "@/app/member/actions";
import { MemberPageHeader } from "@/components/member/page-header";
import { getAnnouncementById } from "@/lib/member/activity-data";
import { formatDateTimeLocalInput } from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";
import { canCreateEvents } from "@/lib/supabase/roles";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditOfficerAnnouncementPage({
  params,
}: PageProps) {
  const { id } = await params;
  const [{ profile }, announcement] = await Promise.all([
    getCurrentMemberProfile(),
    getAnnouncementById(id),
  ]);

  if (!canCreateEvents(profile?.role)) {
    redirect("/dashboard?error=officer_required");
  }

  if (!announcement) {
    redirect("/announcements");
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <MemberPageHeader
          eyebrow="Officer tools"
          title="Edit announcement"
          description="Update organization announcements shown to members."
        />

        <form
          action={updateOfficerAnnouncement}
          encType="multipart/form-data"
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <input type="hidden" name="announcement_id" value={announcement.id} />

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input
              name="title"
              required
              defaultValue={announcement.title}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              Description / Body
            </span>
            <textarea
              name="content"
              required
              rows={5}
              defaultValue={announcement.content}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                defaultValue={
                  announcement.starts_at
                    ? formatDateTimeLocalInput(announcement.starts_at)
                    : undefined
                }
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
                  announcement.ends_at
                    ? formatDateTimeLocalInput(announcement.ends_at)
                    : undefined
                }
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              Location
            </span>
            <input
              name="location"
              defaultValue={announcement.location ?? ""}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              Cover Image
            </span>
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            <span className="mt-2 block text-xs text-slate-500">
              Leave blank to keep the current cover. Maximum file size is 10 MB.
            </span>
          </label>

          {announcement.image_url ? (
            <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <Image
                src={announcement.image_url}
                alt={`${announcement.title} cover`}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
            <input
              name="is_public"
              type="checkbox"
              defaultChecked={announcement.is_public}
              className="size-4 rounded border-slate-300"
            />
            Public announcement
          </label>

          <button
            type="submit"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            Save Announcement
          </button>
        </form>

        <form
          action={archiveOfficerAnnouncement}
          className="mt-4 rounded-3xl border border-red-200 bg-red-50 p-6"
        >
          <input type="hidden" name="announcement_id" value={announcement.id} />
          <h2 className="text-lg font-bold text-red-950">
            Delete announcement
          </h2>
          <p className="mt-2 text-sm leading-6 text-red-800">
            This archives the announcement so it no longer appears in member
            announcement, dashboard, or calendar views.
          </p>
          <button
            type="submit"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-red-200 bg-white px-5 text-sm font-semibold text-red-700 shadow-sm"
          >
            Delete Announcement
          </button>
        </form>
      </div>
    </main>
  );
}
