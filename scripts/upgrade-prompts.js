/* ============================================================
   UPGRADE DE PROMPTS v4 — Reescritura a fondo de los 80 prompts.
   Por cada prompt:
   1) Cambia el entregable "un solo archivo HTML" -> app completa multi-archivo.
   2) Inyecta bloque de CALIDAD UI/UX (HMI industrial o producto moderno).
   3) Inyecta bloque de ARQUITECTURA/ENTREGA (production-ready, no demo).
   Idempotente (marca de upgrade). Con backup automático.

   Uso:
     node scripts/upgrade-prompts.js --preview <id>   # muestra antes/después sin escribir
     node scripts/upgrade-prompts.js --apply          # aplica a los 4 archivos
   ============================================================ */
'use strict';

const fs = require('fs');
const vm = require('vm');

const MARKER = 'CALIDAD UI/UX PRODUCTION-GRADE';

const FILES = [
  ['js/prompts-data.js', 'PROMPTS_DB', 'industrial'],
  ['js/prompts-data-extra.js', 'PROMPTS_DB_EXTRA', 'industrial'],
  ['js/prompts-data-v2.js', 'PROMPTS_DB_V2', 'industrial'],
  ['js/prompts-data-fullstack.js', 'PROMPTS_DB_FULLSTACK', 'saas'],
];

const ARCH_BLOCK = [
  '## ARQUITECTURA Y ENTREGA (APP COMPLETA Y COMPLEJA)',
  '- NO entregues un único archivo HTML. Entrega un PROYECTO COMPLETO multi-archivo con estructura profesional (ej: index.html + css/ + js/ + assets/, o un proyecto con framework y build).',
  '- Según el dominio, incluye backend + base de datos + API (full-stack) con persistencia real, autenticación y autorización.',
  '- Incluye gestión de estado, validación de datos, manejo de errores, seguridad (sanitización de entradas, control de acceso), README con instrucciones de ejecución y datos de prueba precargados.',
  '- El resultado debe ser PRODUCTION-READY (no un demo): listo para compilar, desplegar y usar en producción.',
].join('\n');

const UIUX_INDUSTRIAL = [
  '## ' + MARKER + ' (HMI / SCADA INDUSTRIAL)',
  '1. ACCESIBILIDAD: contraste >= 4.5:1, iconos siempre con etiqueta de texto, navegación completa por teclado, foco visible, aria en tablas/gráficos/modales, alt text en diagramas.',
  '2. TÁCTIL / CAMPO: objetivos >= 44x44px, espaciado >= 8px, usable con guantes, feedback de carga en cada acción, offline-first (PWA + IndexedDB).',
  '3. RENDIMIENTO: virtualiza listas/tablas grandes, lazy loading de módulos, gráficos Canvas eficientes, CLS < 0.1.',
  '4. ESTILO HMI/SCADA: paleta oscura industrial coherente, iconos SVG monocromos (no emojis), densidad alta pero jerarquizada.',
  '5. RESPONSIVE: mobile-first, breakpoints para tablets de campo (Toughbook/iPad), sin scroll horizontal, contenedores fluidos, zoom no deshabilitado.',
  '6. TIPOGRAFÍA Y COLOR: base 16px, line-height 1.5, mono para valores numéricos/tags, tokens semánticos (--ok/--warn/--err/--info) — NUNCA hex sueltos, sin gris-sobre-gris.',
  '7. ALARMAS: usar color + icono + texto (nunca solo color), prioridad visual por criticidad.',
  '8. FORMULARIOS: labels visibles, validación inline junto al campo, errores con instrucción, progressive disclosure.',
  '9. NAVEGACIÓN: jerarquía clara, back predecible, nav inferior <= 5 ítems en móvil, deep-linking.',
  '10. GRÁFICOS: leyendas, tooltips, ejes etiquetados, colores accesibles.',
].join('\n');

const UIUX_SAAS = [
  '## ' + MARKER + ' (PRODUCTO DIGITAL MODERNO)',
  '1. ACCESIBILIDAD: WCAG 2.2 AA, contraste >= 4.5:1, foco visible, navegación por teclado, aria-labels, alt text, sin iconos sin etiqueta.',
  '2. TÁCTIL: objetivos >= 44x44px, espaciado >= 8px, skeletons/spinners de carga, estados hover Y focus.',
  '3. RENDIMIENTO: imágenes WebP/AVIF, lazy loading, code-splitting, CLS < 0.1, LCP < 2.5s.',
  '4. ESTILO: design system coherente con tokens, iconos SVG, tipografía y color alineados al tipo de producto.',
  '5. RESPONSIVE: mobile-first, sin scroll horizontal, contenedores fluidos, zoom permitido.',
  '6. TIPOGRAFÍA Y COLOR: base 16px, line-height 1.5, tokens semánticos, sin hex sueltos, sin gris-sobre-gris.',
  '7. ANIMACIÓN: transiciones contextuales 150-300ms, soporta prefers-reduced-motion, no animar width/height.',
  '8. FORMULARIOS: labels visibles, validación inline, errores junto al campo, progressive disclosure.',
  '9. NAVEGACIÓN: back predecible, nav móvil <= 5 ítems, deep-linking, breadcrumbs en jerarquías profundas.',
  '10. DATOS/GRÁFICOS: leyendas, tooltips, colores accesibles, tablas responsive.',
].join('\n');

