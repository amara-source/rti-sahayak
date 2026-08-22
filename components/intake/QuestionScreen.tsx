import { journeyCopy, intakeOptionLabel } from "@/content/journey-copy";
import type { IntakeQuestion } from "@/lib/engine/types";
import { OptionButton } from "./OptionButton";
import { ProgressBar } from "./ProgressBar";
import { SkipLink } from "./SkipLink";

interface QuestionScreenProps {
  eventLabel: string;
  question: IntakeQuestion;
  current: number;
  total: number;
  onAnswer?: (value: string) => void;
  onSkip?: () => void;
}

export function QuestionScreen({
  eventLabel,
  question,
  current,
  total,
  onAnswer,
  onSkip,
}: QuestionScreenProps) {
  return (
    <section className="intake-page">
      <div className="site-shell intake-page__inner">
        <div className="intake-card">
          <div className="intake-card__context">
            <p>{journeyCopy.intake.eyebrow}</p>
            <strong>{eventLabel}</strong>
          </div>
          <ProgressBar current={current} total={total} />
          <h1>{question.q}</h1>
          <div className="option-list">
            {question.opts.map((option) => (
              <OptionButton
                key={option}
                label={intakeOptionLabel(question.k, option)}
                onChoose={onAnswer ? () => onAnswer(option) : undefined}
              />
            ))}
          </div>
          <SkipLink onSkip={onSkip} />
        </div>
      </div>
    </section>
  );
}
