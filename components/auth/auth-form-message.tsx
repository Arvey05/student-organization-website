"use client";

type AuthFormMessageProps = {
  message?: string;
};

export function AuthFormMessage({ message }: AuthFormMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-4 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100">
      {message}
    </p>
  );
}
