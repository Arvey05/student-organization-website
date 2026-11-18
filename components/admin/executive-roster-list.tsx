"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { ExecutiveRosterEntry } from "@/components/admin/executive-roster-entry";
import {
  EXECUTIVE_TIER_DETAILS,
  ROSTER_ACCESS_STATE_LABELS,
  filterRoster,
  type ExecutiveRosterRow,
  type RosterFilter,
} from "@/lib/admin/executive-roster";

const FILTER_OPTIONS: { value: RosterFilter; label: string }[] = [
  { value: "all", label: "Everyone" },
  { value: "core_executive", label: EXECUTIVE_TIER_DETAILS.core_executive.label },
  { value: "executive", label: EXECUTIVE_TIER_DETAILS.executive.label },
  { value: "active", label: ROSTER_ACCESS_STATE_LABELS.active },
  { value: "not_signed_up", label: ROSTER_ACCESS_STATE_LABELS.not_signed_up },
  {
    value: "awaiting_verification",
    label: ROSTER_ACCESS_STATE_LABELS.awaiting_verification,
  },
  { value: "profile_inactive", label: ROSTER_ACCESS_STATE_LABELS.profile_inactive },
  { value: "deactivated", label: ROSTER_ACCESS_STATE_LABELS.deactivated },
];

const controlClass =
  "h-11 rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition hover:border-white/25 focus:border-blue-300/60";

export function ExecutiveRosterList({
  entries,
}: {
  entries: ExecutiveRosterRow[];
}) {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<RosterFilter>("all");

  const visibleEntries = React.useMemo(
    () => filterRoster(entries, { query, filter }),
    [entries, query, filter],
  );

  return (
    <section aria-labelledby="roster-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="roster-heading" className="text-xl font-black text-white">
            Executive Board roster
          </h2>
          <p
            className="mt-1 text-sm text-slate-400"
            aria-live="polite"
            aria-atomic="true"
          >
            Showing {visibleEntries.length} of {entries.length}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <label htmlFor="roster-search" className="sr-only">
              Search the roster by name, email, or position
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <input
              id="roster-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, position"
              autoComplete="off"
              className={`${controlClass} w-full pl-10 sm:w-64`}
            />
          </div>
          <div>
            <label htmlFor="roster-filter" className="sr-only">
              Filter the roster
            </label>
            <select
              id="roster-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value as RosterFilter)}
              className={`${controlClass} w-full sm:w-56`}
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {visibleEntries.length ? (
        <ul className="mt-4" role="list">
          {visibleEntries.map((entry) => (
            <ExecutiveRosterEntry key={entry.email} entry={entry} />
          ))}
        </ul>
      ) : (
        <p className="mt-6 border border-dashed border-white/15 bg-[#02001f]/60 p-6 text-sm text-slate-300">
          {entries.length
            ? "No roster entries match your search."
            : "Nobody has been added yet. Use the form to provision the first executive."}
        </p>
      )}
    </section>
  );
}
