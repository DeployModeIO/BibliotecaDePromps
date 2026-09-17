var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
var c = fs.readFileSync(filePath, 'utf8');
c = c.replace(/\/\*[\s\S]*?\*\//g, '');
c = c.replace(/^const PROMPTS_DB_INDUSTRIES\s*=\s*/i, '');
var catKey = c.indexOf('"categorias":');
var arrStart = c.indexOf('[', catKey);
var endMarker = c.lastIndexOf('};');
var jsonOnly = '{"categorias":' + c.substring(arrStart, endMarker + 2).trim();

// Replace raw newlines inside string values
var result = '';
var inStr = false;
for (var i = 0; i < jsonOnly.length; i++) {
  var ch = jsonOnly[i];
  if (ch === '"' && (i === 0 || jsonOnly[i - 1] !== '\\')) {
    inStr = !inStr;
  }
  if (inStr && ch === '\n') {
    result += '\\n';
  } else {
    result += ch;
  }
}

try {
  var data = JSON.parse(result);
  console.log('OK! Categories:', data.categorias.length);
  var total = 0;
  data.categorias.forEach(function (cat) {
    cat.subcategorias.forEach(function (sub) {
      total += sub.prompts.length;
    });
  });
  console.log('Total prompts:', total);

  var clean = JSON.stringify(data, null, 2);
  var header = [
    '/* ============================================================',
    '   BIBLIOTECA DE PROMPS - DATA INDUSTRIAS UNIVERSALES v5.0',
    '   Generado autom\xe1ticamente con validaci\xf3n JSON completa',
    '   ============================================================ */',
    '',
    'const PROMPTS_DB_INDUSTRIES = ',
    clean,
    ';',
  ].join('\n');

  fs.writeFileSync(filePath, header, 'utf8');
  console.log('Rebuilt successfully! Size:', fs.statSync(filePath).size, 'bytes');
} catch (e) {
  console.log('Error:', e.message.substring(0, 200));
  var m = e.message.match(/position (\d+)/);
  if (m) {
    console.log('Context:', result.substring(Math.max(0, parseInt(m[1]) - 40), parseInt(m[1]) + 60));
  }
}
