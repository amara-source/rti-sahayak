import type { LandingIconName } from "@/content/landing-events";

interface AbstractIconProps {
  name: LandingIconName;
}

export function AbstractIcon({ name }: AbstractIconProps) {
  const sharedProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
  };

  const paths: Record<LandingIconName, React.ReactNode> = {
    place: (
      <>
        <path d="M12 21s6-5.1 6-11a6 6 0 0 0-12 0c0 5.9 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.2" />
      </>
    ),
    family: (
      <>
        <circle cx="8" cy="9" r="3" />
        <circle cx="16.5" cy="10" r="2.5" />
        <path d="M3.5 20c.5-4.1 2-6 4.5-6s4 1.9 4.5 6M13 20c.3-3.2 1.5-4.8 3.5-4.8 2.1 0 3.3 1.6 3.5 4.8" />
      </>
    ),
    work: (
      <>
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <path d="M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7M3 12h18M10 12v2h4v-2" />
      </>
    ),
    money: (
      <>
        <path d="M4 7.5 12 4l8 3.5-8 3.5-8-3.5ZM6 10v7.5M10 11.5v6M14 11.5v6M18 10v7.5M4 20h16" />
      </>
    ),
    education: (
      <>
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 12v4.5c3.3 2 6.7 2 10 0V12M21 9v6" />
      </>
    ),
    health: (
      <>
        <path d="M12 21C7 18 4 14.8 4 10.5A4.5 4.5 0 0 1 12 7.7a4.5 4.5 0 0 1 8 2.8C20 14.8 17 18 12 21Z" />
        <path d="M8 12h2.5l1-2.2 1.8 4.2 1-2H17" />
      </>
    ),
    identity: (
      <>
        <rect x="4" y="3.5" width="16" height="17" rx="2" />
        <circle cx="9" cy="10" r="2.2" />
        <path d="M6.5 16c.6-2 1.4-3 2.5-3s2 .9 2.5 3M14 9h3M14 13h3M14 17h3" />
      </>
    ),
    travel: (
      <>
        <path d="M5 18 19 6M8 6h11v11" />
        <path d="M4 10v10h10" />
      </>
    ),
    legal: (
      <>
        <path d="M12 4v16M6 7h12M8 7l-4 7h8L8 7ZM16 7l-4 7h8l-4-7ZM8 20h8" />
      </>
    ),
    ration: (
      <>
        <path d="M5 5h14l-1 15H6L5 5Z" />
        <path d="M8 5a4 4 0 0 1 8 0M9 10h6M9 14h6" />
      </>
    ),
    transport: (
      <>
        <path d="m5 16 1.5-7h11L19 16M3.5 16h17v3h-2v-2h-13v2h-2v-3Z" />
        <circle cx="7" cy="14" r="1" />
        <circle cx="17" cy="14" r="1" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="abstract-icon"
      viewBox="0 0 24 24"
      {...sharedProps}
    >
      {paths[name]}
    </svg>
  );
}
