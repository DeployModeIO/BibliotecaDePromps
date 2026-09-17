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
var rawJson = c.substring(arrStart, endMarker + 2);

// Replace ALL actual newlines with \n using regex (this works because
// we're replacing newlines that appear as line breaks)
var escaped = rawJson.replace(/[\r\n]+/g, function (match) {
  // Check if this newline is likely inside a string value
  return '\\n';
});

// Actually, let's try a smarter approach:
// For each line, determine if it appears to be inside a string by counting quotes
var lines = rawJson.split('\n');
var processedLines = [];
var stringDepth = 0;

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];

  // Count unescaped quotes in this line
  var temp = '';
  for (var j = 0; j < line.length; j++) {
    if (line[j] === '"' && (j === 0 || line[j - 1] !== '\\')) {
      stringDepth++;
    }
  }

  // If we're an odd depth, we're inside a string
  var inStringNow = stringDepth % 2 === 1;

  // Trim leading/trailing whitespace from lines outside strings
  if (!inStringNow) {
    processedLines.push(line.trim());
  } else {
    processedLines.push(line);
  }
}

// Rejoin with single spaces (minimized format first)
var minimized = processedLines.join(' ');

try {
  var data = JSON.parse(minimized);
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
    console.log('Context:', JSON.stringify(minimized.substring(Math.max(0, parseInt(m[1]) - 60), parseInt(m[1]) + 60)));
  }
}
