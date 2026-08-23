import { landingCopy } from "./landing-copy";

const categoryByNodeId: Record<string, string> = {
  register_death: "e-district-services",
  certificate_copies: "e-district-services",
  bank_nominee: "bfsi",
  bank_no_nominee: "bfsi",
  legal_heir_cert: "police-legal",
  epf_form20: "social-security-pensioners",
  eps_form10d: "social-security-pensioners",
  edli_form5if: "social-security-pensioners",
  employer_refusal: "social-security-pensioners",
  vehicle_form31: "transport",
  aadhaar_deactivate: "police-legal",
  insurance_claim: "bfsi",
  abvky: "social-security-pensioners",
  pf_75: "social-security-pensioners",
  epfo_kyc: "social-security-pensioners",
  aadhaar_address: "e-district-services",
  onorc: "mera-ration",
  vehicle_intimation: "transport",
};

export function serviceCategory(nodeId: string) {
  const categoryId = categoryByNodeId[nodeId] ?? "general";

  return (
    landingCopy.categories.items.find((category) => category.id === categoryId) ??
    landingCopy.categories.items[0]
  );
}
