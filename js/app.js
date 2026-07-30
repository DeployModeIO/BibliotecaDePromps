/* ============================================================
   BIBLIOTECA DE PROMPS INDUSTRIALES — APP CORE v3.2
   ============================================================ */
/* global PROMPTS_DB, PROMPTS_DB_EXTRA, PROMPTS_DB_V2 */

const PLATFORM_SPECS = {
  web: {
    label: 'WEB',
    spec: 'Aplicación web en un único archivo HTML/CSS/JavaScript. Responsive mobile-first. Compatible con Chrome, Firefox, Edge y Safari (últimas 2 versiones). Sin dependencias de backend; librerías solo vía CDN con fallback. Debe funcionar al abrir el archivo directamente (file://) o desde cualquier hosting estático.'
  },
  android: {
    label: 'ANDROID',
    spec: 'Instalable como PWA desde Chrome ("Agregar a pantalla de inicio") con manifest.json y service worker para funcionamiento offline. Como alternativa nativa, indicar cómo envolver con Capacitor (@capacitor/cli) para generar un APK. Diseño mobile-first, touch targets mínimos 48x48dp, soporte para notch y navegación por gestos.'
  },
  ios: {
    label: 'IOS',
    spec: 'Instalable como PWA desde Safari ("Agregar a pantalla de inicio"). Incluir meta tags apple-mobile-web-app-capable=yes, apple-mobile-web-app-status-bar-style=black-translucent y viewport-fit=cover para respetar safe-areas. Como alternativa nativa, indicar empaquetado con Capacitor para IPA. Soporte para iPhone y iPad.'
  },
  tablet: {
    label: 'TABLET',
    spec: 'Layout responsive con breakpoints dedicados para tablets (768px–1280px). Interfaz optimizada para uso en campo: botones grandes (mínimo 56px), alto contraste, operable con guantes. Aprovechar pantalla ancha con layouts de 2-3 columnas. Compatible con iPad (Safari) y tablets Android (Chrome).'
  },
  windows: {
    label: 'WINDOWS',
    spec: 'Instalable como PWA desde Edge o Chrome (botón "Instalar" en la barra de direcciones) con acceso offline vía service worker. Como alternativa de escritorio, indicar cómo empaquetar con Electron para generar un ejecutable .exe instalable. Optimizado para resoluciones 1366x768 y superiores, con soporte de teclado y atajos.'
  }
};
const PLATFORM_KEYS = Object.keys(PLATFORM_SPECS);

/* Almacenamiento resistente: si Brave Shields (o modo privado) bloquea
   localStorage, se usa un fallback en memoria para que la app no se rompa. */
const SafeStore = {
  _mem: Object.create(null),
  _ok: null,
  available() {
    if (this._ok !== null) return this._ok;
    try {
      const k = '__bdp_test__';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      this._ok = true;
    } catch (e) {
      this._ok = false;
    }
    return this._ok;
  },
  get(key) {
    if (this.available()) {
      try { return localStorage.getItem(key); } catch (e) { /* ignore */ }
    }
    return key in this._mem ? this._mem[key] : null;
  },
  set(key, val) {
    if (this.available()) {
      try { localStorage.setItem(key, val); return; } catch (e) { /* ignore */ }
    }
    this._mem[key] = val;
  }
};

class PromptLibrary {
  constructor() {
    this.data = this.mergeData();
    this.index = new Map();
    this.buildIndex();

    this.state = {
      q: '', priority: null, type: null,
      platforms: new Set(this.load('platforms', ['web']))
    };
    this.currentCategory = null;
    this.currentPrompt = null;
    this.currentMeta = null;

    this.favorites = this.load('favorites', []);
    this.history = this.load('promptHistory', []);
    this.deferredPrompt = null;
    this.revealObserver = null;

    this.cacheDom();
    this.init();
  }

  /* ---------- data ---------- */

  mergeData() {
    const merged = JSON.parse(JSON.stringify(PROMPTS_DB));
    
    // Fusionar PROMPTS_DB_EXTRA
    if (typeof PROMPTS_DB_EXTRA !== 'undefined') {
      PROMPTS_DB_EXTRA.categorias.forEach(extraCat => {
        const existing = merged.categorias.find(c => c.id === extraCat.id);
        if (existing) {
          extraCat.subcategorias.forEach(sub => {
            const existingSub = existing.subcategorias.find(s => s.id === sub.id);
            if (existingSub) existingSub.prompts.push(...sub.prompts);
            else existing.subcategorias.push(sub);
          });
        } else {
          merged.categorias.push(extraCat);
        }
      });
    }
    
    // Fusionar PROMPTS_DB_V2
    if (typeof PROMPTS_DB_V2 !== 'undefined') {
      PROMPTS_DB_V2.categorias.forEach(v2Cat => {
        const existing = merged.categorias.find(c => c.id === v2Cat.id);
        if (existing) {
          v2Cat.subcategorias.forEach(sub => {
            const existingSub = existing.subcategorias.find(s => s.id === sub.id);
            if (existingSub) existingSub.prompts.push(...sub.prompts);
            else existing.subcategorias.push(sub);
          });
        } else {
          merged.categorias.push(v2Cat);
        }
      });
    }
    
    return merged;
  }

