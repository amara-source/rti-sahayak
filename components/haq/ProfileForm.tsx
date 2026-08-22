"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { haqCopy } from "@/content/haq-copy";
import type { EntitlementProfileField } from "@/lib/engine/profile-fields";
import type { Profile } from "@/lib/engine/types";
import { AgeListField } from "./AgeListField";
import { HaqModelActions } from "./HaqModelActions";
import { SensitiveField } from "./SensitiveField";

interface ProfileFormProps {
  fields: EntitlementProfileField[];
  initialProfile: Profile;
}

type Option = { label: string; value: string };

function standardOptions(field: EntitlementProfileField): readonly Option[] | null {
  if (field === "employment") return haqCopy.profile.options.employment;
  if (field === "marital") return haqCopy.profile.options.marital;
  if (field === "isSingleParent") return haqCopy.profile.options.yesNo;
  if (field === "housing") return haqCopy.profile.options.housing;
  return null;
}

export function ProfileForm({ fields, initialProfile }: ProfileFormProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const field = fields[index];

  async function save(nextProfile: Profile) {
    setIsPending(true);
    setError(null);
    try {
      const response = await fetch("/api/haq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: nextProfile }),
      });
      if (!response.ok) throw new Error("Profile request failed");
      router.push("/haq/results");
      router.refresh();
    } catch {
      setError(haqCopy.profile.error);
      setIsPending(false);
    }
  }

  async function moveForward(value?: unknown, skipped = false) {
    if (isPending) return;
    const nextProfile = { ...profile } as Record<string, unknown>;
    if (skipped) delete nextProfile[field];
    else nextProfile[field] = value;
    const typedProfile = nextProfile as Profile;
    setProfile(typedProfile);
    setDraft("");

    if (index === fields.length - 1) await save(typedProfile);
    else setIndex(index + 1);
  }

  function sensitiveValue(value: string): unknown {
    if (field === "hasDisability") {
      return value === "NA" ? null : value === "yes";
    }
    return value;
  }

  function renderControl() {
    if (field === "gender") {
      return (
        <SensitiveField
          legend={haqCopy.profile.question[field]}
          onSelect={(value) => moveForward(value)}
          options={haqCopy.profile.options.gender}
          selected={profile.gender}
        />
      );
    }
    if (field === "category") {
      return (
        <SensitiveField
          legend={haqCopy.profile.question[field]}
          onSelect={(value) => moveForward(value)}
          options={haqCopy.profile.options.category}
          selected={profile.category}
        />
      );
    }
    if (field === "incomeBand") {
      return (
        <SensitiveField
          legend={haqCopy.profile.question[field]}
          onSelect={(value) => moveForward(value)}
          options={haqCopy.profile.options.incomeBand}
          selected={profile.incomeBand}
        />
      );
    }
    if (field === "hasDisability") {
      const selected =
        profile.hasDisability === null
          ? "NA"
          : profile.hasDisability === undefined
            ? undefined
            : profile.hasDisability
              ? "yes"
              : "no";
      return (
        <SensitiveField
          legend={haqCopy.profile.question[field]}
          onSelect={(value) => moveForward(sensitiveValue(value))}
          options={haqCopy.profile.options.disability}
          selected={selected}
        />
      );
    }
    if (field === "childrenAges" || field === "parentsAges") {
      return (
        <AgeListField
          initialAges={profile[field]}
          kind={field === "childrenAges" ? "children" : "parents"}
          onContinue={(ages) => moveForward(ages)}
        />
      );
    }

    const options = standardOptions(field);
    if (options) {
      return (
        <div className="profile-option-list">
          {options.map((option) => (
            <button
              className="profile-option"
              key={option.value}
              onClick={() =>
                moveForward(
                  field === "isSingleParent"
                    ? option.value === "yes"
                    : option.value,
                )
              }
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    }

    const inputType = field === "dob" ? "date" : "text";
    return (
      <div className="profile-text-field">
        <label className="sr-only" htmlFor={`profile-${field}`}>
          {haqCopy.profile.question[field]}
        </label>
        <input
          id={`profile-${field}`}
          inputMode={field === "aadhaarLast4" ? "numeric" : undefined}
          maxLength={field === "aadhaarLast4" ? 4 : undefined}
          onChange={(event) => setDraft(event.target.value)}
          type={inputType}
          value={draft}
        />
        <button
          className="primary-action"
          disabled={draft.trim() === ""}
          onClick={() => moveForward(draft.trim())}
          type="button"
        >
          {index === fields.length - 1
            ? haqCopy.profile.finish
            : haqCopy.profile.continue}
        </button>
      </div>
    );
  }

  if (!field) return null;

  return (
    <section className="haq-profile-page">
      <div className="site-shell haq-profile-page__inner">
        <header className="haq-profile-intro">
          <p>{haqCopy.profile.eyebrow}</p>
          <h1>{haqCopy.profile.heading}</h1>
          <span>{haqCopy.profile.description}</span>
          <small>{haqCopy.profile.browserNote}</small>
        </header>
        <HaqModelActions />
        <article className="haq-question-card" id={`field-${field}`}>
          <div className="intake-progress">
            <p>{haqCopy.profile.progress(index + 1, fields.length)}</p>
            <progress max={fields.length} value={index + 1} />
          </div>
          <h2>{haqCopy.profile.question[field]}</h2>
          {renderControl()}
          <button
            className="skip-question"
            onClick={() => moveForward(undefined, true)}
            type="button"
          >
            {haqCopy.profile.skip}
          </button>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
        </article>
      </div>
    </section>
  );
}
