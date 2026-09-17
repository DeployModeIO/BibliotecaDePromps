const fs = require('fs');
const filePath = 'D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js';
let src = fs.readFileSync(filePath, 'utf8');
if (src.charCodeAt(0) === 0xfeff) src = src.substring(1);

let startBracket = src.indexOf('[');
let endSemiColon = src.lastIndexOf('};');
let rawContent = src.substring(startBracket + 1, endSemiColon);

// Apply same transformation as rebuild-clean.js
let out = '';
let inStr = false;
let i = 0;
while (i < rawContent.length) {
  const ch = rawContent[i];

  if (ch === '"') {
    let bs = 0,
      k = i - 1;
    while (k >= 0 && rawContent[k] === '\\') {
      bs++;
      k--;
    }

    if (bs % 2 === 1) {
      out += '\\';
      out += '"';
      i++;
      continue;
    }

    inStr = !inStr;
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

// Check quote depth at position 9963
console.log('Checking position 9963...');
let qd = 0;
for (let p = 0; p < out.length; p++) {
  const c = out[p];
  if (c === '"') {
    let bs = 0,
      j = p - 1;
    while (j >= 0 && out[j] === '\\') {
      bs++;
      j--;
    }
    if (bs % 2 === 1) continue;
    qd++;
  }
}
// Actually count up to pos 9963
qd = 0;
for (let p = 0; p <= Math.min(9963, out.length); p++) {
  const c = out[p];
  if (c === '"') {
    let bs = 0,
      j = p - 1;
    while (j >= 0 && out[j] === '\\') {
      bs++;
      j--;
    }
    if (bs % 2 === 1) continue;
    qd++;
  }
}
console.log('Quote depth before/at 9963:', qd);
console.log('Inside string?', qd % 2 === 1);

// Show char and context
console.log('Char at 9963:', JSON.stringify(out[9963]), 'code:', out.charCodeAt(9963));
console.log('Context:', JSON.stringify(out.substring(Math.max(0, 9953), 9973)));

// Now trace back to find where in original this came from
// The output added \\n for each newline inside strings
// Count how many \n replacements happened before position 9963
let newlinesAdded = 0;
let oqd = 0;
let oRawPos = 0;
for (let oi = 0; oi < rawContent.length && oRawPos < 9963; oi++) {
  const oc = rawContent[oi];

  if (oc === '"') {
    let bs = 0,
      k = oi - 1;
    while (k >= 0 && rawContent[k] === '\\') {
      bs++;
      k--;
    }
    if (bs % 2 === 1) continue;
    oqd++;
  } else if (oqd % 2 === 1 && (oc === '\n' || oc === '\r')) {
    newlinesAdded++;
  }
}
console.log('Newlines added before output pos 9963:', newlinesAdded);
console.log('Estimated raw position:', 9963 - newlinesAdded);
