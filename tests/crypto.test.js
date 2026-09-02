/**
 * Tests REALES de js/crypto.js (BPICrypto v2) — el módulo más sensible de la app.
 * Corre contra el archivo real vía module.exports (no copias reescritas).
 * Node 22+ provee webcrypto (crypto.subtle), btoa/atob y TextEncoder globales.
 */

// localStorage en memoria (reemplaza al del navegador)
const memStore = new Map();
global.localStorage = {
  getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
  setItem: (k, v) => memStore.set(k, String(v)),
  removeItem: (k) => memStore.delete(k),
};

const BPICrypto = require('../js/crypto.js');

describe('BPICrypto v2', () => {
  beforeEach(() => {
    memStore.clear();
  });

  test('isAvailable() es true con WebCrypto disponible', async () => {
    await expect(BPICrypto.isAvailable()).resolves.toBe(true);
  });

  test('encrypt → decrypt round-trip devuelve el original', async () => {
    const secret = 'sk-super-secreta-1234567890';
    const enc = await BPICrypto.encrypt(secret);
    expect(enc).not.toBe(secret);
    expect(enc.startsWith('bpi2_')).toBe(true);
    const dec = await BPICrypto.decrypt(enc);
    expect(dec).toBe(secret);
  });

  test('encrypt es idempotente sobre valores ya cifrados', async () => {
    const enc1 = await BPICrypto.encrypt('api-key-value');
    const enc2 = await BPICrypto.encrypt(enc1);
    expect(enc2).toBe(enc1);
  });

  test('dos cifrados del mismo valor difieren (IV aleatorio)', async () => {
    const a = await BPICrypto.encrypt('misma-key');
    const b = await BPICrypto.encrypt('misma-key');
    expect(a).not.toBe(b);
  });

  test('decrypt de ciphertext alterado devuelve null (fail-closed)', async () => {
    const enc = await BPICrypto.encrypt('clave-importante');
    const tampered = enc.slice(0, -4) + (enc.endsWith('AAAA') ? 'BBBB' : 'AAAA');
    const dec = await BPICrypto.decrypt(tampered);
    expect(dec).toBeNull();
  });

  test('decrypt de formato legacy bpi_enc_ devuelve null (ilegible)', async () => {
    const dec = await BPICrypto.decrypt('bpi_enc_ABCDEF123456');
    expect(dec).toBeNull();
  });

  test('decrypt de plaintext sin prefijo lo devuelve igual', async () => {
    const dec = await BPICrypto.decrypt('sk-plaintext-antiguo');
    expect(dec).toBe('sk-plaintext-antiguo');
  });

  test('encrypt maneja entradas vacías/no-string sin romper', async () => {
    await expect(BPICrypto.encrypt('')).resolves.toBe('');
    await expect(BPICrypto.encrypt(null)).resolves.toBe(null);
  });

  test('migrateKeys cifra claves plaintext de aichat_providers', async () => {
    const providers = [
      { id: 'openai', apiKey: 'sk-plain-1' },
      { id: 'gemini', apiKey: 'AIza-plain-2' },
      { id: 'local', apiKey: '' },
    ];
    memStore.set('aichat_providers', JSON.stringify(providers));

    await BPICrypto.migrateKeys();

    const migrated = JSON.parse(memStore.get('aichat_providers'));
    expect(migrated[0].apiKey.startsWith('bpi2_')).toBe(true);
    expect(migrated[1].apiKey.startsWith('bpi2_')).toBe(true);
    expect(migrated[2].apiKey).toBe('');
    // Las claves migradas se descifran al original
    expect(await BPICrypto.decrypt(migrated[0].apiKey)).toBe('sk-plain-1');
    expect(await BPICrypto.decrypt(migrated[1].apiKey)).toBe('AIza-plain-2');
  });

  test('migrateKeys es idempotente (no doble-cifra)', async () => {
    memStore.set('aichat_providers', JSON.stringify([{ id: 'x', apiKey: 'sk-once' }]));
    await BPICrypto.migrateKeys();
    const first = JSON.parse(memStore.get('aichat_providers'))[0].apiKey;
    memStore.delete('bpi_crypto_migrated_v2'); // forzar re-ejecución
    await BPICrypto.migrateKeys();
    const second = JSON.parse(memStore.get('aichat_providers'))[0].apiKey;
    expect(second).toBe(first); // ya tenía prefijo bpi2_, no se tocó
  });

  test('el secreto de instalación persiste y se regenera si se borra', async () => {
    const first = await BPICrypto.encrypt('warmup');
    const secret = memStore.get('bpi_install_secret');
    expect(typeof secret).toBe('string');
    expect(secret.length).toBeGreaterThan(20);
    await BPICrypto.encrypt('otra');
    expect(memStore.get('bpi_install_secret')).toBe(secret);

    // Simular "usuario limpia datos del sitio": el secreto desaparece.
    // La clave debe re-derivarse del nuevo secreto, no seguir con el huérfano.
    memStore.clear();
    const encNew = await BPICrypto.encrypt('post-limpieza');
    const secret2 = memStore.get('bpi_install_secret');
    expect(secret2).toBeTruthy();
    expect(secret2).not.toBe(secret);
    await expect(BPICrypto.decrypt(encNew)).resolves.toBe('post-limpieza');
    // Lo cifrado con el secreto viejo ya no es descifrable (fail-closed)
    await expect(BPICrypto.decrypt(first)).resolves.toBeNull();
  });
});
