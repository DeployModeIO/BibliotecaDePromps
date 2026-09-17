var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');

// Read current file content and extract JSON data object
var c = fs.readFileSync(filePath, 'utf8');

// Strip JS wrapper to get just the JSON array
c = c.replace(/\/\*[\s\S]*?\*\//g, ''); // remove comments
c = c.replace(/^const PROMPTS_DB_INDUSTRIES\s*=\s*/i, ''); // remove const declaration

// Extract the object between the first [ after "categorias" and final };
var catKey = c.indexOf('\"categorias\":');
var arrStart = c.indexOf('[', catKey);
var endMarker = c.lastIndexOf('};');
var jsonOnly = '{\"categorias\":' + c.substring(arrStart, endMarker + 2);

try {
  var data = JSON.parse(jsonOnly);
  console.log('Parsed successfully! Categories:', data.categorias.length);

  var totalPrompts = 0;
  data.categorias.forEach(function (cat) {
    cat.subcategorias.forEach(function (sub) {
      totalPrompts += sub.prompts.length;
    });
  });
  console.log('Total prompts:', totalPrompts);

  // Write back with proper JSON formatting (handles all escaping)
  var formatted = JSON.stringify(data, null, 2);

  // Build the full JS module
  var output = '/* ============================================================\\n';
  output += '   BIBLIOTECA DE PROMPS - DATA INDUSTRIAS UNIVERSALES v5.0\\n';
  output += '   Generado automáticamente con validación JSON completa\\n';
  output += '   ============================================================ */\\n\\n';
  output += 'const PROMPTS_DB_INDUSTRIES = ' + formatted + ';\\n';

  fs.writeFileSync(filePath, output, 'utf8');
  console.log('File rebuilt with proper JSON serialization!');
  console.log('File size:', fs.statSync(filePath).size, 'bytes');
} catch (e) {
  console.log('Parse error:', e.message.substring(0, 200));
  // Try to find the problematic position
  var m = e.message.match(/position (\\d+)/);
  if (m) {
    var pos = parseInt(m[1]);
    console.log('Context:', JSON.stringify(c.substring(Math.max(0, pos - 50), pos + 50)));
  }
}
