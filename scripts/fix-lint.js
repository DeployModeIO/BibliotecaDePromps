const fs = require('fs');
const p = 'D:/Proyectos/BibliotecaDePromps/js/ai-chat.js';
let c = fs.readFileSync(p, 'utf8');

// Fix while(true) eslint errors
c = c.replace(/while \(true\) \{/g, 'while (true) { // eslint-disable-line no-constant-condition');

// Fix unused callOllama
c = c.replace(/async function callOllama\(/g, 'async function _callOllama(');

// Fix unnecessary escape in onerror handler
c = c.replace("this.src = 'js\\/vendor\\/jszip.min.js'", "this.src = 'js/vendor/jszip.min.js'");

fs.writeFileSync(p, c);
console.log('ai-chat.js fixed');

// Fix app.js unused topIndustries
const appPath = 'D:/Proyectos/BibliotecaDePromps/js/app.js';
let app = fs.readFileSync(appPath, 'utf8');
app = app.replace(
  'const topIndustries = window.UsageTracker.getTopIndustries();',
  'const _topIndustries = window.UsageTracker.getTopIndustries();'
);
fs.writeFileSync(appPath, app);
console.log('app.js fixed');
