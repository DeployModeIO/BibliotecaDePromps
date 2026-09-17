var fs = require('fs');
var c = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', 'utf8');

// First count all patterns
var patterns = c.match(/\\\\?u\{[0-9A-Fa-f]+\}/g);
console.log('Found patterns:', patterns ? patterns.length : 0);
if (patterns) console.log('Sample:', patterns.slice(0, 5));

// Replace all variations
c = c.replace(/\\\\u\{([0-9A-Fa-f]+)\}/g, function (m, hex) {
  return String.fromCodePoint(parseInt(hex, 16));
});

fs.writeFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', c, 'utf8');
console.log('Fixed');
