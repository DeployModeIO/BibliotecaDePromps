const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
let c = fs.readFileSync(filePath, 'utf8');

// Strip BOM
if (c.charCodeAt(0) === 0xfeff) {
  c = c.substring(1);
}

console.log('File length:', c.length);
console.log('First line:', JSON.stringify(c.split('\n')[0]));

// Step 1: Identify all unescaped \u{HEX} patterns and replace with actual emoji
// These appear as \\u{XXXX} in the source (since they were double-escaped)
c = c.replace(/\\\\u\{([0-9A-Fa-f]{4,6})\}/g, function (m, hex) {
  return String.fromCodePoint(parseInt(hex, 16));
});

// Step 2: Find all occurrences of raw control characters in the file
// Replace them by joining continuation lines inside strings
// Strategy: read entire content, find unmatched quotes, join their spans

const lines = c.split('\n');
console.log('Total lines:', lines.length);

// Count total unescaped quotes
let quoteCount = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let bs = 0;
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '\\' && j > 0 && line[j - 1] === '\\') bs++;
    if (line[j] === '"') quoteCount++;
  }
}
console.log('Quote count:', quoteCount, '(should be even)');

// Step 3: Build output by tracking quote depth
// When we cross from even to odd depth, we enter a string
// When we cross from odd to even, we exit a string
// Between entry and exit, newlines become \\n
let result = '';
let inStr = false;
let buf = []; // buffer chars for current string segment

function flushBuffer() {
  // Join buffered characters, replacing real newlines with \\n
  let joined = buf.join('');
  // Also fix any embedded control chars
  joined = joined.replace(/[\r\t]/g, '\\\\t');
  result += joined;
  buf = [];
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  for (let j = 0; j < line.length; j++) {
    const ch = line[j];

    if (ch === '"') {
      // Check if this quote is escaped by preceding backslash
      let bs = 0;
      let k = j - 1;
      while (k >= 0 && line[k] === '\\') {
        bs++;
        k--;
      }

      if (bs % 2 === 1) {
        // Escaped quote, pass through
        buf.push(ch);
        continue;
      }

      // Toggle string mode
      inStr = !inStr;
      buf.push(ch);
    } else {
      buf.push(ch);
    }
  }

  // End of line - add newline handling
  if (i < lines.length - 1) {
    if (inStr) {
      // Inside string: convert newline to \\n escape sequence
      // We need to keep it as two chars: backslash + n
      buf.push('\\\\n');
    } else {
      // Outside string: keep actual newline for formatting
      buf.push('\\n');
    }
  }
}

c = result;

// Now try parsing
try {
  // Extract the object
  const arrIdx = c.indexOf('[');
  const semiIdx = c.lastIndexOf('};');
  let jsonOnly = '{' + c.substring(arrIdx, semiIdx + 2) + '}';

  console.log('Extracted JSON length:', jsonOnly.length);

  const data = JSON.parse(jsonOnly);
  console.log('Parsed! Categories:', data.categorias.length);

  let total = 0;
  data.categorias.forEach(function (cat) {
    cat.subcategorias.forEach(function (sub) {
      total += sub.prompts.length;
    });
  });
  console.log('Total prompts:', total);

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
  console.log('Done! Size:', fs.statSync(filePath).size, 'bytes');
} catch (e) {
  console.error('Parse error:', e.message.substring(0, 200));
  const m = e.message.match(/position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Context:', JSON.stringify(c.substring(Math.max(0, pos - 50), pos + 60)));
  }
}
