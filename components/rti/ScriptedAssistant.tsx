"use client";

import { useEffect, useRef, useState } from "react";
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
      <svg viewBox="0 0 48 48" role="presentation">
        <rect className="ask-avatar__plate" width="48" height="48" rx="14" />
        <circle className="ask-avatar__face" cx="24" cy="25" r="12.5" />
        <circle className="ask-avatar__eye" cx="19.5" cy="23" r="2" />
        <circle className="ask-avatar__eye" cx="28.5" cy="23" r="2" />
        <path className="ask-avatar__smile" d="M19 29.5a6 6 0 0 0 10 0" />
        <path className="ask-avatar__antenna" d="M24 12.5V8" />
        <circle className="ask-avatar__spark" cx="24" cy="6.5" r="3" />
      </svg>
    </span>
  );
}

export function ScriptedAssistant({
  answers,
  compact = false,
}: {
  answers: ScriptedAnswer[];
  compact?: boolean;
}) {
  const copy = rtiCopy.ask;
  const [turns, setTurns] = useState<Turn[]>([]);
  const threadRef = useRef<HTMLElement | null>(null);

  // Bring the new exchange to the top of the thread, question first. Without
  // this the answer is appended below the fold and clicking a chip looks like
  // it did nothing. Setting scrollTop directly rather than calling
  // scrollIntoView keeps this deterministic and inside this one container.
  useEffect(() => {
    const thread = threadRef.current;
    if (!thread || !turns.length) return;
    const messages = thread.querySelectorAll(".ask-message");
    // The question of the pair just added, so it reads in order.
    const target = messages[messages.length - 2] ?? messages[messages.length - 1];
    if (!target) return;
    thread.scrollTop += target.getBoundingClientRect().top - thread.getBoundingClientRect().top;
  }, [turns]);

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
    <div className={compact ? "scripted-assistant is-compact" : "scripted-assistant"}>
      <p className="scripted-assistant__label">{copy.label}</p>

      <section className="ask-thread" aria-label={copy.assistant} ref={threadRef}>
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
