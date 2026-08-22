interface OptionButtonProps {
  label: string;
  onChoose?: () => void;
}

export function OptionButton({ label, onChoose }: OptionButtonProps) {
  return (
    <button className="option-button" onClick={onChoose} type="button">
      {label}
    </button>
  );
}
