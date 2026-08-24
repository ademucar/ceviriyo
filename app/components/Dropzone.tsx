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
      className={`cursor-pointer border border-dashed p-6 transition-colors ${
        drag
          ? "border-[var(--accent)] bg-[var(--panel-2)]"
          : "border-[var(--line-2)] hover:border-[var(--accent-d)] hover:bg-[var(--panel-2)]"
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
        <div className="text-xs leading-relaxed">
          <p className="text-[var(--fg-dim)]">
            <span className="text-[var(--accent)]">┌─</span> dosya sürükleyin ya da tıklayın
          </p>
          <p className="mt-1 text-[var(--fg-faint)]">
            <span className="text-[var(--accent)]">└─</span>{" "}
            {multiple ? "bir veya birden fazla dosya" : "tek dosya"}
            <span className="caret" />
          </p>
        </div>
      ) : (
        <div className="text-xs leading-relaxed" role="status" aria-live="polite">
          <p className="text-[var(--accent)]">
            <span className="text-[var(--fg-faint)]">┌─</span> {files.length} dosya seçildi
          </p>
          <p className="mt-1 truncate text-[var(--fg-dim)]">
            <span className="text-[var(--fg-faint)]">└─</span> {files.map((f) => f.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
