import { redirect } from "next/navigation";

import {
  archiveOfficerAnnouncement,
  updateOfficerAnnouncement,
} from "@/app/member/actions";
import { OfficerForm } from "@/components/member/officer-form";
import { OfficerImageUpload } from "@/components/member/officer-image-upload";
import { MemberPageHeader } from "@/components/member/page-header";
import { getAnnouncementById } from "@/lib/member/activity-data";
import { formatDateTimeLocalInput } from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditOfficerAnnouncementPage({
  params,
}: PageProps) {
  const { id } = await params;
  const [{ isEventCreator }, announcement] = await Promise.all([
    getCurrentMemberProfile(),
    getAnnouncementById(id),
  ]);

  if (!isEventCreator) {
    redirect("/dashboard?error=officer_required");
  }

  if (!announcement) {
    redirect("/announcements");
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <MemberPageHeader
          eyebrow="Officer tools"
          title="Edit announcement"
          description="Update organization announcements shown to members."
        />

        <OfficerForm
          action={updateOfficerAnnouncement}
          className="mt-8 border-y border-white/10 bg-[#02001f] p-6"
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

          <OfficerImageUpload
            bucket="announcement-images"
            hiddenInputName="image_url"
            currentImageUrl={announcement.image_url}
          />

          <label className="mt-4 flex items-center gap-3 border border-white/10 bg-black p-4 text-sm font-semibold text-slate-200">
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
            className="mt-6 inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
          >
            Save Announcement
          </button>
        </OfficerForm>

        <form
          action={archiveOfficerAnnouncement}
          className="mt-4 border-y border-red-300/30 bg-red-500/10 p-6"
        >
          <input type="hidden" name="announcement_id" value={announcement.id} />
          <h2 className="text-lg font-bold text-red-100">
            Delete announcement
          </h2>
          <p className="mt-2 text-sm leading-6 text-red-200">
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
