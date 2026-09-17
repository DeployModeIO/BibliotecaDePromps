var fs = require('fs');
var c = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/js/prompts-data-industries.js', 'utf8');
if (c.charCodeAt(0) === 0xfeff) c = c.substring(1);
var startIdx = c.indexOf('[');
var endIdx = c.lastIndexOf('};');
var jsonStr = c.substring(startIdx, endIdx + 2);
try {
  var j = JSON.parse(jsonStr);
  console.log('Valid JSON! Categories:', j.categorias.length);
  var totalPrompts = 0;
  j.categorias.forEach(function (cat) {
    cat.subcategorias.forEach(function (sub) {
      totalPrompts += sub.prompts.length;
    });
  });
  console.log('Total prompts:', totalPrompts);
} catch (e) {
  console.log('Parse error:', e.message.substring(0, 200));
  var m = e.message.match(/position (\d+)/);
  if (m) {
    var pos = parseInt(m[1]);
    console.log('Context:', JSON.stringify(jsonStr.substring(Math.max(0, pos - 40), pos + 60)));
  }
}
