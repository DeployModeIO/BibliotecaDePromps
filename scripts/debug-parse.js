const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
let c = fs.readFileSync(filePath, 'utf8');

// Strip BOM
if (c.charCodeAt(0) === 0xfeff) {
  c = c.substring(1);
}

// Find \u{HEX} and replace with actual emoji
c = c.replace(/\\\\u\{([0-9A-Fa-f]{4,6})\}/g, function (m, hex) {
  return String.fromCodePoint(parseInt(hex, 16));
});

const lines = c.split('\n');

// Build output tracking quote depth
let result = '';
let inStr = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  for (let j = 0; j < line.length; j++) {
    const ch = line[j];

    if (ch === '"') {
      let bs = 0;
      let k = j - 1;
      while (k >= 0 && line[k] === '\\') {
        bs++;
        k--;
      }

      if (bs % 2 === 1) {
        continue; // Escaped quote, skip
      }

      inStr = !inStr;
    }
  }
}

console.log('Final inStr state:', inStr, '(should be false)');

// Try extraction BEFORE processing
let arrIdx = c.indexOf('[');
let semiIdx = c.lastIndexOf('};');
console.log('BEFORE proc - arrIdx:', arrIdx, 'semiIdx:', semiIdx);

// Try extracting just the array content
let beforeJSON = c.substring(arrIdx, semiIdx + 2);
console.log('Before proc JSON length:', beforeJSON.length);
console.log('First 50:', JSON.stringify(beforeJSON.substring(0, 50)));
console.log('Last 50:', JSON.stringify(beforeJSON.substring(beforeJSON.length - 50)));

// Now try parsing raw (before our transformation)
try {
  let data = JSON.parse('{"categorias":' + beforeJSON + '}');
  console.log('Raw parse OK! Categories:', data.categorias.length);
} catch (e) {
  console.log('Raw parse error:', e.message.substring(0, 100));

  // Find where it breaks
  const m = e.message.match(/position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    console.log('Error at position:', pos);
    console.log('Context:', JSON.stringify(beforeJSON.substring(Math.max(0, pos - 40), pos + 60)));

    // Show byte representation of problematic area
    for (let i = Math.max(0, pos - 40); i < Math.min(pos + 60, beforeJSON.length); i++) {
      if (beforeJSON[i].charCodeAt(0) < 32 || beforeJSON[i].charCodeAt(0) > 126) {
        console.log('Control char at offset', i - (pos - 40), ': code', beforeJSON[i].charCodeAt(0), 'at global pos', i);
      }
    }
  }
}
