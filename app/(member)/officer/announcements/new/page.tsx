import { redirect } from "next/navigation";

import { createOfficerAnnouncement } from "@/app/member/actions";
import { MemberPageHeader } from "@/components/member/page-header";
import { getCurrentMemberProfile } from "@/lib/member/profile";
import { canCreateEvents } from "@/lib/supabase/roles";

export default async function NewOfficerAnnouncementPage() {
  const { profile } = await getCurrentMemberProfile();

  if (!canCreateEvents(profile?.role)) {
    redirect("/dashboard?error=officer_required");
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <MemberPageHeader
          eyebrow="Officer tools"
          title="Add announcement"
          description="Publish booths, bazaars, reminders, and organization updates for members."
        />

        <form
          action={createOfficerAnnouncement}
          encType="multipart/form-data"
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input
              name="title"
              required
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
              JPG, PNG, WebP, or GIF. Maximum file size is 10 MB.
            </span>
          </label>

          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
            <input
              name="is_public"
              type="checkbox"
              className="size-4 rounded border-slate-300"
            />
            Public announcement
          </label>

          <button
            type="submit"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            Create Announcement
          </button>
        </form>
      </div>
    </main>
  );
}
