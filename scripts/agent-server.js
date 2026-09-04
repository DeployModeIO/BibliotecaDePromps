#!/usr/bin/env node
/* ============================================================
   AGENT SERVER — Servidor local del modo agente del Chat IA.

   Expone operaciones de filesystem, ejecución de comandos y
   web fetch para que el navegador pueda usar herramientas
   poderosas sin los límites de CORS ni del sandbox del browser.

   Seguridad:
   - Solo escucha en 127.0.0.1 (nunca expuesto a la red).
   - Restringe el filesystem a las raíces declaradas (AGENT_ROOTS).
   - Token opcional vía AGENT_TOKEN.

   Uso:
     npm run agent-server
     AGENT_WORKSPACE=D:/Proyectos AGENT_PORT=4864 node scripts/agent-server.js

     # Varias raíces simultáneas (RUTAS absolutas, separadas por coma):
     AGENT_ROOTS="D:/Proyectos,C:/Users/me/Desktop" npm run agent-server

   Endpoints:
     GET    /health                 → { ok, roots, defaultRoot, version, pid }
     GET    /files?path=            → listado recursivo
     GET    /file?path=             → contenido de un archivo
     PUT    /file   {path,content}  → crear/sobrescribir
     POST   /append {path,content}  → añadir al final
     DELETE /file?path=             → eliminar archivo
     DELETE /dir?path=              → eliminar carpeta recursivo
     POST   /move   {from,to}       → mover/renombar
     POST   /search {pattern,path,max_matches} → grep recursivo
     POST   /command {command,cwd,timeout,shell} → cmd o powershell
     POST   /fetch  {url,maxChars}  → web fetch sin CORS

   Requiere Node.js 18+ (usa fetch global).
   ============================================================ */
'use strict';

const http = require('http');
const { exec, spawn } = require('child_process');
const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = parseInt(process.env.AGENT_PORT || process.env.PORT || '4864', 10);
const TOKEN = process.env.AGENT_TOKEN || '';

/* Raíces accesibles: AGENT_ROOTS (coma) > AGENT_WORKSPACE > cwd. */
function parseRoots() {
  const raw = process.env.AGENT_ROOTS || process.env.AGENT_WORKSPACE || process.cwd();
  const list = String(raw)
    .split(delimiter())
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => {
      try {
        return fs.realpathSync(path.resolve(p));
      } catch {
        return path.resolve(p);
      }
    });
  return list.length ? [...new Set(list)] : [process.cwd()];
}
function delimiter() {
  return process.platform === 'win32' ? /[;,]/ : /[,]/;
}

const ROOTS = parseRoots();
const DEFAULT_ROOT = ROOTS[0];

const ALLOWED_ORIGINS = (
  process.env.AGENT_ORIGINS ||
  'http://localhost:3000,http://127.0.0.1:3000,http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173,null'
)
  .split(',')
  .map((s) => s.trim());

const MAX_LIST_ENTRIES = 6000;
const MAX_READ_BYTES = 5 * 1024 * 1024;
const MAX_SEARCH_BYTES = 2 * 1024 * 1024;
const MAX_MATCHES_DEFAULT = 300;
const MAX_COMMAND_TIMEOUT = 600000;

const TEXT_EXT = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.html',
  '.css',
  '.scss',
  '.md',
  '.txt',
  '.yml',
  '.yaml',
  '.xml',
  '.svg',
  '.py',
  '.sh',
  '.sql',
  '.vue',
  '.svelte',
  '.toml',
  '.ini',
  '.env',
  '.csv',
  '.gitignore',
  '.dockerignore',
  '.lock',
]);
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'coverage',
  '.next',
  '.nuxt',
  'out',
  '.cache',
  'build',
  '__pycache__',
  '.venv',
  'venv',
]);

/**
 * Resuelve una ruta dentro de las raíces permitidas.
 * - Rutas relativas → contra la raíz por defecto (o la indicada por `root`).
 * - Rutas absolutas → solo si caen dentro de alguna raíz permitida.
 */
