/* ============================================================
   LIB-LOADER — Carga bajo demanda de librerías pesadas.
   Evita descargar ~4.8 MB (mermaid, xlsx, jspdf, jszip, marked)
   en la carga inicial: cada lib se inyecta solo cuando se usa.
   Offline-first: siempre desde /js/vendor (el SW las precachea).
   ============================================================ */

const LibLoader = (() => {
  const pending = new Map();

  /**
   * Inyecta un <script> una sola vez y resuelve cuando el global está disponible.
   * @param {string} src - ruta del script
   * @param {() => boolean} isReady - comprueba si el global ya existe
   * @returns {Promise<boolean>}
   */
  function load(src, isReady) {
    if (isReady()) return Promise.resolve(true);
    if (pending.has(src)) return pending.get(src);

    const promise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      const timeout = setTimeout(() => {
        console.warn('[LibLoader] timeout cargando', src);
        resolve(isReady());
      }, 15000);
      script.onload = () => {
        clearTimeout(timeout);
        resolve(isReady());
      };
      script.onerror = () => {
        clearTimeout(timeout);
        console.warn('[LibLoader] fallo cargando', src);
        resolve(false);
      };
      document.head.appendChild(script);
    });

    pending.set(src, promise);
    return promise;
  }

  return {
    /** Markdown parser (chat IA) */
    marked: () => load('js/vendor/marked.min.js', () => typeof window.marked !== 'undefined'),
    /** ZIP (guardar archivos del chat/sandbox) */
    jszip: () => load('js/vendor/jszip.min.js', () => typeof window.JSZip !== 'undefined'),
    /** Diagramas mermaid (chat IA) */
    mermaid: () => load('js/vendor/mermaid.min.js', () => typeof window.mermaid !== 'undefined'),
    /** Export PDF de prompts */
    jspdf: () => load('js/vendor/jspdf.umd.min.js', () => !!(window.jspdf && window.jspdf.jsPDF)),
    /** Export Excel de prompts */
    xlsx: () => load('js/vendor/xlsx.full.min.js', () => typeof window.XLSX !== 'undefined'),
  };
})();

if (typeof window !== 'undefined') {
  window.LibLoader = LibLoader;
}
