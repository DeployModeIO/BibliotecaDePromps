const fs = require('fs');
const filePath = 'D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js';
let src = fs.readFileSync(filePath, 'utf8');
if (src.charCodeAt(0) === 0xfeff) src = src.substring(1);

// Extract just the array content
let sb = src.indexOf('[');
let es = src.lastIndexOf('};');
let raw = src.substring(sb + 1, es);

// Apply transformation with DETAILED logging for first 100 quotes
let out = '';
let inStr = false;
let toggleCount = 0;
let i = 0;

while (i < raw.length) {
  const ch = raw[i];

  if (ch === '"') {
    let bs = 0,
      k = i - 1;
    while (k >= 0 && raw[k] === '\\') {
      bs++;
      k--;
    }

    if (bs % 2 === 1) {
      out += '"';
      i++;
      continue;
    }

    inStr = !inStr;
    toggleCount++;

    // Log first 100 toggles
    if (toggleCount <= 100) {
      console.log(`Toggle #${toggleCount}: pos=${i}, entering_str=${inStr}, ctx=[${raw.substring(Math.max(0, i - 20), i + 30)}]`);
    }

    out += '"';
  } else if (inStr && ch.charCodeAt(0) < 32) {
    if (ch === '\n' || ch === '\r') out += '\\n';
    else if (ch === '\t') out += '\\t';
    else out += '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0');
  } else {
    out += ch;
  }

  i++;
}

console.log('---');
console.log('Final state:', toggleCount, 'toggles, inStr=' + inStr);
console.log('Quotes processed:', toggleCount, '(should equal 2834 / 2 = 1417 toggles for balanced structure)');

// Now check: does OUT have even number of unescaped quotes?
let oq = 0;
for (let p = 0; p < out.length; p++) {
  if (out[p] === '"') {
    let bsc = 0,
      jq = p - 1;
    while (jq >= 0 && out[jq] === '\\') {
      bsc++;
      jq--;
    }
    if (bsc % 2 === 0) oq++;
  }
}
console.log('Output quotes:', oq, '(should be even)');

// Try parsing
try {
  const data = JSON.parse('{"categorias":' + out + '}');
  console.log('PARSED OK!');
  console.log('Categories:', data.categorias.length);
} catch (e) {
  console.error('Parse error:', e.message.substring(0, 150));
}
