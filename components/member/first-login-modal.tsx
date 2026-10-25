"use client";

import * as React from "react";
import { X, CheckCircle, Camera, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";

import {
  COLLEGES,
  GENDER_OPTIONS,
  getMajorsForProgram,
  getProgramsForCollege,
  YEAR_LEVELS,
} from "@/lib/member/colleges";
import type { ProfileRow } from "@/lib/member/profile";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const today = new Date();
const MAX_DATE = new Date(today);
MAX_DATE.setFullYear(today.getFullYear() - 14);
const MIN_DATE = new Date(today);
MIN_DATE.setFullYear(today.getFullYear() - 100);

function toISODate(d: Date) {
  return d.toISOString().split("T")[0];
}
function formatBytes(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const selectCls =
  "mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60 disabled:opacity-50 disabled:cursor-not-allowed appearance-none";
const inputCls =
  "mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60";
const labelCls = "block";
const spanCls = "text-xs font-semibold text-slate-300";

type Props = {
  profile: ProfileRow;
  displayName: string;
  userEmail?: string;
};

export function FirstLoginModal({ profile, displayName, userEmail }: Props) {
  const [open, setOpen] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  const firstFieldRef = React.useRef<HTMLInputElement>(null);
  const objectUrlRef = React.useRef<string | null>(null);

  // ── Cascading dropdowns ──────────────────────────────────────────────
  const [college, setCollege] = React.useState(profile.college ?? "");
  const [program, setProgram] = React.useState(profile.program ?? "");
  const [major, setMajor] = React.useState(profile.major ?? "");
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    profile.profile_picture_url ?? null,
  );
  const [removePicture, setRemovePicture] = React.useState(false);
  const [pictureError, setPictureError] = React.useState<string | null>(null);
  const [dobError, setDobError] = React.useState<string | null>(null);
  const [dobValue, setDobValue] = React.useState(
    profile.date_of_birth ? profile.date_of_birth.split("T")[0] : "",
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const availablePrograms = React.useMemo(
    () => getProgramsForCollege(college),
    [college],
  );
  const availableMajors = React.useMemo(
    () => getMajorsForProgram(program),
    [program],
  );

  // Focus trap: when modal opens, focus first field
  React.useEffect(() => {
    if (open) {
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard handling: Escape closes modal (without saving)
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        handleClose();
      }
      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute("disabled"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Revoke object URL on unmount
  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function handleClose() {
    // Close without saving – flag stays unset, modal shows next login
    setOpen(false);
    // Return focus to body or trigger element
    document.body.focus();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPictureError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.has(file.type)) {
      setPictureError("Only JPG, PNG, or WebP files are accepted.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setPictureError(
        `Image must be 1 MB or less. Your file is ${formatBytes(file.size)}.`,
      );
      e.target.value = "";
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPreviewUrl(url);
    setRemovePicture(false);
  }

  function handleRemovePicture() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl(null);
    setRemovePicture(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDobChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setDobValue(val);
    if (!val) {
      setDobError(null);
      return;
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) {
      setDobError("Please enter a valid date.");
    } else if (d > MAX_DATE) {
      setDobError("Age must be at least 14 years old.");
    } else if (d < MIN_DATE) {
      setDobError("Please enter a realistic birthdate.");
    } else {
      setDobError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const { completeProfile } = await import("@/app/member/complete-profile-action");
      const result = await completeProfile(formData);
      if (result?.error) {
        setError(result.error);
        setSubmitting(false);
      } else {
        setOpen(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 px-4 py-8 sm:py-16"
      role="presentation"
      aria-hidden="false"
      onClick={(e) => {
        // Close if backdrop clicked
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <dialog
        ref={dialogRef}
        open
        aria-modal="true"
        aria-labelledby="first-login-modal-title"
        className="relative w-full max-w-2xl border border-white/10 bg-[#02001f] text-white shadow-2xl shadow-black/60"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              BulSU MSC Member Portal
            </p>
            <h2
              id="first-login-modal-title"
              className="mt-2 text-2xl font-black tracking-tight text-white"
            >
              Complete your profile, {displayName.split(" ")[0]}!
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Fill in your information to get full access to member features.
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            id="close-first-login-modal"
            onClick={handleClose}
            aria-label="Close and complete later"
            className="ml-4 inline-flex size-10 shrink-0 items-center justify-center border border-white/10 text-slate-400 transition hover:border-white/30 hover:text-white"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <form
          id="first-login-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="max-h-[70vh] overflow-y-auto p-6"
        >
          {/* Profile picture */}
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <div className="relative size-16 overflow-hidden rounded-full border border-white/20">
                  <Image
                    src={previewUrl}
                    alt="Profile preview"
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized={previewUrl.startsWith("blob:")}
                  />
                </div>
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full border border-dashed border-white/20 bg-slate-900 text-slate-500">
                  <Camera className="size-7" aria-hidden="true" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">
                  Profile picture
                </p>
                <p className="text-xs text-slate-500">
                  JPG, PNG, or WebP · Max 1 MB
                </p>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <input
                type="hidden"
                name="remove_profile_picture"
                value={removePicture ? "1" : "0"}
              />
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 border border-white/15 px-4 text-sm font-semibold text-white transition hover:border-blue-300/40 hover:text-blue-100">
                <Upload className="size-4" aria-hidden="true" />
                Upload
                <input
                  ref={fileInputRef}
                  name="profile_picture"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-label="Upload profile picture"
                />
              </label>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="inline-flex h-10 items-center gap-2 border border-red-400/20 px-3 text-sm text-red-300 transition hover:border-red-400/50"
                  aria-label="Remove picture"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {pictureError && (
            <p
              role="alert"
              className="mb-4 border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-200"
            >
              {pictureError}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mb-4 border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-200"
            >
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {/* First Name */}
            <label className={labelCls}>
              <span className={spanCls}>First Name</span>
              <input
                ref={firstFieldRef}
                name="first_name"
                required
                defaultValue={profile.first_name ?? ""}
                className={inputCls}
              />
            </label>

            {/* Last Name */}
            <label className={labelCls}>
              <span className={spanCls}>Last Name</span>
              <input
                name="last_name"
                required
                defaultValue={profile.last_name ?? ""}
                className={inputCls}
              />
            </label>

            {/* College */}
            <label className={labelCls}>
              <span className={spanCls}>College</span>
              <select
                name="college"
                value={college}
                onChange={(e) => {
                  setCollege(e.target.value);
                  setProgram("");
                  setMajor("");
                }}
                className={selectCls}
              >
                <option value="">— Select college —</option>
                {COLLEGES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Program */}
            <label className={labelCls}>
              <span className={spanCls}>Program</span>
              <select
                name="program"
                value={program}
                onChange={(e) => {
                  setProgram(e.target.value);
                  setMajor("");
                }}
                disabled={!college}
                className={selectCls}
              >
                <option value="">
                  {college ? "— Select program —" : "— Select college first —"}
                </option>
                {availablePrograms.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Major */}
            {availableMajors.length > 0 ? (
              <label className={labelCls}>
                <span className={spanCls}>Major</span>
                <select
                  name="major"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className={selectCls}
                >
                  <option value="">— Select major —</option>
                  {availableMajors.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <input type="hidden" name="major" value="" />
              </>
            )}

            {/* Year Level */}
            <label className={labelCls}>
              <span className={spanCls}>Year Level</span>
              <select
                name="year_level"
                defaultValue={profile.year_level ?? ""}
                className={selectCls}
              >
                <option value="">— Select year level —</option>
                {YEAR_LEVELS.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Gender */}
            <label className={labelCls}>
              <span className={spanCls}>Gender</span>
              <select
                name="gender"
                defaultValue={profile.gender ?? ""}
                className={selectCls}
              >
                <option value="">— Select gender —</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Birthdate */}
            <label className={labelCls}>
              <span className={spanCls}>Birthdate</span>
              <input
                name="date_of_birth"
                type="date"
                value={dobValue}
                onChange={handleDobChange}
                max={toISODate(MAX_DATE)}
                min={toISODate(MIN_DATE)}
                className={inputCls}
              />
              {dobError ? (
                <span
                  role="alert"
                  className="mt-1 block text-xs font-semibold text-red-400"
                >
                  {dobError}
                </span>
              ) : (
                <span className="mt-1 block text-xs text-slate-500">
                  Minimum age: 14 years old.
                </span>
              )}
            </label>

            {/* Phone */}
            <label className={labelCls}>
              <span className={spanCls}>Contact Number</span>
              <input
                name="phone"
                type="tel"
                defaultValue={profile.phone ?? ""}
                className={inputCls}
              />
            </label>

            {/* Personal Email */}
            <label className={`${labelCls} sm:col-span-2`}>
              <span className={spanCls}>Personal Email</span>
              <input
                name="personal_email"
                type="email"
                defaultValue={profile.personal_email ?? userEmail ?? ""}
                className={inputCls}
              />
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-11 items-center justify-center border border-white/15 px-5 text-sm font-semibold text-slate-300 transition hover:border-white/30 hover:text-white"
          >
            Complete later
          </button>
          <button
            type="submit"
            form="first-login-form"
            id="save-first-login-profile"
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center gap-2 bg-white px-6 text-sm font-black text-slate-950 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <CheckCircle className="size-4" aria-hidden="true" />
            )}
            {submitting ? "Saving…" : "Save and Continue"}
          </button>
        </div>
      </dialog>
    </div>
  );
}
