import { DEFAULT_TYPES, loadState, saveState, exportState, importState } from './storage.js';
import { escapeHtml, countByProject, createMiniCard, createFullCard, initialsFromText } from './ui.js';

const state = loadState();
let editingLinkId = null;

const els = {
  stats: document.getElementById('stats'),
  projectList: document.getElementById('projectList'),
  pinnedGrid: document.getElementById('pinnedGrid'),
  recentGrid: document.getElementById('recentGrid'),
  projectsContainer: document.getElementById('projectsContainer'),
  searchInput: document.getElementById('searchInput'),
  typeFilter: document.getElementById('typeFilter'),
  projectFilter: document.getElementById('projectFilter'),
  addLinkBtn: document.getElementById('addLinkBtn'),
  addProjectBtn: document.getElementById('addProjectBtn'),
  exportBtn: document.getElementById('exportBtn'),
  importBtn: document.getElementById('importBtn'),
  importInput: document.getElementById('importInput'),
  projectDialog: document.getElementById('projectDialog'),
  projectForm: document.getElementById('projectForm'),
  projectName: document.getElementById('projectName'),
  projectColor: document.getElementById('projectColor'),
  projectIcon: document.getElementById('projectIcon'),
  linkDialog: document.getElementById('linkDialog'),
  linkDialogTitle: document.getElementById('linkDialogTitle'),
  linkForm: document.getElementById('linkForm'),
  linkProject: document.getElementById('linkProject'),
  linkType: document.getElementById('linkType'),
  linkTitle: document.getElementById('linkTitle'),
  linkUrl: document.getElementById('linkUrl'),
  linkNote: document.getElementById('linkNote'),
  linkBadge: document.getElementById('linkBadge'),
  linkPinned: document.getElementById('linkPinned'),
  deleteLinkBtn: document.getElementById('deleteLinkBtn')
};

function getProjectById(id) {
  return state.projects.find(project => project.id === id);
}

function allTypes() {
  return [...new Set([...DEFAULT_TYPES, ...state.links.map(link => link.type).filter(Boolean)])];
}

function filteredLinks() {
  const search = els.searchInput.value.trim().toLowerCase();
  const type = els.typeFilter.value;
  const projectFilter = els.projectFilter.value;

  return state.links.filter(link => {
    const projectName = getProjectById(link.projectId)?.name || '';
    const haystack = [link.title, link.note, link.type, link.badge, projectName].join(' ').toLowerCase();
    const searchMatch = !search || haystack.includes(search);
    const typeMatch = type === 'all' || link.type === type;
    const filterMatch = projectFilter === 'all' || link.projectId === projectFilter;
    const sidebarMatch = state.selectedProjectId === 'all' || link.projectId === state.selectedProjectId;
    return searchMatch && typeMatch && filterMatch && sidebarMatch;
  });
}

function renderStats() {
  const items = [
    { value: state.projects.length, label: 'Projects' },
    { value: state.links.length, label: 'Links' },
    { value: state.links.filter(link => link.pinned).length, label: 'Pinned' }
  ];
  els.stats.innerHTML = items.map(item => `
    <div class="stat"><div class="value">${item.value}</div><div class="label">${item.label}</div></div>
  `).join('');
}

function renderFilters() {
  const currentType = els.typeFilter.value || 'all';
  const currentProject = els.projectFilter.value || 'all';
  const types = allTypes();

  els.typeFilter.innerHTML = '<option value="all">All types</option>' + types.map(type => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('');
  els.typeFilter.value = types.includes(currentType) || currentType === 'all' ? currentType : 'all';

  els.projectFilter.innerHTML = '<option value="all">All projects</option>' + state.projects.map(project => `<option value="${project.id}">${escapeHtml(project.name)}</option>`).join('');
  els.projectFilter.value = state.projects.some(project => project.id === currentProject) || currentProject === 'all' ? currentProject : 'all';

  els.linkProject.innerHTML = state.projects.map(project => `<option value="${project.id}">${escapeHtml(project.name)}</option>`).join('');
  els.linkType.innerHTML = types.map(type => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('');
}

function renderSidebar() {
  const counts = countByProject(filteredLinks());
  els.projectList.innerHTML = `
    <button class="project-chip ${state.selectedProjectId === 'all' ? 'active' : ''}" data-project-id="all">
      <span>All projects</span><span class="chip-count">${filteredLinks().length}</span>
    </button>
  ` + state.projects.map(project => `
    <button class="project-chip ${state.selectedProjectId === project.id ? 'active' : ''}" data-project-id="${project.id}">
      <span>${escapeHtml(project.name)}</span><span class="chip-count">${counts[project.id] || 0}</span>
    </button>
  `).join('');

  els.projectList.querySelectorAll('[data-project-id]').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedProjectId = button.dataset.projectId;
      persist();
      render();
    });
  });
}

function renderPinned() {
  const links = filteredLinks().filter(link => link.pinned).sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0));
  els.pinnedGrid.innerHTML = links.length
    ? links.map(link => createMiniCard(link, getProjectById(link.projectId))).join('')
    : '<div class="empty">No pinned links match your current filters.</div>';
}

function renderRecent() {
  const links = filteredLinks().filter(link => link.lastOpened).sort((a, b) => b.lastOpened - a.lastOpened).slice(0, 8);
  els.recentGrid.innerHTML = links.length
    ? links.map(link => createMiniCard(link, getProjectById(link.projectId))).join('')
    : '<div class="empty">Recent links will appear here after you open them from the dashboard.</div>';
}

