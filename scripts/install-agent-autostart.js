#!/usr/bin/env node
/* ============================================================
   Instala el servidor agente del Chat IA como proceso de inicio
   de Windows (carpeta «Inicio», sin ventana, sin permisos de
   admin) y opcionalmente lo arranca ahora (--start).

   Uso:
     npm run agent-server:auto            → instala + arranca ya
     npm run agent-server:auto -- --no-start
     npm run agent-server:auto -- --uninstall
   Raíces accesibles por defecto: <repo>, Desktop y Documents.
   Personalizable con AGENT_ROOTS antes de instalar.
   ============================================================ */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const REPO = path.join(__dirname, '..');
const NODE = process.execPath; // node.exe que ejecuta este script
const STARTUP = path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
const VBS_PATH = path.join(STARTUP, 'BPI-AgentServer.vbs');

/* Comillas para literales VBS (duplica " internas; backslashes literal) */
function vbStr(s) {
  return '"' + String(s).replace(/"/g, '""') + '"';
}

function escapeVbs(s) {
  return String(s).replace(/"/g, '""');
}

function buildVbs() {
  const defaultRoots = [path.join(REPO, 'proyectos-agent'), path.join(os.homedir(), 'Desktop'), path.join(os.homedir(), 'Documents')].join(
    ';'
  );
  const roots = process.env.AGENT_ROOTS || defaultRoots;
  const envLines = [
    ['AGENT_ROOTS', roots],
    ['AGENT_PORT', process.env.AGENT_PORT || '4864'],
  ]
    .map(([k, v]) => `    sh.Environment("PROCESS")("${k}") = ${vbStr(v)}`)
    .join('\n');
  const SCRIPT = path.join(REPO, 'scripts', 'agent-server.js');
  return [
    "' BPI Agent Server — arranque oculto automatico (generado por scripts/install-agent-autostart.js)",
    'Option Explicit',
    'Dim sh, fso, q, cmd',
    'Set sh = CreateObject("WScript.Shell")',
    'Set fso = CreateObject("Scripting.FileSystemObject")',
    'q = Chr(34)',
    `If Not fso.FileExists(${vbStr(NODE)}) Then WScript.Quit 0`,
    `sh.CurrentDirectory = ${vbStr(REPO)}`,
    envLines,
    `cmd = q & ${vbStr(NODE)} & q & " " & q & ${vbStr(SCRIPT)} & q`,
    'sh.Run cmd, 0, False',
  ].join('\r\n');
}

function install() {
  fs.mkdirSync(STARTUP, { recursive: true });
  fs.writeFileSync(VBS_PATH, buildVbs(), 'utf8');
  console.log('✔ Instalado en Inicio de Windows: ' + VBS_PATH);
}

function uninstall() {
  if (fs.existsSync(VBS_PATH)) {
    fs.rmSync(VBS_PATH);
    console.log('✔ Eliminado ' + VBS_PATH);
  } else {
    console.log('No había nada instalado en la carpeta Inicio.');
  }
}

function healthUrl() {
  return 'http://127.0.0.1:' + (process.env.AGENT_PORT || '4864') + '/health';
}

async function isUp() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const r = await fetch(healthUrl(), { signal: ctrl.signal });
    clearTimeout(t);
    return r.ok;
  } catch {
    return false;
  }
}

async function startNow() {
  if (await isUp()) {
    console.log('✔ El servidor agente ya estaba corriendo en ' + healthUrl());
    return;
  }
  // Arranque desasociado de esta terminal: sobrevive al cerrar la sesión CLI
  const child = spawn('wscript.exe', [VBS_PATH], { detached: true, stdio: 'ignore', windowsHide: true });
  child.unref();
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await isUp()) {
      console.log('✔ Servidor agente levantado ahora (oculto) → ' + healthUrl());
      return;
    }
  }
  console.log('⚠ No respondió en 6s. Revisa node en PATH o ejecuta: npm run agent-server');
  process.exitCode = 1;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--uninstall')) {
    uninstall();
    return;
  }
  if (!fs.existsSync(NODE)) {
    console.error('node no encontrado:', NODE);
    process.exit(1);
  }
  install();
  if (!args.includes('--no-start')) await startNow();
}

main().catch((e) => {
  console.error('ERROR:', e.message || e);
  process.exit(1);
});
