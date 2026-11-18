// Executive Board roster domain: tiers, input validation, display state, and
// error text for the administrator provisioning pages.
//
// This module is shared by Server Actions and Client Components, so it stays free
// of framework imports. It also has no `@/` runtime imports, which lets its rules
// be unit tested with Node directly (see tests/unit). Type-only imports are
// erased and are safe.
import type { Database } from "@/types/database";

// ─── Tiers ──────────────────────────────────────────────────────────────────

export const EXECUTIVE_TIER_VALUES = ["core_executive", "executive"] as const;

export type ExecutiveTier = (typeof EXECUTIVE_TIER_VALUES)[number];

export const EXECUTIVE_TIER_DETAILS: Record<
  ExecutiveTier,
  { label: string; description: string }
> = {
  core_executive: {
    label: "Core executive member",
    description: "President, Vice Presidents, and Executive Secretary.",
  },
  executive: {
    label: "Executive member",
    description: "All other Executive Board positions.",
  },
};

export const EXECUTIVE_TIERS = EXECUTIVE_TIER_VALUES.map((value) => ({
  value,
  ...EXECUTIVE_TIER_DETAILS[value],
}));

export function isExecutiveTier(value: unknown): value is ExecutiveTier {
  return EXECUTIVE_TIER_VALUES.some((tier) => tier === value);
}

export function getExecutiveTierLabel(tier: string): string {
  return isExecutiveTier(tier) ? EXECUTIVE_TIER_DETAILS[tier].label : tier;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export const ROSTER_TEXT_MAX_LENGTH = 120;
export const ROSTER_EMAIL_MAX_LENGTH = 254;

// These rules mirror private.validate_roster_entry in the database. The database
// copy is authoritative; this one exists to give field-level feedback early.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidationResult<Value> =
  | { ok: true; value: Value }
  | { ok: false; error: string };

export function validateRosterEmail(input: unknown): ValidationResult<string> {
  const email = typeof input === "string" ? input.trim().toLowerCase() : "";

  if (!email) {
    return { ok: false, error: "Enter the login email address." };
  }

  if (email.length > ROSTER_EMAIL_MAX_LENGTH) {
    return {
      ok: false,
      error: `Use ${ROSTER_EMAIL_MAX_LENGTH} characters or fewer.`,
    };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Enter a valid login email address." };
  }

  return { ok: true, value: email };
}

function validateRequiredText(
  input: string,
  subject: string,
): ValidationResult<string> {
  const text = input.replace(/\s+/g, " ").trim();

  if (!text) {
    return { ok: false, error: `Enter ${subject}.` };
  }

  if (text.length > ROSTER_TEXT_MAX_LENGTH) {
    return {
      ok: false,
      error: `Use ${ROSTER_TEXT_MAX_LENGTH} characters or fewer.`,
    };
  }

  return { ok: true, value: text };
}

export type RosterEntry = {
  email: string;
  fullName: string;
  position: string;
  role: ExecutiveTier;
};

export const ROSTER_FIELD_NAMES = [
  "email",
  "fullName",
  "position",
  "role",
] as const;

export type RosterFieldName = (typeof ROSTER_FIELD_NAMES)[number];
export type RosterFormValues = Record<RosterFieldName, string>;
export type RosterFieldErrors = Partial<Record<RosterFieldName, string>>;

export type ParsedRosterEntry =
  | { success: true; data: RosterEntry; values: RosterFormValues }
  | { success: false; fieldErrors: RosterFieldErrors; values: RosterFormValues };

/** Validates raw form values. `values` is echoed back so a form can be refilled. */
export function validateRosterEntry(
  values: RosterFormValues,
): ParsedRosterEntry {
  const email = validateRosterEmail(values.email);
  const fullName = validateRequiredText(values.fullName, "the member's full name");
  const position = validateRequiredText(
    values.position,
    "the Executive Board position",
  );
  const role = isExecutiveTier(values.role)
    ? ({ ok: true, value: values.role } as const)
    : ({ ok: false, error: "Choose a membership tier." } as const);

  if (email.ok && fullName.ok && position.ok && role.ok) {
    return {
      success: true,
      data: {
        email: email.value,
        fullName: fullName.value,
        position: position.value,
        role: role.value,
      },
      values,
    };
  }

  const fieldErrors: RosterFieldErrors = {};
  if (!email.ok) fieldErrors.email = email.error;
  if (!fullName.ok) fieldErrors.fullName = fullName.error;
  if (!position.ok) fieldErrors.position = position.error;
  if (!role.ok) fieldErrors.role = role.error;

  return { success: false, fieldErrors, values };
}

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function readRosterFormValues(formData: FormData): RosterFormValues {
  return {
    email: readField(formData, "email"),
    fullName: readField(formData, "fullName"),
    position: readField(formData, "position"),
    role: readField(formData, "role"),
  };
}

export function parseRosterEntry(formData: FormData): ParsedRosterEntry {
  return validateRosterEntry(readRosterFormValues(formData));
}

// ─── Server action state ────────────────────────────────────────────────────

export type RosterActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: RosterFieldErrors;
  /** Raw submitted values, returned on failure so forms can be refilled. */
  values?: RosterFormValues;
};

export const initialRosterActionState: RosterActionState = { status: "idle" };

type RosterRpcError = { code?: string | null; message?: string | null };

