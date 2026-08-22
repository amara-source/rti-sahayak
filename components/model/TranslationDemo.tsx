"use client";

import { useState } from "react";
import { modelCopy } from "@/content/model-copy";

interface FormValues {
  current: string;
  next: string;
  situation: string;
}

const initialHindi: FormValues = {
  current: "बिहार, पटना",
  next: "कर्नाटक, बेंगलुरु",
  situation: "मैं अगले महीने दो बच्चों के साथ जा रही हूँ।",
};

function markedText(values: FormValues): string {
  return `[current]\n${values.current}\n[next]\n${values.next}\n[situation]\n${values.situation}`;
}

function parseMarkedText(text: string): FormValues | null {
  const match = text.match(
    /\[current\]\s*([\s\S]*?)\s*\[next\]\s*([\s\S]*?)\s*\[situation\]\s*([\s\S]*)/,
  );
  if (!match) return null;

  return {
    current: match[1].trim(),
    next: match[2].trim(),
    situation: match[3].trim(),
  };
}

export function TranslationDemo() {
  const [hindi, setHindi] = useState<FormValues>(initialHindi);
  const [kannada, setKannada] = useState<FormValues | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof FormValues, value: string) {
    setHindi((current) => ({ ...current, [field]: value }));
  }

  async function translate() {
    setIsPending(true);
    setError(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: markedText(hindi), from: "hi", to: "kn" }),
      });
      if (!response.ok) throw new Error("Translation unavailable");
      const result = (await response.json()) as { text?: unknown };
      const parsed =
        typeof result.text === "string" ? parseMarkedText(result.text) : null;
      if (!parsed) throw new Error("Translation format invalid");
      setKannada(parsed);
    } catch {
      setError(modelCopy.translate.unavailable);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="translation-stage">
      <section className="translation-panel translation-panel--input">
        <h2>{modelCopy.translate.inputPanel}</h2>
        <label>
          {modelCopy.translate.fields.current}
          <input
            lang="hi"
            onChange={(event) => update("current", event.target.value)}
            value={hindi.current}
          />
        </label>
        <label>
          {modelCopy.translate.fields.next}
          <input
            lang="hi"
            onChange={(event) => update("next", event.target.value)}
            value={hindi.next}
          />
        </label>
        <label>
          {modelCopy.translate.fields.situation}
          <textarea
            lang="hi"
            onChange={(event) => update("situation", event.target.value)}
            rows={5}
            value={hindi.situation}
          />
        </label>
        <button
          className="primary-action"
          disabled={isPending}
          onClick={translate}
          type="button"
        >
          {isPending ? modelCopy.translate.pending : modelCopy.translate.action}
        </button>
        {error ? <p className="model-unavailable" role="alert">{error}</p> : null}
      </section>

      <section className="translation-panel translation-panel--output" aria-live="polite">
        <h2>{modelCopy.translate.outputPanel}</h2>
        {kannada ? (
          <div className="translated-form">
            <label>
              {modelCopy.translate.fields.currentKn}
              <input lang="kn" readOnly value={kannada.current} />
            </label>
            <label>
              {modelCopy.translate.fields.nextKn}
              <input lang="kn" readOnly value={kannada.next} />
            </label>
            <label>
              {modelCopy.translate.fields.situationKn}
              <textarea lang="kn" readOnly rows={5} value={kannada.situation} />
            </label>
          </div>
        ) : (
          <p className="translation-empty">{modelCopy.translate.empty}</p>
        )}
      </section>
    </div>
  );
}
