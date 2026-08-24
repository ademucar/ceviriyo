"use client";
import { useCallback, useState } from "react";
import ToolShell from "@/app/components/ToolShell";
import Dropzone from "@/app/components/Dropzone";
import PrimaryButton from "@/app/components/PrimaryButton";
import ResultBar from "@/app/components/ResultBar";
import { useImageProcessor } from "@/app/lib/useImageProcessor";
import { extFor, outputTypeFor, renderImage } from "@/app/lib/image";

const PRESETS = [480, 720, 1080, 1920];

export default function ImageResize() {
  const [maxWidth, setMaxWidth] = useState("");
  const [maxHeight, setMaxHeight] = useState("");
  const [format, setFormat] = useState<string | null>(null);

  const render = useCallback(
    (img: HTMLImageElement) =>
      renderImage(img, {
        maxWidth: parseInt(maxWidth, 10) || null,
        maxHeight: parseInt(maxHeight, 10) || null,
        format: format!,
      }),
    [maxWidth, maxHeight, format]
  );

  const { file, url, imgRef, onImageLoad, selectFile, decoding, result, busy, error, download } =
    useImageProcessor(render);

  function handleFiles(files: File[]) {
    setMaxWidth("");
    setMaxHeight("");
    setFormat(files[0] ? outputTypeFor(files[0]) : null);
    selectFile(files);
  }

  const onlyDigits = (v: string) => v.replace(/[^\d]/g, "");

  return (
    <ToolShell
      cmd="Görsel / Boyutlandır"
      title="Görsel"
      accent="Boyutlandır"
      subtitle="En-boy oranını koruyarak küçültün. Format korunur."
      steps={["Dosya Seç", "Ölçü Ver", "İndir"]}
      current={maxWidth || maxHeight ? 3 : file ? 2 : 1}
    >
      <Dropzone accept="image/*,.heic,.heif" files={file ? [file] : []} onFiles={handleFiles} />

      {decoding && <p className="mt-4 text-xs text-[var(--ink-dim)]">Görsel açılıyor...</p>}

      {url && (
        <>
          <div className="mt-5 overflow-hidden border border-[var(--rule)] bg-[var(--paper)] p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={url}
              alt="Önizleme"
              className="mx-auto max-h-[clamp(120px,34dvh,320px)] w-auto"
              onLoad={onImageLoad}
            />
          </div>

          <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))] gap-4">
            <div>
              <label htmlFor="genislik" className="label mb-2 block">Genişlik (px)</label>
              <input
                id="genislik"
                value={maxWidth}
                onChange={(e) => setMaxWidth(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder="Orijinal"
                className="field"
              />
            </div>
            <div>
              <label htmlFor="yukseklik" className="label mb-2 block">Yükseklik (px)</label>
              <input
                id="yukseklik"
                value={maxHeight}
                onChange={(e) => setMaxHeight(onlyDigits(e.target.value))}
                inputMode="numeric"
                placeholder="Orijinal"
                className="field"
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setMaxWidth(String(p));
                  setMaxHeight("");
                }}
                className="border border-[var(--rule-2)] px-2 py-1 text-[11px] text-[var(--ink-dim)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
              >
                {p}px genişlik
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-[var(--ink-faint)]">
            Sadece birini doldurabilirsiniz; oran her zaman korunur ve görsel büyütülmez.
          </p>

          {file && <ResultBar originalSize={file.size} result={result} busy={busy} />}
        </>
      )}

      <PrimaryButton
        onClick={() => format && download(extFor(format), "boyutlandirilmis")}
        disabled={!result || busy}
      >
        {busy ? "Hazırlanıyor..." : "İndir"}
      </PrimaryButton>
      {error && <p className="mt-4 text-xs text-[var(--accent)]">{error}</p>}
    </ToolShell>
  );
}
