import type { Plan } from "../engine/types";
import { deflateRawSync, inflateRawSync } from "node:zlib";

const PLAN_COOKIE = "rti-case";
const COUNT_COOKIE = "rti-case-count";
const COOKIE_CHUNK_SIZE = 3_000;

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
  return deflateRawSync(Buffer.from(JSON.stringify(plan), "utf8")).toString(
    "base64url",
  );
}

function decodePlan(value: string): Plan | null {
  try {
    return JSON.parse(
      inflateRawSync(Buffer.from(value, "base64url")).toString("utf8"),
    ) as Plan;
  } catch {
    return null;
  }
}

const cookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.VERCEL === "1",
};

export function cookiePlanStorage(cookieStore: CookieStore): PlanStorage {
  return {
    async load() {
      const count = Number(cookieStore.get(COUNT_COOKIE)?.value ?? "1");
      if (!Number.isInteger(count) || count < 1 || count > 8) return null;
      const value = Array.from({ length: count }, (_, index) =>
        cookieStore.get(index === 0 ? PLAN_COOKIE : `${PLAN_COOKIE}-${index}`)
          ?.value,
      );
      return value.every((chunk) => typeof chunk === "string")
        ? decodePlan(value.join(""))
        : null;
    },
    async save(plan) {
      const encoded = encodePlan(plan);
      const chunks = encoded.match(
        new RegExp(`.{1,${COOKIE_CHUNK_SIZE}}`, "g"),
      ) ?? [encoded];
      cookieStore.set(COUNT_COOKIE, String(chunks.length), cookieOptions);
      chunks.forEach((chunk, index) => {
        cookieStore.set(
          index === 0 ? PLAN_COOKIE : `${PLAN_COOKIE}-${index}`,
          chunk,
          cookieOptions,
        );
      });
    },
  };
}
