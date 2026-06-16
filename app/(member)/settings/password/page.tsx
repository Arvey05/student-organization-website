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
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              New Password
            </span>
            <input
              name="new_password"
              type="password"
              required
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              Confirm Password
            </span>
            <input
              name="confirm_password"
              type="password"
              required
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <button
            type="submit"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            Change Password
          </button>
        </form>
      </div>
    </main>
  );
}
