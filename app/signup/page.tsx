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
      <section className="bg-slate-950 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/25 ring-1 ring-white/5 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-100 ring-1 ring-blue-300/20">
                <UserPlus className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Member registration
                </h2>
                <p className="text-sm text-slate-400">
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
