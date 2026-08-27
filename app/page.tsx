import { UtilityPage } from "@/components/rti/UtilityPage";
import { JourneyStrip } from "@/components/rti/JourneyStrip";
import {
  HelpdeskCard,
  TrapCards,
} from "@/components/rti/HomeSections";
import { utilityPages } from "@/content/utility-copy";

export default function HomePage() {
  return (
    <UtilityPage copy={utilityPages.home}>
      <JourneyStrip />
      <TrapCards />
      <HelpdeskCard />
    </UtilityPage>
  );
}
