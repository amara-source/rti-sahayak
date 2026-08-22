import { journeyCopy } from "@/content/journey-copy";
import type { Bucket } from "@/lib/engine/types";

export function BucketHeader({ bucket }: { bucket: Bucket }) {
  return <h2 className="bucket-header">{journeyCopy.list.bucket[bucket]}</h2>;
}
