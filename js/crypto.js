/* global SafeStore */

const BPICrypto = (() => {
  const DB_NAME = 'bpi_crypto';
  const DB_VERSION = 1;
  const STORE_NAME = 'keys';
  const KEY_ID = 'derived_key';

  let db = null;
  let cryptoKey = null;
  let available = null;

  /* ---------- IndexedDB for key storage ---------- */

  function openDB() {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains(STORE_NAME)) {
          d.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = (e) => {
        db = e.target.result;
        resolve(db);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async function dbGet(key) {
    try {
      const d = await openDB();
      return new Promise((resolve, reject) => {
        const tx = d.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  }

  async function dbSet(key, value) {
    try {
      const d = await openDB();
      return new Promise((resolve, reject) => {
        const tx = d.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      /* ignore */
    }
  }

  /* ---------- Fingerprint derivation ---------- */

  function getFingerprint() {
    const parts = [
      navigator.userAgent || '',
      String(screen.width || 0),
      String(screen.height || 0),
      String(screen.colorDepth || 0),
      Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      navigator.language || '',
    ];
    return parts.join('|');
  }

  async function deriveKey(fingerprint) {
    const enc = new TextEncoder();
    const material = enc.encode('bpi_v1_' + fingerprint);
    const hash = await crypto.subtle.digest('SHA-256', material);
    return crypto.subtle.importKey('raw', hash.slice(0, 32), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  }

  /* ---------- Public API ---------- */

  async function isAvailable() {
    if (available !== null) return available;
    try {
      if (!window.crypto || !window.crypto.subtle) {
        available = false;
        return false;
      }
      if (!window.indexedDB) {
        available = false;
        return false;
      }
      // Test encrypt/decrypt
      const fp = getFingerprint();
      const key = await deriveKey(fp);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const enc = new TextEncoder();
      const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode('test'));
      await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
      available = true;
      return true;
    } catch {
      available = false;
      return false;
    }
  }

  async function encrypt(plaintext) {
    if (!plaintext) return plaintext;
    try {
      if (!(await isAvailable())) return plaintext;
      if (!cryptoKey) {
        const stored = await dbGet(KEY_ID);
        if (stored) {
          cryptoKey = await crypto.subtle.importKey('raw', stored, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
        } else {
          const fp = getFingerprint();
          cryptoKey = await deriveKey(fp);
          const raw = await crypto.subtle.exportKey('raw', cryptoKey);
          await dbSet(KEY_ID, raw);
        }
      }
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const enc = new TextEncoder();
      const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, enc.encode(plaintext));
      // Prepend IV to ciphertext
      const combined = new Uint8Array(iv.length + cipher.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(cipher), iv.length);
      return 'bpi_enc_' + btoa(String.fromCharCode(...combined));
    } catch {
      return plaintext;
    }
  }

  async function decrypt(ciphertext) {
    if (!ciphertext || typeof ciphertext !== 'string') return ciphertext;
    if (!ciphertext.startsWith('bpi_enc_')) return ciphertext;
    try {
      if (!(await isAvailable())) return ciphertext;
      if (!cryptoKey) {
        const stored = await dbGet(KEY_ID);
        if (stored) {
          cryptoKey = await crypto.subtle.importKey('raw', stored, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
        } else {
          return ciphertext;
        }
      }
      const raw = ciphertext.slice(8); // remove 'bpi_enc_'
      const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
      const iv = bytes.slice(0, 12);
      const data = bytes.slice(12);
      const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, data);
      return new TextDecoder().decode(dec);
    } catch {
      return ciphertext;
    }
  }

  /* ---------- Migration ---------- */

  async function migrateKeys() {
    if (SafeStore && SafeStore.get('bpi_crypto_migrated') === '1') return;
    try {
      const providers = JSON.parse((SafeStore && SafeStore.get('aichat_providers')) || localStorage.getItem('aichat_providers') || '[]');
      let changed = false;
      for (const p of providers) {
        if (p.apiKey && !p.apiKey.startsWith('bpi_enc_')) {
          p.apiKey = await encrypt(p.apiKey);
          changed = true;
        }
      }
      if (changed) {
        const s = JSON.stringify(providers);
        if (SafeStore) SafeStore.set('aichat_providers', s);
        else localStorage.setItem('aichat_providers', s);
      }
      if (SafeStore) SafeStore.set('bpi_crypto_migrated', '1');
      else localStorage.setItem('bpi_crypto_migrated', '1');
    } catch {
      /* migration failed silently */
    }
  }

  return { encrypt, decrypt, isAvailable, migrateKeys };
})();

if (typeof window !== 'undefined') {
  window.BPICrypto = BPICrypto;
}