function safePath(p, root) {
  const base = root ? resolveRoot(root) : DEFAULT_ROOT;
  const abs = path.isAbsolute(String(p || '')) ? path.resolve(String(p)) : path.resolve(base, String(p || '.'));
  for (const r of ROOTS) {
    const rel = path.relative(r, abs);
    if (!rel.startsWith('..') && !path.isAbsolute(rel)) return abs;
  }
  throw new Error('Ruta fuera de las raíces permitidas: ' + p + ' — raíces: ' + ROOTS.join(', ') + ' (configura AGENT_ROOTS para ampliar)');
}

function resolveRoot(root) {
  if (root == null || root === '' || Number(root) === 0) return ROOTS[0];
  const idx = typeof root === 'number' ? root : parseInt(root, 10);
  if (!Number.isNaN(idx) && ROOTS[idx]) return ROOTS[idx];
  const byName = ROOTS.find((r) => r === root || r.toLowerCase() === String(root).toLowerCase());
  if (byName) return byName;
  throw new Error('Raíz desconocida: ' + root + ' (válidas: ' + ROOTS.join(', ') + ')');
}

function send(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function setCors(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin) || origin === '') {
    const allow = ALLOWED_ORIGINS.includes('*') ? '*' : origin || ALLOWED_ORIGINS[0];
    res.setHeader('Access-Control-Allow-Origin', allow);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Agent-Token');
}

