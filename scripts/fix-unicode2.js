var fs = require('fs');
var c = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', 'utf8');
// Replace literal backslash-u-{HEX} with actual unicode chars
c = c.replace(/\\\\u\{([0-9A-Fa-f]+)\}/g, function (m, hex) {
  return String.fromCodePoint(parseInt(hex, 16));
});
fs.writeFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', c, 'utf8');
console.log('Fixed double-escaped Unicode escapes');
