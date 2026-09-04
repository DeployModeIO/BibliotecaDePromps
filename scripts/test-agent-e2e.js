#!/usr/bin/env node
/* ============================================================
   E2E DEL MODO AGENTE — verifica el flujo completo REAL:
   1. Servidor agente (filesystem + comandos + web fetch)
   2. Runner AgentTools tool-por-tool sobre disco real
   3. Bucle de agente con OLLAMA NATIVO (qwen2.5:7b) — genera un
      proyecto desde un prompt básico de la biblioteca
   4. Bucle de agente EMULADO por JSON (llama3.2:3b forzado)
   Workspaces: C:/Users/Deploy/Desktop/Test (o AGENT_E2E_WS)
   Uso: node scripts/test-agent-e2e.js [--skip-models]
   ============================================================ */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');

const REPO = path.join(__dirname, '..');
const WS = process.env.AGENT_E2E_WS || path.join(os.homedir(), 'Desktop', 'Test');
const OLLAMA_CHAT = process.env.OLLAMA_CHAT || 'http://localhost:11434/api/chat';
const SKIP_MODELS = process.argv.includes('--skip-models');

process.env.AGENT_WORKSPACE = WS; // el servidor restringe todo a este workspace

const AgentTools = require(path.join(REPO, 'js/agent-tools.js'));
const AIChat = require(path.join(REPO, 'js/ai-chat.js'));
const { createServer } = require(path.join(REPO, 'scripts/agent-server.js'));

const results = [];
let failures = 0;

function report(phase, name, ok, detail) {
  results.push({ phase, name, ok, detail: detail == null ? '' : String(detail) });
  if (!ok) failures++;
  console.log((ok ? '  ✔ ' : '  ✘ ') + name + (detail ? ' — ' + detail : ''));
}

