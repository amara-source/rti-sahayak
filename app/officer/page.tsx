import type { Metadata } from "next";
import { OfficerQueue } from "@/components/rti/OfficerQueue";
import { officerCopy } from "@/content/officer-copy";

export const metadata: Metadata = {
  title: `${officerCopy.heading}, RTI Sahayak`,
  description: officerCopy.intro,
};

export default function OfficerPage() {
  return <OfficerQueue />;
}
