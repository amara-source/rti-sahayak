export type HeroTone = "blue" | "teal" | "orange" | "violet";

export function PageHero({
  eyebrow,
  title,
  supporting,
  illustration,
  tone = "blue",
}: {
  eyebrow: string;
  title: string;
  supporting: string;
  illustration: string;
  tone?: HeroTone;
}) {
  return (
    <header className={`rti-page-hero rti-page-hero--${tone}`}>
      <div className="rti-page-hero__inner">
        <div className="rti-page-hero__copy">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <div>{supporting}</div>
        </div>
        <div className="rti-page-hero__art" aria-hidden="true">
          <img
            alt=""
            height={667}
            src={illustration}
            width={1000}
          />
        </div>
      </div>
    </header>
  );
}
