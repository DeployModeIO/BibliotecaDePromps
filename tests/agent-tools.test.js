/**
 * Tests para js/agent-tools.js — herramientas del modo agente.
 * Ejecutar: npm run test
 */

const AgentTools = require('../js/agent-tools.js');

describe('AgentTools — catálogo de herramientas', () => {
  test('expone el catálogo TOOLS con las 12 herramientas esperadas', () => {
    expect(AgentTools).toBeDefined();
    expect(Array.isArray(AgentTools.TOOLS)).toBe(true);
    const names = AgentTools.TOOLS.map((t) => t.function.name);
    expect(names).toEqual([
      'list_files',
      'read_file',
      'write_file',
      'edit_file',
      'delete_file',
      'insert_line',
      'search_files',
      'append_file',
      'move_file',
      'delete_dir',
      'run_command',
      'web_fetch',
    ]);
  });

  test('filterToolsByCapabilities oculta comandos/web/ficheros según capacidades', () => {
    const all = AgentTools.filterToolsByCapabilities({ filesystem: true, commands: true, web: true });
    expect(all.length).toBe(12);
    const fsOnly = AgentTools.filterToolsByCapabilities({ filesystem: true, commands: false, web: false });
    const names = fsOnly.map((t) => t.function.name);
    expect(names).not.toContain('run_command');
    expect(names).not.toContain('web_fetch');
    expect(names).toContain('write_file');
    const noFs = AgentTools.filterToolsByCapabilities({ filesystem: false, commands: true, web: true });
    const names2 = noFs.map((t) => t.function.name);
    expect(names2).toEqual(['run_command', 'web_fetch']);
  });

  test('cada herramienta tiene formato función compatible OpenAI/Ollama', () => {
    AgentTools.TOOLS.forEach((tool) => {
      expect(tool.type).toBe('function');
      expect(tool.function.name).toBeTruthy();
      expect(tool.function.description).toBeTruthy();
      expect(tool.function.parameters).toBeDefined();
      expect(tool.function.parameters.type).toBe('object');
    });
  });

  test('write_file y read_file declaran parámetros requeridos', () => {
    const write = AgentTools.TOOLS.find((t) => t.function.name === 'write_file');
    const read = AgentTools.TOOLS.find((t) => t.function.name === 'read_file');
    expect(write.function.parameters.required).toEqual(['path', 'content']);
    expect(read.function.parameters.required).toEqual(['path']);
  });

  test('SYSTEM_PROMPT instruye a escribir archivos con write_file', () => {
    expect(typeof AgentTools.SYSTEM_PROMPT).toBe('string');
    expect(AgentTools.SYSTEM_PROMPT).toContain('write_file');
    expect(AgentTools.SYSTEM_PROMPT).toContain('list_files');
  });
});

describe('AgentTools — parseToolArguments', () => {
  test('parsea JSON string', () => {
    expect(AgentTools.parseToolArguments('{"path":"index.html"}')).toEqual({ path: 'index.html' });
  });

  test('acepta objeto nativo (formato Ollama)', () => {
    const args = { path: 'src/app.js', content: 'hola' };
    expect(AgentTools.parseToolArguments(args)).toEqual(args);
  });

  test('rescata JSON rodeado de texto extra', () => {
    const raw = 'Aquí tienes: {"path":"a.md","content":"x"} fin';
    expect(AgentTools.parseToolArguments(raw)).toEqual({ path: 'a.md', content: 'x' });
  });

  test('devuelve {} para entradas inválidas', () => {
    expect(AgentTools.parseToolArguments(null)).toEqual({});
    expect(AgentTools.parseToolArguments(undefined)).toEqual({});
    expect(AgentTools.parseToolArguments('no es json')).toEqual({});
    expect(AgentTools.parseToolArguments(42)).toEqual({});
  });
});

describe('AgentTools — VirtualFS', () => {
  test('normaliza rutas con separadores mixtos y slashes', () => {
    expect(AgentTools.normalizePath('\\src\\app.js')).toBe('src/app.js');
    expect(AgentTools.normalizePath('/index.html/')).toBe('index.html');
  });

  test('escribe, lee, edita, lista y elimina archivos', () => {
    const fs = new AgentTools.VirtualFS();
    fs.writeFile('index.html', '<h1>Hola</h1>');
    fs.writeFile('src/app.js', 'console.log("ok");');

    expect(fs.readFile('index.html')).toBe('<h1>Hola</h1>');
    expect(fs.listFiles('')).toEqual(['index.html', 'src/app.js']);

    fs.editFile('src/app.js', 'console.log("ok");', 'console.log("editado");');
    expect(fs.readFile('src/app.js')).toBe('console.log("editado");');

    fs.deleteFile('index.html');
    expect(fs.listFiles('')).toEqual(['src/app.js']);
  });

  test('lanza error al leer/editar/eliminar archivos inexistentes', () => {
    const fs = new AgentTools.VirtualFS();
    expect(() => fs.readFile('noexiste.txt')).toThrow();
    expect(() => fs.editFile('noexiste.txt', 'a', 'b')).toThrow();
    expect(() => fs.deleteFile('noexiste.txt')).toThrow();
  });
});

