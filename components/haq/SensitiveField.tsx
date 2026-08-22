interface SensitiveOption {
  label: string;
  value: string;
}

interface SensitiveFieldProps {
  legend: string;
  onSelect: (value: string) => void;
  options: readonly SensitiveOption[];
  selected?: string;
}

export function SensitiveField({
  legend,
  onSelect,
  options,
  selected,
}: SensitiveFieldProps) {
  return (
    <fieldset className="sensitive-field">
      <legend className="sr-only">{legend}</legend>
      <div className="sensitive-options">
        {options.map((option) => (
          <button
            aria-pressed={selected === option.value}
            className="sensitive-option"
            key={option.value}
            onClick={() => onSelect(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
