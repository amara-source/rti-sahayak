import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EventGrid } from "@/components/home/EventGrid";
import { HaqPromo } from "@/components/home/HaqPromo";
import { Hero } from "@/components/home/Hero";
import { StatsRow } from "@/components/home/StatsRow";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsRow />
      <EventGrid />
      <CategoryGrid />
      <HaqPromo />
    </>
  );
}
