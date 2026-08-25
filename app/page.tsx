import { UtilityPage } from "@/components/rti/UtilityPage";
import {
  HelpdeskCard,
  TrapCards,
  WhyThisExists,
} from "@/components/rti/HomeSections";
import { utilityPages } from "@/content/utility-copy";

export default function HomePage() {
  return (
    <UtilityPage copy={utilityPages.home}>
      <TrapCards />
      <WhyThisExists />
      <HelpdeskCard />
    </UtilityPage>
  );
}
