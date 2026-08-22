import { journeyCopy } from "@/content/journey-copy";

interface RouteListProps {
  dependencies: string[];
  dependents: string[];
}

export function RouteList({ dependencies, dependents }: RouteListProps) {
  if (dependencies.length === 0 && dependents.length === 0) {
    return null;
  }

  return (
    <div className="route-list">
      {dependencies.length > 0 ? (
        <section>
          <h2>{journeyCopy.detail.completeFirst}</h2>
          <ul>
            {dependencies.map((title) => <li key={title}>{title}</li>)}
          </ul>
        </section>
      ) : null}
      {dependents.length > 0 ? (
        <section>
          <h2>{journeyCopy.detail.unlocksNext}</h2>
          <ul>
            {dependents.map((title) => <li key={title}>{title}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
