"use client";

import Link from "next/link";
import { useActionState } from "react";

import { login } from "@/app/auth/actions";
import { AuthFormMessage } from "@/components/auth/auth-form-message";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";

export function LoginForm() {
  const [state, action] = useActionState(login, {});

  return (
    <form action={action}>
      <div className="mt-6 space-y-4">
        <label className="block">
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
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      <AuthFormMessage message={state.error} />
      <AuthSubmitButton pendingText="Logging in...">Log In</AuthSubmitButton>

      <p className="mt-5 text-center text-sm text-slate-600">
        New member?{" "}
        <Link href="/signup" className="font-semibold text-blue-700">
          Create an account
        </Link>
      </p>
    </form>
  );
}
