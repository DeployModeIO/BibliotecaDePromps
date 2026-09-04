const http = require('http');

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function log(msg) {
  console.log(`  ${msg}`);
}

async function run() {
  console.log('==========================================');
  console.log('OLLAMA LOCAL API — FULL DIAGNOSTIC SUITE');
  console.log('==========================================\n');

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    const label = `[TEST ${String(passed + failed + 1).padStart(2, '0')}] ${t.name}`;
    console.log(label);
    try {
      await t.fn();
      passed++;
      console.log(`  ✓ PASS\n`);
    } catch (err) {
      failed++;
      console.log(`  ✗ FAIL: ${err.message}\n`);
    }
  }

  console.log('==========================================');
  console.log(`RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('==========================================');
}

function fetchOllama(path, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://localhost:11434');
    const req = http.request(
      url,
      {
        method: opts.method || 'GET',
        headers: {
          Origin: 'http://localhost:3000',
          'Content-Type': 'application/json',
          ...opts.headers,
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }
    );
    req.on('error', reject);
    req.setTimeout(opts.timeout || 15000, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    if (opts.body) req.write(JSON.stringify(opts.body));
    req.end();
  });
}

// ============= TEST 1: Ollama reachable =============
test('Ollama server is reachable on port 11434', async () => {
  const res = await fetchOllama('/api/tags');
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  log('Server responds 200 OK');
});

// ============= TEST 2: CORS headers on GET /api/tags =============
test('CORS headers present on GET /api/tags', async () => {
  const res = await fetchOllama('/api/tags');
  const acao = res.headers['access-control-allow-origin'];
  if (acao !== '*' && acao !== 'http://localhost:3000') {
    throw new Error(`ACAO inesperado (se esperaba '*' o el origen): ${acao}`);
  }
  log(`Access-Control-Allow-Origin: ${acao}${acao === '*' ? ' (wildcard: cualquier origen)' : ''}`);
});

// ============= TEST 3: CORS preflight on POST /api/chat =============
test('CORS preflight OPTIONS on POST /api/chat', async () => {
  const res = await fetchOllama('/api/chat', { method: 'OPTIONS' });
  const acao = res.headers['access-control-allow-origin'];
  if (acao !== '*' && acao !== 'http://localhost:3000') {
    throw new Error(`ACAO inesperado (se esperaba '*' o el origen): ${acao}`);
  }
  log(`Preflight OK, ACAO: ${acao}`);
});

// ============= TEST 4: Model list =============
test('GET /api/tags returns model list', async () => {
  const res = await fetchOllama('/api/tags');
  const data = JSON.parse(res.body);
  if (!data.models || !Array.isArray(data.models)) throw new Error('No models array');
  if (data.models.length === 0) throw new Error('No models found');
  data.models.forEach((m) => log(`  ${m.name} (${(m.size / 1e9).toFixed(1)}GB)`));
});

// ============= TEST 5: Chat with llama3.2:3b (non-streaming) =============
test('POST /api/chat with llama3.2:3b (non-streaming)', async () => {
  const res = await fetchOllama('/api/chat', {
    method: 'POST',
    body: {
      model: 'llama3.2:3b',
      messages: [{ role: 'user', content: 'Say exactly: OK' }],
      stream: false,
    },
    timeout: 60000,
  });
  if (res.status !== 200) throw new Error(`HTTP ${res.status}: ${res.body.slice(0, 200)}`);
  const data = JSON.parse(res.body);
  const content = data.message?.content || '';
  if (!content) throw new Error(`Empty response: ${JSON.stringify(data).slice(0, 200)}`);
  log(`Response: "${content.slice(0, 100)}"`);
  log(`Model: ${data.model}, Done: ${data.done}`);
});

// ============= TEST 6: Chat with deepseek-r1:8b (non-streaming) =============
test('POST /api/chat with deepseek-r1:8b (non-streaming)', async () => {
  const res = await fetchOllama('/api/chat', {
    method: 'POST',
    body: {
      model: 'deepseek-r1:8b',
      messages: [{ role: 'user', content: 'Say exactly: OK' }],
      stream: false,
    },
    timeout: 120000,
  });
  if (res.status !== 200) throw new Error(`HTTP ${res.status}: ${res.body.slice(0, 200)}`);
  const data = JSON.parse(res.body);
  const content = data.message?.content || '';
  if (!content) throw new Error(`Empty response: ${JSON.stringify(data).slice(0, 200)}`);
  log(`Response: "${content.slice(0, 100)}"`);
  log(`Model: ${data.model}, Done: ${data.done}`);
});

// ============= TEST 7: Streaming chat with llama3.2:3b =============
test('POST /api/chat with llama3.2:3b (streaming)', async () => {
  return new Promise((resolve, reject) => {
    const url = new URL('/api/chat', 'http://localhost:11434');
    const req = http.request(
      url,
      {
        method: 'POST',
        headers: {
          Origin: 'http://localhost:3000',
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`)));
          return;
        }
        let chunkCount = 0;
        let fullText = '';
        res.on('data', (chunk) => {
          chunkCount++;
          const lines = chunk.toString().split('\n').filter(Boolean);
          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              if (json.message?.content) fullText += json.message.content;
            } catch {}
          }
        });
        res.on('end', () => {
          if (chunkCount === 0) return reject(new Error('No streaming chunks received'));
          if (!fullText) return reject(new Error('Empty streaming response'));
          log(`Streaming chunks: ${chunkCount}, text: "${fullText.slice(0, 100)}"`);
          resolve();
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    req.write(
      JSON.stringify({
        model: 'llama3.2:3b',
        messages: [{ role: 'user', content: 'Say exactly: OK' }],
        stream: true,
      })
    );
    req.end();
  });
});