// The database raises these with messages written for administrators.
const ADMIN_FACING_ERROR_CODES = new Set(["22023", "23505", "P0002"]);

export function describeRosterError(error: RosterRpcError): string {
  if (error.code === "42501") {
    return "Your administrator access could not be confirmed. Sign in again and retry.";
  }

  if (error.code && error.message && ADMIN_FACING_ERROR_CODES.has(error.code)) {
    return error.message;
  }

  return "The roster could not be updated. Please try again.";
}

// ─── Roster display state ───────────────────────────────────────────────────

export type ExecutiveRosterRow =
  Database["public"]["Functions"]["admin_list_executives"]["Returns"][number];

export type ProvisioningActivityRow =
  Database["public"]["Functions"]["admin_list_provisioning_activity"]["Returns"][number];

export type RosterAccessState =
  | "active"
  | "not_signed_up"
  | "awaiting_verification"
  | "profile_inactive"
  | "deactivated";

export const ROSTER_ACCESS_STATE_LABELS: Record<RosterAccessState, string> = {
  active: "Access active",
  not_signed_up: "Not signed up yet",
  awaiting_verification: "Awaiting email verification",
  profile_inactive: "Member profile inactive",
  deactivated: "Deactivated",
};

type AccessStateInput = Pick<
  ExecutiveRosterRow,
  "active" | "account_status" | "has_access"
>;

/** The single reason an entry does or does not currently grant access. */
export function getRosterAccessState(row: AccessStateInput): RosterAccessState {
  if (!row.active) return "deactivated";
  if (row.has_access) return "active";
  if (row.account_status === "no_account") return "not_signed_up";
  if (row.account_status === "awaiting_verification") {
    return "awaiting_verification";
  }
  return "profile_inactive";
}

export type RosterSummary = {
  total: number;
  activeCore: number;
  activeExecutive: number;
  /** Active entries whose owner cannot use their access yet. */
  awaitingSetup: number;
  deactivated: number;
};

export function summarizeRoster(
  rows: readonly (AccessStateInput & Pick<ExecutiveRosterRow, "role">)[],
): RosterSummary {
  const summary: RosterSummary = {
    total: rows.length,
    activeCore: 0,
    activeExecutive: 0,
    awaitingSetup: 0,
    deactivated: 0,
  };

  for (const row of rows) {
    const state = getRosterAccessState(row);

    if (state === "deactivated") {
      summary.deactivated += 1;
      continue;
    }

    if (row.role === "core_executive") summary.activeCore += 1;
    if (row.role === "executive") summary.activeExecutive += 1;
    if (state !== "active") summary.awaitingSetup += 1;
  }

  return summary;
}

export type RosterFilter = "all" | ExecutiveTier | RosterAccessState;

type FilterableRow = AccessStateInput &
  Pick<ExecutiveRosterRow, "role" | "email" | "full_name" | "position">;

export function filterRoster<Row extends FilterableRow>(
  rows: readonly Row[],
  { query, filter }: { query: string; filter: RosterFilter },
): Row[] {
  const needle = query.trim().toLowerCase();

  return rows.filter((row) => {
    if (filter !== "all") {
      const matchesFilter = isExecutiveTier(filter)
        ? row.role === filter
        : getRosterAccessState(row) === filter;

      if (!matchesFilter) return false;
    }

    return (
      !needle ||
      [row.full_name, row.email, row.position].some((field) =>
        field.toLowerCase().includes(needle),
      )
    );
  });
}

// ─── Activity feed ──────────────────────────────────────────────────────────

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readText(source: Record<string, unknown>, key: string): string | null {
  const value = source[key];
  return typeof value === "string" && value ? value : null;
}

function describeChanges(details: Record<string, unknown>): string {
  const from = asRecord(details.from);
  const to = asRecord(details.to);
  const changes: string[] = [];

  const previousRole = readText(from, "role");
  const nextRole = readText(to, "role");
  if (previousRole && nextRole && previousRole !== nextRole) {
    changes.push(
      `tier ${getExecutiveTierLabel(previousRole)} → ${getExecutiveTierLabel(nextRole)}`,
    );
  }

  for (const [key, label] of [
    ["position", "position"],
    ["full_name", "name"],
  ] as const) {
    const previous = readText(from, key);
    const next = readText(to, key);
    if (previous && next && previous !== next) {
      changes.push(`${label} “${previous}” → “${next}”`);
    }
  }

  return changes.join("; ");
}

/** One-line, human-readable summary of an audit entry. */
export function describeProvisioningEvent(
  event: Pick<ProvisioningActivityRow, "action" | "target_email" | "details">,
): string {
  const details = asRecord(event.details);
  const subject = readText(details, "full_name") ?? event.target_email;
  const role = readText(details, "role");

  switch (event.action) {
    case "added":
      return role
        ? `Added ${subject} as ${getExecutiveTierLabel(role)}`
        : `Added ${subject}`;
    case "removed":
      return `Removed ${subject} from the roster`;
    case "activated":
      return `Reactivated ${event.target_email}`;
    case "deactivated":
      return `Deactivated ${event.target_email}`;
    case "updated": {
      const changes = describeChanges(details);
      return changes
        ? `Updated ${event.target_email}: ${changes}`
        : `Updated ${event.target_email}`;
    }
    default:
      return `${event.action} ${event.target_email}`;
  }
}
