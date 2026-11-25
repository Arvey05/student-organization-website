// Interprets the URL Supabase redirects to after a verification email link.
//
// Supabase reports failures in the URL *fragment* (#error=...&error_code=...)
// for most flows and in the query string for others, and a successful PKCE
// verification arrives as ?code=... (or #access_token=... for the implicit flow).
// The account is confirmed by Supabase before this redirect, so a visitor who
// opens the link on another device or browser has still verified successfully.
// No Next.js or `@/` imports: this is unit tested directly with Node.

export type VerificationResult =
  | "confirmed"
  | "already_confirmed"
  | "expired"
  | "invalid"
  | "resend"
  | "unknown";

function readParams(search: string, hash: string): URLSearchParams {
  const merged = new URLSearchParams(search.replace(/^\?/, ""));

  for (const [key, value] of new URLSearchParams(hash.replace(/^#/, ""))) {
    if (!merged.has(key)) merged.set(key, value);
  }

  return merged;
}

export function parseVerificationResult(
  search: string,
  hash: string,
): VerificationResult {
  const params = readParams(search, hash);

  if (params.get("resend") === "1") return "resend";

  const errorCode = (params.get("error_code") ?? "").toLowerCase();
  const description = (
    params.get("error_description") ?? ""
  ).toLowerCase();

  if (errorCode || params.has("error")) {
    if (
      errorCode === "email_exists" ||
      errorCode === "user_already_exists" ||
      description.includes("already confirmed") ||
      description.includes("already registered")
    ) {
      return "already_confirmed";
    }

    if (errorCode === "otp_expired" || description.includes("expired")) {
      return "expired";
    }

    return "invalid";
  }

  if (
    params.has("code") ||
    params.has("access_token") ||
    params.has("token_hash") ||
    params.get("type") === "signup"
  ) {
    return "confirmed";
  }

  // Someone opened /email-confirmed directly. Claiming success would mislead.
  return "unknown";
}
