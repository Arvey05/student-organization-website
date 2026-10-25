"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertTriangle, Clock, RefreshCw } from "lucide-react";

const RESEND_COOLDOWN_SECONDS = 60;

export function EmailConfirmedContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");
  const isResend = searchParams.get("resend") === "1";

  // Determine state based on URL params that Supabase appends on error
  // Supabase redirects here on success with no error params
  // On expired link: error_code=otp_expired
  // On already confirmed: error_code=email_exists or similar
  const isExpired =
    errorCode === "otp_expired" ||
    (errorDescription ?? "").toLowerCase().includes("expired");
  const isAlreadyConfirmed =
    errorCode === "email_exists" ||
    errorCode === "user_already_exists" ||
    (errorDescription ?? "").toLowerCase().includes("already confirmed") ||
    (errorDescription ?? "").toLowerCase().includes("already registered");
  const isError = Boolean(errorCode);
  const isSuccess = !isError && !isResend;

  const [resendEmail, setResendEmail] = React.useState("");
  const [resendStatus, setResendStatus] = React.useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [cooldownRemaining, setCooldownRemaining] = React.useState(0);

  function startCooldown() {
    setCooldownRemaining(RESEND_COOLDOWN_SECONDS);
  }

  React.useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (!resendEmail || cooldownRemaining > 0) return;

    setResendStatus("sending");
    try {
      const { createSupabaseBrowserClient } = await import(
        "@/lib/supabase/browser"
      );
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: resendEmail,
        options: { emailRedirectTo: `${window.location.origin}/email-confirmed` },
      });
      if (error) {
        setResendStatus("error");
      } else {
        setResendStatus("sent");
        startCooldown();
      }
    } catch {
      setResendStatus("error");
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center bg-emerald-500/15">
          <CheckCircle
            className="size-8 text-emerald-300"
            aria-hidden="true"
          />
        </div>
        <h1 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Email confirmed!
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          Your BulSU MSC account has been verified. You can now log in and
          access the member portal.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            id="continue-to-login"
            className="inline-flex h-12 items-center justify-center bg-white px-8 text-sm font-black text-slate-950 transition hover:bg-blue-100"
          >
            Continue to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isAlreadyConfirmed) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center bg-blue-500/15">
          <CheckCircle className="size-8 text-blue-300" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Already confirmed
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          Your email has already been confirmed. You can log in to your BulSU
          MSC member account now.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            id="go-to-login-already-confirmed"
            className="inline-flex h-12 items-center justify-center bg-white px-8 text-sm font-black text-slate-950 transition hover:bg-blue-100"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Expired or invalid link
  return (
    <div>
      <div className="mx-auto flex size-16 items-center justify-center bg-amber-500/15">
        {isResend ? (
          <RefreshCw className="size-8 text-blue-300" aria-hidden="true" />
        ) : isExpired ? (
          <Clock className="size-8 text-amber-300" aria-hidden="true" />
        ) : (
          <AlertTriangle className="size-8 text-amber-300" aria-hidden="true" />
        )}
      </div>
      <h1 className="mt-6 text-center text-3xl font-black tracking-tight text-white sm:text-4xl">
        {isResend ? "Verify your email" : isExpired ? "Link expired" : "Invalid link"}
      </h1>
      <p className="mt-4 text-center text-base leading-8 text-slate-300">
        {isResend
          ? "Enter your account email below to request a verification link. Executive Board members must verify their roster email before creating events."
          : isExpired
          ? "This verification link has expired. Verification links are only valid for a short time. Request a new one below."
          : "This verification link is invalid or has already been used. Request a new one below."}
      </p>

      <div className="mt-8 border border-white/10 bg-black/20 p-6">
        <p className="text-sm font-semibold text-slate-200">
          Resend verification email
        </p>
        <form
          onSubmit={handleResend}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          id="resend-verification-form"
        >
          <label className="sr-only" htmlFor="resend-email">
            Email address
          </label>
          <input
            id="resend-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Enter your registration email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            className="h-12 flex-1 rounded-md border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-300/60"
          />
          <button
            id="resend-verification-btn"
            type="submit"
            disabled={resendStatus === "sending" || cooldownRemaining > 0}
            className="inline-flex h-12 items-center justify-center gap-2 border border-white/15 px-5 text-sm font-semibold text-white transition hover:border-blue-300/40 hover:text-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`size-4 ${resendStatus === "sending" ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {cooldownRemaining > 0
              ? `Resend in ${cooldownRemaining}s`
              : resendStatus === "sending"
                ? "Sending…"
                : "Resend Email"}
          </button>
        </form>

        {resendStatus === "sent" && (
          <p className="mt-3 text-sm text-emerald-300">
            Verification email sent! Check your inbox (and spam folder).
          </p>
        )}
        {resendStatus === "error" && (
          <p className="mt-3 text-sm text-red-300">
            Failed to resend the email. Please try again or contact support.
          </p>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already confirmed?{" "}
        <Link href="/login" className="font-semibold text-blue-200">
          Log in here
        </Link>
      </p>
    </div>
  );
}
