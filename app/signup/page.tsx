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
      <section className="relative overflow-hidden bg-[#02040a] py-20">
        <div className="absolute left-1/2 top-10 h-72 w-2/3 -translate-x-1/2 bg-blue-500/15 blur-3xl" />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="relative border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-blue-950/30">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center bg-blue-500/15 text-blue-100">
                <UserPlus className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">
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
