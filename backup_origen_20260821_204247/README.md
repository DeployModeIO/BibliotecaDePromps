# 🏭 Biblioteca de Promps Industriales v3.3

[![CI](https://github.com/DeployModeIO/BibliotecaDePromps/actions/workflows/ci.yml/badge.svg)](https://github.com/DeployModeIO/BibliotecaDePromps/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/DeployModeIO/BibliotecaDePromps/actions/workflows/deploy.yml/badge.svg)](https://github.com/DeployModeIO/BibliotecaDePromps/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Descripción

Aplicación web profesional (PWA) con **80+ mega-prompts de ingeniería** especializados para generar **aplicaciones completas y funcionales** al pegarlos en cualquier IA (ChatGPT, Claude, Gemini, DeepSeek, etc.). Diseñada para funcionar en **Web, Android, iOS, Tablet y Windows** con soporte completo offline.

## 🎯 ¿Qué son los Mega-Prompts?

Los mega-prompts son **prompts de ingeniería estructurados** que contienen:

- **ROL**: Definición del experto que la IA debe asumir
- **CONTEXTO TÉCNICO**: Información detallada de la industria, normas y estándares
- **TAREA**: Especificación completa de lo que se debe desarrollar
- **MÓDULOS**: Desglose detallado de funcionalidades requeridas
- **FORMATO DE SALIDA**: Especificación exacta del entregable
- **PLATAFORMA**: Directivas específicas para Web, Android, iOS, Tablet, Windows
- **RESTRICCIONES**: Limitaciones y requisitos técnicos
- **CRITERIOS DE CALIDAD**: Estándares a cumplir

**Resultado**: Al pegar estos prompts en una IA, se generan **aplicaciones completas, funcionales y listas para usar**.

## 🎯 Industrias Cubiertas

- 🛢️ **Oil & Gas** — Exploración, producción, refinación, transporte
- ⛏️ **Minería** — Extracción, procesamiento, transporte de minerales
- 💧 **Desalinizadoras** — Plantas de ósmosis inversa
- ⚡ **Energía** — Generación térmica, renovable, subestaciones
- 🤖 **Automatización** — SCADA, PLC, DCS, HMI, MES
- 🏗️ **Full-Stack Industrial** — Aplicaciones completas con IA
- 📚 **Capacitación** — Simuladores, e-learning industrial
- 🔧 **Herramientas** — Utilidades para ingeniería

## 🚀 Características

- ✅ **100% Offline** (PWA con Service Worker stale-while-revalidate)
- ✅ **Multiplataforma** — Web, Android, iOS, Tablet, Windows
- ✅ **Chat IA Integrado** — OpenAI, Anthropic, Groq, DeepSeek, Ollama, LM Studio
- ✅ **Exportación** — PDF, Excel, Email, Clipboard
- ✅ **Búsqueda Inteligente** — Por título, tags, contenido, normas
- ✅ **Favoritos + Historial** — Drawers laterales
- ✅ **Dark/Light Theme** — Modo HMI industrial
- ✅ **Responsive** — Mobile-first, tablets, desktop
- ✅ **Instalable** — PWA con instalación nativa
- ✅ **CI/CD** — GitHub Actions: lint, test, deploy automático
- ✅ **Docker** — Multi-stage build con Nginx + Brotli
- ✅ **56 tests** — Unitarios, integración, E2E (Playwright 4 navegadores)

## 📦 Quick Start

```bash
# Clonar
git clone https://github.com/DeployModeIO/BibliotecaDePromps.git
cd BibliotecaDePromps

# Instalar dependencias
npm ci

# Desarrollo
npm run dev

# Build producción
npm run build

# Docker
docker build -t biblioteca-promps .
docker run -p 8080:80 biblioteca-promps
```

## 🛠️ Scripts

| Comando             | Descripción                                           |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo (http://localhost:3000)        |
| `npm run build`     | Build completo: SCSS → CSS → esbuild → Brotli → dist/ |
| `npm test`          | 56 tests: unitarios + integración                     |
| `npm run test:e2e`  | Playwright E2E (4 navegadores)                        |
| `npm run lint`      | ESLint                                                |
| `npm run format`    | Prettier                                              |
| `npm run precommit` | format:check + lint + test                            |
| `npm run validate`  | lint + test                                           |

## 🏗️ Estructura del Proyecto

```
BibliotecaDePromps/
├── index.html                 # App principal (PWA)
├── landing.html               # Landing page de marketing
├── manifest.json              # Config PWA
├── sw.js                      # Service Worker
├── Dockerfile                 # Docker multi-stage
├── nginx.conf                 # Nginx + Brotli + CSP
├── .github/workflows/         # CI/CD
│   ├── ci.yml                 # Lint + test on push/PR
│   └── deploy.yml             # GitHub Pages auto-deploy
├── scss/                      # SCSS modularizado
│   ├── styles.scss            # Entry point
│   ├── base/_reset.scss
│   ├── themes/_light.scss
│   ├── layout/                # _topbar, _stats, _commandbar, _main, _footer, _responsive
│   └── components/            # _categories, _prompt-cards, _modal, _drawers, _chat
├── css/
│   ├── styles.css             # CSS compilado
│   └── styles.min.css         # CSS comprimido (producción)
├── js/
│   ├── app.js                 # App core (PromptLibrary)
│   ├── ai-chat.js             # Chat IA multi-proveedor
│   ├── prompts-data.js        # Base de datos principal
│   ├── prompts-data-extra.js  # Prompts adicionales
│   ├── prompts-data-v2.js     # Prompts v2
│   ├── prompts-data-fullstack.js  # Prompts full-stack
│   ├── platform-tests.js      # Validación multi-plataforma
│   ├── bpi-worker.js          # Web Worker (search, indexing)
│   └── vendor/                # CDN fallbacks
├── tests/
│   ├── app.test.js            # 15 tests de datos
│   ├── unit.test.js           # 14 tests unitarios
│   └── integration.test.js    # 28 tests de integración
├── e2e/
│   └── app.spec.js            # 20 tests E2E (Playwright)
├── scripts/
│   └── build.js               # esbuild + Brotli build
├── icons/                     # Iconos PWA
├── package.json
├── playwright.config.js
├── vite.config.js
├── .editorconfig
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

## 📊 Estadísticas (v3.3)

| Métrica               | Valor              |
| --------------------- | ------------------ |
| Mega-Prompts          | 80+                |
| Industrias            | 8                  |
| Plataformas           | 5                  |
| Tests                 | 56                 |
| JS minificado         | 28-46% más pequeño |
| CSS modularizado      | 12 archivos SCSS   |
| Brotli                | 17 archivos .br    |
| Lighthouse PWA        | 100%               |
| Dependencias externas | 2 (jszip, marked)  |

## 🐳 Docker

```bash
# Build
docker build -t biblioteca-promps .

# Run
docker run -p 8080:80 biblioteca-promps

# Nginx con Brotli, Gzip, security headers, immutable caching
# Abrir http://localhost:8080
```

## 🌐 Compatibilidad

| Plataforma | Navegadores                   | Estado |
| ---------- | ----------------------------- | ------ |
| Web        | Chrome, Firefox, Edge, Safari | ✅     |
| Android    | Chrome, Firefox, Edge         | ✅     |
| iOS        | Safari                        | ✅     |
| Tablets    | Todos                         | ✅     |
| Windows    | Chrome, Edge, Firefox         | ✅     |

## 📄 Licencia

MIT License — uso libre para fines profesionales y educativos.

---

**Desarrollado con estándares industriales** ⚙️ · v3.3 · Agosto 2026
