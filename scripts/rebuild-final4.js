var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
var c = fs.readFileSync(filePath, 'utf8');

// Remove JS wrapper
c = c.replace(/\/\*[\s\S]*?\*\//g, '');
c = c.replace(/^const PROMPTS_DB_INDUSTRIES\s*=\s*/i, '');
var catKey = c.indexOf('"categorias":');
var arrStart = c.indexOf('[', catKey);
var endMarker = c.lastIndexOf('};');
var rawJson = c.substring(arrStart, endMarker + 2).trim();

// Replace ALL whitespace/newlines with empty string, keeping everything on one line
// Then parse. This will keep all spacing inside string values intact.
var oneLine = rawJson.replace(/[\r\n]/g, '');

try {
  var data = JSON.parse(oneLine);
  console.log('Success! Categories:', data.categorias.length);

  var total = 0;
  data.categorias.forEach(function (cat) {
    cat.subcategorias.forEach(function (sub) {
      total += sub.prompts.length;
    });
  });
  console.log('Total prompts:', total);

  // Beautify output
  var formatted = JSON.stringify(data, null, 2);
  var header = [
    '/* ============================================================',
    '   BIBLIOTECA DE PROMPS - DATA INDUSTRIAS UNIVERSALES v5.0',
    '   Generado autom\xe1ticamente con validaci\xf3n JSON completa',
    '   ============================================================ */',
    '',
    'const PROMPTS_DB_INDUSTRIES = ',
    formatted,
    ';',
  ].join('\n');

  fs.writeFileSync(filePath, header, 'utf8');
  console.log('Done! Size:', fs.statSync(filePath).size, 'bytes');
} catch (e) {
  console.log('Error:', e.message.substring(0, 200));
  var m = e.message.match(/position (\d+)/);
  if (m) {
    console.log('Context:', JSON.stringify(oneLine.substring(Math.max(0, parseInt(m[1]) - 40), parseInt(m[1]) + 60)));
  }
}
