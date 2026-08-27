// Generador de prompts-data-universal.js (FULL DEFINITIVA v4.0)
// Contiene todas las categorias no-industriales. Backticks => saltos reales validos.
// Se serializa con JSON.stringify para garantizar JS valido en el archivo final.
const fs = require('fs');
const path = require('path');

function P(id, titulo, categoria, prioridad, uso, tags, skills, herramientas, prompt) {
  return { id, titulo, categoria, prioridad, uso, tags, skills, herramientas, prompt };
}

const categorias = [__CATEGORIAS__];

const data = { categorias };

const header = `/* ============================================================
   BIBLIOTECA DE MEGA-PROMPS — PROMPTS DATA UNIVERSAL v4.0 (FULL DEFINITIVA)
   Temas no-industriales: salud, finanzas, educacion, legal, marketing,
   rrhh, logistica, agro, retail, turismo, construccion, manufactura,
   datos/IA, ciberseguridad, deportes y mas.
   Cada prompt incluye skills, herramientas y diseno de ultima generacion.
   GENERADO por scripts/gen-universal.js
   ============================================================ */

const PROMPTS_DB_UNIVERSAL = `;

const body = JSON.stringify(data, null, 2);
const outPath = path.join(__dirname, '..', 'js', 'prompts-data-universal.js');
fs.writeFileSync(outPath, header + body + ';\n', 'utf8');

let n = 0;
categorias.forEach((c) => c.subcategorias.forEach((s) => s.prompts.forEach(() => n++)));
console.log('OK:', categorias.length, 'categorias,', n, 'prompts');
