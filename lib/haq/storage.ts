import type { Profile } from "../engine/types";

const PROFILE_COOKIE = "umang-haq-profile";

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

export interface HaqProfileStorage {
  load(): Promise<Profile>;
  save(profile: Profile): Promise<void>;
}

function encodeProfile(profile: Profile): string {
  return Buffer.from(JSON.stringify(profile), "utf8").toString("base64url");
}

function decodeProfile(value: string): Profile {
  try {
    return JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Profile;
  } catch {
    return {};
  }
}

export function cookieHaqProfileStorage(
  cookieStore: CookieStore,
): HaqProfileStorage {
  return {
    async load() {
      const stored = cookieStore.get(PROFILE_COOKIE);
      return stored ? decodeProfile(stored.value) : {};
    },
    async save(profile) {
      cookieStore.set(PROFILE_COOKIE, encodeProfile(profile), {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
        secure: process.env.VERCEL === "1",
      });
    },
  };
}
