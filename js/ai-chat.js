/* ============================================================
   IA CHAT PANEL v1.1 — Auto-detección local + cloud genérico + Gemini API & Free Tiers
   ============================================================ */
/* global JSZip, marked */

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

  /* ============================================================
     DEFAULT PROVIDERS — Proveedores Cloud (Free Tier & Paid)
     ============================================================ */
  const DEFAULT_PROVIDERS = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
      type: 'cloud',
      tier: 'both',
      apiKey: '',
      models: ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-pro', 'gemini-2.5-pro'],
      defaultModel: 'gemini-2.0-flash',
      modelsEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
      authType: 'query',
      note: 'Tier gratuito: 1500 req/día para gemini-2.0-flash. Sin costo para flash-lite o con API key gratuita de Google AI Studio.',
    },
    {
      id: 'groq',
      name: 'Groq',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      type: 'cloud',
      tier: 'free',
      apiKey: '',
      models: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
      defaultModel: 'llama-3.1-70b-versatile',
      modelsEndpoint: 'https://api.groq.com/openai/v1/models',
      note: 'Tier gratuito con límites de ratio (RPM/TPM). Inferencia LPU de ultra-baja latencia.',
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      type: 'cloud',
      tier: 'both',
      apiKey: '',
      models: [
        'openai/gpt-4o',
        'anthropic/claude-3.5-sonnet',
        'google/gemini-2.0-flash',
        'meta-llama/llama-3.2-3b-instruct:free',
        'google/gemini-2.0-flash-exp:free',
      ],
      defaultModel: 'openai/gpt-4o',
      modelsEndpoint: 'https://openrouter.ai/api/v1/models',
      note: 'Modelos con sufijo :free (ej. meta-llama/llama-3.2-3b-instruct:free) son gratuitos vía OpenRouter.',
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      endpoint: 'https://api.deepseek.com/v1/chat/completions',
      type: 'cloud',
      tier: 'both',
      apiKey: '',
      models: ['deepseek-chat', 'deepseek-reasoner'],
      defaultModel: 'deepseek-chat',
      modelsEndpoint: 'https://api.deepseek.com/v1/models',
      note: 'deepseek-chat y deepseek-reasoner cuentan con tier gratuito / créditos iniciales con registro.',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      type: 'cloud',
      tier: 'paid',
      apiKey: '',
      models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      defaultModel: 'gpt-4o-mini',
      modelsEndpoint: 'https://api.openai.com/v1/models',
      note: 'API oficial de pago por tokens consumidos.',
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      endpoint: 'https://api.anthropic.com/v1/messages',
      type: 'cloud',
      tier: 'paid',
      apiKey: '',
      models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
      defaultModel: 'claude-3-5-sonnet-20241022',
      headers: { 'anthropic-version': '2023-06-01' },
      modelsEndpoint: 'https://api.anthropic.com/v1/models',
      authType: 'x-api-key',
      note: 'API de pago por tokens consumidos.',
    },
    {
      id: 'alibaba',
      name: 'Alibaba Token Plan',
      endpoint: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
      type: 'cloud',
      tier: 'both',
      apiKey: '',
      models: ['qwen-max', 'qwen-plus', 'qwen-turbo', 'deepseek-r1', 'deepseek-v3', 'llama3-70b', 'qwen2.5-72b'],
      defaultModel: 'qwen-plus',
      modelsEndpoint: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/models',
      note: 'Plan de tokens gratuitos con registro en Alibaba Cloud Model Studio.',
    },
  ];

  /* ============================================================
     FREE TIER CATALOG & MODEL SCANNER SOURCES
     ============================================================ */
  const FREE_TIER_PROVIDERS = [
    {
      id: 'gemini_free',
      name: 'Google Gemini Free Tier',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      models: ['gemini-2.0-flash', 'gemini-2.0-flash-lite'],
      tier: 'free',
      description: 'Sin API key requerida para modelos lite o API key gratuita desde Google AI Studio (1500 req/día).',
      url: 'https://aistudio.google.com/',
    },
    {
      id: 'groq_free',
      name: 'Groq Free Tier',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      models: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
      tier: 'free',
      description: 'Inferencia ultra rápida con tier gratuito sujeto a límites de ratio.',
      url: 'https://console.groq.com/',
    },
    {
      id: 'openrouter_free',
      name: 'OpenRouter Free Models',
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      models: ['meta-llama/llama-3.2-3b-instruct:free', 'google/gemini-2.0-flash-exp:free'],
      tier: 'free',
      description: 'Modelos con sufijo :free accesibles sin costo.',
      url: 'https://openrouter.ai/models?free=true',
    },
    {
      id: 'deepseek_free',
      name: 'DeepSeek Free Tier',
      endpoint: 'https://api.deepseek.com/v1/chat/completions',
      models: ['deepseek-chat', 'deepseek-reasoner'],
      tier: 'free',
      description: 'deepseek-chat incluye tier gratuito / créditos iniciales al registrarse.',
      url: 'https://platform.deepseek.com/',
    },
  ];

  const MODEL_SCANNER_SOURCES = [
    {
      name: 'OpenRouter Free Models API',
      url: 'https://openrouter.ai/api/v1/models?free=true',
      type: 'api',
      description: 'Endpoint de OpenRouter que lista modelos con tier gratuito (:free) en tiempo real.',
    },
    {
      name: 'Free LLM API Resources (GitHub)',
      url: 'https://raw.githubusercontent.com/cheahjs/free-llm-api-resources/main/README.md',
      type: 'document',
      description: 'Lista comunitaria curada de APIs y proveedores LLM con opciones gratuitas.',
    },
    {
      name: 'Google AI Studio Gemini Free',
      url: 'https://ai.google.dev/pricing',
      type: 'portal',
      description: 'Documentación oficial del tier gratuito de Gemini (1500 req/día para Gemini 2.0 Flash).',
    },
    {
      name: 'Groq Cloud Rate Limits',
      url: 'https://console.groq.com/docs/rate-limits',
      type: 'portal',
      description: 'Límites y cuotas de inferencia gratuita de Groq Cloud.',
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
  };

  const el = {};
  let initialized = false;

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
    state.conversations = safeGet('conversations', {});
    state.activeConvId = safeGet('activeConvId', null);
    state.autoDetectedLocal = safeGet('autoDetectedLocal', []);
    state.maxTokens = safeGet('maxTokens', 16384);
  }

  function saveState() {
    safeSet('providers', state.providers);
    safeSet('activeProvider', state.activeProvider);
    safeSet('activeModel', state.activeModel);
    safeSet('conversations', state.conversations);
    safeSet('activeConvId', state.activeConvId);
    safeSet('autoDetectedLocal', state.autoDetectedLocal);
    safeSet('maxTokens', state.maxTokens);
  }

  function getActiveConv() {
    if (!state.activeConvId) {
      state.activeConvId = 'conv_' + Date.now();
      state.conversations[state.activeConvId] = { title: 'Nueva conversación', messages: [], createdAt: Date.now() };
    }
    return state.conversations[state.activeConvId];
  }

  /* ---------- API detection ---------- */

  async function detectLocal() {
    state.detecting = true;
    updateStatus('escaneando locales...');
    const results = [];
    for (const probe of LOCAL_PROBES) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3000);
        // Try cors first; Ollama needs OLLAMA_ORIGINS=* env var set on Windows
        let resp;
        try {
          resp = await fetch(probe.url, { signal: ctrl.signal });
        } catch (corsErr) {
          // Fallback: try no-cors (opaque response — can't read body, but can check if reachable)
          if (probe.type === 'ollama') {
            try {
              resp = await fetch(probe.url, { signal: ctrl.signal, mode: 'no-cors' });
              // If we get here, Ollama is reachable but CORS blocks reading the response
              // Use a pre-defined model list as fallback
              results.push({
                ...probe,
                models: ['deepseek-r1:8b', 'deepseek-r1:14b', 'deepseek-coder', 'llama3.2', 'codellama', 'mistral', 'gemma2'],
                status: 'online',
                corsBlocked: true,
              });
              console.log('[AIChat] detectLocal found Ollama (CORS-blocked, using fallback model list)');
              continue;
            } catch {
              /* no-cors also failed */
            }
          }
          throw corsErr;
        }
        clearTimeout(t);
        if (resp.ok) {
          let models = [];
          try {
            const data = resp.json ? await resp.json() : null;
            if (data) {
              if (probe.type === 'ollama') {
                models = (data.models || data || []).map((m) => m.name || m.model || m);
              } else if (probe.type === 'kobold') {
                models = [data.result || data.model || 'kobold-model'];
              } else {
                models = (data.data || data.models || data || []).map((m) => m.id || m.name || m);
              }
            }
          } catch {
            /* ignore parse errors */
          }
          results.push({ ...probe, models, status: 'online' });
          console.log('[AIChat] detectLocal found:', probe.name, models.length, 'models');
        }
      } catch (err) {
        console.log('[AIChat] detectLocal probe', probe.name, 'failed:', err.message || 'offline');
      }
    }
    state.autoDetectedLocal = results;
    state.detecting = false;
    syncProviders();
    saveState();
    renderProviderSelect();
    updateStatus();
    if (results.length) {
      showToast('Locales detectados: ' + results.map((r) => r.name).join(', '));
    } else {
      showToast('No se detectaron servidores locales');
    }
    return results;
  }

  async function detectModels() {
    const provider = state.providers.find((p) => p.id === state.activeProvider);
    if (!provider) {
      showToast('Seleccione un proveedor primero');
      return;
    }
    if (provider.isLocal) {
      showToast('Proveedor local — modelos ya detectados automáticamente');
      return;
    }
    if (!provider.apiKey && provider.id !== 'gemini') {
      showToast('Ingrese una API Key primero');
      return;
    }
    let modelsUrl = provider.modelsEndpoint || provider.endpoint.replace('/chat/completions', '/models').replace('/messages', '/models');
    if (provider.authType === 'query' && provider.apiKey) {
      modelsUrl += (modelsUrl.includes('?') ? '&' : '?') + 'key=' + encodeURIComponent(provider.apiKey);
    }
    el.detectModelsBtn.textContent = '...';
    el.detectModelsBtn.disabled = true;
    updateStatus('detectando modelos...');
    try {
      const headers = {};
      if (provider.authType === 'x-api-key') {
        headers['x-api-key'] = provider.apiKey;
      } else if (provider.authType !== 'query' && provider.apiKey) {
        headers['Authorization'] = 'Bearer ' + provider.apiKey;
      }
      if (provider.headers) Object.assign(headers, provider.headers);

      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 10000);
      const resp = await fetch(modelsUrl, { headers, signal: ctrl.signal });
      clearTimeout(t);
      if (resp.ok) {
        const data = await resp.json();
        let models = [];
        if (Array.isArray(data.data)) {
          models = data.data.map((m) => m.id || m.name || '').filter(Boolean);
        } else if (Array.isArray(data.models)) {
          models = data.models
            .map((m) => {
              const name = m.name || m.id || '';
              return name.replace(/^models\//, '');
            })
            .filter(Boolean);
        } else if (Array.isArray(data)) {
          models = data.map((m) => (typeof m === 'string' ? m : (m.name || m.id || '').replace(/^models\//, ''))).filter(Boolean);
        }
        if (models.length) {
          provider.models = models;
          provider.defaultModel = models[0];
          state.activeModel = models[0];
          saveState();
          renderModelSelect(provider);
          el.modelSelect.value = state.activeModel;
          updateStatus();
          showToast('Detectados ' + models.length + ' modelos en ' + provider.name);
        } else {
          showToast('Respuesta OK pero sin modelos — formato no reconocido');
        }
      } else {
        const errText = await resp.text().catch(() => '');
        if (resp.status === 401 || resp.status === 403) {
          showToast('API Key inválida o sin permisos (' + resp.status + ')');
        } else {
          showToast('Error ' + resp.status + ': ' + (errText.substring(0, 80) || 'sin detalle'));
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        showToast('Timeout (10s) — endpoint no responde');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        showToast('CORS bloqueado o sin red — use un proxy o API que permita browser');
      } else {
        showToast('Error: ' + err.message);
      }
    }
    el.detectModelsBtn.textContent = 'Detectar';
    el.detectModelsBtn.disabled = false;
    updateStatus();
  }

  function syncProviders() {
    const localProviders = state.autoDetectedLocal.map((l) => ({
      id: 'local_' + l.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      name: l.name + ' (Local)',
      endpoint: l.chatEndpoint,
      type: 'local',
      tier: 'free',
      apiKey: 'local',
      models: l.models.length ? l.models : ['default'],
      defaultModel: l.models[0] || 'default',
      isLocal: true,
      localType: l.type,
    }));

    const presetIds = DEFAULT_PROVIDERS.map((p) => p.id);
    const customProviders = state.providers.filter((p) => p.type === 'custom');
    const otherCloud = state.providers.filter((p) => p.type === 'cloud' && !presetIds.includes(p.id));

    const merged = [...localProviders];

    DEFAULT_PROVIDERS.forEach((def) => {
      const saved = state.providers.find((p) => p.id === def.id);
      if (saved) {
        merged.push({
          ...def,
          apiKey: saved.apiKey !== undefined ? saved.apiKey : def.apiKey,
          models: saved.models && saved.models.length > 1 ? saved.models : def.models,
        });
      } else {
        merged.push({ ...def });
      }
    });

    merged.push(...otherCloud, ...customProviders);

    state.providers = merged;
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

    updateStatus('generando...');
    const msgEl = appendAssistantPlaceholder();
    showStopButton();

    try {
      let response;

      // Try streaming first for OpenAI-compatible providers (not gemini, not ollama, not kobold)
      if (
        !provider.isLocal &&
        provider.id !== 'gemini' &&
        !(provider.endpoint && provider.endpoint.includes('generativelanguage')) &&
        provider.type === 'cloud' &&
        provider.id !== 'anthropic'
      ) {
        response = await streamOpenAI(provider, conv, msgEl);
      } else if (provider.id === 'gemini' || (provider.endpoint && provider.endpoint.includes('generativelanguage'))) {
        response = await callGemini(provider, conv);
      } else if (provider.isLocal && provider.localType === 'ollama') {
        response = await streamOllama(provider, conv, msgEl);
      } else if (provider.isLocal && provider.localType === 'kobold') {
        response = await callKobold(provider, conv);
      } else {
        response = await callOpenAICompatible(provider, conv);
      }

      if (!msgEl.dataset.streamed) {
        msgEl.innerHTML = renderMarkdown(response);
      }
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
          if (delta) {
            fullText += delta;
            msgEl.innerHTML = renderMarkdown(fullText) + '<span class="typing-cursor">|</span>';
            msgEl.dataset.streamed = '1';
            scrollChat();
          }
        } catch {
          /* ignore partial */
        }
      }
    }
    msgEl.innerHTML = renderMarkdown(fullText);
    return fullText;
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
          options: { num_predict: state.maxTokens || 16384 },
        }),
        signal: abortController.signal,
      });
    } catch (fetchErr) {
      if (fetchErr.message && (fetchErr.message.includes('Failed to fetch') || fetchErr.message.includes('NetworkError'))) {
        throw new Error(
          'Ollama no accesible por CORS. En Windows, abre una terminal Admin y ejecuta:\n' +
            'setx OLLAMA_ORIGINS "*"\n' +
            'Luego reinicia Ollama. Alternativamente, abre http://localhost:11434 en otra pestaña para verificar.'
        );
      }
      throw fetchErr;
    }

    if (!resp.ok) throw new Error(await resp.text());

    let fullText = '';
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
          if (delta) {
            fullText += delta;
            msgEl.innerHTML = renderMarkdown(fullText) + '<span class="typing-cursor">|</span>';
            msgEl.dataset.streamed = '1';
            scrollChat();
          }
        } catch {
          /* ignore */
        }
      }
    }
    msgEl.innerHTML = renderMarkdown(fullText);
    return fullText;
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
    return data.choices?.[0]?.message?.content || data.content?.[0]?.text || JSON.stringify(data);
  }

  async function callGemini(provider, conv) {
    const model = state.activeModel || provider.defaultModel || 'gemini-2.0-flash';
    const apiKey = provider.apiKey || '';

    let streamUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;
    let generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    if (apiKey) {
      streamUrl += `&key=${encodeURIComponent(apiKey)}`;
      generateUrl += `?key=${encodeURIComponent(apiKey)}`;
    }

    const contents = [];
    for (const m of conv.messages) {
      if (m.role === 'assistant' && m.content.startsWith('ERROR:')) continue;
      const role = m.role === 'assistant' ? 'model' : 'user';
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts.push({ text: m.content });
      } else {
        contents.push({ role, parts: [{ text: m.content }] });
      }
    }

    if (!contents.length) {
      throw new Error('No hay mensajes válidos para enviar a Gemini.');
    }

    const payload = {
      contents,
      generationConfig: {
        maxOutputTokens: state.maxTokens || 16384,
        temperature: 0.7,
      },
    };

    // Try SSE streaming first
    try {
      const resp = await fetch(streamUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (resp.ok && resp.body && typeof resp.body.getReader === 'function') {
        const reader = resp.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;
        let fullText = '';
        let buffer = '';

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            buffer += decoder.decode(value, { stream: !done });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ')) {
                const jsonStr = trimmed.slice(6);
                try {
                  const data = JSON.parse(jsonStr);
                  const candidates = data.candidates || [];
                  for (const cand of candidates) {
                    const parts = cand.content?.parts || [];
                    for (const part of parts) {
                      if (part.text) fullText += part.text;
                    }
                  }
                } catch {
                  /* ignore partial json */
                }
              }
            }
          }
        }
        if (fullText) return fullText;
      } else if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(errText || `Gemini API error (${resp.status})`);
      }
    } catch (err) {
      if (
        err.message.includes('API key not valid') ||
        err.message.includes('API_KEY_INVALID') ||
        err.message.includes('Gemini API error')
      ) {
        throw err;
      }
    }

    // Standard generateContent fallback
    const resp = await fetch(generateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      throw new Error(errText || `Gemini API error (${resp.status})`);
    }

    const data = await resp.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const text = parts.map((p) => p.text || '').join('');
    if (text) return text;
    return JSON.stringify(data);
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
  }

  async function downloadAsZip(files) {
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
    renderMessages();
    renderConfigList();
    if (el.maxTokensSelect) el.maxTokensSelect.value = String(state.maxTokens || 16384);
    bindEvents();
    if (!state.providers.length || state.autoDetectedLocal.length === 0) {
      detectLocal().catch((err) => console.error('[AIChat] detectLocal failed:', err));
    }
    initialized = true;
    console.log('[AIChat] Initialized — providers:', state.providers.length, 'active:', state.activeProvider);
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
    el.configPanel = document.getElementById('aiConfigPanel');
    el.configList = document.getElementById('aiConfigList');
    el.configAdd = document.getElementById('aiConfigAdd');
    el.saveDirBtn = document.getElementById('aiSaveDirBtn');
    el.saveDirLabel = document.getElementById('aiSaveDirLabel');
    el.newConvBtn = document.getElementById('aiNewConv');
    el.convList = document.getElementById('aiConvList');
    el.saveFilesBtn = document.getElementById('aiSaveFiles');
    el.convDelAll = document.getElementById('aiConvDelAll');
    el.apiKeyInput = document.getElementById('aiApiKey');
    el.detectModelsBtn = document.getElementById('aiDetectModels');
    el.rescanLocalBtn = document.getElementById('aiRescanLocal');
    el.maxTokensSelect = document.getElementById('aiMaxTokens');
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
    if (el.configAdd) el.configAdd.addEventListener('click', () => addCustomProvider());
    if (el.saveDirBtn) el.saveDirBtn.addEventListener('click', () => selectSaveDir());
    if (el.newConvBtn) el.newConvBtn.addEventListener('click', () => newConversation());
    if (el.saveFilesBtn) el.saveFilesBtn.addEventListener('click', () => saveCurrentFiles());
    if (el.convDelAll) el.convDelAll.addEventListener('click', () => deleteAllConversations());
    if (el.apiKeyInput) {
      el.apiKeyInput.addEventListener('input', () => {
        const provider = state.providers.find((p) => p.id === state.activeProvider);
        if (provider && provider.type === 'cloud') {
          provider.apiKey = el.apiKeyInput.value;
          saveState();
        }
      });
    }
    if (el.detectModelsBtn) {
      el.detectModelsBtn.addEventListener('click', () => {
        console.log('[AIChat] detectModels clicked');
        detectModels().catch((err) => console.error('[AIChat] detectModels error:', err));
      });
    } else {
      console.warn('[AIChat] detectModelsBtn not found in DOM');
    }
    if (el.rescanLocalBtn) {
      el.rescanLocalBtn.addEventListener('click', () => {
        console.log('[AIChat] rescanLocal clicked');
        detectLocal().catch((err) => console.error('[AIChat] detectLocal error:', err));
      });
    } else {
      console.warn('[AIChat] rescanLocalBtn not found in DOM');
    }
    if (el.maxTokensSelect) {
      el.maxTokensSelect.addEventListener('change', () => {
        state.maxTokens = parseInt(el.maxTokensSelect.value, 10);
        saveState();
        showToast('Max tokens: ' + state.maxTokens.toLocaleString());
      });
    }
    if (el.configPanel) {
      el.configPanel.addEventListener('click', (e) => {
        if (e.target.closest('.ai-cfg-remove')) {
          const id = e.target.closest('.ai-cfg-remove').dataset.id;
          removeProvider(id);
        }
      });
    }
    console.log('[AIChat] Events bound — providerSelect:', !!el.providerSelect, 'detectModelsBtn:', !!el.detectModelsBtn);

    // Sandbox events
    const sandboxClose = document.getElementById('sandboxCloseBtn');
    const sandboxFullscreen = document.getElementById('sandboxFullscreenBtn');
    const sandboxDownload = document.getElementById('sandboxDownloadBtn');
    if (sandboxClose)
      sandboxClose.addEventListener('click', () => {
        document.getElementById('sandboxDrawer')?.classList.remove('active');
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

  function openDrawer() {
    el.chatDrawer.classList.add('active');
    el.chatScrim.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!initialized) init();
    renderConversations();
    scrollChat();
  }

  function closeDrawer() {
    el.chatDrawer.classList.remove('active');
    el.chatScrim.classList.remove('active');
    document.body.style.overflow = '';
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
      if (provider.type === 'cloud') {
        el.apiKeyInput.value = provider.apiKey || '';
        el.apiKeyInput.parentElement.style.display = '';
        if (provider.id === 'gemini') {
          el.apiKeyInput.placeholder = 'API Key (Google AI Studio / opcional para flash-lite)...';
        } else if (provider.tier === 'free') {
          el.apiKeyInput.placeholder = 'API Key (gratuita / según proveedor)...';
        } else {
          el.apiKeyInput.placeholder = 'API Key...';
        }
      } else {
        el.apiKeyInput.parentElement.style.display = 'none';
      }
    }
    saveState();
    updateStatus();
  }

  function onModelChange() {
    state.activeModel = el.modelSelect.value;
    saveState();
  }

  function getTierBadgeText(tier) {
    if (tier === 'free') return ' [GRATIS]';
    if (tier === 'both') return ' [FREE TIER]';
    return '';
  }

  function renderProviderSelect() {
    el.providerSelect.innerHTML = '<option value="">-- Seleccionar IA --</option>';
    state.providers.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      const icon = p.isLocal ? '🖥️' : '☁️';
      const badge = getTierBadgeText(p.tier);
      opt.textContent = icon + ' ' + p.name + badge;
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
      let label = m;
      if (m.includes(':free') || m === 'gemini-2.0-flash-lite') {
        label += ' [GRATIS]';
      } else if (m === 'gemini-2.0-flash') {
        label += ' [FREE TIER]';
      }
      opt.textContent = label;
      el.modelSelect.appendChild(opt);
    });
    if (state.activeModel && provider.models.includes(state.activeModel)) {
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
    if (typeof marked !== 'undefined') {
      const html = marked.parse(text);
      // Add "Run" buttons after code blocks
      return addRunButtons(html);
    }
    return escapeHtml(text).replace(/\n/g, '<br>');
  }

  function addRunButtons(html) {
    // Add a "▶ Run" button after each code block
    const div = document.createElement('div');
    div.innerHTML = html;
    const codeBlocks = div.querySelectorAll('pre code');
    codeBlocks.forEach((code) => {
      const lang = code.className.replace('language-', '').replace('lang-', '');
      if (['html', 'css', 'javascript', 'js', 'ts', 'typescript'].includes(lang)) {
        const btn = document.createElement('button');
        btn.className = 'code-run-btn';
        btn.textContent = '▶ Run';
        btn.addEventListener('click', () => {
          openSandbox(code.textContent, lang);
        });
        code.parentElement.appendChild(btn);
      }
    });
    return div.innerHTML;
  }

  function openSandbox(code, lang) {
    const sandbox = document.getElementById('sandboxDrawer');
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

  function addCustomProvider() {
    const name = prompt('Nombre del proveedor:');
    if (!name) return;
    const endpoint = prompt('URL del endpoint (ej: https://api.ejemplo.com/v1/chat/completions):');
    if (!endpoint) return;
    const apiKey = prompt('API Key (opcional):') || '';
    const models = prompt('Modelos (separados por coma):', 'default') || 'default';
    const id = 'custom_' + name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    const provider = {
      id,
      name,
      endpoint,
      type: 'custom',
      tier: 'paid',
      apiKey,
      models: models.split(',').map((s) => s.trim()),
      defaultModel: models.split(',')[0].trim(),
    };
    state.providers.push(provider);
    state.activeProvider = id;
    state.activeModel = provider.defaultModel;
    saveState();
    renderProviderSelect();
    el.providerSelect.value = id;
    renderModelSelect(provider);
    updateStatus();
    renderConfigList();
  }

  function removeProvider(id) {
    state.providers = state.providers.filter((p) => p.id !== id);
    if (state.activeProvider === id) {
      state.activeProvider = state.providers[0]?.id || null;
      state.activeModel = '';
    }
    saveState();
    renderProviderSelect();
    if (state.activeProvider) el.providerSelect.value = state.activeProvider;
    updateStatus();
    renderConfigList();
  }

  function renderConfigList() {
    if (!el.configList) return;
    el.configList.innerHTML = '';
    const presetIds = DEFAULT_PROVIDERS.map((p) => p.id);
    const cloudPresets = state.providers.filter((p) => p.type === 'cloud' && presetIds.includes(p.id));
    const custom = state.providers.filter((p) => p.type === 'custom');
    const otherCloud = state.providers.filter((p) => p.type === 'cloud' && !presetIds.includes(p.id));
    const all = [...cloudPresets, ...otherCloud, ...custom];
    if (!all.length) {
      el.configList.innerHTML = '<div class="ai-cfg-empty">Agregue proveedores personalizados con el botón +</div>';
      return;
    }
    all.forEach((p) => {
      const div = document.createElement('div');
      div.className = 'ai-cfg-item';
      const tierBadge = p.tier
        ? '<span class="ai-cfg-tier tier-' + escapeHtml(p.tier) + '">' + escapeHtml(p.tier.toUpperCase()) + '</span>'
        : '';
      const noteHtml = p.note ? '<div class="ai-cfg-note">' + escapeHtml(p.note) + '</div>' : '';
      div.innerHTML =
        '<div class="ai-cfg-info">' +
        '<div class="ai-cfg-header">' +
        '<span class="ai-cfg-name">' +
        escapeHtml(p.name) +
        '</span>' +
        tierBadge +
        '</div>' +
        '<span class="ai-cfg-endpoint">' +
        escapeHtml(p.endpoint.substring(0, 45)) +
        (p.endpoint.length > 45 ? '...' : '') +
        '</span>' +
        noteHtml +
        '</div>' +
        '<div class="ai-cfg-key-row">' +
        '<input type="password" class="ai-cfg-key" data-id="' +
        p.id +
        '" placeholder="API Key' +
        (p.tier === 'free' || p.id === 'gemini' ? ' (opcional/gratis)...' : '...') +
        '" value="' +
        escapeHtml(p.apiKey || '') +
        '" autocomplete="off">' +
        '<button class="ai-cfg-remove" data-id="' +
        p.id +
        '" title="Eliminar proveedor">✕</button>' +
        '</div>';
      el.configList.appendChild(div);
    });

    el.configList.querySelectorAll('.ai-cfg-key').forEach((input) => {
      input.addEventListener('input', () => {
        const id = input.dataset.id;
        const provider = state.providers.find((p) => p.id === id);
        if (provider) {
          provider.apiKey = input.value;
          saveState();
        }
      });
    });
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
      return { provider: state.activeProvider, model: state.activeModel, saveDir: state.saveDir?.name };
    },
    selectSaveDir,
    saveGeneratedFiles,
    detectLocal,
    detectModels,
    callGemini,
    openSandbox,
    DEFAULT_PROVIDERS,
    LOCAL_PROBES,
    FREE_TIER_PROVIDERS,
    MODEL_SCANNER_SOURCES,
  };
})();

window.AIChat = AIChat;
