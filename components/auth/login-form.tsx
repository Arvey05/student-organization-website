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
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            className="mt-2 h-12 w-full rounded-md border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-white/25 hover:bg-slate-900/60 focus:border-[var(--msc-blue)] focus:shadow-[0_0_12px_rgba(0,108,249,0.3)]"
          />
        </label>
      </div>

      <AuthFormMessage message={state.error} />
      <AuthSubmitButton pendingText="Logging in...">Log In</AuthSubmitButton>

      <p className="mt-5 text-center text-sm text-slate-300">
        New member?{" "}
        <Link href="/signup" className="font-semibold text-blue-300 transition-colors duration-200 hover:text-white hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
