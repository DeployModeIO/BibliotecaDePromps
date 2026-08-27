/* global Dexie */
const BPDStore = (() => {
  let db = null;
  function openDB() {
    if (db) return Promise.resolve(db);
    if (typeof Dexie === 'undefined' || typeof indexedDB === 'undefined') return Promise.resolve(null);
    return new Promise((resolve) => {
      try {
        db = new Dexie('bdp_store');
        db.version(1).stores({ kv: 'key' });
        resolve(db);
      } catch (e) {
        db = null;
        resolve(null);
      }
    });
  }
  async function get(key, fallback) {
    const d = await openDB();
    if (!d) {
      const raw =
        typeof window !== 'undefined' && window.SafeStore
          ? window.SafeStore.get(key)
          : typeof localStorage !== 'undefined'
            ? localStorage.getItem(key)
            : null;
      return raw ? JSON.parse(raw) : fallback;
    }
    try {
      const rec = await d.kv.get(key);
      return rec ? rec.value : fallback;
    } catch (e) {
      return fallback;
    }
  }
  async function set(key, value) {
    const d = await openDB();
    if (!d) {
      const s = JSON.stringify(value);
      if (typeof window !== 'undefined' && window.SafeStore) window.SafeStore.set(key, s);
      else if (typeof localStorage !== 'undefined') localStorage.setItem(key, s);
      return;
    }
    try {
      await d.kv.put({ key, value });
    } catch (e) {
      /* ignore */
    }
  }
  return { get, set };
})();
if (typeof window !== 'undefined') window.BPDStore = BPDStore;
