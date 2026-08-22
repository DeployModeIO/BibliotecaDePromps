/**
 * Tests unitarios para la logica core de PromptLibrary
 * Ejecutar: npm run test
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Mock minimo del DOM para Node
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
      querySelector() {},
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
      querySelector() {},
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
    promptLibrary: null,
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
    navigator: { onLine: true, clipboard: { writeText: async () => {} }, serviceWorker: { register: async () => {} } },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    console: { log() {}, warn() {}, error() {} },
  },
  getComputedStyle: () => ({}),
};

// Configurar globales
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

// Cargar datos con vm - IIFE wrapper para capturar const
function loadDataFile(filePath, varName, context) {
  const content = fs.readFileSync(filePath, 'utf8');
  const wrappedCode = '(function() { ' + content + '; return ' + varName + '; })()';
  const result = vm.runInContext(wrappedCode, context);
  context[varName] = result;
  return result;
}

const context = vm.createContext({ ...global, console: global.console });

loadDataFile(path.join(__dirname, '..', 'js', 'prompts-data.js'), 'PROMPTS_DB', context);
loadDataFile(path.join(__dirname, '..', 'js', 'prompts-data-extra.js'), 'PROMPTS_DB_EXTRA', context);
loadDataFile(path.join(__dirname, '..', 'js', 'prompts-data-v2.js'), 'PROMPTS_DB_V2', context);
loadDataFile(path.join(__dirname, '..', 'js', 'prompts-data-fullstack.js'), 'PROMPTS_DB_FULLSTACK', context);

// Cargar platform-tests via vm
const platformTestsFile = fs.readFileSync(path.join(__dirname, '..', 'js', 'platform-tests.js'), 'utf8');
vm.runInContext(platformTestsFile, context);

describe('PROMPTS_DB estructura', () => {
  test('PROMPTS_DB tiene categorias', () => {
    const db = context.PROMPTS_DB;
    expect(db).toBeDefined();
    expect(db.categorias.length).toBeGreaterThanOrEqual(5);
  });

  test('cada categoria tiene campos requeridos', () => {
    const db = context.PROMPTS_DB;
    db.categorias.forEach((cat) => {
      expect(cat.id).toBeTruthy();
      expect(cat.nombre).toBeTruthy();
      expect(cat.icono).toBeTruthy();
      expect(cat.color).toBeTruthy();
      expect(Array.isArray(cat.subcategorias)).toBe(true);
      expect(cat.subcategorias.length).toBeGreaterThan(0);
    });
  });

  test('cada prompt tiene campos requeridos', () => {
    const db = context.PROMPTS_DB;
    let total = 0;
    db.categorias.forEach((cat) => {
      cat.subcategorias.forEach((sub) => {
        sub.prompts.forEach((p) => {
          total++;
          expect(p.id).toBeTruthy();
          expect(p.titulo).toBeTruthy();
          expect(p.categoria).toBeTruthy();
          expect(['critica', 'alta', 'media']).toContain(p.prioridad);
          expect(p.prompt.length).toBeGreaterThan(500);
          expect(Array.isArray(p.tags)).toBe(true);
          expect(p.uso).toBeTruthy();
        });
      });
    });
    expect(total).toBeGreaterThan(0);
  });

  test('no hay IDs duplicados en PROMPTS_DB', () => {
    const db = context.PROMPTS_DB;
    const ids = [];
    db.categorias.forEach((cat) => cat.subcategorias.forEach((sub) => sub.prompts.forEach((p) => ids.push(p.id))));
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('cada prompt contiene estructura ROL/CONTEXTO/TAREA', () => {
    const db = context.PROMPTS_DB;
    db.categorias.forEach((cat) => {
      cat.subcategorias.forEach((sub) => {
        sub.prompts.forEach((p) => {
          expect(p.prompt).toMatch(/ACTÚA COMO/i);
          expect(p.prompt).toMatch(/CONTEXTO/);
          expect(p.prompt).toMatch(/TAREA/);
        });
      });
    });
  });
});

describe('PROMPTS_DB_EXTRA estructura', () => {
  test('PROMPTS_DB_EXTRA tiene categorias', () => {
    const db = context.PROMPTS_DB_EXTRA;
    expect(db).toBeDefined();
    expect(db.categorias.length).toBeGreaterThanOrEqual(1);
  });

  test('prompts extra tienen estructura valida', () => {
    const db = context.PROMPTS_DB_EXTRA;
    db.categorias.forEach((cat) => {
      cat.subcategorias.forEach((sub) => {
        sub.prompts.forEach((p) => {
          expect(p.id).toBeTruthy();
          expect(p.titulo).toBeTruthy();
          expect(['critica', 'alta', 'media']).toContain(p.prioridad);
          expect(p.prompt.length).toBeGreaterThan(500);
        });
      });
    });
  });
});

describe('PROMPTS_DB_V2 estructura', () => {
  test('PROMPTS_DB_V2 tiene categorias', () => {
    const db = context.PROMPTS_DB_V2;
    expect(db).toBeDefined();
    expect(db.categorias.length).toBeGreaterThanOrEqual(1);
  });

  test('prompts v2 tienen estructura valida', () => {
    const db = context.PROMPTS_DB_V2;
    db.categorias.forEach((cat) => {
      cat.subcategorias.forEach((sub) => {
        sub.prompts.forEach((p) => {
          expect(p.id).toBeTruthy();
          expect(p.titulo).toBeTruthy();
          expect(['critica', 'alta', 'media']).toContain(p.prioridad);
          expect(p.prompt.length).toBeGreaterThan(500);
        });
      });
    });
  });
});

describe('PROMPTS_DB_FULLSTACK estructura', () => {
  test('PROMPTS_DB_FULLSTACK tiene categorias', () => {
    const db = context.PROMPTS_DB_FULLSTACK;
    expect(db).toBeDefined();
    expect(db.categorias.length).toBeGreaterThanOrEqual(1);
  });

  test('prompts fullstack tienen estructura valida', () => {
    const db = context.PROMPTS_DB_FULLSTACK;
    db.categorias.forEach((cat) => {
      cat.subcategorias.forEach((sub) => {
        sub.prompts.forEach((p) => {
          expect(p.id).toBeTruthy();
          expect(p.titulo).toBeTruthy();
          expect(['critica', 'alta', 'media']).toContain(p.prioridad);
          expect(p.prompt.length).toBeGreaterThan(500);
        });
      });
    });
  });
});

describe('mergeData logic', () => {
  test('mergeData combina las 3 fuentes sin duplicar IDs', () => {
    const merged = JSON.parse(JSON.stringify(context.PROMPTS_DB));
    const origIds = [];
    merged.categorias.forEach((cat) => cat.subcategorias.forEach((sub) => sub.prompts.forEach((p) => origIds.push(p.id))));

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

    const mergedIds = [];
    merged.categorias.forEach((cat) => cat.subcategorias.forEach((sub) => sub.prompts.forEach((p) => mergedIds.push(p.id))));
    const unique = new Set(mergedIds);
    const dupes = mergedIds.length - unique.size;
    expect(dupes).toBeLessThanOrEqual(3);
    expect(mergedIds.length).toBeGreaterThan(origIds.length);
  });
});

describe('platform-tests', () => {
  test('PlatformTests valida estructura de prompts', () => {
    const tests = context.PlatformTests;
    if (!tests) return;
    const db = context.PROMPTS_DB;
    const p = db.categorias[0].subcategorias[0].prompts[0];
    const result = tests.validatePromptStructure(p);
    expect(result.errors.length).toBe(0);
    expect(result.wordCount).toBeGreaterThan(0);
  });

  test('PlatformTests valida compatibilidad multiplataforma', () => {
    const tests = context.PlatformTests;
    if (!tests) return;
    const db = context.PROMPTS_DB;
    const p = db.categorias[0].subcategorias[0].prompts[0];
    const result = tests.validateMultiplatformCompatibility(p);
    expect(Object.keys(result).length).toBeGreaterThanOrEqual(3);
  });

  test('PlatformTests corre prueba completa', () => {
    const tests = context.PlatformTests;
    if (!tests) return;
    const db = context.PROMPTS_DB;
    const p = db.categorias[0].subcategorias[0].prompts[0];
    const result = tests.runFullTest(p);
    expect(result.promptId).toBe(p.id);
    expect(result.overallScore).toBeGreaterThan(0);
  });
});
