import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ProfileForm } from "@/components/haq/ProfileForm";
import { haqCopy } from "@/content/haq-copy";
import {
  haqProfileFields,
  type EntitlementProfileField,
} from "@/lib/engine/profile-fields";
import { cookieHaqProfileStorage } from "@/lib/haq/storage";

interface HaqPageProps {
  searchParams: Promise<{ fields?: string }>;
}

export const metadata: Metadata = { title: haqCopy.profile.heading };

export default async function HaqPage({ searchParams }: HaqPageProps) {
  const activeFields = haqProfileFields();
  const { fields: requested } = await searchParams;
  const requestedFields = requested
    ?.split(",")
    .filter((field): field is EntitlementProfileField =>
      activeFields.includes(field as EntitlementProfileField),
    );
  const fields = requestedFields?.length ? requestedFields : activeFields;
  const storage = cookieHaqProfileStorage(await cookies());
  const profile = await storage.load();

  return <ProfileForm fields={fields} initialProfile={profile} />;
}
