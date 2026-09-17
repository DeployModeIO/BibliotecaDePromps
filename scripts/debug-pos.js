const fs = require('fs');
const c = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/scripts/fix-v2.js', 'utf8');
// This wont work - we need to reconstruct the result. Instead lets modify fix-v2.js

console.log('Modifying approach...');

// Run the transformation inline
const filePath = 'D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js';
let file = fs.readFileSync(filePath, 'utf8');
if (file.charCodeAt(0) === 0xfeff) file = file.substring(1);
file = file.replace(/\\\\u\{([0-9A-Fa-f]{4,6})\}/g, function (m, hex) {
  return String.fromCodePoint(parseInt(hex, 16));
});

const rawJson = file.substring(224, 87697); // CAT_IDX+1 to END_IDX

let result = '';
let quoteDepth = 0;

for (let i = 0; i < rawJson.length; i++) {
  const ch = rawJson[i];
  if (ch === '"') {
    let bs = 0,
      k = i - 1;
    while (k >= 0 && rawJson[k] === '\\') {
      bs++;
      k--;
    }
    if (bs % 2 === 1) continue;
    quoteDepth++;
    result += ch;
  } else if (quoteDepth % 2 === 1 && (ch === '\n' || ch === '\r')) {
    result += '\\n';
  } else if (ch === '\t' && quoteDepth % 2 === 1) {
    result += '\\t';
  } else {
    result += ch;
  }
}

// Check position 9963
const pos = 9963;
console.log('Char at 9963:', JSON.stringify(result[pos]));
console.log('Context around 9963:', JSON.stringify(result.substring(Math.max(0, pos - 50), pos + 60)));

// Count quotes before 9963 to understand string state
let qd = 0;
let escaped = false;
for (let i = 0; i < Math.min(pos, rawJson.length); i++) {
  const ch = rawJson[i];
  if (ch === '\\') {
    escaped = !escaped;
    continue;
  }
  if (ch === '"' && !escaped) {
    qd++;
  }
  escaped = false;
}
console.log('Quote depth at 9963:', qd, 'even/odd:', qd % 2);
