type Props = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export default function PrimaryButton({ onClick, disabled, children }: Props) {
  return (
    <button onClick={onClick} disabled={disabled} className="run-btn">
      {disabled ? "" : "> "}
      {children}
    </button>
  );
}
