export const SCHEME_FORM_CONFIG = {
  SCH001: {
    fields: [
      { key: "fullName", label: "Full Name", type: "text", required: true },
      { key: "aadhaar", label: "Aadhaar Number", type: "text", required: true },
      { key: "landArea", label: "Land Area (acre)", type: "text", required: true },
      { key: "bankAccount", label: "Bank Account Number", type: "text", required: true }
    ],
    documents: ["Aadhaar Card", "Land Record Copy", "Bank Passbook"]
  },
  SCH004: {
    fields: [
      { key: "fullName", label: "Full Name", type: "text", required: true },
      { key: "familyId", label: "Family ID", type: "text", required: true },
      { key: "mobile", label: "Mobile Number", type: "text", required: true }
    ],
    documents: ["Aadhaar Card", "Ration Card", "Income Certificate"]
  },
  SCH013: {
    fields: [
      { key: "fullName", label: "Full Name", type: "text", required: true },
      { key: "jobCard", label: "Existing Job Card (if any)", type: "text", required: false },
      { key: "village", label: "Village", type: "text", required: true }
    ],
    documents: ["Aadhaar Card", "Address Proof", "Bank Account Proof"]
  },
  default: {
    fields: [
      { key: "fullName", label: "Full Name", type: "text", required: true },
      { key: "mobile", label: "Mobile Number", type: "text", required: true },
      { key: "address", label: "Address", type: "text", required: true }
    ],
    documents: ["Identity Proof", "Address Proof"]
  }
};

export function getSchemeConfig(schemeId) {
  return SCHEME_FORM_CONFIG[schemeId] || SCHEME_FORM_CONFIG.default;
}
