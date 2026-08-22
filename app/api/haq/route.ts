import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { haqCopy } from "@/content/haq-copy";
import { computeEntitlements } from "@/lib/engine/entitlement";
import type { Profile } from "@/lib/engine/types";
import { cookieHaqProfileStorage } from "@/lib/haq/storage";

function isProfile(value: unknown): value is Profile {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: haqCopy.api.invalid }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("profile" in body) ||
    !isProfile(body.profile)
  ) {
    return NextResponse.json({ error: haqCopy.api.invalid }, { status: 400 });
  }

  const storage = cookieHaqProfileStorage(await cookies());
  await storage.save(body.profile);

  return NextResponse.json(computeEntitlements(body.profile));
}
