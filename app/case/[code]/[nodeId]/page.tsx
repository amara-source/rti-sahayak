import { CaseNodeDetail } from "@/components/rti/CaseTracker";

interface Props {
  params: Promise<{ code: string; nodeId: string }>;
}

export default async function CaseNodePage({ params }: Props) {
  const { code, nodeId } = await params;
  return <CaseNodeDetail code={code} nodeId={nodeId} />;
}