function renderProjects() {
  const links = filteredLinks();
  const visibleProjects = state.selectedProjectId === 'all'
    ? state.projects
    : state.projects.filter(project => project.id === state.selectedProjectId);

  els.projectsContainer.innerHTML = visibleProjects.length
    ? visibleProjects.map(project => {
        const projectLinks = links.filter(link => link.projectId === project.id).sort((a, b) => {
          if ((b.pinned ? 1 : 0) !== (a.pinned ? 1 : 0)) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
          return (b.lastOpened || 0) - (a.lastOpened || 0);
        });
        return `
          <div class="project-block">
            <button class="project-toggle" data-toggle-project="${project.id}">
              <div><strong>${escapeHtml(project.name)}</strong><div class="project-meta">${projectLinks.length} links</div></div>
              <span>${project.collapsed ? '＋' : '−'}</span>
            </button>
            <div class="project-content ${project.collapsed ? 'collapsed' : ''}">
              ${projectLinks.length ? `<div class="card-grid">${projectLinks.map(link => createFullCard(link, project)).join('')}</div>` : '<div class="empty">No links match the current filters for this project.</div>'}
            </div>
          </div>`;
      }).join('')
    : '<div class="empty">Create your first project to start organising links.</div>';

  els.projectsContainer.querySelectorAll('[data-toggle-project]').forEach(button => {
    button.addEventListener('click', () => {
      const project = getProjectById(button.dataset.toggleProject);
      project.collapsed = !project.collapsed;
      persist();
      renderProjects();
      attachCardEvents();
    });
  });
}

function attachCardEvents() {
  document.querySelectorAll('[data-open-link]').forEach(anchor => {
    anchor.addEventListener('click', () => registerVisit(anchor.dataset.openLink));
    anchor.addEventListener('dblclick', event => {
      event.preventDefault();
      openEditLink(anchor.dataset.openLink);
    });
  });
}

function registerVisit(id) {
  const link = state.links.find(item => item.id === id);
  if (!link) return;
  link.lastOpened = Date.now();
  link.visits = (link.visits || 0) + 1;
  persist();
}

function persist() {
  saveState(state);
}

function openProjectDialog() {
  els.projectForm.reset();
  els.projectColor.value = 'soft-blue';
  els.projectDialog.showModal();
  els.projectName.focus();
}

function openLinkDialog() {
  if (!state.projects.length) return openProjectDialog();
  editingLinkId = null;
  els.linkDialogTitle.textContent = 'Add link';
  els.linkForm.reset();
  els.deleteLinkBtn.classList.add('hidden');
  if (state.selectedProjectId !== 'all' && getProjectById(state.selectedProjectId)) {
    els.linkProject.value = state.selectedProjectId;
  } else {
    els.linkProject.value = state.projects[0]?.id || '';
  }
  els.linkType.value = DEFAULT_TYPES[0];
  els.linkDialog.showModal();
  els.linkTitle.focus();
}

function openEditLink(id) {
  const link = state.links.find(item => item.id === id);
  if (!link) return;
  editingLinkId = id;
  els.linkDialogTitle.textContent = 'Edit link';
  els.linkProject.value = link.projectId;
  els.linkType.value = link.type;
  els.linkTitle.value = link.title;
  els.linkUrl.value = link.url;
  els.linkNote.value = link.note || '';
  els.linkBadge.value = link.badge || '';
  els.linkPinned.checked = !!link.pinned;
  els.deleteLinkBtn.classList.remove('hidden');
  els.linkDialog.showModal();
  els.linkTitle.focus();
}

function render() {
  renderStats();
  renderFilters();
  renderSidebar();
  renderPinned();
  renderRecent();
  renderProjects();
  attachCardEvents();
}

els.addProjectBtn.addEventListener('click', openProjectDialog);
els.addLinkBtn.addEventListener('click', openLinkDialog);
els.exportBtn.addEventListener('click', () => exportState(state));
els.importBtn.addEventListener('click', () => els.importInput.click());
els.searchInput.addEventListener('input', render);
els.typeFilter.addEventListener('change', render);
els.projectFilter.addEventListener('change', render);

document.querySelectorAll('[data-close-dialog]').forEach(button => {
  button.addEventListener('click', () => document.getElementById(button.dataset.closeDialog).close());
});

els.projectForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = els.projectName.value.trim();
  if (!name) return;
  const project = {
    id: crypto.randomUUID(),
    name,
    color: els.projectColor.value,
    icon: (els.projectIcon.value.trim() || initialsFromText(name)).slice(0, 4).toUpperCase(),
    collapsed: false
  };
  state.projects.push(project);
  state.selectedProjectId = project.id;
  persist();
  els.projectDialog.close();
  render();
});

els.linkForm.addEventListener('submit', event => {
  event.preventDefault();
  const payload = {
    projectId: els.linkProject.value,
    type: els.linkType.value,
    title: els.linkTitle.value.trim(),
    url: els.linkUrl.value.trim(),
    note: els.linkNote.value.trim(),
    badge: els.linkBadge.value.trim(),
    pinned: els.linkPinned.checked
  };
  if (editingLinkId) {
    Object.assign(state.links.find(link => link.id === editingLinkId), payload);
  } else {
    state.links.unshift({ id: crypto.randomUUID(), ...payload, visits: 0, lastOpened: null });
  }
  persist();
  els.linkDialog.close();
  render();
});

els.deleteLinkBtn.addEventListener('click', () => {
  if (!editingLinkId) return;
  state.links = state.links.filter(link => link.id !== editingLinkId);
  persist();
  els.linkDialog.close();
  render();
});

els.importInput.addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const data = await importState(file);
    state.projects = data.projects;
    state.links = data.links;
    state.selectedProjectId = 'all';
    persist();
    render();
  } catch {
    alert('That file does not look like a valid dashboard export.');
  } finally {
    els.importInput.value = '';
  }
});

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    els.searchInput.focus();
    els.searchInput.select();
  }
});

render();
