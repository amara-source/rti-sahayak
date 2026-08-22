import Link from "next/link";
import { haqCopy } from "@/content/haq-copy";
import type { EntitlementProfileField } from "@/lib/engine/profile-fields";

interface HiddenCountProps {
  fields: EntitlementProfileField[];
  hiddenCount: number;
}

export function HiddenCount({ fields, hiddenCount }: HiddenCountProps) {
  if (hiddenCount === 0 || fields.length === 0) {
    return null;
  }

  const query = encodeURIComponent(fields.join(","));

  return (
    <Link
      className="haq-hidden-count"
      href={`/haq?fields=${query}`}
    >
      {haqCopy.results.hidden(hiddenCount, fields.length)}
    </Link>
  );
}
