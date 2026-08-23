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
      <p className="plan-code">
        <span>{journeyCopy.list.planCode}</span>
        <code>{code}</code>
      </p>
    </header>
  );
}
