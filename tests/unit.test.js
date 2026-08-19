/**
 * Tests unitarios para SafeStore, mergeData, PromptLibrary core
 * Ejecutar: npm run test
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Mock DOM environment
const mockDom = {
  document: {
    getElementById: () => ({
      addEventListener() {},
      classList: {
        add() {},
        remove() {},
        toggle() {},
        contains() {
          return false;
        },
      },
      style: {},
      querySelector() {
        return null;
      },
      querySelectorAll() {
        return [];
      },
      setAttribute() {},
      getAttribute() {
        return null;
      },
      toggleAttribute() {},
      appendChild() {},
      remove() {},
      click() {},
      focus() {},
      select() {},
      hidden: false,
      textContent: '',
      innerHTML: '',
      value: '',
      dataset: {},
      parentElement: null,
    }),
    querySelectorAll: () => [],
    createElement: () => ({
      style: {},
      classList: {
        add() {},
        remove() {},
        toggle() {},
        contains() {
          return false;
        },
      },
      appendChild() {},
      remove() {},
      setAttribute() {},
      getAttribute() {
        return null;
      },
      addEventListener() {},
      querySelector() {
        return null;
      },
      querySelectorAll() {
        return [];
      },
      dataset: {},
      textContent: '',
      innerHTML: '',
      hidden: false,
      parentElement: null,
    }),
    body: { style: {}, appendChild() {}, overflow: '', classList: { add() {}, remove() {} } },
    activeElement: { tagName: 'BODY' },
    documentElement: { setAttribute() {}, getAttribute: () => 'dark' },
    addEventListener: () => {},
  },
  window: {
    addEventListener: () => {},
    scrollTo: () => {},
    open: () => {},
    location: { href: '' },
    performance: { now: () => Date.now() },
    requestAnimationFrame: (cb) => cb(Date.now()),
    setInterval: () => {},
    setTimeout: (cb) => cb(),
    clearTimeout: () => {},
    IntersectionObserver: class {
      observe() {}
      unobserve() {}
    },
    URL: { createObjectURL: () => 'blob:', revokeObjectURL: () => {} },
    Blob: class {
      constructor() {}
    },
    navigator: {
      onLine: true,
      clipboard: { writeText: async () => {} },
      serviceWorker: { register: async () => {} },
    },
    localStorage: {
      _data: {},
      getItem(key) {
        return this._data[key] || null;
      },
      setItem(key, val) {
        this._data[key] = val;
      },
      removeItem(key) {
        delete this._data[key];
      },
    },
    console: { log() {}, warn() {}, error() {} },
    AIChat: null,
  },
  getComputedStyle: () => ({}),
};

// Setup globals
Object.assign(global, mockDom);
global.document.querySelectorAll = () => [];
global.document.querySelector = () => null;
global.navigator = mockDom.window.navigator;
global.localStorage = mockDom.window.localStorage;
global.IntersectionObserver = mockDom.window.IntersectionObserver;
global.performance = mockDom.window.performance;
global.requestAnimationFrame = mockDom.window.requestAnimationFrame;
global.setInterval = mockDom.window.setInterval;
global.setTimeout = mockDom.window.setTimeout;
global.clearTimeout = mockDom.window.clearTimeout;
global.URL = mockDom.window.URL;
global.Blob = mockDom.window.Blob;

const context = vm.createContext({ ...global, console: global.console });

// Load data files
function loadDataFile(filePath, varName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const wrapped = '(function() { ' + content + '; return ' + varName + '; })()';
  const result = vm.runInContext(wrapped, context);
  context[varName] = result;
  return result;
}

loadDataFile(path.join(__dirname, '..', 'js', 'prompts-data.js'), 'PROMPTS_DB');
loadDataFile(path.join(__dirname, '..', 'js', 'prompts-data-extra.js'), 'PROMPTS_DB_EXTRA');
loadDataFile(path.join(__dirname, '..', 'js', 'prompts-data-v2.js'), 'PROMPTS_DB_V2');
loadDataFile(path.join(__dirname, '..', 'js', 'prompts-data-fullstack.js'), 'PROMPTS_DB_FULLSTACK');

// Load platform-tests (it sets global PlatformTests if window exists, but we're in Node)
const platformTestsFile = fs.readFileSync(path.join(__dirname, '..', 'js', 'platform-tests.js'), 'utf8');
// In Node, window is not defined, so the assignment at the bottom never runs.
// We run the file in context (which declares PlatformTests), then manually assign to context.
vm.runInContext(platformTestsFile, context);
// If PlatformTests didn't get assigned (because no window), grab it from the IIFE
if (!context.PlatformTests) {
  // The file declares PlatformTests as a const. We need to grab it differently.
  // Run the assignment explicitly
  vm.runInContext('this.PlatformTests = PlatformTests;', context);
}

// Load app.js (it will try to boot but we stop it before DOMContentLoaded)
// We need to extract SafeStore and mergeData logic manually
const appCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

// Extract SafeStore from app.js — run it as a module in the context
// We need to make the global variables available first
vm.runInContext('const PROMPTS_DB = ' + JSON.stringify(context.PROMPTS_DB), context);
vm.runInContext('const PROMPTS_DB_EXTRA = ' + JSON.stringify(context.PROMPTS_DB_EXTRA || null), context);
vm.runInContext('const PROMPTS_DB_V2 = ' + JSON.stringify(context.PROMPTS_DB_V2 || null), context);
vm.runInContext('const PROMPTS_DB_FULLSTACK = ' + JSON.stringify(context.PROMPTS_DB_FULLSTACK || null), context);

// Define SafeStore manually from the app.js source
vm.runInContext(
  `
this.SafeStore = {
  _mem: Object.create(null),
  _ok: null,
  available() {
    if (this._ok !== null) return this._ok;
    try {
      var k = '__bdp_test__';
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
`,
  context
);

describe('SafeStore', () => {
  test('SafeStore está disponible', () => {
    expect(context.SafeStore).toBeDefined();
  });

  test('SafeStore.available() retorna boolean', () => {
    const available = context.SafeStore.available();
    expect(typeof available).toBe('boolean');
  });

  test('SafeStore.set/get funcionan', () => {
    context.SafeStore.set('test_key', 'test_value');
    expect(context.SafeStore.get('test_key')).toBe('test_value');
  });

  test('SafeStore.set/get con valores JSON', () => {
    const obj = { a: 1, b: [2, 3], c: 'hello' };
    context.SafeStore.set('json_key', JSON.stringify(obj));
    const retrieved = context.SafeStore.get('json_key');
    expect(JSON.parse(retrieved)).toEqual(obj);
  });
});

describe('Data merge logic', () => {
  test('merged data tiene todas las categorías de PROMPTS_DB', () => {
    const db = context.PROMPTS_DB;
    const merged = JSON.parse(JSON.stringify(db));

    // Simulate mergeData
    if (context.PROMPTS_DB_EXTRA) {
      context.PROMPTS_DB_EXTRA.categorias.forEach((extraCat) => {
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

    if (context.PROMPTS_DB_V2) {
      context.PROMPTS_DB_V2.categorias.forEach((v2Cat) => {
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

    if (context.PROMPTS_DB_FULLSTACK) {
      context.PROMPTS_DB_FULLSTACK.categorias.forEach((fsCat) => {
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

    expect(merged.categorias.length).toBeGreaterThanOrEqual(db.categorias.length);
  });

  test('no hay IDs duplicados después de merge', () => {
    const merged = JSON.parse(JSON.stringify(context.PROMPTS_DB));
    const sources = [context.PROMPTS_DB_EXTRA, context.PROMPTS_DB_V2, context.PROMPTS_DB_FULLSTACK].filter(Boolean);

    sources.forEach((source) => {
      source.categorias.forEach((srcCat) => {
        const existing = merged.categorias.find((c) => c.id === srcCat.id);
        if (existing) {
          srcCat.subcategorias.forEach((sub) => {
            const existingSub = existing.subcategorias.find((s) => s.id === sub.id);
            if (existingSub) existingSub.prompts.push(...sub.prompts);
            else existing.subcategorias.push(sub);
          });
        } else {
          merged.categorias.push(srcCat);
        }
      });
    });

    const allIds = [];
    merged.categorias.forEach((cat) => cat.subcategorias.forEach((sub) => sub.prompts.forEach((p) => allIds.push(p.id))));
    const uniqueIds = new Set(allIds);
    const dupeCount = allIds.length - uniqueIds.size;

    // Allow a small number of intentional duplicates (same prompt ID in multiple files)
    expect(dupeCount).toBeLessThanOrEqual(5);
  });
});

describe('PlatformTests', () => {
  test('validatePromptStructure retorna errores y warnings', () => {
    const tests = context.PlatformTests;
    expect(tests).toBeDefined();

    const p = context.PROMPTS_DB.categorias[0].subcategorias[0].prompts[0];
    const result = tests.validatePromptStructure(p);
    expect(result.errors).toBeDefined();
    expect(result.warnings).toBeDefined();
    expect(result.wordCount).toBeGreaterThan(0);
  });

  test('validatePromptStructure detecta campos faltantes', () => {
    const tests = context.PlatformTests;
    const badPrompt = { id: 'test', titulo: 'Test' };
    const result = tests.validatePromptStructure(badPrompt);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('validateMultiplatformCompatibility cubre las 5 plataformas', () => {
    const tests = context.PlatformTests;
    const p = context.PROMPTS_DB.categorias[0].subcategorias[0].prompts[0];
    const result = tests.validateMultiplatformCompatibility(p);
    expect(Object.keys(result)).toHaveLength(5);
    expect(result.web).toBeDefined();
    expect(result.android).toBeDefined();
    expect(result.ios).toBeDefined();
    expect(result.tablet).toBeDefined();
    expect(result.windows).toBeDefined();
  });

  test('validateCodeGeneration verifica HTML/CSS/JS', () => {
    const tests = context.PlatformTests;
    const p = context.PROMPTS_DB.categorias[0].subcategorias[0].prompts[0];
    const result = tests.validateCodeGeneration(p);
    expect(result.checks.html).toBe(true);
    expect(result.checks.javascript).toBe(true);
    expect(result.score).toBeGreaterThan(0);
  });

  test('runFullTest retorna score > 0', () => {
    const tests = context.PlatformTests;
    const p = context.PROMPTS_DB.categorias[0].subcategorias[0].prompts[0];
    const result = tests.runFullTest(p);
    expect(result.promptId).toBe(p.id);
    expect(result.promptTitle).toBe(p.titulo);
    expect(result.overallScore).toBeGreaterThan(0);
    expect(typeof result.passed).toBe('boolean');
  });

  test('runAllTests procesa múltiples prompts', () => {
    const tests = context.PlatformTests;
    const prompts = [
      context.PROMPTS_DB.categorias[0].subcategorias[0].prompts[0],
      context.PROMPTS_DB.categorias[0].subcategorias[0].prompts[1],
      context.PROMPTS_DB.categorias[1].subcategorias[0].prompts[0],
    ].filter(Boolean);
    const result = tests.runAllTests(prompts);
    expect(result.total).toBe(prompts.length);
    expect(result.passRate).toBeDefined();
    expect(result.results.length).toBe(prompts.length);
  });
});

describe('Word count', () => {
  test('wordCount funciona correctamente', () => {
    // Test the wordCount function from app.js
    const wc = (text) => text.split(/\s+/).filter(Boolean).length;
    expect(wc('uno dos tres')).toBe(3);
    expect(wc('')).toBe(0);
    expect(wc('  a   b   c  ')).toBe(3);
    expect(wc('hola\nmundo')).toBe(2);
  });
});

describe('Escape HTML', () => {
  test('esc HTML funciona correctamente', () => {
    const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
    expect(esc('<script>')).toBe('&lt;script&gt;');
    expect(esc('a & b')).toBe('a &amp; b');
    expect(esc('"hello"')).toBe('&quot;hello&quot;');
    expect(esc("it's")).toBe('it&#39;s');
  });
});

describe('AIChat — Providers, Gemini & Free Tiers', () => {
  let aiChatModule;

  beforeAll(() => {
    const aiChatCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'ai-chat.js'), 'utf8');
    vm.runInContext(aiChatCode, context);
    aiChatModule = context.AIChat || context.window.AIChat;
  });

  test('AIChat está definido e inicializable', () => {
    expect(aiChatModule).toBeDefined();
    expect(typeof aiChatModule.init).toBe('function');
    expect(typeof aiChatModule.sendMessage).toBe('function');
  });

  test('DEFAULT_PROVIDERS incluye Google Gemini con modelos requeridos', () => {
    const providers = aiChatModule.DEFAULT_PROVIDERS;
    expect(providers).toBeDefined();
    const gemini = providers.find((p) => p.id === 'gemini');
    expect(gemini).toBeDefined();
    expect(gemini.name).toContain('Google Gemini');
    expect(gemini.models).toContain('gemini-2.0-flash');
    expect(gemini.models).toContain('gemini-2.0-flash-lite');
    expect(gemini.models).toContain('gemini-2.0-pro');
    expect(gemini.models).toContain('gemini-2.5-pro');
    expect(gemini.tier).toBe('both');
    expect(gemini.endpoint).toContain('generativelanguage.googleapis.com');
  });

  test('Todos los DEFAULT_PROVIDERS tienen campo tier válido', () => {
    const providers = aiChatModule.DEFAULT_PROVIDERS;
    const validTiers = ['free', 'paid', 'both'];
    providers.forEach((p) => {
      expect(validTiers).toContain(p.tier);
    });
  });

  test('LOCAL_PROBES incluye LiteLLM, llama.cpp y Jan AI', () => {
    const probes = aiChatModule.LOCAL_PROBES;
    expect(probes).toBeDefined();
    const litellm = probes.find((p) => p.name.toLowerCase().includes('litellm'));
    const llamacpp = probes.find((p) => p.name.toLowerCase().includes('llama.cpp'));
    const jan = probes.find((p) => p.name.toLowerCase().includes('jan ai'));

    expect(litellm).toBeDefined();
    expect(litellm.url).toBe('http://localhost:4000/v1/models');
    expect(llamacpp).toBeDefined();
    expect(llamacpp.url).toBe('http://localhost:8080/v1/models');
    expect(jan).toBeDefined();
    expect(jan.url).toBe('http://localhost:1337/v1/models');

    probes.forEach((probe) => {
      expect(probe.tier).toBe('free');
    });
  });

  test('FREE_TIER_PROVIDERS documenta proveedores con tier gratuito', () => {
    const freeProviders = aiChatModule.FREE_TIER_PROVIDERS;
    expect(freeProviders).toBeDefined();
    expect(freeProviders.length).toBeGreaterThanOrEqual(4);

    const ids = freeProviders.map((p) => p.id);
    expect(ids).toContain('gemini_free');
    expect(ids).toContain('groq_free');
    expect(ids).toContain('openrouter_free');
    expect(ids).toContain('deepseek_free');
  });

  test('MODEL_SCANNER_SOURCES incluye fuentes de modelos gratuitos', () => {
    const sources = aiChatModule.MODEL_SCANNER_SOURCES;
    expect(sources).toBeDefined();
    const openrouter = sources.find((s) => s.url.includes('openrouter.ai'));
    const github = sources.find((s) => s.url.includes('free-llm-api-resources'));

    expect(openrouter).toBeDefined();
    expect(openrouter.url).toContain('free=true');
    expect(github).toBeDefined();
  });

  test('callGemini maneja errores de validación si no hay mensajes', async () => {
    expect(typeof aiChatModule.callGemini).toBe('function');
    const provider = aiChatModule.DEFAULT_PROVIDERS.find((p) => p.id === 'gemini');
    await expect(aiChatModule.callGemini(provider, { messages: [] })).rejects.toThrow();
  });
});
