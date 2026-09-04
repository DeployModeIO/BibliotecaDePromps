/* ============================================================
   BIBLIOTECA DE PROMPS INDUSTRIAL — APP CORE v3.3
   JSDoc type annotations for DX. TypeScript not required.
   ============================================================ */
/* global PROMPTS_DB, PROMPTS_DB_EXTRA, PROMPTS_DB_V2, PROMPTS_DB_FULLSTACK, module */

/**
 * @typedef {{"label": string, "spec": string}} PlatformSpec
 * @typedef {{"id": string, "titulo": string, "categoria": string, "prioridad": string,
 *            "prompt": string, "tags": string[], "uso": string}} Prompt
 * @typedef {{"id": string, "nombre": string, "icono": string, "color": string,
 *            "descripcion": string, "subcategorias": Subcategoria[]}} Categoria
 * @typedef {{"id": string, "nombre": string, "prompts": Prompt[]}} Subcategoria
 * @typedef {{"prompt": Prompt, "cat": Categoria, "sub": Subcategoria}} PromptEntry
 */

const PLATFORM_SPECS = {
  web: {
    label: '🌐 Web',
    icon: '🌐',
    short: 'Web',
    spec: 'Single-file HTML/CSS/JS app. Responsive mobile-first. Chrome/Firefox/Edge/Safari (latest 2 versions). No backend dependencies. CDN libraries with local fallback. Works from file:// or any static hosting.',
    nota: 'Incluye meta viewport, favicon, y manifest.json',
  },
  android: {
    label: '🤖 Android',
    icon: '🤖',
    short: 'Android',
    spec: 'PWA installable desde Chrome (A2HS). Service worker con cache-first. Manifest con iconos 192/512px. Touch targets ≥48dp. Soporte notch. Alternativa: Capacitor para APK nativo.',
    nota: 'Usa Capacitor CLI para generar APK instalable',
  },
  ios: {
    label: '🍎 iOS',
    icon: '🍎',
    short: 'iOS',
    spec: 'PWA installable desde Safari. Meta tags apple-mobile-web-app-capable, viewport-fit=cover, status-bar-style. Safe-area con env(). Soporte iPhone y iPad. Alternativa: Capacitor para IPA.',
    nota: 'Incluye apple-touch-icon de 180x180px',
  },
  tablet: {
    label: '📱 Tablet',
    icon: '📱',
    short: 'Tablet',
    spec: 'Layout responsive con breakpoints 768–1280px. Botones ≥56px, operable con guantes. 2-3 columnas en landscape. Compatible iPad (Safari) y Android (Chrome).',
    nota: 'Optimiza para uso en campo con guantes industriales',
  },
  windows: {
    label: '🪟 Windows',
    icon: '🪟',
    short: 'Windows',
    spec: 'PWA installable desde Edge/Chrome. Service worker offline. Atajos de teclado. Resoluciones ≥1366×768. Alternativa: Electron para .exe instalable con soporte nativo.',
    nota: 'Usa Electron para generar .exe con instalador',
  },
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
      try {
        return localStorage.getItem(key);
      } catch (e) {
        /* ignore */
      }
    }
    return key in this._mem ? this._mem[key] : null;
  },
  set(key, val) {
    if (this.available()) {
      try {
        localStorage.setItem(key, val);
        return;
      } catch (e) {
        /* ignore */
      }
    }
    this._mem[key] = val;
  },
};

