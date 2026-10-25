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
    "bg-blue-500 text-white shadow-[0_12px_30px_rgba(0,108,249,0.22)] hover:bg-blue-400",
  secondary:
    "border border-white/20 bg-white/[0.06] text-white hover:border-blue-300/60 hover:bg-white/[0.1]",
  ghost: "text-slate-300 hover:text-white",
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
      className={`brand-interactive inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
