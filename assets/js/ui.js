export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function initialsFromText(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return words.map(word => word[0]).join('').toUpperCase() || '•';
}

export function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Never opened';
  const diff = Date.now() - timestamp;
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function countByProject(links) {
  return links.reduce((acc, link) => {
    acc[link.projectId] = (acc[link.projectId] || 0) + 1;
    return acc;
  }, {});
}

export function createMiniCard(link, project) {
  const icon = project?.icon || initialsFromText(link.title);
  const color = project?.color || 'soft-slate';
  return `
    <a class="mini-card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener" data-open-link="${link.id}">
      <div class="thumb ${color}">${escapeHtml(icon)}</div>
      <div class="card-body">
        <div class="card-topline">
          <span>${escapeHtml(project?.name || 'Unknown project')}</span>
          <span>${escapeHtml(link.type)}</span>
        </div>
        <div class="card-title">${escapeHtml(link.title)}</div>
        <div class="card-note">${escapeHtml(link.note || 'No note')}</div>
      </div>
    </a>`;
}

export function createFullCard(link, project) {
  const icon = project?.icon || initialsFromText(link.title);
  const color = project?.color || 'soft-slate';
  return `
    <a class="card-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener" data-open-link="${link.id}">
      <div class="thumb ${color}">${escapeHtml(icon)}</div>
      <div class="card-body">
        <div class="card-topline">
          <span>${escapeHtml(link.type)}</span>
          <span>${escapeHtml(formatTimeAgo(link.lastOpened))}</span>
        </div>
        <div class="card-title">${escapeHtml(link.title)}</div>
        <div class="card-note">${escapeHtml(link.note || 'No note added')}</div>
        <div class="pill-row">
          ${link.badge ? `<span class="pill">${escapeHtml(link.badge)}</span>` : ''}
          <span class="pill">${escapeHtml(project?.name || 'Unknown project')}</span>
          ${link.pinned ? `<span class="pill">Pinned</span>` : ''}
        </div>
      </div>
    </a>`;
}
