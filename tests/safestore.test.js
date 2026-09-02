/**
 * @jest-environment jsdom
 */
/**
 * Tests REALES de SafeStore y helpers puros de js/app.js (vía module.exports).
 */

// jsdom no implementa matchMedia (la usa el banner de instalación al cargar)
window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }));

const { SafeStore, PLATFORM_SPECS, PLATFORM_KEYS, PromptLibrary } = require('../js/app.js');

describe('SafeStore (almacenamiento resistente)', () => {
  beforeEach(() => {
    localStorage.clear();
    SafeStore._ok = null; // re-detectar
    SafeStore._mem = Object.create(null);
  });

  test('available() detecta localStorage funcional', () => {
    expect(SafeStore.available()).toBe(true);
  });

  test('set/get round-trip persiste en localStorage', () => {
    SafeStore.set('k1', 'valor-1');
    expect(SafeStore.get('k1')).toBe('valor-1');
    expect(localStorage.getItem('k1')).toBe('valor-1');
  });

  test('get de clave inexistente devuelve null', () => {
    expect(SafeStore.get('no-existe')).toBeNull();
  });

  test('si localStorage está bloqueado usa fallback en memoria', () => {
    SafeStore._ok = false; // simular Brave Shields / modo privado
    SafeStore.set('k2', 'valor-mem');
    expect(localStorage.getItem('k2')).toBeNull();
    expect(SafeStore.get('k2')).toBe('valor-mem');
  });
});

describe('Helpers puros de PromptLibrary', () => {
  const lib = PromptLibrary.prototype;

  test('esc() escapa HTML peligroso', () => {
    expect(lib.esc('<img src=x onerror=alert(1)>')).toBe('&lt;img src=x onerror=alert(1)&gt;');
    expect(lib.esc('a"b\'c&d')).toBe('a&quot;b&#39;c&amp;d');
  });

  test('wordCount() cuenta palabras', () => {
    expect(lib.wordCount('uno dos tres')).toBe(3);
    expect(lib.wordCount('  espacios   multiples  ')).toBe(2);
    expect(lib.wordCount('')).toBe(0);
  });

  test('renderPrompt() escapa y luego resalta variables $x$', () => {
    const out = lib.renderPrompt('Usa $variable$ y $$formula$$ con <script>');
    expect(out).not.toContain('<script>');
    expect(out).toContain('&lt;script&gt;');
    expect(out).toContain('<span class="var">variable</span>');
    expect(out).toContain('<span class="var var-block">formula</span>');
  });
});

describe('PLATFORM_SPECS (directiva multiplataforma)', () => {
  test('las 5 plataformas tienen label, spec, icon y short', () => {
    expect(PLATFORM_KEYS).toEqual(['web', 'android', 'ios', 'tablet', 'windows']);
    for (const k of PLATFORM_KEYS) {
      const s = PLATFORM_SPECS[k];
      expect(typeof s.label).toBe('string');
      expect(s.spec.length).toBeGreaterThan(20);
      expect(typeof s.icon).toBe('string');
      expect(typeof s.short).toBe('string');
    }
  });
});
