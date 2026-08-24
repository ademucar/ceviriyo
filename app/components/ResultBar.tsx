import { formatBytes } from "@/app/lib/format";
import type { RenderResult } from "@/app/lib/image";

type Props = {
  originalSize: number;
  result: RenderResult | null;
  busy: boolean;
};

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="row flex items-center justify-between gap-3 px-3 py-1.5 last:border-b-0">
      <span className="label diamond">{k}</span>
      <span className="text-sm text-[var(--ink)]">{children}</span>
    </div>
  );
}

export default function ResultBar({ originalSize, result, busy }: Props) {
  const pct = result ? Math.round((1 - result.blob.size / originalSize) * 100) : 0;

  return (
    <div className="mt-5 border border-[var(--rule)]">
      <p className="band">Sonuç</p>
      {busy || !result ? (
        <div className="row px-3 py-1.5">
          <span className="label diamond">Hesaplanıyor</span>
        </div>
      ) : (
        <>
          {result.reduced && (
            <div className="row px-3 py-1.5">
              <span className="label diamond text-[var(--accent)]">
                Görsel bu cihaz için çok büyüktü, küçültülerek işlendi
              </span>
            </div>
          )}
          <Row k="Boyut">
            <span className="text-[var(--ink-dim)]">{formatBytes(originalSize)}</span>
            <span className="mx-2 text-[var(--rule-2)]">&rarr;</span>
            {formatBytes(result.blob.size)}
          </Row>
          <Row k="Ölçü">
            {result.width} &times; {result.height}
          </Row>
          <Row k="Değişim">
            <span className={pct === 0 ? "text-[var(--ink-dim)]" : "text-[var(--accent)]"}>
              {pct === 0 ? "Boyut aynı" : pct > 0 ? `%${pct} küçüldü` : `%${Math.abs(pct)} büyüdü`}
            </span>
          </Row>
        </>
      )}
    </div>
  );
}
