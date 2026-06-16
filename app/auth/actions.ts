"use server";

import { redirect } from "next/navigation";

import { ensureMemberProfile } from "@/lib/member/ensure-profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuthResult = {
  error?: string;
};

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
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user && data.session) {
    const { error: profileError } = await ensureMemberProfile(
      supabase,
      data.user,
      { firstName, lastName, email },
    );

    if (profileError) {
      return {
        error: `Account created, but profile setup failed: ${profileError.message}`,
      };
    }
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
