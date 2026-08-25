export interface RewriteChange {
  title: string;
  reason: string;
}

export interface RtiDraft {
  rawText: string;
  subject: string;
  confirmed: boolean;
  bodyLevel?: "central" | "state" | "unknown";
  state?: string;
  lifeLiberty?: "yes" | "no";
  isBPL?: "yes" | "no" | "na";
  wantsAction?: "records" | "status" | "action";
  draftOnly?: boolean;
  authorityId?: string;
  authorityName?: string;
  officer?: string;
  rewritten?: string;
  changes?: RewriteChange[];
  singleSubject?: boolean;
  asksForRecords?: boolean;
  hasIdentityDocuments?: boolean;
  attachment?: {
    name: string;
    type: string;
    size: number;
  };
  hasBplCertificate?: boolean;
}

const key = "rti-sahayak-draft";

export function loadDraft(): RtiDraft | null {
  if (typeof window === "undefined") return null;
  const value = window.sessionStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as RtiDraft;
  } catch {
    return null;
  }
}

export function saveDraft(draft: RtiDraft): void {
  window.sessionStorage.setItem(key, JSON.stringify(draft));
}

export function clearDraft(): void {
  window.sessionStorage.removeItem(key);
}
