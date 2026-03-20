import { DEFAULT_TYPES, loadState, saveState, exportState, importStateFromFile } from './storage.js';
import {
  createStatsMarkup,
  createProjectChip,
  createMiniCard,
  createFullCard,
  countByProject,
  initialsFromText,
  inferTitleFromUrl
} from './ui.js';

const state = loadState();
let editingLinkId = null;
let dragLinkId = null;

const els = {
  stats: document.getElementById('stats'),
  searchInput: document.getElementById('searchInput'),
  typeFilter: document.getElementById('typeFilter'),
  projectFilter: document.getElementById('projectFilter'),
  addProjectBtn: document.getElementById('addProjectBtn'),
  addLinkBtn: document.getElementById('addLinkBtn'),
  quickAddBtn: document.getElementById('quickAddBtn'),
  exportBtn: document.getElementById('exportBtn'),
  importBtn: document.getElementById('importBtn'),
  importInput: document.getElementById('importInput'),
  projectList: document.getElementById('projectList'),
  pinnedGrid: document.getElementById('pinnedGrid'),
  recentGrid: document.getElementById('recentGrid'),
  projectsContainer: document.getElementById('projectsContainer'),

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
  deleteLinkBtn: document.getElementById('deleteLinkBtn'),

  quickAddDialog: document.getElementById('quickAddDialog'),
  quickAddForm: document.getElementById('quickAddForm'),
  quickProject: document.getElementById('quickProject'),
  quickType: document.getElementById('quickType'),
  quickUrl: document.getElementById('quickUrl'),
  quickTitle: document.getElementById('quickTitle'),
  quickNote: document.getElementById('quickNote')
};

function persist() {
  saveState(state);
}

function getProjectById(id) {
  return state.projects.find(project => project.id === id);
}

function allTypes() {
  return [...new Set([...DEFAULT_TYPES, ...state.links.map(link => link.type).filter(Boolean)])];
}

function getProjectLinks(projectId) {
  return state.links
    .filter(link => link.projectId === projectId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function filteredLinks() {
  const search = els.searchInput.value.trim().toLowerCase();
  const type = els.typeFilter.value;
  const projectFilter = els.projectFilter.value;

  return state.links.filter(link => {
    const projectName = getProjectById(link.projectId)?.name || '';
    const haystack = [link.title, link.note, link.type, link.badge, projectName].join(' ').toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    const matchesType = type === 'all' || link.type === type;
    const matchesProject = projectFilter === 'all' || link.projectId === projectFilter;
    const matchesSidebar = state.selectedProjectId === 'all' || link.projectId === state.selectedProjectId;
    return matchesSearch && matchesType && matchesProject && matchesSidebar;
  });
}

function normaliseProjectOrders(projectId) {
  getProjectLinks(projectId).forEach((link, index) => {
    link.order = index;
  });
}

function populateSelects() {
  const types = allTypes();
  const typeValue = els.typeFilter.value || 'all';
  const projectValue = els.projectFilter.value || 'all';

  els.typeFilter.innerHTML = '<option value="all">All types</option>' + types.map(type => `<option value="${type}">${type}</option>`).join('');
  els.typeFilter.value = types.includes(typeValue) || typeValue === 'all' ? typeValue : 'all';

  const projectOptions = state.projects.map(project => `<option value="${project.id}">${project.name}</option>`).join('');
  els.projectFilter.innerHTML = '<option value="all">All projects</option>' + projectOptions;
  els.projectFilter.value = state.projects.some(project => project.id === projectValue) || projectValue === 'all' ? projectValue : 'all';

  els.linkProject.innerHTML = projectOptions;
  els.quickProject.innerHTML = projectOptions;

  const typeOptions = types.map(type => `<option value="${type}">${type}</option>`).join('');
  els.linkType.innerHTML = typeOptions;
  els.quickType.innerHTML = typeOptions;
}

function renderStats() {
  els.stats.innerHTML = createStatsMarkup(state);
}

function renderSidebar() {
  const visibleCounts = countByProject(filteredLinks());
  const allButton = `
    <button class="project-chip ${state.selectedProjectId === 'all' ? 'active' : ''}" data-project-id="all">
      <span class="chip-left"><span class="project-dot" style="background:#8aa3c2"></span><span>All projects</span></span>
      <span class="chip-count">${filteredLinks().length}</span>
    </button>
  `;

  els.projectList.innerHTML = allButton + state.projects.map(project => createProjectChip(project, visibleCounts[project.id] || 0, state.selectedProjectId === project.id)).join('');

  els.projectList.querySelectorAll('[data-project-id]').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedProjectId = button.dataset.projectId;
      persist();
      render();
    });
  });
}

