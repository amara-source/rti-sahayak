import { UtilityPage } from "@/components/rti/UtilityPage";
import { utilityPages } from "@/content/utility-copy";

export default function ActPage() {
  return <UtilityPage className="utility-page--act" copy={utilityPages.act} />;
}
