import { LogIn } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { PublicPageShell } from "@/components/layout/public-page-shell";

export default function LoginPage() {
  return (
    <PublicPageShell
      eyebrow="Member access"
      title="Log in to your member account"
      description="Use your registered email and password to access protected member pages."
    >
      <section className="bg-slate-950 py-16 sm:py-20">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/25 ring-1 ring-white/5 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-100 ring-1 ring-blue-300/20">
                <LogIn className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Welcome back
                </h2>
                <p className="text-sm text-slate-400">
                  Use your registered email address.
                </p>
              </div>
            </div>
            <LoginForm />
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
