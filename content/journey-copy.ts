import type { Bucket, Status } from "@/lib/engine/types";

export const journeyCopy = {
  intake: {
    eyebrow: "Life event",
    progress: (current: number, total: number) =>
      `Question ${current} of ${total}`,
    skip: "Skip this question",
    provisionalLabel: "Provisional",
    provisionalHeading: "Your plan so far",
    provisionalDescription:
      "This is based on what you have told us so far.",
    sharpen: (count: number) =>
      count === 1
        ? "Answer one more to sharpen this."
        : `Answer ${count} more to sharpen this.`,
    finalAction: "View your ordered plan",
    noChange:
      "Nothing changed — this answer doesn't affect what you need to do.",
    changeSummary: (counts: {
      added: number;
      removed: number;
      warnings: number;
    }) => {
      const changes: string[] = [];

      if (counts.added > 0) {
        changes.push(`${counts.added} ${counts.added === 1 ? "row" : "rows"} added`);
      }
      if (counts.removed > 0) {
        changes.push(`${counts.removed} no longer applies`);
      }
      if (counts.warnings > 0) {
        changes.push(
          `${counts.warnings} ${counts.warnings === 1 ? "warning" : "warnings"} added`,
        );
      }

      return `${changes.join(", ")}.`;
    },
    error: "We could not update the plan. Try again.",
  },
  list: {
    eyebrow: "Your plan",
    planCode: "Plan code",
    browserNote: "This code identifies the plan stored in this browser.",
    intro: "Tasks are ordered by dependency and urgency.",
    orderedView: "Ordered plan",
    categoryView: "UMANG categories",
    orderedDescription: "Ordered around what you need to do first.",
    categoryDescription:
      "The same services across categories, without dependency order.",
    lockedReason: (tasks: string) => `Waiting for ${tasks}.`,
    warningCount: (count: number) =>
      count === 1 ? "1 warning" : `${count} warnings`,
    clock: (label: string, days: number, start: string) =>
      `${label}: ${days} days from ${start}`,
    clockStart: {
      event_date: "the event",
      plan_created: "this plan was created",
    },
    status: {
      none: "Not started",
      applied: "Applied",
      stuck: "Stuck",
      done: "Complete",
    } satisfies Record<Status, string>,
    bucket: {
      urgent: "Urgent",
      before: "Before you begin",
      week1: "In the first week",
      month: "Within a month",
      later: "Later",
    } satisfies Record<Bucket, string>,
  },
  detail: {
    authority: "Authority",
    typicalTime: "Typical time",
    bodyHeading: "What to know",
    warnings: "Warnings",
    documents: "Documents to prepare",
    noDocuments: "No documents are listed for this task.",
    status: "Your status",
    reference: "Reference number",
    referenceHelp: "Use a synthetic reference number only.",
    referencePlaceholder: "Example: SYNTHETIC-REF-1",
    referenceAction: "Save reference and mark complete",
    saved: "Reference saved. This task is complete.",
    unlockedHeading: "This completion unlocked",
    error: "We could not save the status. Try again.",
    completeFirst: "Complete first",
    unlocksNext: "This unlocks next",
    source: "Source",
    verified: (date: string) => `Verified on ${date}`,
    openSource: "Open source",
    confidenceBadge: "Sources conflict",
    confidenceNote: "Sources disagree, so no disputed number is shown.",
    severity: {
      info: "Information",
      caution: "Caution",
      critical: "Critical",
    },
    belongHeading: "A place to ask for help",
    back: "Back to plan",
  },
  api: {
    invalid: "The request is not valid.",
    unavailable: "This event is not available as a guided journey.",
    planNotFound: "This plan was not found in this browser.",
    taskNotFound: "This task is not part of the plan.",
    syntheticReference: "Reference numbers must begin with SYNTHETIC-.",
  },
  options: {
    relationship: {
      parent: "Parent",
      spouse: "Spouse",
      sibling: "Sibling",
      child: "Child",
      other: "Someone else",
    },
    state: {
      ka: "Karnataka",
      bh: "Bihar",
      up: "Uttar Pradesh",
      mh: "Maharashtra",
      other: "Another state",
    },
    from: {
      bh: "Bihar",
      up: "Uttar Pradesh",
      wb: "West Bengal",
      od: "Odisha",
      dl: "Delhi",
      other: "Another state",
    },
    to: {
      ka: "Karnataka",
      mh: "Maharashtra",
      tn: "Tamil Nadu",
      dl: "Delhi",
      other: "Another state",
    },
    registered: {
      yes: "Registered",
      applied: "Application submitted",
      no: "Not registered",
      unknown: "Not sure",
    },
    employment: {
      private: "Private-sector employee",
      central_govt: "Central government employee",
      state_govt: "State government employee",
      unorganised: "Unorganised worker",
      retired: "Retired",
      none: "None of these",
    },
    nominee: { yes: "Yes", no: "No", unknown: "Not sure" },
    will: { yes: "Yes", no: "No", unknown: "Not sure" },
    vehicle: { yes: "Yes", no: "No" },
    insurance: { yes: "Yes", no: "No", unknown: "Not sure" },
    how: {
      laid_off: "Laid off",
      resigned: "Resigned",
      contract_ended: "Contract ended",
      closure: "Employer closed",
    },
    esi: { yes: "Yes", no: "No", unknown: "Not sure" },
    tenure: {
      under_1y: "Under one year",
      "1_2y": "One to two years",
      "2_5y": "Two to five years",
      over_5y: "More than five years",
    },
    when: {
      this_month: "This month",
      "1_3_months": "One to three months ago",
      over_3_months: "More than three months ago",
      later: "Later",
      soon: "Soon",
      moved: "Already moved",
    },
    housing: {
      own: "Own home",
      stamp: "Stamp-paper agreement",
      registered: "Registered agreement",
      relative: "Staying with a relative",
      employer: "Employer housing",
      unknown: "Not sure",
    },
    work: {
      salaried: "Salaried work",
      daily: "Daily-wage work",
      self: "Self-employed",
      student: "Student",
    },
    kids: { yes: "Yes", no: "No" },
    lang: { en: "English", hi: "हिंदी", kn: "ಕನ್ನಡ" },
  } as Record<string, Record<string, string>>,
} as const;

export function intakeOptionLabel(field: string, value: string): string {
  return journeyCopy.options[field]?.[value] ?? value;
}
