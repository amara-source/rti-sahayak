import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cookiePlanStorage } from "@/lib/plans/storage";

export default async function CurrentCasePage() {
  const storage = cookiePlanStorage(await cookies());
  const plan = await storage.load();
  redirect(plan ? `/case/${plan.code}` : "/file");
}
