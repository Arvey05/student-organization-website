import { ClipboardCheck, MapPin } from "lucide-react";
import Link from "next/link";

import { MemberPageHeader } from "@/components/member/page-header";
import { getRegisteredActivities } from "@/lib/member/activity-data";
import { formatDateTime } from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";

export default async function MyActivitiesPage() {
  const { user } = await getCurrentMemberProfile();
  const registeredActivities = await getRegisteredActivities(user.id);

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MemberPageHeader
          eyebrow="Registered activities"
          title="My registered activities"
          description="Review activities you joined or pre-registered for."
        />

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {registeredActivities.length ? (
            registeredActivities.map(({ activity, registration }) => (
              <Link
                key={registration.id}
                href={`/member/activities/${activity.id}`}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <ClipboardCheck className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  {activity.name}
                </h2>
                <p className="mt-3 text-sm font-semibold capitalize text-blue-600">
                  {registration.status.replace("_", " ")}
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  {formatDateTime(activity.starts_at)}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="size-4" aria-hidden="true" />
                  {activity.location}
                </p>
              </Link>
            ))
          ) : (
            <article className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm md:col-span-3">
              You have not registered for any activities yet.
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
