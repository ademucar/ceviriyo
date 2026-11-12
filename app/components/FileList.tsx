"use client";
import { formatBytes } from "@/app/lib/format";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  /** Sıranın ne anlama geldiğini anlatan tek satır, ör: "PDF'ler bu sırayla birleşir." */
  aciklama?: string;
};

export default function FileList({ files, onChange, aciklama }: Props) {
  if (files.length === 0) return null;

  function tasi(i: number, yon: -1 | 1) {
    const j = i + yon;
    if (j < 0 || j >= files.length) return;
    const kopya = [...files];
    [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
    onChange(kopya);
  }

  function sil(i: number) {
    onChange(files.filter((_, k) => k !== i));
  }

  function adaGoreSirala() {
    // numeric: "sayfa2" -> "sayfa10"dan önce gelsin
    onChange(
      [...files].sort((a, b) => a.name.localeCompare(b.name, "tr", { numeric: true }))
    );
  }

  const btn =
    "chip btn-3d inline-flex h-9 w-9 items-center justify-center border border-[var(--rule-2)] bg-[var(--paper-3)] text-[var(--ink-dim)] hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:opacity-35 disabled:hover:border-[var(--rule-2)] disabled:hover:text-[var(--ink-dim)]";

  return (
    <div className="mt-5 border border-[var(--rule)]">
      <div className="flex items-center justify-between gap-2">
        <p className="band">Sıra</p>
        {files.length > 1 && (
          <button
            type="button"
            onClick={adaGoreSirala}
            className="label btn-3d mr-2 inline-flex min-h-[32px] items-center border border-[var(--rule-2)] bg-[var(--paper-3)] px-2 text-[var(--ink-dim)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
          >
            Ada göre sırala
          </button>
        )}
      </div>

      <ul>
        {files.map((f, i) => (
          <li key={`${f.name}-${f.size}-${f.lastModified}-${i}`} className="row flex items-center gap-2 px-3 py-2">
            <span className="label w-6 shrink-0 tabular-nums text-[var(--ink-dim)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-[var(--ink)]">{f.name}</span>
              <span className="block text-[11px] text-[var(--ink-dim)]">{formatBytes(f.size)}</span>
            </span>
            <span className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => tasi(i, -1)}
                disabled={i === 0}
                aria-label={`${f.name} dosyasını yukarı taşı`}
                className={btn}
              >
                &#9650;
              </button>
              <button
                type="button"
                onClick={() => tasi(i, 1)}
                disabled={i === files.length - 1}
                aria-label={`${f.name} dosyasını aşağı taşı`}
                className={btn}
              >
                &#9660;
              </button>
              <button
                type="button"
                onClick={() => sil(i)}
                aria-label={`${f.name} dosyasını listeden çıkar`}
                className={btn}
              >
                &#10005;
              </button>
            </span>
          </li>
        ))}
      </ul>

      {aciklama && (
        <div className="row px-3 py-2">
          <p className="text-[11px] text-[var(--ink-dim)]">{aciklama}</p>
        </div>
      )}
    </div>
  );
}
