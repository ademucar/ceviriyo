"use client";
import { useRef, useState } from "react";

type Props = {
  accept: string;
  multiple?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
};

export default function Dropzone({ accept, multiple, files, onFiles }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={
        multiple ? "Dosya seçin veya buraya sürükleyin" : "Bir dosya seçin veya buraya sürükleyin"
      }
      onClick={() => inputRef.current?.click()}
      // Klavye kullanıcıları için: Enter/Boşluk dosya seçiciyi açsın
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const dropped = Array.from(e.dataTransfer.files);
        onFiles(multiple ? dropped : dropped.slice(0, 1));
      }}
      className={`cursor-pointer border border-dashed px-4 py-7 text-center transition-colors ${
        drag
          ? "border-[var(--ink)] bg-[var(--paper-3)]"
          : "border-[var(--rule-2)] bg-[var(--paper)] hover:border-[var(--ink-dim)] hover:bg-[var(--paper-3)]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => {
          onFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />

      {files.length === 0 ? (
        <>
          <p className="display text-[15px]">Dosya seçin</p>
          <p className="mt-1 text-xs text-[var(--ink-dim)]">
            ya da buraya sürükleyin &mdash;{" "}
            {multiple ? "bir veya birden fazla dosya" : "tek dosya"}
          </p>
        </>
      ) : (
        <div role="status" aria-live="polite">
          <p className="display text-[15px]">
            {files.length} dosya seçildi
            <span className="ml-2 text-[var(--accent)]">&#9670;</span>
          </p>
          <p className="mt-1 truncate text-xs text-[var(--ink-dim)]">
            {files.map((f) => f.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
