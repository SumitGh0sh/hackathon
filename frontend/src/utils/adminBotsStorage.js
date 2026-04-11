const BOTS_KEY = "adminAiBotsConfig";

const DEFAULT_BOTS = [
  { id: "bot-1", name: "LandBot", dept: "Revenue & Land", desc: "Handles mutation, registry, survey queries", active: true, queries: 142 },
  { id: "bot-2", name: "AyushBot", dept: "Health & Insurance", desc: "PMJAY registration, hospital claim triage", active: true, queries: 89 },
  { id: "bot-3", name: "WelfareBot", dept: "Benefits & Welfare", desc: "Ration card, pension, PM scheme eligibility", active: true, queries: 214 },
  { id: "bot-4", name: "AadhaarBot", dept: "Identity & Aadhaar", desc: "Correction, linking, biometric issues", active: false, queries: 31 },
  { id: "bot-5", name: "EduBot", dept: "Education", desc: "Scholarship triage, admission guidance", active: true, queries: 67 },
  { id: "bot-6", name: "LegalBot", dept: "Legal & Courts", desc: "FIR status, court notices, hearing schedules", active: false, queries: 18 },
];

export function loadAdminBots() {
  try {
    const raw = localStorage.getItem(BOTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_BOTS.map((b) => ({ ...b }));
}

export function saveAdminBots(bots) {
  try {
    localStorage.setItem(BOTS_KEY, JSON.stringify(bots));
  } catch {
    /* ignore */
  }
}
