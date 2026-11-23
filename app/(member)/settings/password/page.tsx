import { changePassword } from "@/app/member/actions";
import { MemberPageHeader } from "@/components/member/page-header";

const ERROR_MESSAGES: Record<string, string> = {
  incorrect_old_password: "Your current password is incorrect.",
  password_too_short: "New password must be at least 8 characters long.",
  password_mismatch:
    "Please fill in all fields and make sure the new passwords match.",
  update_failed: "Unable to update your password. Please try again.",
};

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error
    ? (ERROR_MESSAGES[params.error] ?? null)
    : null;

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <MemberPageHeader
          eyebrow="Password"
          title="Change password"
          description="Enter your current password and confirm a new password for your member account."
        />

        <form
          action={changePassword}
          className="mt-8 border-y border-white/10 bg-[#02001f] p-6"
        >
          {errorMessage ? (
            <p
              role="alert"
              className="mb-5 border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100"
            >
              {errorMessage}
            </p>
          ) : null}
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">
              Old Password
            </span>
            <input
              name="old_password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-200">
              New Password
            </span>
            <input
              name="new_password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-200">
              Confirm Password
            </span>
            <input
              name="confirm_password"
              type="password"
              required
              autoComplete="new-password"
              className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-blue-300/60"
            />
          </label>
          <button
            type="submit"
            className="mt-6 inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
          >
            Change Password
          </button>
        </form>
      </div>
    </main>
  );
}
