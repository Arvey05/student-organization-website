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
    "bg-blue-500 text-white shadow-[0_0_22px_rgba(37,99,235,0.28)] hover:bg-blue-400",
  secondary:
    "border border-white/15 bg-white/[0.06] text-white hover:border-blue-300/40",
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
      className={`inline-flex min-h-11 items-center justify-center px-5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
