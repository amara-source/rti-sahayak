"use client";

import Link from "next/link";
import { useState } from "react";
import { journeyCopy } from "@/content/journey-copy";
import type { IntakeQuestion, RenderedNode } from "@/lib/engine/types";
import { ProvisionalListPeek } from "./ProvisionalListPeek";
import { QuestionScreen } from "./QuestionScreen";

interface JourneyIntakeProps {
  eventId: string;
  eventLabel: string;
  questions: IntakeQuestion[];
}

interface PlanResponse {
  code: string;
  nodes: RenderedNode[];
}

interface ChangeCounts {
  added: number;
  removed: number;
  warnings: number;
}

function compareNodes(previous: RenderedNode[], next: RenderedNode[]) {
  const previousById = new Map(previous.map((node) => [node.id, node]));
  const nextById = new Map(next.map((node) => [node.id, node]));
  const addedIds = next
    .filter((node) => !previousById.has(node.id))
    .map((node) => node.id);
  const removed = previous.filter((node) => !nextById.has(node.id)).length;
  let warnings = 0;
  const changedIds = [...addedIds];

  for (const node of next) {
    const previousNode = previousById.get(node.id);

    if (!previousNode) {
      warnings += node.warnings.length;
      continue;
    }

    const previousWarnings = new Set(
      previousNode.warnings.map((warning) => warning.text),
    );
    const addedWarnings = node.warnings.filter(
      (warning) => !previousWarnings.has(warning.text),
    ).length;

    if (
      addedWarnings > 0 ||
      previousNode.bucket !== node.bucket ||
      previousNode.locked !== node.locked
    ) {
      changedIds.push(node.id);
    }
    warnings += addedWarnings;
  }

  return {
    changedIds,
    counts: { added: addedIds.length, removed, warnings },
  };
}

export function JourneyIntake({
  eventId,
  eventLabel,
  questions,
}: JourneyIntakeProps) {
  const initialQuestionCount = Math.min(3, questions.length);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [nodes, setNodes] = useState<RenderedNode[]>([]);
  const [code, setCode] = useState<string | null>(null);
  const [showProvisional, setShowProvisional] = useState(false);
  const [changedIds, setChangedIds] = useState<string[]>([]);
  const [changeCounts, setChangeCounts] = useState<ChangeCounts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function generatePlan(nextAnswers: Record<string, unknown>) {
    setIsPending(true);
    setError(null);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, answers: nextAnswers }),
      });

      if (!response.ok) {
        throw new Error("Plan request failed");
      }

      const result = (await response.json()) as PlanResponse;
      const changes = nodes.length > 0 ? compareNodes(nodes, result.nodes) : null;

      setCode(result.code);
      setNodes(result.nodes);
      setChangedIds(changes?.changedIds ?? []);
      setChangeCounts(changes?.counts ?? null);
      setShowProvisional(true);
      return true;
    } catch {
      setError(journeyCopy.intake.error);
      return false;
    } finally {
      setIsPending(false);
    }
  }

  async function moveForward(value?: string) {
    if (isPending) {
      return;
    }

    const question = questions[questionIndex];
    const nextAnswers = { ...answers };

    if (value !== undefined) {
      nextAnswers[question.k] = value;
    }

    setAnswers(nextAnswers);
    const nextIndex = questionIndex + 1;

    if (nextIndex >= initialQuestionCount) {
      const generated = await generatePlan(nextAnswers);

      if (generated) {
        setQuestionIndex(nextIndex);
      }
    } else {
      setQuestionIndex(nextIndex);
    }
  }

  if (showProvisional) {
    const remainder = questions.length - questionIndex;
    const changedTotal = changeCounts
      ? changeCounts.added + changeCounts.removed + changeCounts.warnings
      : 0;

    return (
      <section className="intake-page">
        <div className="site-shell provisional-page__inner">
          <header className="provisional-heading">
            <p>{journeyCopy.intake.provisionalLabel}</p>
            <h1>{journeyCopy.intake.provisionalHeading}</h1>
            <span>{journeyCopy.intake.provisionalDescription}</span>
          </header>

          {changeCounts ? (
            <p className={changedTotal > 0 ? "change-notice has-change" : "change-notice"} role="status">
              {changedTotal > 0
                ? journeyCopy.intake.changeSummary(changeCounts)
                : journeyCopy.intake.noChange}
            </p>
          ) : null}

          <ProvisionalListPeek changedIds={changedIds} nodes={nodes} />

          {error ? <p className="form-error" role="alert">{error}</p> : null}

          <div className="provisional-actions">
            {remainder > 0 ? (
              <button
                className="primary-action"
                onClick={() => {
                  setShowProvisional(false);
                  setChangedIds([]);
                  setChangeCounts(null);
                }}
                type="button"
              >
                {journeyCopy.intake.sharpen(remainder)}
              </button>
            ) : code ? (
              <Link
                className="primary-action"
                href={`/events/${eventId}/list?code=${code}`}
              >
                {journeyCopy.intake.finalAction}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  const question = questions[questionIndex];

  return (
    <>
      <QuestionScreen
        current={questionIndex + 1}
        eventLabel={eventLabel}
        onAnswer={moveForward}
        onSkip={() => moveForward()}
        question={question}
        total={questions.length}
      />
      {error ? <p className="form-error intake-error" role="alert">{error}</p> : null}
    </>
  );
}
