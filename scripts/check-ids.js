const fs = require('fs');
const html = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/index.html', 'utf8');
const ids = [
  'aiDetectModels',
  'aiRescanLocal',
  'aiProviderSelect',
  'aiModelSelect',
  'aiApiKey',
  'chatDrawer',
  'chatScrim',
  'chatClose',
  'chatToggle',
  'aiConfigPanel',
  'aiConfigList',
  'aiConfigAdd',
  'aiMaxTokens',
];
ids.forEach((id) => {
  const found = html.includes('id="' + id + '"') || html.includes("id='" + id + "'");
  console.log(id + ': ' + (found ? 'FOUND' : 'NOT FOUND'));
});
