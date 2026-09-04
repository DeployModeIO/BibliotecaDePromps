/* ============================================================
   IA CHAT PANEL v1.1 — Auto-detección local + cloud genérico + Gemini API & Free Tiers
   ============================================================ */
/* global JSZip, marked, BPDStore */

const AIChat = (() => {
  const LS_PREFIX = 'aichat_';

  /* ============================================================
     LOCAL PROBES — Servidores locales y proxys compatibles
     ============================================================ */
  const LOCAL_PROBES = [
    {
      name: 'Ollama',
      url: 'http://localhost:11434/api/tags',
      type: 'ollama',
      chatEndpoint: 'http://localhost:11434/api/chat',
      tier: 'free',
    },
    {
      name: 'LM Studio',
      url: 'http://localhost:1234/v1/models',
      type: 'openai',
      chatEndpoint: 'http://localhost:1234/v1/chat/completions',
      tier: 'free',
    },
    {
      name: 'vLLM',
      url: 'http://localhost:8000/v1/models',
      type: 'openai',
      chatEndpoint: 'http://localhost:8000/v1/chat/completions',
      tier: 'free',
    },
    {
      name: 'LocalAI',
      url: 'http://localhost:8080/v1/models',
      type: 'openai',
      chatEndpoint: 'http://localhost:8080/v1/chat/completions',
      tier: 'free',
    },
    {
      name: 'llama.cpp server',
      url: 'http://localhost:8080/v1/models',
      type: 'openai',
      chatEndpoint: 'http://localhost:8080/v1/chat/completions',
      tier: 'free',
    },
    {
      name: 'LiteLLM proxy',
      url: 'http://localhost:4000/v1/models',
      type: 'openai',
      chatEndpoint: 'http://localhost:4000/v1/chat/completions',
      tier: 'free',
    },
    {
      name: 'Jan AI',
      url: 'http://localhost:1337/v1/models',
      type: 'openai',
      chatEndpoint: 'http://localhost:1337/v1/chat/completions',
      tier: 'free',
    },
    {
      name: 'KoboldCpp',
      url: 'http://localhost:5001/api/v1/model',
      type: 'kobold',
      chatEndpoint: 'http://localhost:5001/api/v1/generate',
      tier: 'free',
    },
    {
      name: 'Text-Gen-WebUI',
      url: 'http://localhost:5000/v1/models',
      type: 'openai',
      chatEndpoint: 'http://localhost:5000/v1/chat/completions',
      tier: 'free',
    },
    {
      name: 'GPT4All',
      url: 'http://localhost:4891/v1/models',
      type: 'openai',
      chatEndpoint: 'http://localhost:4891/v1/chat/completions',
      tier: 'free',
    },
  ];

  const state = {
    providers: [],
    activeProvider: null,
    activeModel: '',
    conversations: {},
    activeConvId: null,
    detecting: false,
    saveDir: null,
    autoDetectedLocal: [],
    maxTokens: 16384,
    agentMode: false,
    agentProjectDir: '',
    agentServerUrl: 'http://127.0.0.1:4864',
    agentServerToken: '',
    agentServer: { ok: false, info: null },
    ollamaToolsCache: {},
    localApiKeys: {},
  };

  const el = {};
  let initialized = false;
  let agentAbortRequested = false;

  function safeGet(key, fallback) {
    try {
      const raw = window.SafeStore ? window.SafeStore.get(LS_PREFIX + key) : localStorage.getItem(LS_PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function safeSet(key, val) {
    try {
      const s = JSON.stringify(val);
      if (window.SafeStore) window.SafeStore.set(LS_PREFIX + key, s);
      else localStorage.setItem(LS_PREFIX + key, s);
    } catch {
      /* ignore */
    }
  }

  function loadState() {
    state.providers = safeGet('providers', []);
    state.activeProvider = safeGet('activeProvider', null);
    state.activeModel = safeGet('activeModel', '');
    state.activeConvId = safeGet('activeConvId', null);
    state.autoDetectedLocal = safeGet('autoDetectedLocal', []);
    state.maxTokens = safeGet('maxTokens', 16384);
    state.agentMode = safeGet('agentMode', false);
    state.agentProjectDir = safeGet('agentProjectDir', '');
    state.agentServerUrl = safeGet('agentServerUrl', 'http://127.0.0.1:4864');
    state.agentServerToken = safeGet('agentServerToken', '');
    state.ollamaToolsCache = safeGet('ollamaToolsCache', {});
    if (!state.ollamaToolsCache || typeof state.ollamaToolsCache !== 'object') state.ollamaToolsCache = {};
    state.localApiKeys = safeGet('localApiKeys', {});
    if (!state.localApiKeys || typeof state.localApiKeys !== 'object') state.localApiKeys = {};
  }

  function saveState() {
    safeSet('activeProvider', state.activeProvider);
    safeSet('activeModel', state.activeModel);
    persistConversations();
    safeSet('activeConvId', state.activeConvId);
    safeSet('autoDetectedLocal', state.autoDetectedLocal);
    safeSet('maxTokens', state.maxTokens);
    safeSet('agentMode', state.agentMode);
    safeSet('agentProjectDir', state.agentProjectDir);
    safeSet('agentServerUrl', state.agentServerUrl);
    safeSet('agentServerToken', state.agentServerToken);
    safeSet('ollamaToolsCache', state.ollamaToolsCache);
    safeSet('localApiKeys', state.localApiKeys);
  }

  function persistConversations() {
    if (window.BPDStore) BPDStore.set('conversations', state.conversations);
    else safeSet('conversations', state.conversations);
  }

  function loadConversations(cb) {
    const legacy = safeGet('conversations', null);
    const done = (data) => {
      state.conversations = data && typeof data === 'object' ? data : legacy || {};
      if (cb) cb();
    };
    if (window.BPDStore) {
      BPDStore.get('conversations', null)
        .then((v) => {
          if (v && typeof v === 'object' && Object.keys(v).length) done(v);
          else {
            if (legacy && typeof legacy === 'object') {
              BPDStore.set('conversations', legacy);
            }
            done(legacy);
          }
        })
        .catch(() => done(legacy));
    } else {
      done(legacy);
    }
  }

  function getActiveConv() {
    if (!state.activeConvId) {
      state.activeConvId = 'conv_' + Date.now();
      state.conversations[state.activeConvId] = { title: 'Nueva conversación', messages: [], createdAt: Date.now() };
    }
    return state.conversations[state.activeConvId];
  }

  /* ---------- API detection ---------- */

  function cleanModelId(id) {
    const s = String(id || '').trim();
    if (!s) return s;
    const parts = s.split('/');
    return parts[parts.length - 1] || s;
  }

  function modelOptionLabel(provider, name) {
    const meta = (provider && provider.modelMeta && provider.modelMeta[name]) || {};
    const parts = [name];
    if (meta.sizeGb) parts.push(meta.sizeGb + 'GB');
    if (meta.params) parts.push(meta.params);
    if (meta.quant && meta.quant !== 'F16' && meta.quant !== 'F32') parts.push(meta.quant);
    if (meta.ctx) parts.push(Math.round(meta.ctx / 1024) + 'k ctx');
    if (meta.loaded) parts.push('●cargado');
    const toolsKnown = meta.tools !== undefined ? !!meta.tools : state.ollamaToolsCache[name] !== undefined ? state.ollamaToolsCache[name] === true : null;
    if (toolsKnown) parts.push(toolsKnown ? '⚡tools' : 'sin tools');
    return parts.join(' · ');
  }

  /* Sonda de capacidades de Ollama (/api/show → capabilities.tools) en segundo
     plano: alimenta los badges ⚡ del selector y la auto-elección del modo agente. */
  function probeOllamaCapabilities(provider) {
    if (!provider || provider.localType !== 'ollama' || provider.corsBlocked) return;
    const origin = new URL(provider.endpoint, typeof location !== 'undefined' ? location.href : 'http://localhost/')
      .origin;
    const models = (provider.models || []).slice(0, 30);
    let updated = false;
    Promise.allSettled(
      models.map(async (name) => {
        if (state.ollamaToolsCache[name] !== undefined) return;
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 5000);
          const r = await fetch(origin + '/api/show', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: name }),
            signal: ctrl.signal,
          });
          clearTimeout(t);
          if (!r.ok) return;
          const d = await r.json();
          state.ollamaToolsCache[name] = !!(Array.isArray(d.capabilities) && d.capabilities.indexOf('tools') !== -1);
          updated = true;
        } catch {
          /* modelo sin capacidades conocidas */
        }
      })
    ).then(async () => {
      let changed = false;
      if (updated) {
        safeSet('ollamaToolsCache', state.ollamaToolsCache);
        changed = true;
        console.log('[AIChat] capacidades Ollama actualizadas:', Object.keys(state.ollamaToolsCache).length, 'modelos');
      }
      /* /api/ps: qué modelos están cargados en memoria ahora mismo */
      try {
        const ps = await fetch(origin + '/api/ps');
        if (ps.ok) {
          const pd = await ps.json();
          const loaded = new Set((pd.models || []).map((m) => m.name || m.model));
          const entry = (state.autoDetectedLocal || []).find((r) => r.type === 'ollama');
          if (entry && entry.modelMeta) {
            let touched = false;
            Object.keys(entry.modelMeta).forEach((name) => {
              const want = loaded.has(name);
              if (!!entry.modelMeta[name].loaded !== want) {
                entry.modelMeta[name].loaded = want;
                touched = true;
              }
            });
            if (touched) changed = true;
          }
        }
      } catch {
        /* /api/ps opcional */
      }
      if (changed) {
        syncProviders();
        renderProviderSelect();
      }
    });
  }

  /* LM Studio expone su API nativa /api/v0/models con estado de carga, cuantización
     y contexto. Si no está disponible (versiones antiguas u otros servidores
     OpenAI-compatibles), se ignora en silencio. */
  async function enrichLmStudioModels(probeUrl, meta, apiKey) {
    try {
      const base = String(probeUrl || '').replace(/\/v1\/models\/?$/, '');
      if (!base || base === probeUrl) return;
      const headers = { Accept: 'application/json' };
      if (apiKey) headers['Authorization'] = 'Bearer ' + apiKey;
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 2500);
      const r = await fetch(base + '/api/v0/models', { headers, signal: ctrl.signal });
      clearTimeout(t);
      if (!r.ok) return;
      const d = await r.json();
      (d.data || d || []).forEach((m) => {
        if (!m || !m.id) return;
        const prev = meta[m.id] || {};
        meta[m.id] = Object.assign(prev, {
          loaded: m.state === 'loaded' || m.state === 'loading',
          quant: m.quantization || prev.quant,
          arch: m.arch || prev.arch,
          ctx: m.max_context_length || prev.ctx,
          tools: Array.isArray(m.tools) ? m.tools.length > 0 : prev.tools,
        });
      });
    } catch {
      /* API nativa no disponible: seguimos con /v1/models */
    }
  }

  async function probeOne(probe) {
    const t0 = Date.now();
    const apiKey = (state.localApiKeys || {})[probe.name] || '';
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    try {
      let resp;
      const headers = {};
      if (apiKey) headers['Authorization'] = 'Bearer ' + apiKey;
      try {
        resp = await fetch(probe.url, { signal: ctrl.signal, headers });
      } catch (corsErr) {
        if (probe.type === 'ollama') {
          try {
            await fetch(probe.url, { signal: ctrl.signal, mode: 'no-cors' });
            return {
              ...probe,
              models: [],
              modelMeta: {},
              status: 'online',
              corsBlocked: true,
              latencyMs: Date.now() - t0,
            };
          } catch {
            /* no-cors también falló */
          }
        }
        throw corsErr;
      }
      clearTimeout(t);
      if (resp.status === 401) {
        return { ...probe, models: [], modelMeta: {}, status: 'auth-required', authRequired: true, latencyMs: Date.now() - t0 };
      }
      if (!resp.ok) return null;
      const rawModels = [];
      const modelMeta = {};
      try {
        const data = await resp.json();
        if (probe.type === 'ollama') {
          (data.models || data || []).forEach((m) => {
            const name = m.name || m.model || String(m);
            rawModels.push(name);
            modelMeta[name] = {
              sizeGb: m.size ? Math.round(m.size / 1e7) / 100 : undefined,
              params: m.details && m.details.parameter_size,
              quant: m.details && m.details.quantization_level,
              family: m.details && m.details.family,
            };
          });
        } else if (probe.type === 'kobold') {
          rawModels.push(data.result || data.model || 'kobold-model');
        } else {
          (data.data || data.models || data || []).forEach((m) => {
            const id = m.id || m.name || String(m);
            rawModels.push(id);
            modelMeta[id] = { ctx: m.context_length || m.max_context_length };
          });
        }
      } catch {
        /* respuesta sin JSON: lista vacía pero servidor vivo */
      }
      const models = rawModels.filter(isAgentCapableModel);
      if (probe.type === 'openai') {
        await enrichLmStudioModels(probe.url, modelMeta, apiKey);
      }
      return { ...probe, models, modelMeta, status: 'online', latencyMs: Date.now() - t0 };
    } catch {
      return null;
    } finally {
      clearTimeout(t);
    }
  }

  function isAgentCapableModel(name) {
    const n = String(name || '').toLowerCase();
    if (!n) return false;
    if (/embed|embedding|nomic-embed|bge-|e5-|gte-|mxbai-/.test(n)) return false;
    if (/mimo-vl|vl-miloco|vl-|vision.*base|llava|moondream|minicpm-v|qwen2-vl|idefics|florence/.test(n)) return false;
    if (/bonsai-27b(?!.*instruct)/i.test(n)) return false;
    if (/glm-4\.6v-flash(?!.*instruct)/i.test(n)) return false;
    if (/qwen2\.5-coder|qwen3\.5|qwen2\.5.*instruct|qwen2.*chat/.test(n)) return true;
    if (/gemma-.*it(?:-|$)|gemma-.*instruct|gemma-.*chat/.test(n)) return true;
    if (/mistral.*instruct|mistral.*chat/.test(n)) return true;
    if (/llama-?3(?!.*base).*instruct|llama-?3(?!.*base).*chat/.test(n)) return true;
    if (/deepseek-r1|deepseek-v3|deepseek.*instruct/.test(n)) return true;
    if (/gpt-oss-20b/.test(n)) return true;
    if (/instruct|chat|coder|tool|agent|oss/.test(n)) return true;
    return false;
  }

  async function detectLocal() {
    state.detecting = true;
    updateStatus('escaneando locales...');
    const settled = await Promise.all(LOCAL_PROBES.map((p) => probeOne(p)));
    const results = settled.filter((r) => r);
    state.autoDetectedLocal = results;
    state.detecting = false;
    syncProviders();
    saveState();
    renderProviderSelect();
    updateStatus();
    probeOllamaCapabilities(results.find((r) => r.type === 'ollama'));
    if (results.length) {
      const authBlocked = results.filter((r) => r.authRequired);
      if (authBlocked.length && authBlocked.length === results.length) {
        showToast('🔒 ' + authBlocked.map((r) => r.name).join(', ') + ' requiere llave (passkey) — Configuración avanzada');
      } else {
        showToast(
          'Locales detectados: ' +
            results.map((r) => r.name + (r.latencyMs != null ? ' (' + r.latencyMs + ' ms)' : '')).join(', ') +
            (authBlocked.length ? ' · 🔒 ' + authBlocked.map((r) => r.name).join(', ') + ' requiere llave' : '')
        );
      }
    } else {
      showToast('No se detectaron servidores locales');
    }
    return results;
  }

  /* Sincroniza state.providers desde los locales auto-detectados (única fuente:
     servidores locales; no hay proveedores cloud). */
  function syncProviders() {
    const locals = (state.autoDetectedLocal || []).map((d) => ({
      id: 'local_' + String(d.name).toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      name: d.name,
      isLocal: true,
      localType: d.type,
      type: d.type,
      endpoint: d.chatEndpoint,
      models: d.models || [],
      modelMeta: d.modelMeta || {},
      defaultModel: (d.models || [])[0] || '',
      corsBlocked: !!d.corsBlocked,
      authRequired: !!d.authRequired,
      latencyMs: d.latencyMs,
      apiKey: (state.localApiKeys || {})[d.name] || '',
    }));
    state.providers = locals;
    if (!locals.length) {
      state.activeProvider = null;
    } else if (!locals.find((p) => p.id === state.activeProvider)) {
      state.activeProvider = locals[0].id;
    }
  }

  /* ---------- API calls ---------- */

  let abortController = null;

  async function sendMessage(content) {
    const conv = getActiveConv();
    conv.messages.push({ role: 'user', content, time: Date.now() });
    saveState();
    renderMessages();

    const provider = state.providers.find((p) => p.id === state.activeProvider);
    if (!provider) {
      appendSystemMsg('No hay proveedor activo. Seleccione uno en el panel de configuración.');
      return;
    }
    if (provider.authRequired && !provider.apiKey) {
      appendSystemMsg(
        '🔒 ' + provider.name + ' exige passkey (HTTP 401). LM Studio: Developer → Permission Management → copia la passkey y pégala en Configuración avanzada → Llave de servidores locales.'
      );
      return;
    }

    updateStatus('generando...');
    const msgEl = appendAssistantPlaceholder();
    showStopButton();
    agentAbortRequested = false;

    try {
      let response;

      if (state.agentMode) {
        response = await runAgentTurn(provider, conv, msgEl);
      } else if (provider.isLocal && provider.localType === 'ollama') {
        response = await streamOllama(provider, conv, msgEl);
      } else if (provider.isLocal && provider.localType === 'kobold') {
        response = await callKobold(provider, conv);
      } else if (provider.isLocal && provider.localType === 'openai') {
        response = await streamOpenAI(provider, conv, msgEl);
      } else {
        response = await callOpenAICompatible(provider, conv);
      }

      if (!msgEl.dataset.streamed) {
        msgEl.innerHTML = renderMarkdown(response);
      }
      processMermaid(msgEl);
      conv.messages.push({ role: 'assistant', content: response, time: Date.now() });
      saveState();
    } catch (err) {
      if (err.name === 'AbortError') {
        msgEl.innerHTML += '<div class="chat-stopped">⏹ Generación detenida</div>';
      } else {
        msgEl.innerHTML = '<span class="chat-err">Error: ' + escapeHtml(err.message) + '</span>';
      }
      conv.messages.push({ role: 'assistant', content: msgEl.textContent || 'ERROR: ' + err.message, time: Date.now() });
      saveState();
    }

    hideStopButton();
    updateStatus();
    scrollChat();
  }

  function showStopButton() {
    el.chatSend.style.display = 'none';
    if (!document.getElementById('chatStop')) {
      const btn = document.createElement('button');
      btn.id = 'chatStop';
      btn.className = 'chat-stop';
      btn.textContent = '⏹';
      btn.title = 'Detener generación';
      btn.addEventListener('click', () => {
        agentAbortRequested = true;
        if (abortController) abortController.abort();
      });
      el.chatSend.parentElement.appendChild(btn);
    }
    document.getElementById('chatStop').style.display = '';
  }

  function hideStopButton() {
    el.chatSend.style.display = '';
    const stopBtn = document.getElementById('chatStop');
    if (stopBtn) stopBtn.style.display = 'none';
    abortController = null;
  }

  async function streamOpenAI(provider, conv, msgEl) {
    abortController = new AbortController();
    const messages = conv.messages
      .filter((m) => m.role !== 'assistant' || !m.content.startsWith('ERROR:'))
      .map((m) => ({ role: m.role, content: m.content }));

    const headers = { 'Content-Type': 'application/json' };
    if (provider.apiKey) {
      if (provider.authType === 'x-api-key') {
        headers['x-api-key'] = provider.apiKey;
      } else {
        headers['Authorization'] = 'Bearer ' + provider.apiKey;
      }
    }
    if (provider.headers) Object.assign(headers, provider.headers);

    const resp = await fetch(provider.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: state.activeModel || provider.defaultModel,
        messages,
        max_tokens: state.maxTokens || 16384,
        temperature: 0.7,
        stream: true,
      }),
      signal: abortController.signal,
    });

    if (!resp.ok) throw new Error(await resp.text());

    let fullText = '';
    let reasoning = '';
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      // eslint-disable-line no-constant-condition
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') break;
        try {
      const json = JSON.parse(data);
      const delta = json.choices?.[0]?.delta?.content;
      const think = json.choices?.[0]?.delta?.reasoning_content || json.choices?.[0]?.delta?.reasoning;
      if (think) reasoning += think;
      if (delta || (think && !delta)) {
        if (delta) {
          fullText += delta;
          msgEl.innerHTML = renderMarkdown(fullText) + '<span class="typing-cursor">|</span>';
          msgEl.dataset.streamed = '1';
          scrollChat();
        } else if (reasoning) {
          /* LM Studio con separateReasoningContentInAPI: mostrar razonamiento
             mientras no llega el contenido final */
          msgEl.innerHTML = renderMarkdown('💭 ' + reasoning.slice(-600)) + '<span class="typing-cursor">|</span>';
          msgEl.dataset.streamed = '1';
          scrollChat();
        }
      }
        } catch {
          /* ignore partial */
        }
      }
    }
    const finalText = fullText || reasoning;
    msgEl.innerHTML = renderMarkdown(finalText);
    return finalText;
  }

  async function streamOllama(provider, conv, msgEl) {
    abortController = new AbortController();
    const messages = conv.messages
      .filter((m) => m.role !== 'assistant' || !m.content.startsWith('ERROR:'))
      .map((m) => ({ role: m.role, content: m.content }));

    let resp;
    try {
      resp = await fetch(provider.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: state.activeModel || provider.defaultModel,
          messages,
          stream: true,
          keep_alive: '30m',
          options: { num_predict: state.maxTokens || 16384 },
        }),
        signal: abortController.signal,
      });
    } catch (fetchErr) {
      if (fetchErr.message && (fetchErr.message.includes('Failed to fetch') || fetchErr.message.includes('NetworkError'))) {
        const isFileProtocol = window.location.protocol === 'file:';
        if (isFileProtocol) {
          throw new Error(
            'Estás abriendo la página como archivo local (file://).\nAbre http://localhost:3000 en vez de file:///D:/Proyectos/...'
          );
        }
        throw new Error(
          'Ollama no accesible por CORS. En Windows, abre una terminal Admin y ejecuta:\n' +
            'setx OLLAMA_ORIGINS "*"\n' +
            'Luego reinicia Ollama. Verifica en http://localhost:11434'
        );
      }
      throw fetchErr;
    }

    if (!resp.ok) throw new Error(await resp.text());

    let fullText = '';
    let reasoning = '';
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      // eslint-disable-line no-constant-condition
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          const delta = json.message?.content || json.response;
          const think = json.message?.thinking;
          if (think) reasoning += think;
          if (delta || (think && !delta)) {
            if (delta) fullText += delta;
            /* modelos razonadores: mientras no hay contenido visible se
               muestra el razonamiento (deepseek-r1, qwen3, gpt-oss) */
            const shown = fullText || (reasoning ? '💭 ' + reasoning.slice(-600) : '');
            if (shown) {
              msgEl.innerHTML = renderMarkdown(shown) + '<span class="typing-cursor">|</span>';
              msgEl.dataset.streamed = '1';
              scrollChat();
            }
          }
        } catch {
          /* ignore */
        }
      }
    }
    const finalText = fullText || reasoning;
    msgEl.innerHTML = renderMarkdown(finalText);
    return finalText;
  }

  async function _callOllama(provider, conv) {
    const messages = conv.messages
      .filter((m) => m.role !== 'assistant' || !m.content.startsWith('ERROR:'))
      .map((m) => ({ role: m.role, content: m.content }));
    const resp = await fetch(provider.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: state.activeModel || provider.defaultModel,
        messages,
        stream: false,
        keep_alive: '30m',
        options: { num_predict: state.maxTokens || 16384 },
      }),
    });
    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    return data.message?.content || data.response || JSON.stringify(data);
  }

  async function callKobold(provider, conv) {
    const lastUser = [...conv.messages].reverse().find((m) => m.role === 'user');
    const prompt = lastUser ? lastUser.content : '';
    const resp = await fetch(provider.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, max_length: 2048, temperature: 0.7 }),
    });
    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    return data.results?.[0]?.text || data.text || JSON.stringify(data);
  }

  async function callOpenAICompatible(provider, conv) {
    const messages = conv.messages
      .filter((m) => m.role !== 'assistant' || !m.content.startsWith('ERROR:'))
      .map((m) => ({ role: m.role, content: m.content }));
    const headers = { 'Content-Type': 'application/json' };
    if (provider.apiKey) {
      if (provider.authType === 'x-api-key') {
        headers['x-api-key'] = provider.apiKey;
      } else {
        headers['Authorization'] = 'Bearer ' + provider.apiKey;
      }
    }
    if (provider.headers) Object.assign(headers, provider.headers);

    const body = {
      model: state.activeModel || provider.defaultModel,
      messages,
      max_tokens: state.maxTokens || 16384,
      temperature: 0.7,
    };

    const resp = await fetch(provider.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    const msg = data.choices?.[0]?.message;
    return msg?.content || msg?.reasoning_content || msg?.reasoning || data.content?.[0]?.text || JSON.stringify(data);
  }

  /* ---------- file saving ---------- */

  async function selectSaveDir() {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
      state.saveDir = handle;
      safeSet('saveDirName', handle.name);
      updateStatus('carpeta seleccionada: ' + handle.name);
      return handle;
    } catch (err) {
      if (err.name !== 'AbortError') showToast('Acceso a carpeta denegado o no soportado');
      return null;
    }
  }

  async function saveGeneratedFiles(files) {
    if (state.saveDir) {
      try {
        const perm = await state.saveDir.queryPermission({ mode: 'readwrite' });
        if (perm !== 'granted') {
          const req = await state.saveDir.requestPermission({ mode: 'readwrite' });
          if (req !== 'granted') {
            downloadAsZip(files);
            return;
          }
        }
        for (const file of files) {
          const parts = file.name.split('/');
          let currentDir = state.saveDir;
          for (let i = 0; i < parts.length - 1; i++) {
            currentDir = await currentDir.getDirectoryHandle(parts[i], { create: true });
          }
          const fileHandle = await currentDir.getFileHandle(parts[parts.length - 1], { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(file.content);
          await writable.close();
        }
        showToast('Guardado en: ' + state.saveDir.name + ' (' + files.length + ' archivos)');
        return;
      } catch {
        downloadAsZip(files);
        return;
      }
    }
    downloadAsZip(files);
  }

  function downloadFile(name, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Descargado: ' + name);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  async function downloadAsZip(files) {
    // Lazy-load: JSZip solo se descarga cuando se exporta un ZIP
    if (typeof JSZip === 'undefined' && window.LibLoader) {
      await window.LibLoader.jszip();
    }
    if (typeof JSZip === 'undefined') {
      showToast('JSZip no cargado — descargando archivos individuales');
      files.forEach((f) => downloadFile(f.name, f.content));
      return;
    }
    const zip = new JSZip();
    files.forEach((f) => zip.file(f.name, f.content));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proyecto_generado.zip';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Descargado como ZIP (' + files.length + ' archivos)');
  }

  function extractCodeFromResponse(response) {
    const files = [];
    const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
    let match;
    let idx = 0;
    while ((match = codeBlockRegex.exec(response)) !== null) {
      const lang = (match[1] || 'txt').toLowerCase();
      const content = match[2].trim();
      const extMap = {
        html: 'html',
        css: 'css',
        javascript: 'js',
        js: 'js',
        json: 'json',
        python: 'py',
        bash: 'sh',
        sh: 'sh',
        yaml: 'yml',
        xml: 'xml',
        md: 'md',
      };
      const ext = extMap[lang] || 'txt';
      files.push({ name: 'archivo_' + ++idx + '.' + ext, content });
    }
    return files;
  }

  /* ---------- UI ---------- */

  function init() {
    if (initialized) return;
    cacheDom();
    loadState();
    syncProviders();
    renderProviderSelect();
    if (el.maxTokensSelect) el.maxTokensSelect.value = String(state.maxTokens || 16384);
    if (el.agentModeToggle) el.agentModeToggle.checked = !!state.agentMode;
    if (el.agentForceBtn) {
      el.agentForceBtn.setAttribute('aria-pressed', state.agentMode ? 'true' : 'false');
      if (state.agentMode) el.agentForceBtn.textContent = '⚡ Modo agente COMPLETO activo (leer + escribir + comandos + web)';
    }
    if (el.agentProjectDir) el.agentProjectDir.value = state.agentProjectDir || '';
    if (el.agentServerUrl) el.agentServerUrl.value = state.agentServerUrl;
    if (el.agentServerToken) el.agentServerToken.value = state.agentServerToken;
    bindEvents();
    loadConversations(() => {
      renderMessages();
      renderConversations();
      scrollChat();
    });
    if (!state.providers.length || state.autoDetectedLocal.length === 0) {
      detectLocal().catch((err) => console.error('[AIChat] detectLocal failed:', err));
    }
    renderAgentCapabilityUI();
    detectAgentServer();
    initialized = true;
    initMermaid();
    console.log('[AIChat] Initialized — providers:', state.providers.length, 'active:', state.activeProvider, 'agent:', state.agentMode);
  }

  let mermaidReady = false;
  function initMermaid() {
    if (mermaidReady || !window.mermaid) return;
    try {
      window.mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'strict' });
      mermaidReady = true;
    } catch (e) {
      /* ignore */
    }
  }

  function cacheDom() {
    el.chatDrawer = document.getElementById('chatDrawer');
    el.chatScrim = document.getElementById('chatScrim');
    el.chatToggle = document.getElementById('chatToggle');
    el.chatClose = document.getElementById('chatClose');
    el.providerSelect = document.getElementById('aiProviderSelect');
    el.modelSelect = document.getElementById('aiModelSelect');
    el.chatMessages = document.getElementById('chatMessages');
    el.chatInput = document.getElementById('chatInput');
    el.chatSend = document.getElementById('chatSend');
    el.chatStatus = document.getElementById('chatStatus');
    el.saveDirBtn = document.getElementById('aiSaveDirBtn');
    el.saveDirLabel = document.getElementById('aiSaveDirLabel');
    el.newConvBtn = document.getElementById('aiNewConv');
    el.convList = document.getElementById('aiConvList');
    el.saveFilesBtn = document.getElementById('aiSaveFiles');
    el.convDelAll = document.getElementById('aiConvDelAll');
    el.maxTokensSelect = document.getElementById('aiMaxTokens');
    el.rescanLocalBtn = document.getElementById('aiRescanLocal');
    el.localApiKeyInput = document.getElementById('aiLocalApiKey');
    el.agentForceBtn = document.getElementById('aiAgentForce');
    el.agentCapsStatus = document.getElementById('aiAgentCapsStatus');
    el.agentProjectDir = document.getElementById('aiAgentProjectDir');
    el.agentModeToggle = document.getElementById('aiAgentMode');
    el.agentServerUrl = document.getElementById('aiAgentServerUrl');
    el.agentServerToken = document.getElementById('aiAgentServerToken');
    el.agentServerStatus = document.getElementById('aiAgentServerStatus');
    el.agentServerDetectBtn = document.getElementById('aiAgentServerDetect');
  }

  function bindEvents() {
    if (el.chatToggle) el.chatToggle.addEventListener('click', () => openDrawer());
    if (el.chatClose) el.chatClose.addEventListener('click', () => closeDrawer());
    if (el.chatScrim) el.chatScrim.addEventListener('click', () => closeDrawer());
    if (el.providerSelect) el.providerSelect.addEventListener('change', onProviderChange);
    if (el.modelSelect) el.modelSelect.addEventListener('change', onModelChange);
    if (el.chatSend) el.chatSend.addEventListener('click', () => sendCurrentMessage());
    if (el.chatInput) {
      el.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendCurrentMessage();
        }
      });
    }
    if (el.saveDirBtn) el.saveDirBtn.addEventListener('click', () => selectSaveDir());
    if (el.newConvBtn) el.newConvBtn.addEventListener('click', () => newConversation());
    if (el.saveFilesBtn) el.saveFilesBtn.addEventListener('click', () => saveCurrentFiles());
    if (el.convDelAll) el.convDelAll.addEventListener('click', () => deleteAllConversations());

    if (el.agentModeToggle) {
      el.agentModeToggle.addEventListener('change', () => {
        if (el.agentModeToggle.checked) enableAgentFullMode();
        else disableAgentFullMode();
      });
    }
    if (el.agentForceBtn) el.agentForceBtn.addEventListener('click', () => toggleAgentFullMode());
    if (el.agentProjectDir) {
      el.agentProjectDir.addEventListener('change', () => {
        state.agentProjectDir = sanitizeProjectDir(el.agentProjectDir.value);
        el.agentProjectDir.value = state.agentProjectDir;
        saveState();
        renderAgentCapabilityUI();
      });
    }
    if (el.agentServerUrl) {
      el.agentServerUrl.addEventListener('change', () => {
        state.agentServerUrl = el.agentServerUrl.value.trim().replace(/\/+$/, '');
        el.agentServerUrl.value = state.agentServerUrl;
        saveState();
        detectAgentServer();
      });
    }
    if (el.agentServerToken) {
      el.agentServerToken.addEventListener('change', () => {
        state.agentServerToken = el.agentServerToken.value.trim();
        saveState();
        detectAgentServer();
      });
    }
    if (el.agentServerDetectBtn) el.agentServerDetectBtn.addEventListener('click', () => detectAgentServer());
    if (el.rescanLocalBtn)
      el.rescanLocalBtn.addEventListener('click', () => {
        if (state.detecting) return;
        detectLocal().catch((err) => console.error('[AIChat] rescan failed:', err));
      });
    if (el.localApiKeyInput) {
      el.localApiKeyInput.addEventListener('change', () => {
        const provider = state.providers.find((p) => p.id === state.activeProvider);
        if (!provider) {
          showToast('Seleccione primero un servidor local');
          return;
        }
        state.localApiKeys[provider.name] = el.localApiKeyInput.value.trim();
        saveState();
        showToast('Llave guardada para ' + provider.name + ' — re-escaneando...');
        detectLocal().catch(() => {});
      });
    }

    if (el.chatMessages) {
      el.chatMessages.addEventListener('click', (e) => {
        const runBtn = e.target.closest('.code-run-btn');
        const copyBtn = e.target.closest('.code-copy-btn');
        const saveBtn = e.target.closest('.code-save-btn');
        if (runBtn && runBtn.dataset.lang && runBtn.dataset.code) {
          openSandbox(runBtn.dataset.code, runBtn.dataset.lang);
        }
        if (copyBtn && copyBtn.dataset.code) {
          copyToClipboard(copyBtn.dataset.code);
          copyBtn.textContent = '✓ Copiado!';
          setTimeout(() => {
            copyBtn.textContent = '📋 Copiar';
          }, 2000);
        }
        if (saveBtn && saveBtn.dataset.code) {
          const extMap = {
            html: 'html',
            css: 'css',
            javascript: 'js',
            js: 'js',
            json: 'json',
            python: 'py',
            bash: 'sh',
            sh: 'sh',
            yaml: 'yml',
            xml: 'xml',
            md: 'md',
          };
          const ext = extMap[saveBtn.dataset.lang] || 'txt';
          const fname = 'archivo.' + ext;
          saveGeneratedFiles([{ name: fname, content: saveBtn.dataset.code }]);
          saveBtn.textContent = '✓ Guardado!';
          setTimeout(() => {
            saveBtn.textContent = '💾 Guardar';
          }, 2000);
        }
      });
    }

    const resizeHandle = document.getElementById('chatResizeHandle');
    if (resizeHandle && el.chatDrawer) {
      let resizeStartX = 0;
      let resizeStartWidth = 0;
      let resizing = false;

      resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        resizing = true;
        resizeStartX = e.clientX;
        resizeStartWidth = el.chatDrawer.offsetWidth;
        resizeHandle.classList.add('active');
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ew-resize';
      });

      document.addEventListener('mousemove', (e) => {
        if (!resizing) return;
        const delta = resizeStartX - e.clientX;
        const newWidth = Math.min(Math.max(resizeStartWidth + delta, 300), window.innerWidth * 0.92);
        el.chatDrawer.style.width = newWidth + 'px';
      });

      document.addEventListener('mouseup', () => {
        if (!resizing) return;
        resizing = false;
        resizeHandle.classList.remove('active');
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        try {
          localStorage.setItem('aichat_width', el.chatDrawer.style.width);
        } catch {
          /* ignore */
        }
      });

      try {
        const savedWidth = localStorage.getItem('aichat_width');
        if (savedWidth) el.chatDrawer.style.width = savedWidth;
      } catch {
        /* ignore */
      }
    }

    const sandboxClose = document.getElementById('sandboxCloseBtn');
    const sandboxFullscreen = document.getElementById('sandboxFullscreenBtn');
    const sandboxDownload = document.getElementById('sandboxDownloadBtn');
    if (sandboxClose)
      sandboxClose.addEventListener('click', () => {
        document.getElementById('sandboxPanel')?.classList.remove('active');
      });
    if (sandboxFullscreen)
      sandboxFullscreen.addEventListener('click', () => {
        const body = document.querySelector('.sandbox-body');
        body?.classList.toggle('fullscreen');
      });
    if (sandboxDownload)
      sandboxDownload.addEventListener('click', () => {
        const iframe = document.getElementById('sandboxIframe');
        if (iframe && iframe.srcdoc) {
          downloadFile('codigo_generado.html', iframe.srcdoc);
        }
      });
  }

  let drawerLastFocused = null;

  function openDrawer() {
    drawerLastFocused = document.activeElement;
    el.chatDrawer.classList.add('active');
    el.chatScrim.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!initialized) init();
    // Prewarm: cargar marked bajo demanda para el render de markdown del chat
    if (window.LibLoader && typeof window.marked === 'undefined') window.LibLoader.marked();
    renderConversations();
    scrollChat();
    // A11y: mover el foco dentro del drawer
    if (el.chatInput) requestAnimationFrame(() => el.chatInput.focus());
  }

  function closeDrawer() {
    el.chatDrawer.classList.remove('active');
    el.chatScrim.classList.remove('active');
    document.body.style.overflow = '';
    // A11y: restaurar el foco
    if (drawerLastFocused && drawerLastFocused.focus) {
      try {
        drawerLastFocused.focus();
      } catch (e) {
        /* ignore */
      }
      drawerLastFocused = null;
    }
  }

  function sendCurrentMessage() {
    const text = el.chatInput.value.trim();
    if (!text) return;
    el.chatInput.value = '';
    sendMessage(text);
  }

  function onProviderChange() {
    const id = el.providerSelect.value;
    state.activeProvider = id;
    const provider = state.providers.find((p) => p.id === id);
    if (provider) {
      renderModelSelect(provider);
      state.activeModel = provider.defaultModel || provider.models[0] || '';
      el.modelSelect.value = state.activeModel;
      if (el.localApiKeyInput) el.localApiKeyInput.value = (state.localApiKeys || {})[provider.name] || '';
    }
    saveState();
    updateStatus();
  }

  function onModelChange() {
    state.activeModel = el.modelSelect.value;
    saveState();
  }

  function renderProviderSelect() {
    el.providerSelect.innerHTML = '<option value="">-- Servidor local --</option>';
    state.providers.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      const bits = [p.name];
      if (p.latencyMs != null) bits.push(p.latencyMs + ' ms');
      if (p.authRequired) bits.push('🔒 requiere llave');
      opt.textContent = bits.join(' · ');
      el.providerSelect.appendChild(opt);
    });
    if (state.activeProvider) {
      el.providerSelect.value = state.activeProvider;
      const provider = state.providers.find((p) => p.id === state.activeProvider);
      if (provider) renderModelSelect(provider);
    }
  }

  function renderModelSelect(provider) {
    el.modelSelect.innerHTML = '';
    provider.models.forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m;
      const label = modelOptionLabel(provider, m);
      if (label !== m) opt.textContent = label;
      else if (/[/\\]/.test(m)) opt.textContent = cleanModelId(m) + '  (' + m + ')';
      else opt.textContent = m;
      el.modelSelect.appendChild(opt);
    });
    /* conserva la elección del usuario si sigue disponible (evita que el
       re-render en segundo plano de capacidades pise la selección) */
    if (state.activeModel && provider.models.indexOf(state.activeModel) !== -1) {
      el.modelSelect.value = state.activeModel;
    } else {
      el.modelSelect.value = provider.defaultModel || provider.models[0] || '';
    }
  }

  function renderMessages() {
    const conv = getActiveConv();
    el.chatMessages.innerHTML = '';
    if (!conv.messages.length) {
      el.chatMessages.innerHTML = '<div class="chat-empty">Envía un mensaje o pega un mega-prompt para comenzar</div>';
      return;
    }
    conv.messages.forEach((m) => {
      if (m.role === 'user') {
        const div = document.createElement('div');
        div.className = 'chat-msg chat-user';
        div.textContent = m.content;
        el.chatMessages.appendChild(div);
      } else if (m.role === 'assistant') {
        const div = document.createElement('div');
        div.className = 'chat-msg chat-assistant';
        div.innerHTML = renderMarkdown(m.content);
        processMermaid(div);
        el.chatMessages.appendChild(div);
      }
    });
  }

  function appendAssistantPlaceholder() {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-assistant';
    div.innerHTML = '<span class="chat-typing">▌</span>';
    el.chatMessages.appendChild(div);
    scrollChat();
    return div;
  }

  function appendSystemMsg(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-system';
    div.textContent = text;
    el.chatMessages.appendChild(div);
    scrollChat();
  }

  function renderMarkdown(text) {
    if (typeof marked !== 'undefined' && typeof window.DOMPurify !== 'undefined') {
      const html = marked.parse(text);
      // SEGURIDAD: jamás devolver HTML sin sanitizar. Si DOMPurify no está
      // disponible se degrada a texto plano escapado.
      const clean = window.DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
      return addCodeButtons(clean);
    }
    return escapeHtml(text).replace(/\n/g, '<br>');
  }

  function addCodeButtons(html) {
    // Wrap code blocks in a container with action buttons (Run + Copy + Save)
    const div = document.createElement('div');
    div.innerHTML = html;
    const codeBlocks = div.querySelectorAll('pre code');
    codeBlocks.forEach((code) => {
      const lang = code.className.replace('language-', '').replace('lang-', '');
      const pre = code.parentElement;

      // Inject wrapper with header bar
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      const header = document.createElement('div');
      header.className = 'code-block-header';
      // SEGURIDAD: el lenguaje viene del markdown (entrada de la IA) — usar
      // textContent en vez de innerHTML evita XSS post-sanitización.
      const langSpan = document.createElement('span');
      langSpan.className = 'code-block-lang';
      langSpan.textContent = lang || 'code';
      header.appendChild(langSpan);

      const btnGroup = document.createElement('div');
      btnGroup.className = 'code-block-actions';

      // Run button
      if (['html', 'css', 'javascript', 'js', 'ts', 'typescript'].includes(lang)) {
        const runBtn = document.createElement('button');
        runBtn.className = 'code-run-btn';
        runBtn.textContent = '▶ Run';
        runBtn.dataset.lang = lang;
        runBtn.dataset.code = code.textContent;
        btnGroup.appendChild(runBtn);
      }

      // Copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.textContent = '📋 Copiar';
      copyBtn.dataset.code = code.textContent;
      btnGroup.appendChild(copyBtn);

      // Save file button
      const saveBtn = document.createElement('button');
      saveBtn.className = 'code-save-btn';
      saveBtn.textContent = '💾 Guardar';
      saveBtn.dataset.code = code.textContent;
      saveBtn.dataset.lang = lang;
      btnGroup.appendChild(saveBtn);

      header.appendChild(btnGroup);
      wrapper.appendChild(header);
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      if (window.hljs) {
        try {
          window.hljs.highlightElement(code);
        } catch (e) {
          /* ignore */
        }
      }
    });
    return div.innerHTML;
  }

  function processMermaid(containerEl) {
    if (!containerEl) return;
    const blocks = containerEl.querySelectorAll('code.language-mermaid');
    if (!blocks.length) return;
    // Lazy-load: mermaid pesa ~3.3 MB, solo se descarga si hay diagramas
    if (!window.mermaid) {
      if (window.LibLoader) {
        window.LibLoader.mermaid().then((ok) => {
          if (ok) renderMermaidBlocks(containerEl);
        });
      }
      return;
    }
    renderMermaidBlocks(containerEl);
  }

  function renderMermaidBlocks(containerEl) {
    initMermaid();
    if (!window.mermaid) return;
    const blocks = containerEl.querySelectorAll('code.language-mermaid');
    blocks.forEach((code, i) => {
      const wrapper = code.closest('.code-block-wrapper');
      const id = 'mermaid_' + Date.now() + '_' + i;
      try {
        window.mermaid
          .render(id, code.textContent)
          .then((res) => {
            const holder = document.createElement('div');
            holder.className = 'mermaid-block';
            holder.innerHTML = res.svg;
            if (wrapper && wrapper.parentNode) wrapper.parentNode.replaceChild(holder, wrapper);
            else if (code.parentNode) code.parentNode.replaceChild(holder, code);
          })
          .catch((err) => {
            console.warn('[mermaid] render error:', err && err.message);
          });
      } catch (e) {
        /* ignore */
      }
    });
  }

  function openSandbox(code, lang) {
    const sandbox = document.getElementById('sandboxPanel');
    const iframe = document.getElementById('sandboxIframe');
    const empty = document.getElementById('sandboxEmpty');
    const badge = document.getElementById('sandboxBadge');

    if (!sandbox || !iframe) return;

    let html = code;
    if (lang === 'html') {
      html = code;
    } else if (lang === 'css' || lang === 'javascript' || lang === 'js' || lang === 'ts') {
      html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;padding:20px;background:#0c1220;color:#e9f0fa;}</style></head><body>
${lang === 'css' ? `<style>${code}</style><p>CSS preview</p>` : ''}
${lang === 'javascript' || lang === 'js' || lang === 'ts' ? `<script>${code}</` + 'script><p>JS output in console</p>' : ''}
</body></html>`;
    }

    iframe.srcdoc = html;
    iframe.style.display = '';
    if (empty) empty.style.display = 'none';
    if (badge) badge.textContent = lang.toUpperCase();
    sandbox.classList.add('active');
  }

  function scrollChat() {
    requestAnimationFrame(() => {
      el.chatMessages.scrollTop = el.chatMessages.scrollHeight;
    });
  }

  function updateStatus(text) {
    const provider = state.providers.find((p) => p.id === state.activeProvider);
    if (text) {
      el.chatStatus.textContent = text;
      el.chatStatus.className = 'chat-status detecting';
      return;
    }
    if (provider) {
      const icon = provider.isLocal ? '🖥️' : '☁️';
      el.chatStatus.textContent = icon + ' ' + provider.name + ' · ' + (state.activeModel || provider.defaultModel);
      el.chatStatus.className = 'chat-status ' + (provider.isLocal ? 'local' : 'cloud');
    } else {
      el.chatStatus.textContent = 'Sin proveedor';
      el.chatStatus.className = 'chat-status';
    }
    const dirLabel = state.saveDir ? state.saveDir.name : 'No seleccionada';
    if (el.saveDirLabel) el.saveDirLabel.textContent = 'Carpeta: ' + dirLabel;
  }

  function newConversation() {
    state.activeConvId = 'conv_' + Date.now();
    state.conversations[state.activeConvId] = { title: 'Nueva conversación', messages: [], createdAt: Date.now() };
    saveState();
    renderMessages();
    renderConversations();
  }

  function deleteConversation(id) {
    delete state.conversations[id];
    if (state.activeConvId === id) {
      const remaining = Object.keys(state.conversations);
      state.activeConvId = remaining.length ? remaining[remaining.length - 1] : null;
    }
    saveState();
    renderMessages();
    renderConversations();
  }

  function deleteAllConversations() {
    if (!Object.keys(state.conversations).length) return;
    state.conversations = {};
    state.activeConvId = null;
    saveState();
    renderMessages();
    renderConversations();
    showToast('Todas las conversaciones eliminadas');
  }

  function renderConversations() {
    if (!el.convList) return;
    el.convList.innerHTML = '';
    const ids = Object.keys(state.conversations).sort((a, b) => state.conversations[b].createdAt - state.conversations[a].createdAt);
    if (ids.length && el.convDelAll) el.convDelAll.style.display = 'flex';
    else if (el.convDelAll) el.convDelAll.style.display = 'none';

    ids.forEach((id) => {
      const conv = state.conversations[id];
      const div = document.createElement('div');
      div.className = 'ai-conv-item' + (id === state.activeConvId ? ' active' : '');
      div.dataset.id = id;
      div.innerHTML =
        '<span class="ai-conv-label">' +
        escapeHtml(conv.title || 'Sin título') +
        '</span><span class="ai-conv-time">' +
        new Date(conv.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) +
        '</span><button class="ai-conv-del" data-id="' +
        id +
        '" title="Eliminar conversación">✕</button>';
      div.querySelector('.ai-conv-label').addEventListener('click', () => {
        state.activeConvId = id;
        saveState();
        renderMessages();
        renderConversations();
        scrollChat();
      });
      div.querySelector('.ai-conv-time').addEventListener('click', () => {
        state.activeConvId = id;
        saveState();
        renderMessages();
        renderConversations();
        scrollChat();
      });
      el.convList.appendChild(div);
    });

    el.convList.querySelectorAll('.ai-conv-del').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConversation(btn.dataset.id);
      });
    });
  }

  function saveCurrentFiles() {
    const conv = getActiveConv();
    const lastAssistant = [...conv.messages].reverse().find((m) => m.role === 'assistant' && !m.content.startsWith('ERROR:'));
    if (!lastAssistant) {
      showToast('No hay respuesta de IA para guardar');
      return;
    }
    const files = extractCodeFromResponse(lastAssistant.content);
    if (!files.length) {
      showToast('No se encontraron bloques de código en la respuesta');
      return;
    }
    saveGeneratedFiles(files);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast show';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.className = 'toast';
    }, 3000);
  }

  /* ============================================================
     MODO AGENTE — motor con herramientas (Ollama nativo + emulado)
     ============================================================ */

  function getAgentLib() {
    if (typeof window !== 'undefined' && window.AgentTools) return window.AgentTools;
    if (typeof globalThis !== 'undefined' && globalThis.AgentTools) return globalThis.AgentTools;
    return null;
  }

  function isToolsUnsupportedError(err) {
    const s = String((err && err.message) || err || '');
    return /does not support tools|not support.*tools|tools.*not supported|unsupported.*tool/i.test(s);
  }

  function getToolFamily(provider) {
    if (!provider) return 'openai';
    const ep = String(provider.endpoint || '');
    if (provider.isLocal && provider.localType === 'ollama') return 'ollama';
    if (ep.includes(':11434') || ep.includes('/api/chat')) return 'ollama';
    if (provider.isLocal && provider.localType === 'kobold') return 'kobold';
    if (provider.id === 'anthropic' || ep.includes('api.anthropic.com')) return 'anthropic';
    if (provider.id === 'gemini' || ep.includes('generativelanguage')) return 'gemini';
    return 'openai';
  }

  function supportsTools(provider) {
    if (!provider) return false;
    if (provider.isLocal) return true;
    return ['ollama', 'openai', 'anthropic', 'gemini'].indexOf(getToolFamily(provider)) !== -1;
  }

  const TOOL_MODEL_PATTERNS = [
    /qwen/i,
    /mistral/i,
    /llama3\.[12]/i,
    /command-?r/i,
    /deepseek/i,
    /firefunction/i,
    /functionary/i,
    /hermes/i,
    /nemotron/i,
    /granite/i,
  ];

  function preferAgentModel(provider) {
    if (!provider || !Array.isArray(provider.models) || !provider.models.length) return '';
    /* 1º: capacidad tools confirmada por /api/show (caché) */
    const capHit = provider.models.find((m) => state.ollamaToolsCache[m] === true);
    if (capHit) return capHit;
    /* 2º: patrones conocidos de tool-calling */
    for (const re of TOOL_MODEL_PATTERNS) {
      const hit = provider.models.find((m) => re.test(String(m)));
      if (hit) return hit;
    }
    return provider.defaultModel || '';
  }

  function capForModel(value, limit) {
    const max = typeof limit === 'number' && limit > 0 ? limit : 1200;
    let s;
    try {
      s = typeof value === 'string' ? value : JSON.stringify(value);
    } catch {
      s = String(value);
    }
    if (s == null) s = '';
    if (s.length <= max) return s;
    return s.slice(0, max) + '…(recortado)';
  }

  function parseLooseJson(raw) {
    const s = String(raw == null ? '' : raw).trim();
    if (!s) return { ok: false };
    try {
      return { ok: true, value: JSON.parse(s) };
    } catch {
      /* reintento con recorte */
    }
    const start = s.indexOf('{');
    const end = s.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return { ok: true, value: JSON.parse(s.slice(start, end + 1)) };
      } catch {
        return { ok: false };
      }
    }
    return { ok: false };
  }

  function normalizeToolArgAliases(args) {
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

  function parseToolArgsObj(raw) {
    if (raw == null) return {};
    if (typeof raw === 'object') return normalizeToolArgAliases(raw);
    const parsed = parseLooseJson(raw);
    return parsed.ok && parsed.value && typeof parsed.value === 'object' ? normalizeToolArgAliases(parsed.value) : {};
  }

  function extractToolObjects(obj) {
    if (!obj || typeof obj !== 'object') return [];
    if (Array.isArray(obj.tool_calls)) {
      return obj.tool_calls.map((tc) => normalizeToolCall(tc)).filter(Boolean);
    }
    const direct = normalizeToolCall(obj);
    return direct ? [direct] : [];
  }

  function normalizeToolCall(tc) {
    if (!tc || typeof tc !== 'object') return null;
    const name = (tc.function && tc.function.name) || tc.name || tc.tool || tc.function_name;
    if (!name || typeof name !== 'string') return null;
    const rawArgs =
      tc.function && tc.function.arguments !== undefined
        ? tc.function.arguments
        : tc.arguments !== undefined
          ? tc.arguments
          : tc.args !== undefined
            ? tc.args
            : tc.parameters;
    if (rawArgs === undefined) return null;
    return { name, args: parseToolArgsObj(rawArgs) };
  }

  function parseEmulatedToolCalls(text) {
    const calls = [];
    let malformed = 0;
    let out = String(text || '');

    out = out.replace(/```(?:tool|tool_calls|function)[ \t]*\r?\n?([\s\S]*?)```/gi, (m, body) => {
      const parsed = parseLooseJson(body);
      if (!parsed.ok) {
        malformed++;
        return '';
      }
      const found = extractToolObjects(parsed.value);
      if (!found.length) {
        malformed++;
        return '';
      }
      calls.push(...found);
      return '';
    });

    out = out.replace(/\[TOOL_CALLS\][ \t]*(\{[\s\S]*)/gi, (m, body) => {
      const parsed = parseLooseJson(body);
      if (!parsed.ok) {
        malformed++;
        return '';
      }
      calls.push(...extractToolObjects(parsed.value));
      return '';
    });

    out = out.replace(/<tool_call>[ \t]*\r?\n?([\s\S]*?)<\/tool_call>/gi, (m, body) => {
      const parsed = parseLooseJson(body);
      if (!parsed.ok) {
        malformed++;
        return '';
      }
      calls.push(...extractToolObjects(parsed.value));
      return '';
    });

    out = out.replace(/```json[ \t]*\r?\n?([\s\S]*?)```/gi, (m, body) => {
      const parsed = parseLooseJson(body);
      if (!parsed.ok) return m;
      const found = extractToolObjects(parsed.value);
      if (found.length) {
        calls.push(...found);
        return '';
      }
      return m;
    });

    out = out.replace(/`(\{[^`\n]{10,2000}\})`/g, (m, body) => {
      const parsed = parseLooseJson(body);
      if (!parsed.ok) return m;
      const found = extractToolObjects(parsed.value);
      if (found.length) {
        calls.push(...found);
        return '';
      }
      return m;
    });

    return { calls, text: out.trim(), malformed };
  }

  function salvageCodeBlocks(text) {
    const src = String(text || '');
    const blocks = [];
    const re = /```([a-zA-Z0-9+#]*)[ \t]*\r?\n([\s\S]*?)```/g;
    let m;
    while ((m = re.exec(src))) {
      const lang = (m[1] || '').toLowerCase();
      const content = m[2] || '';
      if (['', 'json', 'tool', 'text', 'txt', 'md', 'bash', 'sh', 'yaml', 'yml'].indexOf(lang) !== -1) continue;
      if (content.trim().length < 40) continue;
      blocks.push({ lang, content, index: m.index });
    }
    const extMap = {
      html: ['html', 'htm'],
      css: ['css'],
      js: ['js', 'mjs'],
      javascript: ['js', 'mjs'],
      python: ['py'],
      py: ['py'],
      ts: ['ts'],
      typescript: ['ts'],
    };
    const defaultName = {
      html: 'index.html',
      css: 'styles.css',
      js: 'app.js',
      javascript: 'app.js',
      python: 'main.py',
      py: 'main.py',
      ts: 'app.ts',
      typescript: 'app.ts',
    };
    const byPath = new Map();
    for (const b of blocks) {
      const exts = extMap[b.lang];
      if (!exts) continue;
      const before = src.slice(0, b.index);
      const mentionRe = new RegExp('[\\w.-]+\\.(?:' + exts.join('|') + ')\\b', 'i');
      const mention = before.match(mentionRe);
      const path = mention ? mention[0] : defaultName[b.lang] || 'archivo.' + exts[0];
      byPath.set(path, b.content);
    }
    const calls = [];
    byPath.forEach((content, path) => {
      calls.push({ name: 'write_file', args: { path, content } });
    });
    return calls;
  }

  async function agentEngine(cfg, conv, opts) {
    const options = opts || {};
    const maxIterations = options.maxIterations || 8;
    const onMode = typeof options.onMode === 'function' ? options.onMode : null;
    const shouldStop = typeof options.shouldStop === 'function' ? options.shouldStop : null;
    const runner = cfg.runner;
    const family = cfg.family || 'openai';
    const toolNames = cfg.toolNames || [];

    let mode = null;
    let iterations = 0;
    let repeated = false;
    let stopped = false;
    let finalText = '';
    let emptyPushes = 0;
    let emuNudges = 0;
    let malformedStreak = 0;
    let lastSig = '';
    let sigStreak = 0;
    let invalidStreak = 0;
    let lastInvalidTool = '';
    let history = null;

    const REQUIRED_ARGS = {
      write_file: ['path', 'content'],
      read_file: ['path'],
      append_file: ['path', 'content'],
      edit_file: ['path', 'find', 'replace'],
      insert_line: ['path', 'line', 'content'],
      list_files: [],
      search_files: ['pattern'],
      move_file: ['from', 'to'],
      delete_file: ['path'],
      delete_dir: ['path'],
      run_command: ['command'],
      web_fetch: ['url'],
    };
    const PATH_TOOLS = new Set([
      'write_file',
      'read_file',
      'append_file',
      'edit_file',
      'insert_line',
      'move_file',
      'delete_file',
      'delete_dir',
      'list_files',
      'create_directory',
    ]);

    function validateCall(name, args) {
      if (!args || typeof args !== 'object') return 'args vacíos o nulos';
      const req = REQUIRED_ARGS[name] || [];
      for (const k of req) {
        if (args[k] == null || String(args[k]).trim() === '') return 'argumento requerido vacío: ' + k;
      }
      const p = args.path || args.from || args.to || '';
      const sp = String(p).trim();
      if (PATH_TOOLS.has(name) && (!sp || sp === '.' || sp === '..')) return 'ruta inválida: ' + sp;
      if (name === 'run_command' && !String(args.command || '').trim()) return 'comando vacío';
      if (name === 'web_fetch' && !/^https?:\/\//i.test(String(args.url || ''))) return 'url inválida (http/https)';
      return null;
    }

    const executeCalls = async (calls) => {
      const results = [];
      for (const call of calls) {
        if (shouldStop && shouldStop()) {
          stopped = true;
          break;
        }
        const validationError = validateCall(call.name, call.args);
        if (validationError) {
          invalidStreak = lastInvalidTool === call.name ? invalidStreak + 1 : 1;
          lastInvalidTool = call.name;
          results.push({ name: call.name, content: 'OBSERVACIÓN ' + call.name + ' → validación: ' + validationError + '. Reintenta con los argumentos correctos.' });
          if (invalidStreak >= 3) {
            finalText = 'Bucle de llamadas inválidas en "' + lastInvalidTool + '": demasiados intentos con argumentos incorrectos. Se detuvo la generación.';
            break;
          }
          continue;
        }
        lastInvalidTool = '';
        invalidStreak = 0;
        if (typeof options.onTool === 'function') options.onTool(call.name, call.args, null);
        let obs;
        try {
          const r = await runner.run(call.name, call.args == null ? {} : call.args);
          obs = 'OBSERVACIÓN ' + call.name + ' → ' + capForModel(r, 1200);
        } catch (err) {
          if (typeof options.onTool === 'function') options.onTool(call.name, call.args, err);
          obs = 'OBSERVACIÓN ' + call.name + ' → ERROR: ' + ((err && err.message) || String(err));
        }
        results.push({ name: call.name, content: obs });
      }
      return results;
    };

    const trackRepeats = (calls) => {
      const sig = JSON.stringify(calls.map((c) => [c.name, c.args]));
      if (sig === lastSig) sigStreak++;
      else {
        lastSig = sig;
        sigStreak = 1;
      }
      return sigStreak >= 3;
    };

    const startNativeAllowed = async () => {
      if (family === 'ollama' && typeof cfg.ollamaSupportsTools === 'function') {
        const st = await cfg.ollamaSupportsTools();
        if (st === false) return false;
      }
      return true;
    };

    const switchToEmulated = () => {
      mode = 'emulated';
      if (onMode) onMode(mode);
      history = cfg.initHistory(conv, mode);
    };

    mode = (await startNativeAllowed()) ? 'native' : 'emulated';
    if (onMode) onMode(mode);
    history = cfg.initHistory(conv, mode);

    while (iterations < maxIterations) {
      if (shouldStop && shouldStop()) {
        stopped = true;
        break;
      }
      iterations++;

      if (mode === 'native') {
        let step;
        try {
          step = await cfg.nativeStep(history);
        } catch (err) {
          if (isToolsUnsupportedError(err)) {
            switchToEmulated();
            continue;
          }
          throw err;
        }

        const rawCalls = step.rawCalls || [];
        let calls = step.calls || [];

        if (!calls.length && !rawCalls.length && emptyPushes === 0 && iterations === 1 && toolNames.length &&
            /(¿|\?|lo siento|disculp|perd[oó]n|quieres que|puedo|deber[ií]a)/i.test(step.content || '')) {
          emptyPushes++;
          history.msgs.push({
            role: 'user',
            content: 'SÍ: hazlo ahora sin preguntar. Ejecuta ya las herramientas que necesites (write_file, run_command…). No pidas permiso.',
          });
          continue;
        }

        if (!calls.length && !rawCalls.length) {
          const probe = parseEmulatedToolCalls(step.content || '');
          if (probe.calls.length) {
            switchToEmulated();
            continue;
          }
          const rescued = toolNames.indexOf('write_file') !== -1 ? salvageCodeBlocks(step.content || '') : [];
          if (rescued.length) {
            const results = await executeCalls(rescued);
            if (stopped) break;
            history.msgs.push({ role: 'assistant', content: step.content || '' });
            history.msgs.push({
              role: 'user',
              content: 'RESCATE AUTOMÁTICO: se guardaron los bloques de código mostrados con write_file (' + rescued.map((c) => c.args.path).join(', ') + '). Continúa o entrega el resumen final.',
            });
            if (trackRepeats(rescued)) {
              repeated = true;
              break;
            }
            continue;
          }
        }

        if (!calls.length) {
          if (step.content && String(step.content).trim()) {
            finalText = step.content;
            break;
          }
          if (emptyPushes < 2) {
            emptyPushes++;
            history.msgs.push({
              role: 'user',
              content: emptyPushes === 1 ? 'Continúa: ejecuta la siguiente herramienta o entrega el resultado final.' : 'Último aviso: si no hay más herramientas, escribe ahora el resumen final.',
            });
            continue;
          }
          finalText = '';
          break;
        }

        const results = await executeCalls(calls);
        if (stopped) break;
        if (typeof cfg.pushNative === 'function') cfg.pushNative(history, step, results);
        if (trackRepeats(calls)) {
          repeated = true;
          break;
        }
        continue;
      }

      /* ── mode === 'emulated' ── */
      const text = await cfg.emulatedText(history, conv);
      const parsedCalls = parseEmulatedToolCalls(text);

      if (!parsedCalls.calls.length && parsedCalls.malformed) {
        malformedStreak++;
        if (malformedStreak >= 3) {
          finalText = text;
          break;
        }
        history.msgs.push({ role: 'assistant', content: text || '' });
        history.msgs.push({
          role: 'user',
          content: 'JSON inválido en el bloque ```tool. Devuelve de nuevo el bloque con JSON VÁLIDO en una sola línea: {"name":"write_file","args":{"path":"...","content":"..."}}',
        });
        continue;
      }
      malformedStreak = 0;

      if (!parsedCalls.calls.length) {
        const rescued = toolNames.indexOf('write_file') !== -1 ? salvageCodeBlocks(text || '') : [];
        if (rescued.length) {
          const results = await executeCalls(rescued);
          if (stopped) break;
          history.msgs.push({ role: 'assistant', content: text || '' });
          history.msgs.push({
            role: 'user',
            content: 'RESCATE AUTOMÁTICO: se guardaron los bloques de código mostrados con write_file (' + rescued.map((c) => c.args.path).join(', ') + '). Continúa o entrega el resumen final.',
          });
          if (trackRepeats(rescued)) {
            repeated = true;
            break;
          }
          continue;
        }
        const mentionsTools = toolNames.some((n) => (text || '').indexOf(n) !== -1) || /```/.test(text || '');
        if (mentionsTools && emuNudges < 2) {
          emuNudges++;
          history.msgs.push({ role: 'assistant', content: text || '' });
          history.msgs.push({
            role: 'user',
            content: 'AÚN NO EJECUTADO: no describas ni repitas la acción, EJECÚTALA ahora mismo con un bloque ```tool con JSON válido de una línea (usa "path" para el archivo). Si ya terminaste, responde solo el resumen sin mencionar herramientas.',
          });
          continue;
        }
        finalText = text || '';
        break;
      }

      const results = await executeCalls(parsedCalls.calls);
      if (stopped) break;
      history.msgs.push({ role: 'assistant', content: parsedCalls.text || '' });
      history.msgs.push({ role: 'user', content: results.map((r) => r.content).join('\n') });
      if (trackRepeats(parsedCalls.calls)) {
        repeated = true;
        break;
      }
    }

    return { finalText, mode, iterations, repeated, stopped };
  }

  /* ---------- transporte real del agente ---------- */

  function sanitizeProjectDir(value) {
    let s = String(value == null ? '' : value).trim().replace(/\\/g, '/');
    s = s.replace(/^\.\/+/, '').replace(/^\/+/, '').replace(/\/+$/, '');
    if (!s || s === '.') return '';
    if (/^[a-zA-Z]:/.test(s) || s.split('/').indexOf('..') !== -1) return '';
    return s;
  }

  function buildAgentCaps() {
    const serverOk = !!(state.agentServer && state.agentServer.ok);
    return {
      server: serverOk,
      filesystem: true,
      commands: serverOk,
      web: serverOk,
    };
  }

  async function probeOllamaTools(provider) {
    const model = state.activeModel || provider.defaultModel || '';
    if (!model) return null;
    if (Object.prototype.hasOwnProperty.call(state.ollamaToolsCache, model)) return state.ollamaToolsCache[model];
    let result = null;
    try {
      const base = new URL(provider.endpoint, typeof location !== 'undefined' ? location.href : 'http://localhost/');
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 5000);
      const resp = await fetch(base.origin + '/api/show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (resp.ok) {
        const data = await resp.json();
        const caps = data && Array.isArray(data.capabilities) ? data.capabilities : [];
        if (caps.length) result = caps.indexOf('tools') !== -1;
      }
    } catch {
      result = null;
    }
    state.ollamaToolsCache[model] = result;
    return result;
  }

  function agentFetch(provider, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (provider.apiKey) headers['Authorization'] = 'Bearer ' + provider.apiKey;
    return fetch(provider.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: abortController ? abortController.signal : undefined,
    });
  }

  /* Sesión de transporte reutilizable por el chat y por los tests E2E:
     sess = { provider, model, maxTokens, systemContent } */
  async function agentCoreNativeStep(sess, history, tools, family) {
    const provider = sess.provider;
    const model = sess.model || provider.defaultModel;
    const Lib = getAgentLib();
    let resp;
    if (family === 'ollama') {
      resp = await agentFetch(provider, {
        model,
        messages: history.msgs,
        tools,
        stream: false,
        keep_alive: '30m',
        options: { num_predict: sess.maxTokens || 16384, temperature: 0.7 },
      });
    } else if (family === 'kobold') {
      const prompt =
        history.msgs.map((m) => (m.role === 'user' ? 'Usuario: ' : 'Agente: ') + m.content).join('\n\n') + '\nAgente:';
      resp = await agentFetch(provider, { prompt, max_length: Math.min(sess.maxTokens || 4096, 4096) });
    } else {
      resp = await agentFetch(provider, {
        model,
        messages: history.msgs,
        tools: tools.map((t) => ({ type: 'function', function: t.function })),
        stream: false,
        max_tokens: sess.maxTokens || 16384,
        temperature: 0.7,
      });
    }
    if (!resp.ok) throw new Error((await resp.text().catch(() => '')) || 'Error ' + resp.status);
    const data = await resp.json();
    const msg =
      family === 'ollama' ? data.message || {} : (data.choices && data.choices[0] && data.choices[0].message) || {};
    const rawCalls = msg.tool_calls || [];
    const calls = rawCalls.map((tc, i) => ({
      id: tc.id || 'call_' + i,
      name: (tc.function && tc.function.name) || tc.name,
      args: Lib.parseToolArguments(
        tc.function && tc.function.arguments !== undefined ? tc.function.arguments : tc.arguments
      ),
    }));
    return { content: msg.content || msg.reasoning_content || msg.reasoning || msg.thinking || '', rawCalls, calls };
  }

  async function agentCoreEmulatedStep(sess, history, toolNames, family) {
    const provider = sess.provider;
    const model = sess.model || provider.defaultModel;
    let resp;
    if (family === 'kobold') {
      const prompt =
        history.msgs.map((m) => (m.role === 'user' ? 'Usuario: ' : 'Agente: ') + m.content).join('\n\n') + '\nAgente:';
      resp = await agentFetch(provider, { prompt, max_length: Math.min(sess.maxTokens || 4096, 4096) });
      if (!resp.ok) throw new Error((await resp.text().catch(() => '')) || 'Error ' + resp.status);
      const data = await resp.json();
      return (data.results && data.results[0] && data.results[0].text) || '';
    }
    const body = { stream: false, temperature: 0.7 };
    if (family === 'ollama') {
      body.model = model;
      body.messages = history.msgs;
      body.keep_alive = '30m';
      body.options = { num_predict: sess.maxTokens || 16384, temperature: 0.7 };
    } else {
      body.model = model;
      body.messages = history.msgs;
      body.max_tokens = sess.maxTokens || 16384;
    }
    resp = await agentFetch(provider, body);
    if (!resp.ok) throw new Error((await resp.text().catch(() => '')) || 'Error ' + resp.status);
    const data = await resp.json();
    if (family === 'ollama') return (data.message && (data.message.content || data.message.thinking)) || '';
    const em = data.choices && data.choices[0] && data.choices[0].message;
    return (em && (em.content || em.reasoning_content || em.reasoning)) || '';
  }

  const EMULATED_PROTOCOL_NOTE =
    '\n\nHerramientas disponibles: {TOOLS}\nCuando necesites actuar, responde SOLO con bloques ```tool cuyo contenido sea JSON de una línea: {"name":"<herramienta>","args":{...}}. El nombre del archivo SIEMPRE va en el argumento "path". Si ya no hay nada que ejecutar, responde en texto normal sin bloques.';

  /* Fábrica pública de configuración del motor (usada por el chat y por los E2E) */
  function createAgentConfig(ctx, runner) {
    const provider = ctx.provider;
    const family = getToolFamily(provider);
    const tools = ctx.tools || [];
    const toolNames = tools.map((t) => t.function.name);
    const Lib = getAgentLib();
    const sess = {
      provider,
      model: ctx.model || provider.defaultModel,
      maxTokens: ctx.maxTokens,
      systemContent: ctx.systemPrompt || (Lib ? Lib.SYSTEM_PROMPT : ''),
    };

    return {
      family,
      runner,
      toolNames,
      ollamaSupportsTools:
        family === 'ollama'
          ? async () => null
          : async () => true,
      initHistory: (conv, mode) => {
        const historyMsgs = Array.isArray(conv) ? conv : conv && Array.isArray(conv.messages) ? conv.messages : [];
        return {
          mode,
          msgs: [{ role: 'system', content: sess.systemContent + (mode === 'emulated' ? EMULATED_PROTOCOL_NOTE.replace('{TOOLS}', toolNames.join(', ')) : '') }].concat(
            historyMsgs
              .filter((msg) => msg.role !== 'assistant' || !String(msg.content || '').startsWith('ERROR:'))
              .map((msg) => ({ role: msg.role, content: String(msg.content || '') }))
          ),
        };
      },
      nativeStep: (history) => agentCoreNativeStep(sess, history, tools, family),
      pushNative: (history, step, results) => {
        const asst = { role: 'assistant', content: step.content || '' };
        if (step.rawCalls && step.rawCalls.length) asst.tool_calls = step.rawCalls;
        history.msgs.push(asst);
        (results || []).forEach((r) => history.msgs.push({ role: 'tool', content: r.content }));
      },
      emulatedText: (history) => agentCoreEmulatedStep(sess, history, toolNames, family),
    };
  }

  async function runAgentTurn(provider, conv, msgEl) {
    const Lib = getAgentLib();
    if (!Lib) throw new Error('Catálogo de herramientas (js/agent-tools.js) no disponible');
    const serverOk = !!(state.agentServer && state.agentServer.ok);
    const runnerOpts = serverOk
      ? { server: { baseUrl: state.agentServerUrl, token: state.agentServerToken }, prefix: state.agentProjectDir }
      : { prefix: state.agentProjectDir };
    const runner = Lib.createToolRunner(runnerOpts);
    const tools = Lib.filterToolsByCapabilities(buildAgentCaps());
    const toolNames = tools.map((t) => t.function.name);
    const family = getToolFamily(provider);

    appendSystemMsg(
      '🤖 Modo agente — ' +
        toolNames.length +
        ' herramientas · ' +
        (serverOk ? 'workspace del servidor agente' : 'memoria virtual (ZIP al terminar)') +
        (state.agentProjectDir ? ' · 📂 ' + state.agentProjectDir : '')
    );

    abortController = new AbortController();

    const cfg = createAgentConfig(
      {
        provider,
        model: state.activeModel || provider.defaultModel,
        maxTokens: state.maxTokens,
        tools,
      },
      runner
    );
    if (family === 'ollama') cfg.ollamaSupportsTools = () => probeOllamaTools(provider);

    const res = await agentEngine(cfg, conv, {
      shouldStop: () => agentAbortRequested,
      maxIterations: 14,
      onMode: (m) => appendSystemMsg(m === 'native' ? '🧠 Tool-calling nativo' : '🧩 Tool-calling emulado (JSON)'),
    });

    if (runner.isVirtual) {
      const files = runner.getVirtualFiles() || [];
      if (files.length) {
        await saveGeneratedFiles(files.map((f) => ({ name: f.name, content: f.content })));
        appendSystemMsg('💾 ' + files.length + ' archivo(s) generados en memoria virtual y guardados');
      }
    }
    return res.finalText || (res.stopped ? '⏹ Agente detenido.' : '');
  }

  async function detectAgentServer() {
    if (el.agentServerStatus) {
      el.agentServerStatus.className = 'ai-cfg-status off';
      el.agentServerStatus.textContent = '⚪ Comprobando conexión…';
    }
    const base = String(state.agentServerUrl || '').trim().replace(/\/+$/, '');
    let ok = false;
    let info = null;
    if (base) {
      try {
        const headers = { Accept: 'application/json' };
        if (state.agentServerToken) headers['X-Agent-Token'] = state.agentServerToken;
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 4000);
        const resp = await fetch(base + '/health', { headers, signal: ctrl.signal });
        clearTimeout(t);
        if (resp.ok) {
          info = await resp.json();
          ok = !!(info && (info.ok === undefined || info.ok));
        }
      } catch {
        ok = false;
      }
    }
    state.agentServer = { ok, info };
    renderAgentCapabilityUI();
    if (el.agentServerStatus) {
      if (ok) {
        const root = (info && (info.defaultRoot || (info.roots && info.roots[0]))) || 'workspace';
        el.agentServerStatus.className = 'ai-cfg-status on';
        el.agentServerStatus.textContent = '🟢 Conectado — workspace: ' + root + (info && info.version ? ' · v' + info.version : '');
      } else {
        el.agentServerStatus.className = 'ai-cfg-status off';
        el.agentServerStatus.textContent = '🔴 Sin conexión — el agente trabajará en memoria virtual (ZIP al final).';
      }
    }
    return ok;
  }

  function renderAgentCapabilityUI() {
    if (!el.agentCapsStatus) return;
    const serverOk = !!(state.agentServer && state.agentServer.ok);
    const info = state.agentServer && state.agentServer.info;
    const root = info ? info.defaultRoot || (info.roots || [])[0] : null;
    const parts = [];
    parts.push('📁 ' + (root ? 'Workspace: ' + root : 'Sin servidor: memoria virtual'));
    parts.push('💻 Comandos: ' + (serverOk ? '✔ disponible' : '✖ requieren servidor'));
    parts.push('🌐 ' + (serverOk ? '✔ sin CORS' : 'vía navegador (CORS)'));
    if (state.agentProjectDir) parts.push('📂 Carpeta: ' + state.agentProjectDir);
    el.agentCapsStatus.textContent = parts.join(' · ');
    el.agentCapsStatus.className = 'ai-cfg-status ' + (serverOk ? 'on' : 'off');
  }

  function enableAgentFullMode() {
    state.agentMode = true;
    if (el.agentModeToggle) el.agentModeToggle.checked = true;
    if (el.agentForceBtn) {
      el.agentForceBtn.textContent = '⚡ Modo agente COMPLETO activo (leer + escribir + comandos + web)';
      el.agentForceBtn.setAttribute('aria-pressed', 'true');
    }
    const active = state.providers.find((p) => p.id === state.activeProvider);
    if (!active) {
      const prov = state.providers.find((p) => p.localType === 'ollama') || state.providers[0];
      if (prov) {
        state.activeProvider = prov.id;
        state.activeModel = preferAgentModel(prov) || prov.defaultModel || prov.models[0] || '';
        renderProviderSelect();
        if (el.providerSelect) el.providerSelect.value = prov.id;
        if (el.modelSelect) el.modelSelect.value = state.activeModel;
        updateStatus();
      }
    }
    renderAgentCapabilityUI();
    saveState();
    detectAgentServer();
  }

  function disableAgentFullMode() {
    state.agentMode = false;
    if (el.agentModeToggle) el.agentModeToggle.checked = false;
    if (el.agentForceBtn) {
      el.agentForceBtn.textContent = '⚡ Activar modo agente COMPLETO (leer + escribir + comandos + web)';
      el.agentForceBtn.setAttribute('aria-pressed', 'false');
    }
    saveState();
  }

  function toggleAgentFullMode() {
    if (state.agentMode) disableAgentFullMode();
    else enableAgentFullMode();
  }

  /* ---------- public API ---------- */

  return {
    init,
    openDrawer,
    closeDrawer,
    sendMessage,
    sendPrompt(promptText) {
      if (!state.activeProvider) {
        openDrawer();
        setTimeout(() => appendSystemMsg('Seleccione un proveedor de IA en el menú superior'), 300);
        return;
      }
      openDrawer();
      setTimeout(() => sendMessage(promptText), 400);
    },
    getStatus() {
      return {
        provider: state.activeProvider,
        model: state.activeModel,
        saveDir: state.saveDir?.name,
        agentMode: state.agentMode,
        agentServer: state.agentServer && state.agentServer.ok,
      };
    },
    selectSaveDir,
    saveGeneratedFiles,
    detectLocal,
    openSandbox,
    LOCAL_PROBES,
    detectAgentServer,
    enableAgentFullMode,
    disableAgentFullMode,
    agentEngine,
    createAgentConfig,
    parseEmulatedToolCalls,
    salvageCodeBlocks,
    isToolsUnsupportedError,
    getToolFamily,
    supportsTools,
    capForModel,
    preferAgentModel,
    modelOptionLabel,
    cleanModelId,
    syncProviders,
    isAgentCapableModel,
  };
})();

if (typeof window !== 'undefined') window.AIChat = AIChat;
if (typeof module !== 'undefined' && module.exports) module.exports = AIChat;
