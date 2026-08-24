import { formatBytes } from "@/app/lib/format";
import type { RenderResult } from "@/app/lib/image";

type Props = {
  originalSize: number;
  result: RenderResult | null;
  busy: boolean;
};

export default function ResultBar({ originalSize, result, busy }: Props) {
  const change = result ? 1 - result.blob.size / originalSize : 0;
  const pct = Math.round(change * 100);

  return (
    <div className="mt-5 border border-[var(--line)] bg-[var(--bg)] p-3 text-xs">
      {busy || !result ? (
        <p className="text-[var(--fg-dim)]">
          <span className="text-[var(--accent)]">::</span> hesaplaniyor
          <span className="caret" />
        </p>
      ) : (
        <div className="space-y-1">
          {result.reduced && (
            <p className="text-[var(--warn)]">
              <span className="text-[var(--fg-faint)]">!!</span> gorsel bu cihaz icin cok buyuktu,
              kucultulerek islendi
            </p>
          )}
          <p className="text-[var(--fg-dim)]">
            <span className="text-[var(--accent)]">::</span> {formatBytes(originalSize)}
            <span className="mx-1.5 text-[var(--line-2)]">-&gt;</span>
            <span className="text-[var(--fg)]">{formatBytes(result.blob.size)}</span>
            <span className="ml-2 text-[var(--fg-faint)]">
              {result.width}x{result.height}
            </span>
          </p>
          <p className={pct === 0 ? "text-[var(--fg-faint)]" : pct > 0 ? "text-[var(--accent)]" : "text-[var(--warn)]"}>
            <span className="text-[var(--fg-faint)]">::</span>{" "}
            {pct === 0 ? "boyut ayni" : pct > 0 ? `%${pct} kucudu` : `%${Math.abs(pct)} buyudu`}
          </p>
        </div>
      )}
    </div>
  );
}
