const fs = require('fs');
const c = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', 'utf8');
console.log('Length:', c.length);
console.log('First 300:', JSON.stringify(c.substring(0, 300)));
console.log('Last 150:', JSON.stringify(c.substring(c.length - 150)));

const idx1 = c.indexOf('[{');
console.log('indexOf([{ :', idx1);

const afterCat = c.indexOf('[', c.indexOf('"categorias"'));
console.log('Array start after categorias:', afterCat);

const lastSemi = c.lastIndexOf('};');
console.log('Last }; at:', lastSemi);

// Check for BOM
const bom = c.charCodeAt(0);
console.log('BOM charCode:', bom);
