const fs = require('fs');
let c = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', 'utf8');
if (c.charCodeAt(0) === 0xfeff) c = c.substring(1);

// Find ag_001
const idx = c.indexOf('ag_001');
console.log('Found ag_001 at index:', idx);
if (idx > 0) {
  // Show 500 chars before and 500 after
  const start = Math.max(0, idx - 300);
  const end = Math.min(c.length, idx + 500);
  const chunk = c.substring(start, end);

  // Show with indices
  console.log('Index | Char | Code');
  for (let i = 0; i < chunk.length; i++) {
    const ch = chunk[i];
    const code = ch.charCodeAt(0);
    if (i % 300 < 30) {
      const printable = code >= 32 && code <= 126 ? ch : '.';
      console.log((start + i).toString().padStart(5), '|', JSON.stringify(printable).replace(/"/g, ''), '|', code);
    }
  }

  // Split into lines around this area
  const linesAround = c.split('\n');
  // Find line number of ag_001
  let lineNum = 0;
  let pos = 0;
  for (let i = 0; i < linesAround.length; i++) {
    pos += linesAround[i].length + 1; // +1 for \n
    if (pos > idx) {
      lineNum = i;
      break;
    }
  }
  console.log('\nLines around ag_001:');
  for (let i = Math.max(0, lineNum - 5); i <= Math.min(linesAround.length - 1, lineNum + 15); i++) {
    console.log(
      (i + 1).toString().padStart(3) +
        ': [' +
        linesAround[i].length.toString().padStart(4) +
        '] ' +
        JSON.stringify(linesAround[i].substring(0, 100))
    );
  }
}
