const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
const c = fs.readFileSync(filePath, 'utf8');

// Use Node's built-in JS engine to parse the file - this handles all escaping correctly
let data;
try {
  // Evaluate the const declaration in a sandbox
  data = vm.runInNewContext(c, {}, { filename: 'rebuild' });
  console.log('VM parsed OK!');
} catch (e) {
  console.error('VM failed:', e.message.substring(0, 150));

  // Fallback: extract JSON portion with regex and clean it up
  try {
    // Find start of array after "categorias":
    const idx = c.indexOf('[{');
    if (idx < 0) throw new Error('No array found');

    // Find end marker };
    const semi = c.lastIndexOf('};');
    if (semi < idx) throw new Error('No end found');

    let raw = c.substring(idx + 1, semi);

    // Replace all actual newline characters inside strings with \n escape
    // We do this by finding string values via regex matching
    raw = raw.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"(\s*:\s*)?(?=[,\r\n\]}])/g, function (match, content, colon) {
      // This won't work perfectly for nested structures, try different approach
      return match;
    });

    // Simpler: replace ALL newlines/tabs with \n everywhere, then fix structure
    // Actually just join lines preserving quote-bounded content

    const lines = raw.split('\n').map((l) => l.trim());
    const flat = lines.filter((l) => l.length > 0).join(' ');

    // Now we should have single-line JSON but newlines INSIDE strings are still escaped as literal \n (two chars)
    // These need to stay as \\n (escaped backslash-n in JSON), not become actual newlines
    // Since they're already two chars \ and n, they're fine

    data = JSON.parse('{"categorias":' + flat + '}');
    console.log('Fallback parse OK!');
  } catch (e2) {
    console.error('Fallback failed too:', e2.message.substring(0, 150));
    process.exit(1);
  }
}

console.log('Categories:', data.categorias.length);

let total = 0;
data.categorias.forEach((cat) => {
  cat.subcategorias.forEach((sub) => {
    total += sub.prompts.length;
  });
});
console.log('Total prompts:', total);

// Validate structure
for (const cat of data.categorias) {
  if (!cat.id || !cat.nombre) throw new Error(`Bad category ${cat.id}`);
  for (const sub of cat.subcategorias) {
    if (!sub.id || !Array.isArray(sub.prompts)) throw new Error(`Bad sub in ${cat.id}`);
  }
}
console.log('Structure valid!');

// Rebuild with proper JSON serialization (eliminates all encoding issues)
const formatted = JSON.stringify(data, null, 2);
const header = [
  '/* ============================================================',
  '   BIBLIOTECA DE PROMPS - DATA INDUSTRIAS UNIVERSALES v5.0',
  '   Generado autom\xe1ticamente con validaci\xf3n JSON completa',
  '   ============================================================ */',
  '',
  'const PROMPTS_DB_INDUSTRIES = ',
  formatted,
  ';',
].join('\n');

fs.writeFileSync(filePath, header, 'utf8');
console.log('Done! Size:', fs.statSync(filePath).size, 'bytes');
