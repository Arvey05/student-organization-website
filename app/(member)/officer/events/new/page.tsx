import { redirect } from "next/navigation";

import { createOfficerEvent } from "@/app/member/actions";
import { OfficerForm } from "@/components/member/officer-form";
import { OfficerImageUpload } from "@/components/member/officer-image-upload";
import { MemberPageHeader } from "@/components/member/page-header";
import { getCurrentMemberProfile } from "@/lib/member/profile";

export default async function NewOfficerEventPage() {
  const { isEventCreator } = await getCurrentMemberProfile();

  if (!isEventCreator) {
    redirect("/dashboard?error=officer_required");
  }

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <MemberPageHeader
          eyebrow="Officer tools"
          title="Add event or program"
          description="Approved core executive and executive members may create official organization events and programs."
        />

        <OfficerForm
          action={createOfficerEvent}
          className="mt-8 border-y border-white/10 bg-[#02001f] p-6"
        >
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">
              Event / Program Name
            </span>
            <input
              name="name"
              required
              className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60"
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
                required
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
                className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-200">
              Short Description
            </span>
            <textarea
              name="short_description"
              required
              rows={4}
              className="mt-2 w-full rounded-md border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-blue-300/60"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-200">
              Location
            </span>
            <input
              name="location"
              required
              className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60"
            />
          </label>

          <OfficerImageUpload
            bucket="activity-images"
            hiddenInputName="image_url"
          />

          <button
            type="submit"
            className="mt-6 inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
          >
            Create Event
          </button>
        </OfficerForm>
      </div>
    </main>
  );
}
