/**
 * Tests para scripts/agent-server.js — helpers y API HTTP del servidor agente.
 */

const path = require('path');
const os = require('os');
const fsp = require('fs/promises');
const { safePath, runCommand, listFiles, searchFiles, WORKSPACE, ROOTS, createServer } = require('../scripts/agent-server.js');

describe('AgentServer — safePath', () => {
  test('resuelve rutas dentro del workspace', () => {
    expect(safePath('src/app.js')).toBe(path.join(WORKSPACE, 'src', 'app.js'));
  });

  test('rechaza rutas fuera de las raíces', () => {
    expect(() => safePath('../../etc/passwd')).toThrow(/fuera de las ra/);
  });

  test('acepta rutas absolutas dentro de una raíz permitida', () => {
    const abs = ROOTS[0];
    expect(safePath(abs)).toBe(abs);
  });

  test('rechaza rutas absolutas ajenas a las raíces', () => {
    expect(() => safePath(path.join(os.tmpdir(), 'inexistente-bpi'))).toThrow(/fuera de las ra/);
  });
});

describe('AgentServer — runCommand', () => {
  test('ejecuta un comando y devuelve stdout/exitCode', async () => {
    const res = await runCommand('node -e "console.log(\'hello-agent\')"', '', 10000);
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toContain('hello-agent');
  }, 15000);

  test('shell powershell devuelve salida', async () => {
    const res = await runCommand('Write-Output "ps-ok"', '', 20000, 'powershell');
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toContain('ps-ok');
  }, 25000);

  test('rechaza rutas cwd fuera de raíces', async () => {
    const res = await runCommand('dir', os.tmpdir(), 5000);
    expect(res.exitCode).not.toBe(0);
    expect(res.stderr).toMatch(/fuera de las ra/);
  });
});

describe('AgentServer — listFiles / searchFiles', () => {
  test('lista archivos del workspace', async () => {
    const files = await listFiles('');
    expect(Array.isArray(files)).toBe(true);
    expect(files).toContain('package.json');
  });

  test('busca patrones con límite de coincidencias', async () => {
    const matches = await searchFiles('function', 'js', '', 5);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]).toHaveProperty('line');
  });
});

describe('AgentServer — API HTTP (endpoints nuevos)', () => {
  let server;
  let base;
  let tokenHeader;

  beforeAll(async () => {
    server = createServer();
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    base = 'http://127.0.0.1:' + server.address().port;
    tokenHeader = { 'Content-Type': 'application/json' };
  });

  afterAll(() => new Promise((resolve) => server.close(resolve)));

  async function api(method, route, body) {
    const resp = await fetch(base + route, {
      method,
      headers: tokenHeader,
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: resp.status, data: await resp.json().catch(() => ({})) };
  }

  const probe = 'tests/.tmp-agent-probe.txt';

  test('health expone raíces', async () => {
    const { status, data } = await api('GET', '/health');
    expect(status).toBe(200);
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.roots)).toBe(true);
  });

  test('PUT file → GET file → APPEND → DELETE', async () => {
    let r = await api('PUT', '/file', { path: probe, content: 'linea1' });
    expect(r.status).toBe(200);
    r = await api('POST', '/append', { path: probe, content: '\nlinea2' });
    expect(r.status).toBe(200);
    r = await api('GET', '/file?path=' + encodeURIComponent(probe));
    expect(r.data.content).toBe('linea1\nlinea2');
    r = await api('DELETE', '/file?path=' + encodeURIComponent(probe));
    expect(r.status).toBe(200);
  });

  test('move y borrado de carpeta', async () => {
    let r = await api('PUT', '/file', { path: 'tests/.tmp-agent-dir/a.txt', content: 'x' });
    expect(r.status).toBe(200);
    r = await api('POST', '/move', { from: 'tests/.tmp-agent-dir/a.txt', to: 'tests/.tmp-agent-dir/b/c.txt' });
    expect(r.status).toBe(200);
    r = await api('GET', '/file?path=' + encodeURIComponent('tests/.tmp-agent-dir/b/c.txt'));
    expect(r.data.content).toBe('x');
    r = await api('DELETE', '/dir?path=' + encodeURIComponent('tests/.tmp-agent-dir'));
    expect(r.status).toBe(200);
  });

  test('ruta inexistente devuelve 404 con mensaje legible', async () => {
    const r = await api('GET', '/file?path=no_existe_bpi.txt');
    expect(r.status).toBe(404);
    expect(r.data.error).toMatch(/No existe/i);
  });

  test('deniega rutas fuera de raíces', async () => {
    const r = await api('GET', '/file?path=..%2F..%2Fwindows%2Fwin.ini');
    expect(r.status).toBe(400);
  });

  test('search devuelve coincidencias con líneas', async () => {
    const r = await api('POST', '/search', { pattern: 'createToolRunner', path: 'js', max_matches: 10 });
    expect(r.status).toBe(200);
    expect(r.data.matches.length).toBeGreaterThan(0);
  });
});
