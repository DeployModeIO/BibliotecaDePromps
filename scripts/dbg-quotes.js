const fs = require('fs');
let c = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', 'utf8');
if (c.charCodeAt(0) === 0xfeff) c = c.substring(1);

// Look for \\" sequences (escaped quotes within JSON strings)
const regex = /\\\\\x22/g; // backslash followed by double quote
const matches = c.match(regex);
console.log('Backslash-quote matches:', matches ? matches.length : 0);
if (matches) {
  // Show context of first few
  let lastIndex = 0;
  for (let m of matches.slice(0, 5)) {
    const idx = c.indexOf(m, lastIndex + 1);
    if (idx < 0) break;
    console.log('At position', idx, ':', JSON.stringify(c.substring(Math.max(0, idx - 30), idx + 30)));
    lastIndex = idx;
  }
}

// Also check for any non-standard escaping
// Look for single backslash before double quote outside of known escape sequences
// Known valid escapes: \\n, \\t, \\\\r, \\\\u... etc.

// Count total unescaped quotes
let unescapedQuoteCount = 0;
for (let i = 0; i < c.length; i++) {
  if (c[i] === '"') {
    let bs = 0,
      j = i - 1;
    while (j >= 0 && c[j] === '\\') {
      bs++;
      j--;
    }
    if (bs % 2 === 0) {
      unescapedQuoteCount++;
    }
  }
}
console.log('Unescaped quotes count:', unescapedQuoteCount, '(should be even)');
