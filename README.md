# 🏭 Biblioteca de Promps Industriales v3.5

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
- ✅ **Modo Agente COMPLETO con herramientas** — un botón ⚡ en Configuración avanzada activa todo a la vez: lectura/escritura/edición de archivos del proyecto, `run_command` (cmd o PowerShell) y `web_fetch`. Funciona con modelos locales gratuitos (Ollama, LM Studio, …) y de API (OpenAI, Groq, DeepSeek, Gemini, Anthropic, …): los que soportan tool-calling nativo lo usan, y los que no (p. ej. gemma2, phi3, llava) usan automáticamente un protocolo emulado por bloques JSON con observaciones y reintentos. Ver [Modo agente](#-modo-agente-completo)
- ✅ **Exportación** — PDF, Excel, Email, Clipboard
- ✅ **Búsqueda Inteligente** — Por título, tags, contenido, normas
- ✅ **Favoritos + Historial** — Drawers laterales
- ✅ **Dark/Light Theme** — Modo HMI industrial
- ✅ **Responsive** — Mobile-first, tablets, desktop
- ✅ **Instalable** — PWA con instalación nativa
- ✅ **CI/CD** — GitHub Actions: lint, test, deploy automático
- ✅ **Docker** — Multi-stage build con Nginx + Brotli
- ✅ **179 tests unit + 28 E2E** — Unitarios, integración, Playwright (4 navegadores) y E2E real del modo agente con Ollama

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

| Comando                  | Descripción                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| `npm run dev`            | Servidor de desarrollo (http://localhost:3000)                              |
| `npm run agent-server`   | Servidor agente local (comandos + web fetch) en http://127.0.0.1:4864       |
| `npm run test:agent:e2e` | Prueba E2E real del modo agente: servidor + tools + Ollama nativo y emulado |
| `npm run build`          | Build completo: SCSS → CSS → esbuild → Brotli → dist/                       |
| `npm test`               | 179 tests: unitarios + integración (Jest)                                   |
| `npm run test:e2e`       | Playwright E2E (4 navegadores)                                              |
| `npm run lint`           | ESLint                                                                      |
| `npm run format`         | Prettier                                                                    |
| `npm run precommit`      | format:check + lint + test                                                  |
| `npm run validate`       | lint + test                                                                 |

## 🤖 Modo Agente COMPLETO

Un botón ⚡ en el Chat IA → ⚙ Configuración avanzada → «Modo agente» **activa y fuerza todas las capacidades a la vez**:

| Capacidad            | Herramientas                                                                                      | Requiere                        |
| -------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------- |
| 📁 Leer/archivos     | `list_files`, `read_file`, `search_files`                                                         | — (ya en disco o virtual)       |
| ✏️ Escribir/archivos | `write_file`, `edit_file`, `insert_line`, `append_file`, `move_file`, `delete_file`, `delete_dir` | carpeta seleccionada o servidor |
| 💻 Comandos          | `run_command` (cmd o `shell: "powershell"`)                                                       | `npm run agent-server`          |
| 🌐 Web               | `web_fetch`                                                                                       | servidor (sin CORS) o navegador |

**Modelos locales gratuitos**: los que exponen tool-calling nativo (qwen2.5, llama3.1/3.2, mistral-nemo, deepseek-r1 en Ollama; LM Studio/vLLM con herramientas) lo usan directamente; los que no (gemma2, phi3, llava, KoboldCpp) entran en **modo emulado**: el agente escribe bloques ` ```tool ` con JSON y el motor los ejecuta y responde con la OBSERVACIÓN real, con reintentos automáticos si el JSON llega roto. El cambio entre ambos modos es transparente para el usuario.

**Servidor agente** (`scripts/agent-server.js`, solo escucha 127.0.0.1):

```bash
# Una sola vez: lo instala para iniciarse OCULTO con Windows y lo levanta ahora
npm run agent-server:auto

# (Opcional) levantar manual con raíces/personalizadas:
AGENT_ROOTS="D:/Proyectos,C:/Users/yo/Desktop" AGENT_TOKEN=xyz AGENT_PORT=4864 npm run agent-server
```

Con el autoarranque instalado, **no hay que ejecutar nada a mano**: al pulsar ⚡ la app detecta el servicio, elige proveedor y modelo automáticamente y, si el servicio no estaba, reintenta la conexión sola cada 15 s.

Verificación real end-to-end (servidor + tools + Ollama nativo con `qwen2.5:7b` y emulado con `llama3.2:3b` sobre un prompt de la biblioteca):

```bash
npm run test:agent:e2e        # añade -- --skip-models para omitir los modelos
```

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

## 📊 Estadísticas (v3.5)

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

**Desarrollo con estándares industriales** ⚙️ · v3.5 · Agosto 2026
