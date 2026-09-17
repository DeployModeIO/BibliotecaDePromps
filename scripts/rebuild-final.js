const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
let c = fs.readFileSync(filePath, 'utf8');

// Strip BOM if present
if (c.charCodeAt(0) === 0xfeff) {
  c = c.substring(1);
}

// Also remove any single-line comments that might have been inserted
c = c.replace(/^\/\/.*$/gm, '');

console.log('First 100 after cleaning:', JSON.stringify(c.substring(0, 100)));

try {
  // Use Node's VM to parse as JavaScript - this handles ALL escaping natively
  const sandbox = {};
  vm.runInNewContext(c, sandbox, { filename: 'rebuild' });

  const data = PROMPTS_DB_INDUSTRIES || sandbox.PROMPTS_DB_INDUSTRIES;

  console.log('VM parsed OK!');
  console.log('Categories:', data.categorias.length);

  let total = 0;
  data.categorias.forEach(function (cat) {
    cat.subcategorias.forEach(function (sub) {
      total += sub.prompts.length;
    });
  });
  console.log('Total prompts:', total);

  // Validate structure
  for (var i = 0; i < data.categorias.length; i++) {
    var cat = data.categorias[i];
    if (!cat.id || !cat.nombre || !Array.isArray(cat.subcategorias)) {
      throw new Error('Invalid category at index ' + i);
    }
    for (var j = 0; j < cat.subcategorias.length; j++) {
      var sub = cat.subcategorias[j];
      if (!sub.id || !Array.isArray(sub.prompts)) {
        throw new Error('Invalid sub in cat ' + cat.id);
      }
    }
  }
  console.log('Structure valid!');

  // Rebuild file with proper JSON.stringify (eliminates all encoding issues)
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
  console.log('Rebuilt successfully! Size:', fs.statSync(filePath).size, 'bytes');
} catch (e) {
  console.error('VM error:', e.message);

  // Manual fallback: extract between brackets
  try {
    var idxArr = c.indexOf('[');
    var endIdx = c.lastIndexOf('};');
    if (idxArr < 0 || endIdx <= idxArr) {
      throw new Error("Can't find array boundaries");
    }

    // Extract just the array content
    var raw = c.substring(idxArr + 1, endIdx);
    console.log('Raw array length:', raw.length);

    // Replace raw newlines inside strings with \\n
    // Count quotes to track string depth
    var result = '';
    var depth = 0;
    for (var i = 0; i < raw.length; i++) {
      var ch = raw[i];

      // Count unescaped quotes
      if (ch === '"') {
        var bs = 0;
        var k = i - 1;
        while (k >= 0 && raw[k] === '\\') {
          bs++;
          k--;
        }
        if (bs % 2 === 0) {
          depth++;
        }
      }

      if (depth % 2 === 1) {
        // Inside a string value
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
        // Outside strings - skip newlines and tabs
        if (/[^\s\n\r\t]/.test(ch)) {
          result += ch;
        }
      }
    }

    var jsonStr = '{' + result + '}';
    var obj = JSON.parse(jsonStr);
    console.log('Fallback OK!');
    console.log('Categories:', obj.categorias.length);

    var fmt = JSON.stringify(obj, null, 2);
    var h = [
      '/* ============================================================',
      '   BIBLIOTECA DE PROMPS - DATA INDUSTRIAS UNIVERSALES v5.0',
      '   Generado autom\xe1ticamente con validaci\xf3n JSON completa',
      '   ============================================================ */',
      '',
      'const PROMPTS_DB_INDUSTRIES = ',
      fmt,
      ';',
    ].join('\n');

    fs.writeFileSync(filePath, h, 'utf8');
    console.log('Fallback rebuilt! Size:', fs.statSync(filePath).size, 'bytes');
  } catch (e2) {
    console.error('Fallback failed:', e2.message);
    process.exit(1);
  }
}