  buildIndex() {
    this.data.categorias.forEach(cat => {
      cat.subcategorias.forEach(sub => {
        sub.prompts.forEach(p => {
          this.index.set(p.id, { prompt: p, cat, sub });
        });
      });
    });
  }

  allPrompts() {
    const out = [];
    this.data.categorias.forEach(cat =>
      cat.subcategorias.forEach(sub =>
        sub.prompts.forEach(p => out.push({ p, cat, sub }))));
    return out;
  }

  load(key, fallback) {
    try {
      const raw = SafeStore.get(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  save(key, val) {
    try { SafeStore.set(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
  }

  /* ---------- dom ---------- */

  cacheDom() {
    const $ = id => document.getElementById(id);
    this.el = {
      searchInput: $('searchInput'), filterBar: $('filterBar'),
      homeView: $('homeView'), categoriesGrid: $('categoriesGrid'), catCount: $('catCount'),
      categoryView: $('categoryView'), catBanner: $('catBanner'), promptsList: $('promptsList'),
      resultsView: $('resultsView'), resultsList: $('resultsList'), resultsCount: $('resultsCount'),
      statPrompts: $('statPrompts'), statIndustries: $('statIndustries'),
      statWords: $('statWords'), statStandards: $('statStandards'),
      clock: $('clock'), connStatus: $('connStatus'), connLabel: $('connLabel'),
      favToggle: $('favToggle'), histToggle: $('histToggle'), favCount: $('favCount'),
      themeToggle: $('themeToggle'), installBtn: $('installBtn'), chatBtn: $('chatToggle'),
      modal: $('promptModal'), modalStripe: $('modalStripe'), modalId: $('modalId'),
      modalPriority: $('modalPriority'), modalTitle: $('modalTitle'),
      modalMeta: $('modalMeta'), modalPromptText: $('modalPromptText'), modalClose: $('modalClose'),
      copyBtn: $('copyBtn'), gptBtn: $('gptBtn'), claudeBtn: $('claudeBtn'), sendToChatBtn: $('sendToChatBtn'),
      favoriteBtn: $('favoriteBtn'), emailBtn: $('emailBtn'), pdfBtn: $('pdfBtn'), excelBtn: $('excelBtn'),
      platformChips: $('platformChips'),
      favDrawer: $('favDrawer'), histDrawer: $('histDrawer'),
      favList: $('favList'), histList: $('histList'), drawerScrim: $('drawerScrim'),
      toast: $('toast')
    };
  }

  init() {
    this.setupReveal();
    this.renderStats();
    this.renderCategories();
    this.bindEvents();
    this.startClock();
    this.updateConn();
    this.setupTheme();
    this.setupSW();
    this.updateFavBadge();
    if (window.AIChat) window.AIChat.init();
    if (!SafeStore.available()) {
      setTimeout(() => this.showToast('⚠ Navegador bloquea almacenamiento — favoritos/historial no persistirán (baje los Shields de Brave)', ''), 800);
    }
  }

  /* ---------- events ---------- */

  bindEvents() {
    this.el.searchInput.addEventListener('input', e => {
      this.state.q = e.target.value.trim().toLowerCase();
      this.applyState();
    });

    this.el.filterBar.addEventListener('click', e => this.onFilterClick(e));

    this.el.categoriesGrid.addEventListener('click', e => {
      const panel = e.target.closest('.cat-panel');
      if (panel) this.openCategory(panel.dataset.id);
    });

    this.el.categoryView.addEventListener('click', e => {
      if (e.target.closest('#backBtn')) { this.goHome(); return; }
      const card = e.target.closest('.pcard');
      if (card) this.openPromptById(card.dataset.id);
    });

    this.el.resultsList.addEventListener('click', e => {
      const card = e.target.closest('.pcard');
      if (card) this.openPromptById(card.dataset.id);
    });

    this.el.favToggle.addEventListener('click', () => { this.renderFavList(); this.openDrawer('fav'); });
    this.el.histToggle.addEventListener('click', () => { this.renderHistList(); this.openDrawer('hist'); });
    this.el.drawerScrim.addEventListener('click', () => this.closeDrawers());
    document.querySelectorAll('[data-close-drawer]').forEach(b =>
      b.addEventListener('click', () => this.closeDrawers()));

    [this.el.favList, this.el.histList].forEach(list => {
      list.addEventListener('click', e => {
        const x = e.target.closest('.di-x');
        const item = e.target.closest('.drawer-item');
        if (!item) return;
        if (x) {
          if (list === this.el.favList) this.removeFavoriteById(item.dataset.id);
          else this.removeHistoryById(item.dataset.id);
          return;
        }
        this.closeDrawers();
        this.openPromptById(item.dataset.id);
      });
    });

    this.el.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.el.installBtn.addEventListener('click', () => this.install());

    this.el.modalClose.addEventListener('click', () => this.closeModal());
    this.el.modal.addEventListener('click', e => { if (e.target === this.el.modal) this.closeModal(); });

    this.el.copyBtn.addEventListener('click', () => {
      if (!this.currentPrompt) return;
      this.copyText(this.getFullPrompt(), this.el.copyBtn);
    });
    this.el.gptBtn.addEventListener('click', () => this.openInAI('https://chatgpt.com/', 'ChatGPT'));
    this.el.claudeBtn.addEventListener('click', () => this.openInAI('https://claude.ai/new', 'Claude'));
    this.el.sendToChatBtn.addEventListener('click', () => {
      if (this.currentPrompt) {
        this.closeModal();
        if (window.AIChat) window.AIChat.sendPrompt(this.getFullPrompt());
      }
    });
    this.el.chatBtn.addEventListener('click', () => {
      if (window.AIChat) window.AIChat.openDrawer();
    });
    this.el.favoriteBtn.addEventListener('click', () => {
      if (this.currentPrompt) this.toggleFavorite(this.currentPrompt);
    });
    this.el.emailBtn.addEventListener('click', () => { if (this.currentPrompt) this.sendByEmail(this.currentPrompt); });
    this.el.pdfBtn.addEventListener('click', () => { if (this.currentPrompt) this.exportToPDF(this.currentPrompt); });
    this.el.excelBtn.addEventListener('click', () => { if (this.currentPrompt) this.exportToExcel(this.currentPrompt); });

    this.el.platformChips.addEventListener('click', e => this.onPlatformClick(e));

    window.addEventListener('online', () => this.updateConn());
    window.addEventListener('offline', () => this.updateConn());

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.el.installBtn.hidden = false;
    });

    document.addEventListener('keydown', e => this.onKeydown(e));
  }

  onKeydown(e) {
    const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if (e.key === '/' && !typing) {
      e.preventDefault();
      this.el.searchInput.focus();
      this.el.searchInput.select();
      return;
    }
    if (e.key === 'Escape') {
      if (this.el.modal.classList.contains('active')) { this.closeModal(); return; }
      if (this.el.favDrawer.classList.contains('active') || this.el.histDrawer.classList.contains('active')) {
        this.closeDrawers(); return;
      }
      if (this.el.searchInput.value) {
        this.el.searchInput.value = '';
        this.state.q = '';
        this.applyState();
      }
    }
  }

  onFilterClick(e) {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    if (chip.hasAttribute('data-reset')) {
      this.state.priority = null;
      this.state.type = null;
    } else if (chip.dataset.priority) {
      this.state.priority = this.state.priority === chip.dataset.priority ? null : chip.dataset.priority;
      this.state.type = null;
    } else if (chip.dataset.type) {
      this.state.type = this.state.type === chip.dataset.type ? null : chip.dataset.type;
      this.state.priority = null;
    }
    this.syncChips();
    this.applyState();
  }

  syncChips() {
    this.el.filterBar.querySelectorAll('.chip').forEach(chip => {
      let on = false;
      if (chip.hasAttribute('data-reset')) on = !this.state.priority && !this.state.type;
      else if (chip.dataset.priority) on = this.state.priority === chip.dataset.priority;
      else if (chip.dataset.type) on = this.state.type === chip.dataset.type;
      chip.classList.toggle('is-on', on);
    });
  }

  /* ---------- state / views ---------- */

  isFiltering() {
    return !!(this.state.q || this.state.priority || this.state.type);
  }

  matches(entry) {
    const { p, cat } = entry;
    if (this.state.priority && p.prioridad !== this.state.priority) return false;
    if (this.state.type) {
      const c = (p.categoria || '').toLowerCase();
      if (this.state.type === 'app' && !c.includes('aplicaci')) return false;
      if (this.state.type === 'tool' && !c.includes('herramienta')) return false;
    }
    if (this.state.q) {
      const hay = (p.titulo + ' ' + p.tags.join(' ') + ' ' + p.prompt + ' ' + cat.nombre).toLowerCase();
      if (!hay.includes(this.state.q)) return false;
    }
    return true;
  }

  applyState() {
    const filtering = this.isFiltering();
    this.el.homeView.hidden = filtering || !!this.currentCategory;
    this.el.categoryView.hidden = filtering || !this.currentCategory;
    this.el.resultsView.hidden = !filtering;
    if (filtering) this.renderResults();
  }

  /* ---------- rendering ---------- */

  esc(s) {
    return String(s).replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  fmt(n) { return n.toLocaleString('es-CL'); }

  wordCount(text) { return text.split(/\s+/).filter(Boolean).length; }

  setupReveal() {
    this.revealObserver = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          this.revealObserver.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });
  }

  observeReveals(scope) {
    const els = scope.querySelectorAll('.reveal:not(.in)');
    els.forEach(el => {
      this.revealObserver.observe(el);
      el.classList.add('in');
    });
  }

  renderStats() {
    const all = this.allPrompts();
    const totalWords = all.reduce((s, e) => s + this.wordCount(e.p.prompt), 0);
    this.animateCount(this.el.statPrompts, all.length);
    this.animateCount(this.el.statIndustries, this.data.categorias.length);
    this.animateCount(this.el.statWords, totalWords);
    const standards = ['API', 'ASME', 'OSHA', 'NFPA', 'ISO', 'IEC', 'IOGP', 'NACE', 'GMP', 'AWWA'];
    this.el.statStandards.textContent = standards.slice(0, 3).join(' · ') + ' +' + (standards.length - 3);
    this.el.catCount.textContent = this.data.categorias.length + ' SISTEMAS ACTIVOS';
  }

  animateCount(el, target, dur = 1000) {
    const start = performance.now();
    const step = now => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = this.fmt(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  renderCategories() {
    this.el.categoriesGrid.innerHTML = '';
    this.data.categorias.forEach((cat, i) => {
      const totalPrompts = cat.subcategorias.reduce((s, sub) => s + sub.prompts.length, 0);
      const panel = document.createElement('article');
      panel.className = 'cat-panel reveal';
      panel.dataset.id = cat.id;
      panel.style.setProperty('--cat', cat.color);
      panel.style.transitionDelay = (i % 6) * 55 + 'ms';
      panel.innerHTML = `
        <div class="cat-top">
          <span class="cat-code">SYS-${String(i + 1).padStart(2, '0')}</span>
          <span class="cat-count">${String(totalPrompts).padStart(2, '0')} PROMPTS</span>
        </div>
        <div class="cat-icon">${cat.icono}</div>
        <h3>${this.esc(cat.nombre)}</h3>
        <p>${this.esc(cat.descripcion)}</p>
        <div class="cat-foot">
          <span>${String(cat.subcategorias.length).padStart(2, '0')} SUBSISTEMAS</span>
          <span class="cat-go">ACCEDER →</span>
        </div>`;
      this.el.categoriesGrid.appendChild(panel);
    });
    this.observeReveals(this.el.categoriesGrid);
  }

  openCategory(id) {
    this.currentCategory = this.data.categorias.find(c => c.id === id) || null;
    if (!this.currentCategory) return;
    this.applyState();
    requestAnimationFrame(() => {
      this.renderCategoryView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  goHome() {
    this.currentCategory = null;
    this.applyState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderCategoryView() {
    const cat = this.currentCategory;
    const totalPrompts = cat.subcategorias.reduce((s, sub) => s + sub.prompts.length, 0);

    this.el.catBanner.innerHTML = `
      <div class="banner" style="--cat:${cat.color}">
        <button class="btn-back" id="backBtn">← VOLVER</button>
        <div class="banner-info">
          <span class="banner-icon">${cat.icono}</span>
          <div>
            <h2>${this.esc(cat.nombre)}</h2>
            <p>${this.esc(cat.descripcion)}</p>
          </div>
        </div>
        <div class="banner-stats">${String(cat.subcategorias.length).padStart(2, '0')} SUBSISTEMAS · ${String(totalPrompts).padStart(2, '0')} PROMPTS</div>
      </div>`;

    this.el.promptsList.innerHTML = '';
    cat.subcategorias.forEach(sub => {
      const head = document.createElement('div');
      head.className = 'sub-head';
      head.innerHTML = `${this.esc(sub.nombre)} <span class="n">(${sub.prompts.length})</span>`;
      this.el.promptsList.appendChild(head);

      const grid = document.createElement('div');
      grid.className = 'prompt-grid';
      sub.prompts.forEach((p, i) => {
        grid.appendChild(this.buildCard(p, i, null));
      });
      this.el.promptsList.appendChild(grid);
    });
    this.observeReveals(this.el.promptsList);
  }

  renderResults() {
    const matches = this.allPrompts().filter(e => this.matches(e));
    this.el.resultsCount.textContent = matches.length + ' COINCIDENCIAS';
    this.el.resultsList.innerHTML = '';

    if (!matches.length) {
      this.el.resultsList.innerHTML = `
        <div class="empty" style="grid-column:1/-1">
          <span class="glyph">⌀</span>
          <h3>Sin resultados</h3>
          <p>AJUSTE LOS TÉRMINOS DE BÚSQUEDA O LOS FILTROS ACTIVOS</p>
        </div>`;
      return;
    }
    matches.forEach((e, i) => this.el.resultsList.appendChild(this.buildCard(e.p, i, e.cat)));
    this.observeReveals(this.el.resultsList);
  }

  buildCard(p, i, cat) {
    const card = document.createElement('article');
    card.className = 'pcard reveal';
    card.dataset.id = p.id;
    card.style.transitionDelay = (i % 8) * 45 + 'ms';
    const words = this.wordCount(p.prompt);
    const catLabel = cat ? `<span>SISTEMA: <b>${this.esc(cat.nombre.toUpperCase())}</b></span>` : '';
    card.innerHTML = `
      <div class="pcard-rail p-${p.prioridad}"></div>
      <div class="pcard-body">
        <div class="pcard-top">
          <span class="pcard-id">PRM-${p.id.toUpperCase().replace(/_/g, '-')}</span>
          <span class="ptag p-${p.prioridad}">${p.prioridad.toUpperCase()}</span>
        </div>
        <h3 class="pcard-title">${this.esc(p.titulo)}</h3>
        <div class="pcard-meta">
          ${catLabel}
          <span>USO: <b>${this.esc(p.uso)}</b></span>
          <span>≡ <b>${this.fmt(words)}</b> PALABRAS</span>
        </div>
        <div class="pcard-tags">
          ${p.tags.slice(0, 4).map(t => `<span class="tag">${this.esc(t)}</span>`).join('')}
        </div>
      </div>
      <div class="pcard-cta">VER PROMPT →</div>`;
    return card;
  }

  /* ---------- modal ---------- */

  openPromptById(id) {
    const entry = this.index.get(id);
    if (!entry) return;
    this.openPromptModal(entry.prompt, entry);
  }

  openPromptModal(prompt, entry) {
    this.currentPrompt = prompt;
    this.currentMeta = entry;
    this.addToHistory(prompt);

    const words = this.wordCount(prompt.prompt);
    const genTime = Math.max(2, Math.round(words / 180));

    this.el.modalStripe.className = 'modal-stripe p-' + prompt.prioridad;
    this.el.modalId.textContent = 'PRM-' + prompt.id.toUpperCase().replace(/_/g, '-');
    this.el.modalPriority.className = 'ptag p-' + prompt.prioridad;
    this.el.modalPriority.textContent = 'PRIORIDAD ' + prompt.prioridad.toUpperCase();
    this.el.modalTitle.textContent = prompt.titulo;
    this.el.modalPromptText.textContent = prompt.prompt;

    this.el.modalMeta.innerHTML = `
      <div class="meta-cell"><span class="k">Sistema</span><span class="v">${this.esc(entry.cat.nombre)}</span></div>
      <div class="meta-cell"><span class="k">Módulo</span><span class="v">${this.esc(entry.sub.nombre)}</span></div>
      <div class="meta-cell"><span class="k">Frecuencia de uso</span><span class="v">${this.esc(prompt.uso)}</span></div>
      <div class="meta-cell"><span class="k">Longitud · Gen. IA est.</span><span class="v accent">${this.fmt(words)} PALABRAS · ~${genTime} MIN</span></div>`;

    this.updateFavoriteButton(prompt.id);
    this.renderPlatformChips();
    this.el.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.el.modalPromptText.parentElement.scrollTop = 0;

    this._lastFocused = document.activeElement;
    this.trapFocus(this.el.modal);
    requestAnimationFrame(() => this.el.modalClose.focus());
  }

  closeModal() {
    this.el.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.currentPrompt = null;
    this.currentMeta = null;
    if (this._lastFocused && this._lastFocused.focus) {
      try { this._lastFocused.focus(); } catch (e) { /* ignore */ }
    }
    this._lastFocused = null;
  }

  trapFocus(el) {
    const focusable = el.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- actions ---------- */

  async copyText(text, btn) {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
    }
    if (ok && btn) {
      const original = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = '✓ COPIADO';
      setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = original; }, 1600);
    }
    this.showToast(ok ? '✓ Mega-prompt copiado al portapapeles' : '✕ No se pudo copiar', ok ? 'ok' : 'error');
    return ok;
  }

  async openInAI(url, name) {
    if (!this.currentPrompt) return;
    const ok = await this.copyText(this.getFullPrompt(), null);
    window.open(url, '_blank', 'noopener');
    this.showToast(ok
      ? `✓ Prompt copiado — péguelo en ${name} (pestaña abierta)`
      : `↗ ${name} abierto — copie el prompt manualmente`, ok ? 'ok' : '');
  }

  sendByEmail(prompt) {
    const meta = this.currentMeta;
    const subject = `Mega-Prompt Industrial: ${prompt.titulo}`;
    const header =
      'MEGA-PROMPT INDUSTRIAL\n' +
      '=====================================\n' +
      `Título: ${prompt.titulo}\n` +
      `Sistema: ${meta ? meta.cat.nombre : ''}\n` +
      `Módulo: ${meta ? meta.sub.nombre : ''}\n` +
      `Prioridad: ${prompt.prioridad}\n` +
      `Uso: ${prompt.uso}\n` +
      `Tags: ${prompt.tags.join(', ')}\n` +
      '=====================================\n\n';

    let body = header + this.getFullPrompt() + '\n\n---\nEnviado desde Biblioteca de Promps Industriales v3.2';
    const full = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (full.length > 8000) {
      this.copyText(this.getFullPrompt(), null);
      body = header + '[PROMPT COMPLETO COPIADO AL PORTAPAPELES — PÉGUELO AQUÍ]\n\n---\nEnviado desde Biblioteca de Promps Industriales v3.2';
      this.showToast('✓ Prompt copiado — péguelo en el correo (demasiado largo para mailto)', 'ok');
    } else {
      this.showToast('✓ Abriendo cliente de correo…', 'ok');
    }
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  exportToPDF(prompt) {
    const meta = this.currentMeta;
    const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${this.esc(prompt.titulo)}</title>
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;color:#14202e;margin:0;padding:2.2rem;line-height:1.6}
  .stripe{height:8px;background:repeating-linear-gradient(-45deg,#ffb020 0 12px,#14202e 12px 24px);margin:-2.2rem -2.2rem 1.6rem}
  h1{font-size:1.35rem;margin:0 0 .2rem;letter-spacing:.02em}
  .id{font-family:Consolas,monospace;font-size:.72rem;letter-spacing:.2em;color:#7a8aa0}
  table{width:100%;border-collapse:collapse;margin:1.1rem 0;font-size:.8rem}
  td{border:1px solid #ccd6e2;padding:.5rem .7rem}
  td.k{background:#eef2f7;font-family:Consolas,monospace;font-size:.68rem;letter-spacing:.1em;color:#5a6b82;width:26%}
  .prompt{font-family:Consolas,monospace;font-size:.76rem;line-height:1.7;white-space:pre-wrap;border:1px solid #ccd6e2;border-left:5px solid #ffb020;background:#f7f9fc;padding:1.2rem}
  .foot{margin-top:1.6rem;font-family:Consolas,monospace;font-size:.66rem;letter-spacing:.12em;color:#7a8aa0;border-top:2px solid #ffb020;padding-top:.7rem;display:flex;justify-content:space-between}
</style></head><body>
  <div class="stripe"></div>
  <div class="id">PRM-${prompt.id.toUpperCase().replace(/_/g, '-')} · PRIORIDAD ${prompt.prioridad.toUpperCase()}</div>
  <h1>${this.esc(prompt.titulo)}</h1>
  <table>
    <tr><td class="k">SISTEMA</td><td>${this.esc(meta ? meta.cat.nombre : '')}</td></tr>
    <tr><td class="k">MÓDULO</td><td>${this.esc(meta ? meta.sub.nombre : '')}</td></tr>
    <tr><td class="k">FRECUENCIA DE USO</td><td>${this.esc(prompt.uso)}</td></tr>
    <tr><td class="k">TAGS</td><td>${this.esc(prompt.tags.join(', '))}</td></tr>
  </table>
  <div class="prompt">${this.esc(this.getFullPrompt())}</div>
  <div class="foot"><span>BIBLIOTECA DE PROMPS INDUSTRIALES · REV 3.2</span><span>${new Date().toLocaleString('es-CL')}</span></div>
  <script>window.onload=function(){setTimeout(function(){window.print()},350)}</script>
</body></html>`;
    this.printViaIframe(doc);
    this.showToast('✓ Generando PDF — use "Guardar como PDF" en el diálogo', 'ok');
  }

  printViaIframe(doc) {
    let iframe = document.getElementById('pdfFrame');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'pdfFrame';
      iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:900px;height:700px;border:0';
      document.body.appendChild(iframe);
    }
    const idoc = iframe.contentDocument || iframe.contentWindow.document;
    idoc.open();
    idoc.write(doc);
    idoc.close();
    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        this.showToast('✕ No se pudo abrir la vista de impresión', 'error');
      }
    }, 450);
  }

  exportToExcel(prompt) {
    const meta = this.currentMeta;
    const full = this.getFullPrompt();
    const platforms = PLATFORM_KEYS.filter(k => this.state.platforms.has(k)).map(k => PLATFORM_SPECS[k].label).join('; ');
    const rows = [
      ['ID', 'Título', 'Sistema', 'Módulo', 'Categoría', 'Prioridad', 'Frecuencia de Uso', 'Plataformas', 'Tags', 'Palabras', 'Prompt'],
      [prompt.id, prompt.titulo, meta ? meta.cat.nombre : '', meta ? meta.sub.nombre : '',
        prompt.categoria, prompt.prioridad, prompt.uso, platforms, prompt.tags.join('; '),
        this.wordCount(full), full]
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_${prompt.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('✓ Exportado a Excel (CSV)', 'ok');
  }

  /* ---------- plataforma de salida ---------- */

  getFullPrompt() {
    if (!this.currentPrompt) return '';
    const directive = this.platformDirective();
    return directive ? this.currentPrompt.prompt + '\n\n' + directive : this.currentPrompt.prompt;
  }

  platformDirective() {
    const sel = PLATFORM_KEYS.filter(k => this.state.platforms.has(k));
    if (!sel.length) return '';
    const lines = sel.map(k => `• ${PLATFORM_SPECS[k].label}: ${PLATFORM_SPECS[k].spec}`);
    return [
      '=====================================',
      'REQUERIMIENTO DE COMPATIBILIDAD MULTIPLATAFORMA',
      '=====================================',
      `La aplicación generada DEBE ser 100% funcional en: ${sel.map(k => PLATFORM_SPECS[k].label).join(', ')}.`,
      '',
      'ESPECIFICACIONES POR PLATAFORMA:',
      ...lines,
      '',
      'ENTREGABLE ADICIONAL:',
      'Además del código completo, incluye al final una sección "GUÍA DE INSTALACIÓN MULTIPLATAFORMA" con los pasos exactos para desplegar y ejecutar la aplicación en cada una de las plataformas listadas arriba.',
      'Si una plataforma requiere empaquetado nativo (APK / IPA / EXE), proporciona los comandos y la configuración necesaria (Capacitor / Electron) lista para ejecutar.'
    ].join('\n');
  }

  renderPlatformChips() {
    if (!this.el.platformChips) return;
    const allSelected = PLATFORM_KEYS.every(k => this.state.platforms.has(k));
    this.el.platformChips.querySelectorAll('.pchip').forEach(chip => {
      const p = chip.dataset.platform;
      const on = p === 'all' ? allSelected : this.state.platforms.has(p);
      chip.classList.toggle('is-on', on);
    });
  }

  onPlatformClick(e) {
    const chip = e.target.closest('.pchip');
    if (!chip) return;
    const p = chip.dataset.platform;
    if (p === 'all') {
      const allSelected = PLATFORM_KEYS.every(k => this.state.platforms.has(k));
      if (allSelected) this.state.platforms.clear();
      else PLATFORM_KEYS.forEach(k => this.state.platforms.add(k));
    } else {
      if (this.state.platforms.has(p)) this.state.platforms.delete(p);
      else this.state.platforms.add(p);
    }
    this.save('platforms', [...this.state.platforms]);
    this.renderPlatformChips();
    if (this.state.platforms.size) {
      const names = PLATFORM_KEYS.filter(k => this.state.platforms.has(k)).map(k => PLATFORM_SPECS[k].label);
      this.showToast('Plataforma de salida: ' + names.join(' · '), 'ok');
    } else {
      this.showToast('Sin plataforma seleccionada — se usará el prompt original');
    }
  }

  /* ---------- favorites / history ---------- */

  updateFavBadge() {
    this.el.favCount.textContent = this.favorites.length || '';
    this.el.favCount.toggleAttribute('data-zero', !this.favorites.length);
  }

  isFavorite(id) { return this.favorites.some(f => f.id === id); }

  toggleFavorite(prompt) {
    if (this.isFavorite(prompt.id)) this.removeFavoriteById(prompt.id);
    else {
      this.favorites.unshift({ id: prompt.id, titulo: prompt.titulo, timestamp: Date.now() });
      this.save('favorites', this.favorites);
      this.showToast('★ Agregado a favoritos', 'ok');
    }
    this.updateFavBadge();
    if (this.currentPrompt) this.updateFavoriteButton(this.currentPrompt.id);
    if (this.el.favDrawer.classList.contains('active')) this.renderFavList();
  }

  removeFavoriteById(id) {
    this.favorites = this.favorites.filter(f => f.id !== id);
    this.save('favorites', this.favorites);
    this.updateFavBadge();
    if (this.currentPrompt && this.currentPrompt.id === id) this.updateFavoriteButton(id);
    if (this.el.favDrawer.classList.contains('active')) this.renderFavList();
    this.showToast('Eliminado de favoritos');
  }

  updateFavoriteButton(id) {
    const fav = this.isFavorite(id);
    this.el.favoriteBtn.innerHTML = fav ? '★ En Favoritos' : '☆ Favorito';
    this.el.favoriteBtn.classList.toggle('is-fav', fav);
  }

  addToHistory(prompt) {
    this.history = this.history.filter(h => h.id !== prompt.id);
    this.history.unshift({ id: prompt.id, titulo: prompt.titulo, timestamp: Date.now() });
    this.history = this.history.slice(0, 50);
    this.save('promptHistory', this.history);
  }

  removeHistoryById(id) {
    this.history = this.history.filter(h => h.id !== id);
    this.save('promptHistory', this.history);
    if (this.el.histDrawer.classList.contains('active')) this.renderHistList();
    this.showToast('Eliminado del historial');
  }

  relTime(ts) {
    const d = Date.now() - ts;
    const m = Math.floor(d / 60000);
    if (m < 1) return 'AHORA';
    if (m < 60) return `HACE ${m} MIN`;
    const h = Math.floor(m / 60);
    if (h < 24) return `HACE ${h} H`;
    return `HACE ${Math.floor(h / 24)} D`;
  }

  renderDrawerList(listEl, items, emptyMsg) {
    listEl.innerHTML = '';
    if (!items.length) {
      listEl.innerHTML = `<div class="drawer-empty">${emptyMsg}</div>`;
      return;
    }
    items.forEach(it => {
      const entry = this.index.get(it.id);
      const btn = document.createElement('button');
      btn.className = 'drawer-item';
      btn.dataset.id = it.id;
      btn.innerHTML = `
        <div class="di-main">
          <span class="di-title">${this.esc(it.titulo)}</span>
          <span class="di-sub">${entry ? this.esc(entry.cat.nombre.toUpperCase()) : '—'} · ${this.relTime(it.timestamp)}</span>
        </div>
        <span class="di-x" title="Eliminar">✕</span>`;
      listEl.appendChild(btn);
    });
  }

  renderFavList() { this.renderDrawerList(this.el.favList, this.favorites, 'SIN FAVORITOS AÚN<br><br>MARQUE PROMPTS CON ☆'); }
  renderHistList() { this.renderDrawerList(this.el.histList, this.history, 'SIN ACTIVIDAD AÚN'); }

  /* ---------- drawers ---------- */

  openDrawer(which) {
    this.closeDrawers();
    (which === 'fav' ? this.el.favDrawer : this.el.histDrawer).classList.add('active');
    this.el.drawerScrim.classList.add('active');
  }

  closeDrawers() {
    this.el.favDrawer.classList.remove('active');
    this.el.histDrawer.classList.remove('active');
    this.el.drawerScrim.classList.remove('active');
  }

  /* ---------- system ---------- */

  startClock() {
    const tick = () => {
      this.el.clock.textContent = new Date().toLocaleTimeString('es-CL', { hour12: false });
    };
    tick();
    setInterval(tick, 1000);
  }

  updateConn() {
    const online = navigator.onLine;
    this.el.connStatus.classList.toggle('offline', !online);
    this.el.connLabel.textContent = online ? 'EN LÍNEA' : 'OFFLINE';
  }

  setupTheme() {
    const saved = SafeStore.get('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    this.el.themeToggle.textContent = saved === 'dark' ? '◐' : '◑';
  }

  toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    SafeStore.set('theme', next);
    this.el.themeToggle.textContent = next === 'dark' ? '◐' : '◑';
    this.showToast(next === 'dark' ? '◐ Modo sala de control activo' : '◑ Modo daylight activo');
  }

  setupSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        /* eslint-disable-next-line no-console */
        .then(() => console.log('[SW] registrado — modo offline listo'))
        /* eslint-disable-next-line no-console */
        .catch(err => console.warn('[SW] fallo:', err));
    }
  }

  async install() {
    if (!this.deferredPrompt) {
      this.showToast('Use "Agregar a pantalla de inicio" desde el menú del navegador');
      return;
    }
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      this.el.installBtn.hidden = true;
      this.showToast('✓ Aplicación instalada', 'ok');
    }
    this.deferredPrompt = null;
  }

  showToast(message, type = '') {
    const t = this.el.toast;
    t.textContent = message;
    t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { t.className = 'toast'; }, 3200);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.promptLibrary = new PromptLibrary();
});
