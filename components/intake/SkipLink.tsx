import { journeyCopy } from "@/content/journey-copy";

interface SkipLinkProps {
  onSkip?: () => void;
}

export function SkipLink({ onSkip }: SkipLinkProps) {
  return (
    <button className="skip-question" onClick={onSkip} type="button">
      {journeyCopy.intake.skip}
    </button>
  );
}
