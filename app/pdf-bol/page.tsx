"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import ToolShell from "@/app/components/ToolShell";
import Dropzone from "@/app/components/Dropzone";
import PrimaryButton from "@/app/components/PrimaryButton";
import ClearButton from "@/app/components/ClearButton";
import { downloadBlob } from "@/app/lib/download";

type Plan =
  | { ok: true; boylar: number[]; araliklar: [number, number][] }
  | { ok: false; mesaj: string; boylar: number[] };

/**
 * Parça boyutlarını hesaplar.
 * `girilen` içinde null olanlar "otomatik"tir; kalan sayfalar onlara eşit dağıtılır.
 */
function planla(toplam: number, girilen: (number | null)[]): Plan {
  const sabit = girilen.reduce<number>((a, v) => a + (v ?? 0), 0);
  const otoAdet = girilen.filter((v) => v === null).length;
  const kalan = toplam - sabit;

  if (girilen.some((v) => v !== null && v < 1)) {
    return { ok: false, mesaj: "Her parça en az 1 sayfa olmalı.", boylar: [] };
  }
  if (kalan < 0) {
    return {
      ok: false,
      mesaj: `Girdiğiniz sayfalar belgeyi aşıyor: ${sabit} / ${toplam}.`,
      boylar: [],
    };
  }
  if (otoAdet === 0 && kalan > 0) {
    return {
      ok: false,
      mesaj: `${kalan} sayfa artıyor. Bir parçayı boş bırakın ya da sayıları artırın.`,
      boylar: [],
    };
  }
  if (otoAdet > 0 && kalan < otoAdet) {
    return {
      ok: false,
      mesaj: `Geriye ${kalan} sayfa kaldı; ${otoAdet} otomatik parçaya yetmiyor.`,
      boylar: [],
    };
  }

  // Kalanı otomatik parçalara eşit dağıt (taban + artan)
  const taban = otoAdet > 0 ? Math.floor(kalan / otoAdet) : 0;
  const artan = otoAdet > 0 ? kalan % otoAdet : 0;
  let otoSira = 0;
  const boylar = girilen.map((v) => {
    if (v !== null) return v;
    const boy = taban + (otoSira < artan ? 1 : 0);
    otoSira++;
    return boy;
  });

  const araliklar: [number, number][] = [];
  let i = 0;
  for (const boy of boylar) {
    araliklar.push([i, i + boy - 1]);
    i += boy;
  }
  return { ok: true, boylar, araliklar };
}

