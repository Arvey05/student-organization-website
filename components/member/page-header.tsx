type MemberPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function MemberPageHeader({
  eyebrow,
  title,
  description,
}: MemberPageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-[#02001f] pb-7">
      <div className="brand-accent-line absolute inset-x-0 bottom-0 h-px opacity-65" />
      <p className="inline-flex rounded-full border border-blue-300/25 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-[0.04em] text-blue-100">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
        {description}
      </p>
    </div>
  );
}
