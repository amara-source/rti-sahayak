import type { Job } from "@/lib/engine/types";

export function JobTag({ job }: { job: Job }) {
  return <span className={`job-tag job-tag--${job.toLowerCase()}`}>{job}</span>;
}
