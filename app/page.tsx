import { UtilityPage } from "@/components/rti/UtilityPage";
import { JourneyStrip } from "@/components/rti/JourneyStrip";
import {
  ExampleCase,
  HelpdeskCard,
  TrapCards,
} from "@/components/rti/HomeSections";
import { utilityPages } from "@/content/utility-copy";

export default function HomePage() {
  return (
    <UtilityPage copy={utilityPages.home}>
      <JourneyStrip />
      <TrapCards />
      {/* The example sits low on the page, reading as a section of a real site
          rather than a demo shortcut at the top. */}
      <ExampleCase />
      <HelpdeskCard />
    </UtilityPage>
  );
}
