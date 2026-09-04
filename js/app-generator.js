/* ============================================================
   BIBLIOTECA DE PROMPS — APP GENERATOR v1.0
   Genera apps HTML/CSS interactivas completas desde prompts
   simplificados usando el sistema de diseño bento-grid.
   ============================================================ */
/* global PROMPTS_SIMPLIFIED, module */

const AppGenerator = {
  /**
   * Genera un documento HTML completo a partir de un prompt simplificado.
   * @param {string} appId - ID de la app en PROMPTS_SIMPLIFIED.apps
   * @returns {{ html: string, titulo: string }} HTML generado
   */
  generate(appId) {
    const app = PROMPTS_SIMPLIFIED.apps.find((a) => a.id === appId);
    if (!app) return { html: '', titulo: '', error: 'App no encontrada' };

    const sections = this.renderSections(app);
    const html = this.wrapDocument(app, sections);
    return { html, titulo: app.titulo };
  },

  /**
   * Genera HTML para todas las apps disponibles.
   * @returns {Array<{ id: string, titulo: string, html: string }>}
   */
  generateAll() {
    return PROMPTS_SIMPLIFIED.apps.map((app) => {
      const sections = this.renderSections(app);
      return {
        id: app.id,
        titulo: app.titulo,
        categoria: app.categoria,
        html: this.wrapDocument(app, sections),
      };
    });
  },

  renderSections(app) {
    return app.estructura.secciones
      .map((sec) => {
        switch (sec.tipo) {
          case 'bento-stats':
            return this.renderStatsSection(sec);
          case 'bento-table':
            return this.renderTableSection(sec, app);
          case 'bento-chart':
            return this.renderChartSection(sec, app);
          default:
            return '';
        }
      })
      .join('\n');
  },

  renderStatsSection(sec) {
    const cards = sec.tarjetas
      .map((t, i) => {
        const spanClass = i === 0 ? ' bento-item-span2' : '';
        const icon = this.iconSvg(t.icono);
        return `
          <div class="bento-item${spanClass}">
            <div class="bento-top">
              <span class="bento-icon">${icon}</span>
              <span class="bento-status bento-status-${t.status}">${t.status.toUpperCase()}</span>
            </div>
            <div class="bento-body">
              <span class="bento-num">${this.esc(t.valor)}</span>
              <span class="bento-desc">${this.esc(t.titulo)}</span>
            </div>
          </div>`;
      })
      .join('');

    return `
      <section class="dashboard-section">
        <h2 class="section-title">${this.esc(sec.titulo)}</h2>
        <div class="bento-grid">
          ${cards}
        </div>
      </section>`;
  },

  renderTableSection(sec, app) {
    const rows = (app.datos[sec.datos] || [])
      .map((row) => {
        const cells = sec.columnas
          .map((col) => {
            const key = this.colToKey(col);
            const val = row[key] || '';
            if (col === 'Estado' || col === 'Riesgo') {
              const cls = this.statusClass(val);
              return `<td><span class="bento-status bento-status-${cls}">${this.esc(val)}</span></td>`;
            }
            return `<td>${this.esc(String(val))}</td>`;
          })
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    const headers = sec.columnas.map((c) => `<th>${this.esc(c)}</th>`).join('');

    return `
      <section class="dashboard-section">
        <h2 class="section-title">${this.esc(sec.titulo)}</h2>
        <div class="bento-table-wrapper">
          <table class="bento-table">
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows || '<tr><td colspan="' + sec.columnas.length + '" class="empty-cell">Sin datos</td></tr>'}</tbody>
          </table>
        </div>
      </section>`;
  },

  renderChartSection(sec, app) {
    const data = app.datos[sec.datos] || [];
    const maxVal = Math.max(...data.map((d) => d.consumo || d.valor || 0), 1);
    const bars = data
      .map((d) => {
        const val = d.consumo || d.valor || 0;
        const pct = Math.round((val / maxVal) * 100);
        return `
          <div class="chart-bar-row">
            <span class="chart-bar-label">${this.esc(d.area || d.label || '')}</span>
            <div class="chart-bar-track">
              <div class="chart-bar-fill" style="width:${pct}%"></div>
            </div>
            <span class="chart-bar-val">${this.esc(String(val))}</span>
          </div>`;
      })
      .join('');

    return `
      <section class="dashboard-section">
        <h2 class="section-title">${this.esc(sec.titulo)}</h2>
        <div class="bento-chart-container">
          ${bars}
        </div>
      </section>`;
  },

  wrapDocument(app, sections) {
    const c = app.colores || { primary: '#ffb020', accent: '#4cc3ff', bg: '#0c1220' };
    return `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.esc(app.titulo)} — Biblioteca de Promps</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: ${c.bg};
      --bg2: #111a2b;
      --bg3: #182338;
      --line: #22314b;
      --line2: #334666;
      --txt: #e9f0fa;
      --txt2: #a9bad2;
      --txt3: #64748b;
      --brand: ${c.primary};
      --brand-dim: ${c.primary}1a;
      --accent: ${c.accent};
      --ok: #35d69a;
      --ok-dim: rgba(53,214,154,0.12);
      --ok-fg: #35d69a;
      --warn: #ffb020;
      --warn-dim: rgba(255,176,32,0.12);
      --warn-fg: #ffb020;
      --err: #ff5c5c;
      --err-dim: rgba(255,92,92,0.12);
      --err-fg: #ff5c5c;
      --info: #4cc3ff;
      --info-dim: rgba(76,195,255,0.12);
      --f-display: 'Chakra Petch', sans-serif;
      --f-body: 'Barlow', sans-serif;
      --f-mono: 'IBM Plex Mono', monospace;
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --bento-dot: rgb(226 232 240 / 5%);
      --bento-glow-a: var(--brand-dim);
      --bento-glow-b: var(--info-dim);
      --bento-shadow: 0 2px 12px rgb(2 6 23 / 12%);
      --shadow-lg: 0 8px 32px rgb(2 6 23 / 40%);
    }
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: var(--f-body);
      background: var(--bg);
      color: var(--txt);
      line-height: 1.6;
      min-height: 100vh;
    }
    .topbar {
      position: sticky; top: 0; z-index: 100;
      background: var(--bg2);
      border-bottom: 1px solid var(--line);
      padding: 0.8rem 1.4rem;
      display: flex; align-items: center; justify-content: space-between;
      gap: 1rem;
      backdrop-filter: blur(12px);
    }
    .topbar h1 {
      font-family: var(--f-display);
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      display: flex; align-items: center; gap: 0.5rem;
    }
    .topbar h1 span { color: var(--brand); }
    .topbar-badge {
      font-family: var(--f-mono);
      font-size: 0.6rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      background: var(--brand-dim);
      color: var(--brand);
      white-space: nowrap;
    }
    .main {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.4rem;
    }
    .dashboard-section {
      margin-bottom: 2rem;
    }
    .section-title {
      font-family: var(--f-display);
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--txt2);
      margin-bottom: 0.8rem;
      padding-left: 0.2rem;
    }
    /* ---- BENTO GRID ---- */
    .bento-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
      width: 100%;
    }
    @media (min-width: 768px) {
      .bento-grid { grid-template-columns: repeat(3, 1fr); }
      .bento-item-span2 { grid-column: span 2; }
    }
    .bento-item {
      position: relative;
      background: var(--bg2);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 1rem;
      overflow: hidden;
      transition: transform 0.3s var(--ease-out), border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .bento-item::before {
      content: '';
      position: absolute; inset: 0;
      background-image: radial-gradient(circle at center, var(--bento-dot) 1px, transparent 1px);
      background-size: 4px 4px;
      opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
    }
    .bento-item::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, transparent 25%, var(--bento-glow-a) 55%, var(--bento-glow-b) 85%, transparent);
      opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
    }
    .bento-item:hover {
      transform: translateY(-2px);
      border-color: var(--line2);
      box-shadow: var(--bento-shadow);
    }
    .bento-item:hover::before, .bento-item:hover::after { opacity: 1; }
    .bento-top {
      position: relative; z-index: 1;
      display: flex; align-items: center; justify-content: space-between;
      gap: 0.5rem; margin-bottom: 0.8rem;
    }
    .bento-icon {
      display: inline-flex; align-items: center; justify-content: center;
      width: 2rem; height: 2rem;
      border-radius: 8px;
      background: var(--bg3);
      transition: background 0.3s ease, transform 0.3s var(--ease-out);
    }
    .bento-icon svg { width: 1rem; height: 1rem; stroke: var(--txt2); }
    .bento-item:hover .bento-icon {
      background: linear-gradient(135deg, var(--bento-glow-a), var(--bento-glow-b));
      transform: scale(1.06);
    }
    .bento-status {
      font-family: var(--f-mono);
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      line-height: 1;
      padding: 0.32rem 0.55rem;
      border-radius: 8px;
      background: var(--bg3);
      color: var(--txt2);
      white-space: nowrap;
    }
    .bento-status-ok { background: var(--ok-dim); color: var(--ok-fg); }
    .bento-status-warn { background: var(--warn-dim); color: var(--warn-fg); }
    .bento-status-err { background: var(--err-dim); color: var(--err-fg); }
    .bento-status-info { background: var(--info-dim); color: var(--info); }
    .bento-body {
      position: relative; z-index: 1;
      display: flex; flex-direction: column; gap: 0.45rem;
    }
    .bento-num {
      font-family: var(--f-display);
      font-size: 1.9rem;
      font-weight: 700;
      line-height: 1.05;
      color: var(--brand);
    }
    .bento-desc {
      font-size: 0.82rem;
      line-height: 1.45;
      color: var(--txt2);
    }
    /* ---- BENTO TABLE ---- */
    .bento-table-wrapper {
      background: var(--bg2);
      border: 1px solid var(--line);
      border-radius: 12px;
      overflow: hidden;
    }
    .bento-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
    }
    .bento-table thead th {
      font-family: var(--f-mono);
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-align: left;
      padding: 0.7rem 1rem;
      background: var(--bg3);
      color: var(--txt2);
      border-bottom: 1px solid var(--line);
      position: sticky; top: 46px;
    }
    .bento-table tbody td {
      padding: 0.65rem 1rem;
      border-bottom: 1px solid var(--line);
      color: var(--txt);
      font-size: 0.82rem;
    }
    .bento-table tbody tr:last-child td { border-bottom: none; }
    .bento-table tbody tr:hover { background: var(--bg3); }
    .empty-cell {
      text-align: center;
      color: var(--txt3);
      padding: 2rem;
      font-family: var(--f-mono);
      font-size: 0.7rem;
      letter-spacing: 0.04em;
    }
    /* ---- CHART ---- */
    .bento-chart-container {
      background: var(--bg2);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 1.4rem;
    }
    .chart-bar-row {
      display: flex; align-items: center; gap: 0.6rem;
      margin-bottom: 0.55rem;
    }
    .chart-bar-row:last-child { margin-bottom: 0; }
    .chart-bar-label {
      font-family: var(--f-mono);
      font-size: 0.65rem;
      color: var(--txt2);
      width: 150px;
      text-align: right;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      flex-shrink: 0;
    }
    .chart-bar-track {
      flex: 1;
      height: 22px;
      background: var(--bg3);
      border-radius: 4px;
      overflow: hidden;
    }
    .chart-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--brand), var(--accent));
      border-radius: 4px;
      transition: width 0.5s var(--ease-out);
      min-width: 2px;
    }
    .chart-bar-val {
      font-family: var(--f-mono);
      font-size: 0.65rem;
      color: var(--txt2);
      width: 60px;
      flex-shrink: 0;
    }
    .footer {
      text-align: center;
      padding: 1.5rem;
      font-size: 0.7rem;
      color: var(--txt3);
      border-top: 1px solid var(--line);
      font-family: var(--f-mono);
      letter-spacing: 0.04em;
    }
    @media (max-width: 640px) {
      .main { padding: 1rem; }
      .chart-bar-label { width: 100px; }
      .bento-table { font-size: 0.72rem; }
      .bento-table thead th, .bento-table tbody td { padding: 0.5rem 0.6rem; }
    }
    @media (prefers-reduced-motion: reduce) {
      .bento-item, .bento-item::before, .bento-item::after, .bento-icon { transition: none; }
      .bento-item:hover { transform: none; }
    }
    @media print {
      .topbar { position: static; }
      body { background: #fff; color: #000; }
      .bento-item { border-color: #ccc; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <h1><span>◆</span> ${this.esc(app.titulo)}</h1>
    <span class="topbar-badge">${this.esc(app.categoria)} · ${this.esc(app.prioridad.toUpperCase())}</span>
  </header>
  <main class="main">
    ${sections}
  </main>
  <footer class="footer">
    Generado por Biblioteca de Promps Industriales · Sistema Bento-Grid · ${new Date().toISOString().split('T')[0]}
  </footer>
</body>
</html>`;
  },

  /**
   * Descarga una app como archivo HTML.
   */
  downloadApp(appId) {
    const { html, titulo, error } = this.generate(appId);
    if (error) return false;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (titulo || 'app').replace(/\s+/g, '_').toLowerCase() + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  },

  /**
   * Abre la app generada en una nueva pestaña.
   */
  openApp(appId) {
    const { html, error } = this.generate(appId);
    if (error) return false;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  },

  iconSvg(name) {
    const icons = {
      valve:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12v4l-2 4v8l2 4H6l2-4v-8L6 6V2z"/><line x1="8" y1="2" x2="16" y2="2"/></svg>',
      'check-circle':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      clock:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      'alert-triangle':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      calendar:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
      'trending-up':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
      layers:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>',
      target:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      'shield-check':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
      activity:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      truck:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
      tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
      'x-circle':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
      shield:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      droplet:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
      package:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
      scale:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="16" y1="4" x2="8" y2="20"/><line x1="8" y1="4" x2="16" y2="20"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
      grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
      'file-text':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
      'alert-circle':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      'dollar-sign':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      'bar-chart':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
      leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 12 13 11"/></svg>',
      users:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      award:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
      'book-open':
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    };
    return icons[name] || icons['activity'];
  },

  colToKey(col) {
    const map = {
      Tag: 'tag',
      Servicio: 'servicio',
      Fabricante: 'fabricante',
      'Última Inspección': 'ultima',
      Próxima: 'proxima',
      Estado: 'estado',
      Circuito: 'circuito',
      Material: 'material',
      't_min (mm)': 'tmin',
      't_act (mm)': 'tact',
      'Vida Rem. (años)': 'vida',
      Riesgo: 'riesgo',
      Patente: 'patente',
      Tipo: 'tipo',
      'Km Actual': 'kmActual',
      'Km Próx. Serv.': 'kmProx',
      Diferencia: 'diff',
      Ubicación: 'ubicacion',
      Vencimiento: 'vencimiento',
      Lote: 'lote',
      Residuo: 'residuo',
      'NFPA 704': 'nfpa',
      Ingreso: 'ingreso',
      'Límite 180d': 'limite',
      'Días Rest.': 'dias',
      'OC #': 'oc',
      Proveedor: 'proveedor',
      'Fecha Prometida': 'prometida',
      'Días Retraso': 'retraso',
      Criticidad: 'crit',
      Área: 'area',
      'Límite (kW)': 'limite',
      'Actual (kW)': 'actual',
      Desviación: 'desviacion',
      Horario: 'horario',
      RUT: 'rut',
      Nombre: 'nombre',
      Curso: 'curso',
      'Fecha Vencimiento': 'vencimiento',
      'Días Vencido': 'dias',
    };
    return map[col] || col.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '');
  },

  statusClass(val) {
    const v = String(val).toLowerCase();
    if (v === 'ok' || v === 'bajo' || v === 'conforme') return 'ok';
    if (v === 'warn' || v === 'medio' || v === 'pendiente') return 'warn';
    if (v === 'err' || v === 'alto' || v === 'crítico') return 'err';
    return 'info';
  },

  esc(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AppGenerator };
}
