import type { Plan } from "../engine/types";

const PLAN_COOKIE = "umang-plan";

interface CookieValue {
  value: string;
}

interface CookieStore {
  get(name: string): CookieValue | undefined;
  set(
    name: string,
    value: string,
    options: {
      httpOnly: boolean;
      maxAge: number;
      path: string;
      sameSite: "lax";
      secure: boolean;
    },
  ): void;
}

export interface PlanStorage {
  load(): Promise<Plan | null>;
  save(plan: Plan): Promise<void>;
}

function encodePlan(plan: Plan): string {
  return Buffer.from(JSON.stringify(plan), "utf8").toString("base64url");
}

function decodePlan(value: string): Plan | null {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Plan;
  } catch {
    return null;
  }
}

export function cookiePlanStorage(cookieStore: CookieStore): PlanStorage {
  return {
    async load() {
      const stored = cookieStore.get(PLAN_COOKIE);
      return stored ? decodePlan(stored.value) : null;
    },
    async save(plan) {
      cookieStore.set(PLAN_COOKIE, encodePlan(plan), {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
        secure: process.env.VERCEL === "1",
      });
    },
  };
}
