import type { ReactNode } from "react";

/**
 * One icon per concept, drawn to its subject.
 *
 * Everything before this used a single generated glyph recoloured by a hash,
 * so an authority, a deadline and a warning were the same picture. These are
 * line icons on a 24 unit grid at one stroke weight, with an optional duotone
 * fill for the part that carries the meaning.
 *
 * Adding a concept means adding a glyph here. Reusing one for a second,
 * different concept is the thing this file exists to prevent.
 */

export type IconName =
  // Journey nodes
  | "compass"
  | "signpost"
  | "building"
  | "document-pen"
  | "clipboard-check"
  | "send"
  | "transfer"
  | "clock"
  | "bell-off"
  | "escalate"
  | "scales"
  | "megaphone"
  // Pre-flight checks
  | "map-pin"
  | "text-length"
  | "keyboard"
  | "split"
  | "folder"
  | "id-off"
  | "paperclip"
  | "certificate"
  // Authorities
  | "hand-coin"
  | "wallet"
  | "heart-pulse"
  | "receipt"
  | "train"
  | "fingerprint"
  | "passport"
  | "bank"
  | "graduation-cap"
  | "medal"
  | "stethoscope"
  | "question"
  // Explanatory
  | "two-windows"
  | "price-tag"
  | "hourglass"
  | "lifebuoy"
  | "book"
  | "route"
  | "form"
  | "timeline"
  // State authorities
  | "city"
  | "badge"
  | "bus"
  | "map"
  | "vault"
  | "blackboard"
  | "bolt"
  | "droplet"
  | "stamp";

