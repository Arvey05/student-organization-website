"use client";

import { useActionState } from "react";

import { addExecutive } from "@/app/(member)/admin/executives/actions";
import {
  ActionNotice,
  RosterFields,
  RosterSubmitButton,
} from "@/components/admin/roster-form-parts";
import { initialRosterActionState } from "@/lib/admin/executive-roster";

export function ExecutiveProvisioningForm() {
  const [state, formAction] = useActionState(
    addExecutive,
    initialRosterActionState,
  );

  return (
    <form action={formAction} aria-labelledby="provision-heading">
      <h2 id="provision-heading" className="text-xl font-black text-white">
        Provision an executive
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Approve a person for the Executive Board before or after they sign up.
        Members never choose a tier themselves.
      </p>

      <div className="mt-6">
        <RosterFields
          idPrefix="provision"
          defaults={state.values}
          errors={state.fieldErrors}
        />
      </div>

      <ActionNotice state={state} />

      <div className="mt-6">
        <RosterSubmitButton pendingText="Adding…">
          Add to roster
        </RosterSubmitButton>
      </div>
    </form>
  );
}
