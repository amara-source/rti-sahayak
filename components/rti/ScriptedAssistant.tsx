"use client";

import { useState } from "react";
import { FilledIcon } from "./FilledIcon";

export interface ScriptedAnswer {
  id: string;
  question: string;
  answer: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

const fallback = "I only answer from the RTI Act and this prototype's rule pack. I cannot answer that.";

export function ScriptedAssistant({ answers }: { answers: ScriptedAnswer[] }) {
  const [selected, setSelected] = useState<ScriptedAnswer | null>(answers[0] ?? null);
  const [outsidePack, setOutsidePack] = useState(false);

  return (
    <div className="scripted-assistant">
      <p className="scripted-assistant__label">Scripted prototype. Answers come from the rule pack, not from a language model.</p>
      <div className="scripted-assistant__layout">
        <div className="scripted-assistant__questions" aria-label="Choose a question">
          {answers.map((item) => (
            <button
              aria-pressed={!outsidePack && selected?.id === item.id}
              className="rti-secondary"
              key={item.id}
              onClick={() => { setSelected(item); setOutsidePack(false); }}
              type="button"
            >
              {item.question}
            </button>
          ))}
          <button
            aria-pressed={outsidePack}
            className="rti-secondary"
            onClick={() => setOutsidePack(true)}
            type="button"
          >
            Ask something outside this rule pack
          </button>
        </div>

        <article className="scripted-assistant__answer" aria-live="polite">
          <FilledIcon seed={`ask:${outsidePack ? "outside" : selected?.id ?? "empty"}`} />
          <span className="scripted-assistant__sender">RTI Sahayak</span>
          {outsidePack ? (
            <p>{fallback}</p>
          ) : selected ? (
            <>
              <h2>{selected.question}</h2>
              <p>{selected.answer}</p>
              {selected.sourceUrl && selected.sourceLabel ? (
                <a href={selected.sourceUrl} rel="noreferrer" target="_blank">Source: {selected.sourceLabel}</a>
              ) : null}
            </>
          ) : null}
        </article>
      </div>
    </div>
  );
}
