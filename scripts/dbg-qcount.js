const fs = require('fs');
let c = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', 'utf8');
if (c.charCodeAt(0) === 0xfeff) c = c.substring(1);

// Strip comments and const declaration for quote counting
c = c.replace(/\/\*[\s\S]*?\*\//g, '');
c = c.replace(/^const PROMPTS_DB_INDUSTRIES\s*=\s*/i, '');

let totalQuotes = 0;
let unescaped = 0;
for (let i = 0; i < c.length; i++) {
  if (c[i] === '"') {
    totalQuotes++;
    let bs = 0,
      j = i - 1;
    while (j >= 0 && c[j] === '\\') {
      bs++;
      j--;
    }
    if (bs % 2 === 0) unescaped++;
  }
}
console.log('Total quotes:', totalQuotes);
console.log('Unescaped quotes:', unescaped, '(should be even for valid JSON)');
console.log('Escaped quotes (odd backslashes):', totalQuotes - unescaped);

// Check raw array content for our extraction
let startBracket = c.indexOf('[');
let endSemiColon = c.lastIndexOf('};');
let rawArr = c.substring(startBracket + 1, endSemiColon);

let arrQuotes = 0;
let arrUnesc = 0;
for (let i = 0; i < rawArr.length; i++) {
  if (rawArr[i] === '"') {
    arrQuotes++;
    let bs = 0,
      j = i - 1;
    while (j >= 0 && rawArr[j] === '\\') {
      bs++;
      j--;
    }
    if (bs % 2 === 0) arrUnesc++;
  }
}
console.log('Raw array quotes:', arrQuotes);
console.log('Raw array unescaped quotes:', arrUnesc, '(should be even)');

// Now apply transformation and recount
let out = '';
let inStr = false;
let i = 0;
while (i < rawArr.length) {
  const ch = rawArr[i];

  if (ch === '"') {
    let bs = 0,
      k = i - 1;
    while (k >= 0 && rawArr[k] === '\\') {
      bs++;
      k--;
    }

    if (bs % 2 === 1) {
      // Escaped quote - pass through but dont toggle state
      out += ch;
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

  i++;
}

// Count quotes in output
let outQuotes = 0;
let outUnesc = 0;
for (let i = 0; i < out.length; i++) {
  if (out[i] === '"') {
    outQuotes++;
    let bs = 0,
      j = i - 1;
    while (j >= 0 && out[j] === '\\') {
      bs++;
      j--;
    }
    if (bs % 2 === 0) outUnesc++;
  }
}
console.log('Output quotes:', outQuotes);
console.log('Output unescaped quotes:', outUnesc, '(should be even after transform)');