const UIUX_BY_DOMAIN = { industrial: UIUX_INDUSTRIAL, saas: UIUX_SAAS };

/* ---------- Transformación de un prompt ---------- */

function upgradePrompt(text, domain) {
  if (typeof text !== 'string') return text;
  if (text.includes(MARKER)) return text;

  let t = text;

  t = t.replace(
    /en un solo archivo HTML\/CSS\/JavaScript \(Vanilla ES2024, sin frameworks ni dependencias externas de backend\)/gi,
    'como aplicación web completa y compleja (multi-archivo, arquitectura limpia, backend y persistencia cuando corresponda)'
  );
  t = t.replace(/en un único archivo HTML\/CSS\/JavaScript/gi, 'como aplicación completa multi-archivo');
  t = t.replace(/en un solo archivo HTML\/CSS\/JavaScript/gi, 'como aplicación completa multi-archivo');
  t = t.replace(/en un único archivo HTML/gi, 'como aplicación completa multi-archivo');
  t = t.replace(/un solo archivo HTML/gi, 'una aplicación completa multi-archivo');
  t = t.replace(/único archivo HTML/gi, 'una aplicación completa multi-archivo');
  t = t.replace(/single file/gi, 'complete multi-file application');

  const domainBlock = UIUX_BY_DOMAIN[domain] || UIUX_SAAS;
  t += '\n\n' + ARCH_BLOCK + '\n\n' + domainBlock;

  return t;
}

/* ---------- Lectura/escritura ---------- */

function loadDb(file, varName) {
  const code = fs.readFileSync(file, 'utf8');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(code + '\n; globalThis.__DB = (typeof ' + varName + ' !== "undefined" ? ' + varName + ' : null);', ctx);
  return { code, header: code.slice(0, code.indexOf('const ' + varName + ' =')), db: ctx.__DB };
}

function transformFile(file, varName, domain) {
  const { code, header, db } = loadDb(file, varName);
  if (!db) throw new Error('No se pudo parsear ' + file);
  let changed = 0;
  for (const cat of db.categorias || []) {
    for (const sub of cat.subcategorias || []) {
      for (const p of sub.prompts || []) {
        const after = upgradePrompt(p.prompt, domain);
        if (after !== p.prompt) {
          p.prompt = after;
          changed++;
        }
      }
    }
  }
  const newCode = header + 'const ' + varName + ' = ' + JSON.stringify(db, null, 2) + ';\n';
  return { file, varName, changed, newCode, code };
}

function findPromptById(id) {
  for (const [file, varName, domain] of FILES) {
    const { db } = loadDb(file, varName);
    if (!db) continue;
    for (const cat of db.categorias || []) {
      for (const sub of cat.subcategorias || []) {
        for (const p of sub.prompts || []) {
          if (p.id === id) return { file, varName, domain, prompt: p };
        }
      }
    }
  }
  return null;
}

/* ---------- CLI ---------- */

const args = process.argv.slice(2);

if (args[0] === '--preview' && args[1]) {
  const found = findPromptById(args[1]);
  if (!found) {
    console.error('Prompt no encontrado: ' + args[1]);
    process.exit(1);
  }
  const after = upgradePrompt(found.prompt.prompt, found.domain);
  console.log('=== ANTES (primeras 900 chars) ===\n' + found.prompt.prompt.slice(0, 900) + '\n');
  console.log('=== DESPUÉS (últimas 1600 chars) ===\n' + after.slice(-1600));
  process.exit(0);
}

if (args[0] === '--apply') {
  const backupDir = 'backup_prompts_v4_' + Date.now();
  fs.mkdirSync(backupDir, { recursive: true });
  let totalChanged = 0;
  for (const [file, varName, domain] of FILES) {
    const { file: f, varName: v, changed, newCode, code } = transformFile(file, varName, domain);
    fs.copyFileSync(f, backupDir + '/' + f.split('/').pop());
    fs.writeFileSync(f, newCode);
    console.log('✓ ' + f + ': ' + changed + ' prompts actualizados');
    totalChanged += changed;
  }
  console.log('\nBackup en: ' + backupDir);
  console.log('TOTAL actualizados: ' + totalChanged);
  process.exit(0);
}

console.log('Uso: node scripts/upgrade-prompts.js --preview <id> | --apply');