function renderPinned() {
  const links = filteredLinks()
    .filter(link => link.pinned)
    .sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0));

  els.pinnedGrid.innerHTML = links.length
    ? links.map(link => createMiniCard(link, getProjectById(link.projectId))).join('')
    : '<div class="empty">No pinned links match your current filters.</div>';
}

function renderRecent() {
  const links = filteredLinks()
    .filter(link => link.lastOpened)
    .sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0))
    .slice(0, 8);

  els.recentGrid.innerHTML = links.length
    ? links.map(link => createMiniCard(link, getProjectById(link.projectId))).join('')
    : '<div class="empty">Recent links will appear here after you open them from the dashboard.</div>';
}

function renderProjects() {
  const visibleProjects = state.selectedProjectId === 'all'
    ? state.projects
    : state.projects.filter(project => project.id === state.selectedProjectId);

  const visibleLinkIds = new Set(filteredLinks().map(link => link.id));

  if (!visibleProjects.length) {
    els.projectsContainer.innerHTML = '<div class="empty">Create your first project to begin organising links.</div>';
    return;
  }

  els.projectsContainer.innerHTML = visibleProjects.map(project => {
    const projectLinks = getProjectLinks(project.id).filter(link => visibleLinkIds.has(link.id));

    return `
      <div class="project-block project-theme-${project.color}" data-project-block="${project.id}">
        <button class="project-toggle" data-toggle-project="${project.id}">
          <div>
            <strong>${project.name}</strong>
            <div class="project-meta">${projectLinks.length} visible links</div>
          </div>
          <div class="project-toggle-right">${project.collapsed ? 'Expand' : 'Collapse'}</div>
        </button>
        <div class="project-content ${project.collapsed ? 'collapsed' : ''}">
          ${projectLinks.length
            ? `<div class="card-grid" data-card-grid="${project.id}">${projectLinks.map(link => createFullCard(link, project)).join('')}</div>`
            : '<div class="empty">No links match the current filters for this project.</div>'}
        </div>
      </div>
    `;
  }).join('');

  els.projectsContainer.querySelectorAll('[data-toggle-project]').forEach(button => {
    button.addEventListener('click', () => {
      const project = getProjectById(button.dataset.toggleProject);
      if (!project) return;
      project.collapsed = !project.collapsed;
      persist();
      renderProjects();
      attachCardEvents();
      attachDragEvents();
    });
  });
}

function attachCardEvents() {
  document.querySelectorAll('[data-open-link]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      const link = state.links.find(item => item.id === anchor.dataset.openLink);
      if (!link) return;
      link.lastOpened = Date.now();
      link.visits = (link.visits || 0) + 1;
      persist();
      renderStats();
      renderRecent();
    });

    anchor.addEventListener('dblclick', event => {
      event.preventDefault();
      openEditLink(anchor.dataset.openLink);
    });
  });
}

function attachDragEvents() {
  document.querySelectorAll('[data-link-id]').forEach(card => {
    card.addEventListener('dragstart', () => {
      dragLinkId = card.dataset.linkId;
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      dragLinkId = null;
      card.classList.remove('dragging');
      document.querySelectorAll('.drop-target').forEach(item => item.classList.remove('drop-target'));
    });

    card.addEventListener('dragover', event => {
      event.preventDefault();
      card.classList.add('drop-target');
    });

    card.addEventListener('dragleave', () => card.classList.remove('drop-target'));

    card.addEventListener('drop', event => {
      event.preventDefault();
      card.classList.remove('drop-target');
      if (!dragLinkId || dragLinkId === card.dataset.linkId) return;

      const targetLink = state.links.find(link => link.id === card.dataset.linkId);
      const draggedLink = state.links.find(link => link.id === dragLinkId);
      if (!targetLink || !draggedLink || targetLink.projectId !== draggedLink.projectId) return;

      reorderWithinProject(draggedLink.projectId, draggedLink.id, targetLink.id);
    });
  });
}

function reorderWithinProject(projectId, draggedId, targetId) {
  const ordered = getProjectLinks(projectId);
  const draggedIndex = ordered.findIndex(link => link.id === draggedId);
  const targetIndex = ordered.findIndex(link => link.id === targetId);
  if (draggedIndex < 0 || targetIndex < 0) return;

  const [dragged] = ordered.splice(draggedIndex, 1);
  ordered.splice(targetIndex, 0, dragged);
  ordered.forEach((link, index) => { link.order = index; });
  persist();
  renderProjects();
  attachCardEvents();
  attachDragEvents();
}

