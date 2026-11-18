"use client";

import * as React from "react";
import { Pencil, Trash2, UserCheck, UserX } from "lucide-react";

import {
  removeExecutive,
  setExecutiveActive,
  updateExecutive,
} from "@/app/(member)/admin/executives/actions";
import {
  ActionNotice,
  RosterFields,
  RosterSubmitButton,
} from "@/components/admin/roster-form-parts";
import {
  ROSTER_ACCESS_STATE_LABELS,
  getExecutiveTierLabel,
  getRosterAccessState,
  initialRosterActionState,
  type ExecutiveRosterRow,
  type RosterAccessState,
  type RosterActionState,
} from "@/lib/admin/executive-roster";

type Mode = "view" | "edit" | "remove";

const TIER_TONES = {
  core_executive: "border-amber-300/35 text-amber-100",
  executive: "border-blue-300/35 text-blue-100",
} as const;

const ACCESS_TONES: Record<RosterAccessState, string> = {
  active: "border-emerald-300/35 bg-emerald-500/10 text-emerald-100",
  not_signed_up: "border-white/15 text-slate-300",
  awaiting_verification: "border-amber-300/35 bg-amber-500/10 text-amber-100",
  profile_inactive: "border-orange-300/35 bg-orange-500/10 text-orange-100",
  deactivated: "border-red-300/30 bg-red-500/10 text-red-100",
};

const ACCESS_HINTS: Record<RosterAccessState, string> = {
  active: "Can create events and announcements.",
  not_signed_up: "No account yet. Access starts after they sign up and verify this email.",
  awaiting_verification: "Signed up, but the email is not verified yet.",
  profile_inactive: "Verified, but their member profile is inactive.",
  deactivated: "Access is revoked. Reactivate to restore it.",
};

const secondaryButton =
  "inline-flex h-9 items-center justify-center gap-2 border border-white/15 px-3 text-xs font-semibold text-slate-200 transition hover:border-blue-300/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

/**
 * The server action for a submitted intent. Each is a separate Server Action
 * that re-verifies administrator access; this only routes the click.
 */
async function submitEntryChange(
  previous: RosterActionState,
  formData: FormData,
): Promise<RosterActionState> {
  const intent = formData.get("intent");

  switch (intent) {
    case "update":
      return updateExecutive(previous, formData);
    case "activate":
    case "deactivate":
      formData.set("active", intent === "activate" ? "true" : "false");
      return setExecutiveActive(previous, formData);
    case "remove":
      return removeExecutive(previous, formData);
    default:
      return {
        status: "error",
        message: "That request was not valid. Refresh the page and try again.",
      };
  }
}

export function ExecutiveRosterEntry({ entry }: { entry: ExecutiveRosterRow }) {
  const [mode, setMode] = React.useState<Mode>("view");
  const [state, formAction, pending] = React.useActionState(
    async (previous: RosterActionState, formData: FormData) => {
      const result = await submitEntryChange(previous, formData);

      if (result.status === "success") {
        setMode("view");
      }

      return result;
    },
    initialRosterActionState,
  );

  const accessState = getRosterAccessState(entry);
  const isActive = entry.active;
  const nameId = `entry-${entry.email}-name`;

  return (
    <li
      aria-labelledby={nameId}
      className={`border-t border-white/10 py-5 first:border-t-0 ${isActive ? "" : "opacity-80"}`}
    >
      <form action={formAction}>
        <fieldset disabled={pending} className="min-w-0">
          {mode !== "edit" ? (
            <input type="hidden" name="email" value={entry.email} />
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 id={nameId} className="text-base font-bold text-white">
                  {entry.full_name}
                </h3>
                <span
                  className={`border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] ${TIER_TONES[entry.role as keyof typeof TIER_TONES] ?? ""}`}
                >
                  {getExecutiveTierLabel(entry.role)}
                </span>
                <span
                  className={`border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] ${ACCESS_TONES[accessState]}`}
                >
                  {ROSTER_ACCESS_STATE_LABELS[accessState]}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">{entry.position}</p>
              <p className="mt-1 break-all font-mono text-xs text-slate-400">
                {entry.email}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {ACCESS_HINTS[accessState]}
              </p>
            </div>

            {mode === "view" ? (
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  aria-label={`Edit ${entry.full_name}`}
                  className={secondaryButton}
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Edit
                </button>
                <button
                  type="submit"
                  name="intent"
                  value={isActive ? "deactivate" : "activate"}
                  aria-label={`${isActive ? "Deactivate" : "Reactivate"} ${entry.full_name}`}
                  className={secondaryButton}
                >
                  {isActive ? (
                    <UserX className="size-3.5" aria-hidden="true" />
                  ) : (
                    <UserCheck className="size-3.5" aria-hidden="true" />
                  )}
                  {isActive ? "Deactivate" : "Reactivate"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("remove")}
                  aria-label={`Remove ${entry.full_name}`}
                  className={`${secondaryButton} hover:border-red-300/50 hover:text-red-200`}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Remove
                </button>
              </div>
            ) : null}
          </div>

          {mode === "edit" ? (
            <div className="mt-5 border border-white/10 bg-black/30 p-5">
              <RosterFields
                idPrefix={`edit-${entry.email}`}
                defaults={
                  state.values ?? {
                    email: entry.email,
                    fullName: entry.full_name,
                    position: entry.position,
                    role: entry.role,
                  }
                }
                errors={state.fieldErrors}
                emailReadOnly
              />
              <div className="mt-5 flex flex-wrap gap-3">
                <RosterSubmitButton
                  name="intent"
                  value="update"
                  pendingText="Saving…"
                >
                  Save changes
                </RosterSubmitButton>
                <button
                  type="button"
                  onClick={() => setMode("view")}
                  className="inline-flex h-11 items-center justify-center border border-white/15 px-5 text-sm font-semibold text-slate-200 transition hover:border-blue-300/50 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {mode === "remove" ? (
            <div
              role="group"
              aria-label={`Confirm removal of ${entry.full_name}`}
              className="mt-5 border border-red-300/30 bg-red-500/10 p-5"
            >
              <p className="text-sm leading-6 text-red-50">
                Remove <strong>{entry.full_name}</strong> from the roster? Their
                Executive Board access ends immediately. To pause access and
                keep the entry, deactivate it instead.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <RosterSubmitButton
                  name="intent"
                  value="remove"
                  variant="danger"
                  pendingText="Removing…"
                >
                  Remove from roster
                </RosterSubmitButton>
                <button
                  type="button"
                  onClick={() => setMode("view")}
                  className="inline-flex h-11 items-center justify-center border border-white/15 px-5 text-sm font-semibold text-slate-200 transition hover:border-blue-300/50 hover:text-white"
                >
                  Keep entry
                </button>
              </div>
            </div>
          ) : null}
        </fieldset>
        <ActionNotice state={state} />
      </form>
    </li>
  );
}
