import { changePassword } from "@/app/member/actions";
import { MemberPageHeader } from "@/components/member/page-header";

export default function ChangePasswordPage() {
  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <MemberPageHeader
          eyebrow="Password"
          title="Change password"
          description="Enter and confirm a new password for your member account."
        />

        <form
          action={changePassword}
          className="mt-8 border-y border-white/10 bg-[#02040a] p-6"
        >
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
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">
              New Password
            </span>
            <input
              name="new_password"
              type="password"
              required
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
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-blue-500 px-5 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Change Password
          </button>
        </form>
      </div>
    </main>
  );
}
