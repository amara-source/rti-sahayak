import type { SyncEvent } from "@/lib/engine/types";

function list(values: readonly string[]): string {
  if (values.length < 2) {
    return values[0] ?? "";
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function countLabel(count: number): string {
  if (count === 1) return "One thing";
  if (count === 2) return "Two things";
  return `${count} things`;
}

export const trackerCopy = {
  mockBadge: "Mock — simulated",
  status: {
    received: "Received",
    in_progress: "In progress",
    approved: "Approved",
    rejected: "Rejected",
  } satisfies Record<SyncEvent["status"], string>,
  control: {
    eyebrow: "Simulated tracker",
    heading: "See a department update arrive",
    description:
      "Run a labelled simulation against this browser-only plan. It changes task status and unlocks dependent work using the same deterministic plan logic as a saved reference number.",
    trigger: "Simulate a status update",
    pending: "Simulating an update",
    note: "Explicit demo control. No department is contacted.",
    updateSummary: (count: number) =>
      count === 1
        ? "1 simulated update added."
        : `${count} simulated updates added.`,
    unlockSummary: (titles: readonly string[]) =>
      titles.length === 1
        ? `${titles[0]} is now unlocked.`
        : `${titles.length} tasks are now unlocked: ${list(titles)}.`,
    noTasks:
      "There are no more unlocked tasks available for this simulation.",
    failure: "The simulated update could not be added. Try again.",
  },
  feed: {
    heading: "Simulated event feed",
    empty: "No department event has been simulated yet.",
  },
  whatsapp: {
    eyebrow: "WhatsApp-style preview",
    heading: "The message finds you",
    renderedOnly: "Rendered preview only. Nothing is sent.",
    description:
      "Each message below comes directly from a simulated status event stored with this plan.",
    empty:
      "No status message yet. Use the simulation control to create the first useful update.",
    platformConstraint:
      "Proactive status updates use approved template messages. Free-form replies are available only inside the 24-hour window opened by the user’s reply.",
    grounding:
      "MyGov already runs a WhatsApp helpdesk that authenticates DigiLocker and delivers documents at national scale. This adds status to an existing channel; it does not create a new one.",
  },
  message: {
    received: (authority: string, task: string) =>
      `${authority} received “${task}”. Reply 1 and we’ll send the document checklist.`,
    inProgress: (authority: string, task: string) =>
      `“${task}” is being reviewed by ${authority}. Reply 1 and we’ll send the documents that may be needed.`,
    approved: (task: string, unlockedTitles: readonly string[]) =>
      unlockedTitles.length > 0
        ? `“${task}” was approved. ${countLabel(unlockedTitles.length)} opened up because of it — ${list(unlockedTitles)}. Reply 1 and we’ll send the filled ${unlockedTitles.length === 1 ? "form" : "forms"}.`
        : `“${task}” was approved. Reply 1 and we’ll send the confirmation and next steps.`,
    rejected: (authority: string, task: string) =>
      `${authority} marked “${task}” as rejected in this simulation. Reply 1 and we’ll send the source and document checklist.`,
  },
  api: {
    invalid: "The request is not valid.",
    planNotFound: "This plan was not found in this browser.",
    noTasks:
      "There are no more unlocked tasks available for this simulation.",
  },
} as const;
