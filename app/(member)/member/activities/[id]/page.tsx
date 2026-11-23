import { CalendarDays, CheckCircle2, Clock, MapPin, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  archiveOfficerEvent,
  cancelActivityRegistration,
  registerForActivity,
} from "@/app/member/actions";
import {
  getActivityById,
  getCurrentUserRegistration,
  type ActivityRow,
} from "@/lib/member/activity-data";
import { formatDateTimeRange } from "@/lib/member/display";
import { getCurrentMemberProfile } from "@/lib/member/profile";

type PageProps = {
  params: Promise<{ id: string }>;
};

function ActivityBackdrop({ activity }: { activity: ActivityRow }) {
  if (activity.image_url) {
    return (
      <Image
        src={activity.image_url}
        alt={`${activity.name} cover`}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#02001f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,108,249,0.72),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(14,165,233,0.32),transparent_24%),linear-gradient(135deg,#02001f,#0b133c_46%,#006cf9)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_18px)] opacity-30" />
      <div className="absolute bottom-8 left-8 right-8 h-24  bg-blue-500/20 blur-3xl" />
    </div>
  );
}

export default async function MemberActivityDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [activity, registration, { isEventCreator }] = await Promise.all([
    getActivityById(id),
    getCurrentUserRegistration(id),
    getCurrentMemberProfile(),
  ]);

  if (!activity) {
    notFound();
  }

  const isOfficerEventCreator = isEventCreator;
  const activeRegistration =
    registration && registration.status !== "cancelled" ? registration : null;
  const detailItems = [
    {
      label: "Time Frame",
      value: formatDateTimeRange(activity.starts_at, activity.ends_at),
      icon: Clock,
    },
    {
      label: "Location",
      value: activity.location,
      icon: MapPin,
    },
    {
      label: "Status",
      value: activity.status,
      icon: CalendarDays,
    },
    {
      label: "Registration",
      value: activeRegistration
        ? activeRegistration.status.replace("_", " ")
        : "Not registered",
      icon: CheckCircle2,
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#02001f] pb-12 text-white">
      <section className="relative min-h-[38rem] overflow-hidden">
        <ActivityBackdrop activity={activity} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/78 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[38rem] max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-blue-100">
              <CalendarDays className="size-4" aria-hidden="true" />
              Activity Details
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              {activity.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
              {activity.short_description}
            </p>
            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-200 sm:grid-cols-2">
              <p className="flex items-start gap-2 rounded-md border border-white/10 bg-white/[0.06] p-3">
                <Clock
                  className="mt-0.5 size-4 shrink-0 text-blue-200"
                  aria-hidden="true"
                />
                {formatDateTimeRange(activity.starts_at, activity.ends_at)}
              </p>
              <p className="flex items-start gap-2 rounded-md border border-white/10 bg-white/[0.06] p-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-blue-200"
                  aria-hidden="true"
                />
                {activity.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto -mt-8 grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
        <div className="absolute left-1/2 top-0 h-56 w-[42rem] -translate-x-1/2  bg-blue-500/15 blur-3xl" />

        <article className="relative border-y border-white/10 bg-[#02001f] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {detailItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="border-t border-white/10 bg-[#02001f] p-4"
                >
                  <p className="flex items-center gap-2 text-sm font-semibold text-blue-200">
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </p>
                  <p className="mt-2 font-bold capitalize text-white">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-white/10 bg-[#02001f] p-5">
            <h2 className="text-lg font-bold text-white">Short Description</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {activity.short_description || "No description available."}
            </p>
          </div>
        </article>

        <aside className="relative border-y border-white/10 bg-black p-6">
          <h2 className="text-xl font-bold text-white">Actions</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Manage your registration or open officer tools if your role allows
            it.
          </p>
          <div className="mt-5 space-y-3">
              {activeRegistration ? (
                <form action={cancelActivityRegistration}>
                  <input type="hidden" name="activity_id" value={activity.id} />
                  <button
                    type="submit"
                    className="inline-flex h-11 w-full items-center justify-center rounded-md border border-red-300/40 bg-red-500/10 px-5 text-sm font-semibold text-red-100 transition hover:bg-red-500/15"
                  >
                    Cancel Registration
                  </button>
                </form>
              ) : (
                <form action={registerForActivity}>
                  <input type="hidden" name="activity_id" value={activity.id} />
                  <button
                    type="submit"
                    className="inline-flex h-11 w-full items-center justify-center rounded-md bg-blue-500 px-5 text-sm font-semibold text-white transition hover:bg-blue-400"
                  >
                    Register for Event
                  </button>
                </form>
              )}

              {isOfficerEventCreator ? (
                <>
                  <Link
                    href={`/officer/events/${activity.id}/edit`}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.06] px-5 text-sm font-semibold text-white transition hover:border-blue-300/40"
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
                      className="inline-flex h-11 w-full items-center justify-center rounded-md border border-red-300/40 bg-red-500/10 px-5 text-sm font-semibold text-red-100 transition hover:bg-red-500/15"
                    >
                      Delete Event
                    </button>
                  </form>
                </>
              ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
