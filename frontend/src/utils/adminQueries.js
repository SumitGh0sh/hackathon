import { getApplications } from "./applications";

function rowHash(id, idx) {
  let h = 0;
  const s = String(id) + String(idx);
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  const hex = ("00000000" + Math.abs(h).toString(16)).slice(-8);
  return `0x${hex.slice(0, 4)}…${hex.slice(4)}`;
}

function hasUploads(app) {
  const u = app.uploadedFiles;
  if (!u) return false;
  if (Array.isArray(u)) return u.length > 0;
  if (typeof u === "object") return Object.keys(u).length > 0;
  return false;
}

export function applicationToAdminQuery(app, idx) {
  const st = app.status || "Pending";
  const priority =
    st === "Escalated" || st === "Rejected" ? "high" : st === "Pending" ? "medium" : "low";
  const fd = app.formData || {};
  return {
    id: app.id,
    citizen: fd.fullName || fd.name || fd.mobile || "Applicant",
    dept: app.category || "General",
    subject: app.schemeName || "Application",
    status: st,
    priority,
    filed: app.filed || "—",
    district: app.state || "—",
    doc: hasUploads(app),
    hash: rowHash(app.id, idx),
    rawApp: app,
  };
}

/** Live applications first, then demo rows that do not share the same id. */
export function buildMergedAdminQueries(demoQueries) {
  const fromApps = getApplications().map(applicationToAdminQuery);
  const ids = new Set(fromApps.map((q) => q.id));
  const demo = (demoQueries || []).filter((q) => !ids.has(q.id)).map((q) => ({ ...q, rawApp: null }));
  return [...fromApps, ...demo];
}

export function summarizeUsersFromApplications() {
  const apps = getApplications();
  const byUser = new Map();
  for (const app of apps) {
    const uid = app.userId || "anonymous";
    if (!byUser.has(uid)) {
      byUser.set(uid, { userId: uid, count: 0, lastScheme: "", lastFiled: "" });
    }
    const row = byUser.get(uid);
    row.count += 1;
    row.lastScheme = app.schemeName || row.lastScheme;
    row.lastFiled = app.filed || row.lastFiled;
  }
  return Array.from(byUser.values()).sort((a, b) => b.count - a.count);
}

export function analyticsFromApplications() {
  const apps = getApplications();
  const byStatus = {};
  const byCategory = {};
  for (const app of apps) {
    const s = app.status || "Pending";
    byStatus[s] = (byStatus[s] || 0) + 1;
    const c = app.category || "General";
    byCategory[c] = (byCategory[c] || 0) + 1;
  }
  return { total: apps.length, byStatus, byCategory };
}
