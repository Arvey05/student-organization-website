"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ensureMemberProfile } from "@/lib/member/ensure-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  validateCollegeProgramMajor,
  VALID_YEAR_LEVEL_VALUES,
  VALID_GENDER_VALUES,
} from "@/lib/member/colleges";

type AuthResult = {
  error?: string;
};

/**
 * The origin the visitor is actually on, so the confirmation link always returns
 * to the same deployment. A fixed NEXT_PUBLIC_SITE_URL that is missing or still
 * points at localhost in production sends people to a dead page.
 */
async function getRequestOrigin(): Promise<string> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (host) {
    const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
    const protocol =
      requestHeaders.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function login(
  _previousState: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { error: profileError } = await ensureMemberProfile(
      supabase,
      data.user,
      { email },
    );

    if (profileError) {
      return {
        error: `Signed in, but profile setup failed: ${profileError.message}`,
      };
    }
  }

  redirect("/dashboard");
}

export async function signup(
  _previousState: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const firstName = getString(formData, "firstName");
  const lastName = getString(formData, "lastName");
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return { error: "First name, last name, email, and password are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  // ─── Task 3: Server-side validation of registration dropdowns ──────────
  const college = getString(formData, "college");
  const program = getString(formData, "program");
  const major = getString(formData, "major");
  const yearLevel = getString(formData, "year_level");
  const gender = getString(formData, "gender");

  const cpmError = validateCollegeProgramMajor(
    college || null,
    program || null,
    major || null,
  );
  if (cpmError) {
    return { error: cpmError };
  }

  if (yearLevel && !VALID_YEAR_LEVEL_VALUES.has(yearLevel)) {
    return { error: "Invalid year level selected." };
  }

  if (gender && !VALID_GENDER_VALUES.has(gender)) {
    return { error: "Invalid gender selected." };
  }

  const supabase = await createSupabaseServerClient();

  // Everyone registers as a regular member. Executive Board access is never
  // requested here: an administrator approves the person's email on the roster,
  // and the database grants the role once that email is verified.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        college: college || null,
        program: program || null,
        major: major || null,
        year_level: yearLevel || null,
        gender: gender || null,
      },
      // Redirect to the email-confirmed page after the user clicks the link
      emailRedirectTo: `${await getRequestOrigin()}/email-confirmed`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user && data.session) {
    const { error: profileError } = await ensureMemberProfile(
      supabase,
      data.user,
      {
        firstName,
        lastName,
        email,
        college: college || null,
        program: program || null,
        major: major || null,
        yearLevel: yearLevel || null,
        gender: gender || null,
      },
    );

    if (profileError) {
      return {
        error: `Account created, but profile setup failed: ${profileError.message}`,
      };
    }

    // Session exists = email confirmation is disabled in Supabase;
    // redirect straight to dashboard.
    redirect("/dashboard");
  }

  // No session = email confirmation is required.
  // Redirect to signup page with a confirmation message.
  redirect("/signup?email_sent=1");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
