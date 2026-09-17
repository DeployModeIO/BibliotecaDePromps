var fs = require('fs');
var c = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', 'utf8');
// Find newline characters that aren't properly escaped in JSON strings
// In the extracted JSON, real newlines would cause this error
var startIdx = c.indexOf('[');
var endIdx = c.lastIndexOf('};');
var jsonStr = c.substring(startIdx, endIdx + 2);

// Check for literal newlines (not \\n) inside string values
for (var i = 0; i < jsonStr.length; i++) {
  if (jsonStr[i] === '\n') {
    // This is a raw newline - check context
    console.log('Raw newline at position:', i);
    console.log('Context:', JSON.stringify(jsonStr.substring(Math.max(0, i - 40), i + 30)));
    if (i > 100000) break; // stop after first few
  }
}
console.log('Done scanning.');
