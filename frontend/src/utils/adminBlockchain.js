const LEDGER_KEY = "adminBlockchainLedger";

function simpleHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ("0000000" + (h >>> 0).toString(16)).slice(-8);
}

export function getBlockchainLedger() {
  try {
    const raw = localStorage.getItem(LEDGER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

export function appendBlockchainEntry({ applicationId, status, adminLabel }) {
  const chain = getBlockchainLedger();
  const prev = chain.length ? chain[chain.length - 1].hash : "0x1b7e9a03f";
  const block = chain.length ? chain[chain.length - 1].block + 1 : 100429;
  const payload = `${prev}|${applicationId}|${status}|${Date.now()}`;
  const hash = "0x" + simpleHash(payload);
  const row = {
    block,
    hash,
    prev,
    tx: `${applicationId} → ${status}${adminLabel ? ` (${adminLabel})` : ""}`,
    timestamp: new Date().toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    valid: true,
  };
  const next = [...chain, row].slice(-200);
  try {
    localStorage.setItem(LEDGER_KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
  return next;
}
