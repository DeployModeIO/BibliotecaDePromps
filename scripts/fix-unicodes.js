const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');

let c = fs.readFileSync(filePath, 'utf8');

// Replace \u{HEX} sequences with actual unicode characters
const replacement = (match, hex) => {
  return String.fromCodePoint(parseInt(hex, 16));
};

c = c.replace(/\\u\{([0-9A-Fa-f]+)\}/g, replacement);

console.log('After regex replace, checking for remaining...');
const remaining = c.match(/\\u\{/g);
if (remaining && remaining.length > 0) {
  console.log('WARNING: Still have', remaining.length, '\\u{ patterns');
  // Try direct string replace
  const replacements = [
    ['\\u{1F33E}', '\ud83c\udf3e'],
    ['\\u{1F52C}', '\ud83d\udd2c'],
    ['\\u{1F3D3}\\u{FE0F}', '\ud83c\udfd3\ufe0f'],
    ['\\u{1F33F}', '\ud83c\udf3f'],
  ];
  for (const [from, to] of replacements) {
    c = c.split(from).join(to);
    console.log('Replaced', from, 'with', to);
  }
}

fs.writeFileSync(filePath, c, 'utf8');
console.log('Done! Writing complete.');
