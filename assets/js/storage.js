export const STORAGE_KEY = 'projectBookmarkDashboard.v2';
export const DEFAULT_TYPES = [
  'Daily',
  'Specs / Standards',
  'Drawings / Models',
  'Meetings',
  'Delivery / Submissions',
  'Requests / Issues',
  'Dashboards',
  'Other'
];

function createSeedData() {
  const projects = [
    { id: crypto.randomUUID(), name: 'Project Falcon', color: 'soft-blue', icon: 'PF', collapsed: false },
    { id: crypto.randomUUID(), name: 'EastLink TP01', color: 'soft-green', icon: 'TP1', collapsed: false },
    { id: crypto.randomUUID(), name: 'SKF Portal', color: 'soft-purple', icon: 'SKF', collapsed: true }
  ];
  return {
    selectedProjectId: 'all',
    projects,
    links: [
      { id: crypto.randomUUID(), projectId: projects[0].id, type: 'Daily', title: 'Project dashboard', url: 'https://example.com/falcon-dashboard', note: 'Daily launch point for reporting, issues, and current actions.', badge: 'Daily', pinned: true, visits: 7, lastOpened: Date.now() - 1000 * 60 * 40 },
      { id: crypto.randomUUID(), projectId: projects[0].id, type: 'Requests / Issues', title: 'RFI register', url: 'https://example.com/falcon-rfi', note: 'Current RFIs and outstanding engineering clarifications.', badge: 'Live', pinned: false, visits: 2, lastOpened: Date.now() - 1000 * 60 * 60 * 7 },
      { id: crypto.randomUUID(), projectId: projects[1].id, type: 'Drawings / Models', title: 'TP01 drawing set', url: 'https://example.com/tp01-drawings', note: 'Latest issued drawing package and markup folder.', badge: 'Issued', pinned: true, visits: 5, lastOpened: Date.now() - 1000 * 60 * 10 },
      { id: crypto.randomUUID(), projectId: projects[1].id, type: 'Meetings', title: 'Coordination minutes', url: 'https://example.com/tp01-minutes', note: 'Weekly coordination notes and action owners.', badge: 'Weekly', pinned: false, visits: 3, lastOpened: Date.now() - 1000 * 60 * 60 * 27 },
      { id: crypto.randomUUID(), projectId: projects[2].id, type: 'Dashboards', title: 'Portal admin', url: 'https://example.com/skf-admin', note: 'Fast access to the admin area and system checks.', badge: 'Admin', pinned: false, visits: 1, lastOpened: Date.now() - 1000 * 60 * 60 * 80 }
    ]
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedData();
    const parsed = JSON.parse(raw);
    parsed.selectedProjectId ||= 'all';
    parsed.projects ||= [];
    parsed.links ||= [];
    return parsed;
  } catch {
    return createSeedData();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportState(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'project-bookmark-dashboard-data.json';
  link.click();
  URL.revokeObjectURL(url);
}

export function importState(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data.projects) || !Array.isArray(data.links)) throw new Error('Invalid structure');
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
