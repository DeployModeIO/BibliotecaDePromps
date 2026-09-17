const fs = require('fs');
const filePath = 'D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js';
let src = fs.readFileSync(filePath, 'utf8');
if (src.charCodeAt(0) === 0xfeff) src = src.substring(1);
let sb = src.indexOf('[');
let es = src.lastIndexOf('};');
let raw = src.substring(sb + 1, es);
let out = '';
let inStr = false;
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
console.log('Final toggles:', Math.floor(oq / 2), ', quotes:', oq);
// Show final state of inStr after processing
console.log('inStr final:', inStr);
try {
  const data = JSON.parse('{"categorias":' + out + '}');
  console.log('PARSED OK! Categories:', data.categorias.length);
  let total = 0;
  data.categorias.forEach(function (c) {
    c.subcategorias.forEach(function (s) {
      total += s.prompts.length;
    });
  });
  console.log('Total prompts:', total);

  // Rebuild
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
  console.log('REBUILT SUCCESSFULLY! Size:', fs.statSync(filePath).size, 'bytes');
} catch (e) {
  console.error('PARSE FAILED:', e.message.substring(0, 200));
  // Find which quote causes trouble
  let depth = 0;
  for (let p = 0; p <= 9970; p++) {
    if (out[p] === '"') {
      let bs = 0,
        q = p - 1;
      while (q >= 0 && out[q] === '\\') {
        bs++;
        q--;
      }
      if (bs % 2 === 0) depth++;
    }
  }
  console.log('Depth at 9970:', depth);

  // Check around position where toggle count is 568 vs 569
  // Count toggles by tracking odd/even quote count
  let tq = 0;
  for (let p = 0; p <= 9963; p++) {
    if (out[p] === '"') {
      let bs = 0,
        q = p - 1;
      while (q >= 0 && out[q] === '\\') {
        bs++;
        q--;
      }
      if (bs % 2 === 0) tq++;
    }
  }
  console.log('Total quote toggles up to 9963:', tq);

  // Now scan RAW input for anomalies
  // An anomaly would be a structure that has mismatched braces or brackets
  let braceDepth = 0;
  let bracketDepth = 0;
  let qCount = 0;
  for (let p = 0; p < raw.length; p++) {
    const rc = raw[p];
    if (rc === '"') {
      let bs = 0,
        k = p - 1;
      while (k >= 0 && raw[k] === '\\') {
        bs++;
        k--;
      }
      if (bs % 2 === 0) qCount++;
    } else if (rc === '{') braceDepth++;
    else if (rc === '}') braceDepth--;
    else if (rc === '[') bracketDepth++;
    else if (rc === ']') bracketDepth--;

    if (braceDepth < 0 || bracketDepth < 0) {
      console.log('NEGATIVE depth at pos', p, 'brace=', braceDepth, 'bracket=', bracketDepth);
      console.log('Context:', JSON.stringify(raw.substring(Math.max(0, p - 30), p + 20)));
      break;
    }
    if (p > 9970) break;
  }
  console.log('Brace/bracket depths at pos ~9970 in raw:', braceDepth, bracketDepth);
}
