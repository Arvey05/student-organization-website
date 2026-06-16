import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;

const variants = {
  primary:
    "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/20",
  secondary:
    "border border-slate-200 bg-white/80 text-slate-950 shadow-sm backdrop-blur hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/80",
  ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
