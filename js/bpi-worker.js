/* ============================================================
   BPI Worker — Offload heavy prompt processing from main thread
   Handles: search indexing, word count, syntax highlighting,
   export generation, data validation.
   ============================================================ */

const CACHE = new Map();

/** Build a search index from all prompts for fast filtering */
function buildSearchIndex(prompts) {
  const index = [];
  for (const p of prompts) {
    const terms = [p.titulo || '', p.categoria || '', (p.tags || []).join(' '), p.prompt || '', p.id || '', p.uso || '']
      .join(' ')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    index.push({ id: p.id, terms });
  }
  return index;
}

/** Search prompts by query, returns matching IDs */
function search(index, query) {
  const q = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (q.length === 0) return index.map((e) => e.id);
  const results = [];
  for (const entry of index) {
    const score = q.filter((t) => entry.terms.some((et) => et.includes(t))).length;
    if (score > 0) results.push({ id: entry.id, score });
  }
  return results.sort((a, b) => b.score - a.score).map((r) => r.id);
}

/** Count words in a prompt */
function wordCount(text) {
  return (text || '').split(/\s+/).filter(Boolean).length;
}

/** Syntax-highlight code blocks in a prompt */
function highlightPrompt(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="inline">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>');
}

/** Generate export data for PDF or Excel */
function generateExportData(prompt, platform) {
  const spec = {
    web: 'Web (HTML5, CSS3, JS ES2020+)',
    android: 'Android (Kotlin/Jetpack Compose)',
    ios: 'iOS (Swift/SwiftUI)',
    tablet: 'Tablet / iPadOS (responsive)',
    windows: 'Windows (C#/WinUI 3 / .NET)',
  };

  return {
    titulo: prompt.titulo,
    id: prompt.id,
    plataforma: spec[platform] || 'Multiplataforma',
    prompt: prompt.prompt,
    tags: prompt.tags || [],
    categoria: prompt.categoria,
    prioridad: prompt.prioridad,
    uso: prompt.uso,
    fecha: new Date().toISOString(),
  };
}

// ---- Message handler ----
self.addEventListener('message', (e) => {
  const { type, payload, id } = e.data;

  try {
    let result;
    switch (type) {
      case 'buildIndex':
        result = buildSearchIndex(payload);
        CACHE.set('index', result);
        break;

      case 'search':
        result = search(CACHE.get('index') || [], payload);
        break;

      case 'wordCount':
        result = wordCount(payload);
        break;

      case 'highlight':
        result = highlightPrompt(payload);
        break;

      case 'export':
        result = generateExportData(payload.prompt, payload.platform);
        break;

      case 'batchWordCount':
        result = payload.map((p) => ({
          id: p.id,
          words: wordCount(p.prompt),
        }));
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    self.postMessage({ id, type, result, ok: true });
  } catch (err) {
    self.postMessage({ id, type, error: err.message, ok: false });
  }
});
