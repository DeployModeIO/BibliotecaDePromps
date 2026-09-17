/**
 * CONTRATO DEL DASHBOARD DE BÚSQUEDA
 * ---------------------------------------------------------------
 * Test estático (fs + regex, determinista) que protege las invariantes
 * de UX del dashboard: hero de búsqueda, command palette accesible,
 * chips de filtro por fuente y el CSS que las sostiene.
 *
 * Se centra en el CONTRATO markup <-> JS <-> CSS: si alguien renombra
 * un id, elimina una clase o rompe el cableado, este test falla.
 */
'use strict';
/* global __dirname */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const html = read('index.html');
const appJs = read('js/app.js');
const css = read('css/styles.css');

describe('Dashboard de búsqueda — markup', () => {
  test('existe el hero de búsqueda con su input', () => {
    expect(html).toMatch(/class="search-hero/);
    expect(html).toMatch(/id="searchInput"/);
  });

  test('existe el disparador de la paleta (⌘K) accesible', () => {
    expect(html).toMatch(/id="paletteTrigger"/);
    expect(html).toMatch(/aria-label/i);
  });

  test('la paleta tiene overlay, input, contador y lista', () => {
    expect(html).toMatch(/id="paletteOverlay"/);
    expect(html).toMatch(/id="paletteInput"/);
    expect(html).toMatch(/id="paletteCount"/);
    expect(html).toMatch(/id="paletteList"/);
  });

  test('la lista de resultados usa semántica ARIA de combobox/listbox', () => {
    expect(html).toMatch(/role="listbox"/);
    expect(html).toMatch(/aria-live/);
  });

  test('hay chips de filtro por fuente para las 2 nuevas fuentes', () => {
    expect(html).toMatch(/data-source="prompts\.chat"/);
    expect(html).toMatch(/data-source="awesome-gpt4o-images"/);
  });

  test('los módulos de datos nuevos se cargan antes de app.js', () => {
    const iCommunity = html.indexOf('prompts-data-community.js');
    const iGpt4o = html.indexOf('prompts-data-gpt4o.js');
    const iApp = html.indexOf('js/app.js');
    expect(iCommunity).toBeGreaterThan(-1);
    expect(iGpt4o).toBeGreaterThan(-1);
    expect(iCommunity).toBeLessThan(iApp);
    expect(iGpt4o).toBeLessThan(iApp);
  });

  test('la leyenda de la paleta anuncia ⇧F (no un F engañoso)', () => {
    // markup real: dos <kbd> separados (<kbd>⇧</kbd><kbd>F</kbd> favorito)
    expect(html).toMatch(/<kbd>⇧<\/kbd>\s*<kbd>F<\/kbd>\s*favorito/);
    // Invariante: NINGÚN <kbd>F</kbd> aparece "desnudo" en el documento — todo F
    // prometido va precedido de ⇧, porque F simple chocaría al teclear en el buscador.
    const bareFs = (html.match(/<kbd>F<\/kbd>/g) || []).length;
    const shiftedFs = (html.match(/<kbd>⇧<\/kbd>\s*<kbd>F<\/kbd>/g) || []).length;
    expect(bareFs).toBeGreaterThan(0);
    expect(shiftedFs).toBe(bareFs);
  });
});

describe('Dashboard de búsqueda — cableado JS', () => {
  const methods = [
    'buildSearchDocs',
    'initPalette',
    'openPalette',
    'closePalette',
    'renderPalette',
    'onPaletteKeydown',
    'paletteActivate',
    'togglePaletteFav',
    'setPaletteCount',
  ];

  test.each(methods)('el método %s está definido', (m) => {
    expect(appJs).toMatch(new RegExp('^\\s{2}' + m + '\\s*\\(', 'm'));
  });

  test('initPalette() se invoca durante el arranque', () => {
    expect(appJs).toMatch(/this\.initPalette\(\)/);
  });

  test('buildSearchDocs() se invoca al construir la instancia', () => {
    expect(appJs).toMatch(/this\.buildSearchDocs\(\)/);
  });

  test('Ctrl+K abre la paleta', () => {
    expect(appJs).toMatch(/key === 'k'/);
    expect(appJs).toMatch(/this\.openPalette\(\)/);
  });

  test('⇧F alterna favorito sin chocar con escribir', () => {
    expect(appJs).toMatch(/this\.togglePaletteFav\(/);
  });

  test('_sourceLabel reconoce las dos fuentes nuevas', () => {
    expect(appJs).toMatch(/prompts\.chat/);
    expect(appJs).toMatch(/awesome-gpt4o-images/);
  });

  test('app.js exporta PromptLibrary para los tests', () => {
    expect(appJs).toMatch(/module\.exports/);
    expect(appJs).toMatch(/PromptLibrary/);
  });
});

describe('Dashboard de búsqueda — CSS', () => {
  test.each([
    ['.search-hero', '\\.search-hero'],
    ['.palette-overlay', '\\.palette-overlay'],
    ['.prow (fila de resultado)', '\\.prow\\b'],
    ['.prow-fav (estrella)', '\\.prow-fav'],
    ['.psug (chips de sugerencia)', '\\.psug'],
  ])('%s existe en css/styles.css', (_label, re) => {
    expect(css).toMatch(new RegExp(re));
  });

  test('el estado favorito tiene estilo propio', () => {
    expect(css).toMatch(/\.prow-fav\.is-fav/);
  });
});

describe('Accesibilidad del dashboard', () => {
  test('el input de la paleta declara su propósito', () => {
    const seg = html.slice(html.indexOf('id="paletteInput"') - 400, html.indexOf('id="paletteInput"') + 400);
    expect(seg).toMatch(/aria-label|placeholder|id="paletteLabel"/i);
  });

  test('la paleta se declara diálogo modal', () => {
    const seg = html.slice(html.indexOf('id="paletteOverlay"') - 300, html.indexOf('id="paletteOverlay"') + 500);
    expect(seg).toMatch(/role="dialog"|aria-modal/);
  });

  test('existe skip-link para navegación por teclado', () => {
    expect(html).toMatch(/class="skip-link"/);
  });
});
