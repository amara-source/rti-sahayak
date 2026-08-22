"use client";

import { useState } from "react";
import { journeyCopy } from "@/content/journey-copy";

interface AckInputProps {
  disabled: boolean;
  initialValue: string;
  onSave: (ack: string) => void;
}

export function AckInput({
  disabled,
  initialValue,
  onSave,
}: AckInputProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className="ack-input"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(value);
      }}
    >
      <label htmlFor="reference-number">{journeyCopy.detail.reference}</label>
      <p>{journeyCopy.detail.referenceHelp}</p>
      <div>
        <input
          disabled={disabled}
          id="reference-number"
          onChange={(event) => setValue(event.target.value)}
          placeholder={journeyCopy.detail.referencePlaceholder}
          required
          type="text"
          value={value}
        />
        <button disabled={disabled} type="submit">
          {journeyCopy.detail.referenceAction}
        </button>
      </div>
    </form>
  );
}
