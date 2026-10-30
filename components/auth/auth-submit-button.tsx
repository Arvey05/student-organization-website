"use client";

import { useFormStatus } from "react-dom";

type AuthSubmitButtonProps = {
  children: string;
  pendingText: string;
};

export function AuthSubmitButton({
  children,
  pendingText,
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="msc-btn-primary mt-6 w-full h-12 text-sm tracking-wider uppercase transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
    >
      {pending ? pendingText : children}
    </button>
  );
}
