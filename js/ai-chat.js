/* ============================================================
   IA CHAT PANEL v1.0 — Auto-detección local + cloud genérico
   ============================================================ */
/* global JSZip, marked */

const AIChat = (() => {
  const LS_PREFIX = 'aichat_';

  const LOCAL_PROBES = [
    { name: 'Ollama', url: 'http://localhost:11434/api/tags', type: 'ollama', chatEndpoint: 'http://localhost:11434/api/chat' },
    { name: 'LM Studio', url: 'http://localhost:1234/v1/models', type: 'openai', chatEndpoint: 'http://localhost:1234/v1/chat/completions' },
    { name: 'vLLM', url: 'http://localhost:8000/v1/models', type: 'openai', chatEndpoint: 'http://localhost:8000/v1/chat/completions' },
    { name: 'LocalAI', url: 'http://localhost:8080/v1/models', type: 'openai', chatEndpoint: 'http://localhost:8080/v1/chat/completions' },
    { name: 'KoboldCpp', url: 'http://localhost:5001/api/v1/model', type: 'kobold', chatEndpoint: 'http://localhost:5001/api/v1/generate' },
    { name: 'Text-Gen-WebUI', url: 'http://localhost:5000/v1/models', type: 'openai', chatEndpoint: 'http://localhost:5000/v1/chat/completions' },
    { name: 'GPT4All', url: 'http://localhost:4891/v1/models', type: 'openai', chatEndpoint: 'http://localhost:4891/v1/chat/completions' },
  ];

  const DEFAULT_PROVIDERS = [
    { id: 'openai', name: 'OpenAI', endpoint: 'https://api.openai.com/v1/chat/completions', type: 'cloud', apiKey: '', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'], defaultModel: 'gpt-4o-mini', modelsEndpoint: 'https://api.openai.com/v1/models' },
    { id: 'anthropic', name: 'Anthropic', endpoint: 'https://api.anthropic.com/v1/messages', type: 'cloud', apiKey: '', models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'], defaultModel: 'claude-3-5-sonnet-20241022', headers: { 'anthropic-version': '2023-06-01' }, modelsEndpoint: 'https://api.anthropic.com/v1/models', authType: 'x-api-key' },
    { id: 'groq', name: 'Groq', endpoint: 'https://api.groq.com/openai/v1/chat/completions', type: 'cloud', apiKey: '', models: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'], defaultModel: 'llama-3.1-70b-versatile', modelsEndpoint: 'https://api.groq.com/openai/v1/models' },
    { id: 'deepseek', name: 'DeepSeek', endpoint: 'https://api.deepseek.com/v1/chat/completions', type: 'cloud', apiKey: '', models: ['deepseek-chat', 'deepseek-reasoner'], defaultModel: 'deepseek-chat', modelsEndpoint: 'https://api.deepseek.com/v1/models' },
    { id: 'openrouter', name: 'OpenRouter', endpoint: 'https://openrouter.ai/api/v1/chat/completions', type: 'cloud', apiKey: '', models: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'google/gemini-2.0-flash'], defaultModel: 'openai/gpt-4o', modelsEndpoint: 'https://openrouter.ai/api/v1/models' },
    { id: 'alibaba', name: 'Alibaba Token Plan', endpoint: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', type: 'cloud', apiKey: '', models: ['qwen-max', 'qwen-plus', 'qwen-turbo', 'deepseek-r1', 'deepseek-v3', 'llama3-70b', 'qwen2.5-72b'], defaultModel: 'qwen-plus', modelsEndpoint: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/models' },
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
  };

  const el = {};
  let initialized = false;

  function safeGet(key, fallback) {
    try {
      const raw = window.SafeStore ? window.SafeStore.get(LS_PREFIX + key) : localStorage.getItem(LS_PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }

  function safeSet(key, val) {
    try {
      const s = JSON.stringify(val);
      if (window.SafeStore) window.SafeStore.set(LS_PREFIX + key, s);
      else localStorage.setItem(LS_PREFIX + key, s);
    } catch { /* ignore */ }
  }

  function loadState() {
    state.providers = safeGet('providers', []);
    state.activeProvider = safeGet('activeProvider', null);
    state.activeModel = safeGet('activeModel', '');
    state.conversations = safeGet('conversations', {});
    state.activeConvId = safeGet('activeConvId', null);
    state.autoDetectedLocal = safeGet('autoDetectedLocal', []);
  }

  function saveState() {
    safeSet('providers', state.providers);
    safeSet('activeProvider', state.activeProvider);
    safeSet('activeModel', state.activeModel);
    safeSet('conversations', state.conversations);
    safeSet('activeConvId', state.activeConvId);
    safeSet('autoDetectedLocal', state.autoDetectedLocal);
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
        const t = setTimeout(() => ctrl.abort(), 5000);
        const resp = await fetch(probe.url, { signal: ctrl.signal });
        clearTimeout(t);
        if (resp.ok) {
          let models = [];
          try {
            const data = await resp.json();
            if (probe.type === 'ollama') {
              models = (data.models || data || []).map(m => m.name || m.model || m);
            } else if (probe.type === 'kobold') {
              models = [data.result || data.model || 'kobold-model'];
            } else {
              models = (data.data || data.models || data || []).map(m => m.id || m.name || m);
            }
          } catch { /* ignore parse errors */ }
          results.push({ ...probe, models, status: 'online' });
        }
      } catch { /* offline or CORS */ }
    }
    state.autoDetectedLocal = results;
    state.detecting = false;
    syncProviders();
    saveState();
    renderProviderSelect();
    updateStatus();
    if (results.length) {
      showToast('Locales detectados: ' + results.map(r => r.name).join(', '));
    } else {
      showToast('No se detectaron servidores locales');
    }
    return results;
  }

  async function detectModels() {
    const provider = state.providers.find(p => p.id === state.activeProvider);
    if (!provider) {
      showToast('Seleccione un proveedor primero');
      return;
    }
    if (provider.isLocal) {
      showToast('Proveedor local — modelos ya detectados automáticamente');
      return;
    }
    if (!provider.apiKey) {
      showToast('Ingrese una API Key primero');
      return;
    }
    const modelsUrl = provider.modelsEndpoint || provider.endpoint.replace('/chat/completions', '/models').replace('/messages', '/models');
    el.detectModelsBtn.textContent = '...';
    el.detectModelsBtn.disabled = true;
    updateStatus('detectando modelos...');
    try {
      const headers = {};
      if (provider.authType === 'x-api-key') {
        headers['x-api-key'] = provider.apiKey;
      } else {
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
        if (Array.isArray(data.data)) models = data.data.map(m => m.id || m.name || '').filter(Boolean);
        else if (Array.isArray(data.models)) models = data.models.map(m => m.id || m.name || '').filter(Boolean);
        else if (Array.isArray(data)) models = data.map(m => (typeof m === 'string' ? m : m.id || m.name || '')).filter(Boolean);
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
    const localProviders = state.autoDetectedLocal.map(l => ({
      id: 'local_' + l.name.toLowerCase().replace(/\s+/g, '_'),
      name: l.name + ' (Local)',
      endpoint: l.chatEndpoint,
      type: 'local',
      apiKey: 'local',
      models: l.models.length ? l.models : ['default'],
      defaultModel: l.models[0] || 'default',
      isLocal: true,
      localType: l.type,
    }));

    const customProviders = state.providers.filter(p => p.type === 'custom');
    const cloudPresets = state.providers.filter(p => p.type === 'cloud' && !['openai', 'anthropic', 'groq', 'deepseek', 'openrouter', 'alibaba'].includes(p.id));
    const hasOpenAI = state.providers.some(p => p.id === 'openai');
    const hasAnthropic = state.providers.some(p => p.id === 'anthropic');
    const hasGroq = state.providers.some(p => p.id === 'groq');
    const hasDeepSeek = state.providers.some(p => p.id === 'deepseek');
    const hasOpenRouter = state.providers.some(p => p.id === 'openrouter');
    const hasAlibaba = state.providers.some(p => p.id === 'alibaba');

    const merged = [...localProviders];

    if (!hasOpenAI) merged.push({ ...DEFAULT_PROVIDERS[0] });
    if (!hasAnthropic) merged.push({ ...DEFAULT_PROVIDERS[1] });
    if (!hasGroq) merged.push({ ...DEFAULT_PROVIDERS[2] });
    if (!hasDeepSeek) merged.push({ ...DEFAULT_PROVIDERS[3] });
    if (!hasOpenRouter) merged.push({ ...DEFAULT_PROVIDERS[4] });
    if (!hasAlibaba) merged.push({ ...DEFAULT_PROVIDERS[5] });

    merged.push(...cloudPresets, ...customProviders);

    state.providers = merged;
  }

  /* ---------- API calls ---------- */

  async function sendMessage(content) {
    const conv = getActiveConv();
    conv.messages.push({ role: 'user', content, time: Date.now() });
    saveState();
    renderMessages();

    const provider = state.providers.find(p => p.id === state.activeProvider);
    if (!provider) {
      appendSystemMsg('No hay proveedor activo. Seleccione uno en el panel de configuración.');
      return;
    }

    updateStatus('generando...');
    const msgEl = appendAssistantPlaceholder();

    try {
      let response;
      if (provider.isLocal && provider.localType === 'ollama') {
        response = await callOllama(provider, conv);
      } else if (provider.isLocal && provider.localType === 'kobold') {
        response = await callKobold(provider, conv);
      } else {
        response = await callOpenAICompatible(provider, conv);
      }
      msgEl.innerHTML = renderMarkdown(response);
      conv.messages.push({ role: 'assistant', content: response, time: Date.now() });
      saveState();
    } catch (err) {
      msgEl.innerHTML = '<span class="chat-err">Error: ' + escapeHtml(err.message) + '</span>';
      conv.messages.push({ role: 'assistant', content: 'ERROR: ' + err.message, time: Date.now() });
      saveState();
    }

    updateStatus();
    scrollChat();
  }

  async function callOllama(provider, conv) {
    const messages = conv.messages.filter(m => m.role !== 'assistant' || !m.content.startsWith('ERROR:')).map(m => ({ role: m.role, content: m.content }));
    const resp = await fetch(provider.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: state.activeModel || provider.defaultModel, messages, stream: false }),
    });
    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    return data.message?.content || data.response || JSON.stringify(data);
  }

  async function callKobold(provider, conv) {
    const lastUser = [...conv.messages].reverse().find(m => m.role === 'user');
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
    const messages = conv.messages.filter(m => m.role !== 'assistant' || !m.content.startsWith('ERROR:')).map(m => ({ role: m.role, content: m.content }));
    const headers = { 'Content-Type': 'application/json' };
    if (provider.authType === 'x-api-key') {
      headers['x-api-key'] = provider.apiKey;
    } else {
      headers['Authorization'] = 'Bearer ' + provider.apiKey;
    }
    if (provider.headers) Object.assign(headers, provider.headers);

    const body = {
      model: state.activeModel || provider.defaultModel,
      messages,
      max_tokens: 4096,
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
    if (!state.saveDir) {
      const handle = await selectSaveDir();
      if (!handle) return fallbackDownload(files);
    }

    try {
      const perm = await state.saveDir.queryPermission({ mode: 'readwrite' });
      if (perm !== 'granted') {
        const req = await state.saveDir.requestPermission({ mode: 'readwrite' });
        if (req !== 'granted') return fallbackDownload(files);
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
    } catch (err) {
      fallbackDownload(files);
    }
  }

  function fallbackDownload(files) {
    if (files.length === 1) {
      downloadFile(files[0].name, files[0].content);
    } else {
      downloadAsZip(files);
    }
  }

  function downloadFile(name, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadAsZip(files) {
    if (typeof JSZip === 'undefined') {
      showToast('JSZip no cargado — descargando archivos individuales');
      files.forEach(f => downloadFile(f.name, f.content));
      return;
    }
    const zip = new JSZip();
    files.forEach(f => zip.file(f.name, f.content));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'proyecto_generado.zip'; a.click();
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
      const extMap = { html: 'html', css: 'css', javascript: 'js', js: 'js', json: 'json', python: 'py', bash: 'sh', sh: 'sh', yaml: 'yml', xml: 'xml', md: 'md' };
      const ext = extMap[lang] || 'txt';
      files.push({ name: 'archivo_' + (++idx) + '.' + ext, content });
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
    bindEvents();
    if (!state.providers.length || state.autoDetectedLocal.length === 0) detectLocal();
    initialized = true;
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
  }

  function bindEvents() {
    el.chatToggle.addEventListener('click', () => openDrawer());
    el.chatClose.addEventListener('click', () => closeDrawer());
    el.chatScrim.addEventListener('click', () => closeDrawer());
    el.providerSelect.addEventListener('change', onProviderChange);
    el.modelSelect.addEventListener('change', onModelChange);
    el.chatSend.addEventListener('click', () => sendCurrentMessage());
    el.chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendCurrentMessage(); }
    });
    el.configAdd.addEventListener('click', () => addCustomProvider());
    el.saveDirBtn.addEventListener('click', () => selectSaveDir());
    el.newConvBtn.addEventListener('click', () => newConversation());
    el.saveFilesBtn.addEventListener('click', () => saveCurrentFiles());
    if (el.convDelAll) el.convDelAll.addEventListener('click', () => deleteAllConversations());
    el.apiKeyInput.addEventListener('input', () => {
      const provider = state.providers.find(p => p.id === state.activeProvider);
      if (provider && provider.type === 'cloud') {
        provider.apiKey = el.apiKeyInput.value;
        saveState();
      }
    });
    el.detectModelsBtn.addEventListener('click', () => detectModels());
    el.rescanLocalBtn.addEventListener('click', () => detectLocal());
    el.configPanel.addEventListener('click', e => {
      if (e.target.closest('.ai-cfg-remove')) {
        const id = e.target.closest('.ai-cfg-remove').dataset.id;
        removeProvider(id);
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
    const provider = state.providers.find(p => p.id === id);
    if (provider) {
      renderModelSelect(provider);
      state.activeModel = provider.defaultModel || provider.models[0] || '';
      el.modelSelect.value = state.activeModel;
      if (provider.type === 'cloud') {
        el.apiKeyInput.value = provider.apiKey || '';
        el.apiKeyInput.parentElement.style.display = '';
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

  function renderProviderSelect() {
    el.providerSelect.innerHTML = '<option value="">-- Seleccionar IA --</option>';
    state.providers.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      const icon = p.isLocal ? '🖥️' : '☁️';
      opt.textContent = icon + ' ' + p.name;
      el.providerSelect.appendChild(opt);
    });
    if (state.activeProvider) {
      el.providerSelect.value = state.activeProvider;
      const provider = state.providers.find(p => p.id === state.activeProvider);
      if (provider) renderModelSelect(provider);
    }
  }

  function renderModelSelect(provider) {
    el.modelSelect.innerHTML = '';
    provider.models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m; opt.textContent = m; el.modelSelect.appendChild(opt);
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
    conv.messages.forEach(m => {
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
      return marked.parse(text);
    }
    return escapeHtml(text).replace(/\n/g, '<br>');
  }

  function scrollChat() {
    requestAnimationFrame(() => {
      el.chatMessages.scrollTop = el.chatMessages.scrollHeight;
    });
  }

  function updateStatus(text) {
    const provider = state.providers.find(p => p.id === state.activeProvider);
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

    ids.forEach(id => {
      const conv = state.conversations[id];
      const div = document.createElement('div');
      div.className = 'ai-conv-item' + (id === state.activeConvId ? ' active' : '');
      div.dataset.id = id;
      div.innerHTML = '<span class="ai-conv-label">' + escapeHtml(conv.title || 'Sin título') + '</span><span class="ai-conv-time">' + new Date(conv.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) + '</span><button class="ai-conv-del" data-id="' + id + '" title="Eliminar conversación">✕</button>';
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

    el.convList.querySelectorAll('.ai-conv-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConversation(btn.dataset.id);
      });
    });
  }

  function saveCurrentFiles() {
    const conv = getActiveConv();
    const lastAssistant = [...conv.messages].reverse().find(m => m.role === 'assistant' && !m.content.startsWith('ERROR:'));
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
      id, name, endpoint, type: 'custom', apiKey,
      models: models.split(',').map(s => s.trim()),
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
    state.providers = state.providers.filter(p => p.id !== id);
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
    const cloudPresets = state.providers.filter(p => p.type === 'cloud' && ['openai', 'anthropic', 'groq', 'deepseek', 'openrouter', 'alibaba'].includes(p.id));
    const custom = state.providers.filter(p => p.type === 'custom');
    const otherCloud = state.providers.filter(p => p.type === 'cloud' && !['openai', 'anthropic', 'groq', 'deepseek', 'openrouter', 'alibaba'].includes(p.id));
    const all = [...cloudPresets, ...otherCloud, ...custom];
    if (!all.length) {
      el.configList.innerHTML = '<div class="ai-cfg-empty">Agregue proveedores personalizados con el botón +</div>';
      return;
    }
    all.forEach(p => {
      const div = document.createElement('div');
      div.className = 'ai-cfg-item';
      div.innerHTML =
        '<div class="ai-cfg-info">' +
        '<span class="ai-cfg-name">' + escapeHtml(p.name) + '</span>' +
        '<span class="ai-cfg-endpoint">' + escapeHtml(p.endpoint.substring(0, 35)) + '...</span>' +
        '</div>' +
        '<div class="ai-cfg-key-row">' +
        '<input type="password" class="ai-cfg-key" data-id="' + p.id + '" placeholder="API Key..." value="' + escapeHtml(p.apiKey || '') + '" autocomplete="off">' +
        '<button class="ai-cfg-remove" data-id="' + p.id + '" title="Eliminar proveedor">✕</button>' +
        '</div>';
      el.configList.appendChild(div);
    });

    el.configList.querySelectorAll('.ai-cfg-key').forEach(input => {
      input.addEventListener('input', () => {
        const id = input.dataset.id;
        const provider = state.providers.find(p => p.id === id);
        if (provider) {
          provider.apiKey = input.value;
          saveState();
        }
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast show';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.className = 'toast'; }, 3000);
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
    getStatus() { return { provider: state.activeProvider, model: state.activeModel, saveDir: state.saveDir?.name }; },
    selectSaveDir,
    saveGeneratedFiles,
    detectLocal,
  };
})();

window.AIChat = AIChat;