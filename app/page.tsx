import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EventGrid } from "@/components/home/EventGrid";
import { HaqPromo } from "@/components/home/HaqPromo";
import { Hero } from "@/components/home/Hero";
import { StatsRow } from "@/components/home/StatsRow";

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const showSearchUnavailable = Object.prototype.hasOwnProperty.call(
    resolvedSearchParams,
    "q",
  );

  return (
    <>
      <Hero showSearchUnavailable={showSearchUnavailable} />
      <StatsRow />
      <EventGrid />
      <CategoryGrid />
      <HaqPromo />
    </>
  );
}
