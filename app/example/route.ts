import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { advancePlan, createSubmittedCase } from "@/lib/plans/plan";
import { cookiePlanStorage } from "@/lib/plans/storage";

export async function GET(request: Request) {
  const submitted = createSubmittedCase({
    subject: "My father's central government pension application has been pending for eight months.",
    bodyLevel: "central",
    state: "Karnataka",
    lifeLiberty: "no",
    isBPL: "no",
    wantsAction: "records",
    authorityId: "pension_central",
    authorityName: "Department of Pension and Pensioners' Welfare",
    officer: "Central Public Information Officer",
    rewritten: "Please provide certified copies of the file notings, movement record and current status of the pending pension application.",
    registrationNumber: "DOPTR/E/2026/04417",
  });
  const { plan } = advancePlan(submitted, 31 * 24);
  await cookiePlanStorage(await cookies()).save(plan);

  return NextResponse.redirect(new URL(`/case/${plan.code}`, request.url));
}
