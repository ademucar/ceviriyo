type Props = {
  onClear: () => void;
  /** Temizlenecek bir şey yoksa buton gizlenir. */
  show: boolean;
};

export default function ClearButton({ onClear, show }: Props) {
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={onClear}
      className="label btn-3d mt-3 min-h-[44px] w-full border border-[var(--rule-2)] bg-[var(--paper-3)] py-2 text-[var(--ink-dim)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
    >
      Temizle
    </button>
  );
}