class PromptLibrary {
  constructor() {
    this.data = this.mergeData();
    this.index = new Map();
    this.buildIndex();
    this.initSearchWorker();

    this.state = {
      q: '',
      priority: null,
      type: null,
      platforms: new Set(this.load('platforms', ['web'])),
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
      PROMPTS_DB_EXTRA.categorias.forEach((extraCat) => {
        const existing = merged.categorias.find((c) => c.id === extraCat.id);
        if (existing) {
          extraCat.subcategorias.forEach((sub) => {
            const existingSub = existing.subcategorias.find((s) => s.id === sub.id);
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
      PROMPTS_DB_V2.categorias.forEach((v2Cat) => {
        const existing = merged.categorias.find((c) => c.id === v2Cat.id);
        if (existing) {
          v2Cat.subcategorias.forEach((sub) => {
            const existingSub = existing.subcategorias.find((s) => s.id === sub.id);
            if (existingSub) existingSub.prompts.push(...sub.prompts);
            else existing.subcategorias.push(sub);
          });
        } else {
          merged.categorias.push(v2Cat);
        }
      });
    }

    // Fusionar PROMPTS_DB_FULLSTACK
    if (typeof PROMPTS_DB_FULLSTACK !== 'undefined') {
      PROMPTS_DB_FULLSTACK.categorias.forEach((fsCat) => {
        const existing = merged.categorias.find((c) => c.id === fsCat.id);
        if (existing) {
          fsCat.subcategorias.forEach((sub) => {
            const existingSub = existing.subcategorias.find((s) => s.id === sub.id);
            if (existingSub) existingSub.prompts.push(...sub.prompts);
            else existing.subcategorias.push(sub);
          });
        } else {
          merged.categorias.push(fsCat);
        }
      });
    }

    return merged;
  }

  buildIndex() {
    this.data.categorias.forEach((cat) => {
      cat.subcategorias.forEach((sub) => {
        sub.prompts.forEach((p) => {
          this.index.set(p.id, { prompt: p, cat, sub });
        });
      });
    });
  }

  initSearchWorker() {
    this.worker = null;
    this.workerReady = false;
    this._searchSeq = 0;
    if (typeof Worker === 'undefined') return;
    try {
      const worker = new Worker('js/bpi-worker.js');
      worker.onmessage = (e) => {
        const msg = e.data || {};
        if (msg.type === 'buildIndex' && msg.ok) this.workerReady = true;
        else if (msg.type === 'search' && msg.ok && msg.id === this._searchSeq) this.renderRankedResults(msg.result || []);
      };
      const payload = this.allPrompts().map(({ p, cat }) => ({
        id: p.id,
        titulo: p.titulo || '',
        categoria: cat.nombre || '',
        tags: p.tags || [],
        prompt: p.prompt || '',
        uso: p.uso || '',
      }));
      worker.postMessage({ type: 'buildIndex', payload, id: 1 });
      this.worker = worker;
    } catch (err) {
      this.worker = null;
    }
  }

  allPrompts() {
    const out = [];
    this.data.categorias.forEach((cat) => cat.subcategorias.forEach((sub) => sub.prompts.forEach((p) => out.push({ p, cat, sub }))));
    return out;
  }

  load(key, fallback) {
    try {
      const raw = SafeStore.get(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save(key, val) {
    try {
      SafeStore.set(key, JSON.stringify(val));
    } catch (e) {
      /* ignore */
    }
  }

  /* ---------- dom ---------- */

  cacheDom() {
    const $ = (id) => document.getElementById(id);
    this.el = {
      searchInput: $('searchInput'),
      filterBar: $('filterBar'),
      homeView: $('homeView'),
      categoriesGrid: $('categoriesGrid'),
      catCount: $('catCount'),
      categoryView: $('categoryView'),
      catBanner: $('catBanner'),
      promptsList: $('promptsList'),
      resultsView: $('resultsView'),
      resultsList: $('resultsList'),
      resultsCount: $('resultsCount'),
      statPrompts: $('statPrompts'),
      statIndustries: $('statIndustries'),
      statWords: $('statWords'),
      statStandards: $('statStandards'),
      clock: $('clock'),
      connStatus: $('connStatus'),
      connLabel: $('connLabel'),
      favToggle: $('favToggle'),
      histToggle: $('histToggle'),
      favCount: $('favCount'),
      themeToggle: $('themeToggle'),
      installBtn: $('installBtn'),
      chatBtn: $('chatToggle'),
      modal: $('promptModal'),
      modalStripe: $('modalStripe'),
      modalId: $('modalId'),
      modalPriority: $('modalPriority'),
      modalCategory: $('modalCategory'),
      modalTitle: $('modalTitle'),
      modalMeta: $('modalMeta'),
      modalPromptText: $('modalPromptText'),
      modalClose: $('modalClose'),
      copyBtn: $('copyBtn'),
      gptBtn: $('gptBtn'),
      claudeBtn: $('claudeBtn'),
      sendToChatBtn: $('sendToChatBtn'),
      favoriteBtn: $('favoriteBtn'),
      emailBtn: $('emailBtn'),
      pdfBtn: $('pdfBtn'),
      excelBtn: $('excelBtn'),
      shareBtn: $('shareBtn'),
      varModal: $('varModal'),
      varModalFields: $('varModalFields'),
      varModalClose: $('varModalClose'),
      varModalApply: $('varModalApply'),
      varModalRaw: $('varModalRaw'),
      platformChips: $('platformChips'),
      favDrawer: $('favDrawer'),
      histDrawer: $('histDrawer'),
      favList: $('favList'),
      histList: $('histList'),
      drawerScrim: $('drawerScrim'),
      toast: $('toast'),
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
    if (window.UsageTracker && window.UsageTracker.init) window.UsageTracker.init();
    if (window.AIChat) window.AIChat.init();
    this.handleHashRoute();
    if (!SafeStore.available()) {
      setTimeout(
        () => this.showToast('⚠ Navegador bloquea almacenamiento — favoritos/historial no persistirán (baje los Shields de Brave)', ''),
        800
      );
    }
  }

  /* ---------- events ---------- */

  bindEvents() {
    this.el.searchInput.addEventListener('input', (e) => {
      this.state.q = e.target.value.trim().toLowerCase();
      this.applyState();
    });

    this.el.filterBar.addEventListener('click', (e) => this.onFilterClick(e));

    this.el.categoriesGrid.addEventListener('click', (e) => {
      const panel = e.target.closest('.cat-panel');
      if (panel) this.openCategory(panel.dataset.id);
    });

    this.el.categoryView.addEventListener('click', (e) => {
      if (e.target.closest('#backBtn')) {
        this.goHome();
        return;
      }
      const card = e.target.closest('.pcard');
      if (card) this.openPromptById(card.dataset.id);
    });

    this.el.resultsList.addEventListener('click', (e) => {
      const card = e.target.closest('.pcard');
      if (card) this.openPromptById(card.dataset.id);
    });

    /* A11y: activación por teclado (Enter/Espacio) para cards y categorías,
       que son <article role="button"> en lugar de divs clicables. */
    const isActivateKey = (e) => e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar';
    this.el.categoriesGrid.addEventListener('keydown', (e) => {
      if (!isActivateKey(e)) return;
      const panel = e.target.closest('.cat-panel');
      if (panel) {
        e.preventDefault();
        this.openCategory(panel.dataset.id);
      }
    });
    this.el.categoryView.addEventListener('keydown', (e) => {
      if (!isActivateKey(e)) return;
      const card = e.target.closest('.pcard');
      if (card) {
        e.preventDefault();
        this.openPromptById(card.dataset.id);
      }
    });
    this.el.resultsList.addEventListener('keydown', (e) => {
      if (!isActivateKey(e)) return;
      const card = e.target.closest('.pcard');
      if (card) {
        e.preventDefault();
        this.openPromptById(card.dataset.id);
      }
    });

    this.el.favToggle.addEventListener('click', () => {
      this.renderFavList();
      this.openDrawer('fav');
    });
    this.el.histToggle.addEventListener('click', () => {
      this.renderHistList();
      this.openDrawer('hist');
    });
    this.el.drawerScrim.addEventListener('click', () => this.closeDrawers());
    document.querySelectorAll('[data-close-drawer]').forEach((b) => b.addEventListener('click', () => this.closeDrawers()));

    // A11y: focus-trap para los drawers (una sola vez, no por apertura)
    this.trapFocus(this.el.favDrawer);
    this.trapFocus(this.el.histDrawer);

    [this.el.favList, this.el.histList].forEach((list) => {
      list.addEventListener('click', (e) => {
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
    this.el.modal.addEventListener('click', (e) => {
      if (e.target === this.el.modal) this.closeModal();
    });

    this.el.copyBtn.addEventListener('click', () => {
      if (!this.currentPrompt) return;
      this.copyPromptSmart();
    });

    if (this.el.varModalClose) this.el.varModalClose.addEventListener('click', () => this.closeVarModal());
    if (this.el.varModal)
      this.el.varModal.addEventListener('click', (e) => {
        if (e.target === this.el.varModal) this.closeVarModal();
      });
    if (this.el.varModalApply) this.el.varModalApply.addEventListener('click', () => this.applyVarModal());
    if (this.el.varModalRaw)
      this.el.varModalRaw.addEventListener('click', () => {
        this.closeVarModal();
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
    this.el.emailBtn.addEventListener('click', () => {
      if (this.currentPrompt) {
        if (window.UsageTracker) window.UsageTracker.recordPromptExport(this.currentPrompt, 'email');
        this.sendByEmail(this.currentPrompt);
      }
    });
    this.el.pdfBtn.addEventListener('click', () => {
      if (this.currentPrompt) {
        if (window.UsageTracker) window.UsageTracker.recordPromptExport(this.currentPrompt, 'pdf');
        this.exportToPDF(this.currentPrompt);
      }
    });
    this.el.excelBtn.addEventListener('click', () => {
      if (this.currentPrompt) {
        if (window.UsageTracker) window.UsageTracker.recordPromptExport(this.currentPrompt, 'excel');
        this.exportToExcel(this.currentPrompt);
      }
    });

    if (this.el.shareBtn) this.el.shareBtn.addEventListener('click', () => this.sharePrompt());

    // Permalinks: #p/<id> abre el prompt (compartible/SEO)
    window.addEventListener('hashchange', () => this.handleHashRoute());

    this.el.platformChips.addEventListener('click', (e) => this.onPlatformClick(e));

    window.addEventListener('online', () => this.updateConn());
    window.addEventListener('offline', () => this.updateConn());

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.el.installBtn.hidden = false;
    });

    document.addEventListener('keydown', (e) => this.onKeydown(e));
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
      if (this.el.modal.classList.contains('active')) {
        this.closeModal();
        return;
      }
      if (this.el.favDrawer.classList.contains('active') || this.el.histDrawer.classList.contains('active')) {
        this.closeDrawers();
        return;
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
    this.el.filterBar.querySelectorAll('.chip').forEach((chip) => {
      let on = false;
      if (chip.hasAttribute('data-reset')) on = !this.state.priority && !this.state.type;
      else if (chip.dataset.priority) on = this.state.priority === chip.dataset.priority;
      else if (chip.dataset.type) on = this.state.type === chip.dataset.type;
      chip.classList.toggle('is-on', on);
      chip.setAttribute('aria-pressed', String(on)); // A11y: estado anunciado
    });
  }

  /* ---------- state / views ---------- */

  isFiltering() {
    return !!(this.state.q || this.state.priority || this.state.type);
  }

  matches(entry) {
    if (!this.matchesFilters(entry)) return false;
    const { p, cat } = entry;
    if (this.state.q) {
      const hay = (p.titulo + ' ' + p.tags.join(' ') + ' ' + p.prompt + ' ' + cat.nombre).toLowerCase();
      if (!hay.includes(this.state.q)) return false;
    }
    return true;
  }

  matchesFilters(entry) {
    const { p } = entry;
    if (this.state.priority && p.prioridad !== this.state.priority) return false;
    if (this.state.type) {
      const c = (p.categoria || '').toLowerCase();
      if (this.state.type === 'app' && !c.includes('aplicaci')) return false;
      if (this.state.type === 'tool' && !c.includes('herramienta')) return false;
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
    return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  }

  /* Resalta variables `$...$` y ecuaciones `$$...$$` del prompt
     como bloques monospace destacados (solo presentación visual). */
  renderPrompt(text) {
    return this.esc(text)
      .replace(/\$\$([\s\S]+?)\$\$/g, '<span class="var var-block">$1</span>')
      .replace(/\$([^$\n]+?)\$/g, '<span class="var">$1</span>');
  }

  fmt(n) {
    return n.toLocaleString('es-CL');
  }

  wordCount(text) {
    return text.split(/\s+/).filter(Boolean).length;
  }

  setupReveal() {
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            this.revealObserver.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08 }
    );
  }

  observeReveals(scope) {
    const els = scope.querySelectorAll('.reveal:not(.in)');
    els.forEach((el) => this.revealObserver.observe(el));
    /* Safety net: if IntersectionObserver never fires (rare), force-reveal
       after a short delay so content is never stuck invisible. */
    setTimeout(() => {
      scope.querySelectorAll('.reveal:not(.in)').forEach((el) => el.classList.add('in'));
    }, 600);
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
    const step = (now) => {
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
      // A11y: operable por teclado y anunciado como botón
      panel.setAttribute('role', 'button');
      panel.tabIndex = 0;
      panel.setAttribute('aria-label', `Abrir sistema ${cat.nombre} (${totalPrompts} prompts)`);
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
    this.currentCategory = this.data.categorias.find((c) => c.id === id) || null;
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
    cat.subcategorias.forEach((sub) => {
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
    if (this.state.q && this.workerReady && this.worker) {
      this._searchSeq += 1;
      this.worker.postMessage({ type: 'search', payload: this.state.q, id: this._searchSeq });
      return;
    }
    const matches = this.allPrompts().filter((e) => this.matches(e));
    this.renderResultsList(matches);
  }

  renderResultsList(matches) {
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

  renderRankedResults(ids) {
    const entries = ids
      .map((id) => this.index.get(id))
      .filter(Boolean)
      .map((entry) => ({ p: entry.prompt, cat: entry.cat, sub: entry.sub }))
      .filter((e) => this.matchesFilters(e));
    this.renderResultsList(entries);
  }

  buildCard(p, i, cat) {
    const card = document.createElement('article');
    card.className = 'pcard reveal';
    card.dataset.id = p.id;
    // A11y: operable por teclado y anunciado como botón
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.setAttribute('aria-label', `Ver prompt ${p.titulo}`);
    card.style.transitionDelay = (i % 8) * 45 + 'ms';
    const words = this.wordCount(p.prompt);
    const catLabel = cat ? `<span>SISTEMA: <b>${this.esc(cat.nombre.toUpperCase())}</b></span>` : '';
    card.innerHTML = `
      <div class="pcard-rail p-${p.prioridad}"></div>
      <div class="pcard-body">
        <div class="pcard-top">
          <span class="pcard-id">PRM-${p.id.toUpperCase().replace(/_/g, '-')}</span>
          <span class="pcard-badges">
            <span class="pill pill-neutral">${this.esc(p.categoria)}</span>
            <span class="ptag p-${p.prioridad}">${p.prioridad.toUpperCase()}</span>
          </span>
        </div>
        <h3 class="pcard-title">${this.esc(p.titulo)}</h3>
        <div class="pcard-meta">
          ${catLabel}
          <span>USO: <b>${this.esc(p.uso)}</b></span>
          <span>≡ <b>${this.fmt(words)}</b> PALABRAS</span>
        </div>
        <div class="pcard-tags">
          ${p.tags
            .slice(0, 4)
            .map((t) => `<span class="tag">${this.esc(t)}</span>`)
            .join('')}
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
    if (window.UsageTracker) window.UsageTracker.recordPromptView(prompt, entry.cat.nombre);

    const words = this.wordCount(prompt.prompt);
    const genTime = Math.max(2, Math.round(words / 180));

    this.el.modalStripe.className = 'modal-stripe p-' + prompt.prioridad;
    this.el.modalId.textContent = 'PRM-' + prompt.id.toUpperCase().replace(/_/g, '-');
    this.el.modalPriority.className = 'ptag p-' + prompt.prioridad;
    this.el.modalPriority.textContent = 'PRIORIDAD ' + prompt.prioridad.toUpperCase();
    this.el.modalCategory.className = 'pill pill-neutral';
    this.el.modalCategory.textContent = prompt.categoria;
    this.el.modalTitle.textContent = prompt.titulo;
    this.el.modalPromptText.innerHTML = this.renderPrompt(prompt.prompt);

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

  /* ---------- share / permalinks / variables ---------- */

  handleHashRoute() {
    const m = (location.hash || '').match(/^#p\/([\w-]+)/);
    if (!m) return;
    const id = m[1].toLowerCase().replace(/-/g, '_');
    const entry = this.index.get(id) || [...this.index.values()].find((e) => e.prompt.id.replace(/_/g, '-') === m[1]);
    if (entry) this.openPromptModal(entry.prompt, entry);
  }

  sharePrompt() {
    if (!this.currentPrompt) return;
    const id = this.currentPrompt.id.toUpperCase().replace(/_/g, '-');
    const url = location.origin + location.pathname + '#p/' + this.currentPrompt.id;
    this.copyText(url, null);
    this.showToast('🔗 Enlace copiado — PRM-' + id, 'ok');
  }

  getPromptVariables(text) {
    const vars = [];
    const re = /\{\{([^{}]+)\}\}/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const name = m[1].trim();
      if (!vars.includes(name)) vars.push(name);
    }
    return vars;
  }

  copyPromptSmart() {
    const full = this.getFullPrompt();
    const vars = this.getPromptVariables(full);
    if (window.UsageTracker && this.currentPrompt) window.UsageTracker.recordPromptCopy(this.currentPrompt);
    if (!vars.length) {
      this.copyText(full, this.el.copyBtn);
      return;
    }
    // Editor de variables {{...}}
    this.el.varModalFields.innerHTML = vars
      .map(
        (v, i) => `<div style="margin-bottom:0.7rem">
        <label for="varField${i}" style="display:block;font-family:var(--f-mono);font-size:0.65rem;color:var(--txt-2);margin-bottom:0.25rem">${this.esc(v)}</label>
        <input id="varField${i}" data-var="${this.esc(v)}" type="text" style="width:100%;padding:0.5rem 0.7rem;background:var(--bg-2);border:1px solid var(--line);border-radius:8px;color:var(--txt-1);font-size:0.85rem">
      </div>`
      )
      .join('');
    this.el.varModal.classList.add('active');
    requestAnimationFrame(() => this.el.varModalFields.querySelector('input')?.focus());
  }

  applyVarModal() {
    let text = this.getFullPrompt();
    this.el.varModalFields.querySelectorAll('input').forEach((inp) => {
      const val = inp.value.trim();
      if (val) text = text.split('{{' + inp.dataset.var + '}}').join(val);
    });
    this.closeVarModal();
    this.copyText(text, this.el.copyBtn);
  }

  closeVarModal() {
    if (this.el.varModal) this.el.varModal.classList.remove('active');
  }

  closeModal() {
    this.el.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.currentPrompt = null;
    this.currentMeta = null;
    if (this._lastFocused && this._lastFocused.focus) {
      try {
        this._lastFocused.focus();
      } catch (e) {
        /* ignore */
      }
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
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
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
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      ta.remove();
    }
    if (ok && btn) {
      const original = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = '✓ COPIADO';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = original;
      }, 1600);
    }
    this.showToast(ok ? '✓ Mega-prompt copiado al portapapeles' : '✕ No se pudo copiar', ok ? 'ok' : 'error');
    return ok;
  }

  async openInAI(url, name) {
    if (!this.currentPrompt) return;
    const ok = await this.copyText(this.getFullPrompt(), null);
    window.open(url, '_blank', 'noopener');
    this.showToast(
      ok ? `✓ Prompt copiado — péguelo en ${name} (pestaña abierta)` : `↗ ${name} abierto — copie el prompt manualmente`,
      ok ? 'ok' : ''
    );
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
      body =
        header + '[PROMPT COMPLETO COPIADO AL PORTAPAPELES — PÉGUELO AQUÍ]\n\n---\nEnviado desde Biblioteca de Promps Industriales v3.2';
      this.showToast('✓ Prompt copiado — péguelo en el correo (demasiado largo para mailto)', 'ok');
    } else {
      this.showToast('✓ Abriendo cliente de correo…', 'ok');
    }
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async exportToPDF(prompt) {
    const meta = this.currentMeta;
    // Lazy-load: jsPDF (~366 KB) solo se descarga al exportar el primer PDF
    if (!window.jspdf && window.LibLoader) await window.LibLoader.jspdf();
    const lib = window.jspdf || {};
    const jsPDF = lib.jsPDF;
    if (!jsPDF) {
      this.showToast('✕ jsPDF no disponible', 'error');
      return;
    }
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 48;
    let y = margin;
    doc.setFillColor(255, 176, 32);
    doc.rect(0, 0, pageW, 10, 'F');
    doc.setFillColor(20, 32, 46);
    doc.rect(0, 10, pageW, 4, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(122, 138, 160);
    doc.text('PRM-' + prompt.id.toUpperCase().replace(/_/g, '-') + ' · PRIORIDAD ' + prompt.prioridad.toUpperCase(), margin, y);
    y += 18;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(20, 32, 46);
    const titleLines = doc.splitTextToSize(prompt.titulo, pageW - margin * 2);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 20 + 8;
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 107, 130);
    [
      'SISTEMA: ' + (meta ? meta.cat.nombre : ''),
      'MÓDULO: ' + (meta ? meta.sub.nombre : ''),
      'FRECUENCIA DE USO: ' + prompt.uso,
      'TAGS: ' + prompt.tags.join(', '),
    ].forEach((r) => {
      doc.text(r, margin, y);
      y += 13;
    });
    y += 6;
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 50, 66);
    const full = this.getFullPrompt();
    const lines = doc.splitTextToSize(full, pageW - margin * 2);
    for (const line of lines) {
      if (y > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 11;
    }
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(122, 138, 160);
      doc.text('BIBLIOTECA DE PROMPS INDUSTRIALES · REV 3.5', margin, pageH - 24);
      doc.text('Página ' + i + ' de ' + pageCount, pageW - margin, pageH - 24, { align: 'right' });
    }
    doc.save('prompt_' + prompt.id + '.pdf');
    this.showToast('✓ PDF generado', 'ok');
  }

  async exportToExcel(prompt) {
    const meta = this.currentMeta;
    // Lazy-load: SheetJS (~952 KB) solo se descarga al exportar el primer Excel
    if (typeof window.XLSX === 'undefined' && window.LibLoader) await window.LibLoader.xlsx();
    if (typeof window.XLSX === 'undefined') {
      this.showToast('✕ SheetJS no disponible', 'error');
      return;
    }
    const full = this.getFullPrompt();
    const platforms = PLATFORM_KEYS.filter((k) => this.state.platforms.has(k))
      .map((k) => PLATFORM_SPECS[k].label)
      .join('; ');
    const rows = [
      ['ID', 'Título', 'Sistema', 'Módulo', 'Categoría', 'Prioridad', 'Frecuencia de Uso', 'Plataformas', 'Tags', 'Palabras', 'Prompt'],
      [
        prompt.id,
        prompt.titulo,
        meta ? meta.cat.nombre : '',
        meta ? meta.sub.nombre : '',
        prompt.categoria,
        prompt.prioridad,
        prompt.uso,
        platforms,
        prompt.tags.join('; '),
        this.wordCount(full),
        full,
      ],
    ];
    const ws = window.XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [
      { wch: 12 },
      { wch: 40 },
      { wch: 24 },
      { wch: 24 },
      { wch: 18 },
      { wch: 12 },
      { wch: 18 },
      { wch: 20 },
      { wch: 30 },
      { wch: 10 },
      { wch: 80 },
    ];
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, 'Prompt');
    window.XLSX.writeFile(wb, 'prompt_' + prompt.id + '.xlsx');
    this.showToast('✓ Exportado a Excel (.xlsx)', 'ok');
  }

  /* ---------- plataforma de salida ---------- */

  getFullPrompt() {
    if (!this.currentPrompt) return '';
    const directive = this.platformDirective();
    return directive ? this.currentPrompt.prompt + '\n\n' + directive : this.currentPrompt.prompt;
  }

  platformDirective() {
    const sel = PLATFORM_KEYS.filter((k) => this.state.platforms.has(k));
    if (!sel.length || sel.length === PLATFORM_KEYS.length) return ''; // All selected = no directive needed

    const lines = sel.map((k) => `• ${PLATFORM_SPECS[k].label}: ${PLATFORM_SPECS[k].spec}`);
    const icons = sel.map((k) => PLATFORM_SPECS[k].icon).join(' ');
    return [
      '=====================================',
      `REQUERIMIENTO MULTIPLATAFORMA ${icons}`,
      '=====================================',
      `La aplicación debe funcionar en: ${sel.map((k) => PLATFORM_SPECS[k].short).join(', ')}.`,
      '',
      'ESPECIFICACIONES:',
      ...lines,
      '',
      'ENTREGABLE:',
      'Incluye al final una sección "🌐 GUÍA DE INSTALACIÓN" con pasos para cada plataforma.',
      'Si requiere empaquetado nativo (APK/IPA/EXE), proporciona comandos Capacitor/Electron.',
    ].join('\n');
  }

  renderPlatformChips() {
    if (!this.el.platformChips) return;
    this.el.platformChips.querySelectorAll('.pchip').forEach((chip) => {
      const p = chip.dataset.platform;
      const on =
        p === 'all' ? this.state.platforms.size === 0 || this.state.platforms.size === PLATFORM_KEYS.length : this.state.platforms.has(p);
      chip.classList.toggle('is-on', on);
      chip.setAttribute('aria-pressed', String(on)); // A11y: estado anunciado
    });
  }

  onPlatformClick(e) {
    const chip = e.target.closest('.pchip');
    if (!chip) return;
    const p = chip.dataset.platform;
    if (p === 'all') {
      // Toggle all on/off
      const allOn = PLATFORM_KEYS.every((k) => this.state.platforms.has(k));
      if (allOn) this.state.platforms.clear();
      else PLATFORM_KEYS.forEach((k) => this.state.platforms.add(k));
    } else {
      if (this.state.platforms.has(p)) this.state.platforms.delete(p);
      else this.state.platforms.add(p);
    }
    this.save('platforms', [...this.state.platforms]);
    this.renderPlatformChips();
    const selCount = this.state.platforms.size;
    if (selCount === 0) {
      this.showToast('⊕ Todas las plataformas — sin directiva extra');
    } else if (selCount === PLATFORM_KEYS.length) {
      this.showToast('⊕ Todas las plataformas seleccionadas');
    } else {
      const names = PLATFORM_KEYS.filter((k) => this.state.platforms.has(k)).map((k) => PLATFORM_SPECS[k].short);
      this.showToast('Plataformas: ' + names.join(' · '));
    }
  }

  /* ---------- favorites / history ---------- */

  updateFavBadge() {
    this.el.favCount.textContent = this.favorites.length || '';
    this.el.favCount.toggleAttribute('data-zero', !this.favorites.length);
  }

  isFavorite(id) {
    return this.favorites.some((f) => f.id === id);
  }

  toggleFavorite(prompt) {
    if (this.isFavorite(prompt.id)) {
      if (window.UsageTracker) window.UsageTracker.recordPromptFavorite(prompt, false);
      this.removeFavoriteById(prompt.id);
    } else {
      this.favorites.unshift({ id: prompt.id, titulo: prompt.titulo, timestamp: Date.now() });
      this.save('favorites', this.favorites);
      if (window.UsageTracker) window.UsageTracker.recordPromptFavorite(prompt, true);
      this.showToast('★ Agregado a favoritos', 'ok');
    }
    this.updateFavBadge();
    if (this.currentPrompt) this.updateFavoriteButton(this.currentPrompt.id);
    if (this.el.favDrawer.classList.contains('active')) this.renderFavList();
  }

  removeFavoriteById(id) {
    this.favorites = this.favorites.filter((f) => f.id !== id);
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
    this.history = this.history.filter((h) => h.id !== prompt.id);
    this.history.unshift({ id: prompt.id, titulo: prompt.titulo, timestamp: Date.now() });
    this.history = this.history.slice(0, 50);
    this.save('promptHistory', this.history);
  }

  removeHistoryById(id) {
    this.history = this.history.filter((h) => h.id !== id);
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
    items.forEach((it) => {
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

  renderFavList() {
    this.renderDrawerList(this.el.favList, this.favorites, 'SIN FAVORITOS AÚN<br><br>MARQUE PROMPTS CON ☆');
  }
  renderHistList() {
    this.renderDrawerList(this.el.histList, this.history, 'SIN ACTIVIDAD AÚN');
  }

  /* ---------- drawers ---------- */

  openDrawer(which) {
    this.closeDrawers();
    const drawer = which === 'fav' ? this.el.favDrawer : this.el.histDrawer;
    drawer.classList.add('active');
    this.el.drawerScrim.classList.add('active');
    // A11y: guardar foco previo y moverlo dentro del drawer
    this._drawerLastFocused = document.activeElement;
    const closeBtn = drawer.querySelector('[data-close-drawer]');
    if (closeBtn) requestAnimationFrame(() => closeBtn.focus());
  }

  closeDrawers() {
    this.el.favDrawer.classList.remove('active');
    this.el.histDrawer.classList.remove('active');
    this.el.drawerScrim.classList.remove('active');
    // A11y: restaurar el foco al elemento que abrió el drawer
    if (this._drawerLastFocused && this._drawerLastFocused.focus) {
      try {
        this._drawerLastFocused.focus();
      } catch (e) {
        /* ignore */
      }
      this._drawerLastFocused = null;
    }
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
    if (!('serviceWorker' in navigator)) return;
    /* Si había un SW previo y uno nuevo toma el control, recargar una vez
       para que el usuario vea la versión actual (botones/cambios nuevos). */
    const hadController = !!navigator.serviceWorker.controller;
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    navigator.serviceWorker
      .register('sw.js')
      .then((reg) => {
        /* eslint-disable-next-line no-console */
        console.log('[SW] registrado — modo offline listo');
        /* Buscar nuevas versiones cada 30 min sin esperar a una navegación */
        setInterval(
          () => {
            reg.update().catch(() => {});
          },
          30 * 60 * 1000
        );
      })
      /* eslint-disable-next-line no-console */
      .catch((err) => console.warn('[SW] fallo:', err));
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
    this._toastTimer = setTimeout(() => {
      t.className = 'toast';
    }, 3200);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  /* Only boot the full UI when its root element is present. This lets pages
     like test.html load app.js just to verify the data/class without crashing
     on the missing UI DOM. */
  if (!document.getElementById('searchInput')) return;
  window.promptLibrary = new PromptLibrary();
});

/* Global error boundary — logs to console and shows toast if UI is booted */
window.addEventListener('error', (event) => {
  console.error('[BPI] Unhandled error:', event.error?.message || event.message, event);
  if (window.promptLibrary && typeof window.promptLibrary.showToast === 'function') {
    window.promptLibrary.showToast('⚠ Error interno — recargue la página si persiste', 'error');
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[BPI] Unhandled rejection:', event.reason?.message || event.reason, event);
  if (window.promptLibrary && typeof window.promptLibrary.showToast === 'function') {
    window.promptLibrary.showToast('⚠ Error de red o procesamiento — reintente', 'error');
  }
});

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
(function initKeyboardShortcuts() {
  const SHORTCUTS = [
    { keys: 'Ctrl+K', macKeys: '⌘K', desc: 'Foco en búsqueda', action: () => document.getElementById('searchInput')?.focus() },
    { keys: 'Ctrl+Shift+F', macKeys: '⌘⇧F', desc: 'Favoritos', action: () => document.getElementById('favToggle')?.click() },
    { keys: 'Ctrl+Shift+H', macKeys: '⌘⇧H', desc: 'Historial', action: () => document.getElementById('histToggle')?.click() },
    { keys: 'Ctrl+Shift+C', macKeys: '⌘⇧C', desc: 'Chat IA', action: () => document.getElementById('chatToggle')?.click() },
    { keys: 'Ctrl+Shift+D', macKeys: '⌘⇧D', desc: 'Panel de Control', action: () => toggleDashboard() },
    { keys: 'Ctrl+/', macKeys: '⌘/', desc: 'Mostrar atajos', action: () => toggleShortcutsModal() },
    { keys: 'Escape', macKeys: 'Esc', desc: 'Cerrar modales/paneles', action: () => closeAllPanels() },
  ];

  // Build shortcuts help modal content
  function buildShortcutsTable() {
    const tbody = document.getElementById('shortcutsList');
    if (!tbody) return;
    const isMac = /Mac/i.test(navigator.platform || '');
    tbody.innerHTML = SHORTCUTS.map((s) => {
      const display = isMac ? s.macKeys || s.keys : s.keys;
      return `<tr style="border-bottom:1px solid var(--line)">
        <td style="padding:0.5rem;font-family:var(--f-mono);font-size:0.75rem;color:var(--amber);white-space:nowrap">${display}</td>
        <td style="padding:0.5rem;color:var(--txt-2)">${s.desc}</td>
      </tr>`;
    }).join('');
  }

  function toggleShortcutsModal() {
    const modal = document.getElementById('shortcutsModal');
    if (!modal) return;
    buildShortcutsTable();
    modal.classList.toggle('active');
  }

  function toggleDashboard() {
    const overlay = document.getElementById('dashboardOverlay');
    if (!overlay) return;
    if (overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    } else {
      renderDashboard();
      overlay.classList.add('active');
    }
  }

  function closeAllPanels() {
    // Close all modals, drawers, sandbox, dashboard
    const modal = document.getElementById('promptModal');
    if (modal && modal.classList.contains('active')) {
      document.getElementById('modalClose')?.click();
      return;
    }
    const sandbox = document.getElementById('sandboxDrawer');
    if (sandbox && sandbox.classList.contains('active')) {
      sandbox.classList.remove('active');
      return;
    }
    const dashboard = document.getElementById('dashboardOverlay');
    if (dashboard && dashboard.classList.contains('active')) {
      dashboard.classList.remove('active');
      return;
    }
    const shortcuts = document.getElementById('shortcutsModal');
    if (shortcuts && shortcuts.classList.contains('active')) {
      shortcuts.classList.remove('active');
      return;
    }
    // Close drawers
    ['favDrawer', 'histDrawer', 'chatDrawer'].forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.classList.contains('active')) {
        el.classList.remove('active');
        document.getElementById(id === 'chatDrawer' ? 'chatScrim' : 'drawerScrim')?.classList.remove('active');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
    const mod = e.ctrlKey || e.metaKey;

    // / (slash) focuses search when not in input
    if (e.key === '/' && !isInput) {
      e.preventDefault();
      document.getElementById('searchInput')?.focus();
      return;
    }

    // Escape closes everything
    if (e.key === 'Escape' && !isInput) {
      e.preventDefault();
      closeAllPanels();
      return;
    }

    if (!mod) return;

    // Ctrl/Cmd + K: focus search
    if (e.key === 'k' || e.key === 'K') {
      e.preventDefault();
      document.getElementById('searchInput')?.focus();
      return;
    }

    // Ctrl/Cmd + Shift + letter shortcuts
    if (e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'f':
          e.preventDefault();
          document.getElementById('favToggle')?.click();
          break;
        case 'h':
          e.preventDefault();
          document.getElementById('histToggle')?.click();
          break;
        case 'c':
          e.preventDefault();
          document.getElementById('chatToggle')?.click();
          break;
        case 'd':
          e.preventDefault();
          toggleDashboard();
          break;
        case '/':
          e.preventDefault();
          toggleShortcutsModal();
          break;
      }
    }
  });

  // Shortcuts modal close
  document.addEventListener('click', (e) => {
    if (e.target.id === 'shortcutsModal') {
      e.target.classList.remove('active');
    }
    if (e.target.id === 'shortcutsClose') {
      document.getElementById('shortcutsModal')?.classList.remove('active');
    }
  });
})();

/* ============================================================
   DASHBOARD RENDERER
   ============================================================ */
/* eslint-disable indent */
function renderDashboard() {
  const body = document.getElementById('dashboardBody');
  if (!body || !window.UsageTracker) return;

  const stats = window.UsageTracker.getStats();
  const topPrompts = window.UsageTracker.getTopPrompts(5);
  const _topIndustries = window.UsageTracker.getTopIndustries();
  const timeline = window.UsageTracker.getTimeline();

  const maxViews = Math.max(1, ...topPrompts.map((p) => p.score));

  const timelineHTML = timeline.length
    ? // prettier-ignore
      timeline
        .slice(0, 10)
        .map((t) => {
          const icons = { view: '👁', copy: '📋', favorite: '⭐', unfavorite: '☆', export: '📤', chat: '💬' };
          const time = new Date(t.time);
          const timeStr = time.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
          return `<div class="dash-timeline-item">
        <span class="dash-timeline-icon">${icons[t.type] || '•'}</span>
        <span class="dash-timeline-text">${t.label}</span>
        <span class="dash-timeline-time">${timeStr}</span>
      </div>`;
        })
        .join('')
    : '<div class="dash-timeline-item" style="color:var(--txt-3)">Sin actividad reciente</div>';

  body.innerHTML = `
    <div class="dash-stat">
      <div class="dash-num">${stats.totalPromptViews}</div>
      <div class="dash-label">Prompts Vistos</div>
    </div>
    <div class="dash-stat">
      <div class="dash-num">${stats.totalPromptCopies}</div>
      <div class="dash-label">Copias Realizadas</div>
    </div>
    <div class="dash-stat">
      <div class="dash-num">${stats.totalExports}</div>
      <div class="dash-label">Exportaciones</div>
    </div>
    <div class="dash-stat">
      <div class="dash-num">${stats.chatMessagesSent}</div>
      <div class="dash-label">Mensajes Chat IA</div>
    </div>
    <div class="dash-stat">
      <div class="dash-num">${(stats.chatWordsGenerated / 1000).toFixed(1)}k</div>
      <div class="dash-label">Palabras Generadas</div>
    </div>
    <div class="dash-stat">
      <div class="dash-num">${stats.sessionCount}</div>
      <div class="dash-label">Sesiones</div>
    </div>
    <div class="dash-chart">
      <h4>🏆 Top Prompts Más Usados</h4>
      ${
        topPrompts.length
          ? topPrompts
              .map((p) => {
                const w = Math.round((p.score / maxViews) * 100);
                return `<div class="dash-bar">
            <span class="dash-bar-label">${p.titulo}</span>
            <div class="dash-bar-track"><div class="dash-bar-fill" style="width:${w}%"></div></div>
            <span class="dash-bar-count">${p.score}</span>
          </div>`;
              })
              .join('')
          : '<div class="dash-empty">Usa algunos prompts para ver estadísticas</div>'
      }
    </div>
    <div class="dash-timeline">
      <h4>⏱ Actividad Reciente</h4>
      ${timelineHTML}
    </div>
  `;
}
/* eslint-enable indent */

/* Dashboard overlay click-to-close and button handler */
(function initDashboard() {
  document.addEventListener('click', (e) => {
    if (e.target.id === 'dashboardOverlay') {
      e.target.classList.remove('active');
    }
    if (e.target.id === 'dashboardClose') {
      document.getElementById('dashboardOverlay')?.classList.remove('active');
    }
    if (e.target.id === 'dashboardToggle') {
      const overlay = document.getElementById('dashboardOverlay');
      if (!overlay) return;
      if (overlay.classList.contains('active')) {
        overlay.classList.remove('active');
      } else {
        renderDashboard();
        overlay.classList.add('active');
      }
    }
  });
})();

/* ============================================================
   PWA INSTALL BANNER
   ============================================================ */
(function initInstallBanner() {
  let deferredPrompt = null;
  const BANNER_DISMISS_KEY = 'bpi_install_banner_dismissed';

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Check if dismissed in last 7 days
    const dismissed = localStorage.getItem(BANNER_DISMISS_KEY);
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const banner = document.getElementById('installBanner');
    if (!banner) return;

    setTimeout(() => banner.classList.add('visible'), 2000);

    document.getElementById('installBannerBtn')?.addEventListener('click', async () => {
      banner.classList.remove('visible');
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          localStorage.setItem(BANNER_DISMISS_KEY, String(Date.now() + 365 * 24 * 60 * 60 * 1000));
        }
        deferredPrompt = null;
      }
    });

    document.getElementById('installDismissBtn')?.addEventListener('click', () => {
      banner.classList.remove('visible');
      localStorage.setItem(BANNER_DISMISS_KEY, String(Date.now()));
    });
  });
})();

// Export para tests reales (Jest/jsdom) sin cambiar el uso en navegador
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PromptLibrary, SafeStore, PLATFORM_SPECS, PLATFORM_KEYS };
}
