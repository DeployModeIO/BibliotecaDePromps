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

// Strategy: use a state machine to properly escape all control chars in JSON strings
var result = '';
var inString = false;
for (var i = 0; i < rawJson.length; i++) {
  var ch = rawJson[i];

  if (ch === '"') {
    // Check for escaped quote
    var backslashes = 0;
    var j = i - 1;
    while (j >= 0 && rawJson[j] === '\\') {
      backslashes++;
      j--;
    }

    // If odd number of backslashes, this is an escaped quote
    if (backslashes % 2 === 1) {
      result += ch;
      continue;
    }

    // Toggle string state
    inString = !inString;
    result += ch;
  } else if (inString) {
    // Inside a string value - escape/control chars need handling
    if (ch === '\n' || ch === '\r') {
      result += '\\n';
    } else if (ch === '\t') {
      result += '\\t';
    } else if (ch.charCodeAt(0) < 32) {
      result += '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0');
    } else {
      result += ch;
    }
  } else {
    // Outside strings - replace any whitespace with nothing (minimize)
    // EXCEPT space which can separate tokens
    result += ch;
  }
}

try {
  var data = JSON.parse(result);
  console.log('Success! Categories:', data.categorias.length);

  var total = 0;
  data.categorias.forEach(function (cat) {
    cat.subcategorias.forEach(function (sub) {
      total += sub.prompts.length;
    });
  });
  console.log('Total prompts:', total);

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
    console.log('Context:', JSON.stringify(result.substring(Math.max(0, parseInt(m[1]) - 40), parseInt(m[1]) + 60)));
  }
}
