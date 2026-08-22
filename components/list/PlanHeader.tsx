import { journeyCopy } from "@/content/journey-copy";

interface PlanHeaderProps {
  code: string;
  eventLabel: string;
}

export function PlanHeader({ code, eventLabel }: PlanHeaderProps) {
  return (
    <header className="plan-header">
      <p>{journeyCopy.list.eyebrow}</p>
      <h1>{eventLabel}</h1>
      <span>{journeyCopy.list.intro}</span>
      <div className="plan-code">
        <strong>{journeyCopy.list.planCode}</strong>
        <code>{code}</code>
        <small>{journeyCopy.list.browserNote}</small>
      </div>
    </header>
  );
}
