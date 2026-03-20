:root {
  --bg: #09111d;
  --bg-2: #0f1a29;
  --panel: #111d2b;
  --panel-2: #132233;
  --panel-3: #0f1724;
  --card: rgba(255, 255, 255, 0.045);
  --card-hover: rgba(255, 255, 255, 0.085);
  --line: rgba(165, 193, 224, 0.18);
  --line-strong: rgba(165, 193, 224, 0.3);
  --text: #eaf3ff;
  --muted: #9eb2ca;
  --shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
  --radius: 20px;
  --radius-sm: 14px;
  --max: 1500px;
  --accent: #64b5ff;
  --accent-2: #6fe6c6;
}

* { box-sizing: border-box; }
html, body {
  margin: 0;
  min-height: 100%;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background:
    linear-gradient(180deg, rgba(10, 18, 28, 0.8), rgba(10, 18, 28, 0.96)),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 120px),
    repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 120px),
    radial-gradient(circle at top left, rgba(100,181,255,0.15), transparent 28%),
    radial-gradient(circle at top right, rgba(111,230,198,0.1), transparent 24%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%);
}

a { color: inherit; }
button, input, select, textarea { font: inherit; }

.app-shell {
  width: min(calc(100% - 28px), var(--max));
  margin: 0 auto;
  padding: 18px 0 34px;
}

.panel {
  background: linear-gradient(180deg, rgba(19, 34, 51, 0.92), rgba(15, 23, 36, 0.94));
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
}

.topbar {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 20px;
  padding: 24px;
  margin-bottom: 14px;
}

.eyebrow {
  display: inline-block;
  color: #7ecfff;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.76rem;
  margin-bottom: 8px;
}

h1, h2, h3 { margin: 0; letter-spacing: -0.03em; }
h1 { font-size: clamp(2rem, 3.8vw, 3.15rem); }
.topbar-copy, .small, .helper-text, .section-head p, .project-meta, .modal-header p { color: var(--muted); }
.topbar-copy { margin: 10px 0 0; max-width: 70ch; line-height: 1.55; }

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat {
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 14px;
  background: rgba(255,255,255,0.04);
}
.stat-value { font-size: 1.5rem; font-weight: 700; }
.stat-label { color: var(--muted); font-size: 0.86rem; margin-top: 4px; }

.phase-strip {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 12px 16px;
  margin-bottom: 14px;
}
.phase-badge {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: rgba(255,255,255,0.04);
  color: var(--muted);
  font-size: 0.82rem;
}
.phase-badge.is-live {
  color: var(--text);
  background: rgba(100,181,255,0.12);
}

.toolbar {
  display: grid;
  gap: 14px;
  padding: 16px;
  margin-bottom: 16px;
}
.toolbar-main,
.toolbar-actions {
  display: grid;
  gap: 12px;
}
.toolbar-main { grid-template-columns: minmax(240px, 1.4fr) 0.8fr 0.8fr; }
.toolbar-actions { grid-template-columns: repeat(5, auto); justify-content: start; }

.field,
.button,
select,
textarea {
  min-height: 46px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.04);
  color: var(--text);
}
.field,
select,
textarea { width: 100%; padding: 0 14px; outline: none; }
textarea.field { min-height: 96px; padding: 12px 14px; resize: vertical; }
.field::placeholder, textarea::placeholder { color: #8ea6c2; }
.button {
  cursor: pointer;
  padding: 0 16px;
  font-weight: 650;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}
.button:hover, .button:focus-visible, .project-chip:hover, .project-toggle:hover, .card-link:hover, .mini-card:hover {
  transform: translateY(-1px);
}
.button.primary {
  background: linear-gradient(135deg, #66b3ff, #4b8dff);
  color: #061220;
  border: none;
}
.button.secondary {
  background: rgba(111,230,198,0.12);
  border-color: rgba(111,230,198,0.26);
}
.button.ghost { background: rgba(255,255,255,0.03); }
.button.danger { background: rgba(255, 117, 117, 0.12); border-color: rgba(255, 117, 117, 0.24); }

.workspace {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 16px;
}

.sidebar,
.section { padding: 18px; }
.sidebar { position: sticky; top: 14px; align-self: start; }
.sidebar-section + .sidebar-section { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--line); }
.tips-list { margin: 10px 0 0; padding-left: 18px; color: var(--muted); line-height: 1.5; }

.project-list { display: grid; gap: 10px; margin-top: 12px; }
.project-chip {
  text-align: left;
  width: 100%;
  border-radius: 16px;
  padding: 12px 14px;
  border: 1px solid transparent;
  background: rgba(255,255,255,0.035);
  color: var(--text);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.project-chip.active { border-color: var(--project-accent, rgba(100,181,255,0.4)); background: rgba(100,181,255,0.12); }
.chip-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
.project-dot { width: 12px; height: 12px; border-radius: 50%; flex: 0 0 auto; box-shadow: 0 0 0 3px rgba(255,255,255,0.04); }
.chip-count { color: var(--muted); font-size: 0.78rem; padding: 4px 8px; border-radius: 999px; background: rgba(255,255,255,0.05); }

.content-grid { display: grid; gap: 16px; }
.section-head { display: flex; justify-content: space-between; align-items: end; gap: 12px; margin-bottom: 14px; }
.section-head p { margin: 5px 0 0; }

.mini-grid,
.card-grid { display: grid; gap: 14px; }
.mini-grid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.card-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }

.mini-card,
.card-link {
  display: block;
  text-decoration: none;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.025));
  overflow: hidden;
  position: relative;
  transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}
