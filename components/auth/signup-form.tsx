"use client";

import Link from "next/link";
import * as React from "react";
import { useActionState } from "react";

import { signup } from "@/app/auth/actions";
import { AuthFormMessage } from "@/components/auth/auth-form-message";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
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

  // ─── Task 3: Cascading dropdowns ──────────────────────────────────────
  const [selectedCollege, setSelectedCollege] = React.useState("");
  const [selectedProgram, setSelectedProgram] = React.useState("");
  const [selectedMajor, setSelectedMajor] = React.useState("");

  const availablePrograms = React.useMemo(
    () => getProgramsForCollege(selectedCollege),
    [selectedCollege],
  );

  const availableMajors = React.useMemo(
    () => getMajorsForProgram(selectedProgram),
    [selectedProgram],
  );

  function handleCollegeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCollege(e.target.value);
    setSelectedProgram("");
    setSelectedMajor("");
  }

  function handleProgramChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedProgram(e.target.value);
    setSelectedMajor("");
  }

  return (
    <form action={action}>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
            className={inputCls}
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
            className={inputCls}
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
            placeholder="member@bulsu.edu.ph"
            className={inputCls}
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
            className={inputCls}
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
            className={inputCls}
          />
        </label>

        {/* ─── Task 3: Dropdowns in registration form ─── */}
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-slate-200">College</span>
          <select
            name="college"
            value={selectedCollege}
            onChange={handleCollegeChange}
            className={selectCls}
          >
            <option value="">— Select college —</option>
            {COLLEGES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label} ({c.value})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-200">Program</span>
          <select
            name="program"
            value={selectedProgram}
            onChange={handleProgramChange}
            disabled={!selectedCollege}
            className={selectCls}
          >
            <option value="">
              {selectedCollege
                ? "— Select program —"
                : "— Select college first —"}
            </option>
            {availablePrograms.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-200">Major</span>
          {availableMajors.length > 0 ? (
            <select
              name="major"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className={selectCls}
            >
              <option value="">— Select major —</option>
              {availableMajors.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input type="hidden" name="major" value="" />
              <div className="mt-2 flex h-12 items-center rounded-md border border-white/10 bg-slate-950 px-4 text-sm text-slate-500">
                {selectedProgram
                  ? "No majors for this program"
                  : "— Select program first —"}
              </div>
            </>
          )}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-200">
            Year level
          </span>
          <select name="year_level" className={selectCls}>
            <option value="">— Select year level —</option>
            {YEAR_LEVELS.map((y) => (
              <option key={y.value} value={y.value}>
                {y.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-200">Gender</span>
          <select name="gender" className={selectCls}>
            <option value="">— Select gender —</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <AuthFormMessage message={state.error} />
      <AuthSubmitButton pendingText="Creating account...">
        Sign Up
      </AuthSubmitButton>

      <p className="mt-5 text-center text-sm text-slate-300">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-blue-200">
          Log in
        </Link>
      </p>
    </form>
  );
}
