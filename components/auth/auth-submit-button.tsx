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
      className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
    >
      {pending ? pendingText : children}
    </button>
  );
}
