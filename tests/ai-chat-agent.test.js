/**
 * Tests para el motor del modo agente (js/ai-chat.js — agentEngine y helpers).
 * Los transportes se mockean: no toca red ni DOM.
 */

const AIChat = require('../js/ai-chat.js');
const AgentTools = require('../js/agent-tools.js');

const { agentEngine, parseEmulatedToolCalls, salvageCodeBlocks, isToolsUnsupportedError, getToolFamily, capForModel, preferAgentModel } = AIChat;

const CONV = [{ role: 'user', content: 'crea un index.html con hola' }];

function mockRunner() {
  const writes = [];
  return {
    writes,
    runner: {
      run: async (name, args) => {
        writes.push({ name, args });
        if (name === 'run_command') return { exitCode: 0, stdout: 'ok', stderr: '', timedOut: false };
        return { path: 'index.html', bytes: 4 };
      },
      listAll: async () => ['index.html'],
      isVirtual: true,
      getVirtualFiles: () => [{ name: 'index.html', content: '<html></html>' }],
    },
  };
}

describe('isToolsUnsupportedError', () => {
  test('detecta el error real de Ollama', () => {
    expect(isToolsUnsupportedError(new Error('{"error":"registry.ollama.ai/library/gemma2:2b does not support tools"}'))).toBe(true);
    expect(isToolsUnsupportedError('gemma2 does not support tools')).toBe(true);
  });

  test('no confunde otros errores', () => {
    expect(isToolsUnsupportedError(new Error('Failed to fetch'))).toBe(false);
    expect(isToolsUnsupportedError(new Error('429 rate limit'))).toBe(false);
  });
});

describe('parseEmulatedToolCalls', () => {
  test('extrae múltiples bloques ```tool y deja el texto limpio', () => {
    const text = [
      'Voy a crear el proyecto:',
      '```tool',
      '{"name":"write_file","args":{"path":"index.html","content":"<h1>h</h1>"}}',
      '```',
      'luego el css',
      '```tool',
      '{"name":"write_file","args":{"path":"css/s.css","content":"body{}"}}',
      '```',
    ].join('\n');
    const r = parseEmulatedToolCalls(text);
    expect(r.calls.length).toBe(2);
    expect(r.calls[0].args.path).toBe('index.html');
    expect(r.calls[1].args.path).toBe('css/s.css');
    expect(r.text).toContain('Voy a crear');
    expect(r.text).not.toContain('write_file');
  });

  test('ignora bloques JSON que no son llamadas a herramienta', () => {
    const text = 'mira este package:\n```json\n{"name":"mi-app","version":"1.0.0"}\n```';
    const r = parseEmulatedToolCalls(text);
    expect(r.calls.length).toBe(0);
  });

  test('acepta variantes tool_calls array y arguments string', () => {
    const text = [
      '```tool',
      '{"tool_calls":[{"tool":"read_file","arguments":"{\\"path\\":\\"a.txt\\"}"}]}',
      '```',
    ].join('\n');
    const r = parseEmulatedToolCalls(text);
    expect(r.calls.length).toBe(1);
    expect(r.calls[0].name).toBe('read_file');
    expect(r.calls[0].args).toEqual({ path: 'a.txt' });
  });
  test('captura fugas [TOOL_CALLS] y <tool_call> de plantillas nativas', () => {
    const mk = '[TOOL_CALLS]{\n\t"name": "write_file",\n\t"arguments": {"path": "a.html", "content": "<h1>x</h1>"}\n}';
    const r1 = parseEmulatedToolCalls(mk);
    expect(r1.calls.length).toBe(1);
    expect(r1.calls[0].name).toBe('write_file');
    expect(r1.calls[0].args.path).toBe('a.html');
    const qwen = '<tool_call>\n{"name": "read_file", "arguments": {"path": "b.js"}}\n</tool_call>';
    const r2 = parseEmulatedToolCalls(qwen);
    expect(r2.calls.length).toBe(1);
    expect(r2.calls[0].name).toBe('read_file');
  });

  test('marca como malformado un [TOOL_CALLS] con JSON truncado', () => {
    const r = parseEmulatedToolCalls('[TOOL_CALLS]{"name":"write_file","arguments":{"content":"<html');
    expect(r.calls.length).toBe(0);
    expect(r.malformed).toBeGreaterThan(0);
  });
});

