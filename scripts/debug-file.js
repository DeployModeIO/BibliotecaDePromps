const fs = require('fs');
const vm = require('vm');
const path = require('path');

const filePath = 'D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js';
let c = fs.readFileSync(filePath, 'utf8');

// Strip BOM
if (c.charCodeAt(0) === 0xfeff) {
  c = c.substring(1);
}

// Remove single-line comments
c = c.replace(/^\/\/.*$/gm, '');

console.log('After stripping BOM and // comments:');
console.log('First line:', c.split('\n')[0]);
console.log('Second line:', c.split('\n')[1]);
console.log('Third line:', c.split('\n')[2]);
console.log('Lines 4-6:', c.split('\n').slice(3, 6).join('\n | '));

// Try to extract the const declaration and evaluate
const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  console.log(i + 1, ':', JSON.stringify(lines[i].substring(0, 60)));
}
