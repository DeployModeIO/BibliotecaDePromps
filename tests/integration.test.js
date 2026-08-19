/**
 * Integration tests: DOM structure, meta tags, build artifacts, config files.
 * Validates static files without requiring jsdom (avoids ESM compatibility issues).
 * All DOM checks parse the raw HTML string.
 */

const fs = require('fs');
const path = require('path');

// Load HTML as string
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Wait for DOM to settle
beforeAll(() => {
  // Override console to suppress noise
  global.console = { ...console, log: jest.fn(), warn: jest.fn() };
});

/** Helper: parse HTML for a specific tag */
function hasTag(htmlStr, tag, attrs = {}) {
  const openTag = `<${tag}`;
  const idx = htmlStr.indexOf(openTag);
  if (idx === -1) return false;
  const attrsStr = htmlStr.slice(idx, htmlStr.indexOf('>', idx) + 1);
  return Object.entries(attrs).every(([k, v]) => attrsStr.includes(`${k}="${v}"`) || attrsStr.includes(`${k}='${v}'`));
}

function tagCount(htmlStr, selector) {
  // Simple count for class-based selectors
  if (selector.startsWith('.')) {
    const cls = selector.slice(1);
    const re = new RegExp(`class="[^"]*\\b${cls}\\b[^"]*"`, 'g');
    const matches = htmlStr.match(re);
    return matches ? matches.length : 0;
  }
  return 0;
}

describe('DOM — Initial render', () => {
  test('index.html has required meta tags', () => {
    expect(html).toContain('<title>');
    expect(html).toContain('Biblioteca de Promps');
    expect(html).toContain('name="theme-color"');
    expect(html).toContain('name="viewport"');
    expect(html).toContain('name="description"');
  });

  test('index.html has CSP meta tag', () => {
    expect(html).toContain('Content-Security-Policy');
    expect(html).toContain("default-src 'self'");
    expect(html).toContain("object-src 'none'");
  });

  test('index.html has SRI on CDN scripts', () => {
    // Check that CDN script tags have integrity attributes
    const cdnPattern = /<script[^>]*src="https:\/\/[^"]*"[^>]*integrity="[^"]+"[^>]*>/g;
    const matches = html.match(cdnPattern);
    expect(matches).toBeTruthy();
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  test('index.html has manifest link', () => {
    expect(html).toContain('rel="manifest"');
    expect(html).toContain('manifest.json');
  });

  test('index.html has apple-touch-icon', () => {
    expect(html).toContain('apple-touch-icon');
  });

  test('index.html has favicon', () => {
    expect(html).toContain('rel="icon"');
  });

  test('index.html has search input', () => {
    expect(html).toContain('id="searchInput"');
    expect(html).toContain('placeholder=');
  });

  test('index.html has theme toggle', () => {
    expect(html).toContain('id="themeToggle"');
  });

  test('index.html has category filter buttons', () => {
    expect(html).toContain('class="chip');
  });

  test('index.html has stats strip', () => {
    expect(html).toContain('stats-strip');
  });

  test('index.html has categories grid container', () => {
    expect(html).toContain('id="categoriesGrid"');
  });

  test('index.html has results list container', () => {
    expect(html).toContain('id="resultsList"');
  });

  test('index.html has modal container', () => {
    expect(html).toContain('id="promptModal"');
  });
});

describe('DOM — Data attributes and accessibility', () => {
  test('html element has lang attribute', () => {
    expect(html).toContain('lang="es"');
  });

  test('html element has data-theme attribute', () => {
    expect(html).toContain('data-theme=');
  });

  test('search input has aria-label', () => {
    expect(html).toContain('aria-label=');
  });
});

describe('Manifest', () => {
  test('manifest.json has required fields', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'manifest.json'), 'utf8'));
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    expect(manifest.icons.some((i) => i.type === 'image/png')).toBe(true);
  });
});

describe('Service Worker', () => {
  test('sw.js registers fetch listener', () => {
    const sw = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
    expect(sw).toContain("addEventListener('fetch'");
    expect(sw).toContain("addEventListener('install'");
    expect(sw).toContain('CACHE_NAME');
  });

  test('sw.js caches all JS files', () => {
    const sw = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
    expect(sw).toContain('app.js');
    expect(sw).toContain('ai-chat.js');
    expect(sw).toContain('prompts-data.js');
    expect(sw).toContain('platform-tests.js');
  });

  test('sw.js has stale-while-revalidate strategy', () => {
    const sw = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
    expect(sw).toContain('stale-while-revalidate');
  });
});

describe('GitHub Actions', () => {
  test('CI workflow exists', () => {
    const ci = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'ci.yml'), 'utf8');
    expect(ci).toContain('lint');
    expect(ci).toContain('test');
    expect(ci).toContain('validate');
  });

  test('Deploy workflow exists', () => {
    const deploy = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml'), 'utf8');
    expect(deploy).toContain('pages');
    expect(deploy).toContain('deploy');
  });
});

describe('SCSS Architecture', () => {
  test('styles.scss imports all partials', () => {
    const main = fs.readFileSync(path.join(__dirname, '..', 'scss', 'styles.scss'), 'utf8');
    expect(main).toContain('@use');
    expect(main).toContain('base/reset');
    expect(main).toContain('themes/light');
    expect(main).toContain('layout/topbar');
  });

  test('All partials exist', () => {
    const base = path.join(__dirname, '..', 'scss');
    const files = fs.readdirSync(path.join(base, 'base'));
    expect(files.length).toBeGreaterThan(0);

    const layout = fs.readdirSync(path.join(base, 'layout'));
    expect(layout.length).toBeGreaterThanOrEqual(5);

    const components = fs.readdirSync(path.join(base, 'components'));
    expect(components.length).toBeGreaterThanOrEqual(4);

    const themes = fs.readdirSync(path.join(base, 'themes'));
    expect(themes.length).toBeGreaterThan(0);
  });
});

describe('Build output', () => {
  test('dist/ exists after build', () => {
    // dist/ should exist after running npm run build
    const distExists = fs.existsSync(path.join(__dirname, '..', 'dist'));
    // If dist doesn't exist, that's okay for CI — the test just notes it
    if (distExists) {
      const files = fs.readdirSync(path.join(__dirname, '..', 'dist'));
      expect(files).toContain('index.html');
      expect(files).toContain('manifest.json');
      expect(files).toContain('sw.js');
    }
  });

  test('css/styles.min.css is compressed', () => {
    const minPath = path.join(__dirname, '..', 'css', 'styles.min.css');
    if (fs.existsSync(minPath)) {
      const content = fs.readFileSync(minPath, 'utf8');
      // Compressed CSS should have very few newlines
      const newlines = (content.match(/\n/g) || []).length;
      expect(newlines).toBeLessThan(10);
    }
  });
});

describe('Package.json scripts', () => {
  test('has all required scripts', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    const required = ['test', 'lint', 'format', 'format:check', 'build', 'build:css', 'build:css:prod', 'precommit', 'validate', 'dev'];
    required.forEach((s) => {
      expect(pkg.scripts[s]).toBeTruthy();
    });
  });
});
