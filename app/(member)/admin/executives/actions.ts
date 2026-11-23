"use server";

import { revalidatePath } from "next/cache";

import { requireSiteAdmin } from "@/lib/admin/access";
import {
  describeRosterError,
  getExecutiveTierLabel,
  parseRosterEntry,
  validateRosterEmail,
  type RosterActionState,
} from "@/lib/admin/executive-roster";

// Every action re-verifies administrator access: Server Actions are reachable by
// direct POST, and the pages that render these forms are not a security
// boundary. The database functions check again, so this is defense in depth.

type DatabaseError = { code?: string | null; message: string };

const INVALID_REQUEST =
  "That request was not valid. Refresh the page and try again.";

function refreshAdminPages() {
  revalidatePath("/admin");
  revalidatePath("/admin/executives");
}

function failure(
  message: string,
  extra: Partial<RosterActionState> = {},
): RosterActionState {
  return { status: "error", message, ...extra };
}

function reportDatabaseFailure(operation: string, error: DatabaseError) {
  // Only the SQLSTATE is logged: roster messages can contain private emails.
  const expected = ["22023", "23505", "P0002", "42501"];

  if (!error.code || !expected.includes(error.code)) {
    console.error(
      `Executive roster ${operation} failed (SQLSTATE ${error.code ?? "unknown"}).`,
    );
  }
}

function readTargetEmail(formData: FormData): string | null {
  const email = validateRosterEmail(formData.get("email"));
  return email.ok ? email.value : null;
}

export async function addExecutive(
  _previousState: RosterActionState,
  formData: FormData,
): Promise<RosterActionState> {
  const { supabase } = await requireSiteAdmin();
  const parsed = parseRosterEntry(formData);

  if (!parsed.success) {
    return failure("Check the highlighted fields.", {
      fieldErrors: parsed.fieldErrors,
      values: parsed.values,
    });
  }

  const { data: entry, values } = parsed;
  const { error } = await supabase.rpc("admin_add_executive", {
    p_email: entry.email,
    p_full_name: entry.fullName,
    p_position: entry.position,
    p_role: entry.role,
  });

  if (error) {
    reportDatabaseFailure("add", error);
    const message = describeRosterError(error);

    return failure(message, {
      values,
      // A duplicate belongs on the email field, where the fix is.
      fieldErrors: error.code === "23505" ? { email: message } : undefined,
    });
  }

  refreshAdminPages();

  return {
    status: "success",
    message: `${entry.fullName} was added as ${getExecutiveTierLabel(entry.role)}. Access starts once they sign up with ${entry.email} and verify that address.`,
  };
}

export async function updateExecutive(
  _previousState: RosterActionState,
  formData: FormData,
): Promise<RosterActionState> {
  const { supabase } = await requireSiteAdmin();
  const parsed = parseRosterEntry(formData);

  if (!parsed.success) {
    return failure("Check the highlighted fields.", {
      fieldErrors: parsed.fieldErrors,
      values: parsed.values,
    });
  }

  const { data: entry, values } = parsed;
  const { error } = await supabase.rpc("admin_update_executive", {
    p_email: entry.email,
    p_full_name: entry.fullName,
    p_position: entry.position,
    p_role: entry.role,
  });

  if (error) {
    reportDatabaseFailure("update", error);
    return failure(describeRosterError(error), { values });
  }

  refreshAdminPages();

  return { status: "success", message: `${entry.fullName} was updated.` };
}

export async function setExecutiveActive(
  _previousState: RosterActionState,
  formData: FormData,
): Promise<RosterActionState> {
  const { supabase } = await requireSiteAdmin();
  const email = readTargetEmail(formData);
  const requested = formData.get("active");

  if (!email || (requested !== "true" && requested !== "false")) {
    return failure(INVALID_REQUEST);
  }

  const active = requested === "true";
  const { error } = await supabase.rpc("admin_set_executive_active", {
    p_email: email,
    p_active: active,
  });

  if (error) {
    reportDatabaseFailure("activation change", error);
    return failure(describeRosterError(error));
  }

  refreshAdminPages();

  return {
    status: "success",
    message: active
      ? "Access reactivated."
      : "Access deactivated. Event permissions are revoked immediately, including for open sessions.",
  };
}

export async function removeExecutive(
  _previousState: RosterActionState,
  formData: FormData,
): Promise<RosterActionState> {
  const { supabase } = await requireSiteAdmin();
  const email = readTargetEmail(formData);

  if (!email) {
    return failure(INVALID_REQUEST);
  }

  const { error } = await supabase.rpc("admin_remove_executive", {
    p_email: email,
  });

  if (error) {
    reportDatabaseFailure("removal", error);
    return failure(describeRosterError(error));
  }

  refreshAdminPages();

  return { status: "success", message: "The roster entry was removed." };
}