function authorized(req) {
  if (!TOKEN) return true;
  return (req.headers['x-agent-token'] || '') === TOKEN;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 50 * 1024 * 1024) {
        reject(new Error('body demasiado grande'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (_e) {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

async function walkDir(dir, base, out) {
  if (out.length >= MAX_LIST_ENTRIES) return;
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const e of entries) {
    if (out.length >= MAX_LIST_ENTRIES) {
      out.push('[... truncado: más de ' + MAX_LIST_ENTRIES + ' entradas — usa path para bajar a una subcarpeta]');
      return;
    }
    const rel = base ? base + '/' + e.name : e.name;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue;
      out.push(rel + '/');
      await walkDir(abs, rel, out);
    } else if (e.isFile()) {
      out.push(rel);
    }
  }
}

/** Devuelve {abs, rel:[rutas relativas a abs]} para un directorio inicial. */
async function collectFiles(dir, root) {
  const abs = safePath(dir || '', root);
  const out = [];
  await walkDir(abs, '', out);
  return { abs, entries: out };
}

async function listFiles(dir, root) {
  const { abs, entries } = await collectFiles(dir, root);
  let displayBase = path.relative(DEFAULT_ROOT, abs).replace(/\\/g, '/');
  if (displayBase.startsWith('..') || displayBase === '.') displayBase = '';
  if (!displayBase) return entries;
  return entries.map((f) => (f.endsWith('/') ? displayBase + f : displayBase + '/' + f));
}

async function searchFiles(pattern, dir, root, maxMatches) {
  let re;
  try {
    re = new RegExp(pattern, 'm');
  } catch (_e) {
    re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'm');
  }
  const limit = Math.min(Math.max(1, parseInt(maxMatches, 10) || MAX_MATCHES_DEFAULT), 2000);
  const { abs, entries } = await collectFiles(dir || '', root);
  let displayBase = path.relative(DEFAULT_ROOT, abs).replace(/\\/g, '/');
  if (displayBase.startsWith('..') || displayBase === '.') displayBase = '';
  const files = entries.filter((f) => !f.endsWith('/') && TEXT_EXT.has(path.extname(f).toLowerCase()));
  const matches = [];
  for (const f of files) {
    if (matches.length >= limit) {
      matches.push({ file: '[...]', line: 0, text: ' truncado a ' + limit + ' coincidencias — acota path o pattern' });
      break;
    }
    let content;
    try {
      const fileAbs = path.join(abs, f);
      const st = await fsp.stat(fileAbs);
      if (st.size > MAX_SEARCH_BYTES) continue;
      content = await fsp.readFile(fileAbs, 'utf8');
    } catch (_e) {
      continue;
    }
    const display = displayBase ? displayBase + '/' + f : f;
    content.split('\n').forEach((text, i) => {
      if (matches.length < limit && re.test(text)) matches.push({ file: display, line: i + 1, text: text.trim().slice(0, 500) });
    });
  }
  return matches;
}

function runCommand(command, cwd, timeout, shell) {
  return new Promise((resolve) => {
    const ms = Math.min(Math.max(1000, timeout || 30000), MAX_COMMAND_TIMEOUT);
    const opts = { timeout: ms, maxBuffer: 10 * 1024 * 1024, windowsHide: true };
    try {
      opts.cwd = safePath(cwd || '');
    } catch (e) {
      resolve({ exitCode: 1, stdout: '', stderr: String(e.message || e), timedOut: false });
      return;
    }
    const cmd = String(command || '');
    if (!cmd.trim()) {
      resolve({ exitCode: 1, stdout: '', stderr: 'comando vacío', timedOut: false });
      return;
    }
    if (shell === 'powershell') {
      const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', cmd], opts);
      let stdout = '';
      let stderr = '';
      let killed = false;
      const timer = setTimeout(() => {
        killed = true;
        child.kill('SIGKILL');
      }, ms);
      child.stdout.on('data', (d) => {
        if (stdout.length < 5 * 1024 * 1024) stdout += d;
      });
      child.stderr.on('data', (d) => {
        if (stderr.length < 5 * 1024 * 1024) stderr += d;
      });
      child.on('error', (err) => {
        clearTimeout(timer);
        resolve({ exitCode: 1, stdout, stderr: String(err.message || err), timedOut: killed });
      });
      child.on('close', (code) => {
        clearTimeout(timer);
        resolve({ exitCode: code == null ? (killed ? 124 : 1) : code, stdout, stderr, timedOut: killed });
      });
      return;
    }
    exec(cmd, opts, (err, stdout, stderr) => {
      resolve({
        exitCode: err ? (typeof err.code === 'number' ? err.code : 1) : 0,
        stdout: String(stdout || ''),
        stderr: String(stderr || ''),
        timedOut: !!(err && err.killed),
      });
    });
  });
}

async function webFetch(url, maxChars) {
  if (typeof fetch === 'undefined') {
    throw new Error('Este servidor requiere Node.js 18+ para usar fetch.');
  }
  const parsed = new URL(String(url));
  if (!/^https?:$/.test(parsed.protocol)) throw new Error('Solo se permiten URLs http/https');
  const limit = Math.min(Math.max(1000, maxChars || 20000), 200000);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 20000);
  try {
    const resp = await fetch(parsed, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'BPI-Agent/1.1' },
    });
    const buf = await resp.arrayBuffer();
    if (buf.byteLength > 20 * 1024 * 1024) throw new Error('respuesta demasiado grande (>20MB)');
    let text = Buffer.from(buf).toString('utf8');
    if (text.length > limit) text = text.slice(0, limit) + '\n... [truncado]';
    return { status: resp.status, contentType: resp.headers.get('content-type') || '', text };
  } catch (err) {
    if (err && err.name === 'AbortError') throw new Error('timeout (20s) descargando ' + url);
    throw err;
  } finally {
    clearTimeout(t);
  }
}

function httpError(err, res) {
  const msg = err.message || String(err);
  if (/ENOENT/.test(msg)) {
    send(res, 404, { error: 'No existe la ruta: ' + (err.path ? String(err.path).split(path.sep).slice(-3).join('/') : '') });
    return;
  }
  if (/EISDIR/.test(msg)) {
    send(res, 400, { error: 'Es una carpeta, no un archivo — usa list_files' });
    return;
  }
  send(res, 400, { error: msg });
}