describe('AgentTools — createToolRunner (modo virtual)', () => {
  test('ejecuta las herramientas sobre el FS virtual', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null });
    expect(runner.isVirtual).toBe(true);

    await runner.run('write_file', { path: 'index.html', content: '<html></html>' });
    await runner.run('write_file', { path: 'css/styles.css', content: 'body{}' });

    const list = await runner.run('list_files', {});
    expect(list.files).toEqual(['css/styles.css', 'index.html']);

    const read = await runner.run('read_file', { path: 'index.html' });
    expect(read.content).toBe('<html></html>');

    await runner.run('edit_file', { path: 'css/styles.css', old_text: 'body{}', new_text: 'body{margin:0}' });
    expect((await runner.run('read_file', { path: 'css/styles.css' })).content).toBe('body{margin:0}');

    await runner.run('delete_file', { path: 'index.html' });
    expect((await runner.run('list_files', {})).files).toEqual(['css/styles.css']);

    const files = runner.getVirtualFiles();
    expect(files).toEqual([{ name: 'css/styles.css', content: 'body{margin:0}' }]);
  });

  test('lanza error para herramienta desconocida', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null });
    await expect(runner.run('no_existe', {})).rejects.toThrow(/Herramienta desconocida/);
  });
});

describe('AgentTools — nuevas herramientas (search, ranges, insert, replace_all)', () => {
  test('search_files busca patrones (regex) en el FS virtual', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null });
    await runner.run('write_file', { path: 'src/app.js', content: 'function render() {}\nconst x = 1;\n' });
    const res = await runner.run('search_files', { pattern: 'function', path: 'src' });
    expect(res.matches.length).toBe(1);
    expect(res.matches[0].file).toBe('src/app.js');
    expect(res.matches[0].line).toBe(1);
  });

  test('read_file devuelve rangos de líneas', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null });
    await runner.run('write_file', { path: 'a.txt', content: 'l1\nl2\nl3\nl4' });
    expect((await runner.run('read_file', { path: 'a.txt', start_line: 2, end_line: 3 })).content).toBe('l2\nl3');
  });

  test('edit_file con replace_all reemplaza todas las coincidencias', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null });
    await runner.run('write_file', { path: 'a.txt', content: 'aa bb aa' });
    await runner.run('edit_file', { path: 'a.txt', old_text: 'aa', new_text: 'xx', replace_all: true });
    expect((await runner.run('read_file', { path: 'a.txt' })).content).toBe('xx bb xx');
  });

  test('insert_line inserta antes de la línea indicada', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null });
    await runner.run('write_file', { path: 'a.txt', content: 'line1\nline2' });
    await runner.run('insert_line', { path: 'a.txt', line: 2, content: 'NUEVA' });
    expect((await runner.run('read_file', { path: 'a.txt' })).content).toBe('line1\nNUEVA\nline2');
  });
});

describe('AgentTools — prefijo de carpeta de proyecto', () => {
  test('las rutas relativas quedan dentro del prefijo', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null, prefix: 'proyecto-x' });
    await runner.run('write_file', { path: 'index.html', content: 'h' });
    await runner.run('write_file', { path: 'src/app.js', content: 'j' });
    const files = (await runner.run('list_files', {})).files;
    expect(files).toContain('proyecto-x/index.html');
    expect(files).toContain('proyecto-x/src/app.js');
    expect((await runner.run('read_file', { path: 'index.html' })).content).toBe('h');
    expect(runner.getPrefix()).toBe('proyecto-x/');
  });

  test('no doble-prefija y respeta rutas ya prefijadas', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null, prefix: 'p1' });
    await runner.run('write_file', { path: 'p1/dentro.txt', content: 'd' });
    const files = (await runner.run('list_files', { path: 'p1' })).files;
    expect(files).toContain('p1/dentro.txt');
    expect(files.filter((f) => f.includes('p1/p1'))).toHaveLength(0);
  });

  test('list_files con path vacío lista la carpeta del proyecto', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null, prefix: 'solo' });
    await runner.run('write_file', { path: 'a.txt', content: 'a' });
    const fuera = new AgentTools.createToolRunner({ rootDirHandle: null });
    await fuera.run('write_file', { path: 'b.txt', content: 'b' });
    const files = (await runner.run('list_files', {})).files;
    expect(files).toEqual(['solo/a.txt']);
  });

  test('setPrefix cambia la carpeta en caliente', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null, prefix: 'v1' });
    runner.setPrefix('v2');
    await runner.run('write_file', { path: 'c.txt', content: 'c' });
    expect((await runner.run('list_files', {})).files).toEqual(['v2/c.txt']);
  });
});

