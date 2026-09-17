const fs = require('fs');
const c = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', 'utf8');
// Strip BOM
if (c.charCodeAt(0) === 0xfeff) {
  console.log('BOM found, skipping');
  c = c.substring(1);
}

console.log('Char at 223:', JSON.stringify(c[223]));
console.log('Chars 220-235:', JSON.stringify(c.substring(220, 235)));

// The content from "categorias": should be around position 223-224
// Let's see more context
const afterCat = c.indexOf('"categorias"');
console.log('"categorias" found at:', afterCat);
const bracketAfter = c.indexOf('[', afterCat);
console.log('[" after categorias at:', bracketAfter);
console.log('Context around bracket:', JSON.stringify(c.substring(bracketBefore - 10 || 0, bracketAfter + 30)));
