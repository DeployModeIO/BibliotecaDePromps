# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.3.0] — 2026-08-19

### Added

- GitHub Actions CI pipeline (lint + format + test on push/PR)
- GitHub Actions deploy pipeline (auto-deploy to GitHub Pages)
- Sass SCSS modularization (12 component files in `scss/`)
- `build:css`, `build:css:watch`, `build:css:prod` npm scripts
- `precommit` npm script (format check + lint + test)
- `test:coverage` npm script
- SRI integrity hashes for CDN scripts (jszip, marked)
- Local fallback scripts in `js/vendor/` for offline CDN resilience
- JSDoc type annotations for `app.js` public API
- Global error boundary (`window.onerror` + `unhandledrejection`)
- `.prettierignore` to exclude vendor files and generated CSS
- `CHANGELOG.md`
- `prompts-data-fullstack.js` added to `.eslintignore`

### Changed

- `sw.js`: Complete rewrite with stale-while-revalidate strategy, all assets cached, CDN font/script caching, `Promise.allSettled` for resilient install
- `manifest.json`: Added PNG icon entry for iOS compatibility
- `index.html`: CDN scripts now include `integrity`, `crossorigin`, and `onerror` fallback
- `.eslintrc.cjs`: Template literal indentation excluded from `indent` rule (Prettier compatibility)
- `package.json`: Added `sass` devDependency, new build scripts
- `app.js`: Version bump to v3.3, JSDoc typedefs, error boundary

### Fixed

- Service Worker was missing 5 JS files and 2 HTML files from precache
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
