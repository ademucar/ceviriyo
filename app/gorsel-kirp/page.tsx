"use client";
import { useCallback, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ToolShell from "@/app/components/ToolShell";
import Dropzone from "@/app/components/Dropzone";
import PrimaryButton from "@/app/components/PrimaryButton";
import ClearButton from "@/app/components/ClearButton";
import ResultBar from "@/app/components/ResultBar";
import { useImageProcessor } from "@/app/lib/useImageProcessor";
import { extFor, outputTypeFor, renderImage } from "@/app/lib/image";

export default function ImageCrop() {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [format, setFormat] = useState<string | null>(null);

  const render = useCallback(
    (img: HTMLImageElement) => renderImage(img, { crop: completedCrop, format: format! }),
    [completedCrop, format]
  );

  const { file, url, imgRef, onImageLoad, selectFile, decoding, result, busy, error, download } =
    useImageProcessor(render);

  function temizle() {
    setCrop(undefined);
    setCompletedCrop(null);
    setFormat(null);
    selectFile([]);
  }

  function handleFiles(files: File[]) {
    setCrop(undefined);
    setCompletedCrop(null);
    setFormat(files[0] ? outputTypeFor(files[0]) : null);
    selectFile(files);
  }

  return (
    <ToolShell
      title="Görsel"
      accent="Kırp"
      subtitle="Görselin istediğiniz bölümünü seçip kesin. Format korunur."
      steps={["Dosya Seç", "Alan Seç", "İndir"]}
      current={completedCrop ? 3 : file ? 2 : 1}
    >
      <Dropzone accept="image/*,.heic,.heif" files={file ? [file] : []} onFiles={handleFiles} />

      {decoding && <p className="mt-4 text-xs text-[var(--ink-dim)]">Görsel açılıyor...</p>}

      {url && (
        <>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="label">Kırpma alanı</label>
              {completedCrop && (
                <button
                  onClick={() => {
                    setCrop(undefined);
                    setCompletedCrop(null);
                  }}
                  className="text-[11px] text-[var(--accent)] hover:underline"
                >
                  Sıfırla
                </button>
              )}
            </div>
            <div className="crop-fit overflow-hidden border border-[var(--rule)] bg-[var(--paper)] p-2">
              <ReactCrop crop={crop} onChange={setCrop} onComplete={setCompletedCrop}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={url}
                  alt="Önizleme"
                  className="mx-auto max-h-[clamp(140px,42dvh,380px)] w-auto"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
            <p className="mt-2 text-[11px] text-[var(--ink-faint)]">
              Sürükleyerek bir alan seçin; seçmezseniz görselin tamamı kullanılır.
            </p>
          </div>

          {file && <ResultBar originalSize={file.size} result={result} busy={busy} />}
        </>
      )}

      <PrimaryButton
        onClick={() => format && download(extFor(format), "kirpilmis")}
        disabled={!result || busy}
      >
        {busy ? "Hazırlanıyor..." : "İndir"}
      </PrimaryButton>
      <ClearButton onClear={temizle} show={!!file && !busy} />
      {error && <p className="mt-4 text-xs text-[var(--accent)]">{error}</p>}
    </ToolShell>
  );
}
