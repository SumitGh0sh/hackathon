/**
 * Admin role definitions and permission checks for SaathiSeva admin panel.
 * Role is stored in localStorage as `adminTier` (set on login or from Profile demo switcher).
 */

export const ADMIN_ROLE_STORAGE_KEY = "adminTier";

export const ADMIN_ROLES = {
  super_admin: {
    id: "super_admin",
    label: "Super Administrator",
    subtitle: "Full platform access",
    permissions: {
      dashboard: true,
      queries: true,
      queriesWrite: true,
      users: true,
      analytics: true,
      bots: true,
      botsWrite: true,
      blockchain: true,
      exports: true,
      profile: true,
    },
  },
  state_admin: {
    id: "state_admin",
    label: "State Administrator",
    subtitle: "State-wide oversight & escalations",
    permissions: {
      dashboard: true,
      queries: true,
      queriesWrite: true,
      users: true,
      analytics: true,
      bots: true,
      botsWrite: true,
      blockchain: true,
      exports: true,
      profile: true,
    },
  },
  district_admin: {
    id: "district_admin",
    label: "District Administrator",
    subtitle: "District queue & approvals",
    permissions: {
      dashboard: true,
      queries: true,
      queriesWrite: true,
      users: true,
      analytics: true,
      bots: true,
      botsWrite: true,
      blockchain: true,
      exports: false,
      profile: true,
    },
  },
  department_officer: {
    id: "department_officer",
    label: "Department Officer",
    subtitle: "Department-scoped applications",
    permissions: {
      dashboard: true,
      queries: true,
      queriesWrite: true,
      users: false,
      analytics: true,
      bots: true,
      botsWrite: false,
      blockchain: false,
      exports: false,
      profile: true,
    },
  },
  support_agent: {
    id: "support_agent",
    label: "Support Agent",
    subtitle: "First-line triage & notes",
    permissions: {
      dashboard: true,
      queries: true,
      queriesWrite: true,
      users: false,
      analytics: false,
      bots: false,
      botsWrite: false,
      blockchain: false,
      exports: false,
      profile: true,
    },
  },
  auditor: {
    id: "auditor",
    label: "Auditor (Read-only)",
    subtitle: "Compliance & audit trail",
    permissions: {
      dashboard: true,
      queries: true,
      queriesWrite: false,
      users: true,
      analytics: true,
      bots: true,
      botsWrite: false,
      blockchain: true,
      exports: true,
      profile: true,
    },
  },
};

export function getStoredAdminRole() {
  try {
    const r = localStorage.getItem(ADMIN_ROLE_STORAGE_KEY);
    if (r && ADMIN_ROLES[r]) return r;
  } catch {
    /* ignore */
  }
  return "district_admin";
}

export function setStoredAdminRole(roleId) {
  if (!ADMIN_ROLES[roleId]) return;
  localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, roleId);
}

export function getPermissions(roleId) {
  const role = ADMIN_ROLES[roleId] || ADMIN_ROLES.district_admin;
  return role.permissions;
}

/** Support agent may only set these statuses (triage — not final approval). */
export const SUPPORT_AGENT_STATUSES = ["Pending", "In Review", "Escalated"];

export function canSetStatus(roleId, status) {
  if (!getPermissions(roleId).queriesWrite) return false;
  if (roleId === "support_agent" && !SUPPORT_AGENT_STATUSES.includes(status)) return false;
  return true;
}
