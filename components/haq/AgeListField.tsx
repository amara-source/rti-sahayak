"use client";

import { useState } from "react";
import { haqCopy } from "@/content/haq-copy";

interface AgeListFieldProps {
  initialAges?: number[];
  kind: "children" | "parents";
  onContinue: (ages: number[]) => void;
}

export function AgeListField({
  initialAges,
  kind,
  onContinue,
}: AgeListFieldProps) {
  const [ages, setAges] = useState<(number | "")[]>(
    initialAges && initialAges.length > 0 ? initialAges : [""],
  );
  const addLabel =
    kind === "children"
      ? haqCopy.profile.controls.addChild
      : haqCopy.profile.controls.addParent;
  const noneLabel =
    kind === "children"
      ? haqCopy.profile.controls.noChildren
      : haqCopy.profile.controls.noParents;

  function updateAge(index: number, value: string) {
    const next = [...ages];
    next[index] = value === "" ? "" : Number(value);
    setAges(next);
  }

  return (
    <div className="age-list-field">
      <div className="age-input-list">
        {ages.map((age, index) => (
          <div className="age-input-row" key={index}>
            <label htmlFor={`age-${kind}-${index}`}>
              {haqCopy.profile.controls.age} {index + 1}
            </label>
            <input
              id={`age-${kind}-${index}`}
              inputMode="numeric"
              max="120"
              min="0"
              onChange={(event) => updateAge(index, event.target.value)}
              type="number"
              value={age}
            />
            {ages.length > 1 ? (
              <button
                className="age-remove"
                onClick={() =>
                  setAges(ages.filter((_, candidate) => candidate !== index))
                }
                type="button"
              >
                {haqCopy.profile.controls.remove}
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <div className="age-field-actions">
        <button
          className="secondary-action"
          onClick={() => setAges([...ages, ""])}
          type="button"
        >
          {addLabel}
        </button>
        <button
          className="secondary-action"
          onClick={() => onContinue([])}
          type="button"
        >
          {noneLabel}
        </button>
        <button
          className="primary-action"
          disabled={ages.some((age) => age === "")}
          onClick={() => onContinue(ages as number[])}
          type="button"
        >
          {haqCopy.profile.continue}
        </button>
      </div>
    </div>
  );
}
