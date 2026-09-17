const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
let src = fs.readFileSync(filePath, 'utf8');

// Strip BOM
if (src.charCodeAt(0) === 0xfeff) src = src.substring(1);

console.log('Source length:', src.length);

// Extract array boundaries
let startBracket = src.indexOf('[');
let endSemiColon = src.lastIndexOf('};');
let rawContent = src.substring(startBracket + 1, endSemiColon);
console.log('Raw content length:', rawContent.length);

// State machine: track when inside quoted strings
let out = '';
let inStr = false;
let i = 0;

while (i < rawContent.length) {
  const ch = rawContent[i];

  if (ch === '"') {
    // Count preceding backslashes
    let bs = 0;
    let k = i - 1;
    while (k >= 0 && rawContent[k] === '\\') {
      bs++;
      k--;
    }

    if (bs % 2 === 1) {
      // Escaped quote - keep both chars
      out += '\\';
      out += '"';
      i++;
      continue;
    }

    // Unescaped quote - toggle state
    inStr = !inStr;
    out += '"';
  } else if (ch === '\\\\') {
    // Backslash - check if followed by special escape
    out += '\\\\';
  } else if (inStr && ch.charCodeAt(0) < 32) {
    // Control char inside string - escape
    if (ch === '\\n') {
      out += '\\n';
    } else if (ch === '\\r') {
      out += '\\n';
    } else if (ch === '\\t') {
      out += '\\t';
    } else {
      out += '\\\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0');
    }
  } else {
    out += ch;
  }

  i++;
}

console.log('Output length:', out.length);
try {
  const data = JSON.parse('{"categorias":' + out + '}');
  console.log('Parsed! Categories:', data.categorias.length);
  let total = 0;
  data.categorias.forEach(function (c) {
    c.subcategorias.forEach(function (s) {
      total += s.prompts.length;
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
  ].join('\\n');

  fs.writeFileSync(filePath, header, 'utf8');
  console.log('Done! Size:', fs.statSync(filePath).size, 'bytes');
} catch (e) {
  console.error('Parse error:', e.message.substring(0, 200));
  process.exit(1);
}
