import { JourneyStrip } from "@/components/rti/JourneyStrip";
import { HomeHero } from "@/components/rti/HomeHero";
import {
  ExampleCase,
  HelpdeskCard,
  TrapCards,
} from "@/components/rti/HomeSections";
import { HomePageShell } from "@/components/rti/HomePageShell";

export default function HomePage() {
  return (
    <HomePageShell hero={<HomeHero />}>
      <JourneyStrip />
      <TrapCards />
      {/* The example sits low on the page, reading as a section of a real site
          rather than a demo shortcut at the top. */}
      <ExampleCase />
      <HelpdeskCard />
    </HomePageShell>
  );
}