describe('capForModel', () => {
  test('recorta payloads largos y serializa objetos', () => {
    const out = capForModel({ big: 'x'.repeat(9000) }, 100);
    expect(out.length).toBeLessThan(130);
    expect(out).toContain('recortado');
    expect(capForModel('corto')).toBe('corto');
  });
});

describe('preferAgentModel', () => {
  test('prioriza modelos con tool-calling conocido', () => {
    const p = { models: ['llava:7b', 'gemma2:2b', 'qwen2.5:7b', 'mistral-nemo:12b'], defaultModel: 'llava:7b' };
    expect(preferAgentModel(p)).toBe('qwen2.5:7b');
  });

  test('cae a defaultModel si ninguno coincide con patrones de tools', () => {
    const p = { models: ['rara:smol', 'otra:sr'], defaultModel: 'rara:smol' };
    expect(preferAgentModel(p)).toBe('rara:smol');
  });

  test('maneja proveedor vacío o nulo', () => {
    expect(preferAgentModel({ models: [], defaultModel: 'x' })).toBe('');
    expect(preferAgentModel(null)).toBe('');
  });
});

describe('salvageCodeBlocks — rescate de código mostrado en el chat', () => {
  test('convierte un bloque ```html con nombre mencionado en write_file', () => {
    const text = 'Ya llamé a write_file para crear index.html con esto:\n```html\n<!DOCTYPE html>\n<html lang="es"><body><h1>Corrosión</h1></body></html>\n```';
    const calls = salvageCodeBlocks(text);
    expect(calls.length).toBe(1);
    expect(calls[0].name).toBe('write_file');
    expect(calls[0].args.path).toBe('index.html');
    expect(calls[0].args.content).toContain('<!DOCTYPE html>');
  });

  test('usa nombre por defecto según lenguaje cuando no hay mención', () => {
    const calls = salvageCodeBlocks('El estilo:\n```css\nbody { background: #0a0f1c; color: #eee; font-family: monospace; }\n```');
    expect(calls.length).toBe(1);
    expect(calls[0].args.path).toBe('styles.css');
  });

  test('ignora fragmentos cortos y bloques json/tool', () => {
    expect(salvageCodeBlocks('```html\n<p>hola</p>\n```').length).toBe(0);
    expect(salvageCodeBlocks('```json\n{"name":"mi-app"}\n```').length).toBe(0);
    expect(salvageCodeBlocks('sin bloques').length).toBe(0);
  });

  test('deduplica por ruta (gana el último bloque)', () => {
    const text = 'v1:\n```html\n<html><body>version uno larguisima</body></html>\n``` luego v2:\n```html\n<html><body>version dos larguisima</body></html>\n```';
    const calls = salvageCodeBlocks(text);
    expect(calls.length).toBe(1);
    expect(calls[0].args.content).toContain('version dos');
  });
});

describe('getToolFamily', () => {
  test('clasifica proveedores', () => {
    expect(getToolFamily({ isLocal: true, localType: 'ollama', endpoint: 'http://localhost:11434/api/chat' })).toBe('ollama');
    expect(getToolFamily({ isLocal: true, localType: 'openai', endpoint: 'http://localhost:1234/v1/chat/completions' })).toBe('openai');
    expect(getToolFamily({ id: 'anthropic', type: 'cloud', endpoint: 'https://api.anthropic.com/v1/messages' })).toBe('anthropic');
    expect(getToolFamily({ id: 'gemini', type: 'cloud', endpoint: 'https://generativelanguage.googleapis.com/x' })).toBe('gemini');
  });
});

