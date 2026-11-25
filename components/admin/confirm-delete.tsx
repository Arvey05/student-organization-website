import { Trash2 } from "lucide-react";

type ConfirmDeleteProps = {
  action: (formData: FormData) => Promise<void>;
  /** Hidden fields the action needs, e.g. { activity_id: "..." }. */
  fields: Record<string, string>;
  returnTo: string;
  name: string;
  noun: string;
};

/** Two-step delete that needs no client JavaScript: open, then confirm. */
export function ConfirmDelete({
  action,
  fields,
  returnTo,
  name,
  noun,
}: ConfirmDeleteProps) {
  return (
    <details className="group relative">
      <summary
        aria-label={`Delete ${name}`}
        className="inline-flex h-9 cursor-pointer list-none items-center gap-2 border border-white/15 px-3 text-xs font-semibold text-slate-200 transition hover:border-red-300/50 hover:text-red-200 [&::-webkit-details-marker]:hidden"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
        Delete
      </summary>
      <form
        action={action}
        className="absolute right-0 z-10 mt-2 w-72 border border-red-300/30 bg-[#0b0626] p-4 shadow-xl"
      >
        {Object.entries(fields).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <input type="hidden" name="return_to" value={returnTo} />
        <p className="text-sm leading-6 text-red-50">
          Delete <strong>{name}</strong>? It disappears from the {noun} list for
          everyone.
        </p>
        <button
          type="submit"
          className="mt-3 inline-flex h-10 w-full items-center justify-center bg-red-500 px-4 text-sm font-bold text-white transition hover:bg-red-400"
        >
          Yes, delete {noun}
        </button>
      </form>
    </details>
  );
}
