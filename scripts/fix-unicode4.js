var fs = require('fs');
var c = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', 'utf8');
// Match \\u{HEX} - two literal backslashes followed by u
c = c.replace(/\\\\\\\\u\{([0-9A-Fa-f]+)\}/g, function (m, hex) {
  return String.fromCodePoint(parseInt(hex, 16));
});
fs.writeFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', c, 'utf8');
console.log('Fixed remaining double-escaped patterns');