describe('agentEngine', () => {
  test('bucle nativo: ejecuta llamadas, devuelve observaciones y termina', async () => {
    const { writes, runner } = mockRunner();
    let turn = 0;
    const cfg = {
      family: 'ollama',
      runner,
      ollamaSupportsTools: async () => true,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async (history) => {
        turn++;
        if (turn === 1) {
          return {
            content: '',
            rawCalls: [{ id: 'c1', function: { name: 'write_file', arguments: { path: 'index.html', content: '<h1>h</h1>' } } }],
            calls: [{ id: 'c1', name: 'write_file', args: { path: 'index.html', content: '<h1>h</h1>' } }],
          };
        }
        expect(history.toolMsgs && history.toolMsgs.length).toBe(1);
        return { content: '¡Proyecto terminado!', calls: [], rawCalls: [] };
      },
      pushNative: (history, step, results) => {
        history.toolMsgs = results;
      },
      emulatedText: async () => {
        throw new Error('no debería usarse');
      },
    };
    const modes = [];
    const res = await agentEngine(cfg, CONV, { onMode: (m) => modes.push(m), maxIterations: 5 });
    expect(res.finalText).toBe('¡Proyecto terminado!');
    expect(res.mode).toBe('native');
    expect(writes[0].name).toBe('write_file');
    expect(modes).toEqual(['native']);
  });

  test('fallback automático a emulado cuando el modelo no soporta tools', async () => {
    const { writes, runner } = mockRunner();
    let nativeTries = 0;
    let emuTurn = 0;
    const cfg = {
      family: 'ollama',
      runner,
      ollamaSupportsTools: async () => null, // capacidades desconocidas → intenta nativo
      initHistory: (conv, mode) => ({ mode, msgs: [] }),
      nativeStep: async () => {
        nativeTries++;
        throw new Error('{"error":"gemma2:2b does not support tools"}');
      },
      pushNative: () => {},
      emulatedText: async () => {
        emuTurn++;
        if (emuTurn === 1) return 'Creando...\n```tool\n{"name":"write_file","args":{"path":"index.html","content":"<h1>ok</h1>"}}\n```';
        return 'Proyecto completado ✔';
      },
    };
    const modes = [];
    const res = await agentEngine(cfg, CONV, { onMode: (m) => modes.push(m), maxIterations: 6 });
    expect(nativeTries).toBe(1);
    expect(res.mode).toBe('emulated');
    expect(modes[modes.length - 1]).toBe('emulated');
    expect(writes.length).toBe(1);
    expect(res.finalText).toContain('Proyecto completado');
  });

  test('modo emulado directo cuando ollama anuncia que no soporta tools', async () => {
    const { writes, runner } = mockRunner();
    const cfg = {
      family: 'ollama',
      runner,
      ollamaSupportsTools: async () => false,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async () => {
        throw new Error('no debe llamarse');
      },
      pushNative: () => {},
      emulatedText: async () => '```tool\n{"name":"run_command","args":{"command":"dir"}}\n```',
    };
    // segunda respuesta final tras la observación
    let n = 0;
    cfg.emulatedText = async () => {
      n++;
      return n === 1 ? '```tool\n{"name":"run_command","args":{"command":"dir"}}\n```' : 'terminado';
    };
    const res = await agentEngine(cfg, CONV, { maxIterations: 4 });
    expect(res.mode).toBe('emulated');
    expect(writes[0].name).toBe('run_command');
    expect(res.finalText).toBe('terminado');
  });

  test('corta bucles de llamadas repetidas', async () => {
    const { runner } = mockRunner();
    let t = 0;
    const cfg = {
      family: 'openai',
      runner,
      ollamaSupportsTools: async () => true,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async () => {
        t++;
        return { content: '', rawCalls: [], calls: [{ id: 'x' + t, name: 'write_file', args: { path: 'a', content: 'b' } }] };
      },
      pushNative: () => {},
      emulatedText: async () => 'x',
    };
    const res = await agentEngine(cfg, CONV, { maxIterations: 10 });
    expect(res.repeated).toBe(true);
    expect(t).toBe(3);
  });

  test('corta bucles de llamadas inválidas repetidas (args vacíos o ruta mal)', async () => {
    const { runner } = mockRunner();
    let t = 0;
    const cfg = {
      family: 'ollama',
      runner,
      ollamaSupportsTools: async () => true,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async () => {
        t++;
        return { content: '', rawCalls: [], calls: [{ id: 'i' + t, name: 'create_directory', args: {} }] };
      },
      pushNative: () => {},
      emulatedText: async () => 'x',
    };
    const res = await agentEngine(cfg, CONV, { maxIterations: 8 });
    expect(res.finalText).toContain('inválidas');
    expect(res.finalText).toContain('create_directory');
    expect(t).toBeGreaterThanOrEqual(3);
  });

  test('shouldStop interrumpe sin ejecutar llamadas', async () => {
    const { runner, writes } = mockRunner();
    const cfg = {
      family: 'openai',
      runner,
      ollamaSupportsTools: async () => true,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async () => ({ content: '', rawCalls: [], calls: [{ id: '1', name: 'write_file', args: {} }] }),
      pushNative: () => {},
      emulatedText: async () => 'x',
    };
    const res = await agentEngine(cfg, CONV, { shouldStop: () => true, maxIterations: 5 });
    expect(res.stopped).toBe(true);
    expect(writes.length).toBe(0);
  });

  test('reintenta turnos totalmente vacíos antes de darse por terminado', async () => {
    const { writes, runner } = mockRunner();
    let n = 0;
    const cfg = {
      family: 'ollama',
      runner,
      ollamaSupportsTools: async () => true,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async () => {
        n++;
        if (n === 1) return { content: '', rawCalls: [], calls: [] };
        if (n === 2) return { content: 'ok', rawCalls: [{ id: 'z', function: { name: 'append_file', arguments: { path: 'y.txt', content: 'v' } } }], calls: [{ id: 'z', name: 'append_file', args: { path: 'y.txt', content: 'v' } }] };
        return { content: 'listo', rawCalls: [], calls: [] };
      },
      pushNative: () => {},
      emulatedText: async () => 'x',
    };
    const res = await agentEngine(cfg, CONV, { maxIterations: 8 });
    expect(res.finalText).toBe('listo');
    expect(writes.map((w) => w.name)).toEqual(['append_file']);
  });

  test('si tras 2 empujones sigue vacío, termina con texto vacío', async () => {
    const { runner, writes } = mockRunner();
    const cfg = {
      family: 'ollama',
      runner,
      ollamaSupportsTools: async () => true,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async () => ({ content: '', rawCalls: [], calls: [] }),
      pushNative: () => {},
      emulatedText: async () => 'x',
    };
    const res = await agentEngine(cfg, CONV, { maxIterations: 9 });
    expect(res.finalText).toBe('');
    expect(res.iterations).toBe(3);
    expect(writes.length).toBe(0);
  });

  test('híbrido: si el modo nativo "muestra" el JSON como texto, cambia a emulado y ejecuta', async () => {
    const { writes, runner } = mockRunner();
    let nativeTries = 0;
    let emuTurn = 0;
    const cfg = {
      family: 'ollama',
      runner,
      toolNames: ['write_file', 'run_command'],
      ollamaSupportsTools: async () => true,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async () => {
        nativeTries++;
        return {
          content: 'Primero generaremos la estructura:\n```json\n{"name":"write_file","args":{"path":"index.html","content":"<h1>h</h1>"}}\n```',
          rawCalls: [],
          calls: [],
        };
      },
      pushNative: () => {},
      emulatedText: async () => {
        emuTurn++;
        if (emuTurn === 1) return '```tool\n{"name":"write_file","args":{"path":"index.html","content":"<h1>h</h1>"}}\n```';
        return 'proyecto terminado ✔';
      },
    };
    const modes = [];
    const res = await agentEngine(cfg, CONV, { onMode: (m) => modes.push(m), maxIterations: 6 });
    expect(nativeTries).toBe(1);
    expect(res.mode).toBe('emulated');
    expect(modes).toContain('emulated');
    expect(writes.length).toBe(1);
    expect(writes[0].name).toBe('write_file');
    expect(res.finalText).toContain('terminado');
  });

  test('NUDGE: primer turno con pregunta/disculpa y cero herramientas → obliga a ejecutar', async () => {
    const { writes, runner } = mockRunner();
    let turn = 0;
    const cfg = {
      family: 'ollama',
      runner,
      toolNames: ['write_file'],
      ollamaSupportsTools: async () => true,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async (history) => {
        turn++;
        if (turn === 1) return { content: 'Lo siento, ¿te gustaría que cree el archivo?', rawCalls: [], calls: [] };
        const flat = JSON.stringify(history.msgs);
        expect(flat).toContain('SÍ: hazlo ahora');
        if (turn === 2) {
          return {
            content: '',
            rawCalls: [{ id: 'c9', function: { name: 'write_file', arguments: { path: 'index.html', content: '<h1>ok</h1>' } } }],
            calls: [{ id: 'c9', name: 'write_file', args: { path: 'index.html', content: '<h1>ok</h1>' } }],
          };
        }
        return { content: 'Proyecto listo.', rawCalls: [], calls: [] };
      },
      pushNative: () => {},
      emulatedText: async () => 'x',
    };
    const res = await agentEngine(cfg, CONV, { maxIterations: 6 });
    expect(writes.length).toBe(1);
    expect(writes[0].args.path).toBe('index.html');
    expect(turn).toBeGreaterThanOrEqual(2);
    void res;
  });

  test('RESCATE nativo: el modelo "muestra" un ```html sin llamar a write_file y el engine lo guarda', async () => {
    const { writes, runner } = mockRunner();
    let turn = 0;
    const cfg = {
      family: 'ollama',
      runner,
      toolNames: ['write_file'],
      ollamaSupportsTools: async () => true,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async (history) => {
        turn++;
        if (turn === 1) {
          return {
            content: 'Llamé a write_file para crear index.html con el siguiente contenido:\n```html\n<!DOCTYPE html>\n<html lang="es"><body><h1>API 570</h1></body></html>\n```',
            rawCalls: [],
            calls: [],
          };
        }
        // tras el rescate, la historia debe contener la OBSERVACIÓN del rescate
        const flat = JSON.stringify(history.msgs);
        expect(flat).toContain('RESCATE AUTOMÁTICO');
        return { content: 'Proyecto terminado: 1 archivo.', rawCalls: [], calls: [] };
      },
      pushNative: () => {},
      emulatedText: async () => 'x',
    };
    const res = await agentEngine(cfg, CONV, { maxIterations: 6 });
    expect(res.finalText).toContain('Proyecto terminado');
    expect(writes.length).toBe(1);
    expect(writes[0].name).toBe('write_file');
    expect(writes[0].args.path).toBe('index.html');
    expect(writes[0].args.content).toContain('API 570');
  });

  test('texto final sin llamadas ni bloques termina normalmente', async () => {
    const { runner, writes } = mockRunner();
    const cfg = {
      family: 'ollama',
      runner,
      toolNames: ['write_file'],
      ollamaSupportsTools: async () => true,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async () => ({ content: 'La respuesta es 42.', rawCalls: [], calls: [] }),
      pushNative: () => {},
      emulatedText: async () => 'x',
    };
    const res = await agentEngine(cfg, CONV, { maxIterations: 4 });
    expect(res.finalText).toBe('La respuesta es 42.');
    expect(writes.length).toBe(0);
  });

  test('reintenta cuando el modelo emite un bloque tool con JSON inválido', async () => {
    const { writes, runner } = mockRunner();
    let n = 0;
    const cfg = {
      family: 'ollama',
      runner,
      ollamaSupportsTools: async () => false,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async () => {
        throw new Error('no');
      },
      pushNative: () => {},
      emulatedText: async () => {
        n++;
        if (n === 1) return '```tool\n{"name":"write_file","args":{"path":"x.txt","content":"roto \\\\"truncado}\n```';
        if (n === 2) return '```tool\n{"name":"write_file","args":{"path":"x.txt","content":"ya valid"}}\n```';
        return 'listo ✔';
      },
    };
    const res = await agentEngine(cfg, CONV, { maxIterations: 8 });
    expect(res.finalText).toBe('listo ✔');
    expect(writes.length).toBe(1);
    expect(writes[0].args.content).toBe('ya valid');
  });

  test('tras 3 JSONs inválidos seguidos se rinde y devuelve el texto', async () => {
    const { runner, writes } = mockRunner();
    const cfg = {
      family: 'ollama',
      runner,
      ollamaSupportsTools: async () => false,
      initHistory: () => ({ msgs: [] }),
      nativeStep: async () => {
        throw new Error('no');
      },
      pushNative: () => {},
      emulatedText: async () => '```tool\n{"name":"write_file", broken json!!\n```',
    };
    const res = await agentEngine(cfg, CONV, { maxIterations: 10 });
    expect(writes.length).toBe(0);
    expect(res.finalText).toContain('tool');
    expect(res.iterations).toBeLessThanOrEqual(5);
  });
});
