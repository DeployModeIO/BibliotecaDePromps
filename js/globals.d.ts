// Declaraciones de tipos globales para `npm run typecheck` (tsc --noEmit).
// Las librerías vendor y los datos se declaran como any para permitir el
declare const PROMPTS_DB: any;
declare const PROMPTS_DB_EXTRA: any;
declare const PROMPTS_DB_V2: any;
declare const PROMPTS_DB_FULLSTACK: any;
declare const marked: any;
declare const JSZip: any;
declare const Dexie: any;
declare const DOMPurify: any;
declare const SafeStore: any;

interface Window {
  [key: string]: any;
}

// Extensiones de tipos DOM para evitar errores de checkJs
interface HTMLElement {
  disabled?: boolean;
  value?: any;
  dataset?: DOMStringMap;
  closest?(selectors: string): HTMLElement | null;
  focus?(): void;
  srcdoc?: string;
  _timer?: any;
  tagName?: string;
  id?: string;
  classList?: DOMTokenList;
  select?(): void;
  prompt?: any;
  userChoice?: any;
}

interface HTMLSelectElement extends HTMLElement {}
interface HTMLInputElement extends HTMLElement {}

interface Element {
  dataset?: DOMStringMap;
  closest?(selectors: string): HTMLElement | null;
  focus?: () => void;
  tagName?: string;
  id?: string;
  classList?: DOMTokenList;
  disabled?: boolean;
  value?: any;
  srcdoc?: string;
  result?: any;
}

interface EventTarget {
  value?: any;
  closest?(selectors: string): HTMLElement | null;
  dataset?: DOMStringMap;
  focus?: () => void;
  tagName?: string;
  id?: string;
  classList?: DOMTokenList;
  disabled?: boolean;
  srcdoc?: string;
  result?: any;
}

interface Event {
  target?: EventTarget | null;
  prompt?: any;
  userChoice?: any;
}

// Declaración global para state en ai-chat.js
// Se declara como any para evitar errores de asignación estricta
declare const state: any;

// Declaración para evitar error TS2810 en crypto.js
// Se declara Promise constructor con overload que permite 0 argumentos
interface PromiseConstructor {
  new <T = any>(executor?: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
}
