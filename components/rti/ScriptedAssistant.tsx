"use client";

import { useState } from "react";
import { rtiCopy } from "@/content/rti-copy";

export interface ScriptedAnswer {
  id: string;
  question: string;
  answer: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

interface Turn {
  key: string;
  question: string;
  answer: string;
  sourceLabel?: string;
  sourceUrl?: string;
  refused: boolean;
}

/**
 * A distinct mark for the assistant, so a reply is never mistaken for the
 * citizen's own words. Deliberately not one of the concept icons used elsewhere.
 */
function AssistantAvatar() {
  return (
    <span aria-hidden="true" className="ask-avatar">
      <svg viewBox="0 0 32 32" role="presentation">
        <rect className="ask-avatar__body" height="18" rx="6" width="24" x="4" y="9" />
        <circle className="ask-avatar__eye" cx="12" cy="17" r="2.1" />
        <circle className="ask-avatar__eye" cx="20" cy="17" r="2.1" />
        <path className="ask-avatar__antenna" d="M16 9V4" />
        <circle className="ask-avatar__dot" cx="16" cy="3.2" r="2.2" />
      </svg>
    </span>
  );
}

export function ScriptedAssistant({ answers }: { answers: ScriptedAnswer[] }) {
  const copy = rtiCopy.ask;
  const [turns, setTurns] = useState<Turn[]>([]);

  function ask(item: ScriptedAnswer) {
    setTurns((current) => [
      ...current,
      {
        key: `${item.id}-${current.length}`,
        question: item.question,
        answer: item.answer,
        sourceLabel: item.sourceLabel,
        sourceUrl: item.sourceUrl,
        refused: false,
      },
    ]);
  }

  function askOutside() {
    setTurns((current) => [
      ...current,
      {
        key: `outside-${current.length}`,
        question: copy.outsideQuestion,
        answer: copy.fallback,
        refused: true,
      },
    ]);
  }

  return (
    <div className="scripted-assistant">
      <p className="scripted-assistant__label">{copy.label}</p>

      <section className="ask-thread" aria-label={copy.assistant}>
        <header className="ask-thread__header">
          <AssistantAvatar />
          <div>
            <strong>{copy.assistant}</strong>
            <span>{copy.assistantRole}</span>
          </div>
          {turns.length ? (
            <button
              className="ask-thread__reset"
              onClick={() => setTurns([])}
              type="button"
            >
              {copy.reset}
            </button>
          ) : null}
        </header>

        <div className="ask-thread__messages" aria-live="polite">
          <article className="ask-message ask-message--assistant">
            <AssistantAvatar />
            <div className="ask-bubble">
              <span className="ask-message__sender">{copy.assistant}</span>
              <p>{copy.opening}</p>
            </div>
          </article>

          {turns.map((turn) => (
            <div className="ask-turn" key={turn.key}>
              <article className="ask-message ask-message--user">
                <div className="ask-bubble">
                  <span className="ask-message__sender">{copy.you}</span>
                  <p>{turn.question}</p>
                </div>
              </article>
              <article
                className={
                  turn.refused
                    ? "ask-message ask-message--assistant is-refusal"
                    : "ask-message ask-message--assistant"
                }
              >
                <AssistantAvatar />
                <div className="ask-bubble">
                  <span className="ask-message__sender">{copy.assistant}</span>
                  <p>{turn.answer}</p>
                  {turn.sourceUrl && turn.sourceLabel ? (
                    <a href={turn.sourceUrl} rel="noreferrer" target="_blank">
                      {copy.sourcePrefix}: {turn.sourceLabel}
                    </a>
                  ) : null}
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="ask-chips" aria-label={copy.chipsHeading}>
        <h2>{copy.chipsHeading}</h2>
        <p>{copy.chipsNote}</p>
        <div className="ask-chips__row">
          {answers.map((item) => (
            <button
              className="rti-secondary"
              key={item.id}
              onClick={() => ask(item)}
              type="button"
            >
              {item.question}
            </button>
          ))}
          <button
            className="rti-secondary ask-chips__outside"
            onClick={askOutside}
            type="button"
          >
            {copy.outside}
          </button>
        </div>
      </section>
    </div>
  );
}
