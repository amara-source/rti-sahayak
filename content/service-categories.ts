import { landingCopy } from "./landing-copy";

const categoryByNodeId: Record<string, string> = {
  register_death: "police-legal",
  certificate_copies: "police-legal",
  bank_nominee: "police-legal",
  bank_no_nominee: "police-legal",
  legal_heir_cert: "police-legal",
  epf_form20: "education-skills-employment",
  eps_form10d: "education-skills-employment",
  edli_form5if: "education-skills-employment",
  employer_refusal: "education-skills-employment",
  vehicle_form31: "transport",
  aadhaar_deactivate: "police-legal",
  insurance_claim: "police-legal",
  abvky: "education-skills-employment",
  pf_75: "education-skills-employment",
  epfo_kyc: "education-skills-employment",
  aadhaar_address: "police-legal",
  onorc: "mera-ration",
  vehicle_intimation: "transport",
};

export function serviceCategory(nodeId: string) {
  const categoryId = categoryByNodeId[nodeId] ?? "police-legal";

  return (
    landingCopy.categories.items.find((category) => category.id === categoryId) ??
    landingCopy.categories.items[0]
  );
}