const PARCA_HAZIR = [2, 3, 4, 5, 10];

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [reading, setReading] = useState(false);
  const [parcaSayisi, setParcaSayisi] = useState("2");
  const [boyutlar, setBoyutlar] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [herKac, setHerKac] = useState("");

  async function handleFiles(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    setPageCount(0);
    setError("");
    if (!next) return;
    setReading(true);
    try {
      const doc = await PDFDocument.load(await next.arrayBuffer());
      const n = doc.getPageCount();
      setPageCount(n);
      const bas = Math.min(2, Math.max(1, n));
      setParcaSayisi(String(bas));
      setBoyutlar(Array(bas).fill(""));
      setHerKac("");
    } catch {
      setError("PDF açılamadı. Dosya bozuk veya şifreli/korumalı olabilir.");
      setFile(null);
    } finally {
      setReading(false);
    }
  }

  function parcaSayisiDegistir(ham: string) {
    const temiz = ham.replace(/[^\d]/g, "");
    setParcaSayisi(temiz);
    const n = parseInt(temiz, 10);
    if (!Number.isFinite(n) || n < 1) return;
    const hedef = Math.min(n, Math.max(pageCount, 1));
    setBoyutlar((onceki) => Array.from({ length: hedef }, (_, i) => onceki[i] ?? ""));
  }

  /** "Her N sayfada böl" kısayolu: parça sayısını hesaplar, boyutları N'e sabitler. */
  function herKacSayfada(ham: string) {
    const temiz = ham.replace(/[^\d]/g, "");
    setHerKac(temiz);
    const n = parseInt(temiz, 10);
    if (!Number.isFinite(n) || n < 1 || pageCount < 1) return;
    const adet = Math.ceil(pageCount / n);
    setParcaSayisi(String(adet));
    // Son parça kalanı alsın diye otomatik bırakılır
    setBoyutlar(Array.from({ length: adet }, (_, i) => (i === adet - 1 ? "" : String(n))));
  }

  function temizle() {
    setFile(null);
    setPageCount(0);
    setParcaSayisi("2");
    setBoyutlar(["", ""]);
    setHerKac("");
    setError("");
    setProgress("");
  }

  const N = boyutlar.length;
  const girilen = boyutlar.map((s) => {
    const v = parseInt(s, 10);
    return Number.isFinite(v) ? v : null;
  });
  const plan = pageCount > 0 ? planla(pageCount, girilen) : null;
  const bolunemez = pageCount === 1;
  const hazir = !!plan?.ok && N >= 2 && !bolunemez;
  const sabitToplam = girilen.reduce<number>((a, v) => a + (v ?? 0), 0);
  const otoAdet = girilen.filter((v) => v === null).length;

  async function handleRun() {
    if (!file || !plan?.ok || !hazir) return;
    setLoading(true);
    setError("");
    setProgress("");
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const base = file.name.replace(/\.[^.]+$/, "");
      const zip = new JSZip();
      const pad = String(plan.araliklar.length).length;

      for (let i = 0; i < plan.araliklar.length; i++) {
        setProgress(`Parça ${i + 1} / ${plan.araliklar.length}`);
        const [from, to] = plan.araliklar[i];
        const out = await PDFDocument.create();
        const indices = Array.from({ length: to - from + 1 }, (_, k) => from + k);
        const copied = await out.copyPages(src, indices);
        copied.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        zip.file(
          `${base}-${String(i + 1).padStart(pad, "0")}_sayfa-${from + 1}-${to + 1}.pdf`,
          bytes
        );
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

  return (
    <ToolShell
      title="PDF"
      accent="Böl"
      subtitle="Kaç parça olacağını seçin; isterseniz her parçanın sayfa sayısını kendiniz belirleyin."
      steps={["Dosya Seç", "Parçaları Ayarla", "Böl"]}
      current={hazir ? 3 : file ? 2 : 1}
    >
      <Dropzone accept="application/pdf" files={file ? [file] : []} onFiles={handleFiles} />

      {reading && <p className="mt-4 text-xs text-[var(--ink-dim)]">PDF okunuyor...</p>}

      {pageCount > 0 && !bolunemez && (
        <>
          <div className="mt-5">
            <label htmlFor="parca-sayisi" className="label mb-2 block">
              Kaç parçaya bölünsün
            </label>
            <input
              id="parca-sayisi"
              value={parcaSayisi}
              onChange={(e) => parcaSayisiDegistir(e.target.value)}
              inputMode="numeric"
              className="field"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {PARCA_HAZIR.filter((p) => p <= pageCount).map((p) => (
                <button
                  key={p}
                  onClick={() => parcaSayisiDegistir(String(p))}
                  className="chip btn-3d inline-flex items-center justify-center border border-[var(--rule-2)] bg-[var(--paper-3)] px-2 py-1 text-[11px] text-[var(--ink-dim)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setBoyutlar(Array(N).fill(""))}
                className="chip btn-3d inline-flex items-center justify-center border border-[var(--rule-2)] bg-[var(--paper-3)] px-3 py-1 text-[11px] text-[var(--ink-dim)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              >
                Eşit dağıt
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <label htmlFor="her-kac" className="label shrink-0">
                Kısayol: her
              </label>
              <input
                id="her-kac"
                value={herKac}
                onChange={(e) => herKacSayfada(e.target.value)}
                inputMode="numeric"
                placeholder="10"
                className="field w-20 py-1 text-center"
              />
              <span className="label shrink-0">sayfada böl</span>
            </div>

            {parseInt(parcaSayisi, 10) > pageCount && (
              <p className="mt-2 text-xs text-[var(--accent)]">
                {pageCount} sayfalık belge en fazla {pageCount} parçaya bölünebilir.
              </p>
            )}
          </div>

          <div className="mt-5 border border-[var(--rule)]">
            <p className="band">Parçalar</p>

            {boyutlar.map((deger, i) => (
              <div key={i} className="row flex items-center gap-3 px-3 py-2">
                <span className="label diamond shrink-0">{i + 1}. parça</span>
                <input
                  aria-label={`${i + 1}. parçanın sayfa sayısı`}
                  value={deger}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d]/g, "");
                    setBoyutlar((o) => o.map((x, k) => (k === i ? v : x)));
                  }}
                  inputMode="numeric"
                  placeholder="otomatik"
                  className="field ml-auto w-24 py-1 text-center"
                />
                <span className="w-16 shrink-0 text-right text-xs text-[var(--ink-dim)]">
                  {plan?.ok ? `${plan.boylar[i]} sayfa` : "—"}
                </span>
              </div>
            ))}

            <div className="row flex items-center justify-between gap-3 px-3 py-2">
              <span className="label diamond">Belge</span>
              <span className="text-sm text-[var(--ink)]">
                {pageCount} sayfa
                {otoAdet > 0 && (
                  <span className="ml-2 text-xs text-[var(--ink-dim)]">
                    ({sabitToplam} elle, {pageCount - sabitToplam} otomatik)
                  </span>
                )}
              </span>
            </div>

            {plan && !plan.ok && (
              <div className="row px-3 py-2">
                <p className="text-xs text-[var(--accent)]">{plan.mesaj}</p>
              </div>
            )}

            {plan?.ok && N < 2 && (
              <div className="row px-3 py-2">
                <p className="text-xs text-[var(--accent)]">Bölmek için en az 2 parça gerekir.</p>
              </div>
            )}

            {plan?.ok && N >= 2 && (
              <div className="row px-3 py-2">
                <p className="text-xs leading-relaxed text-[var(--ink-dim)]">
                  {plan.araliklar.slice(0, 10).map(([a, b], k) => (
                    <span key={k} className="mr-2 inline-block whitespace-nowrap">
                      {a === b ? `s.${a + 1}` : `s.${a + 1}–${b + 1}`}
                    </span>
                  ))}
                  {plan.araliklar.length > 10 && <span>... +{plan.araliklar.length - 10}</span>}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {bolunemez && (
        <p className="mt-5 text-xs text-[var(--accent)]">
          Bu belge tek sayfa; bölünecek bir şey yok.
        </p>
      )}

      <PrimaryButton onClick={handleRun} disabled={!hazir || loading}>
        {loading ? progress || "Bölünüyor..." : "Böl"}
      </PrimaryButton>
      {hazir && !loading && (
        <p className="mt-3 text-center text-[11px] text-[var(--ink-faint)]">
          Parçalar tek bir ZIP dosyası olarak inecek.
        </p>
      )}
      <ClearButton onClear={temizle} show={!!file && !loading} />
      {error && <p className="mt-4 text-xs text-[var(--accent)]">{error}</p>}
    </ToolShell>
  );
}