async function main() {
  console.log('== E2E modo agente ==\nWorkspace: ' + WS + '\n');
  fs.mkdirSync(WS, { recursive: true });
  for (const f of fs.readdirSync(WS)) {
    fs.rmSync(path.join(WS, f), { recursive: true, force: true });
  }

  /* ---- Fase 0: servidor agente ---- */
  console.log('Fase 0 — servidor agente local');
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const serverUrl = 'http://127.0.0.1:' + server.address().port;
  const health = await (await fetch(serverUrl + '/health')).json();
  report('server', '/health responde', health.ok === true, 'workspace=' + health.workspace + ' v' + health.version);
  report('server', 'workspace apunta a la carpeta Test', path.resolve(health.workspace) === path.resolve(WS));

  const runner = AgentTools.createToolRunner({ server: { url: serverUrl, token: '' } });

  /* ---- Fase 1: lectura/escritura ---- */
  console.log('\nFase 1 — herramientas de archivos (disco real)');
  const wr = await runner.run('write_file', { path: 'demo/hola.txt', content: 'línea 1\nlínea 2' });
  report('fs', 'write_file crea directorios', wr.bytes > 0, JSON.stringify(wr));
  report('fs', 'archivo existe en disco', fs.existsSync(path.join(WS, 'demo', 'hola.txt')));
  const rd = await runner.run('read_file', { path: 'demo/hola.txt' });
  report('fs', 'read_file devuelve el contenido', rd.content === 'línea 1\nlínea 2');
  const rng = await runner.run('read_file', { path: 'demo/hola.txt', start_line: 2, end_line: 2 });
  report('fs', 'read_file con rango de líneas', rng.content === 'línea 2');
  await runner.run('append_file', { path: 'demo/hola.txt', content: '\nlínea 3 (appended)' });
  report('fs', 'append_file añade al final', (await runner.run('read_file', { path: 'demo/hola.txt' })).content.includes('línea 3'));
  await runner.run('edit_file', { path: 'demo/hola.txt', old_text: 'línea 1', new_text: 'LÍNEA UNO' });
  report(
    'fs',
    'edit_file reemplaza',
    (await runner.run('read_file', { path: 'demo/hola.txt', start_line: 1, end_line: 1 })).content === 'LÍNEA UNO'
  );
  await runner.run('insert_line', { path: 'demo/hola.txt', line: 1, content: '# cabecera' });
  report(
    'fs',
    'insert_line',
    (await runner.run('read_file', { path: 'demo/hola.txt', start_line: 1, end_line: 1 })).content === '# cabecera'
  );
  const ls = await runner.run('list_files', {});
  report('fs', 'list_files', ls.files.includes('demo/hola.txt'), ls.files.join(', '));
  const sr = await runner.run('search_files', { pattern: 'LÍNEA UNO' });
  report('fs', 'search_files (regex)', sr.matches.length === 1, JSON.stringify(sr.matches[0] || {}));
  await runner.run('move_file', { from: 'demo/hola.txt', to: 'demo2/hola.txt' });
  report('fs', 'move_file', !fs.existsSync(path.join(WS, 'demo', 'hola.txt')) && fs.existsSync(path.join(WS, 'demo2', 'hola.txt')));
  await runner.run('delete_file', { path: 'demo2/hola.txt' });
  report('fs', 'delete_file', !fs.existsSync(path.join(WS, 'demo2', 'hola.txt')));
  await runner.run('delete_dir', { path: 'demo2' });
  report('fs', 'delete_dir recursivo', !fs.existsSync(path.join(WS, 'demo2')));
  try {
    await runner.run('read_file', { path: '../../Windows/win.ini' });
    report('seg', 'traversal .. bloqueado', false);
  } catch (e) {
    report('seg', 'traversal .. bloqueado', /fuera|No existe/i.test(e.message), e.message.slice(0, 60));
  }

  /* ---- Fase 2: comandos ---- */
  console.log('\nFase 2 — run_command en la carpeta Test');
  const cmd = await runner.run('run_command', { command: 'node -e "console.log(2+3)"' });
  report('cmd', 'node via cmd', cmd.exitCode === 0 && cmd.stdout.includes('5'), JSON.stringify(cmd.stdout.trim()));
  const ps = await runner.run('run_command', { command: 'Write-Output (Get-Location).Path', shell: 'powershell' });
  report(
    'cmd',
    'powershell via shell:powershell cwd=Test',
    ps.stdout.trim().toLowerCase() === WS.toLowerCase().replace(/\//g, '\\'),
    ps.stdout.trim() || ps.stderr.slice(0, 80)
  );
  const ver = await runner.run('run_command', { command: 'node --version && npm --version' });
  report('cmd', '&& encadenado', /v\d+/.test(ver.stdout), ver.stdout.trim().replace(/\r?\n/g, ' | '));

  /* ---- Fase 3: web fetch ---- */
  console.log('\nFase 3 — web_fetch');
  const wfLocal = await runner.run('web_fetch', { url: OLLAMA_CHAT.replace('/api/chat', '/api/tags') });
  report(
    'web',
    'web_fetch documento local (Ollama tags)',
    wfLocal.status === 200 && wfLocal.text.includes('models'),
    wfLocal.text.slice(0, 60)
  );
  try {
    const wfExt = await runner.run('web_fetch', { url: 'https://example.com', max_chars: 500 });
    report('web', 'web_fetch externo (example.com)', /example domain/i.test(wfExt.text), wfExt.text.slice(0, 70));
  } catch (e) {
    report('web', 'web_fetch externo sin red (no crítico)', true, e.message.slice(0, 60));
  }

  /* limpiar para que los archivos del modelo sean evidencias inequívocas */
  for (const f of fs.readdirSync(WS)) fs.rmSync(path.join(WS, f), { recursive: true, force: true });

  if (SKIP_MODELS) {
    finish(server);
    return;
  }

  /* ---- Fase 4: agente nativo con prompt básico de la biblioteca ---- */
  console.log('\nFase 4 — agente NATIVO Ollama (qwen2.5:7b) con prompt de la biblioteca');
  const promptDB = loadLibraryPrompts();
  const picked = pickBasicPrompt(promptDB);
  console.log('   Prompt elegido: [' + picked.id + '] ' + picked.titulo + ' (' + picked.prompt.length + ' chars)');

  const provider = {
    name: 'Ollama',
    isLocal: true,
    localType: 'ollama',
    endpoint: OLLAMA_CHAT,
    models: ['qwen2.5:7b'],
    defaultModel: 'qwen2.5:7b',
    apiKey: 'local',
  };
  const ctx = {
    provider,
    model: 'qwen2.5:7b',
    maxTokens: 4096,
    tools: AgentTools.filterToolsByCapabilities({ filesystem: true, commands: true, web: true }),
    systemPrompt:
      AgentTools.SYSTEM_PROMPT +
      '\n\nNOTA: El servidor agente ESTÁ conectado (comandos disponibles). SE SIMPLE: genera SOLO index.html con una app funcional mínima que cumpla el TAREA del prompt (sin secciones normativas extensas). Máximo 3 archivos. Termina con un resumen.',
  };
  const cfgNative = AIChat.createAgentConfig(ctx, runner);
  let nativeMode = '';
  const t0 = Date.now();
  const resNative = await AIChat.agentEngine(cfgNative, [{ role: 'user', content: picked.prompt }], {
    maxIterations: 8,
    onMode: (m) => (nativeMode = m),
    onTool: (n, a, e) =>
      console.log('     🛠 ' + n + ' ' + String((a && (a.path || a.command)) || '') + (e ? ' ⚠ ' + String(e).slice(0, 60) : '')),
  });
  const filesNow = fs.readdirSync(WS, { recursive: true }).filter((f) => fs.statSync(path.join(WS, f)).isFile());
  report(
    'model',
    'loop nativo terminó',
    resNative.iterations > 0,
    'modo=' +
      nativeMode +
      ' iters=' +
      resNative.iterations +
      ' ' +
      ((Date.now() - t0) / 1000).toFixed(0) +
      's final=' +
      JSON.stringify((resNative.finalText || '').slice(0, 90))
  );
  report('model', 'el modelo escribió archivos en Test con qwen2.5:7b', filesNow.length > 0, filesNow.join(', '));
  if (filesNow.length) {
    const mainFile = filesNow.find((f) => /\.html$/i.test(f)) || filesNow[0];
    const content = fs.readFileSync(path.join(WS, mainFile), 'utf8');
    report(
      'model',
      mainFile + ' parece código real',
      content.length > 150 && /(<[a-z!]|function|const)/i.test(content),
      content.length + ' bytes; inicio: ' + content.slice(0, 80).replace(/\r?\n/g, ' ')
    );
    /* el agente leyó/validó: test de lectura post-generación */
    const rl = await runner.run('read_file', { path: String(mainFile).split(path.sep).join('/') });
    report('model', 'read_file lee lo generado por el modelo', rl.content.length === content.length);
    /* el modelo puede validar con comandos: probamos nosotros */
    const check = await runner.run('run_command', {
      command: "node -e \"const fs=require('fs');console.log(fs.readdirSync(process.cwd()).join(','))\"",
    });
    report('model', 'run_command ve los archivos del proyecto', check.stdout.includes(path.basename(String(mainFile)).split('.')[0]));
  }

  /* ---- Fase 5: emulación JSON forzada (prueba de fallback) ---- */
  console.log('\nFase 5 — agente EMULADO (llama3.2:3b forzado a protocolo JSON)');
  const ctxEmu = {
    provider,
    model: 'llama3.2:3b',
    maxTokens: 700,
    tools: AgentTools.filterToolsByCapabilities({ filesystem: true, commands: false, web: false }),
    systemPrompt: AgentTools.SYSTEM_PROMPT + '\n\nEMULACIÓN ACTIVA: usa SOLO bloques ```tool JSON. Escribe exactamente 1 archivo.',
  };
  const cfgEmu = AIChat.createAgentConfig(ctxEmu, runner);
  cfgEmu.ollamaSupportsTools = async () => false; // fuerza el protocolo emulado con un modelo real
  const resEmu = await AIChat.agentEngine(
    cfgEmu,
    [
      {
        role: 'user',
        content: 'Crea el archivo hola-emulado.txt cuyo contenido sea exactamente: emulacion-ok desde llama3.2:3b. Luego termina.',
      },
    ],
    {
      maxIterations: 5,
      onTool: (n, a, e) =>
        console.log('     🛠 ' + n + ' ' + String((a && (a.path || a.command)) || '') + (e ? ' ⚠ ' + String(e).slice(0, 60) : '')),
    }
  );
  const emuFile = path.join(WS, 'hola-emulado.txt');
  const emuOk = fs.existsSync(emuFile) && fs.readFileSync(emuFile, 'utf8').includes('emulacion-ok');
  report(
    'emul',
    'hola-emulado.txt escrito vía emulación JSON',
    emuOk,
    'modo=' +
      resEmu.mode +
      ' iters=' +
      resEmu.iterations +
      (emuOk
        ? ' contenido=' + JSON.stringify(fs.readFileSync(emuFile, 'utf8').slice(0, 50))
        : ' final=' + JSON.stringify((resEmu.finalText || '').slice(0, 120)))
  );

  finish(server);
}

function loadLibraryPrompts() {
  const src = fs.readFileSync(path.join(REPO, 'js/prompts-data.js'), 'utf8');
  const sandbox = { console };
  vm.createContext(sandbox);
  vm.runInContext(src + '\n;globalThis.__db = typeof PROMPTS_DB !== "undefined" ? PROMPTS_DB : null;', sandbox, { timeout: 20000 });
  if (!sandbox.__db) throw new Error('PROMPTS_DB no exportado');
  const out = [];
  for (const cat of sandbox.__db.categorias || [])
    for (const sub of cat.subcategorias || [])
      for (const p of sub.prompts || []) out.push({ ...p, categoria: cat.nombre, subcategoria: sub.nombre });
  return out;
}

function pickBasicPrompt(prompts) {
  const appPrompts = prompts.filter((p) => /app|web|sistema|calculadora|gesti/i.test(p.titulo));
  const sorted = [...appPrompts].sort((a, b) => a.prompt.length - b.prompt.length);
  return sorted[0] || prompts.sort((a, b) => a.prompt.length - b.prompt.length)[0];
}

function finish(server) {
  server.close();
  console.log('\n================ RESULTADOS ================');
  const byPhase = {};
  for (const r of results) (byPhase[r.phase] = byPhase[r.phase] || []).push(r);
  for (const [phase, rs] of Object.entries(byPhase)) {
    const okCount = rs.filter((r) => r.ok).length;
    console.log(phase + ': ' + okCount + '/' + rs.length);
  }
  console.log(
    'TOTAL: ' +
      (results.length - failures) +
      '/' +
      results.length +
      (failures
        ? ' → FALLOS: ' +
          results
            .filter((r) => !r.ok)
            .map((r) => r.name)
            .join(' | ')
        : ' → TODO OK')
  );
  process.exit(failures ? 1 : 0);
}

main().catch((err) => {
  console.error('E2E ERROR fatal:', err && err.stack ? err.stack : err);
  process.exit(2);
});
