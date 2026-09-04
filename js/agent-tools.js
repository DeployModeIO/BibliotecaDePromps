/* global module */
/* ============================================================
   AGENT TOOLS — Herramientas de lectura/escritura/edición de
   archivos para el modo agente del Chat IA.

   Define el catálogo de funciones (tool calling) que los modelos
   locales pueden invocar para generar proyectos completos, junto
   con un backend de archivos:
   - Sistema de archivos REAL (File System Access API) cuando el
     usuario selecciona una carpeta.
   - Sistema de archivos VIRTUAL (en memoria) como respaldo, que
     luego se puede descargar como ZIP.

   UMD: funciona en navegador (window/self) y en Node (module.exports)
   para poder testearse con Jest sin DOM.
   ============================================================ */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = mod;
  }
  if (root) {
    root.AgentTools = mod;
  }
})(typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

  /* ------------------------------------------------------------
     Catálogo de herramientas (formato compatible con OpenAI y Ollama)
     ------------------------------------------------------------ */
  const TOOLS = [
    {
      type: 'function',
      function: {
        name: 'list_files',
        description:
          'Lista los archivos y carpetas existentes dentro del proyecto. Devuelve rutas relativas ordenadas. Úsala para conocer la estructura actual antes de escribir o editar.',
        parameters: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Subcarpeta a listar. Vacío o ausente = raíz del proyecto.',
            },
          },
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'read_file',
        description:
          'Lee un archivo del proyecto. Puede devolver todo el archivo o solo un rango de líneas usando start_line/end_line (1-based, inclusivas).',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Ruta relativa del archivo, p.ej. "src/app.js".' },
            start_line: { type: 'number', description: 'Primera línea a leer (opcional).' },
            end_line: { type: 'number', description: 'Última línea a leer (opcional).' },
          },
          required: ['path'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'write_file',
        description:
          'Crea o sobrescribe un archivo con el contenido proporcionado. Crea las subcarpetas necesarias automáticamente. Usa una llamada por archivo.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Ruta relativa del archivo, p.ej. "index.html".' },
            content: { type: 'string', description: 'Contenido completo del archivo.' },
          },
          required: ['path', 'content'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'edit_file',
        description:
          'Edita un archivo reemplazando old_text por new_text. Si replace_all es true reemplaza todas las coincidencias; si no, solo la primera. Útil para cambios puntuales sin reescribir todo el archivo.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Ruta relativa del archivo a editar.' },
            old_text: { type: 'string', description: 'Fragmento exacto a reemplazar.' },
            new_text: { type: 'string', description: 'Texto de reemplazo.' },
            replace_all: { type: 'boolean', description: 'Si es true reemplaza todas las coincidencias.' },
          },
          required: ['path', 'old_text', 'new_text'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'delete_file',
        description: 'Elimina un archivo del proyecto.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Ruta relativa del archivo a eliminar.' },
          },
          required: ['path'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'insert_line',
        description:
          'Inserta contenido ANTES de la línea indicada (1-based) en un archivo. Útil para añadir imports, funciones o secciones sin reescribir todo el archivo.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Ruta relativa del archivo.' },
            line: { type: 'number', description: 'Número de línea antes de la cual insertar (1-based).' },
            content: { type: 'string', description: 'Contenido a insertar (una o varias líneas).' },
          },
          required: ['path', 'line', 'content'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'search_files',
        description:
          'Busca un patrón (expresión regular) en los archivos del proyecto y devuelve las coincidencias con archivo, número de línea y texto. Equivale a un grep recursivo.',
        parameters: {
          type: 'object',
          properties: {
            pattern: { type: 'string', description: 'Expresión regular a buscar, p.ej. "function\\s+render".' },
            path: { type: 'string', description: 'Subcarpeta donde buscar. Vacío = todo el proyecto.' },
          },
          required: ['pattern'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'append_file',
        description: 'Añade contenido al FINAL de un archivo (o lo crea). Útil para archivos grandes escritos por partes.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Ruta relativa del archivo.' },
            content: { type: 'string', description: 'Contenido a añadir al final.' },
          },
          required: ['path', 'content'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'move_file',
        description: 'Mueve o renombra un archivo dentro del proyecto.',
        parameters: {
          type: 'object',
          properties: {
            from: { type: 'string', description: 'Ruta actual del archivo.' },
            to: { type: 'string', description: 'Ruta destino (crea las carpetas que falten).' },
          },
          required: ['from', 'to'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'delete_dir',
        description: 'Elimina una carpeta completa con todo su contenido (recursivo). Úsalo con precaución.',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Ruta relativa de la carpeta a eliminar.' },
          },
          required: ['path'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'run_command',
        description:
          'Ejecuta un comando de shell en la carpeta de trabajo y devuelve stdout, stderr y código de salida. Requiere el servicio de agente local (la app lo conecta automáticamente cuando está disponible). Útil para instalar dependencias, correr tests, builds, git, etc.',
        parameters: {
          type: 'object',
          properties: {
            command: { type: 'string', description: 'Comando de shell a ejecutar.' },
            cwd: { type: 'string', description: 'Directorio de trabajo relativo (opcional).' },
            timeout: { type: 'number', description: 'Tiempo máximo en milisegundos (opcional, por defecto 30000).' },
            shell: { type: 'string', description: '"cmd" (por defecto) o "powershell" en Windows.' },
          },
          required: ['command'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'web_fetch',
        description:
          'Descarga el contenido de una URL (HTML/texto) y devuelve el texto extraído. Útil para consultar documentación, APIs o recursos web. Sin servidor agente, depende de CORS del navegador.',
        parameters: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'URL a descargar (http/https).' },
            max_chars: { type: 'number', description: 'Máximo de caracteres a devolver (opcional, por defecto 20000).' },
          },
          required: ['url'],
        },
      },
    },
  ];

  /** Herramientas que requieren el servidor agente local. */
  const SERVER_ONLY_TOOLS = new Set(['run_command']);
  /** Herramientas de lectoescritura de archivos del proyecto. */
  const FS_TOOLS = new Set(['list_files', 'read_file', 'write_file', 'edit_file', 'delete_file', 'insert_line', 'search_files']);

  /* ------------------------------------------------------------
     Prompt de sistema del agente de código
     ------------------------------------------------------------ */
  const SYSTEM_PROMPT = [
    'Eres un agente de desarrollo de software autónomo que construye proyectos completos, funcionales y listos para usar.',
    '',
    'Dispones de estas herramientas:',
    '- list_files: lista los archivos del proyecto.',
    '- search_files: busca un patrón (regex) en los archivos.',
    '- read_file: lee un archivo (o un rango de líneas).',
    '- write_file: crea o sobrescribe un archivo.',
    '- append_file: añade contenido al final de un archivo.',
    '- edit_file: edita un archivo reemplazando texto.',
    '- insert_line: inserta líneas en una posición exacta.',
    '- delete_file: elimina un archivo.',
    '- delete_dir: elimina una carpeta recursivamente.',
    '- move_file: mueve o renombra un archivo.',
    '- run_command: ejecuta comandos de shell (instalar, testear, compilar, git...).',
    '- web_fetch: descarga contenido de una URL.',
    '',
    'REGLAS OBLIGATORIAS:',
    '1. Escribe SIEMPRE el código dentro de archivos con write_file (una llamada por archivo). NO imprimas bloques de código largos en el chat.',
    '2. Genera todos los archivos necesarios para que el proyecto funcione (HTML, CSS, JS, package.json, README, etc.).',
    '3. Usa rutas relativas dentro de TU carpeta de proyecto. El sistema añade el prefijo automáticamente; NO escribas rutas absolutas como "/path/to/..." ni "C:\\...".',
    '4. EJECUTA las herramientas de verdad: NO digas "crearemos", "vamos a generar" ni muestres el JSON como ejemplo en el chat. Llama a write_file y ESPERA la OBSERVACIÓN antes de continuar.',
    '5. Antes de editar o sobrescribir, lee el archivo con read_file o búscalo con search_files para no romper el trabajo previo.',
    '6. Usa run_command para validar tu trabajo (instalar dependencias, correr tests, build) y corrige los errores que aparezcan.',
    '7. Usa web_fetch solo para consultar documentación o recursos externos.',
    '8. En el chat responde SOLO con un resumen breve de lo generado y las instrucciones para ejecutarlo.',
    '9. Si te falta información, haz la suposición más razonable y continúa.',
    '10. Si una herramienta devuelve un error, corrige los parámetros y reintenta una vez; si vuelve a fallar, continúa con otro enfoque.',
  ].join('\n');

  /* ------------------------------------------------------------
     Utilidades
     ------------------------------------------------------------ */

  /** Normaliza una ruta relativa (separadores, sin slashes extremos). */
  function normalizePath(p) {
    return String(p == null ? '' : p)
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');
  }

  function pathParts(p) {
    return normalizePath(p).split('/').filter(Boolean);
  }

  /**
   * Convierte los argumentos recibidos del modelo en un objeto.
   * Acepta objeto nativo (Ollama) o cadena JSON (OpenAI), e intenta
   * rescatar JSON rodeado de texto extra.
   */
  /* Alias frecuentes de modelos débiles: "file"/"filename"/"filepath" → "path" */
  function normalizeArgAliases(args) {
    if (!args || typeof args !== 'object' || Array.isArray(args)) return args;
    if (args.path === undefined && args.file !== undefined) {
      args.path = args.file;
      delete args.file;
    } else if (args.path === undefined && args.filename !== undefined) {
      args.path = args.filename;
      delete args.filename;
    } else if (args.path === undefined && args.filepath !== undefined) {
      args.path = args.filepath;
      delete args.filepath;
    }
    return args;
  }

  function parseToolArguments(raw) {
    if (raw == null) return {};
    if (typeof raw === 'object') return normalizeArgAliases(raw);
    if (typeof raw !== 'string') return {};
    const s = raw.trim();
    if (!s) return {};
    try {
      const parsed = JSON.parse(s);
      return parsed && typeof parsed === 'object' ? normalizeArgAliases(parsed) : {};
    } catch (_e) {
      const start = s.indexOf('{');
      const end = s.lastIndexOf('}');
      if (start !== -1 && end > start) {
        try {
          const parsed = JSON.parse(s.slice(start, end + 1));
          return parsed && typeof parsed === 'object' ? normalizeArgAliases(parsed) : {};
        } catch (_e2) {
          /* ignore */
        }
      }
      return {};
    }
  }

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function safeRegExp(pattern) {
    try {
      return new RegExp(pattern);
    } catch (_e) {
      return new RegExp(escapeRegExp(pattern));
    }
  }

  function truncate(s, max) {
    s = String(s == null ? '' : s);
    const limit = max == null ? 20000 : max;
    return s.length > limit ? s.slice(0, limit) + '\n... [truncado]' : s;
  }

  function stripHtml(html) {
    return String(html == null ? '' : html)
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  async function serverRequest(baseUrl, token, method, route, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['X-Agent-Token'] = token;
    const resp = await fetch(String(baseUrl || '').replace(/\/+$/, '') + route, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await resp.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (_e) {
      data = { text };
    }
    if (!resp.ok) throw new Error(data.error || 'Error del servidor agente (' + resp.status + ')');
    return data;
  }

  /* ------------------------------------------------------------
     Sistema de archivos VIRTUAL (respaldo en memoria)
     ------------------------------------------------------------ */
  class VirtualFS {
    constructor() {
      this.files = new Map();
    }

    listFiles(dir) {
      const prefix = normalizePath(dir);
      const out = [];
      for (const p of this.files.keys()) {
        if (!prefix || p === prefix || p.startsWith(prefix + '/')) {
          out.push(p);
        }
      }
      return out.sort();
    }

    searchFiles(pattern, dir) {
      const re = safeRegExp(pattern);
      const matches = [];
      for (const p of this.listFiles(dir)) {
        const lines = this.readFile(p).split('\n');
        lines.forEach((text, i) => {
          if (re.test(text)) matches.push({ file: p, line: i + 1, text: text.trim() });
        });
      }
      return matches;
    }

    readFile(path, start, end) {
      const p = normalizePath(path);
      if (!this.files.has(p)) throw new Error('Archivo no encontrado: ' + p);
      const lines = this.files.get(p).split('\n');
      const s = start == null ? 1 : Math.max(1, start);
      const e = end == null ? lines.length : Math.min(lines.length, end);
      if (s > lines.length) return '';
      return lines.slice(s - 1, e).join('\n');
    }

    writeFile(path, content) {
      const p = normalizePath(path);
      if (!p) throw new Error('Ruta de archivo vacía');
      const text = String(content == null ? '' : content);
      this.files.set(p, text);
      return { path: p, bytes: text.length };
    }

    editFile(path, oldText, newText, replaceAll) {
      const p = normalizePath(path);
      const current = this.readFile(p);
      if (!current.includes(oldText)) {
        throw new Error('No se encontró el texto a reemplazar en ' + p);
      }
      const next = replaceAll ? current.split(oldText).join(newText) : current.replace(oldText, newText);
      this.files.set(p, next);
      return { path: p, replaced: true };
    }

    insertLine(path, line, content) {
      const p = normalizePath(path);
      const current = this.readFile(p);
      const lines = current.split('\n');
      const idx = line == null ? lines.length : Math.max(0, Math.min(lines.length, line - 1));
      lines.splice(idx, 0, String(content == null ? '' : content));
      this.files.set(p, lines.join('\n'));
      return { path: p, inserted: true };
    }

    deleteFile(path) {
      const p = normalizePath(path);
      if (!this.files.has(p)) throw new Error('Archivo no encontrado: ' + p);
      this.files.delete(p);
      return { path: p, deleted: true };
    }

    getFiles() {
      return [...this.files.entries()].map(([name, content]) => ({ name, content })).sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  /* ------------------------------------------------------------
     Runner de herramientas (real o virtual)
     ------------------------------------------------------------ */
  function createToolRunner(options) {
    const rootDir = (options && options.rootDirHandle) || null;
    const server = (options && options.server) || null;
    const virtual = !rootDir && !server ? new VirtualFS() : null;
    const isVirtual = !rootDir && !server;

    /* Prefijo de carpeta de proyecto: TODA ruta relativa del agente vive dentro.
       Evita que el agente escriba encima de otros proyectos o de la propia app. */
    let prefix = normalizePrefix(options && options.prefix);
    function normalizePrefix(p) {
      const s = String(p == null ? '' : p).replace(/\\/g, '/').replace(/^\.?\/+/, '').replace(/\/+$/, '').trim();
      return s ? s + '/' : '';
    }
    function applyPrefix(v) {
      if (typeof v !== 'string' || !v.trim()) return prefix ? prefix.replace(/\/$/, '') : v; // '' = raíz del proyecto
      const s = v.replace(/\\/g, '/').trim().replace(/^\.\//, '');
      if (s.startsWith('/') || /^[a-zA-Z]:/.test(s) || s.startsWith('..')) return v; // absoluta: el servidor la valida contra las raíces
      if (!prefix) return s;
      if (s === '.' || s + '/' === prefix) return prefix.replace(/\/$/, '');
      if (s.startsWith(prefix)) return s;
      return prefix + s;
    }
    function setPrefix(p) {
      prefix = normalizePrefix(p);
    }
    function getPrefix() {
      return prefix;
    }

    /* ---- Operaciones sobre File System Access API ---- */

    async function resolveRealDir(parts, create) {
      let dir = rootDir;
      for (const part of parts) {
        dir = await dir.getDirectoryHandle(part, { create: !!create });
      }
      return dir;
    }

    async function realReadFile(path) {
      const parts = pathParts(path);
      if (!parts.length) throw new Error('Ruta de archivo vacía');
      const dir = await resolveRealDir(parts.slice(0, -1), false);
      const fileHandle = await dir.getFileHandle(parts[parts.length - 1]);
      const file = await fileHandle.getFile();
      return await file.text();
    }

    async function realWriteFile(path, content) {
      const parts = pathParts(path);
      if (!parts.length) throw new Error('Ruta de archivo vacía');
      const dir = await resolveRealDir(parts.slice(0, -1), true);
      const fileHandle = await dir.getFileHandle(parts[parts.length - 1], { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(String(content == null ? '' : content));
      await writable.close();
      return { path: parts.join('/'), bytes: String(content).length };
    }

    async function realDeleteFile(path) {
      const parts = pathParts(path);
      if (!parts.length) throw new Error('Ruta de archivo vacía');
      const dir = await resolveRealDir(parts.slice(0, -1), false);
      await dir.removeEntry(parts[parts.length - 1]);
      return { path: parts.join('/'), deleted: true };
    }

    async function realList(dir) {
      const base = normalizePath(dir);
      const out = [];
      async function walk(handle, prefix) {
        for await (const [name, h] of handle.entries()) {
          const rel = prefix ? prefix + '/' + name : name;
          if (h.kind === 'file') {
            out.push(rel);
          } else {
            out.push(rel + '/');
            await walk(h, rel);
          }
        }
      }
      let target = rootDir;
      if (base) target = await resolveRealDir(pathParts(dir), false);
      await walk(target, base);
      return out.sort();
    }

    /* ---- Backends de bajo nivel (servidor → carpeta → virtual) ---- */

    async function listRaw(dir) {
      if (server) {
        const data = await serverRequest(server.url, server.token, 'GET', '/files?path=' + encodeURIComponent(dir || ''));
        return data.files || [];
      }
      if (virtual) return virtual.listFiles(dir);
      return realList(dir);
    }

    async function readRaw(path) {
      if (server) {
        const data = await serverRequest(server.url, server.token, 'GET', '/file?path=' + encodeURIComponent(path));
        return data.content || '';
      }
      if (virtual) return virtual.readFile(path);
      return realReadFile(path);
    }

    async function writeRaw(path, content) {
      if (server) {
        await serverRequest(server.url, server.token, 'PUT', '/file', { path, content: String(content == null ? '' : content) });
        return { path: normalizePath(path), bytes: String(content).length };
      }
      if (virtual) return virtual.writeFile(path, content);
      return realWriteFile(path, content);
    }

    async function deleteRaw(path) {
      if (server) {
        await serverRequest(server.url, server.token, 'DELETE', '/file?path=' + encodeURIComponent(path));
        return { path: normalizePath(path), deleted: true };
      }
      if (virtual) return virtual.deleteFile(path);
      return realDeleteFile(path);
    }

    async function appendRaw(path, content) {
      const text = String(content == null ? '' : content);
      if (server) {
        await serverRequest(server.url, server.token, 'POST', '/append', { path, content: text });
        return { path: normalizePath(path), appended: true, bytes: text.length };
      }
      if (virtual) {
        const existing = virtual.listFiles('').includes(normalizePath(path)) ? virtual.readFile(path) : '';
        return virtual.writeFile(path, existing + text);
      }
      try {
        const current = await realReadFile(path);
        return realWriteFile(path, current + text);
      } catch (_e) {
        return realWriteFile(path, text);
      }
    }

    async function moveRaw(from, to) {
      if (server) {
        await serverRequest(server.url, server.token, 'POST', '/move', { from, to });
        return { from: normalizePath(from), to: normalizePath(to), moved: true };
      }
      if (virtual) {
        const content = virtual.readFile(from);
        virtual.writeFile(to, content);
        virtual.deleteFile(from);
        return { from: normalizePath(from), to: normalizePath(to), moved: true };
      }
      throw new Error('move_file entre carpetas reales requiere el servicio de agente local (se conecta automáticamente).');
    }

    async function deleteDirRaw(path) {
      if (server) {
        await serverRequest(server.url, server.token, 'DELETE', '/dir?path=' + encodeURIComponent(path));
        return { path: normalizePath(path), deleted: true };
      }
      if (virtual) {
        const prefix = normalizePath(path) + '/';
        let n = 0;
        for (const f of virtual.listFiles(prefix)) {
          virtual.deleteFile(f);
          n++;
        }
        return { path: normalizePath(path), deleted: true, files: n };
      }
      throw new Error('delete_dir sobre carpetas reales requiere el servicio de agente local (se conecta automáticamente).');
    }

    async function searchRaw(pattern, dir) {
      try {
        if (server) {
          const data = await serverRequest(server.url, server.token, 'POST', '/search', { pattern, path: dir || '' });
          return data.matches || [];
        }
        if (virtual) return virtual.searchFiles(pattern, dir);
        const re = safeRegExp(pattern);
        const matches = [];
        for (const f of await realList(dir)) {
          const content = await realReadFile(f);
          content.split('\n').forEach((text, i) => {
            if (re.test(text)) matches.push({ file: f, line: i + 1, text: text.trim() });
          });
        }
        return matches;
      } catch (err) {
        const m = (err && err.message) || String(err);
        if (/ENOTDIR/.test(m)) {
          throw new Error('search_files necesita una CARPETA en path (no un archivo). Usa path vacío para buscar en todo el proyecto.');
        }
        throw err;
      }
    }

    /* ---- Operaciones de alto nivel ---- */

    async function readFile(path, start, end) {
      const content = await readRaw(path);
      if (start == null && end == null) return content;
      const lines = content.split('\n');
      const s = start == null ? 1 : Math.max(1, start);
      const e = end == null ? lines.length : Math.min(lines.length, end);
      return lines.slice(s - 1, e).join('\n');
    }

    async function editFile(path, oldText, newText, replaceAll) {
      const current = await readRaw(path);
      if (!current.includes(oldText)) {
        throw new Error('No se encontró el texto a reemplazar en ' + normalizePath(path));
      }
      const next = replaceAll ? current.split(oldText).join(newText) : current.replace(oldText, newText);
      await writeRaw(path, next);
      return { path: normalizePath(path), replaced: true };
    }

    async function insertLine(path, line, content) {
      const current = await readRaw(path);
      const lines = current.split('\n');
      const idx = line == null ? lines.length : Math.max(0, Math.min(lines.length, line - 1));
      lines.splice(idx, 0, String(content == null ? '' : content));
      await writeRaw(path, lines.join('\n'));
      return { path: normalizePath(path), inserted: true };
    }

    async function runCommand(command, cwd, timeout, shell) {
      if (!server) {
        throw new Error('run_command requiere el servicio de agente local, que se reconecta automáticamente. Ahora mismo no está disponible: continúa usando write_file/edit_file.');
      }
      const data = await serverRequest(server.url, server.token, 'POST', '/command', {
        command,
        cwd: cwd || '',
        timeout: timeout || 30000,
        shell: shell || 'cmd',
      });
      return { exitCode: data.exitCode, stdout: data.stdout, stderr: data.stderr, timedOut: !!data.timedOut };
    }

    async function webFetch(url, maxChars) {
      const limit = maxChars || 20000;
      if (server) {
        const data = await serverRequest(server.url, server.token, 'POST', '/fetch', { url, maxChars: limit });
        const isHtml = /html|xml/i.test(data.contentType || '');
        return {
          status: data.status,
          contentType: data.contentType,
          text: truncate(isHtml ? stripHtml(data.text || '') : data.text || '', limit),
        };
      }
      if (typeof fetch !== 'undefined') {
        const resp = await fetch(url);
        const raw = await resp.text();
        return {
          status: resp.status,
          contentType: resp.headers.get('content-type') || '',
          text: truncate(stripHtml(raw), limit),
        };
      }
      throw new Error('web_fetch no disponible: sin servidor agente ni fetch en el navegador.');
    }

    async function run(name, rawArgs) {
      const args = parseToolArguments(rawArgs);
      if ((name === 'list_files' || name === 'search_files') && args.path == null) args.path = '';
      if (args.path != null) args.path = applyPrefix(args.path);
      if (args.from != null) args.from = applyPrefix(args.from);
      if (args.to != null) args.to = applyPrefix(args.to);
      if (name === 'run_command' && prefix && (!args.cwd || !String(args.cwd).trim())) args.cwd = prefix.replace(/\/$/, '');
      switch (name) {
        case 'list_files':
          try {
            return { files: await listRaw(args.path) };
          } catch (err) {
            const msg = err && err.message ? err.message : String(err);
            if (/fuera de las ra/i.test(msg)) throw err;
            if (/no existe|not found|ENOENT/i.test(msg)) {
              throw new Error('La carpeta "' + args.path + '" no existe. Usa list_files SIN path para ver la raíz del proyecto.');
            }
            throw err;
          }
        case 'search_files':
          return { matches: await searchRaw(args.pattern, args.path) };
        case 'read_file':
          return { path: normalizePath(args.path), content: await readFile(args.path, args.start_line, args.end_line) };
        case 'write_file':
          return await writeRaw(args.path, args.content);
        case 'append_file':
          return await appendRaw(args.path, args.content);
        case 'edit_file':
          return await editFile(args.path, args.old_text, args.new_text, !!args.replace_all);
        case 'insert_line':
          return await insertLine(args.path, args.line, args.content);
        case 'delete_file':
          return await deleteRaw(args.path);
        case 'delete_dir':
          return await deleteDirRaw(args.path);
        case 'move_file':
          return await moveRaw(args.from, args.to);
        case 'run_command':
          return await runCommand(args.command, args.cwd, args.timeout, args.shell);
        case 'web_fetch':
          return await webFetch(args.url, args.max_chars);
        default:
          throw new Error('Herramienta desconocida: ' + name);
      }
    }

    /** Lista de rutas generadas (resumen). */
    async function listAll() {
      return listRaw('');
    }

    /** Archivos descargables (solo en modo virtual; real ya está en disco). */
    function getVirtualFiles() {
      return isVirtual ? virtual.getFiles() : [];
    }

    function getCapabilities() {
      return { server: !!server, filesystem: !!rootDir, virtual: isVirtual };
    }

    return { run, listAll, getVirtualFiles, isVirtual, getCapabilities, getPrefix, setPrefix };
  }

  /**
   * Devuelve las herramientas visibles según capacidades.
   * caps = { filesystem, commands, web } — la de fs (lectura/escritura) siempre si filesystem.
   */
  function filterToolsByCapabilities(caps) {
    const useFs = !caps || caps.filesystem !== false;
    const useCommands = !!(caps && caps.commands);
    const useWeb = !!(caps && caps.web);
    return TOOLS.filter((t) => {
      const n = t.function.name;
      if (n === 'run_command') return useCommands;
      if (n === 'web_fetch') return useWeb;
      return useFs; // resto: lectura/escritura de archivos
    });
  }

  return {
    TOOLS,
    FS_TOOLS,
    SERVER_ONLY_TOOLS,
    filterToolsByCapabilities,
    SYSTEM_PROMPT,
    parseToolArguments,
    normalizePath,
    VirtualFS,
    createToolRunner,
    stripHtml,
    truncate,
    serverRequest,
  };
});
