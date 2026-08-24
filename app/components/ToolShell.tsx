type Props = {
  title: string;
  accent?: string;
  subtitle: string;
  steps?: string[];
  current?: number;
  /** Terminal başlığında görünen komut yolu, ör: gorsel/donustur */
  cmd?: string;
  children: React.ReactNode;
};

export default function ToolShell({
  title,
  accent,
  subtitle,
  steps,
  current = 1,
  cmd,
  children,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* pencere başlığı */}
      <div className="frame flex items-center justify-between px-3 py-2">
        <span className="text-[11px] text-[var(--fg-faint)]">
          ceviriyo{cmd ? ` ~ ${cmd}` : ""}
        </span>
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 border border-[var(--line-2)]" />
          <span className="h-2 w-2 border border-[var(--line-2)]" />
          <span className="h-2 w-2 border border-[var(--accent)]" />
        </span>
      </div>

      {/* gövde */}
      <div className="frame border-t-0 p-[clamp(0.9rem,3.5vmin,1.75rem)]">
        <h1 className="text-[clamp(1.15rem,4.4vmin,1.6rem)] font-bold leading-tight tracking-tight text-[var(--fg)]">
          {title}{" "}
          {accent && <span className="text-[var(--accent)]">{accent}</span>}
        </h1>
        <p className="mt-1.5 text-[clamp(0.75rem,2.4vmin,0.85rem)] text-[var(--fg-dim)]">
          {subtitle}
        </p>

        <hr className="rule my-5" />

        {steps && (
          <ol className="mb-5 flex flex-wrap gap-x-5 gap-y-1.5">
            {steps.map((s, i) => {
              const done = i + 1 <= current;
              return (
                <li
                  key={s}
                  className={`text-xs ${done ? "text-[var(--accent)]" : "text-[var(--fg-faint)]"}`}
                >
                  <span className="tabular-nums">[{i + 1}]</span> {s}
                </li>
              );
            })}
          </ol>
        )}

        {children}
      </div>
    </div>
  );
}
