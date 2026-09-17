const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
let c = fs.readFileSync(filePath, 'utf8');

// 1. Strip BOM if present
if (c.charCodeAt(0) === 0xfeff) {
  console.log('Stripping BOM...');
  c = c.substring(1);
}

// 2. Fix any remaining \u{HEX} patterns (double-escaped unicode)
c = c.replace(/\\\\u\{([0-9A-Fa-f]{4,6})\}/g, function (m, hex) {
  return String.fromCodePoint(parseInt(hex, 16));
});
console.log('Fixed unicode escape patterns.');

// 3. Find exact boundaries using indexOf rather than hardcoded values
let startIdx = c.indexOf('"categorias":');
startIdx = c.indexOf('[', startIdx);
let endIdx = c.lastIndexOf('};');

console.log('Array starts at:', startIdx);
console.log('Array ends at:', endIdx);

// Extract content between [ and } before ;
let raw = c.substring(startIdx + 1, endIdx);

// 4. Transform: replace control chars inside strings with JSON escapes
// Use character-by-character state machine
let out = '';
let inStr = false;
for (let i = 0; i < raw.length; i++) {
  const ch = raw[i];

  if (ch === '"') {
    // Count preceding backslashes to detect escaped quotes
    let bsCount = 0;
    let j = i - 1;
    while (j >= 0 && raw[j] === '\\') {
      bsCount++;
      j--;
    }

    // Odd number of backslashes = escaped quote - dont toggle
    if (bsCount % 2 === 1) {
      // Keep both the backslash and quote as-is
      out += ch;
      continue;
    }

    // Unescaped quote - toggle string state
    inStr = !inStr;
    out += ch;
  } else if (inStr && ch.charCodeAt(0) < 32) {
    // Inside string, control character - escape it
    if (ch === '\n') {
      out += '\\n';
    } else if (ch === '\r') {
      out += '\\n'; // Also normalize CRLF/LF to same escape
    } else if (ch === '\t') {
      out += '\\t';
    } else {
      out += '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0');
    }
  } else {
    // Regular char or outside string
    out += ch;
  }
}

console.log('Transformation complete. Output length:', out.length);

// 5. Parse the cleaned JSON
try {
  const data = JSON.parse('{"categorias":' + out + '}');
  console.log('SUCCESS! Categories:', data.categorias.length);

  let total = 0;
  data.categorias.forEach(function (cat) {
    cat.subcategorias.forEach(function (sub) {
      total += sub.prompts.length;
    });
  });
  console.log('Total prompts:', total);

  // Validate structure
  for (let i = 0; i < data.categorias.length; i++) {
    var cat = data.categorias[i];
    if (!cat.id || !cat.nombre || !Array.isArray(cat.subcategorias)) {
      throw new Error('Invalid category at index ' + i);
    }
    for (let j = 0; j < cat.subcategorias.length; j++) {
      var sub = cat.subcategorias[j];
      if (!sub.id || !Array.isArray(sub.prompts)) {
        throw new Error('Invalid subcategory at ' + i + ',' + j);
      }
    }
  }
  console.log('Structure validation PASSED!');

  // 6. Rebuild file with proper JSON.stringify formatting
  const formatted = JSON.stringify(data, null, 2);
  const headerLines = [
    '/* ============================================================',
    '   BIBLIOTECA DE PROMPS - DATA INDUSTRIAS UNIVERSALES v5.0',
    '   Generado autom\xe1ticamente con validaci\xf3n JSON completa',
    '   ============================================================ */',
    '',
    'const PROMPTS_DB_INDUSTRIES = ',
    formatted,
    ';',
  ];
  const output = headerLines.join('\n');

  fs.writeFileSync(filePath, output, 'utf8');
  console.log('REBUILD COMPLETE!');
  console.log('File size:', fs.statSync(filePath).size, 'bytes');
} catch (e) {
  console.error('PARSE FAILED:', e.message);
  const m = e.message.match(/position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Error context:', JSON.stringify(out.substring(Math.max(0, pos - 60), pos + 60)));

    // Show all non-printable chars around error
    for (let i = Math.max(0, pos - 80); i < Math.min(pos + 80, out.length); i++) {
      const code = out[i].charCodeAt(0);
      if (code < 32 || code > 126) {
        console.log('Non-printable at offset', i - pos, ': charCode', code);
      }
    }
  }
  process.exit(1);
}
