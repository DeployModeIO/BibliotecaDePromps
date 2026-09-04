/* Inventario de la biblioteca de prompts (workplan del upgrade). */
const fs = require('fs');
const vm = require('vm');

const files = [
  ['js/prompts-data.js', 'PROMPTS_DB'],
  ['js/prompts-data-extra.js', 'PROMPTS_DB_EXTRA'],
  ['js/prompts-data-v2.js', 'PROMPTS_DB_V2'],
  ['js/prompts-data-fullstack.js', 'PROMPTS_DB_FULLSTACK'],
];

let total = 0;
for (const [f, varName] of files) {
  const code = fs.readFileSync(f, 'utf8');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(code + '\n; globalThis.__DB = (typeof ' + varName + ' !== "undefined" ? ' + varName + ' : null);', ctx);
  const db = ctx.__DB;
  if (!db) {
    console.log(f + ' -> NO DB');
    continue;
  }
  const rows = [];
  for (const cat of db.categorias || []) {
    for (const sub of cat.subcategorias || []) {
      for (const p of sub.prompts || []) {
        rows.push({
          id: p.id,
          titulo: p.titulo,
          cat: cat.nombre,
          sub: sub.nombre,
          palabras: (p.prompt || '').split(/\s+/).filter(Boolean).length,
        });
      }
    }
  }
  total += rows.length;
  console.log('\n## ' + f + ' (' + rows.length + ' prompts)');
  for (const r of rows) console.log(`- [${r.id}] ${r.titulo} — ${r.palabras} palabras [${r.cat} / ${r.sub}]`);
}
console.log('\nTOTAL PROMPTS: ' + total);
