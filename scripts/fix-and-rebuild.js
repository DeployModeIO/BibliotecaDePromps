var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
var c = fs.readFileSync(filePath, 'utf8');

// Remove comments and const declaration
c = c.replace(/\/\*[\s\S]*?\*\//g, '');
c = c.replace(/^const PROMPTS_DB_INDUSTRIES\s*=\s*/i, '');
var catKey = c.indexOf('\x22categorias\x22:');
var arrStart = c.indexOf('[', catKey);
var endMarker = c.lastIndexOf('};');
var jsonOnly = '{\x22categorias\x22:' + c.substring(arrStart, endMarker + 2);

// Strategy: replace all raw newlines OUTSIDE of quoted strings with spaces
// This preserves \\n sequences (which are already escaped) while fixing bare newlines

// First, let's find what makes position 81004 problematic
for (var i = 0; i < 5 && jsonOnly.length > pos; i++) {
  var matches = [];
  var m = null;
}

// Simpler approach: replace ALL raw newlines with \\n in the entire content
jsonOnly = jsonOnly.replace(/\n/g, '\\\\n');
// Now we have double-escaped \\\\n which is wrong - strings will have literal \\n instead of actual newline
// Let's do this differently: just replace newlines that are NOT preceded by backslash

var result = '';
var inString = false;
var lastChar = '';
for (var i = 0; i < jsonOnly.length; i++) {
  var ch = jsonOnly[i];
  if (ch === '\x22' && lastChar !== '\\\\\\\\') {
    inString = !inString;
    result += ch;
  } else if (ch === '\n' && inString) {
    // Replace raw newline inside string with escaped version
    result += '\\\\n';
  } else {
    result += ch;
  }
  lastChar = ch;
}

try {
  var data = JSON.parse(result);
  console.log('Parsed after newline fix! Categories:', data.categorias.length);
  var total = 0;
  data.categorias.forEach(function (cat) {
    cat.subcategorias.forEach(function (sub) {
      total += sub.prompts.length;
    });
  });
  console.log('Total prompts:', total);

  // Write properly formatted output
  var formatted = JSON.stringify(data, null, 2);
  var output = '/* ============================================================\\n';
  output += '   BIBLIOTECA DE PROMPS - DATA INDUSTRIAS UNIVERSALES v5.0\\n';
  output += '   Generado autom\xe1ticamente con validaci\xf3n JSON completa\\n';
  output += '   ============================================================ */\\n\\n';
  output += 'const PROMPTS_DB_INDUSTRIES = ' + formatted + ';\\n';
  fs.writeFileSync(filePath, output, 'utf8');
  console.log('Successfully rebuilt! File size:', fs.statSync(filePath).size, 'bytes');
} catch (e) {
  console.log('Still failing:', e.message.substring(0, 150));
  var m = e.message.match(/position (\d+)/);
  if (m) {
    var pos = parseInt(m[1]);
    console.log('Context:', JSON.stringify(result.substring(Math.max(0, pos - 50), pos + 60)));
  }
}
