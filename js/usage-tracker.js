/* ============================================================
   USAGE TRACKER — Métricas y Estadísticas de Uso Local (100% Offline)
   Registra vistas, copias, favoritos, exportaciones y chat IA
   ============================================================ */

const UsageTracker = (() => {
  const STORAGE_KEY = 'bdp_usage_stats';
  const MAX_TIMELINE_ITEMS = 30;

  let currentStats = null;

  function getTodayKey() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getInitialStats() {
    return {
      totalPromptViews: 0,
      totalPromptCopies: 0,
      totalFavorites: 0,
      totalExports: 0,
      sessionCount: 0,
      chatWordsGenerated: 0,
      chatMessagesSent: 0,
      chatTokensEstimated: 0,
      promptViews: {}, // { [promptId]: count }
      promptCopies: {}, // { [promptId]: count }
      promptTitles: {}, // { [promptId]: title }
      promptCategories: {}, // { [promptId]: categoryId }
      industryViews: {}, // { [categoryId]: count }
      industryTitles: {}, // { [categoryId]: categoryName }
      daily: {}, // { [YYYY-MM-DD]: { views, copies, chats, words, exports } }
      timeline: [], // [ { id, type, label, time } ]
    };
  }

  function safeLoad() {
    try {
      const raw = typeof window !== 'undefined' && window.SafeStore ? window.SafeStore.get(STORAGE_KEY) : localStorage.getItem(STORAGE_KEY);
      if (!raw) return getInitialStats();
      const parsed = JSON.parse(raw);
      return { ...getInitialStats(), ...parsed };
    } catch {
      return getInitialStats();
    }
  }

  function safeSave() {
    if (!currentStats) return;
    try {
      const serialized = JSON.stringify(currentStats);
      if (typeof window !== 'undefined' && window.SafeStore) {
        window.SafeStore.set(STORAGE_KEY, serialized);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, serialized);
      }
    } catch {
      /* ignore */
    }
  }

  function ensureDailyEntry() {
    const today = getTodayKey();
    if (!currentStats.daily[today]) {
      currentStats.daily[today] = { views: 0, copies: 0, chats: 0, words: 0, exports: 0 };
    }
    return currentStats.daily[today];
  }

  function addTimelineEvent(type, label) {
    if (!label) return;
    const item = {
      id: 'tl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type,
      label,
      time: Date.now(),
    };
    currentStats.timeline.unshift(item);
    if (currentStats.timeline.length > MAX_TIMELINE_ITEMS) {
      currentStats.timeline = currentStats.timeline.slice(0, MAX_TIMELINE_ITEMS);
    }
  }

  function init() {
    currentStats = safeLoad();

    // Contabilizar nueva sesión si aplica
    try {
      if (typeof sessionStorage !== 'undefined') {
        const sessionActive = sessionStorage.getItem('bdp_session_active');
        if (!sessionActive) {
          sessionStorage.setItem('bdp_session_active', '1');
          currentStats.sessionCount = (currentStats.sessionCount || 0) + 1;
          safeSave();
        }
      } else {
        currentStats.sessionCount = (currentStats.sessionCount || 0) + 1;
        safeSave();
      }
    } catch {
      currentStats.sessionCount = (currentStats.sessionCount || 0) + 1;
      safeSave();
    }
  }

  function countWords(text) {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  function recordPromptView(prompt, category) {
    if (!currentStats) init();
    if (!prompt || !prompt.id) return;

    currentStats.totalPromptViews++;
    currentStats.promptViews[prompt.id] = (currentStats.promptViews[prompt.id] || 0) + 1;
    currentStats.promptTitles[prompt.id] = prompt.titulo || prompt.id;

    const catId = (category && category.id) || prompt.categoria || 'general';
    const catName = (category && category.nombre) || catId;
    currentStats.promptCategories[prompt.id] = catId;
    currentStats.industryViews[catId] = (currentStats.industryViews[catId] || 0) + 1;
    currentStats.industryTitles[catId] = catName;

    const daily = ensureDailyEntry();
    daily.views = (daily.views || 0) + 1;

    addTimelineEvent('view', `Visto: ${prompt.titulo || prompt.id}`);
    safeSave();
  }

  function recordPromptCopy(prompt) {
    if (!currentStats) init();
    if (!prompt || !prompt.id) return;

    currentStats.totalPromptCopies++;
    currentStats.promptCopies[prompt.id] = (currentStats.promptCopies[prompt.id] || 0) + 1;
    currentStats.promptTitles[prompt.id] = prompt.titulo || prompt.id;

    const daily = ensureDailyEntry();
    daily.copies = (daily.copies || 0) + 1;

    addTimelineEvent('copy', `Copiado: ${prompt.titulo || prompt.id}`);
    safeSave();
  }

  function recordPromptFavorite(prompt, isAdded) {
    if (!currentStats) init();
    if (!prompt || !prompt.id) return;

    if (isAdded) {
      currentStats.totalFavorites++;
      addTimelineEvent('favorite', `Añadido a favoritos: ${prompt.titulo || prompt.id}`);
    } else {
      addTimelineEvent('unfavorite', `Quitado de favoritos: ${prompt.titulo || prompt.id}`);
    }
    safeSave();
  }

  function recordPromptExport(prompt, exportType) {
    if (!currentStats) init();
    currentStats.totalExports++;

    const title = (prompt && prompt.titulo) || 'Prompt';
    const typeUpper = (exportType || 'doc').toUpperCase();

    const daily = ensureDailyEntry();
    daily.exports = (daily.exports || 0) + 1;

    addTimelineEvent('export', `Exportado (${typeUpper}): ${title}`);
    safeSave();
  }

  function recordChatInteraction(userMsg, assistantMsg) {
    if (!currentStats) init();
    currentStats.chatMessagesSent++;

    const respWords = countWords(assistantMsg);
    const userWords = countWords(userMsg);
    const totalWords = respWords || userWords;

    currentStats.chatWordsGenerated += respWords;
    // Estimación típica de tokens ~ 1.33 tokens por palabra
    currentStats.chatTokensEstimated += Math.round(totalWords * 1.33);

    const daily = ensureDailyEntry();
    daily.chats = (daily.chats || 0) + 1;
    daily.words = (daily.words || 0) + respWords;

    addTimelineEvent('chat', `Respuesta IA generada (${respWords} palabras)`);
    safeSave();
  }

  function getStats() {
    if (!currentStats) init();
    return JSON.parse(JSON.stringify(currentStats));
  }

  function getTopPrompts(limit = 5) {
    if (!currentStats) init();
    const combined = {};
    const views = currentStats.promptViews || {};
    const copies = currentStats.promptCopies || {};

    Object.keys({ ...views, ...copies }).forEach((id) => {
      combined[id] = (views[id] || 0) + (copies[id] || 0) * 2; // Ponderar copias más que vistas
    });

    const sortedIds = Object.keys(combined).sort((a, b) => combined[b] - combined[a]);
    return sortedIds.slice(0, limit).map((id) => ({
      id,
      titulo: currentStats.promptTitles[id] || id,
      views: views[id] || 0,
      copies: copies[id] || 0,
      score: combined[id],
      categoria: currentStats.promptCategories[id] || 'general',
    }));
  }

  function getTopIndustries() {
    if (!currentStats) init();
    const indViews = currentStats.industryViews || {};
    const total = Object.values(indViews).reduce((a, b) => a + b, 0) || 1;

    return Object.keys(indViews)
      .map((catId) => ({
        id: catId,
        nombre: currentStats.industryTitles[catId] || catId,
        views: indViews[catId],
        percent: Math.round((indViews[catId] / total) * 100),
      }))
      .sort((a, b) => b.views - a.views);
  }

  function getTimeline() {
    if (!currentStats) init();
    return currentStats.timeline || [];
  }

  function clearStats() {
    currentStats = getInitialStats();
    currentStats.sessionCount = 1;
    safeSave();
  }

  return {
    init,
    recordPromptView,
    recordPromptCopy,
    recordPromptFavorite,
    recordPromptExport,
    recordChatInteraction,
    getStats,
    getTopPrompts,
    getTopIndustries,
    getTimeline,
    clearStats,
  };
})();

// Auto-inicializar si estamos en navegador
if (typeof window !== 'undefined') {
  window.UsageTracker = UsageTracker;
  // Inicializar en carga
  try {
    UsageTracker.init();
  } catch {
    /* ignore */
  }
}

if (typeof window !== 'undefined') {
  window.UsageTracker = UsageTracker;
}
