import { ClipboardCheck, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getRegisteredActivities } from "@/lib/member/activity-data";
import { formatDateTimeRange } from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";

export default async function MyActivitiesPage() {
  const { user } = await getCurrentMemberProfile();
  const registeredActivities = await getRegisteredActivities(user.id);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/25 ring-1 ring-white/5 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
            My Activities
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            My Activities
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Review registered events, completed activities, and attended
            organization programs.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {registeredActivities.length ? (
            registeredActivities.map(({ activity, registration }) => (
              <Link
                key={registration.id}
                href={`/member/activities/${activity.id}`}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/20 ring-1 ring-white/5 transition hover:-translate-y-1 hover:border-blue-300/40"
              >
                {activity.image_url ? (
                  <div className="relative mb-5 aspect-video overflow-hidden rounded-2xl bg-slate-900">
                    <Image
                      src={activity.image_url}
                      alt={`${activity.name} cover`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                  </div>
                ) : null}
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-100 ring-1 ring-blue-300/20">
                  <ClipboardCheck className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-white">
                  {activity.name}
                </h2>
                <p className="mt-3 text-sm font-semibold capitalize text-blue-200">
                  {registration.status.replace("_", " ")}
                </p>
                <p className="mt-3 text-sm text-slate-300">
                  {formatDateTimeRange(activity.starts_at, activity.ends_at)}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="size-4" aria-hidden="true" />
                  {activity.location}
                </p>
              </Link>
            ))
          ) : (
            <article className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-sm text-slate-300 shadow-2xl shadow-black/20 md:col-span-3">
              You have not registered for any activities yet. Joined and
              completed activities will appear here.
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
