const STORAGE_KEY = "schemeApplications";

export function getApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

export function saveApplications(applications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

export function createApplication(application) {
  const all = getApplications();
  const next = [...all, application];
  saveApplications(next);
  return application;
}

export function updateApplicationStatus(id, status) {
  const progressMap = {
    Pending: 20,
    "In Review": 50,
    Escalated: 65,
    Approved: 100,
    Rejected: 100
  };
  const all = getApplications();
  const next = all.map((app) =>
    app.id === id
      ? {
          ...app,
          status,
          progress: progressMap[status] || app.progress,
          timeline: [
            ...(app.timeline || []),
            { label: `Status changed to ${status}`, done: true, date: new Date().toLocaleDateString() }
          ]
        }
      : app
  );
  saveApplications(next);
  return next;
}
