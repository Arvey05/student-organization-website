"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup } from "@/app/auth/actions";
import { AuthFormMessage } from "@/components/auth/auth-form-message";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";

export function SignupForm() {
  const [state, action] = useActionState(signup, {});

  return (
    <form action={action}>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            First name
          </span>
          <input
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            placeholder="First name"
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Last name
          </span>
          <input
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            placeholder="Last name"
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-slate-700">
            Email address
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="member@example.edu"
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Create password"
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Confirm password
          </span>
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Confirm password"
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      <AuthFormMessage message={state.error} />
      <AuthSubmitButton pendingText="Creating account...">
        Sign Up
      </AuthSubmitButton>

      <p className="mt-5 text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-blue-700">
          Log in
        </Link>
      </p>
    </form>
  );
}