function openProjectDialog() {
  els.projectForm.reset();
  els.projectColor.value = 'blue';
  els.projectDialog.showModal();
  els.projectName.focus();
}

function openLinkDialog() {
  if (!state.projects.length) {
    openProjectDialog();
    return;
  }
  editingLinkId = null;
  els.linkDialogTitle.textContent = 'Add link';
  els.linkForm.reset();
  els.deleteLinkBtn.classList.add('hidden');
  els.linkProject.value = state.selectedProjectId !== 'all' ? state.selectedProjectId : state.projects[0]?.id;
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

function openQuickAddDialog() {
  if (!state.projects.length) {
    openProjectDialog();
    return;
  }
  els.quickAddForm.reset();
  els.quickProject.value = state.selectedProjectId !== 'all' ? state.selectedProjectId : state.projects[0]?.id;
  els.quickType.value = 'Other';
  els.quickAddDialog.showModal();
  els.quickUrl.focus();
}

function createLink(payload) {
  const nextOrder = getProjectLinks(payload.projectId).length;
  state.links.push({
    id: crypto.randomUUID(),
    visits: 0,
    lastOpened: null,
    order: nextOrder,
    pinned: false,
    badge: '',
    note: '',
    ...payload
  });
}

function updateLink(existing, payload) {
  const oldProjectId = existing.projectId;
  Object.assign(existing, payload);
  if (oldProjectId !== existing.projectId) {
    normaliseProjectOrders(oldProjectId);
    existing.order = getProjectLinks(existing.projectId).length - 1;
  }
}

function bindEvents() {
  els.addProjectBtn.addEventListener('click', openProjectDialog);
  els.addLinkBtn.addEventListener('click', openLinkDialog);
  els.quickAddBtn.addEventListener('click', openQuickAddDialog);
  els.exportBtn.addEventListener('click', () => exportState(state));
  els.importBtn.addEventListener('click', () => els.importInput.click());
  els.searchInput.addEventListener('input', render);
  els.typeFilter.addEventListener('change', render);
  els.projectFilter.addEventListener('change', render);

  document.querySelectorAll('[data-close-dialog]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById(button.dataset.closeDialog).close();
    });
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
      const existing = state.links.find(link => link.id === editingLinkId);
      if (existing) updateLink(existing, payload);
    } else {
      createLink(payload);
    }

    persist();
    els.linkDialog.close();
    render();
  });

  els.deleteLinkBtn.addEventListener('click', () => {
    if (!editingLinkId) return;
    const existing = state.links.find(link => link.id === editingLinkId);
    if (!existing) return;
    const projectId = existing.projectId;
    state.links = state.links.filter(link => link.id !== editingLinkId);
    normaliseProjectOrders(projectId);
    persist();
    els.linkDialog.close();
    render();
  });

  els.quickUrl.addEventListener('input', () => {
    if (!els.quickTitle.value.trim()) {
      els.quickTitle.value = inferTitleFromUrl(els.quickUrl.value);
    }

    const url = els.quickUrl.value.toLowerCase();
    if (url.includes('drawing') || url.includes('dwg') || url.includes('model')) els.quickType.value = 'Drawings / Models';
    else if (url.includes('rfi') || url.includes('issue')) els.quickType.value = 'Issues / RFIs';
    else if (url.includes('spec') || url.includes('standard')) els.quickType.value = 'Standards / Specs';
    else if (url.includes('minute') || url.includes('meeting')) els.quickType.value = 'Meetings';
    else if (url.includes('register') || url.includes('tracker')) els.quickType.value = 'Registers / Trackers';
  });

  els.quickAddForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = els.quickTitle.value.trim() || inferTitleFromUrl(els.quickUrl.value) || 'New link';
    createLink({
      projectId: els.quickProject.value,
      type: els.quickType.value,
      title,
      url: els.quickUrl.value.trim(),
      note: els.quickNote.value.trim(),
      badge: 'Quick-add',
      pinned: false
    });
    persist();
    els.quickAddDialog.close();
    render();
  });

  els.importInput.addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importStateFromFile(file);
      state.selectedProjectId = imported.selectedProjectId || 'all';
      state.projects = imported.projects || [];
      state.links = imported.links || [];
      state.projects.forEach(project => { project.collapsed = !!project.collapsed; });
      state.projects.forEach(project => normaliseProjectOrders(project.id));
      persist();
      render();
    } catch {
      alert('That file could not be imported.');
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
}

function render() {
  populateSelects();
  renderStats();
  renderSidebar();
  renderPinned();
  renderRecent();
  renderProjects();
  attachCardEvents();
  attachDragEvents();
}

bindEvents();
render();
