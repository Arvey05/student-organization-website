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
          className="mt-8 border-y border-white/10 bg-slate-950 p-6"
        >
          <input type="hidden" name="announcement_id" value={announcement.id} />

          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Title</span>
            <input
              name="title"
              required
              defaultValue={announcement.title}
              className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-200">
              Description / Body
            </span>
            <textarea
              name="content"
              required
              rows={5}
              defaultValue={announcement.content}
              className="mt-2 w-full rounded-md border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300/60"
            />
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">
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
                className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-200">
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
                className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-200">
              Location
            </span>
            <input
              name="location"
              defaultValue={announcement.location ?? ""}
              className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-200">
              Cover Image
            </span>
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-2 w-full rounded-md border border-white/10 bg-black px-4 py-3 text-sm text-slate-200 outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:border-blue-300/60"
            />
            <span className="mt-2 block text-xs text-slate-500">
              Leave blank to keep the current cover. Maximum file size is 10 MB.
            </span>
          </label>

          {announcement.image_url ? (
            <div className="relative mt-4 aspect-video overflow-hidden rounded-md border border-white/10 bg-black">
              <Image
                src={announcement.image_url}
                alt={`${announcement.title} cover`}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <label className="mt-4 flex items-center gap-3 rounded-md border border-white/10 bg-black p-4 text-sm font-semibold text-slate-200">
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
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Save Announcement
          </button>
        </form>

        <form
          action={archiveOfficerAnnouncement}
          className="mt-4 border-y border-red-300/30 bg-red-500/10 p-6"
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
            className="mt-4 inline-flex h-11 items-center justify-center rounded-md border border-red-300/40 bg-red-500/10 px-5 text-sm font-semibold text-red-100 transition hover:bg-red-500/15"
          >
            Delete Announcement
          </button>
        </form>
      </div>
    </main>
  );
}
