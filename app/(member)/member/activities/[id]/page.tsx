import { CalendarDays, CheckCircle2, Clock, MapPin, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  archiveOfficerEvent,
  cancelActivityRegistration,
  registerForActivity,
} from "@/app/member/actions";
import { MemberPageHeader } from "@/components/member/page-header";
import {
  getActivityById,
  getCurrentUserRegistration,
} from "@/lib/member/activity-data";
import { formatDateTimeRange } from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";
import { canCreateEvents } from "@/lib/supabase/roles";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MemberActivityDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [activity, registration, { profile }] = await Promise.all([
    getActivityById(id),
    getCurrentUserRegistration(id),
    getCurrentMemberProfile(),
  ]);

  if (!activity) {
    notFound();
  }

  const isOfficerEventCreator = canCreateEvents(profile?.role);
  const activeRegistration =
    registration && registration.status !== "cancelled" ? registration : null;

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <MemberPageHeader
          eyebrow="Activity details"
          title={activity.name}
          description={activity.short_description}
        />

        {activity.image_url ? (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
            <Image
              src={activity.image_url}
              alt={`${activity.name} cover`}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <Clock className="size-4" aria-hidden="true" />
                  Time Frame
                </p>
                <p className="mt-2 font-bold text-slate-950">
                  {formatDateTimeRange(activity.starts_at, activity.ends_at)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <MapPin className="size-4" aria-hidden="true" />
                  Location
                </p>
                <p className="mt-2 font-bold text-slate-950">
                  {activity.location}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Status
                </p>
                <p className="mt-2 font-bold capitalize text-slate-950">
                  {activity.status}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Registration
                </p>
                <p className="mt-2 font-bold capitalize text-slate-950">
                  {activeRegistration
                    ? activeRegistration.status.replace("_", " ")
                    : "Not registered"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-950">
                Short Description
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {activity.short_description}
              </p>
            </div>
          </article>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Actions</h2>
            <div className="mt-5 space-y-3">
              {activeRegistration ? (
                <form action={cancelActivityRegistration}>
                  <input type="hidden" name="activity_id" value={activity.id} />
                  <button
                    type="submit"
                    className="inline-flex h-11 w-full items-center justify-center rounded-full border border-red-200 bg-white px-5 text-sm font-semibold text-red-700 shadow-sm"
                  >
                    Cancel Registration
                  </button>
                </form>
              ) : (
                <form action={registerForActivity}>
                  <input type="hidden" name="activity_id" value={activity.id} />
                  <button
                    type="submit"
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
                  >
                    Register for Event
                  </button>
                </form>
              )}

              {isOfficerEventCreator ? (
                <>
                  <Link
                    href={`/officer/events/${activity.id}/edit`}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    Edit Event
                  </Link>
                  <form action={archiveOfficerEvent}>
                    <input
                      type="hidden"
                      name="activity_id"
                      value={activity.id}
                    />
                    <button
                      type="submit"
                      className="inline-flex h-11 w-full items-center justify-center rounded-full border border-red-200 bg-white px-5 text-sm font-semibold text-red-700 shadow-sm"
                    >
                      Delete Event
                    </button>
                  </form>
                </>
              ) : null}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