.card-link:hover, .mini-card:hover { border-color: var(--project-accent, var(--line-strong)); background: var(--card-hover); }
.card-link.dragging { opacity: 0.45; outline: 2px dashed var(--project-accent, #66b3ff); }
.card-link.drop-target { outline: 2px solid var(--project-accent, #66b3ff); }
.card-link.sortable { cursor: grab; }
.card-link.sortable:active { cursor: grabbing; }
.drag-hint {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.65);
  background: rgba(0,0,0,0.24);
  padding: 4px 8px;
  border-radius: 999px;
}

.thumb {
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: white;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.project-theme-blue { --project-accent: #64b5ff; --project-accent-soft: rgba(100,181,255,0.15); }
.project-theme-green { --project-accent: #4ed4a8; --project-accent-soft: rgba(78,212,168,0.15); }
.project-theme-purple { --project-accent: #a18bff; --project-accent-soft: rgba(161,139,255,0.15); }
.project-theme-gold { --project-accent: #f0bf59; --project-accent-soft: rgba(240,191,89,0.18); }
.project-theme-red { --project-accent: #ff8f8f; --project-accent-soft: rgba(255,143,143,0.16); }
.project-theme-slate { --project-accent: #8aa3c2; --project-accent-soft: rgba(138,163,194,0.16); }

.thumb.project-theme-blue { background: linear-gradient(135deg, #2f67dc, #64b5ff); }
.thumb.project-theme-green { background: linear-gradient(135deg, #0c7f64, #4ed4a8); }
.thumb.project-theme-purple { background: linear-gradient(135deg, #5d3fe1, #a18bff); }
.thumb.project-theme-gold { background: linear-gradient(135deg, #8a5a04, #f0bf59); color: #241600; }
.thumb.project-theme-red { background: linear-gradient(135deg, #a54343, #ff8f8f); }
.thumb.project-theme-slate { background: linear-gradient(135deg, #44556e, #8aa3c2); }

.card-body { padding: 15px; display: grid; gap: 8px; }
.card-topline {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: var(--muted);
  font-size: 0.8rem;
}
.card-title { font-size: 1rem; font-weight: 700; line-height: 1.28; }
.card-note { color: var(--muted); line-height: 1.45; min-height: 2.8em; font-size: 0.92rem; }
.pill-row { display: flex; flex-wrap: wrap; gap: 8px; }
.pill {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  color: var(--muted);
  font-size: 0.78rem;
}

.project-block + .project-block { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--line); }
.project-toggle {
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border-radius: 16px;
  border: 1px solid var(--line);
  padding: 14px 16px;
  background: linear-gradient(180deg, var(--project-accent-soft, rgba(255,255,255,0.05)), rgba(255,255,255,0.02));
  color: var(--text);
  cursor: pointer;
}
.project-toggle-right { color: var(--muted); font-size: 0.9rem; }
.project-content.collapsed { display: none; }
.empty {
  padding: 28px;
  text-align: center;
  color: var(--muted);
  border: 1px dashed var(--line-strong);
  border-radius: 18px;
  background: rgba(255,255,255,0.025);
}

dialog {
  border: none;
  background: transparent;
  padding: 0;
  width: min(720px, calc(100% - 22px));
}
dialog::backdrop { background: rgba(6, 10, 18, 0.72); backdrop-filter: blur(4px); }
.modal {
  background: linear-gradient(180deg, #132233, #0f1724);
  border: 1px solid var(--line-strong);
  border-radius: 22px;
  box-shadow: var(--shadow);
  padding: 22px;
}
.modal-header { display: flex; justify-content: space-between; align-items: start; gap: 12px; margin-bottom: 16px; }
.close-x {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.05);
  color: var(--text);
  cursor: pointer;
}
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.form-group { display: grid; gap: 8px; }
.form-group.full { grid-column: 1 / -1; }
.inline-check { align-content: end; }
label { color: var(--muted); font-size: 0.9rem; }
.modal-actions {
  display: flex;
  justify-content: end;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;
}
.modal-actions.spread { justify-content: space-between; }
.modal-actions-right { display: flex; gap: 10px; flex-wrap: wrap; }
.hidden { display: none !important; }

@media (max-width: 1180px) {
  .topbar,
  .workspace,
  .toolbar-main,
  .toolbar-actions { grid-template-columns: 1fr; }
  .sidebar { position: static; }
}

@media (max-width: 760px) {
  .app-shell { width: min(calc(100% - 16px), var(--max)); }
  .status-grid,
  .form-grid { grid-template-columns: 1fr; }
  .topbar, .toolbar, .sidebar, .section { padding: 16px; }
  h1 { font-size: 2rem; }
}
