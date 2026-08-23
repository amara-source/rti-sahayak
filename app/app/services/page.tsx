import { ApplicationServices } from "@/components/application/ApplicationServices";

interface ApplicationServicesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ApplicationServicesPage({ searchParams }: ApplicationServicesPageProps) {
  const { category } = await searchParams;
  return <ApplicationServices categoryId={category} />;
}