const glyphs: Record<IconName, ReactNode> = {
  compass: (
    <>
      <circle className="icon-fill" cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  signpost: (
    <>
      <path d="M12 3v18" />
      <path className="icon-fill" d="M12 6h6l2 2.5L18 11h-6z" />
      <path d="M12 13H6l-2 2.5L6 18h6" />
    </>
  ),
  building: (
    <>
      <path className="icon-fill" d="M4 21V6l7-3v18z" />
      <path d="M11 21V9l9 3v9z" />
      <path d="M2 21h20" />
      <path d="M7 9v.01M7 13v.01M15 14v.01M15 17v.01" />
    </>
  ),
  "document-pen": (
    <>
      <path className="icon-fill" d="M13 3H6v18h7" />
      <path d="M13 3l5 5v3" />
      <path d="M13 3v5h5" />
      <path d="M21 13l-6 6-3 .8.8-3 6-6z" />
    </>
  ),
  "clipboard-check": (
    <>
      <path className="icon-fill" d="M8 4h8v3H8z" />
      <path d="M9 4H6v17h12V4h-3" />
      <path d="M9 14l2.2 2.2L15.5 12" />
    </>
  ),
  send: (
    <>
      <path className="icon-fill" d="M21 3L3 10.5l7.5 3z" />
      <path d="M21 3l-7.5 18-3-7.5" />
      <path d="M10.5 13.5L21 3" />
    </>
  ),
  transfer: (
    <>
      <path className="icon-fill" d="M3 8h13l-3.5-3.5" />
      <path d="M3 8h13M12.5 4.5L16 8l-3.5 3.5" />
      <path d="M21 16H8m3.5-3.5L8 16l3.5 3.5" />
    </>
  ),
  clock: (
    <>
      <circle className="icon-fill" cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.4 2" />
    </>
  ),
  "bell-off": (
    <>
      <path className="icon-fill" d="M6 16V11a6 6 0 0 1 9.2-5.1" />
      <path d="M6 16V11a6 6 0 0 1 12 0v5" />
      <path d="M4.5 16h15" />
      <path d="M10 20a2 2 0 0 0 4 0" />
      <path d="M3.5 3.5l17 17" />
    </>
  ),
  escalate: (
    <>
      <path className="icon-fill" d="M5 21V7l5-4h9v18z" />
      <path d="M5 21V7l5-4h9v18z" />
      <path d="M12 17v-6m0 0l-2.5 2.5M12 11l2.5 2.5" />
    </>
  ),
  scales: (
    <>
      <path d="M12 4v16M7 20h10" />
      <path d="M4 8h16M12 4l-8 4M12 4l8 4" />
      <path className="icon-fill" d="M4 8l-2.5 5h5zM20 8l-2.5 5h5z" />
    </>
  ),
  megaphone: (
    <>
      <path className="icon-fill" d="M4 10v4l11 5V5z" />
      <path d="M4 10v4l11 5V5L4 10z" />
      <path d="M18 9.5a3 3 0 0 1 0 5" />
      <path d="M6.5 15v4h3v-3" />
    </>
  ),
  "map-pin": (
    <>
      <path className="icon-fill" d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  "text-length": (
    <>
      <path d="M3 6h18M3 12h12M3 18h18" />
      <path className="icon-fill" d="M18 10.5l3 1.5-3 1.5z" />
    </>
  ),
  keyboard: (
    <>
      <rect className="icon-fill" height="12" rx="2.5" width="20" x="2" y="6" />
      <path d="M6 10v.01M10 10v.01M14 10v.01M18 10v.01M8 14h8" />
    </>
  ),
  split: (
    <>
      <path className="icon-fill" d="M4 4h7v7H4z" />
      <path d="M4 4h7v7H4zM13 13h7v7h-7z" />
      <path d="M11 7.5h4a2 2 0 0 1 2 2V13" />
    </>
  ),
  folder: (
    <>
      <path className="icon-fill" d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M3 11h18" />
    </>
  ),
  "id-off": (
    <>
      <rect className="icon-fill" height="13" rx="2.5" width="18" x="3" y="6" />
      <circle cx="9" cy="12" r="2.2" />
      <path d="M14 11h4M14 14.5h3" />
      <path d="M3.5 3.5l17 17" />
    </>
  ),
  paperclip: (
    <>
      <path className="icon-fill" d="M17 8v8.5a5 5 0 0 1-10 0V7a3.2 3.2 0 0 1 6.4 0v9a1.5 1.5 0 0 1-3 0V8.5" />
    </>
  ),
  certificate: (
    <>
      <path className="icon-fill" d="M5 3h14v11H5z" />
      <path d="M5 3h14v11H5z" />
      <path d="M8 7h8M8 10.5h5" />
      <path d="M12 14l-3 7 3-1.6 3 1.6z" />
    </>
  ),
  "hand-coin": (
    <>
      <circle className="icon-fill" cx="16" cy="7" r="4" />
      <path d="M3 20l3-3h6l3-2.5" />
      <path d="M3 14.5l3-2.5h4a2 2 0 0 1 0 4H8" />
    </>
  ),
  wallet: (
    <>
      <path className="icon-fill" d="M3 7a2 2 0 0 1 2-2h12v4" />
      <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H4" />
      <circle cx="17" cy="14" r="1.4" />
    </>
  ),
  "heart-pulse": (
    <>
      <path className="icon-fill" d="M12 20S3.5 14.5 3.5 9a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2c0 5.5-8.5 11-8.5 11z" />
      <path d="M3.5 12h4l1.5-2.5L11 15l2-4 1.5 1h6" />
    </>
  ),
  receipt: (
    <>
      <path className="icon-fill" d="M5 3h14v18l-2.5-1.6L14 21l-2-1.6L10 21l-2.5-1.6L5 21z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  train: (
    <>
      <rect className="icon-fill" height="13" rx="3" width="14" x="5" y="3" />
      <path d="M5 10h14" />
      <path d="M9 13.5v.01M15 13.5v.01" />
      <path d="M7 16l-2 5M17 16l2 5M8 21h8" />
    </>
  ),
  fingerprint: (
    <>
      <path className="icon-fill" d="M12 5a7 7 0 0 1 7 7v2" />
      <path d="M5 12a7 7 0 0 1 11.8-5.1" />
      <path d="M8.5 12a3.5 3.5 0 1 1 7 0v4" />
      <path d="M12 12v6" />
      <path d="M5.5 16.5A9 9 0 0 0 6 20" />
    </>
  ),
  passport: (
    <>
      <path className="icon-fill" d="M5 4a1 1 0 0 1 1-1h13v18H6a1 1 0 0 1-1-1z" />
      <path d="M5 4a1 1 0 0 1 1-1h13v18H6a1 1 0 0 1-1-1z" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9.5 16h5" />
    </>
  ),
  bank: (
    <>
      <path className="icon-fill" d="M12 3l9 5H3z" />
      <path d="M3 8h18M5 8v9M9.7 8v9M14.3 8v9M19 8v9" />
      <path d="M3 20h18M4 17h16" />
    </>
  ),
  "graduation-cap": (
    <>
      <path className="icon-fill" d="M12 4l10 4.5-10 4.5L2 8.5z" />
      <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
      <path d="M22 8.5V14" />
    </>
  ),
  medal: (
    <>
      <circle className="icon-fill" cx="12" cy="15" r="6" />
      <path d="M9 3l2.2 5M15 3l-2.2 5" />
      <path d="M12 12.5l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9 14.7l2-.3z" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M6 3v5a4 4 0 0 0 8 0V3" />
      <path d="M6 3H4.5M14 3h1.5" />
      <path d="M10 12v3a5 5 0 0 0 10 0v-1" />
      <circle className="icon-fill" cx="20" cy="12" r="2.2" />
    </>
  ),
  question: (
    <>
      <circle className="icon-fill" cx="12" cy="12" r="9" />
      <path d="M9.3 9.3a2.8 2.8 0 0 1 5.4.9c0 1.9-2.7 2.3-2.7 4" />
      <path d="M12 17.5v.01" />
    </>
  ),
  "two-windows": (
    <>
      <rect className="icon-fill" height="10" rx="2" width="11" x="2" y="4" />
      <path d="M2 8h11" />
      <rect height="10" rx="2" width="11" x="11" y="10" />
      <path d="M11 14h11" />
    </>
  ),
  "price-tag": (
    <>
      <path className="icon-fill" d="M3 11.5V4h7.5l10 10-7.5 7.5z" />
      <path d="M3 11.5V4h7.5l10 10-7.5 7.5z" />
      <circle cx="7.5" cy="8" r="1.4" />
    </>
  ),
  hourglass: (
    <>
      <path className="icon-fill" d="M7 3h10v3.5L12 12l5 5.5V21H7v-3.5L12 12 7 6.5z" />
      <path d="M6 3h12M6 21h12" />
    </>
  ),
  lifebuoy: (
    <>
      <circle className="icon-fill" cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M4.7 6.9l3.8 3.2M19.3 6.9l-3.8 3.2M4.7 17.1l3.8-3.2M19.3 17.1l-3.8-3.2" />
    </>
  ),
  book: (
    <>
      <path className="icon-fill" d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5z" />
      <path d="M4 19.5A1.5 1.5 0 0 1 5.5 18H19v3H5.5A1.5 1.5 0 0 1 4 19.5z" />
      <path d="M8 8h7" />
    </>
  ),
  route: (
    <>
      <circle className="icon-fill" cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M9 6h5a4 4 0 0 1 0 8h-4a4 4 0 0 0 0 8h5" />
    </>
  ),
  city: (
    <>
      <path className="icon-fill" d="M3 21V9l6-3v15z" />
      <path d="M9 21V4l6 2v15" />
      <path d="M15 21v-8l6 2v6" />
      <path d="M2 21h20M6 12v.01M6 16v.01M12 9v.01M12 13v.01M12 17v.01" />
    </>
  ),
  badge: (
    <>
      <path className="icon-fill" d="M12 3l7 3v6c0 4.4-3 8-7 9-4-1-7-4.6-7-9V6z" />
      <path d="M9.3 12l1.9 1.9L15 10" />
    </>
  ),
  bus: (
    <>
      <rect className="icon-fill" height="13" rx="3" width="16" x="4" y="4" />
      <path d="M4 11h16" />
      <path d="M8 14v.01M16 14v.01" />
      <path d="M7 17v3M17 17v3" />
    </>
  ),
  map: (
    <>
      <path className="icon-fill" d="M3 6l6-2v14l-6 2z" />
      <path d="M9 4l6 2v14l-6-2" />
      <path d="M15 6l6-2v14l-6 2" />
    </>
  ),
  vault: (
    <>
      <rect className="icon-fill" height="16" rx="3" width="18" x="3" y="4" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 6.5v2M12 15.5v2M6.5 12h2M15.5 12h2" />
    </>
  ),
  blackboard: (
    <>
      <rect className="icon-fill" height="13" rx="2" width="18" x="3" y="4" />
      <path d="M7 9h7M7 13h4" />
      <path d="M8 17v3M16 17v3" />
    </>
  ),
  bolt: (
    <>
      <path className="icon-fill" d="M13 2L4 14h6l-1 8 9-12h-6z" />
    </>
  ),
  droplet: (
    <>
      <path className="icon-fill" d="M12 3c4 5 6.5 7.7 6.5 10.8A6.5 6.5 0 0 1 5.5 13.8C5.5 10.7 8 8 12 3z" />
      <path d="M9 14a3 3 0 0 0 3 3" />
    </>
  ),
  stamp: (
    <>
      <path className="icon-fill" d="M9 3h6a3 3 0 0 1 3 3l-1.2 5H7.2L6 6a3 3 0 0 1 3-3z" />
      <rect height="4" rx="1.5" width="18" x="3" y="14" />
      <path d="M5 20h14" />
    </>
  ),
  form: (
    <>
      <rect className="icon-fill" height="18" rx="2.5" width="16" x="4" y="3" />
      <path d="M8 8h8M8 12h8M8 16h4" />
    </>
  ),
  timeline: (
    <>
      <path d="M6 3v18" />
      <circle className="icon-fill" cx="6" cy="7.5" r="2.4" />
      <circle cx="6" cy="16.5" r="2.4" />
      <path d="M11 7.5h9M11 16.5h6" />
    </>
  ),
};

export function Icon({
  name,
  size = 24,
  className,
  label,
}: {
  name: IconName;
  size?: number;
  className?: string;
  label?: string;
}) {
  const glyph = glyphs[name];
  if (!glyph) return null;

  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className ? `rti-icon ${className}` : "rti-icon"}
      fill="none"
      focusable="false"
      height={size}
      role={label ? "img" : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      viewBox="0 0 24 24"
      width={size}
    >
      {glyph}
    </svg>
  );
}

/** Every icon name in the registry, used by the no-duplicates test. */
export const iconNames = Object.keys(glyphs) as IconName[];
