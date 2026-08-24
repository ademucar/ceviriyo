"use client";
import { useCallback, useState } from "react";
import ToolShell from "@/app/components/ToolShell";
import Dropzone from "@/app/components/Dropzone";
import PrimaryButton from "@/app/components/PrimaryButton";
import ResultBar from "@/app/components/ResultBar";
import { useImageProcessor } from "@/app/lib/useImageProcessor";
import { extFor, isLossy, outputTypeFor, renderImage } from "@/app/lib/image";

export default function ImageCompress() {
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<string | null>(null);

  const render = useCallback(
    (img: HTMLImageElement) => renderImage(img, { format: format!, quality }),
    [format, quality]
  );

  const { file, url, imgRef, onImageLoad, selectFile, decoding, result, busy, error, download } =
    useImageProcessor(render);

  function handleFiles(files: File[]) {
    setFormat(files[0] ? outputTypeFor(files[0]) : null);
    selectFile(files);
  }

  const lossy = format ? isLossy(format) : true;

  return (
    <ToolShell
      cmd="Görsel / Sıkıştır"
      title="Görsel"
      accent="Sıkıştır"
      subtitle="Kaliteyi ayarlayarak dosya boyutunu küçültün. Format korunur."
      steps={["Dosya Seç", "Ayarla", "İndir"]}
      current={result ? 3 : file ? 2 : 1}
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

          {lossy ? (
            <div className="mt-5">
              <label htmlFor="kalite" className="label mb-2 flex items-center justify-between">
                <span>Kalite</span>
                <span className="text-[var(--accent)]">%{quality}</span>
              </label>
              <input
                id="kalite"
                type="range"
                min={10}
                max={100}
                step={5}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          ) : (
            <p className="mt-5 text-xs text-[var(--accent)]">
              PNG kayıpsız bir formattır; kalite düşürülerek küçültülemez. Boyutu azaltmak için
              Boyutlandır aracını kullanabilir ya da görseli JPG/WebP olarak Görsel Dönüştürücü
              üzerinden kaydedebilirsiniz.
            </p>
          )}

          {file && <ResultBar originalSize={file.size} result={result} busy={busy} />}
        </>
      )}

      <PrimaryButton
        onClick={() => format && download(extFor(format), "sikistirilmis")}
        disabled={!result || busy}
      >
        {busy ? "Hazırlanıyor..." : "İndir"}
      </PrimaryButton>
      {error && <p className="mt-4 text-xs text-[var(--accent)]">{error}</p>}
    </ToolShell>
  );
}
