/* ============================================================
   BPI Worker — Offload heavy prompt processing from main thread
   Handles: search indexing, word count, syntax highlighting,
   export generation, data validation, code block extraction.
   ============================================================ */

const CACHE = new Map();

/** Build a search index from all prompts for fast filtering */
function buildSearchIndex(prompts) {
  const index = [];
  for (const p of prompts) {
    const terms = [p.titulo || '', p.categoria || '', (p.tags || []).join(' '), p.prompt || '', p.uso || '']
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

/** Merge multiple code blocks into a single runnable HTML document */
function mergeCodeBlocks(blocks) {
  if (!blocks || !blocks.length) return '';

  const htmlBlocks = blocks.filter((b) => ['html', 'htm', 'svg'].includes((b.language || '').toLowerCase()));
  const cssBlocks = blocks.filter((b) => ['css', 'scss', 'sass'].includes((b.language || '').toLowerCase()));
  const jsBlocks = blocks.filter((b) => ['js', 'javascript', 'ts', 'typescript'].includes((b.language || '').toLowerCase()));

  const combinedCss = cssBlocks.map((b) => b.code).join('\n\n');
  const combinedJs = jsBlocks.map((b) => b.code).join('\n\n');

  if (htmlBlocks.length > 0) {
    let baseHtml = htmlBlocks.map((b) => b.code).join('\n');

    const hasHtmlTag = /<html[\s>]/i.test(baseHtml);
    const hasHeadTag = /<\/head>/i.test(baseHtml);
    const hasBodyTag = /<\/body>/i.test(baseHtml);

    if (hasHeadTag && combinedCss) {
      baseHtml = baseHtml.replace(/<\/head>/i, `<style>\n${combinedCss}\n</style>\n</head>`);
    } else if (combinedCss && !baseHtml.includes(combinedCss)) {
      baseHtml = `<style>\n${combinedCss}\n</style>\n` + baseHtml;
    }

    if (hasBodyTag && combinedJs) {
      baseHtml = baseHtml.replace(/<\/body>/i, `<script>\n${combinedJs}\n<\/script>\n</body>`);
    } else if (combinedJs && !baseHtml.includes(combinedJs)) {
      baseHtml = baseHtml + `\n<script>\n${combinedJs}\n<\/script>`;
    }

    if (!hasHtmlTag) {
      return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sandbox Preview</title>
  ${combinedCss ? `<style>\n${combinedCss}\n</style>` : ''}
</head>
<body>
  ${baseHtml}
  ${combinedJs && !baseHtml.includes(combinedJs) ? `<script>\n${combinedJs}\n<\/script>` : ''}
</body>
</html>`;
    }

    return baseHtml;
  }

  if (combinedCss || combinedJs) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sandbox Preview</title>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #0c1220; color: #e2e8f0; }
    ${combinedCss}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    ${combinedJs}
  <\/script>
</body>
</html>`;
  }

  return '';
}

/** Extract code blocks from markdown text */
function extractCodeBlocks(text) {
  if (!text) {
    const empty = [];
    empty.mergedHtml = '';
    return empty;
  }
  const blocks = [];
  const regex = /```([a-zA-Z0-9_\-+]+)?(?:[ \t]+([^\n\r]+))?\r?\n([\s\S]*?)```/g;
  let match;
  let idx = 0;

  const extMap = {
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    javascript: 'js',
    js: 'js',
    jsx: 'jsx',
    typescript: 'ts',
    ts: 'ts',
    tsx: 'tsx',
    json: 'json',
    python: 'py',
    py: 'py',
    bash: 'sh',
    sh: 'sh',
    shell: 'sh',
    sql: 'sql',
    yaml: 'yml',
    yml: 'yml',
    xml: 'xml',
    svg: 'svg',
    md: 'md',
    markdown: 'md',
  };

  const defaultNames = {
    html: 'index.html',
    css: 'styles.css',
    js: 'app.js',
    javascript: 'app.js',
    ts: 'app.ts',
    typescript: 'app.ts',
    json: 'data.json',
    svg: 'image.svg',
    py: 'main.py',
    python: 'main.py',
    sh: 'script.sh',
  };

  while ((match = regex.exec(text)) !== null) {
    const rawLang = (match[1] || '').trim().toLowerCase();
    const info = (match[2] || '').trim();
    const code = (match[3] || '').trim();
    const language = rawLang || 'txt';
    const ext = extMap[language] || 'txt';
    idx++;

    let filename = '';
    if (info && !info.includes(' ') && info.includes('.')) {
      filename = info;
    } else if (info && /filename=["']?([^"'\s]+)["']?/i.test(info)) {
      filename = info.match(/filename=["']?([^"'\s]+)["']?/i)[1];
    } else {
      const firstLine = code.split('\n')[0] || '';
      const commentMatch = firstLine.match(/^(?:\/\/|<!--|#|\/\*)\s*(?:file(?:name)?:?\s*)?([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)/i);
      if (commentMatch) {
        filename = commentMatch[1];
      }
    }

    if (!filename) {
      filename = defaultNames[language] && idx === 1 ? defaultNames[language] : `archivo_${idx}.${ext}`;
    }

    blocks.push({ language, code, filename });
  }

  blocks.mergedHtml = mergeCodeBlocks(blocks);
  return blocks;
}

// ---- Message handler ----
if (typeof self !== 'undefined' && self.addEventListener) {
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

        case 'extractCodeBlocks':
          result = extractCodeBlocks(payload);
          break;

        case 'mergeCodeBlocks':
          result = mergeCodeBlocks(payload);
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
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    buildSearchIndex,
    search,
    wordCount,
    highlightPrompt,
    generateExportData,
    extractCodeBlocks,
    mergeCodeBlocks,
  };
}
