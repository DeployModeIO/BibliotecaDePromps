# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.3.0] — 2026-08-19

### Added

- GitHub Actions CI pipeline (lint + format + test + validate on push/PR, Node 20.x/22.x)
- GitHub Actions deploy pipeline (auto-deploy to GitHub Pages on merge to main)
- Sass SCSS modularization (12 component files in `scss/`)
- `build:css`, `build:css:watch`, `build:css:prod` npm scripts
- esbuild-based build script (`scripts/build.js`) — JS minification 28-46%
- Brotli compression in build output (17 .br files in `dist/`)
- `precommit`, `validate`, `dev`, `preview` npm scripts
- `test:integration`, `test:e2e`, `test:e2e:ui`, `test:e2e:report` npm scripts
- SRI integrity hashes for CDN scripts (jszip, marked) with local fallback in `js/vendor/`
- JSDoc type annotations for `app.js` public API
- Global error boundary (`window.onerror` + `unhandledrejection`)
- 14 unit tests: SafeStore, PlatformTests, data merge, wordCount, escHTML
- 28 integration tests: DOM, CSP, SRI, SW, manifest, SCSS, GitHub Actions, build artifacts
- `CHANGELOG.md` with Keep a Changelog format
- Docker support with multi-stage build (Node 22 Alpine + Nginx 1.27 with Brotli)
- `nginx.conf` with Brotli, Gzip, security headers, immutable caching, CSP
- Web Worker (`js/bpi-worker.js`) for off-main-thread search indexing, word count, highlighting
- Playwright E2E test suite (4 browsers: Chromium, Firefox, Mobile Chrome, Mobile Safari)
- 20 E2E tests: homepage, search, categories, modal, drawers, chat, offline/PWA, responsive
- Landing page (`landing.html`) with marketing design, stats, features grid, industries grid
- `.editorconfig` for consistent cross-editor formatting
- `.dockerignore` for lean Docker builds
- `.prettierignore` to exclude vendor files and generated CSS
- `prompts-data-fullstack.js` added to `.eslintignore`

### Changed

- `sw.js`: Complete rewrite with stale-while-revalidate strategy, all assets cached, CDN fonts, `Promise.allSettled`
- `manifest.json`: Added PNG icon entry for iOS
- `index.html`: SRI + crossorigin + onerror fallback on CDN scripts, hardened CSP, Apple touch icon
- `.eslintrc.cjs`: Template literal indent excluded (Prettier compat)
- `package.json`: Added sass, esbuild, Playwright, jsdom devDependencies; new scripts
- `app.js`: v3.2 → v3.3, JSDoc typedefs, error boundary
- `.gitignore`: Added `e2e-report/`, `playwright-report/`, `test-results/`, `*.br`
- `.eslintignore`: Added `bpi-worker.js`, `coverage/`, `e2e/`, `scripts/`

### Fixed

- Service Worker missing 5 JS files and 2 HTML files from precache
- CDN scripts had no integrity verification (security risk)
- CSS was a single 2000+ line unmaintainable file
- ESLint/Prettier conflict on template literal indentation

## [3.2.0] — 2026-07

### Added

- AI Chat panel with multi-provider support (local + cloud)
- Auto-detection of local LLM servers (Ollama, LM Studio, vLLM, etc.)
- File save with File System Access API + ZIP fallback
- Configurable max tokens

## [3.1.0] — 2026-06

### Added

- 80+ mega-prompts across 4 data files
- Platform output directive system (Web, Android, iOS, Tablet, Windows)
- Multi-platform test suite (`PlatformTests`)
- SafeStore resilient localStorage wrapper

## [3.0.0] — 2026-05

### Added

- Initial PWA release
- Industrial HMI Control Room UI
- Dark/Light theme
- PDF, Excel, Email export
- Favorites and history drawers
- Offline support via Service Worker
