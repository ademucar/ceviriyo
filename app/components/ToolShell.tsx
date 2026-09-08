type Props = {
  title: string;
  accent?: string;
  subtitle: string;
  steps?: string[];
  current?: number;
  children: React.ReactNode;
};

export default function ToolShell({
  title,
  accent,
  subtitle,
  steps,
  current = 1,
  children,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="ornament mb-4">
        <span aria-hidden="true">&#9670;</span>
      </div>

      <header className="text-center">
        <h1 className="display text-[clamp(1.5rem,6vmin,2.3rem)] leading-[1.1]">
          {title} {accent && <span className="text-[var(--accent)]">{accent}</span>}
        </h1>
        <p className="mt-2 text-[clamp(0.8rem,2.5vmin,0.95rem)] text-[var(--ink-dim)]">
          {subtitle}
        </p>
      </header>

      <div className="ornament mt-4 mb-6">
        <span aria-hidden="true">&#9670;</span>
      </div>

      {steps && (
        <ol className="mb-5 flex flex-wrap justify-center gap-x-6 gap-y-1.5">
          {steps.map((s, i) => {
            const done = i + 1 <= current;
            return (
              <li
                key={s}
                className={`label ${done ? "text-[var(--ink)]" : "text-[var(--ink-faint)]"}`}
              >
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="mx-1.5 text-[var(--rule-2)]">&mdash;</span>
                {s}
                {done && <span className="ml-1.5 text-[var(--accent)]">&#9670;</span>}
              </li>
            );
          })}
        </ol>
      )}

      <div className="sheet">
        <p className="band">Ayarlar</p>
        <div className="p-[clamp(0.9rem,3.5vmin,1.75rem)]">{children}</div>
      </div>
    </div>
  );
}
