import Link from "next/link";
import { homeCopy } from "@/content/home-copy";
import { rtiCopy } from "@/content/rti-copy";
import { loadRtiRulePack } from "@/lib/engine/journey";

/**
 * The statutory path told as a journey, for someone who has never filed an RTI.
 *
 * Deliberately not the process map. That diagram belongs on the case page,
 * where it tracks a real case. This is the same law read left to right, so a
 * first-time visitor understands the shape before seeing the machinery.
 *
 * Day counts are read from the rule pack, never written here.
 */

const glyphs: Record<string, { bg: string; accent: string; art: React.ReactNode }> = {
  ask: {
    bg: "#155eef",
    accent: "#ffb020",
    art: (
      <>
        <rect x="15" y="16" width="26" height="24" rx="4" fill="#ffffff" />
        <path d="M15 20l13 10 13-10" fill="none" stroke="#155eef" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="41" cy="16" r="7" fill="#ffb020" />
      </>
    ),
  },
  wait: {
    bg: "#0369a1",
    accent: "#06b6d4",
    art: (
      <>
        <circle cx="28" cy="29" r="14" fill="#ffffff" />
        <path d="M28 21v9l6 4" fill="none" stroke="#0369a1" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="43" cy="14" r="6" fill="#06b6d4" />
      </>
    ),
  },
  silence: {
    bg: "#d92d20",
    accent: "#fbbf24",
    art: (
      <>
        <path d="M14 18h28v18H27l-8 7v-7h-5z" fill="#ffffff" />
        <path d="M22 27h12" stroke="#d92d20" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="43" cy="15" r="6" fill="#fbbf24" />
      </>
    ),
  },
  first: {
    bg: "#008f70",
    accent: "#22c55e",
    art: (
      <>
        <rect x="16" y="14" width="22" height="28" rx="4" fill="#ffffff" />
        <path d="M21 23h12M21 30h12M21 37h7" stroke="#008f70" strokeWidth="3" strokeLinecap="round" />
        <path d="M41 34V20m0 0l-5 5m5-5l5 5" fill="none" stroke="#22c55e" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  decide: {
    bg: "#7c3aed",
    accent: "#ec4899",
    art: (
      <>
        <circle cx="28" cy="29" r="14" fill="#ffffff" />
        <path d="M28 20v9l7 3" fill="none" stroke="#7c3aed" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="43" cy="14" r="6" fill="#ec4899" />
      </>
    ),
  },
  second: {
    bg: "#c026d3",
    accent: "#f97316",
    art: (
      <>
        <path d="M28 12l16 8H12z" fill="#ffffff" />
        <rect x="17" y="23" width="4.5" height="14" rx="1.6" fill="#ffffff" />
        <rect x="25.8" y="23" width="4.5" height="14" rx="1.6" fill="#ffffff" />
        <rect x="34.6" y="23" width="4.5" height="14" rx="1.6" fill="#ffffff" />
        <rect x="13" y="39" width="30" height="4.6" rx="2" fill="#f97316" />
      </>
    ),
  },
};

function StageIcon({ id }: { id: string }) {
  const glyph = glyphs[id];
  if (!glyph) return null;

  return (
    <span aria-hidden="true" className="journey-stage__icon">
      <svg viewBox="0 0 56 56" focusable="false">
        <rect width="56" height="56" rx="17" fill={glyph.bg} />
        {glyph.art}
      </svg>
    </span>
  );
}

export function JourneyStrip() {
  const pack = loadRtiRulePack();
  const clockDays = (nodeId: string) =>
    pack.nodes.find((node) => node.id === nodeId)?.clock?.days ?? null;

  const replyDays = clockDays("await_reply");
  const firstAppealDays = clockDays("first_appeal");
  const secondAppealDays = clockDays("second_appeal");
  const copy = homeCopy.journey;

  // Every label below is derived from the pack, or from the authored flow copy
  // in the case of the forty five day decision window.
  const dayLabel: Record<string, string> = {
    ask: "Day 0",
    wait: replyDays ? `${replyDays} days` : "",
    silence: replyDays ? `Day ${replyDays + 1}` : "",
    first: firstAppealDays ? `${firstAppealDays} days to file` : "",
    decide: rtiCopy.tracker.flow.withinFortyFive,
    second: secondAppealDays ? `${secondAppealDays} days to file` : "",
  };

  return (
    <section className="utility-section home-journey" aria-labelledby="home-journey-heading">
      <div className="utility-section__heading">
        <h2 id="home-journey-heading">{copy.heading}</h2>
        <p>{copy.intro}</p>
      </div>

      <ol className="journey-strip">
        {copy.stages.map((stage, index) => (
          <li className="journey-stage" key={stage.id}>
            <span aria-hidden="true" className="journey-stage__step">
              {index + 1}
            </span>
            <StageIcon id={stage.id} />
            <span className="journey-stage__day">{dayLabel[stage.id]}</span>
            <strong className="journey-stage__title">{stage.title}</strong>
            <span className="journey-stage__line">{stage.line}</span>
          </li>
        ))}
      </ol>

      <div className="home-journey__footer">
        <Link className="rti-primary" href={copy.href}>
          {copy.linkLabel}
        </Link>
        <p>{copy.footnote}</p>
      </div>
    </section>
  );
}
