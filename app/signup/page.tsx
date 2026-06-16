import { UserPlus } from "lucide-react";

import { SignupForm } from "@/components/auth/signup-form";
import { PublicPageShell } from "@/components/layout/public-page-shell";

export default function SignUpPage() {
  return (
    <PublicPageShell
      eyebrow="Join the organization"
      title="Create your member account"
      description="Register a member account with Supabase Auth. Profile completion will be expanded in the member profile phase."
    >
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <UserPlus className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Member registration
                </h2>
                <p className="text-sm text-slate-500">
                  Start with your basic account details.
                </p>
              </div>
            </div>
            <SignupForm />
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
