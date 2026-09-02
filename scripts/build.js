/**
 * esbuild-based build script for Biblioteca de Promps Industriales.
 * Minifies JS and CSS for production. The app uses vanilla <script> tags
 * (not ES modules), so we treat each JS file independently.
 *
 * Usage: node scripts/build.js
 */
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Ensure dist directory
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// Copy static assets (HTML, icons, manifest, sw, vendor)
const staticFiles = ['index.html', 'test.html', 'generar-iconos.html', 'manifest.json', 'sw.js', 'README.md', 'CHANGELOG.md'];

for (const f of staticFiles) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, f));
  }
}

// Copy directories
const dirsToCopy = ['icons', 'js/vendor'];
for (const dir of dirsToCopy) {
  const src = path.join(ROOT, dir);
  const dest = path.join(DIST, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
  }
}

// Minify CSS
const cssDir = path.join(DIST, 'css');
fs.mkdirSync(cssDir, { recursive: true });

// Copy new highlight.css file to dist/css
const newCssSrc = path.join(ROOT, 'css', 'highlight-github-dark.min.css');
if (fs.existsSync(newCssSrc)) {
  fs.copyFileSync(newCssSrc, path.join(cssDir, 'highlight-github-dark.min.css'));
}

const cssSrc = path.join(ROOT, 'css', 'styles.css');
if (fs.existsSync(cssSrc)) {
  const cssResult = esbuild.transformSync(fs.readFileSync(cssSrc, 'utf8'), {
    loader: 'css',
    minify: true,
  });
  fs.writeFileSync(path.join(cssDir, 'styles.css'), cssResult.code);
  console.log('✓ CSS minified');
}

// Copy SCSS minified version too
const cssMinSrc = path.join(ROOT, 'css', 'styles.min.css');
if (fs.existsSync(cssMinSrc)) {
  fs.copyFileSync(cssMinSrc, path.join(cssDir, 'styles.min.css'));
}

// Minify JS files (data files kept as-is since they're huge and already minified)
const jsDir = path.join(DIST, 'js');
fs.mkdirSync(jsDir, { recursive: true });

// FIX: crypto.js, usage-tracker.js, bpi-worker.js y lib-loader.js faltaban en el
// build anterior → 404 en producción y Web Worker roto.
const jsToMinify = [
  'app.js',
  'ai-chat.js',
  'platform-tests.js',
  'store.js',
  'crypto.js',
  'usage-tracker.js',
  'bpi-worker.js',
  'lib-loader.js',
];
const jsToCopy = ['prompts-data.js', 'prompts-data-extra.js', 'prompts-data-v2.js', 'prompts-data-fullstack.js'];

for (const f of jsToMinify) {
  const src = path.join(ROOT, 'js', f);
  if (fs.existsSync(src)) {
    const result = esbuild.transformSync(fs.readFileSync(src, 'utf8'), {
      loader: 'js',
      minify: true,
      target: 'es2020',
    });
    fs.writeFileSync(path.join(jsDir, f), result.code);
    const origSize = fs.statSync(src).size;
    const newSize = Buffer.byteLength(result.code);
    console.log(
      `✓ ${f}: ${(origSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${((1 - newSize / origSize) * 100).toFixed(0)}% smaller)`
    );
  }
}

for (const f of jsToCopy) {
  const src = path.join(ROOT, 'js', f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(jsDir, f));
  }
}

console.log('\n✓ Build complete → dist/');

// Brotli compress text assets for production serving
const zlib = require('zlib');
const textExts = ['.html', '.css', '.js', '.svg', '.json', '.md'];
let brCount = 0;
function compressDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      compressDir(full);
    } else if (textExts.includes(path.extname(entry.name))) {
      const content = fs.readFileSync(full);
      // Only compress if > 1KB and not already compressed
      if (content.length > 1024) {
        const compressed = zlib.brotliCompressSync(content, {
          params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
        });
        if (compressed.length < content.length) {
          fs.writeFileSync(full + '.br', compressed);
          brCount++;
        }
      }
    }
  }
}
compressDir(DIST);
console.log(`  ${brCount} .br (Brotli) compressed files`);

console.log('  Open index.html from dist/ or serve with: npx serve dist/');