function createServer() {
  return http.createServer(async (req, res) => {
    setCors(req, res);
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }
    if (!authorized(req)) {
      send(res, 401, { error: 'Token inválido' });
      return;
    }

    const url = new URL(req.url, 'http://' + HOST + ':' + PORT);
    const route = url.pathname;
    try {
      if (route === '/health' && req.method === 'GET') {
        send(res, 200, { ok: true, workspace: DEFAULT_ROOT, roots: ROOTS, version: '1.1.0', pid: process.pid });
        return;
      }
      if (route === '/files' && req.method === 'GET') {
        send(res, 200, { ok: true, files: await listFiles(url.searchParams.get('path') || '', url.searchParams.get('root') || '') });
        return;
      }
      if (route === '/file' && req.method === 'GET') {
        const abs = safePath(url.searchParams.get('path') || '', url.searchParams.get('root') || '');
        const st = await fsp.stat(abs);
        if (st.isDirectory()) throw Object.assign(new Error('EISDIR'), { path: abs });
        if (st.size > MAX_READ_BYTES) {
          const buf = await fsp.readFile(abs);
          send(res, 200, { ok: true, truncated: true, content: buf.subarray(0, MAX_READ_BYTES).toString('utf8') });
          return;
        }
        const content = await fsp.readFile(abs, 'utf8');
        send(res, 200, { ok: true, content });
        return;
      }
      if (route === '/file' && req.method === 'PUT') {
        const body = await readBody(req);
        const abs = safePath(body.path || '', body.root);
        await fsp.mkdir(path.dirname(abs), { recursive: true });
        await fsp.writeFile(abs, String(body.content == null ? '' : body.content), 'utf8');
        send(res, 200, { ok: true, path: body.path, bytes: String(body.content || '').length });
        return;
      }
      if (route === '/append' && req.method === 'POST') {
        const body = await readBody(req);
        const abs = safePath(body.path || '', body.root);
        await fsp.mkdir(path.dirname(abs), { recursive: true });
        await fsp.appendFile(abs, String(body.content == null ? '' : body.content), 'utf8');
        const st = await fsp.stat(abs);
        send(res, 200, { ok: true, path: body.path, bytes: st.size });
        return;
      }
      if (route === '/file' && req.method === 'DELETE') {
        const abs = safePath(url.searchParams.get('path') || '', url.searchParams.get('root') || '');
        await fsp.unlink(abs);
        send(res, 200, { ok: true, deleted: true });
        return;
      }
      if (route === '/dir' && req.method === 'DELETE') {
        const abs = safePath(url.searchParams.get('path') || '', url.searchParams.get('root') || '');
        if (ROOTS.includes(abs)) throw new Error('no se puede borrar una raíz completa');
        await fsp.rm(abs, { recursive: true, force: true });
        send(res, 200, { ok: true, deleted: true });
        return;
      }
      if (route === '/move' && req.method === 'POST') {
        const body = await readBody(req);
        const from = safePath(body.from || '', body.root);
        const to = safePath(body.to || '', body.root);
        await fsp.mkdir(path.dirname(to), { recursive: true });
        await fsp.rename(from, to);
        send(res, 200, { ok: true, from: body.from, to: body.to });
        return;
      }
      if (route === '/search' && req.method === 'POST') {
        const body = await readBody(req);
        const matches = await searchFiles(body.pattern, body.path || '', body.root || '', body.max_matches);
        send(res, 200, { ok: true, matches });
        return;
      }
      if (route === '/command' && req.method === 'POST') {
        const body = await readBody(req);
        const result = await runCommand(body.command, body.cwd, body.timeout, body.shell);
        send(res, 200, { ok: true, ...result });
        return;
      }
      if (route === '/fetch' && req.method === 'POST') {
        const body = await readBody(req);
        const result = await webFetch(body.url, body.maxChars);
        send(res, 200, { ok: true, ...result });
        return;
      }
      send(res, 404, { error: 'Ruta no encontrada: ' + route });
    } catch (err) {
      httpError(err, res);
    }
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    console.log('============================================');
    console.log('  🛠️  Servidor Agente BPI v1.1 (modo agente)');
    console.log('  URL: http://' + HOST + ':' + PORT);
    console.log('  Raíz por defecto: ' + DEFAULT_ROOT);
    if (ROOTS.length > 1) console.log('  Raíces: ' + ROOTS.join(' | '));
    console.log(TOKEN ? '  Token: configurado' : '  Token: (sin token — úsalo solo en esta máquina)');
    console.log('  Detén con Ctrl+C.');
    console.log('============================================');
  });
}

module.exports = {
  createServer,
  safePath,
  runCommand,
  webFetch,
  listFiles,
  searchFiles,
  parseRoots,
  WORKSPACE: DEFAULT_ROOT,
  ROOTS,
};
