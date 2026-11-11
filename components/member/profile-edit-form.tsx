"use client";

import * as React from "react";
import Image from "next/image";
import { Camera, Loader2, Trash2, Upload, X } from "lucide-react";

import {
  COLLEGES,
  GENDER_OPTIONS,
  getMajorsForProgram,
  getProgramsForCollege,
  YEAR_LEVELS,
} from "@/lib/member/colleges";
import type { ProfileRow } from "@/lib/member/profile";

const MAX_PROFILE_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB (Task 5)
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_IMAGE_TYPES_LABEL = "JPG, PNG, or WebP";

// Minimum age: 14 years old
// Maximum age: 100 years old
const today = new Date();
const MAX_DATE = new Date(today);
MAX_DATE.setFullYear(today.getFullYear() - 14);
const MIN_DATE = new Date(today);
MIN_DATE.setFullYear(today.getFullYear() - 100);

function toISODate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatBytes(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

type Props = {
  profile: ProfileRow | null;
  userEmail?: string;
  errorMessage?: string | null;
};

/** Shared select styling to keep Tailwind classes DRY */
const selectCls =
  "mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60 disabled:opacity-50 disabled:cursor-not-allowed appearance-none";
const inputCls =
  "mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60";
const labelCls = "block";
const spanCls = "text-sm font-semibold text-slate-200";

export function ProfileEditForm({
  profile,
  userEmail,
  errorMessage,
}: Props) {
  // ─── Task 3: Cascading dropdowns ──────────────────────────────────────
  const [selectedCollege, setSelectedCollege] = React.useState(
    profile?.college ?? "",
  );
  const [selectedProgram, setSelectedProgram] = React.useState(
    profile?.program ?? "",
  );
  const [selectedMajor, setSelectedMajor] = React.useState(
    profile?.major ?? "",
  );

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

  // ─── Task 5: Profile picture upload with preview ───────────────────────
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    profile?.profile_picture_url ?? null,
  );
  const [removePicture, setRemovePicture] = React.useState(false);
  const [pictureError, setPictureError] = React.useState<string | null>(null);
  const [dobError, setDobError] = React.useState<string | null>(null);
  const [dobValue, setDobValue] = React.useState(
    profile?.date_of_birth ? profile.date_of_birth.split("T")[0] : "",
  );
  const [isUploading] = React.useState(false); // visual feedback
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const objectUrlRef = React.useRef<string | null>(null);

  // Cleanup object URL on unmount
  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPictureError(null);
    const file = e.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setPictureError(
        `Only ${ALLOWED_IMAGE_TYPES_LABEL} files are accepted. "${file.name}" is not a supported type.`,
      );
      e.target.value = "";
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setPictureError(
        `Image must be 1 MB or less. Your file is ${formatBytes(file.size)}.`,
      );
      e.target.value = "";
      return;
    }

    // Revoke previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
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
    setPictureError(null);
    setRemovePicture(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Profile picture section ── */}
      <div className="mb-6 flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Preview */}
          <div className="relative">
            {previewUrl ? (
              <div className="relative size-[72px] overflow-hidden rounded-full border border-white/20">
                <Image
                  src={previewUrl}
                  alt="Profile picture preview"
                  fill
                  className="object-cover"
                  sizes="72px"
                  unoptimized={previewUrl.startsWith("blob:")}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Loader2
                      className="size-6 animate-spin text-white"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex size-[72px] items-center justify-center rounded-full border border-dashed border-white/20 bg-slate-900 text-slate-400">
                <Camera className="size-7" aria-hidden="true" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white">Profile picture</p>
            <p className="mt-1 text-sm text-slate-500">
              {ALLOWED_IMAGE_TYPES_LABEL}. Maximum file size is 1 MB.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            type="hidden"
            name="remove_profile_picture"
            value={removePicture ? "1" : "0"}
          />
          <label
            id="change-picture-btn"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 border border-white/15 px-4 text-sm font-semibold text-white transition hover:border-blue-300/40 hover:text-blue-100"
          >
            <Upload className="size-4" aria-hidden="true" />
            Change Picture
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
              id="remove-picture-btn"
              onClick={handleRemovePicture}
              className="inline-flex h-11 items-center justify-center gap-2 border border-red-400/20 px-4 text-sm font-semibold text-red-300 transition hover:border-red-400/50 hover:text-red-200"
              aria-label="Remove profile picture"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Picture error */}
      {pictureError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100"
        >
          <X className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {pictureError}
        </div>
      )}

      {/* Server error from redirect */}
      {errorMessage && (
        <p className="mb-5 border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
          {errorMessage}
        </p>
      )}

      {/* ── Form fields ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* MSC ID */}
        <label className={labelCls}>
          <span className={spanCls}>MSC ID Code</span>
          <input
            name="msc_id_code"
            defaultValue={profile?.msc_id_code ?? ""}
            className={inputCls}
          />
        </label>

        {/* School ID */}
        <label className={labelCls}>
          <span className={spanCls}>School ID Code</span>
          <input
            name="school_id_code"
            defaultValue={profile?.school_id_code ?? ""}
            className={inputCls}
          />
        </label>

        {/* Last Name */}
        <label className={labelCls}>
          <span className={spanCls}>Last Name</span>
          <input
            name="last_name"
            defaultValue={profile?.last_name ?? ""}
            className={inputCls}
          />
        </label>

        {/* First Name */}
        <label className={labelCls}>
          <span className={spanCls}>First Name</span>
          <input
            name="first_name"
            defaultValue={profile?.first_name ?? ""}
            className={inputCls}
          />
        </label>

        {/* Middle Name */}
        <label className={labelCls}>
          <span className={spanCls}>Middle Name</span>
          <input
            name="middle_name"
            defaultValue={profile?.middle_name ?? ""}
            className={inputCls}
          />
        </label>

        {/* Extension */}
        <label className={labelCls}>
          <span className={spanCls}>Extension (Jr., III, etc.)</span>
          <input
            name="extension"
            defaultValue={profile?.extension ?? ""}
            placeholder="e.g. Jr."
            className={inputCls}
          />
        </label>

        {/* ── Task 3: College dropdown ── */}
        <label className={labelCls}>
          <span className={spanCls}>College</span>
          <select
            name="college"
            value={selectedCollege}
            onChange={handleCollegeChange}
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

        {/* ── Task 3: Program dropdown (cascades from College) ── */}
        <label className={labelCls}>
          <span className={spanCls}>Program</span>
          <select
            name="program"
            value={selectedProgram}
            onChange={handleProgramChange}
            disabled={!selectedCollege}
            className={selectCls}
          >
            <option value="">
              {selectedCollege ? "— Select program —" : "— Select college first —"}
            </option>
            {availablePrograms.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        {/* ── Task 3: Major dropdown (cascades from Program) ── */}
        <label className={labelCls}>
          <span className={spanCls}>Major</span>
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
              {/* Hidden input to submit empty string when no majors */}
              <input type="hidden" name="major" value="" />
              <div className="mt-2 flex h-12 items-center rounded-md border border-white/10 bg-black/50 px-4 text-sm text-slate-500">
                {selectedProgram
                  ? "No majors for this program"
                  : "— Select program first —"}
              </div>
            </>
          )}
        </label>

        {/* ── Task 3: Year Level dropdown ── */}
        <label className={labelCls}>
          <span className={spanCls}>Year Level</span>
          <select
            name="year_level"
            defaultValue={profile?.year_level ?? ""}
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

        {/* Section */}
        <label className={labelCls}>
          <span className={spanCls}>Section</span>
          <input
            name="section"
            defaultValue={profile?.section ?? ""}
            className={inputCls}
          />
        </label>

        {/* Phone */}
        <label className={labelCls}>
          <span className={spanCls}>Contact Number</span>
          <input
            name="phone"
            type="tel"
            defaultValue={profile?.phone ?? ""}
            className={inputCls}
          />
        </label>

        {/* Personal Email */}
        <label className={labelCls}>
          <span className={spanCls}>Personal Email</span>
          <input
            name="personal_email"
            type="email"
            defaultValue={profile?.personal_email ?? userEmail ?? ""}
            className={inputCls}
          />
        </label>

        {/* BulSU Email */}
        <label className={labelCls}>
          <span className={spanCls}>BulSU Email</span>
          <input
            name="bulsu_email"
            type="email"
            defaultValue={profile?.bulsu_email ?? ""}
            placeholder="you@bulsu.edu.ph"
            className={inputCls}
          />
        </label>

        {/* Facebook */}
        <label className={labelCls}>
          <span className={spanCls}>Facebook Profile Link</span>
          <input
            name="social_media_url"
            type="url"
            defaultValue={profile?.social_media_url ?? ""}
            placeholder="https://facebook.com/yourname"
            className={inputCls}
          />
        </label>

        {/* Address */}
        <label className={`${labelCls} sm:col-span-2 lg:col-span-3`}>
          <span className={spanCls}>Current Address</span>
          <input
            name="address"
            defaultValue={profile?.address ?? ""}
            className={inputCls}
          />
        </label>

        {/* ── Task 4: Birthdate date picker ── */}
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
            aria-describedby="dob-hint"
          />
          {dobError ? (
            <span
              role="alert"
              className="mt-1 block text-xs font-semibold text-red-400"
            >
              {dobError}
            </span>
          ) : (
            <span
              id="dob-hint"
              className="mt-1 block text-xs text-slate-500"
            >
              Must be between {MIN_DATE.getFullYear()} and{" "}
              {MAX_DATE.getFullYear()} (minimum age: 14).
            </span>
          )}
        </label>

        {/* ── Task 3: Gender dropdown ── */}
        <label className={labelCls}>
          <span className={spanCls}>Gender</span>
          <select
            name="gender"
            defaultValue={profile?.gender ?? ""}
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

        {/* ── Guardian information ── */}
        <label className={labelCls}>
          <span className={spanCls}>Name of Guardian</span>
          <input
            name="guardian_name"
            defaultValue={profile?.guardian_name ?? ""}
            className={inputCls}
          />
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Relationship to Guardian</span>
          <input
            name="guardian_relationship"
            defaultValue={profile?.guardian_relationship ?? ""}
            className={inputCls}
          />
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Guardian Contact Number</span>
          <input
            name="guardian_phone"
            type="tel"
            defaultValue={profile?.guardian_phone ?? ""}
            className={inputCls}
          />
        </label>

        <label className={`${labelCls} sm:col-span-2 lg:col-span-3`}>
          <span className={spanCls}>Guardian Address</span>
          <input
            name="guardian_address"
            defaultValue={profile?.guardian_address ?? ""}
            className={inputCls}
          />
        </label>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          id="save-profile-btn"
          className="inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
        >
          Save Profile
        </button>
        <button
          type="reset"
          id="reset-profile-btn"
          className="inline-flex h-11 items-center justify-center border border-white/15 px-5 text-sm font-semibold text-white transition hover:border-blue-300/40 hover:text-blue-100"
        >
          Reset
        </button>
      </div>
    </>
  );
}
