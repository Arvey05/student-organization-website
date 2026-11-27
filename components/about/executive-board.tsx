import Image from "next/image";

import {
  BOARD_TERM,
  committees,
  coreExecutives,
  guidance,
  type BoardMember,
} from "@/lib/organization/executive-board";

function getInitials(name: string): string {
  const words = name.replace(/\s+(Jr|Sr)\.?$/i, "").trim().split(/\s+/);
  return `${words[0]?.[0] ?? ""}${words.length > 1 ? (words.at(-1)?.[0] ?? "") : ""}`.toUpperCase();
}

function slugify(value: string): string {
  return value.replace(/\s+/g, "-").toLowerCase();
}

function Portrait({
  member,
  className,
  sizes,
}: {
  member: BoardMember;
  className: string;
  sizes: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#0b133c] ${className}`}>
      {member.photo ? (
        <Image
          src={`/team/${member.photo}.webp`}
          alt={`${member.name}, ${member.role}`}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-full items-center justify-center font-display text-lg font-bold text-blue-200"
        >
          {getInitials(member.name)}
        </span>
      )}
    </div>
  );
}

/** Advisers lead the page: portrait cards with the name set over the photo. */
function Guidance() {
  return (
    <div className="mt-14">
      <div aria-hidden="true" className="h-0.5 w-16 bg-msc-amber" />
      <h3 className="mt-5 text-sm font-semibold text-msc-amber">
        Guided by our faculty advisers
      </h3>
      <ul role="list" className="mt-6 grid gap-5 sm:grid-cols-3">
        {guidance.faculty.map((member) => (
          <li key={member.name} className="relative overflow-hidden ring-1 ring-white/10">
            <Portrait
              member={member}
              className="aspect-[4/5] w-full"
              sizes="(min-width: 640px) 30vw, 90vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#02001f] via-[#02001f]/85 to-transparent px-5 pb-5 pt-16">
              <p className="font-display text-xl font-bold leading-tight text-white">
                {member.name}
              </p>
              <p className="mt-1 text-sm text-blue-200">{member.role}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-12">
        <h4 className="text-sm font-semibold text-msc-amber">
          Lead peer mentors
        </h4>
        <ul role="list" className="mt-5 grid max-w-md grid-cols-2 gap-6">
          {guidance.mentors.map((member) => (
            <Figure key={member.name} member={member} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function Figure({
  member,
  size = "md",
}: {
  member: BoardMember;
  size?: "md" | "lg";
}) {
  return (
    <li>
      <Portrait
        member={member}
        className="aspect-square w-full ring-1 ring-white/10"
        sizes={
          size === "lg"
            ? "(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw"
            : "(min-width: 1024px) 14vw, (min-width: 640px) 30vw, 45vw"
        }
      />
      <p
        className={`mt-3 font-display font-bold leading-snug text-white ${size === "lg" ? "text-lg" : "text-sm"}`}
      >
        {member.name}
      </p>
      <p className={`mt-0.5 text-slate-400 ${size === "lg" ? "text-sm" : "text-xs"}`}>
        {member.role}
      </p>
    </li>
  );
}

export function ExecutiveBoard() {
  const [president, ...vice] = coreExecutives;

  return (
    <section
      aria-labelledby="board-heading"
      className="border-b border-white/10 bg-[#060b2b] py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-blue-200">{BOARD_TERM}</p>
        <h2
          id="board-heading"
          className="mt-3 max-w-3xl font-display text-4xl font-black tracking-tight text-white sm:text-5xl"
        >
          The people running BulSU MSC this year
        </h2>

        <Guidance />

        <div className="mt-20 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          <figure className="grid gap-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-end">
            <Portrait
              member={president}
              className="aspect-[4/5] w-full ring-1 ring-white/10"
              sizes="(min-width: 640px) 240px, 90vw"
            />
            <figcaption className="pb-1">
              <p className="text-sm font-semibold text-msc-amber">
                {president.role}
              </p>
              <p className="mt-2 font-display text-3xl font-black leading-tight text-white">
                {president.name}
              </p>
            </figcaption>
          </figure>
          <ul role="list" className="grid grid-cols-3 gap-4">
            {vice.map((member) => (
              <Figure key={member.role} member={member} />
            ))}
          </ul>
        </div>

        <div className="mt-24 grid gap-20">
          {committees.map((committee) => (
            <article
              key={committee.name}
              aria-labelledby={`committee-${slugify(committee.name)}`}
              className="border-t border-white/10 pt-10"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr] lg:items-end">
                <h3
                  id={`committee-${slugify(committee.name)}`}
                  className="font-display text-3xl font-bold text-white"
                >
                  {committee.name}
                </h3>
                <p className="max-w-xl text-sm leading-7 text-slate-300">
                  {committee.description}
                </p>
              </div>

              {committee.directors.length ? (
                <ul
                  role="list"
                  className="mt-8 grid max-w-2xl grid-cols-2 gap-6"
                >
                  {committee.directors.map((member) => (
                    <Figure key={member.name} member={member} size="lg" />
                  ))}
                </ul>
              ) : null}

              <ul
                role="list"
                className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5"
              >
                {committee.members.map((member) => (
                  <Figure key={member.name} member={member} />
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
