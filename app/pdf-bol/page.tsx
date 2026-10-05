"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import ToolShell from "@/app/components/ToolShell";
import Dropzone from "@/app/components/Dropzone";
import PrimaryButton from "@/app/components/PrimaryButton";
import { downloadBlob } from "@/app/lib/download";

type Mode = "perPart" | "partCount";

/** Sayfa aralıklarını hesaplar: [[başlangıç, bitiş], ...] (0 tabanlı, bitiş dahil) */
function buildRanges(total: number, mode: Mode, n: number): [number, number][] {
  if (!Number.isFinite(n) || n < 1 || total < 1) return [];
  const per = mode === "perPart" ? n : Math.ceil(total / Math.min(n, total));
  if (per < 1) return [];
  const out: [number, number][] = [];
  for (let i = 0; i < total; i += per) out.push([i, Math.min(i + per, total) - 1]);
  return out;
}

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [reading, setReading] = useState(false);
  const [mode, setMode] = useState<Mode>("perPart");
  const [value, setValue] = useState("10");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  async function handleFiles(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    setPageCount(0);
    setError("");
    if (!next) return;
    setReading(true);
    try {
      const doc = await PDFDocument.load(await next.arrayBuffer());
      setPageCount(doc.getPageCount());
    } catch {
      setError("PDF açılamadı. Dosya bozuk veya şifreli/korumalı olabilir.");
      setFile(null);
    } finally {
      setReading(false);
    }
  }

  const n = parseInt(value, 10);
  const ranges = buildRanges(pageCount, mode, n);

  async function handleRun() {
    if (!file || pageCount === 0) return;
    if (ranges.length === 0) {
      setError("Geçerli bir sayı girin.");
      return;
    }
    if (ranges.length === 1) {
      setError("Bu ayarla tek parça çıkıyor; bölmeye gerek yok.");
      return;
    }
    setLoading(true);
    setError("");
    setProgress("");
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const base = file.name.replace(/\.[^.]+$/, "");
      const zip = new JSZip();
      const pad = String(ranges.length).length;

      for (let i = 0; i < ranges.length; i++) {
        setProgress(`Parça ${i + 1} / ${ranges.length}`);
        const [from, to] = ranges[i];
        const out = await PDFDocument.create();
        const indices = Array.from({ length: to - from + 1 }, (_, k) => from + k);
        const copied = await out.copyPages(src, indices);
        copied.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        const ad = `${base}-${String(i + 1).padStart(pad, "0")}_sayfa-${from + 1}-${to + 1}.pdf`;
        zip.file(ad, bytes);
      }

      setProgress("ZIP hazırlanıyor...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${base}-parcalar.zip`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
      setProgress("");
    }
  }

  const onlyDigits = (v: string) => v.replace(/[^\d]/g, "");
  const presets = mode === "perPart" ? [1, 5, 10, 25, 50] : [2, 3, 4, 5];

  return (
    <ToolShell
      title="PDF"
      accent="Böl"
      subtitle="PDF dosyasını belirlediğiniz sayfa sayısına göre parçalara ayırın."
      steps={["Dosya Seç", "Ayarla", "Böl"]}
      current={ranges.length > 1 ? 3 : file ? 2 : 1}
    >
      <Dropzone accept="application/pdf" files={file ? [file] : []} onFiles={handleFiles} />

      {reading && <p className="mt-4 text-xs text-[var(--ink-dim)]">PDF okunuyor...</p>}

      {pageCount > 0 && (
        <>
          <div className="mt-5 space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMode("perPart")}
                className={`label btn-3d min-h-[44px] flex-1 border py-2 ${
                  mode === "perPart"
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--rule-2)] text-[var(--ink-dim)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                }`}
              >
                Parça başına sayfa
              </button>
              <button
                onClick={() => setMode("partCount")}
                className={`label btn-3d min-h-[44px] flex-1 border py-2 ${
                  mode === "partCount"
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--rule-2)] text-[var(--ink-dim)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                }`}
              >
                Toplam parça sayısı
              </button>
            </div>

            <div>
              <label htmlFor="bolme-sayisi" className="label mb-2 block">
                {mode === "perPart" ? "Her parçada kaç sayfa" : "Kaç parçaya bölünsün"}
              </label>
              <input
                id="bolme-sayisi"
                value={value}
                onChange={(e) => setValue(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder={mode === "perPart" ? "örn: 10" : "örn: 3"}
                className="field"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setValue(String(p))}
                  className="chip btn-3d inline-flex items-center justify-center border border-[var(--rule-2)] bg-[var(--paper-3)] px-2 py-1 text-[11px] text-[var(--ink-dim)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 border border-[var(--rule)]">
            <p className="band">Önizleme</p>
            <div className="row flex items-center justify-between gap-3 px-3 py-1.5">
              <span className="label diamond">Belge</span>
              <span className="text-sm text-[var(--ink)]">{pageCount} sayfa</span>
            </div>
            <div className="row flex items-center justify-between gap-3 px-3 py-1.5">
              <span className="label diamond">Sonuç</span>
              <span className="text-sm text-[var(--ink)]">
                {ranges.length > 0 ? `${ranges.length} parça` : "—"}
              </span>
            </div>
            {ranges.length > 0 && (
              <div className="row px-3 py-2">
                <p className="text-xs leading-relaxed text-[var(--ink-dim)]">
                  {ranges.slice(0, 8).map(([a, b], i) => (
                    <span key={i} className="mr-2 inline-block whitespace-nowrap">
                      {a === b ? `s.${a + 1}` : `s.${a + 1}–${b + 1}`}
                    </span>
                  ))}
                  {ranges.length > 8 && <span>... +{ranges.length - 8} parça</span>}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <PrimaryButton onClick={handleRun} disabled={!file || pageCount === 0 || loading}>
        {loading ? progress || "Bölünüyor..." : "Böl"}
      </PrimaryButton>
      {pageCount > 0 && ranges.length > 1 && !loading && (
        <p className="mt-3 text-center text-[11px] text-[var(--ink-faint)]">
          Parçalar tek bir ZIP dosyası olarak inecek.
        </p>
      )}
      {error && <p className="mt-4 text-xs text-[var(--accent)]">{error}</p>}
    </ToolShell>
  );
}
