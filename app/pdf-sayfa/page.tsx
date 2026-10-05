
"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolShell from "@/app/components/ToolShell";
import Dropzone from "@/app/components/Dropzone";
import PrimaryButton from "@/app/components/PrimaryButton";
import { downloadBlob } from "@/app/lib/download";

function parsePages(input: string, total: number): number[] {
  const set = new Set<number>();
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      let a = parseInt(m[1]), b = parseInt(m[2]);
      if (a > b) [a, b] = [b, a];
      for (let i = a; i <= b; i++) if (i >= 1 && i <= total) set.add(i - 1);
    } else if (/^\d+$/.test(part)) {
      const n = parseInt(part);
      if (n >= 1 && n <= total) set.add(n - 1);
    }
  }
  return [...set].sort((a, b) => a - b);
}

export default function PdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState("keep");
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRun() {
    if (!file) { setError("PDF seçin."); return; }
    if (!pages.trim()) { setError("Sayfa numaralarını girin (örn: 1,3,5-7)."); return; }
    setLoading(true);
    setError("");
    try {
      let src: PDFDocument;
      try {
        src = await PDFDocument.load(await file.arrayBuffer());
      } catch {
        throw new Error("PDF açılamadı. Dosya bozuk veya şifreli/korumalı olabilir.");
      }
      const total = src.getPageCount();
      const selected = parsePages(pages, total);
      if (selected.length === 0) throw new Error("Geçerli sayfa numarası girin (örn: 1,3,5-7).");
      let indices: number[];
      if (mode === "remove") {
        const rm = new Set(selected);
        indices = Array.from({ length: total }, (_, i) => i).filter((i) => !rm.has(i));
      } else {
        indices = selected;
      }
      if (indices.length === 0) throw new Error("Sonuçta hiç sayfa kalmıyor.");
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, indices);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const base = file.name.replace(/\.[^.]+$/, "");
      downloadBlob(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), `${base}-duzenlenmis.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell title="PDF" accent="Sayfa Seç / Sil" subtitle="Belirttiğiniz sayfaları tutun ya da silin." steps={["Dosya Seç", "Ayarla & Uygula"]} current={file ? 2 : 1}>
      <Dropzone accept="application/pdf" files={file ? [file] : []} onFiles={(f) => setFile(f[0] ?? null)} />
      <div className="mt-5 space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setMode("keep")} className={`label btn-3d flex-1 border py-2 min-h-[44px] ${mode === "keep" ? "border-[var(--surface)] bg-[var(--surface)] text-[var(--paper)]" : "border-[var(--rule-2)] text-[var(--ink-dim)] hover:border-[var(--ink)] hover:text-[var(--ink)]"}`}>Sadece bunları tut</button>
          <button onClick={() => setMode("remove")} className={`label btn-3d flex-1 border py-2 min-h-[44px] ${mode === "remove" ? "border-[var(--surface)] bg-[var(--surface)] text-[var(--paper)]" : "border-[var(--rule-2)] text-[var(--ink-dim)] hover:border-[var(--ink)] hover:text-[var(--ink)]"}`}>Bunları sil</button>
        </div>
        <div>
          <label htmlFor="sayfalar" className="label mb-2 block">Sayfalar</label>
          <input id="sayfalar" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="örn: 1,3,5-7" className="field" />
        </div>
      </div>
      <PrimaryButton onClick={handleRun} disabled={!file || loading}>{loading ? "Uygulanıyor..." : "Uygula"}</PrimaryButton>
      {error && <p className="mt-4 text-xs text-[var(--accent)]">{error}</p>}
    </ToolShell>
  );
}