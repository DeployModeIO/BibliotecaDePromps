const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
let c = fs.readFileSync(filePath, 'utf8');

// Strip BOM
if (c.charCodeAt(0) === 0xfeff) {
  console.log('BOM stripped');
  c = c.substring(1);
}

// Fix \u{HEX} patterns
c = c.replace(/\\\\u\{([0-9A-Fa-f]{4,6})\}/g, function (m, hex) {
  return String.fromCodePoint(parseInt(hex, 16));
});

console.log(
  'First 3 lines:',
  c
    .split('\n')
    .slice(0, 3)
    .map((l) => JSON.stringify(l))
    .join(' | ')
);

// Try using vm to evaluate the JS
try {
  const sandbox = { PROMPTS_DB_INDUSTRIES: null };

  // Replace the var/const declaration so we can extract the variable from sandbox
  let evalCode = c;
  // Remove comment block
  evalCode = evalCode.replace(/\/\*[\s\S]*?\*\//, '');

  // Wrap in function to avoid global scope pollution
  const wrapped = "(function() { 'use strict'; " + evalCode + '; return PROMPTS_DB_INDUSTRIES; })()';

  const data = vm.runInNewContext(wrapped, sandbox, { filename: 'rebuild' });

  if (!data || !data.categorias) {
    throw new Error('No categorias found in result');
  }

  console.log('VM SUCCESS! Categories:', data.categorias.length);

  let total = 0;
  data.categorias.forEach(function (cat) {
    cat.subcategorias.forEach(function (sub) {
      total += sub.prompts.length;
    });
  });
  console.log('Total prompts:', total);

  // Validate
  for (let i = 0; i < data.categorias.length; i++) {
    if (!data.categorias[i].id || !Array.isArray(data.categorias[i].subcategorias)) {
      throw new Error('Invalid category at ' + i);
    }
  }
  console.log('Validation passed!');

  // Rebuild with proper formatting
  const fmt = JSON.stringify(data, null, 2);
  const header = [
    '/* ============================================================',
    '   BIBLIOTECA DE PROMPS - DATA INDUSTRIAS UNIVERSALES v5.0',
    '   Generado autom\xe1ticamente con validaci\xf3n JSON completa',
    '   ============================================================ */',
    '',
    'const PROMPTS_DB_INDUSTRIES = ',
    fmt,
    ';',
  ].join('\n');

  fs.writeFileSync(filePath, header, 'utf8');
  console.log('REBUILD COMPLETE! Size:', fs.statSync(filePath).size, 'bytes');
} catch (e) {
  console.error('VM failed:', e.message);

  // Alternative: just validate current state and fix known issues
  console.log('Trying alternative approach...');

  // The raw newlines inside strings make this invalid JSON/JS
  // We MUST escape them. Let us try one more time with corrected state machine

  let startIdx = c.indexOf('"categorias":');
  startIdx = c.indexOf('[', startIdx);
  let endIdx = c.lastIndexOf('};');
  let raw = c.substring(startIdx + 1, endIdx);

  let out = '';
  let inStr = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];

    if (ch === '"') {
      let bsCount = 0,
        j = i - 1;
      while (j >= 0 && raw[j] === '\\') {
        bsCount++;
        j--;
      }

      if (bsCount % 2 === 1) {
        out += ch; // Keep escaped quote
        continue;
      }

      inStr = !inStr;
      out += ch;
    } else if (inStr && ch.charCodeAt(0) < 32) {
      if (ch === '\n' || ch === '\r') out += '\\n';
      else if (ch === '\t') out += '\\t';
      else out += '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0');
    } else {
      out += ch;
    }
  }

  try {
    const data = JSON.parse('{"categorias":' + out + '}');
    console.log('Alt parse OK! Categories:', data.categorias.length);

    let total = 0;
    data.categorias.forEach(function (cat) {
      cat.subcategorias.forEach(function (sub) {
        total += sub.prompts.length;
      });
    });
    console.log('Total prompts:', total);

    const fmt = JSON.stringify(data, null, 2);
    const header = [
      '/* ============================================================',
      '   BIBLIOTECA DE PROMPS - DATA INDUSTRIAS UNIVERSALES v5.0',
      '   Generado autom\xe1ticamente con validaci\xf3n JSON completa',
      '   ============================================================ */',
      '',
      'const PROMPTS_DB_INDUSTRIES = ',
      fmt,
      ';',
    ].join('\n');

    fs.writeFileSync(filePath, header, 'utf8');
    console.log('Alt REBUILD OK! Size:', fs.statSync(filePath).size, 'bytes');
  } catch (e2) {
    console.error('Alt also failed:', e2.message.substring(0, 150));
    process.exit(1);
  }
}