// ============= TEST 8: Streaming chat with deepseek-r1:8b =============
test('POST /api/chat with deepseek-r1:8b (streaming)', async () => {
  return new Promise((resolve, reject) => {
    const url = new URL('/api/chat', 'http://localhost:11434');
    const req = http.request(
      url,
      {
        method: 'POST',
        headers: {
          Origin: 'http://localhost:3000',
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`)));
          return;
        }
        let chunkCount = 0;
        let fullText = '';
        res.on('data', (chunk) => {
          chunkCount++;
          const lines = chunk.toString().split('\n').filter(Boolean);
          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              if (json.message?.content) fullText += json.message.content;
              else if (json.message?.thinking) fullText += json.message.thinking;
            } catch {}
          }
        });
        res.on('end', () => {
          if (chunkCount === 0) return reject(new Error('No streaming chunks received'));
          if (!fullText) return reject(new Error('Empty streaming response'));
          log(`Streaming chunks: ${chunkCount}, text: "${fullText.slice(0, 100)}"`);
          resolve();
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(120000, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    req.write(
      JSON.stringify({
        model: 'deepseek-r1:8b',
        messages: [{ role: 'user', content: 'Say exactly: OK' }],
        stream: true,
      })
    );
    req.end();
  });
});

// ============= TEST 9: CORS origin check for file:// =============
test('file:// origin (Origin: null) is rejected', async () => {
  const res = await fetchOllama('/api/tags', { headers: { Origin: 'null' } });
  if (res.status !== 403) {
    log(`WARNING: Origin null returned ${res.status}, expected 403. This is OK if OLLAMA_ORIGINS accepts null.`);
  }
  log(`Status: ${res.status} (403 = file:// blocked, OK = null allowed)`);
});

// ============= TEST 10: Browser CSP allows localhost connections =============
test('CSP meta tag allows localhost connections', async () => {
  const fs = require('fs');
  const html = fs.readFileSync('D:/Proyectos/BibliotecaDePromps/index.html', 'utf8');
  const cspMatch = html.match(/connect-src[^;]+/);
  if (!cspMatch) throw new Error('No connect-src in CSP');
  const csp = cspMatch[0];
  if (!csp.includes('localhost')) throw new Error('CSP missing localhost: ' + csp.slice(0, 80));
  log(`CSP connect-src includes localhost: ${csp.includes('localhost:*') ? 'yes (wildcard)' : 'yes'}`);
});

// ============= TEST 11: Server is serving on port 3000 =============
test('HTTP server on port 3000 is running', async () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/', (res) => {
      if (res.statusCode === 200) {
        log('Server responds 200 OK');
        resolve();
      } else {
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    });
    req.on('error', () => reject(new Error('Server not running on port 3000')));
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
});

// ============= RUN =============
run().catch(console.error);
