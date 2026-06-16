import { redirect } from "next/navigation";

import { updateOfficerEvent } from "@/app/member/actions";
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

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              Date and Time
            </span>
            <input
              name="starts_at"
              type="datetime-local"
              required
              defaultValue={formatDateTimeLocalInput(activity.starts_at)}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

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

          <button
            type="submit"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            Save Event
          </button>
        </form>
      </div>
    </main>
  );
}
