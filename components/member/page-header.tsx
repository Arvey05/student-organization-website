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
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}
