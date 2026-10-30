"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup } from "@/app/auth/actions";
import { AuthFormMessage } from "@/components/auth/auth-form-message";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { SIGNUP_ROLES } from "@/lib/supabase/roles";
import {
  COLLEGES,
  GENDER_OPTIONS,
  getMajorsForProgram,
  getProgramsForCollege,
  YEAR_LEVELS,
} from "@/lib/member/colleges";

const inputCls =
  "mt-2 h-12 w-full rounded-md border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-300/60 focus:bg-black";
const selectCls =
  "mt-2 h-12 w-full rounded-md border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-blue-300/60 disabled:opacity-50 disabled:cursor-not-allowed appearance-none";

export function SignupForm() {
  const [state, action] = useActionState(signup, {});

  return (
    <form action={action}>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-slate-200">Membership type</span>
          <select
            name="membership_type"
            defaultValue="member"
            required
            aria-describedby="membership-type-help"
            className={selectCls}
          >
            {SIGNUP_ROLES.map((role) => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
          <span id="membership-type-help" className="mt-2 block text-xs leading-6 text-slate-400">
            Executive membership is available only to approved Executive Board members.
            Use the email address on the official EB roster and verify your email to activate access.
          </span>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-200">
            First name
          </span>
          <input
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            placeholder="First name"
            className="mt-2 h-12 w-full rounded-md border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-white/25 hover:bg-slate-900/60 focus:border-[var(--msc-blue)] focus:shadow-[0_0_12px_rgba(0,108,249,0.3)]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-200">
            Last name
          </span>
          <input
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            placeholder="Last name"
            className="mt-2 h-12 w-full rounded-md border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-white/25 hover:bg-slate-900/60 focus:border-[var(--msc-blue)] focus:shadow-[0_0_12px_rgba(0,108,249,0.3)]"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-slate-200">
            Email address
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="member@example.edu"
            className="mt-2 h-12 w-full rounded-md border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-white/25 hover:bg-slate-900/60 focus:border-[var(--msc-blue)] focus:shadow-[0_0_12px_rgba(0,108,249,0.3)]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-200">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Create password"
            className="mt-2 h-12 w-full rounded-md border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-white/25 hover:bg-slate-900/60 focus:border-[var(--msc-blue)] focus:shadow-[0_0_12px_rgba(0,108,249,0.3)]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-200">
            Confirm password
          </span>
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Confirm password"
            className="mt-2 h-12 w-full rounded-md border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-white/25 hover:bg-slate-900/60 focus:border-[var(--msc-blue)] focus:shadow-[0_0_12px_rgba(0,108,249,0.3)]"
          />
        </label>
      </div>

      <AuthFormMessage message={state.error} />
      <AuthSubmitButton pendingText="Creating account...">
        Sign Up
      </AuthSubmitButton>

      <p className="mt-5 text-center text-sm text-slate-300">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-blue-300 transition-colors duration-200 hover:text-white hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