describe('AgentTools — run_command y web_fetch', () => {
  test('run_command exige el servicio de agente', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null });
    await expect(runner.run('run_command', { command: 'echo hola' })).rejects.toThrow(/agente/i);
  });

  test('web_fetch usa fetch del navegador cuando no hay servidor', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null });
    const origFetch = global.fetch;
    global.fetch = async () => ({
      status: 200,
      headers: { get: () => 'text/html' },
      text: async () => '<html><body><p>Hola mundo</p></body></html>',
    });
    try {
      const res = await runner.run('web_fetch', { url: 'https://example.com', max_chars: 1000 });
      expect(res.status).toBe(200);
      expect(res.text).toContain('Hola mundo');
    } finally {
      global.fetch = origFetch;
    }
  });

  test('getCapabilities reporta el backend activo', () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null });
    expect(runner.getCapabilities()).toEqual({ server: false, filesystem: false, virtual: true });
  });
});

describe('AgentTools — runner con servidor agente (mock)', () => {
  function makeFetchLog() {
    const calls = [];
    global.fetch = async (url, opts) => {
      const o = opts || {};
      calls.push({ url: String(url), method: o.method || 'GET', body: o.body });
      if (String(url).includes('/fetch')) {
        return {
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ ok: true, status: 200, contentType: 'text/html; charset=utf-8', text: '<html><body><h1>Hola</h1><script>x()</script></body></html>' }),
        };
      }
      if (String(url).includes('/files')) {
        return { ok: false, status: 404, text: async () => JSON.stringify({ error: 'No existe la ruta: foo' }) };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true }) };
    };
    return calls;
  }

  afterEach(() => {
    delete global.fetch;
  });

  test('web_fetch vía servidor limpia HTML y trunca', async () => {
    const calls = makeFetchLog();
    const runner = AgentTools.createToolRunner({ server: { url: 'http://127.0.0.1:4864', token: '' } });
    const res = await runner.run('web_fetch', { url: 'https://example.com', max_chars: 100 });
    expect(res.text).toBe('Hola');
    expect(res.text).not.toContain('<');
    const post = calls.find((c) => c.url.includes('/fetch'));
    expect(post.method).toBe('POST');
  });

  test('append y move van a los endpoints correctos', async () => {
    const calls = makeFetchLog();
    const runner = AgentTools.createToolRunner({ server: { url: 'http://127.0.0.1:4864', token: '' } });
    await runner.run('append_file', { path: 'a.txt', content: 'x' });
    await runner.run('move_file', { from: 'a.txt', to: 'b/a.txt' });
    await runner.run('delete_dir', { path: 'b' });
    expect(calls.some((c) => c.url.includes('/append') && c.method === 'POST')).toBe(true);
    expect(calls.some((c) => c.url.includes('/move') && c.method === 'POST')).toBe(true);
    expect(calls.some((c) => c.url.includes('/dir') && c.method === 'DELETE')).toBe(true);
  });

  test('list_files sobre ruta inexistente da mensaje accionable', async () => {
    makeFetchLog();
    const runner = AgentTools.createToolRunner({ server: { url: 'http://127.0.0.1:4864', token: '' } });
    await expect(runner.run('list_files', { path: 'foo' })).rejects.toThrow(/no existe|SIN path/i);
  });
});

describe('AgentTools — utilidades', () => {
  test('append_file, move_file y delete_dir funcionan en modo virtual', async () => {
    const runner = AgentTools.createToolRunner({ rootDirHandle: null });
    await runner.run('write_file', { path: 'a.txt', content: 'uno' });
    await runner.run('append_file', { path: 'a.txt', content: '-dos' });
    expect((await runner.run('read_file', { path: 'a.txt' })).content).toBe('uno-dos');
    await runner.run('write_file', { path: 'tmp/b.txt', content: 'x' });
    await runner.run('move_file', { from: 'tmp/b.txt', to: 'c/b.txt' });
    const files = (await runner.run('list_files', {})).files;
    expect(files).toContain('c/b.txt');
    expect(files).not.toContain('tmp/b.txt');
    await runner.run('delete_dir', { path: 'c' });
    expect((await runner.run('list_files', {})).files).not.toContain('c/b.txt');
  });


  test('stripHtml elimina etiquetas y decodifica entidades', () => {
    expect(AgentTools.stripHtml('<p>Hola <b>mundo</b></p><script>x()</script>')).toBe('Hola mundo');
  });

  test('truncate corta texto largo', () => {
    expect(AgentTools.truncate('abc', 2)).toBe('ab\n... [truncado]');
    expect(AgentTools.truncate('abc', 10)).toBe('abc');
  });
});
