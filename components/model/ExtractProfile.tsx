"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SensitiveField } from "@/components/haq/SensitiveField";
import { haqCopy } from "@/content/haq-copy";
import { modelCopy } from "@/content/model-copy";
import type { Profile } from "@/lib/engine/types";

type ReviewFieldName = keyof typeof modelCopy.extract.fieldLabel;

function reviewFields(profile: Partial<Profile>): ReviewFieldName[] {
  return Object.keys(profile).filter(
    (field): field is ReviewFieldName => field in modelCopy.extract.fieldLabel,
  );
}

function AgeCorrection({
  ages,
  label,
  onChange,
}: {
  ages: number[];
  label: string;
  onChange: (ages: number[]) => void;
}) {
  const [draft, setDraft] = useState(ages.join(", "));

  return (
    <input
      aria-label={label}
      inputMode="numeric"
      onBlur={() =>
        onChange(
          draft
            .split(",")
            .map((value) => Number(value.trim()))
            .filter((age) => Number.isInteger(age) && age >= 0 && age <= 120),
        )
      }
      onChange={(event) => setDraft(event.target.value)}
      value={draft}
    />
  );
}

function ReviewControl({
  field,
  profile,
  update,
}: {
  field: ReviewFieldName;
  profile: Partial<Profile>;
  update: (field: ReviewFieldName, value: unknown) => void;
}) {
  const value = profile[field];

  if (field === "gender") {
    return (
      <SensitiveField
        legend={modelCopy.extract.fieldLabel[field]}
        onSelect={(next) => update(field, next)}
        options={haqCopy.profile.options.gender}
        selected={typeof value === "string" ? value : undefined}
      />
    );
  }
  if (field === "category") {
    return (
      <SensitiveField
        legend={modelCopy.extract.fieldLabel[field]}
        onSelect={(next) => update(field, next)}
        options={haqCopy.profile.options.category}
        selected={typeof value === "string" ? value : undefined}
      />
    );
  }
  if (field === "incomeBand") {
    return (
      <SensitiveField
        legend={modelCopy.extract.fieldLabel[field]}
        onSelect={(next) => update(field, next)}
        options={haqCopy.profile.options.incomeBand}
        selected={typeof value === "string" ? value : undefined}
      />
    );
  }
  if (field === "hasDisability") {
    const selected =
      value === null ? "NA" : value === true ? "yes" : value === false ? "no" : undefined;
    return (
      <SensitiveField
        legend={modelCopy.extract.fieldLabel[field]}
        onSelect={(next) =>
          update(field, next === "NA" ? null : next === "yes")
        }
        options={haqCopy.profile.options.disability}
        selected={selected}
      />
    );
  }
  if (field === "childrenAges" || field === "parentsAges") {
    return (
      <AgeCorrection
        ages={Array.isArray(value) ? value : []}
        label={modelCopy.extract.fieldLabel[field]}
        onChange={(next) => update(field, next)}
      />
    );
  }

  const optionSets = {
    employment: haqCopy.profile.options.employment,
    marital: haqCopy.profile.options.marital,
    housing: haqCopy.profile.options.housing,
  } as const;

  if (field in optionSets) {
    const options = optionSets[field as keyof typeof optionSets];
    return (
      <select
        aria-label={modelCopy.extract.fieldLabel[field]}
        onChange={(event) => update(field, event.target.value)}
        value={typeof value === "string" ? value : ""}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field === "isSingleParent") {
    return (
      <select
        aria-label={modelCopy.extract.fieldLabel[field]}
        onChange={(event) => update(field, event.target.value === "yes")}
        value={value === true ? "yes" : "no"}
      >
        {haqCopy.profile.options.yesNo.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      aria-label={modelCopy.extract.fieldLabel[field]}
      onChange={(event) => update(field, event.target.value)}
      type={field === "dob" ? "date" : "text"}
      value={typeof value === "string" ? value : ""}
    />
  );
}

export function ExtractProfile() {
  const router = useRouter();
  const [freeText, setFreeText] = useState("");
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function extract() {
    setIsPending(true);
    setError(null);
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freeText }),
      });
      const result = (await response.json()) as {
        code?: unknown;
        error?: unknown;
        [key: string]: unknown;
      };
      if (!response.ok) {
        setError(
          result.code === "RESTRICTED_IDENTIFIER"
            ? modelCopy.extract.restricted
            : modelCopy.extract.unavailable,
        );
        return;
      }
      setProfile(result as Partial<Profile>);
    } catch {
      setError(modelCopy.extract.unavailable);
    } finally {
      setIsPending(false);
    }
  }

  function update(field: ReviewFieldName, value: unknown) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function remove(field: ReviewFieldName) {
    setProfile((current) => {
      const next = { ...current } as Record<string, unknown>;
      delete next[field];
      return next as Partial<Profile>;
    });
  }

  async function confirm() {
    if (!profile) return;
    setIsConfirming(true);
    setError(null);
    try {
      const response = await fetch("/api/haq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      if (!response.ok) throw new Error("Profile save failed");
      router.push("/haq/results");
      router.refresh();
    } catch {
      setError(modelCopy.extract.saveFailure);
      setIsConfirming(false);
    }
  }

  const fields = profile ? reviewFields(profile) : [];

  if (profile) {
    return (
      <section className="extract-review" aria-labelledby="extract-review-heading">
        <header>
          <p>{modelCopy.extract.reviewEyebrow}</p>
          <h2 id="extract-review-heading">{modelCopy.extract.reviewHeading}</h2>
          <span>{modelCopy.extract.reviewDescription}</span>
        </header>
        {fields.length > 0 ? (
          <div className="extract-review-list">
            {fields.map((field) => (
              <section className="extract-review-field" key={field}>
                <div className="extract-review-field__heading">
                  <h3>{modelCopy.extract.fieldLabel[field]}</h3>
                  <button onClick={() => remove(field)} type="button">
                    {modelCopy.extract.remove}
                  </button>
                </div>
                <ReviewControl field={field} profile={profile} update={update} />
              </section>
            ))}
          </div>
        ) : (
          <p className="extract-empty">{modelCopy.extract.noFields}</p>
        )}
        {error ? <p className="model-unavailable" role="alert">{error}</p> : null}
        <div className="extract-actions">
          {fields.length > 0 ? (
            <button
              className="primary-action"
              disabled={isConfirming}
              onClick={confirm}
              type="button"
            >
              {isConfirming
                ? modelCopy.extract.confirming
                : modelCopy.extract.confirm}
            </button>
          ) : null}
          <button
            className="secondary-action"
            onClick={() => {
              setProfile(null);
              setError(null);
            }}
            type="button"
          >
            {modelCopy.extract.revise}
          </button>
          <Link className="text-link" href="/haq">
            {modelCopy.extract.form}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="extract-input-card">
      <label htmlFor="profile-description">{modelCopy.extract.inputLabel}</label>
      <textarea
        id="profile-description"
        maxLength={2_000}
        onChange={(event) => setFreeText(event.target.value)}
        placeholder={modelCopy.extract.placeholder}
        rows={7}
        value={freeText}
      />
      <button
        className="primary-action"
        disabled={isPending || freeText.trim().length < 2}
        onClick={extract}
        type="button"
      >
        {isPending ? modelCopy.extract.pending : modelCopy.extract.action}
      </button>
      {error ? <p className="model-unavailable" role="alert">{error}</p> : null}
      <Link className="text-link" href="/haq">
        {modelCopy.extract.form}
      </Link>
    </section>
  );
}
