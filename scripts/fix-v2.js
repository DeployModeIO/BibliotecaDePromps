const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
let c = fs.readFileSync(filePath, 'utf8');

// Strip BOM
if (c.charCodeAt(0) === 0xfeff) {
  c = c.substring(1);
}

// Fix any remaining double-escaped unicode patterns
c = c.replace(/\\\\u\{([0-9A-Fa-f]{4,6})\}/g, function (m, hex) {
  return String.fromCodePoint(parseInt(hex, 16));
});

// Known boundaries from inspection
const CAT_IDX = 223; // Position of "[" in "\"categorias\": ["
const END_IDX = 87697; // Position of "}" before ";" at end

// Extract the JSON content between [ and };
let rawJson = c.substring(CAT_IDX + 1, END_IDX);

// Transform: replace raw newlines inside string values with \n escape sequence
// We track quote depth to know if we are inside a string
let result = '';
let quoteDepth = 0;

for (let i = 0; i < rawJson.length; i++) {
  const ch = rawJson[i];

  if (ch === '"') {
    // Count preceding backslashes
    let bs = 0;
    let k = i - 1;
    while (k >= 0 && rawJson[k] === '\\') {
      bs++;
      k--;
    }

    if (bs % 2 === 1) {
      // Escaped quote - skip it (do not add to result)
      continue;
    }

    // Toggle quote depth
    quoteDepth++;
    result += ch;
  } else if (quoteDepth % 2 === 1 && (ch === '\n' || ch === '\r')) {
    // Inside string, newline found - escape it
    result += '\\n';
  } else if (ch === '\t' && quoteDepth % 2 === 1) {
    // Inside string, tab - escape it
    result += '\\t';
  } else {
    // Outside string or regular char - just append
    result += ch;
  }
}

console.log('Transformed. Result length:', result.length);

try {
  const data = JSON.parse('{"categorias":' + result + '}');
  console.log('Parsed! Categories:', data.categorias.length);

  let total = 0;
  data.categorias.forEach(function (cat) {
    cat.subcategorias.forEach(function (sub) {
      total += sub.prompts.length;
    });
  });
  console.log('Total prompts:', total);

  // Validate
  for (let i = 0; i < data.categorias.length; i++) {
    var cat = data.categorias[i];
    if (!cat.id) throw new Error('Bad category at ' + i);
    for (let j = 0; j < cat.subcategorias.length; j++) {
      if (!cat.subcategorias[j].id) throw new Error('Bad sub at ' + i + ',' + j);
    }
  }
  console.log('Validation OK!');

  // Rebuild file
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
  console.log('Done! Size:', fs.statSync(filePath).size, 'bytes');
} catch (e) {
  console.error('Parse error:', e.message.substring(0, 200));
  const m = e.message.match(/position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Context:', JSON.stringify(result.substring(Math.max(0, pos - 50), pos + 60)));

    // Show control characters around error
    for (let i = Math.max(0, pos - 50); i < Math.min(pos + 60, result.length); i++) {
      if (result[i].charCodeAt(0) < 32 || result[i].charCodeAt(0) > 126) {
        console.log('Non-ASCII/control at offset ' + (i - (pos - 50)) + ': code ' + result[i].charCodeAt(0));
      }
    }
  }
}
