interface FilledIconProps {
  seed: string;
  label?: string;
}

function hashSeed(seed: string): number {
  return Array.from(seed).reduce((hash, character) => ((hash * 33) ^ character.charCodeAt(0)) >>> 0, 2166136261);
}

const palettes = [
  ["#155eef", "#ffb020", "#ffffff"],
  ["#c026d3", "#f97316", "#ffffff"],
  ["#008f70", "#22c55e", "#ffffff"],
  ["#7c3aed", "#ec4899", "#ffffff"],
  ["#d92d20", "#fbbf24", "#ffffff"],
  ["#0369a1", "#06b6d4", "#ffffff"],
] as const;

export function FilledIcon({ seed, label }: FilledIconProps) {
  const hash = hashSeed(seed);
  const palette = palettes[hash % palettes.length];
  const x = 13 + (hash % 9);
  const y = 12 + ((hash >>> 4) % 8);
  const size = 11 + ((hash >>> 8) % 8);
  const round = 4 + ((hash >>> 12) % 9);

  return (
    <span className="filled-icon" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <svg viewBox="0 0 56 56" focusable="false">
        <rect width="56" height="56" rx="17" fill={palette[0]} />
        <circle cx={43 - (hash % 7)} cy={13 + ((hash >>> 16) % 7)} r={7 + ((hash >>> 20) % 5)} fill={palette[1]} />
        <rect x={x} y={y} width={size} height={25} rx={round} fill={palette[2]} />
        <path d={`M${10 + (hash % 5)} 42 L28 ${24 + ((hash >>> 6) % 7)} L${46 - (hash % 4)} 42 Z`} fill={palette[1]} />
      </svg>
    </span>
  );
}
