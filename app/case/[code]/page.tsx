import { CaseTracker } from "@/components/rti/CaseTracker";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function CasePage({ params }: Props) {
  const { code } = await params;
  return <CaseTracker code={code} />;
}
