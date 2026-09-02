/* ============================================================
   BPI CRYPTO v2 — Cifrado de datos sensibles en reposo (API keys).

   Diseño (honrado sobre las limitaciones de un client-side BYOK):
   - AES-GCM (Web Crypto) con clave derivada por PBKDF2-SHA256
     (150k iteraciones) de un secreto de instalación aleatorio.
   - La clave NUNCA se exporta ni se persiste en crudo: solo vive
     en memoria como CryptoKey no extraíble.
   - El "secreto de instalación" (salt larga) se genera una vez por
     dispositivo y se guarda en localStorage. Esto protege contra
     inspección casual, backups, discos compartidos y lectura
     cross-app; NO protege contra un XSS del mismo origen (ningún
     esquema local lo hace — por eso el CSP y la sanitización son
     la defensa primaria).
   - Prefijo bpi2_ para distinguir del formato legacy inseguro.
   ============================================================ */

/* global SafeStore, module */

const BPICrypto = (() => {
  const VERSION_PREFIX = 'bpi2_';
  const LEGACY_PREFIX = 'bpi_enc_';
  const SECRET_KEY = 'bpi_install_secret';
  const MIGRATED_KEY = 'bpi_crypto_migrated_v2';
  const ITERATIONS = 150000;
  const PEPPER = 'bpi_promps_industriales_v2';

  let cryptoKey = null;
  let keySecret = null;
  let available = null;

  function getStore() {
    if (typeof SafeStore !== 'undefined' && SafeStore) return SafeStore;
    return {
      get: (k) => {
        try {
          return localStorage.getItem(k);
        } catch {
          return null;
        }
      },
      set: (k, v) => {
        try {
          localStorage.setItem(k, v);
        } catch {
          /* ignore */
        }
      },
    };
  }

  /** Secreto de instalación: 32 bytes aleatorios en base64, generados una vez. */
  function getInstallSecret() {
    const store = getStore();
    let secret = store.get(SECRET_KEY);
    if (!secret) {
      const bytes = crypto.getRandomValues(new Uint8Array(32));
      secret = btoa(String.fromCharCode(...bytes));
      store.set(SECRET_KEY, secret);
    }
    return secret;
  }

  /** PBKDF2 → AES-GCM key, no extraíble, solo en memoria.
      Si el secreto de instalación cambia (p. ej. el usuario limpió los datos
      del sitio), se re-deriva la clave para no cifrar con un secreto huérfano. */
  async function getKey() {
    const secret = getInstallSecret();
    if (cryptoKey && keySecret === secret) return cryptoKey;
    const enc = new TextEncoder();
    const salt = enc.encode(PEPPER + '|' + secret);
    const material = await crypto.subtle.importKey('raw', enc.encode('bpi-key-material'), 'PBKDF2', false, ['deriveKey']);
    cryptoKey = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    keySecret = secret;
    return cryptoKey;
  }

  function toBase64(bytes) {
    let bin = '';
    bytes.forEach((b) => {
      bin += String.fromCharCode(b);
    });
    return btoa(bin);
  }

  function fromBase64(b64) {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  }

  /* ---------- Public API ---------- */

  async function isAvailable() {
    if (available !== null) return available;
    try {
      if (typeof crypto === 'undefined' || !crypto.subtle || !crypto.getRandomValues) {
        available = false;
        return false;
      }
      // Round-trip de prueba
      const key = await getKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const data = new TextEncoder().encode('bpi-selftest');
      const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
      available = new TextDecoder().decode(plain) === 'bpi-selftest';
      return available;
    } catch {
      available = false;
      return false;
    }
  }

  /**
   * Cifra un string. Devuelve el ciphertext con prefijo bpi2_, o el
   * plaintext original si el cifrado no está disponible (fallback legado).
   */
  async function encrypt(plaintext) {
    if (!plaintext || typeof plaintext !== 'string') return plaintext;
    if (plaintext.startsWith(VERSION_PREFIX)) return plaintext; // ya cifrado
    try {
      if (!(await isAvailable())) return plaintext;
      const key = await getKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));
      return VERSION_PREFIX + toBase64(iv) + '.' + toBase64(new Uint8Array(cipher));
    } catch {
      return plaintext;
    }
  }

  /**
   * Descifra. Devuelve null si el ciphertext es corrupto/ilegible
   * (fail-closed: el caller decide pedir la clave de nuevo).
   * Strings sin prefijo se devuelven como vienen (plaintext legacy).
   */
  async function decrypt(ciphertext) {
    if (!ciphertext || typeof ciphertext !== 'string') return ciphertext;
    if (ciphertext.startsWith(LEGACY_PREFIX)) {
      // Formato legacy inseguro (clave derivada de fingerprint): ilegible ahora.
      return null;
    }
    if (!ciphertext.startsWith(VERSION_PREFIX)) return ciphertext;
    try {
      if (!(await isAvailable())) return null;
      const key = await getKey();
      const body = ciphertext.slice(VERSION_PREFIX.length);
      const [ivB64, dataB64] = body.split('.');
      if (!ivB64 || !dataB64) return null;
      const iv = fromBase64(ivB64);
      const data = fromBase64(dataB64);
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
      return new TextDecoder().decode(plain);
    } catch {
      return null;
    }
  }

  /**
   * Migra las API keys de proveedores guardadas en plaintext a cifrado.
   * Idempotente. Se llama desde AIChat.init().
   */
  async function migrateKeys() {
    const store = getStore();
    if (store.get(MIGRATED_KEY) === '1') return;
    try {
      const raw = store.get('aichat_providers');
      if (raw) {
        const providers = JSON.parse(raw);
        let changed = false;
        for (const p of providers) {
          if (p.apiKey && typeof p.apiKey === 'string' && !p.apiKey.startsWith(VERSION_PREFIX) && !p.apiKey.startsWith(LEGACY_PREFIX)) {
            p.apiKey = await encrypt(p.apiKey);
            changed = true;
          }
        }
        if (changed) store.set('aichat_providers', JSON.stringify(providers));
      }
      store.set(MIGRATED_KEY, '1');
    } catch {
      /* no bloquear la app por la migración */
    }
  }

  return { encrypt, decrypt, isAvailable, migrateKeys };
})();

if (typeof window !== 'undefined') {
  window.BPICrypto = BPICrypto;
}
// Export para tests reales (Jest) sin cambiar el uso en navegador
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BPICrypto;
}
