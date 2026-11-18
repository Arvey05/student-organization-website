"use client";

import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import {
  EXECUTIVE_TIERS,
  ROSTER_EMAIL_MAX_LENGTH,
  ROSTER_TEXT_MAX_LENGTH,
  type RosterActionState,
  type RosterFieldErrors,
  type RosterFormValues,
} from "@/lib/admin/executive-roster";

const inputClass =
  "mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/25 focus:border-blue-300/60 read-only:cursor-not-allowed read-only:text-slate-400 aria-[invalid=true]:border-red-400/60";

/** Always mounted so assistive technology announces changes to its content. */
export function ActionNotice({ state }: { state: RosterActionState }) {
  const hasMessage = state.status !== "idle" && Boolean(state.message);
  const isError = state.status === "error";

  return (
    <div aria-live="polite" aria-atomic="true">
      {hasMessage ? (
        <p
          role={isError ? "alert" : undefined}
          className={`mt-4 flex items-start gap-3 border px-4 py-3 text-sm font-medium ${
            isError
              ? "border-red-400/30 bg-red-500/10 text-red-100"
              : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
          }`}
        >
          {isError ? (
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : (
            <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          )}
          <span>{state.message}</span>
        </p>
      ) : null}
    </div>
  );
}

type SubmitButtonProps = {
  children: string;
  pendingText: string;
  name?: string;
  value?: string;
  variant?: "primary" | "danger";
};

/** Must render inside the form it submits. */
export function RosterSubmitButton({
  children,
  pendingText,
  name,
  value,
  variant = "primary",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      className={`inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        variant === "danger"
          ? "bg-red-500 text-white hover:bg-red-400"
          : "bg-white text-slate-950 hover:bg-blue-100"
      }`}
    >
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      ) : null}
      {pending ? pendingText : children}
    </button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-2 text-xs font-semibold text-red-200">
      {message}
    </p>
  ) : null;
}

type RosterFieldsProps = {
  idPrefix: string;
  defaults?: Partial<RosterFormValues>;
  errors?: RosterFieldErrors;
  /** The login email is the entry's identity, so edits cannot change it. */
  emailReadOnly?: boolean;
};

export function RosterFields({
  idPrefix,
  defaults = {},
  errors = {},
  emailReadOnly = false,
}: RosterFieldsProps) {
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <div className="grid gap-4">
      <div>
        <label htmlFor={id("fullName")} className="text-sm font-semibold text-slate-200">
          Full name
        </label>
        <input
          id={id("fullName")}
          name="fullName"
          type="text"
          required
          maxLength={ROSTER_TEXT_MAX_LENGTH}
          autoComplete="off"
          defaultValue={defaults.fullName ?? ""}
          placeholder="Juan Dela Cruz"
          aria-invalid={errors.fullName ? true : undefined}
          aria-describedby={errors.fullName ? id("fullName-error") : undefined}
          className={inputClass}
        />
        <FieldError id={id("fullName-error")} message={errors.fullName} />
      </div>

      <div>
        <label htmlFor={id("email")} className="text-sm font-semibold text-slate-200">
          Login email
        </label>
        <input
          id={id("email")}
          name="email"
          type="email"
          required
          readOnly={emailReadOnly}
          maxLength={ROSTER_EMAIL_MAX_LENGTH}
          autoComplete="off"
          spellCheck={false}
          defaultValue={defaults.email ?? ""}
          placeholder="name@bulsu.edu.ph"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={
            errors.email ? id("email-error") : id("email-help")
          }
          className={inputClass}
        />
        {errors.email ? (
          <FieldError id={id("email-error")} message={errors.email} />
        ) : (
          <p id={id("email-help")} className="mt-2 text-xs leading-5 text-slate-400">
            {emailReadOnly
              ? "The email is the entry's identity. To change it, remove the entry and add the new address."
              : "Must match the address they use to sign up. Access starts only after they verify it."}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={id("position")} className="text-sm font-semibold text-slate-200">
          Executive Board position
        </label>
        <input
          id={id("position")}
          name="position"
          type="text"
          required
          maxLength={ROSTER_TEXT_MAX_LENGTH}
          autoComplete="off"
          defaultValue={defaults.position ?? ""}
          placeholder="Vice President for Internal Affairs"
          aria-invalid={errors.position ? true : undefined}
          aria-describedby={errors.position ? id("position-error") : undefined}
          className={inputClass}
        />
        <FieldError id={id("position-error")} message={errors.position} />
      </div>

      <fieldset
        aria-describedby={errors.role ? id("role-error") : undefined}
        className="min-w-0"
      >
        <legend className="text-sm font-semibold text-slate-200">
          Membership tier
        </legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {EXECUTIVE_TIERS.map((tier) => (
            <label
              key={tier.value}
              className="flex cursor-pointer items-start gap-3 border border-white/10 bg-black p-4 transition hover:border-white/25 has-[:checked]:border-blue-300/70 has-[:checked]:bg-blue-500/10 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--msc-amber)]"
            >
              <input
                type="radio"
                name="role"
                value={tier.value}
                required
                defaultChecked={defaults.role === tier.value}
                className="mt-1 size-4 accent-[var(--msc-blue)]"
              />
              <span>
                <span className="block text-sm font-bold text-white">
                  {tier.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-400">
                  {tier.description}
                </span>
              </span>
            </label>
          ))}
        </div>
        <FieldError id={id("role-error")} message={errors.role} />
      </fieldset>
    </div>
  );
}
