import Link from "next/link";
import { rtiCopy } from "@/content/rti-copy";

export type JourneyProgressStep =
  | "describe"
  | "jurisdiction"
  | "authority"
  | "draft"
  | "checks"
  | "submit"
  | "track";

const paths: Record<Exclude<JourneyProgressStep, "track">, string> = {
  describe: "/file",
  jurisdiction: "/file/jurisdiction",
  authority: "/file/authority",
  draft: "/file/draft",
  checks: "/file/checks",
  submit: "/file/submit",
};

const order: JourneyProgressStep[] = [
  "describe",
  "jurisdiction",
  "authority",
  "draft",
  "checks",
  "submit",
  "track",
];

export function JourneyProgress({ current }: { current: JourneyProgressStep }) {
  const currentIndex = order.indexOf(current);

  return (
    <nav aria-label={rtiCopy.journeyProgress.label} className="rti-journey-progress">
      <ol>
        {order.map((step, index) => {
          const complete = index < currentIndex;
          const className = complete
            ? "is-complete"
            : index === currentIndex
              ? "is-current"
              : "is-upcoming";
          const content = (
            <>
              <span aria-hidden="true" className="rti-journey-progress__marker">
                {index + 1}
              </span>
              <span>{rtiCopy.journeyProgress.steps[step]}</span>
            </>
          );

          return (
            <li className={className} key={step}>
              {complete && step !== "track" ? (
                <Link href={paths[step]}>{content}</Link>
              ) : (
                <span aria-current={index === currentIndex ? "step" : undefined}>
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
