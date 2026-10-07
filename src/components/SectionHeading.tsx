type Props = {
  index: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  id?: string;
};

// Section number in a slanted red block: the repeated identity motif from the logo.
export default function SectionHeading({ index, title, intro, tone = "light", id }: Props) {
  const dark = tone === "dark";
  return (
    <div className="max-w-2xl">
      <span className="skew-tag bg-sas-red px-2.5 py-0.5" aria-hidden="true">
        <span className="font-heading text-base font-bold text-white tabular-nums">{index}</span>
      </span>
      <h2 id={id} className={`display mt-4 text-4xl sm:text-5xl ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg ${dark ? "text-white/85" : "text-ink-soft"}`}>{intro}</p>}
    </div>
  );
}

export function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-sm border border-dashed border-ink-soft px-1.5 font-mono text-[0.9em] text-ink-soft">
      {children}
    </span>
  );
}
