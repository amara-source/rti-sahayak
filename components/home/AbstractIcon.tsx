import type { LandingIconName } from "@/content/landing-events";

interface AbstractIconProps {
  name: LandingIconName;
}

const stroke = {
  stroke: "#163f62",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.45,
};

export function AbstractIcon({ name }: AbstractIconProps) {
  const shapes: Record<LandingIconName, React.ReactNode> = {
    place: <><path d="M12 20s6-4.8 6-10a6 6 0 1 0-12 0c0 5.2 6 10 6 10Z" fill="#f58a38" {...stroke} /><circle cx="12" cy="10" r="2.4" fill="#fff" {...stroke} /></>,
    family: <><circle cx="8.5" cy="8.2" r="2.8" fill="#f4a06b" {...stroke} /><circle cx="16" cy="9" r="2.35" fill="#f7c57c" {...stroke} /><path d="M3.8 20c.4-4.6 2-6.8 4.7-6.8 2.8 0 4.3 2.2 4.7 6.8Z" fill="#3e91c8" {...stroke} /><path d="M12.4 20c.3-3.7 1.5-5.5 3.7-5.5 2.3 0 3.5 1.8 3.9 5.5Z" fill="#79b985" {...stroke} /></>,
    work: <><path d="M4 8h16v11H4Z" fill="#f58a38" {...stroke} /><path d="M9 8V5.4h6V8M4 12.2h16" fill="none" {...stroke} /><path d="M10.2 11.3h3.6v2.5h-3.6Z" fill="#fff" {...stroke} /></>,
    money: <><path d="M4 9 12 4l8 5Z" fill="#f6c35d" {...stroke} /><path d="M6 10h12v8H6Z" fill="#fff" {...stroke} /><path d="M4 20h16M9.5 10v8M14.5 10v8" fill="none" {...stroke} /></>,
    education: <><path d="m3 9 9-5 9 5-9 5Z" fill="#5b92d1" {...stroke} /><path d="M7 12v4.3c3.2 2 6.8 2 10 0V12" fill="#f6c35d" {...stroke} /><path d="M21 9v6" fill="none" {...stroke} /></>,
    health: <><path d="M12 20.5c-5-2.9-7.7-6.3-7.7-10a4.4 4.4 0 0 1 7.7-2.9 4.4 4.4 0 0 1 7.7 2.9c0 3.7-2.7 7.1-7.7 10Z" fill="#ef6a6a" {...stroke} /><path d="M8 12h2.2l1-2.2 1.8 4.1 1-1.9h2" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></>,
    identity: <><rect x="4" y="3.5" width="16" height="17" rx="2.3" fill="#75b7dc" {...stroke} /><circle cx="9" cy="9.5" r="2.2" fill="#f5ad7d" {...stroke} /><path d="M6.3 16c.6-2.2 1.5-3.3 2.7-3.3 1.3 0 2.2 1.1 2.8 3.3Z" fill="#fff" {...stroke} /><path d="M14 9h3.2M14 13h3.2M14 17h3.2" fill="none" {...stroke} /></>,
    travel: <><path d="M5 4.5h14v13H5Z" fill="#65b59e" {...stroke} /><path d="M8 7h8v5H8Z" fill="#fff" {...stroke} /><circle cx="8.2" cy="18.4" r="1.5" fill="#f58a38" {...stroke} /><circle cx="15.8" cy="18.4" r="1.5" fill="#f58a38" {...stroke} /><path d="m8 21 2-2h4l2 2" fill="none" {...stroke} /></>,
    legal: <><path d="M12 4v15M6 7h12M8 7l-4 7h8ZM16 7l-4 7h8Z" fill="#f6c35d" {...stroke} /><path d="M8 20h8" fill="none" {...stroke} /></>,
    ration: <><path d="M5 6h14l-1 14H6Z" fill="#e8b66e" {...stroke} /><path d="M8 6a4 4 0 0 1 8 0" fill="none" {...stroke} /><path d="M9 11h6M9 15h6" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="1.5" /></>,
    transport: <><path d="m5 15 1.7-7h10.6l1.7 7Z" fill="#f58a38" {...stroke} /><path d="M4 15h16v3H4Z" fill="#fff" {...stroke} /><circle cx="7" cy="17.5" r="1.5" fill="#2b5575" /><circle cx="17" cy="17.5" r="1.5" fill="#2b5575" /></>,
    crisis: <><path d="M12 3.5 19 6v5.3c0 4.2-2.3 7.2-7 9.2-4.7-2-7-5-7-9.2V6Z" fill="#5a86c5" {...stroke} /><path d="m13.2 7-4 6h3l-1.4 4 4.5-6.3h-3Z" fill="#ffc85c" {...stroke} /></>,
    ageing: <><circle cx="10" cy="6.8" r="2.4" fill="#e5a676" {...stroke} /><path d="M10 9.5v6.3l-3 4M10 12l4 2.2 1.5 5.8M10 13l-3.5 1.2" fill="none" {...stroke} /><path d="M17.5 10v10M16.2 10h2.6" fill="none" stroke="#f58a38" strokeLinecap="round" strokeWidth="1.8" /></>,
    farmers: <><circle cx="17.5" cy="6.5" r="2.5" fill="#f6c35d" /><path d="M5 20h14" fill="none" {...stroke} /><path d="M12 20v-8M12 15c-4 0-5.8-2.1-6-5.5 4 0 6 1.9 6 5.5ZM12 12c.4-3.5 2.4-5.3 6-5.4-.1 3.4-2.1 5.3-6 5.4Z" fill="#70b46b" {...stroke} /></>,
    pensioners: <><rect x="4" y="5" width="16" height="15" rx="2" fill="#dbe8f5" {...stroke} /><path d="M4 9h16M8 3.5v3M16 3.5v3" fill="none" {...stroke} /><circle cx="10" cy="14" r="2" fill="#e7a073" {...stroke} /><path d="M7 19c.4-2 1.4-3 3-3s2.6 1 3 3" fill="#7598ca" {...stroke} /><path d="M15 13h2M15 16h2" fill="none" {...stroke} /></>,
    learning: <><path d="M4 6.5c3.2-.8 5.8-.1 8 2v11c-2.2-2.1-4.8-2.8-8-2Z" fill="#72a6db" {...stroke} /><path d="M20 6.5c-3.2-.8-5.8-.1-8 2v11c2.2-2.1 4.8-2.8 8-2Z" fill="#f4b95b" {...stroke} /><path d="M7 10h2.8M14.2 10H17" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="1.3" /></>,
    familyCare: <><circle cx="9" cy="7.8" r="2.7" fill="#e79b71" {...stroke} /><circle cx="16.5" cy="11" r="2" fill="#f0b47f" {...stroke} /><path d="M4.5 20c.4-5 1.9-7.5 4.5-7.5 2.7 0 4.2 2.5 4.6 7.5Z" fill="#b46eab" {...stroke} /><path d="M13.4 20c.2-3.2 1.3-4.8 3.1-4.8s3 1.6 3.2 4.8Z" fill="#71b4a2" {...stroke} /></>,
    youth: <><circle cx="9" cy="6.5" r="2.3" fill="#e6a276" {...stroke} /><path d="m15.8 4.5.9 2 2.2.2-1.7 1.4.5 2.1-1.9-1.1-1.9 1.1.5-2.1-1.7-1.4 2.2-.2Z" fill="#f6c35d" {...stroke} /><path d="M9 9.5v5.2l-3.7 4.8M9 12l4.2 2M9 14.7l3.2 4.8" fill="none" {...stroke} /></>,
    bank: <><circle cx="17.5" cy="16.5" r="3.2" fill="#f6c35d" {...stroke} /><path d="M4 8.5 11 4l7 4.5ZM5.5 10h11v8h-11ZM4 20h16" fill="#87b8d8" {...stroke} /><path d="M9 10v8M13 10v8" fill="none" stroke="#fff" strokeWidth="1.4" /></>,
    district: <><path d="M5 7 12 3.8 19 7v13H5Z" fill="#82b8da" {...stroke} /><path d="M9 20v-6h6v6M8 9h2M14 9h2" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="1.5" /><path d="M3 20h18" fill="none" {...stroke} /></>,
    grievance: <><path d="M4 5h16v11H9l-4 3v-3H4Z" fill="#f4b85f" {...stroke} /><path d="M12 8v4M12 14h.01" fill="none" stroke="#173f62" strokeLinecap="round" strokeWidth="1.8" /></>,
    utility: <><path d="M9 4v5M15 4v5M7 8h10v2a5 5 0 0 1-4 4.9V20h-2v-5.1A5 5 0 0 1 7 10Z" fill="#7eb4db" {...stroke} /><path d="M13.2 9.5 10 13h2.2l-1 2.5" fill="none" stroke="#f6c35d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></>,
    general: <><rect x="4" y="4" width="6" height="6" rx="1.3" fill="#73b89f" {...stroke} /><rect x="14" y="4" width="6" height="6" rx="1.3" fill="#f6c35d" {...stroke} /><rect x="4" y="14" width="6" height="6" rx="1.3" fill="#f58a38" {...stroke} /><rect x="14" y="14" width="6" height="6" rx="1.3" fill="#78a7d5" {...stroke} /></>,
  };

  return (
    <svg aria-hidden="true" className={`abstract-icon abstract-icon--${name}`} viewBox="0 0 24 24">
      {shapes[name]}
    </svg>
  );
}
