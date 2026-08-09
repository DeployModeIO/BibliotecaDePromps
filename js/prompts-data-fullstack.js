/**
 * MEGA-PROMPTS FULLSTACK v3.0
 * 30 Prompts para construir aplicaciones fullstack completas desde cero
 * Más útiles y solicitadas del 2026
 */
const PROMPTS_DB_FULLSTACK = {
  categorias: [
    {
      id: "fullstack",
      nombre: "Desarrollo Fullstack 2026",
      icono: "⚡",
      color: "#00e676",
      descripcion: "Mega-prompts para generar aplicaciones fullstack completas: SaaS, AI, e-commerce, real-time, fintech y más. 100% desde cero, probadas, modernas y listas para producción.",
      subcategorias: [
        {
          id: "fs_saas",
          nombre: "SaaS & MVPs",
          prompts: [
            {
              id: "fs_saas_001",
              titulo: "SaaS Multi-Tenant con Next.js 15, Supabase y Stripe",
              categoria: "Aplicación Fullstack",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Arquitecto de Software Senior especializado en SaaS multi-tenant con 15 años de experiencia en Next.js, React, Supabase y sistemas de pago. Has construido 20+ plataformas SaaS escalables.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 (App Router) + TypeScript + Supabase (Auth, DB, Storage) + Stripe + Tailwind CSS + Shadcn UI
- Arquitectura: Row-Level Security (RLS) para multi-tenancy en Supabase
- Pagos: Stripe Checkout + Customer Portal para manejo de suscripciones
- Auth: Supabase Auth con magic link, OAuth (Google, GitHub) y RBAC
- DB: PostgreSQL en Supabase con migrations, seed data y políticas RLS
- Deploy: Vercel (frontend) + Supabase Cloud (backend)
- Testing: Vitest + Playwright para E2E
- Monitoring: Sentry + PostHog analytics

TAREA:
Desarrolla una aplicación SaaS multi-tenant completa tipo "ProjectHub" (gestión de proyectos para equipos) con todo el código necesario. La aplicación debe incluir:

1. SETUP DEL PROYECTO:
   - package.json con todas las dependencias exactas
   - Configuración de TypeScript, ESLint, Prettier
   - Supabase schema SQL completo con migrations
   - Políticas RLS para separación de tenants
   - Dockerfile y docker-compose.yml opcionales

2. AUTENTICACIÓN Y ONBOARDING:
   - Login/Registro con email/password y OAuth (Google, GitHub)
   - Magic link y recuperación de contraseña
   - Onboarding de 3 pasos tras registro
   - Creación automática de workspace/organización
   - Invitación de miembros por email con roles (admin, member, viewer)

3. DASHBOARD PRINCIPAL:
   - Sidebar con navegación (Proyectos, Tareas, Calendario, Miembros, Config)
   - Resumen de proyectos activos, tareas pendientes, deadlines próximos
   - Gráficos de actividad (Chart.js o Recharts)
   - Búsqueda global (⌘K) con command palette

4. GESTIÓN DE PROYECTOS:
   - CRUD de proyectos con nombre, descripción, fechas, estado
   - Vista Kanban (drag & drop) + Lista + Gantt
   - Tareas con asignación, prioridad, etiquetas, fechas, subtareas
   - Comentarios en tareas con menciones @usuario
   - Adjuntar archivos (Subabase Storage)
   - Filtros avanzados y ordenación

5. SUSCRIPCIÓN Y PAGOS (STRIPE):
   - Planes: Free (3 proyectos, 5 miembros), Pro ($15/mes, ilimitado), Enterprise ($49/mes, SSO + API)
   - Stripe Checkout integrado
   - Customer Portal para gestionar suscripción
   - Webhook de Stripe para sync de estado de suscripción
   - Límites de features según plan (middleware de verificación)

6. CONFIGURACIÓN DE WORKSPACE:
   - Personalización: nombre, logo, dominio personalizado
   - Gestión de miembros y roles
   - API keys para integraciones
   - Audit logs de actividad
   - Configuración de notificaciones

7. RESPONSIVE Y UX:
   - Mobile-first con Tailwind responsive
   - Modo oscuro/claro con toggle
   - Estados: loading skeletons, empty states, error states
   - Toast notifications (sonner o react-hot-toast)
   - Navegación con teclado y accesibilidad (a11y)

8. TESTING:
   - Tests unitarios con Vitest para lógica de negocio
   - Tests de integración para API routes
   - Tests E2E con Playwright (flujo de registro + crear proyecto)

FORMATO DE SALIDA:
- Proporciona TODOS los archivos del proyecto con su ruta completa
- Incluye comandos de setup (npm install, supabase start, stripe listen)
- Schema SQL completo con comentarios
- README.md con instrucciones de instalación y deploy
- Demostración con datos seed para testing

ENTREGABLE FINAL:
Aplicación SaaS completa, multi-tenant, lista para producción, con código limpio, tipado estricto, manejo de errores robusto y documentación exhaustiva.`,
              tags: ["Next.js", "Supabase", "Stripe", "SaaS", "multi-tenant", "TypeScript", "Tailwind"],
              uso: "Base para cualquier SaaS"
            },
            {
              id: "fs_saas_002",
              titulo: "Aplicación Fullstack de Agente AI con RAG y LangChain",
              categoria: "Aplicación Fullstack",
              prioridad: "critica",
              prompt: `ACTÚA COMO: ML Engineer Fullstack Senior con 10 años de experiencia en LLMs, RAG, embeddings y aplicaciones AI-first. Experto en LangChain, OpenAI, Pinecone y arquitecturas serverless.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 (App Router) + TypeScript + Python FastAPI (microservicio AI) + Pinecone + OpenAI + Vercel AI SDK
- AI: GPT-4o + embeddings text-embedding-3-large + RAG con Pinecone
- Frontend: React 19, Tailwind, Shadcn UI, streaming de respuestas
- Backend AI: FastAPI con LangChain para orquestación de agentes
- DB: PostgreSQL (Supabase) + Pinecone (vector)
- Auth: Clerk o Supabase Auth
- Deploy: Vercel (Next.js) + Railway (FastAPI)

TAREA:
Desarrolla "DocuMind AI", una aplicación donde usuarios suben documentos (PDF, DOCX, TXT, Markdown) y pueden chatear con ellos usando RAG. La app debe:

1. UPLOAD Y PROCESAMIENTO DE DOCUMENTOS:
   - Drag & drop con soporte multi-archivo (PDF, DOCX, TXT, MD, CSV)
   - Procesamiento server-side: extracción de texto con PyPDF2/pdfplumber, chunking inteligente (por párrafos con overlap)
   - Generación de embeddings y almacenamiento en Pinecone
   - Barra de progreso en tiempo real (WebSocket)
   - Biblioteca de documentos con búsqueda y carpetas

2. CHAT INTERFAZ (STREAMING):
   - Chat UI moderna con burbujas de mensaje, avatares y timestamps
   - Streaming de respuesta token por token (Vercel AI SDK useChat)
   - Contexto: muestra fragmentos relevantes del documento usados en la respuesta
   - Modo "citar fuentes" con links a secciones del documento
   - Historial de conversaciones por documento
   - Exportar conversación a PDF/Markdown

3. AGENTES AI (LANCHAIN):
   - Agente "Investigador": responde preguntas con citas precisas
   - Agente "Resumidor": genera resúmenes ejecutivos de documentos largos
   - Agente "Comparador": compara 2+ documentos y encuentra diferencias/similitudes
   - Agente "Traductor": traduce contenido manteniendo formato
   - Agente "Extractor": extrae datos estructurados (tablas, listas, entidades)

4. COLABORACIÓN:
   - Compartir documentos con otros usuarios (link o email)
   - Comentarios y anotaciones en fragmentos de documento
   - Workspaces compartidos para equipos
   - Activity feed de cambios

5. ENTERPRISE FEATURES:
   - SSO (SAML/OIDC)
   - Cifrado en reposo (AES-256)
   - Audit logs completos
   - Límites de rate por usuario/organización
   - Bring Your Own API Key (BYOK)

6. API PARA DESARROLLADORES:
   - REST API con autenticación por API key
   - Endpoints: upload, query, chat, summarize
   - SDK cliente en TypeScript y Python
   - Documentación OpenAPI/Swagger
   - Rate limiting y quotas

7. UI/UX:
   - Diseño premium tipo Linear/Notion con animaciones fluidas
   - Split view: documento a la izquierda, chat a la derecha
   - Markdown rendering con syntax highlighting
   - Dark/Light mode
   - Atajos de teclado (⌘K command palette)
   - Responsive mobile

8. TESTING Y DEPLOY:
   - Tests unitarios (Vitest + Pytest)
   - Tests de integración
   - E2E con Playwright
   - Docker + docker-compose para deploy local
   - Scripts de deploy a Vercel + Railway
   - CI/CD con GitHub Actions

FORMATO DE SALIDA:
- Todos los archivos con rutas completas (monorepo con apps/web y apps/api)
- Schema SQL + script de setup Pinecone
- README con arquitectura, setup local y deploy
- Ejemplos de documentos para testing

ENTREGABLE FINAL:
Plataforma AI completa tipo "ChatGPT para tus documentos" con RAG de última generación, streaming, agentes múltiples, colaboración y enterprise-ready.`,
              tags: ["AI", "RAG", "LangChain", "OpenAI", "Pinecone", "Next.js", "FastAPI"],
              uso: "Producto AI empresarial"
            },
            {
              id: "fs_saas_003",
              titulo: "Social Media Scheduler & Analytics Dashboard",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Fullstack Developer Senior con experiencia en integración de APIs de redes sociales, procesamiento de datos y dashboards de analytics. Especialista en React, Node.js y OAuth.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + Redis (BullMQ para jobs) + Tailwind
- APIs: Meta Graph API, Twitter API v2, LinkedIn API, YouTube Data API
- Auth: OAuth 2.0 multi-proveedor con refresh tokens
- Jobs: BullMQ para scheduling de posts y recolección de analytics
- Charts: Recharts + Tremor para visualizaciones
- Deploy: Vercel + Railway + Upstash Redis

TAREA:
Desarrolla "PostFlow", un scheduler de redes sociales con analytics completo:

1. CONEXIÓN DE REDES SOCIALES:
   - OAuth flow para Instagram, Twitter/X, LinkedIn, YouTube, TikTok
   - Gestión de tokens (refresh automático, revocación)
   - Multi-cuenta por plataforma
   - Indicador de estado de conexión

2. CREACIÓN Y PROGRAMACIÓN DE CONTENIDO:
   - Editor de posts con preview en tiempo real (cómo se verá en cada red)
   - Soporte para imágenes, video, carruseles, threads
   - Programación con fecha/hora y zona horaria
   - Cola de contenido, borradores, posts recurrentes
   - Aprobación en equipo (draft → review → approved → scheduled)
   - Vista de calendario (semanal/mensual) con drag & drop

3. ANALYTICS DASHBOARD:
   - Métricas por red: followers, impresiones, engagement rate, clicks, shares
   - Gráficos de crecimiento (línea, barras) con comparación período anterior
   - Mejores horarios para publicar (heatmap)
   - Top contenido por engagement
   - Demografía de audiencia (edad, ubicación, género)
   - Exportación de reportes PDF/CSV
   - Email semanal automático con resumen de analytics

4. AI FEATURES:
   - Generación de copys con OpenAI (título, cuerpo, hashtags)
   - Sugerencia de mejor horario basado en datos históricos
   - Análisis de sentimiento de comentarios
   - Detección de tendencias en la industria
   - Optimización de imágenes para cada plataforma

5. PROYECTO TÉCNICO COMPLETO:
   - Estructura de proyecto Next.js 15 App Router
   - Schema Prisma completo con migrations
   - API routes con rate limiting y caching
   - BullMQ workers para procesamiento asíncrono
   - Componentes React con Storybook
   - Tests unitarios e integración
   - Docker compose para desarrollo local

ENTREGABLE FINAL:
Aplicación fullstack profesional lista para producción con todas las funcionalidades de scheduling, analytics y AI para gestión de redes sociales.`,
              tags: ["social media", "analytics", "OAuth", "Next.js", "Prisma", "Redis", "AI"],
              uso: "SaaS de marketing digital"
            },
            {
              id: "fs_saas_004",
              titulo: "Customer Support Platform con AI Chatbot Multi-Canal",
              categoria: "Aplicación Fullstack",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Technical Lead especializado en plataformas de customer experience con experiencia en chatbots AI, sistemas de tickets y comunicación omnicanal.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + WebSocket (Socket.io) + OpenAI
- Canales: Chat en vivo (widget), Email, WhatsApp Business API, Telegram, Discord
- AI: GPT-4o para respuestas automáticas + fine-tuning con datos de la empresa
- Tiempo real: Socket.io para chat en vivo y notificaciones
- UI: React 19 + Tailwind + Radix UI + TipTap editor
- Deploy: Vercel + Railway + Redis

TAREA:
Desarrolla "SupportOS", plataforma omnicanal de customer support:

1. WIDGET DE CHAT EN VIVO:
   - Script embebible (similar a Intercom) que se inserta en cualquier sitio web
   - Chat UI flotante con minimizable, emojis, attachments, typing indicators
   - AI Bot responde primero, escala a humano si es necesario
   - Customizable: colores, logo, mensajes de bienvenida, posición
   - Pre-chat form para capturar nombre y email
   - Offline mode: deja mensaje cuando no hay agentes disponibles

2. DASHBOARD DE AGENTES:
   - Vista de conversaciones en tiempo real (similar a Slack/Intercom)
   - Panel izquierdo: lista de chats activos con prioridad y tiempo de espera
   - Panel central: conversación con historial completo, datos del usuario
   - Panel derecho: perfil del usuario, conversaciones previas, notas internas
   - Estados de agente: online, away, busy, offline
   - Asignación automática round-robin o manual
   - Macros: respuestas predefinidas con variables dinámicas
   - Snippets de código con syntax highlighting

3. SISTEMA DE TICKETS:
   - Conversión de chat a ticket automática al cerrar
   - Tickets por email con parser inteligente
   - SLA tracking por prioridad
   - Flujo de estados: new → open → pending → resolved → closed
   - Colaboración interna: notas privadas, menciones @agente
   - Merge de tickets duplicados

4. AI COPILOT:
   - Sugerencia de respuestas en tiempo real mientras el agente escribe
   - Auto-tagging y categorización de conversaciones
   - Análisis de sentimiento del cliente
   - Resumen automático de conversación larga
   - Base de conocimiento auto-generada desde tickets resueltos
   - Chatbot autónomo que resuelve FAQs sin intervención humana

5. BASE DE CONOCIMIENTO:
   - Editor de artículos con Markdown/WYSIWYG
   - Categorías y subcategorías con búsqueda full-text
   - Sugerencia de artículos relevantes durante el chat
   - Analytics de artículos más vistos y efectivos
   - Importación desde Zendesk/Intercom

6. ANALYTICS Y REPORTES:
   - Tiempo de primera respuesta, tiempo de resolución, CSAT
   - Volumen de conversaciones por canal, hora, día
   - Performance de agentes individuales
   - Tópicos más frecuentes (auto-detectados)
   - Reportes PDF automáticos semanales
   - Exportación de datos a CSV/Excel

ENTREGABLE FINAL:
Plataforma completa de customer support omnicanal con AI chatbot, widget de chat en vivo, sistema de tickets y base de conocimiento. Código completo, testeado y listo para producción.`,
              tags: ["customer support", "chatbot", "AI", "WebSocket", "omnicanal", "Next.js"],
              uso: "SaaS de atención al cliente"
            },
            {
              id: "fs_saas_005",
              titulo: "API-First Headless CMS con Editor Visual de Bloques",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Arquitecto de Software especializado en CMS headless, APIs REST/GraphQL y editores de contenido ricos con 12 años de experiencia.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + GraphQL (Apollo Server) + REST API + PostgreSQL + Redis
- Editor: TipTap (basado en ProseMirror) + bloques personalizados
- Media: Procesamiento de imágenes con Sharp + almacenamiento S3/Cloudflare R2
- API: GraphQL con Apollo + REST con rate limiting + webhooks
- Auth: JWT + refresh tokens + roles granulares
- Deploy: Docker + Kubernetes o Railway
- Testing: Vitest + Playwright + k6 (load testing)

TAREA:
Desarrolla "BlockCMS", un CMS headless con editor visual de bloques:

1. EDITOR DE CONTENIDO:
   - Editor de bloques drag & drop (similar a Notion)
   - Tipos de bloques: texto, heading, imagen, video, código, tabla, callout, quote, embed (Twitter, YouTube, etc.), formulario, galería
   - Vista previa en tiempo real (desktop/tablet/mobile)
   - Versionado de contenido (historial de cambios, revertir)
   - Autosave con debounce
   - Soporte multilingüe (i18n) por campo
   - SEO analyzer integrado (meta tags, readability, keywords)

2. GESTIÓN DE CONTENIDO:
   - Content types definibles por el usuario (similar a Strapi)
   - Campos: texto, rich text, número, fecha, media, relación, JSON, boolean, select
   - Validación de campos y required/max/min
   - Relaciones entre tipos (one-to-one, one-to-many, many-to-many)
   - Taxonomías y etiquetas con jerarquía
   - Workflow de publicación: draft → review → published → archived
   - Programación de publicación futura

3. API (GRAPHQL + REST):
   - GraphQL API con Apollo Server y playground
   - REST API con documentación OpenAPI/Swagger
   - Rate limiting por API key
   - Caching con Redis (cache por query y TTL configurable)
   - Webhooks para notificar cambios a frontends
   - SDK generado automáticamente para TypeScript
   - Preview mode con token secreto (para drafts antes de publicar)

4. GESTIÓN DE MEDIA:
   - Upload con drag & drop, multi-archivo
   - Procesamiento automático: resize, webp conversion, CDN
   - Galería con filtros, búsqueda y carpetas
   - Metadata: alt text, caption, copyright
   - Optimización de imágenes on-the-fly

5. ADMIN PANEL:
   - Dashboard con actividad reciente, contenido pendiente
   - Gestión de usuarios y roles (admin, editor, author, viewer)
   - Audit log de cambios
   - Importación/exportación de datos (JSON, CSV)
   - Temas personalizables (colores, logo)

6. TECHNICAL EXCELLENCE:
   - TypeScript estricto en todo el proyecto
   - Migraciones de DB con Prisma
   - Rate limiting y CORS configurable
   - Tests: unitarios, integración, E2E
   - Docker multi-stage builds
   - Guía de deploy a Railway, Vercel y Kubernetes
   - Documentación completa (README + API docs)

ENTREGABLE FINAL:
CMS headless completo, API-first, con editor visual de bloques, GraphQL + REST APIs, gestión de media, RBAC y listo para alimentar cualquier frontend moderno.`,
              tags: ["CMS", "headless", "GraphQL", "editor", "Next.js", "Prisma", "TypeScript"],
              uso: "Plataforma de contenido"
            },
            {
              id: "fs_saas_006",
              titulo: "No-Code Internal Tools Builder con Drag & Drop",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero de Plataforma Senior especializado en herramientas low-code/no-code, constructores de UI drag & drop, y sistemas de automatización interna.

CONTEXTO TÉCNICO:
- Stack: React 19 + TypeScript + DnD Kit + Zustand (state) + Node.js/Express + PostgreSQL
- UI Builder: Sistema de componentes arrastrables con grid layout
- Components: Tablas, formularios, gráficos, botones, modales, cards, mapas
- Data: Conexión a bases de datos externas, APIs REST, Google Sheets
- Auth: Multi-tenant con roles y permisos por workspace
- Deploy: Docker + Railway

TAREA:
Desarrolla "QuickDash", un builder no-code para herramientas internas:

1. BUILDER DE PÁGINAS:
   - Canvas drag & drop con grid responsive (12 columnas)
   - Componentes disponibles: tabla de datos, formulario CRUD, gráfico (línea, barra, pie), métrica/KPI, card, imagen, texto, iframe embed, mapa, lista, timeline
   - Propiedades editables por componente (datos, colores, títulos, config)
   - Previsualización desktop/tablet/mobile
   - Templates predefinidos para casos comunes

2. CONEXIÓN A FUENTES DE DATOS:
   - Conectores nativos: PostgreSQL, MySQL, Supabase, Airtable, Google Sheets
   - REST API connector genérico (con headers, auth, paginación)
   - GraphQL connector
   - Editor visual de queries con preview de resultados
   - Transformación de datos con JavaScript snippets
   - Variables y filtros dinámicos

3. FORMULARIOS Y ACCIONES:
   - Builder de formularios con validación
   - Acciones: crear/editar/eliminar registro, enviar email, llamar webhook, ejecutar query
   - Workflows simples: trigger → condition → action
   - Confirmaciones y notificaciones toast

4. DASHBOARD DE ADMINISTRACIÓN:
   - Gestión de páginas (crear, duplicar, archivar)
   - Menú de navegación configurable
   - Temas: colores primario/secundario, logo, favicon
   - Control de acceso por página según rol
   - Historial de cambios y versionado

5. DEPLOY Y EMBED:
   - Publicar página con URL pública o embebible (iframe)
   - Protección con contraseña o autenticación
   - Dominio personalizado (opcional)
   - Exportar página como app React standalone

ENTREGABLE FINAL:
Builder no-code completo para crear herramientas internas (admin panels, dashboards, CRUDs) con drag & drop, conexión a múltiples fuentes de datos y deploy instantáneo.`,
              tags: ["no-code", "low-code", "drag-drop", "internal tools", "React", "builder"],
              uso: "Plataforma de herramientas internas"
            }
          ]
        },
        {
          id: "fs_ecommerce",
          nombre: "E-commerce & Marketplaces",
          prompts: [
            {
              id: "fs_ecom_001",
              titulo: "E-commerce Fullstack con Next.js + Stripe + Sistema de Inventario",
              categoria: "Aplicación Fullstack",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Desarrollador Fullstack Senior con 10 años de experiencia en e-commerce, integración de pagos, gestión de inventario y optimización de conversión.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + Stripe + Tailwind + Shadcn
- Pagos: Stripe Elements + Payment Intents + Webhooks
- Auth: NextAuth.js v5 con credenciales y OAuth
- Search: Búsqueda full-text con PostgreSQL + filtros facetados
- State: Zustand para carrito + React Query para server state
- Media: Cloudflare R2 o S3 para imágenes de productos
- Deploy: Vercel + Railway

TAREA:
Desarrolla "ShopKit", e-commerce completo listo para producción:

1. CATÁLOGO DE PRODUCTOS:
   - Páginas: listado (PLP) + detalle (PDP) con SEO optimizado
   - Filtros: categoría, precio, talla, color, rating
   - Búsqueda con autocomplete, corrección de typos y sugerencias
   - Productos relacionados y "comprados juntos"
   - Wishlist y lista de deseos
   - Reviews y ratings con fotos

2. CARRITO Y CHECKOUT:
   - Carrito persistente (DB + localStorage) con sync entre dispositivos
   - Cupón de descuento con validación
   - Cálculo de shipping en tiempo real
   - Checkout de 3 pasos: dirección → envío → pago
   - Stripe Elements integrado con Apple Pay y Google Pay
   - Email de confirmación con resumen (React Email + Resend)

3. ADMIN PANEL:
   - Dashboard con KPIs: ventas, órdenes, revenue, productos más vendidos
   - CRUD de productos con variantes (talla, color) e imágenes múltiples
   - Gestión de inventario con alertas de stock bajo
   - Gestión de órdenes: estados (pending → processing → shipped → delivered), tracking
   - Gestión de clientes con historial de compras
   - Configuración de shipping, tax, payment methods

4. SISTEMA DE INVENTARIO:
   - Stock por variante de producto
   - Stock reservations al agregar al carrito (TTL)
   - Alerta de stock bajo (< 10 unidades)
   - Backorder: permitir compra sin stock con fecha estimada
   - Historial de movimientos de inventario

5. PERFORMANCE Y SEO:
   - ISR (Incremental Static Regeneration) para páginas de producto
   - Imágenes optimizadas con next/image y blur placeholder
   - Sitemap automático y robots.txt
   - Schema.org structured data para rich snippets
   - Lighthouse > 90 en todas las métricas

6. FEATURES AVANZADOS:
   - Multi-moneda y multi-idioma (i18n)
   - Programas de fidelidad y puntos
   - Email marketing: carritos abandonados, recomendaciones
   - AB testing de precios y layouts
   - Analytics con Plausible o PostHog

ENTREGABLE FINAL:
E-commerce completo tipo Shopify store, con catálogo, carrito, checkout Stripe, admin panel, gestión de inventario y optimizado para SEO y performance.`,
              tags: ["e-commerce", "Stripe", "Next.js", "Prisma", "PostgreSQL", "inventario"],
              uso: "Tienda online completa"
            },
            {
              id: "fs_ecom_002",
              titulo: "Marketplace P2P con Sistema de Reputación y Pagos Split",
              categoria: "Aplicación Fullstack",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Arquitecto de Marketplace con experiencia en plataformas P2P como Airbnb, Upwork, Fiverr. Especialista en pagos split, sistemas de reputación y escrow.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + Stripe Connect + Redis
- Pagos: Stripe Connect para split de pagos y escrow
- Tiempo real: WebSocket (Socket.io) para mensajería
- Auth: NextAuth.js con verificación de identidad
- Search: Meilisearch o Typesense para búsqueda instantánea
- UI: Tailwind + Radix UI + Framer Motion
- Deploy: Vercel + Railway + Redis

TAREA:
Desarrolla "SkillSwap", marketplace P2P para servicios freelance:

1. REGISTRO Y PERFILES:
   - Onboarding guiado para freelancers (skills, portfolio, tarifas)
   - Perfiles públicos con bio, skills, portfolio, rating, reviews
   - Verificación de identidad (documento + selfie)
   - Badges: verificado, top rated, respuesta rápida, 100+ proyectos

2. BÚSQUEDA Y DESCUBRIMIENTO:
   - Búsqueda con filtros: categoría, precio, rating, ubicación, disponibilidad
   - Resultados con ordenación: relevancia, mejor rating, menor precio
   - Algoritmo de recomendación basado en historial
   - Categorías: desarrollo, diseño, marketing, escritura, video, música, consultoría

3. SISTEMA DE PEDIDOS:
   - Comprador publica proyecto con descripción, presupuesto, deadline
   - Freelancers envían propuestas con precio, tiempo estimado, mensaje
   - Comprador compara propuestas y selecciona
   - Contrato con milestones y fechas de entrega
   - Chat integrado comprador-freelancer con adjuntos

4. PAGOS (STRIPE CONNECT):
   - Onboarding de freelancers en Stripe Connect
   - Pago se retiene en escrow hasta entrega
   - Milestones: liberación parcial de pago por hito completado
   - Disputas y resolución con mediación
   - Fee de plataforma: 10% automático
   - Payout automático a cuenta bancaria del freelancer

5. SISTEMA DE REPUTACIÓN:
   - Rating 1-5 estrellas con review escrito
   - Métricas: comunicación, calidad, cumplimiento de plazos
   - Score de confianza calculado (proyectos completados, rating, antigüedad)
   - Badges dinámicos según logros
   - Resolución de disputas con evidencia

6. MENSAJERÍA EN TIEMPO REAL:
   - Chat 1:1 con typing indicators y read receipts
   - Adjuntar archivos e imágenes
   - Historial persistente y búsqueda en conversaciones
   - Notificaciones push y email

ENTREGABLE FINAL:
Marketplace P2P completo tipo Fiverr/Upwork, con registro, propuestas, pagos split con Stripe Connect, sistema de reputación y mensajería en tiempo real.`,
              tags: ["marketplace", "P2P", "Stripe Connect", "escrow", "reputación", "Next.js"],
              uso: "Plataforma de servicios freelance"
            },
            {
              id: "fs_ecom_003",
              titulo: "Digital Products Platform con Licencias y Descargas Seguras",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Desarrollador especializado en plataformas de productos digitales con experiencia en generación de licencias, descargas seguras y protección de contenido.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + Stripe + S3/Cloudflare R2
- Auth: NextAuth.js + verificación de compra
- Archivos: Almacenamiento en S3 con URLs firmadas temporales
- Licencias: Generación de keys únicas con crypto
- Email: React Email + Resend para entregas
- UI: Tailwind + Shadcn UI
- Deploy: Vercel + Railway

TAREA:
Desarrolla "DigiStore", plataforma para vender productos digitales:

1. TIENDA Y CATÁLOGO:
   - Páginas de producto con previews, screenshots, demos
   - Categorías: templates, iconos, fonts, música, ebooks, cursos, software, plugins
   - Pricing: pago único, suscripción, o "paga lo que quieras"
   - Bundles y descuentos por tiempo limitado
   - Reviews y ratings de compradores verificados

2. CHECKOUT Y PAGOS:
   - Stripe Checkout + PayPal + Crypto (opcional)
   - Aplicación de cupones y descuentos
   - VAT/Tax automático por ubicación (Stripe Tax)
   - Invoice automática post-compra

3. ENTREGA DE PRODUCTOS:
   - Link de descarga único con tiempo de expiración (S3 signed URLs)
   - Límite de descargas por compra
   - Acceso a librería personal de compras (cuenta del usuario)
   - Actualizaciones: notificar a compradores de nuevas versiones
   - Email automático con instrucciones de acceso

4. SISTEMA DE LICENCIAS:
   - Generación automática de license key al comprar
   - Tipos de licencia: personal, comercial, extended
   - Validación de licencias vía API (para que vendedores verifiquen en sus apps)
   - Dashboard de gestión de licencias para vendedores

5. VENDEDOR DASHBOARD:
   - Onboarding de vendedores
   - Subida de productos con metadata, screenshots, archivos
   - Analytics: ventas, revenue, conversión, tráfico
   - Gestión de payout (Stripe Connect)
   - Mensajería con compradores

6. SEGURIDAD:
   - URLs de descarga firmadas y temporales (expiran en 24h)
   - Rate limiting en endpoints de descarga
   - Anti-abuso: detección de sharing de links
   - Watermarking opcional en archivos
   - Licencias revocables por el vendedor

ENTREGABLE FINAL:
Plataforma completa tipo Gumroad/Lemon Squeezy para vender productos digitales con licencias, descargas seguras, dashboard de analytics y payout automático.`,
              tags: ["productos digitales", "licencias", "Stripe", "S3", "descargas", "Next.js"],
              uso: "Tienda de productos digitales"
            },
            {
              id: "fs_ecom_004",
              titulo: "Booking & Reservation System con Calendario y Pagos",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Fullstack Developer especializado en sistemas de reservas y booking con experiencia en manejo de disponibilidad, calendarios y time slots.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + Stripe + Google Calendar API
- Calendario: Componente de calendario interactivo con time slots
- Pagos: Stripe para reservas con depósito o pago completo
- Notificaciones: Email (Resend) + SMS (Twilio) para recordatorios
- Auth: NextAuth.js con roles (admin, provider, customer)
- Tiempo real: Actualización de disponibilidad vía Server-Sent Events
- UI: Tailwind + Shadcn + React Day Picker
- Deploy: Vercel + Railway

TAREA:
Desarrolla "Bookly", sistema de reservas tipo Calendly:

1. PERFILES DE PROVEEDORES DE SERVICIO:
   - Registro con tipo de servicio (consultas, clases, citas, alquileres)
   - Configuración de disponibilidad: horarios recurrentes, días libres, vacaciones
   - Duración de citas customizable (30min, 1h, etc.)
   - Buffer time entre citas
   - Múltiples ubicaciones o virtual (Zoom/Google Meet integración)
   - Límite de citas por día

2. PÁGINA DE BOOKING PÚBLICA:
   - Página pública estilo Calendly con foto, bio y servicios del proveedor
   - Calendario interactivo con días disponibles resaltados
   - Selección de time slot con confirmación en 3 pasos
   - Formulario de datos del cliente (nombre, email, teléfono, notas)
   - Pago integrado si el servicio es de pago

3. GESTIÓN DE RESERVAS:
   - Dashboard del proveedor: próximas citas, pendientes, historial
   - Confirmación/cancelación/reprogramación por ambas partes
   - Sincronización bidireccional con Google Calendar
   - Recordatorios automáticos: 24h antes y 1h antes (email + SMS)
   - Notas internas del proveedor por cita
   - Estados: pending → confirmed → completed → cancelled → no-show

4. CLIENTES:
   - Portal de cliente con historial de reservas
   - Re-book fácil (repetir última cita)
   - Dejar review después de la cita
   - Gestión de métodos de pago guardados

5. ADMIN:
   - Super admin dashboard multi-proveedor
   - Comisión configurable por booking
   - Analytics: bookings/día, revenue, popularidad de servicios
   - Gestión de disputas y reembolsos

6. EMBED Y API:
   - Widget de booking embebible en cualquier sitio web
   - REST API completa para integraciones
   - Webhooks para eventos de booking
   - Zapier/Make integración

ENTREGABLE FINAL:
Sistema de booking completo tipo Calendly con calendario interactivo, gestión de disponibilidad, pagos, sincronización con Google Calendar y recordatorios automáticos.`,
              tags: ["booking", "calendario", "reservas", "Stripe", "Google Calendar", "Next.js"],
              uso: "Sistema de reservas online"
            }
          ]
        },
        {
          id: "fs_realtime",
          nombre: "Real-time & Colaboración",
          prompts: [
            {
              id: "fs_rt_001",
              titulo: "Real-time Collaborative Whiteboard (Excalidraw/FigJam Clone)",
              categoria: "Aplicación Fullstack",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Ingeniero de Software especializado en aplicaciones colaborativas en tiempo real con experiencia en CRDTs, WebSocket y canvas rendering.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + HTML5 Canvas + WebSocket (Socket.io) + Yjs (CRDT)
- Colaboración: Yjs para resolución automática de conflictos (sin bloqueos)
- Canvas: Konva.js o Fabric.js para manipulación de objetos gráficos
- Persistencia: PostgreSQL para metadata + S3 para snapshots del canvas
- Auth: NextAuth.js con invitación por link
- Cursors: Presencia en tiempo real con avatares y cursores
- UI: Tailwind + Radix UI
- Deploy: Vercel + Railway + Redis

TAREA:
Desarrolla "CollabBoard", pizarra colaborativa en tiempo real:

1. CANVAS INFINITO:
   - Canvas infinito con zoom (pinch + scroll) y pan (drag)
   - Grid de fondo con snap to grid opcional
   - Herramientas: lápiz (freehand), rectángulo, círculo, línea, flecha, texto, imagen, sticky note
   - Selección múltiple con transformaciones (mover, rotar, escalar)
   - Capas con orden z (traer al frente, enviar al fondo)
   - Undo/Redo ilimitado por usuario

2. HERRAMIENTAS DE DIBUJO:
   - Freehand drawing con suavizado de curvas
   - Shapes con estilos: fill color, stroke color, stroke width, dashed, opacidad
   - Texto con fonts, tamaños, colores, alineación
   - Sticky notes con colores personalizables
   - Conectores inteligentes entre shapes
   - Templates: diagramas, wireframes, mapas mentales, flowchart

3. COLABORACIÓN EN TIEMPO REAL (YJS):
   - Sincronización de todos los elementos vía CRDT
   - Cursores de otros usuarios con nombres y colores únicos
   - Indicador de quién está editando qué elemento
   - Sin conflictos: Yjs merge automático
   - Reconexión automática con sync de estado

4. ORGANIZACIÓN:
   - Frames/artboards para agrupar contenido
   - Librería de componentes reutilizables
   - Páginas múltiples por board
   - Navegación entre páginas
   - Exportación: PNG, SVG, PDF

5. COMENTARIOS Y DISCUSIÓN:
   - Comentarios anclados a posiciones del canvas
   - Hilos de discusión resueltos/no resueltos
   - Notificaciones de nuevos comentarios

6. HISTORIAL Y VERSIONADO:
   - Timeline de cambios con miniaturas
   - Restaurar a versiones anteriores
   - Seguimiento de quién hizo cada cambio

7. SHARING Y PERMISOS:
   - Compartir por link con permisos: view, comment, edit
   - Embed en otras páginas vía iframe
   - Exportar board completo como JSON

ENTREGABLE FINAL:
Pizarra colaborativa completa tipo Excalidraw/Miro con canvas infinito, herramientas de dibujo, colaboración en tiempo real con CRDT (Yjs), comentarios y versionado.`,
              tags: ["whiteboard", "colaboración", "CRDT", "Canvas", "WebSocket", "Next.js", "Yjs"],
              uso: "Herramienta de colaboración visual"
            },
            {
              id: "fs_rt_002",
              titulo: "Real-time Chat & Video SDK Platform (Discord/Slack Clone)",
              categoria: "Aplicación Fullstack",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Arquitecto de plataformas de comunicación en tiempo real con experiencia en WebRTC, WebSocket, y sistemas distribuidos de mensajería.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + WebSocket (Socket.io) + WebRTC + PostgreSQL + Redis
- Mensajería: Socket.io para chat en tiempo real con salas (rooms)
- Video: WebRTC con SFU (LiveKit o mediasoup) para multi-party calls
- Files: Upload con progreso + preview de imágenes/videos
- Search: Elasticsearch o Meilisearch para búsqueda full-text en mensajes
- Auth: NextAuth.js + JWT para WebSocket auth
- UI: Tailwind + Radix UI + Zustand
- Deploy: Docker + Railway + Redis

TAREA:
Desarrolla "TeamChat", plataforma de comunicación tipo Discord/Slack:

1. SERVIDORES Y CANALES:
   - Creación de servidores (workspaces) públicos o por invitación
   - Canales de texto con topic, pinned messages
   - Canales de voz/video (WebRTC)
   - Categorías para organizar canales
   - Roles y permisos granulares por canal (admin, mod, member, guest)
   - Invitación por link con expiración y límite de usos

2. CHAT EN TIEMPO REAL:
   - Mensajes con markdown, emojis, reacciones
   - Threads (hilos) para discusiones anidadas
   - Menciones @usuario y @rol con notificaciones
   - Adjuntar archivos: imágenes, videos, PDFs, código
   - Code blocks con syntax highlighting
   - Editar y eliminar mensajes (con indicador "edited")
   - Typing indicators por canal
   - Unread badges y scroll automático

3. VOZ Y VIDEO:
   - Llamadas de voz en canal con indicador de quién habla
   - Video calls multi-participante con screen sharing
   - Mute, deafen, camera on/off, push-to-talk
   - Picture-in-picture durante videollamada
   - Grabación de llamadas (opcional)

4. MENSAJERÍA DIRECTA:
   - DMs 1:1 y grupos privados
   - Friend requests y lista de amigos
   - Status: online, idle, do not disturb, invisible
   - Custom status con emoji y texto

5. NOTIFICACIONES:
   - Push notifications (web + mobile)
   - Email digest de mensajes no leídos
   - Configuración de notificaciones por canal
   - Do Not Disturb mode programable

6. BÚSQUEDA:
   - Búsqueda full-text en todos los mensajes con filtros
   - Filtros: por canal, por usuario, por fecha, tiene archivo, tiene link
   - Resultados paginados con contexto del mensaje
   - Jump to message en el canal

7. FEATURES AVANZADOS:
   - Bots y webhooks (API para integraciones)
   - Slash commands (/giphy, /poll, /remind)
   - Message bookmarks (guardados)
   - Custom emojis
   - Server insights (analytics de actividad)

ENTREGABLE FINAL:
Plataforma de comunicación completa tipo Discord/Slack con servidores, canales, chat en tiempo real, voz/video con WebRTC, threads, búsqueda y sistema de roles.`,
              tags: ["chat", "WebRTC", "WebSocket", "Discord", "Slack", "Next.js", "real-time"],
              uso: "Plataforma de comunicación de equipo"
            },
            {
              id: "fs_rt_003",
              titulo: "Project Management Tool (Notion/Jira Hybrid) con Colaboración",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Technical Lead de producto con experiencia en herramientas de productividad tipo Notion, Jira, Linear. Experto en editores de texto ricos, sistemas de base de datos flexibles y UX de productividad.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + TipTap editor + Prisma + PostgreSQL + WebSocket (Socket.io)
- Editor: TipTap con extensiones custom para @mentions, /commands, embeds
- DB: PostgreSQL con esquema flexible (EAV o JSONB para properties custom)
- Real-time: Socket.io para colaboración simultánea en documentos
- Search: PostgreSQL full-text search con tsvector
- Auth: NextAuth.js con RBAC granular
- UI: Tailwind + Radix UI + Framer Motion
- Deploy: Vercel + Railway

TAREA:
Desarrolla "TaskFlow", herramienta de gestión de proyectos y documentos:

1. WORKSPACES Y PROYECTOS:
   - Workspace con múltiples proyectos
   - Sidebar con navegación jerárquica
   - Favoritos y proyectos recientes
   - Templates de proyecto predefinidos

2. BASE DE DATOS FLEXIBLE (TIPO NOTION):
   - Vistas: tabla, kanban, calendario, galería, timeline (Gantt)
   - Propiedades custom: texto, número, select, multi-select, fecha, persona, checkbox, URL, email, teléfono, fórmula
   - Filtros avanzados con AND/OR
   - Ordenación múltiple
   - Agrupación por propiedad
   - Relaciones entre bases de datos

3. EDITOR DE PÁGINAS:
   - TipTap editor con bloques: texto, heading, lista, quote, código, imagen, tabla, callout, divider, toggle
   - /commands (slash menu) para insertar bloques
   - @mentions de usuarios y páginas
   - Drag & drop de bloques
   - Markdown shortcuts (type # for heading, - for list, etc.)
   - Colaboración en tiempo real (múltiples usuarios editando a la vez)

4. TAREAS Y PROYECTOS:
   - Issues con propiedades: asignado, prioridad, estado, sprint, estimación
   - Subtareas y dependencias
   - Sprints con fechas, burndown chart automático
   - Time tracking por tarea
   - Automatizaciones: cuando X cambia, hacer Y (similar a Jira automation)

5. COLABORACIÓN:
   - Comentarios en tareas y páginas
   - Menciones con notificaciones
   - Activity feed por workspace
   - Presencia: ver quién está online y qué está viendo

6. INTEGRACIONES:
   - GitHub/GitLab: vincular PRs a tareas
   - Slack: notificaciones de cambios
   - Figma: embed de diseños
   - Google Calendar: sincronización de deadlines

7. API Y EXTENSIBILIDAD:
   - REST API completa
   - Webhooks salientes
   - API keys con scopes granulares
   - Documentación OpenAPI

ENTREGABLE FINAL:
Herramienta de productividad completa tipo Notion + Jira con bases de datos flexibles, editor de páginas colaborativo, vistas múltiples (kanban, tabla, calendario, gantt), sprints y automatizaciones.`,
              tags: ["project management", "Notion", "Jira", "editor", "colaboración", "Next.js"],
              uso: "Herramienta de gestión de proyectos"
            },
            {
              id: "fs_rt_004",
              titulo: "Real-time Document Editor with Version Control (Google Docs Clone)",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero especializado en procesamiento de texto colaborativo, CRDT/OT, y editores de documentos en tiempo real con experiencia en Google Docs, Notion o similar.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + TipTap/ProseMirror + Yjs (CRDT) + WebSocket + PostgreSQL
- Colaboración: Yjs + y-websocket para sincronización en tiempo real
- Editor: TipTap (ProseMirror) con extensiones completas
- Versiones: Historial de cambios con diff visual
- Export: PDF, DOCX, Markdown, HTML
- Auth: NextAuth.js + permisos (owner, editor, commenter, viewer)
- UI: Tailwind + Radix UI
- Deploy: Vercel + Railway

TAREA:
Desarrolla "DocCollab", editor de documentos colaborativo:

1. EDITOR DE DOCUMENTOS:
   - Editor rico con: texto, headings, bold, italic, underline, strikethrough, code
   - Listas: bullet, numbered, checklist
   - Tablas insertables y editables
   - Imágenes con resize y alineación
   - Links, code blocks, blockquotes, horizontal rules
   - Tablas de contenido automáticas
   - Page breaks y headers/footers

2. COLABORACIÓN EN TIEMPO REAL:
   - Edición simultánea sin冲突 vía CRDT (Yjs)
   - Cursores de otros usuarios con nombres en colores
   - Selecciones de texto de otros usuarios visibles
   - Indicador de quién está escribiendo en cada párrafo
   - Sin bloqueos de edición

3. COMENTARIOS Y SUGERENCIAS:
   - Comentarios anclados a texto específico
   - Hilos de discusión en comentarios con resolución
   - Modo sugerencias (track changes) con diff visual
   - Aceptar/rechazar cambios individuales o todos

4. HISTORIAL DE VERSIONES:
   - Guardado automático cada 30 segundos
   - Timeline de versiones con miniaturas
   - Vista de diff entre versiones (resaltando cambios)
   - Restaurar a cualquier versión anterior
   - Named versions (milestones) manuales

5. ORGANIZACIÓN DE DOCUMENTOS:
   - Estructura de carpetas jerárquica
   - Favoritos y documentos recientes
   - Templates reutilizables
   - Búsqueda full-text en todos los documentos
   - Compartir: link público, usuarios específicos, equipos

6. EXPORTACIÓN E IMPORTACIÓN:
   - Export: PDF (con estilos), DOCX, Markdown, HTML, Plain Text
   - Import: DOCX, Markdown, HTML, TXT
   - Print con vista previa y opciones
   - Copiar como Markdown/HTML

7. OFFLINE SUPPORT:
   - Service Worker + IndexedDB para edición offline
   - Sync cuando se recupera conexión
   - Indicador de estado offline/online

ENTREGABLE FINAL:
Editor de documentos colaborativo completo tipo Google Docs con edición en tiempo real vía CRDT, comentarios, sugerencias, historial de versiones, carpetas y exportación multi-formato.`,
              tags: ["document editor", "CRDT", "Yjs", "Google Docs", "colaboración", "Next.js"],
              uso: "Suite de documentos colaborativa"
            }
          ]
        },
        {
          id: "fs_fintech",
          nombre: "Fintech & Datos",
          prompts: [
            {
              id: "fs_fin_001",
              titulo: "Personal Finance Dashboard con Open Banking y AI Advisor",
              categoria: "Aplicación Fullstack",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Desarrollador Fintech Senior con conocimiento de APIs bancarias (Plaid, Teller), agregación de datos financieros, y visualización de datos financieros personales.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + OpenAI + Plaid API + Chart.js
- Banking: Plaid API para conexión de cuentas bancarias (US/EU) o Teller
- AI: OpenAI GPT-4o para insights financieros y presupuesto inteligente
- Charts: Recharts + Tremor para visualizaciones financieras
- Auth: NextAuth.js con MFA (2FA)
- Seguridad: Cifrado de datos sensibles, nunca almacenar credenciales bancarias
- UI: Tailwind + Radix UI
- Deploy: Vercel + Railway

TAREA:
Desarrolla "WealthPilot", dashboard de finanzas personales:

1. CONEXIÓN DE CUENTAS:
   - Integración con Plaid/Teller para conectar bancos
   - Sincronización automática de transacciones (diaria)
   - Múltiples cuentas: checking, savings, credit cards, investments, loans
   - Soporte para cuenta manual (sin API bancaria)

2. DASHBOARD PRINCIPAL:
   - Net worth en tiempo real (activos - pasivos)
   - Gráfico de evolución de patrimonio (6m, 1a, 5a)
   - Distribución de gastos por categoría (pie chart)
   - Ingresos vs gastos mensuales (bar chart)
   - Top transacciones recientes
   - Alertas: gastos inusuales, suscripciones no usadas, sobregiro

3. CATEGORIZACIÓN INTELIGENTE:
   - Auto-categorización con AI de transacciones
   - Reglas personalizables (ej: todo de Amazon → Compras)
   - Split de transacciones (una compra en múltiples categorías)
   - Subcategorías con jerarquía

4. PRESUPUESTO Y METAS:
   - Creación de presupuestos por categoría (mensual/anual)
   - Seguimiento visual con barras de progreso
   - Alertas cuando se acerca al límite (80%, 100%, 110%)
   - Metas de ahorro con tracking y fecha estimada
   - Simulaciones: "si ahorro X más, alcanzo mi meta Y meses antes"

5. AI FINANCIAL ADVISOR:
   - Chat con AI que analiza tus finanzas
   - Recomendaciones personalizadas basadas en patrones de gasto
   - Identificación de fugas de dinero y oportunidades de ahorro
   - Proyecciones financieras a 1, 5, 10 años
   - Explicación en lenguaje simple de tendencias

6. REPORTES:
   - Reporte mensual automático (email PDF)
   - Análisis año contra año
   - Proyección de impuestos estimados
   - Exportación de datos a CSV/Excel
   - Reporte personalizado por período

7. SEGURIDAD Y PRIVACIDAD:
   - Datos bancarios nunca almacenados (solo Plaid access tokens)
   - Cifrado AES-256 para datos sensibles en DB
   - 2FA obligatorio
   - Sesión expira tras inactividad
   - Audit log de accesos

ENTREGABLE FINAL:
Dashboard financiero completo tipo Mint/Copilot con conexión bancaria vía Plaid, categorización AI, presupuestos, metas de ahorro, AI advisor y reportes mensuales automáticos.`,
              tags: ["fintech", "finanzas", "Plaid", "AI", "dashboard", "Next.js", "OpenAI"],
              uso: "App de finanzas personales"
            },
            {
              id: "fs_fin_002",
              titulo: "Real-time Stock & Crypto Trading Dashboard con WebSocket",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Desarrollador especializado en aplicaciones de trading y datos de mercado en tiempo real. Experto en WebSocket, visualización de datos financieros, y APIs de mercado.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + WebSocket + PostgreSQL + Redis + Lightweight Charts
- Datos: WebSocket a APIs de mercado (Binance, Yahoo Finance, Alpha Vantage, CoinGecko)
- Charts: TradingView Lightweight Charts para gráficos de velas
- Cache: Redis para datos en tiempo real con TTL corto
- Alertas: Sistema de alertas de precio con notificaciones push
- Auth: NextAuth.js con opción de guest mode
- UI: Tailwind + Radix UI + Framer Motion
- Deploy: Vercel + Railway + Redis

TAREA:
Desarrolla "MarketPulse", dashboard de trading y seguimiento de mercados:

1. WATCHLISTS:
   - Crear múltiples watchlists personalizadas
   - Agregar/quitar símbolos con búsqueda instantánea
   - Precios en tiempo real vía WebSocket
   - Indicadores: precio, cambio %, volumen, market cap
   - Mini sparkline chart en cada fila
   - Drag & drop para reordenar
   - Alertas de precio configurables

2. GRÁFICOS INTERACTIVOS:
   - Lightweight Charts con velas japonesas
   - Timeframes: 1m, 5m, 15m, 1h, 4h, 1d, 1w, 1M
   - Indicadores técnicos: SMA, EMA, RSI, MACD, Bollinger Bands, Volume
   - Herramientas de dibujo: trendlines, soporte/resistencia, Fibonacci
   - Comparación multi-activo en un gráfico
   - Fullscreen mode

3. PORTFOLIO TRACKER:
   - Agregar posiciones manualmente o vía API de exchange
   - Dashboard de portfolio: valor total, P&L diario/total, allocation %
   - Gráfico de evolución del portfolio
   - Desglose por activo
   - Exportar historial de transacciones

4. SCREENER DE MERCADO:
   - Filtros: sector, market cap, volumen, precio, cambio %
   - Resultados en tabla sortable con datos en tiempo real
   - Criterios predefinidos: top gainers, top losers, más activos, breakouts
   - Guardar screeners personalizados

5. NOTICIAS Y SENTIMIENTO:
   - Feed de noticias financieras en tiempo real
   - Análisis de sentimiento de noticias (AI)
   - Eventos del calendario económico
   - Earnings calendar

6. ALERTAS Y NOTIFICACIONES:
   - Alertas de precio: por encima/debajo de X, cambio % diario
   - Notificaciones push (web + email)
   - Historial de alertas disparadas
   - Configuración de sonidos para alertas

ENTREGABLE FINAL:
Dashboard de trading y mercados completo con datos en tiempo real vía WebSocket, gráficos de velas con indicadores técnicos, watchlists, portfolio tracker y alertas de precio.`,
              tags: ["trading", "stocks", "crypto", "WebSocket", "charts", "Next.js", "Redis"],
              uso: "Dashboard de inversiones"
            },
            {
              id: "fs_fin_003",
              titulo: "Invoice & Expense Management Platform para Empresas",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Desarrollador Fullstack especializado en software de facturación y gestión de gastos empresariales con conocimiento de normativas fiscales y generación de PDF.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + Stripe Invoicing + Puppeteer
- PDF: React-PDF o Puppeteer para generación de facturas profesionales
- OCR: Tesseract.js o API de OCR para escaneo de recibos
- Email: React Email + Resend para envío de facturas
- Multi-tenant: Separación por organización con RLS
- Auth: NextAuth.js + invitación por email
- UI: Tailwind + Shadcn UI + Recharts
- Deploy: Vercel + Railway + Redis

TAREA:
Desarrolla "BillFlow", plataforma de facturación y gastos:

1. FACTURACIÓN:
   - Crear facturas con editor visual (drag & drop de items)
   - Templates personalizables con logo de empresa
   - Numeración automática secuencial
   - Múltiples monedas y tipos de cambio
   - Impuestos configurables (IVA, GST, VAT, etc.)
   - Descuentos por línea o globales
   - Notas y términos personalizables
   - Envío por email directo al cliente

2. GESTIÓN DE CLIENTES:
   - Base de datos de clientes con info de facturación
   - Historial de facturas por cliente
   - Recordatorios de pago automáticos
   - Estados de cliente: active, overdue, inactive

3. GASTOS:
   - Registro de gastos con foto de recibo
   - OCR automático para extraer datos del recibo
   - Categorización de gastos
   - Aprobación de gastos por supervisor
   - Reembolso tracking

4. DASHBOARD FINANCIERO:
   - Revenue mensual/anual (gráfico de barras)
   - Facturas pendientes de cobro (AR aging)
   - Gastos por categoría
   - Cash flow projection
   - Margen de ganancia
   - Quick stats: total invoiced, total collected, outstanding, expenses

5. PAGOS:
   - Integración con Stripe para pagos online (botón "Pagar ahora" en factura)
   - Múltiples métodos de pago: tarjeta, transferencia, PayPal
   - Conciliación automática de pagos recibidos
   - Recordatorios automáticos de facturas vencidas

6. REPORTES:
   - Reportes fiscales: IVA, retenciones, declaraciones
   - Reportes de ventas por cliente, período, producto
   - Reportes de gastos por categoría, empleado
   - Exportación a Excel/PDF
   - Reportes programados por email

7. MULTI-USUARIO:
   - Roles: admin, accountant, employee
   - Permisos granulares por módulo
   - Audit log de todas las acciones

ENTREGABLE FINAL:
Plataforma de facturación y gastos empresarial completa con editor de facturas, OCR de recibos, dashboard financiero, pagos integrados y reportes fiscales.`,
              tags: ["invoicing", "expenses", "facturación", "OCR", "Stripe", "Next.js", "Prisma"],
              uso: "Software de facturación empresarial"
            }
          ]
        },
        {
          id: "fs_devtools",
          nombre: "Developer Tools & APIs",
          prompts: [
            {
              id: "fs_dev_001",
              titulo: "API Gateway & Developer Portal con Rate Limiting y Analytics",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Platform Engineer Senior especializado en API gateways, developer experience y plataformas de API.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Node.js (Express/Fastify) + PostgreSQL + Redis + Kong/Tyk (opcional)
- API Gateway: Rate limiting, autenticación, logging, caching con Redis
- Auth: API keys, JWT, OAuth 2.0
- Rate Limiting: Token bucket o sliding window con Redis
- Docs: OpenAPI/Swagger UI + Redoc o Scalar
- Analytics: Métricas de uso de API, latencia, errores
- UI: Tailwind + Shadcn UI + Recharts
- Deploy: Docker + Railway

TAREA:
Desarrolla "APIHub", gateway y portal de desarrolladores:

1. DEVELOPER PORTAL:
   - Landing page pública con documentación de APIs
   - Registro de desarrolladores con verificación de email
   - Creación de aplicaciones (apps) para obtener API keys
   - Dashboard del desarrollador: uso, quotas, billing
   - Referencia de API interactiva (Swagger + "Try it now")
   - SDK downloads (TypeScript, Python, etc.)
   - Changelog y versionado de API

2. API GATEWAY:
   - Proxy inverso con rate limiting por API key
   - Rate limits configurables: por segundo, minuto, hora, día
   - Caching de responses con Redis y TTL por endpoint
   - Autenticación: API key en header o query param
   - Logging de todas las requests con metadata
   - Transformación de requests/responses
   - IP whitelisting/blacklisting

3. API KEY MANAGEMENT:
   - Generación de API keys con prefijo identificable
   - Scopes y permisos granulares por key
   - Rotación de keys sin downtime
   - Revocación inmediata
   - Múltiples keys por aplicación (dev, staging, prod)
   - Alertas de keys comprometidas

4. ANALYTICS:
   - Dashboard con: requests totales, latencia p50/p95/p99, errores 4xx/5xx
   - Gráficos de uso por endpoint, por app, por día
   - Top consumers y endpoints más populares
   - Alertas: rate limit exceeded, error rate spike, latency spike
   - Exportación de logs

5. MONETIZACIÓN:
   - Plans: Free (1K req/mes), Starter ($49 - 50K req/mes), Pro ($199 - 250K req/mes), Enterprise
   - Stripe Billing integrado con upgrades/downgrades
   - Hard limits: 429 cuando excede el plan
   - Invoice automática

6. MONITOREO:
   - Health checks automáticos
   - Alertas de downtime
   - Dashboard de uptime (30d, 90d)
   - Status page pública

ENTREGABLE FINAL:
API Gateway y Developer Portal completo con rate limiting, gestión de API keys, analytics, documentación interactiva, monetización y monitoreo.`,
              tags: ["API Gateway", "developer portal", "rate limiting", "OpenAPI", "Redis", "Next.js"],
              uso: "Plataforma de APIs"
            },
            {
              id: "fs_dev_002",
              titulo: "Fullstack CI/CD Dashboard & Deployment Manager",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: DevOps Platform Engineer con experiencia en construcción de herramientas de CI/CD, dashboards de deployment y sistemas de integración continua.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + Docker API + GitHub/GitLab API
- Integración: GitHub API, GitLab API, Bitbucket API para repos y webhooks
- Docker: Dockerode para gestionar containers localmente
- Jobs: BullMQ + Redis para ejecución de pipelines
- Real-time: WebSocket (Socket.io) para logs en streaming
- Auth: NextAuth.js con GitHub/GitLab OAuth
- UI: Tailwind + Shadcn + Recharts + Terminal UI (xterm.js)
- Deploy: Railway + Redis

TAREA:
Desarrolla "DeployDash", panel de CI/CD y gestión de deployments:

1. CONEXIÓN DE REPOSITORIOS:
   - OAuth con GitHub, GitLab, Bitbucket
   - Listar repositorios del usuario
   - Configurar webhooks automáticamente
   - Detectar tipo de proyecto (Node, Python, Docker, etc.)

2. PIPELINES:
   - Editor visual de pipeline (YAML o UI drag & drop)
   - Stages: build, test, lint, deploy
   - Ejecución paralela y secuencial
   - Environment variables por stage y ambiente
   - Secrets management (encriptados en DB)
   - Cache de dependencias entre builds

3. BUILD LOGS EN TIEMPO REAL:
   - Streaming de logs vía WebSocket
   - Terminal UI con xterm.js
   - Coloreado de output (ANSI colors)
   - Timestamps por línea
   - Search en logs
   - Download de logs completos

4. DEPLOYMENTS:
   - Targets: Vercel, Railway, Docker, Linux server (SSH), AWS ECS
   - Deployment strategies: rolling, blue-green, canary
   - Rollback automático si health check falla
   - Historial de deployments con diff de cambios
   - Preview deployments para PRs
   - Custom domains y SSL automático

5. DASHBOARD:
   - Estado actual de todos los proyectos (passing/failing/deploying)
   - Pipeline run history con status y duración
   - Deployment frequency y lead time (DORA metrics)
   - Change failure rate
   - Mean time to recovery (MTTR)

6. NOTIFICACIONES:
   - Slack, Discord, Email, MS Teams
   - Configurables por evento: build failed, deploy started, deploy succeeded
   - Mention de responsables

7. COLLABORATION:
   - Equipos con roles (owner, admin, developer, viewer)
   - Compartir proyectos
   - Approval gates para deploy a producción

ENTREGABLE FINAL:
Dashboard de CI/CD completo similar a Vercel/Netlify con pipelines configurables, logs en tiempo real, deployments multi-target, métricas DORA y notificaciones.`,
              tags: ["CI/CD", "DevOps", "pipelines", "deployment", "Docker", "GitHub", "Next.js"],
              uso: "Plataforma de despliegue continuo"
            },
            {
              id: "fs_dev_003",
              titulo: "Sistema de Feature Flags y Experimentación (A/B Testing)",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero de Plataforma especializado en feature flags, experimentación y release management. Experiencia con sistemas como LaunchDarkly, Split.io o GrowthBook.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + Redis + Edge Config
- Edge: Vercel Edge Config o Cloudflare Workers para evaluación ultra-rápida
- SDK: Cliente TypeScript para integración en apps
- API: REST para gestión + Edge endpoints para evaluación
- Auth: NextAuth.js con RBAC
- UI: Tailwind + Shadcn + Recharts
- Deploy: Vercel + Railway + Redis

TAREA:
Desarrolla "FlagShip", plataforma de feature flags y A/B testing:

1. GESTIÓN DE FEATURE FLAGS:
   - Crear flags: boolean, percentage rollout, targeted (user attributes)
   - Targeting rules: country, email domain, user ID, custom attributes
   - Rollout gradual: 0% → 10% → 50% → 100%
   - Scheduling: activar/desactivar flags en fecha futura
   - Dependencies: flag A requiere flag B activo
   - Entornos: development, staging, production
   - Historial de cambios con auditoría

2. EVALUACIÓN DE FLAGS:
   - Edge evaluation < 1ms (Vercel Edge Config)
   - SDK TypeScript con tipado estricto
   - Caching local con polling/push updates
   - Fallback values si el servicio no responde
   - Evaluación client-side y server-side
   - Soporte para React hooks (useFlag)

3. A/B TESTING:
   - Crear experimentos con variantes (A/B/C/...)
   - Distribución de tráfico configurable
   - Métricas objetivo: conversión, clicks, revenue
   - Tracking de eventos con SDK
   - Cálculo estadístico: significancia, intervalo de confianza
   - Recomendación de ganador automática
   - Bayesian vs Frequentist methodology

4. DASHBOARD DE EXPERIMENTOS:
   - Vista de todos los experimentos activos
   - Métricas en tiempo real por variante
   - Gráficos de uplift
   - Segmentación de resultados
   - Exportación de datos para análisis externo

5. SDK Y API:
   - TypeScript SDK completo
   - React integration (provider + hooks)
   - Next.js middleware integration
   - REST API para gestión programática
   - Webhooks para cambios de flag
   - Ejemplos de integración (Next.js, Express, React, Node)

6. SEGURIDAD Y RBAC:
   - Roles: admin, engineer, viewer
   - Audit log de quién cambió qué
   - Approval requerido para flags de producción
   - Branch-level permissions

ENTREGABLE FINAL:
Plataforma de feature flags y A/B testing completa tipo LaunchDarkly con edge evaluation < 1ms, targeting rules, rollout gradual, experimentos con análisis estadístico y SDK TypeScript.`,
              tags: ["feature flags", "A/B testing", "edge", "experimentación", "TypeScript", "Next.js"],
              uso: "Plataforma de release management"
            }
          ]
        },
        {
          id: "fs_ai_agents",
          nombre: "AI Agents & Automatización",
          prompts: [
            {
              id: "fs_ai_001",
              titulo: "AI-Powered Code Review Assistant con GitHub Integration",
              categoria: "Aplicación Fullstack",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Senior Developer Advocate y ML Engineer especializado en herramientas de desarrollo asistidas por AI, análisis estático de código y automatización de code review.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + GitHub API + OpenAI + Anthropic
- AI: GPT-4o + Claude Sonnet para análisis de código multi-modelo
- GitHub: GitHub App con OAuth y webhooks
- Análisis: AST parsing con TypeScript compiler API + tree-sitter
- Jobs: BullMQ + Redis para procesamiento asíncrono de PRs
- Auth: NextAuth.js con GitHub OAuth
- UI: Tailwind + Shadcn + Monaco Editor (VS Code)
- Deploy: Vercel + Railway + Redis

TAREA:
Desarrolla "CodeWing", AI code review assistant:

1. INSTALACIÓN COMO GITHUB APP:
   - OAuth flow para instalar en repos/organizaciones
   - Configuración de repos a monitorear
   - Webhook listener para eventos de PR
   - Análisis automático al abrir/actualizar PR

2. ANÁLISIS DE PULL REQUESTS:
   - AI revisa diff del PR completo
   - Categorías de revisión:
     * Bugs y lógica incorrecta
     * Vulnerabilidades de seguridad (OWASP Top 10)
     * Problemas de performance
     * Código no idiomático (best practices)
     * Estilo y convenciones
     * Tests faltantes o insuficientes
     * Documentación necesaria
   - Severidad: blocker, major, minor, info, praise
   - Sugerencia de fix con código (suggestion block)
   - Comentario inline en el PR vía GitHub API

3. DASHBOARD DE REVISIÓN:
   - Historial de PRs revisados con estadísticas
   - Issues encontrados agrupados por tipo y severidad
   - Tendencias: ¿está mejorando el código del equipo?
   - Tiempo de revisión AI vs humano
   - Cobertura de archivos revisados
   - Métricas por desarrollador

4. CHAT CON EL CÓDIGO:
   - Seleccionar archivo(s) y preguntar sobre ellos
   - "Explica este código"
   - "¿Cómo puedo mejorar esta función?"
   - "Encuentra posibles bugs en este archivo"
   - "Genera tests unitarios para esta clase"
   - Conversación contextual con historial

5. REGLAS CUSTOM:
   - Definir reglas de revisión específicas del equipo
   - Patrones de código a detectar/rechazar
   - Librerías deprecadas a evitar
   - Arquitectura patterns a seguir
   - .codewing.yml en el repo con configuración

6. CI/CD INTEGRATION:
   - Status check en PR: pasa/falla revisión AI
   - Bloquear merge si hay issues blockers
   - Comentario resumen automático en PR
   - Label automático: "ai-reviewed", "needs-work", "looks-good"

7. IDE INTEGRATION (VS CODE EXTENSION):
   - Mismo análisis en tiempo real mientras escribes código
   - Sugerencias inline en el editor
   - Panel lateral con issues encontrados

ENTREGABLE FINAL:
Plataforma de AI code review completa tipo CodeRabbit con análisis automático de PRs, detección de bugs y vulnerabilidades, sugerencias inline, dashboard de métricas y chat con el código.`,
              tags: ["code review", "AI", "GitHub", "OpenAI", "Claude", "PR", "TypeScript"],
              uso: "Automatización de code review"
            },
            {
              id: "fs_ai_002",
              titulo: "AI Content Studio: Generación de Blog, SEO y Redes Sociales",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Desarrollador Fullstack especializado en herramientas de content marketing AI-powered. Experiencia con OpenAI, generación de imágenes AI y plataformas de publicación.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + OpenAI + Replicate/Stable Diffusion
- AI: GPT-4o para texto + DALL-E 3/Stable Diffusion para imágenes
- Editor: TipTap con AI inline completions
- SEO: Análisis de keywords, readability scoring, SERP preview
- Pub: Integración con WordPress, Webflow, Shopify, Medium APIs
- Auth: NextAuth.js + multi-usuario con equipos
- UI: Tailwind + Shadcn + Framer Motion
- Deploy: Vercel + Railway + Redis

TAREA:
Desarrolla "ContentForge", AI content studio completo:

1. AI WRITING ASSISTANT:
   - Editor de documentos con AI inline (similar a Notion AI)
   - Comandos AI: /write, /rewrite, /expand, /summarize, /translate, /tone
   - Tones: professional, casual, persuasive, humorous, academic, technical
   - Long-form content generation con estructura
   - Title generator con variantes optimizadas para SEO

2. BLOG POST GENERATOR:
   - Briefing: topic, keywords, audience, tone, length, format
   - Outline generation (estructura del artículo)
   - Section-by-section writing con aprobación
   - Tabla de contenidos automática
   - Internal/external linking suggestions
   - Meta description y title tag optimization

3. SEO TOOLKIT:
   - Keyword research y análisis de competencia
   - Content scoring (readability, keyword density, structure)
   - SERP preview (cómo se verá en Google)
   - SEO checklist pre-publicación
   - Schema markup generator
   - Content gap analysis

4. SOCIAL MEDIA CONTENT:
   - Generar posts para: Twitter/X, LinkedIn, Instagram, Facebook
   - Adaptar blog post a posts sociales automáticamente
   - Threads de Twitter generados desde un topic
   - Hashtag suggestions basadas en tendencias
   - Best time to post prediction

5. IMAGE GENERATION:
   - AI image generation con DALL-E 3/Stable Diffusion
   - Estilos: fotorealista, ilustración, minimalista, 3D, pixel art
   - Image-to-text alt text generation
   - Editor de imágenes básico (crop, resize, filters)
   - Brand kit con colores y fonts

6. COLLABORATION:
   - Workspaces para equipos de marketing
   - Roles: admin, editor, writer, reviewer
   - Review workflow: draft → review → approved → published
   - Comentarios en documentos
   - Content calendar editorial

7. ANALYTICS:
   - Contenido generado por tipo, mes, usuario
   - AI usage metrics (tokens, cost)
   - Performance de contenido publicado (si se integra analytics)
   - ROI calculator

ENTREGABLE FINAL:
AI Content Studio completo tipo Jasper/Jarvis con editor AI inline, generación de blog posts, SEO toolkit, social media content generation, AI image generation y workflow editorial.`,
              tags: ["content", "AI", "SEO", "blog", "OpenAI", "Stable Diffusion", "Next.js"],
              uso: "Suite de content marketing AI"
            },
            {
              id: "fs_ai_003",
              titulo: "AI-Powered Form Builder con Análisis de Respuestas",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Desarrollador Fullstack especializado en herramientas de formularios, encuestas y análisis de datos. Experiencia con Typeform, Google Forms y herramientas de survey.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + OpenAI + Redis
- Builder: Drag & drop form builder con tipos de campo flexibles
- AI: OpenAI para análisis de respuestas, generación de preguntas, detección de patrones
- Lógica: Skip logic, conditional branching, calcular scores
- Charts: Recharts + Tremor para visualización de resultados
- Auth: NextAuth.js + form sharing público
- UI: Tailwind + Shadcn + DnD Kit
- Deploy: Vercel + Railway

TAREA:
Desarrolla "SurveyMind", form builder AI-powered:

1. FORM BUILDER DRAG & DROP:
   - Tipos de campo: texto corto, texto largo, email, número, teléfono, fecha, dropdown, multiple choice, checkbox, rating, escala Likert, file upload, matriz, ranking, NPS, signature
   - Drag & drop para reordenar preguntas
   - Secciones y páginas (multi-step forms)
   - Validación por campo: required, min/max, pattern, custom
   - Themes: colores, fonts, logo, background

2. AI FORM GENERATOR:
   - "Describe qué quieres medir y te genero el formulario"
   - Ejemplo: "Encuesta de satisfacción de empleados" → genera 15 preguntas relevantes
   - Sugiere tipos de pregunta óptimos
   - Ajusta tono y lenguaje según audiencia
   - Traducción automática a múltiples idiomas

3. LÓGICA CONDICIONAL:
   - Skip logic: si respuesta A → saltar a sección X
   - Conditional branching: mostrar/ocultar preguntas según respuestas previas
   - Score calculation: asignar puntos a respuestas y calcular total
   - Quizzes con resultado personalizado según score

4. DISTRIBUCIÓN Y RECOLECCIÓN:
   - Link público compartible
   - Embed como iframe o widget
   - QR code para acceso rápido
   - Email invitations con tracking
   - Password protection
   - Fechas de apertura/cierre
   - Límite de respuestas

5. ANÁLISIS DE RESPUESTAS:
   - Summary visual automático (gráficos por pregunta)
   - AI analysis: tendencias, insights, anomalías
   - Cross-tabulation (cruzar 2 preguntas)
   - Sentiment analysis en respuestas de texto libre
   - Word cloud de respuestas abiertas
   - Exportación a CSV, Excel, PDF
   - Reportes automáticos con conclusiones AI

6. INTEGRACIONES:
   - Webhooks en cada nueva respuesta
   - Zapier/Make integration
   - Google Sheets sync automático
   - Slack notifications
   - Email alerts para respuestas específicas
   - API REST completa

ENTREGABLE FINAL:
Form builder AI-powered completo tipo Typeform con drag & drop, AI generador de formularios, lógica condicional, distribución multi-canal y análisis AI de respuestas con reportes automáticos.`,
              tags: ["forms", "surveys", "AI", "form builder", "Typeform", "Next.js", "analytics"],
              uso: "Plataforma de encuestas inteligentes"
            }
          ]
        },
        {
          id: "fs_web3",
          nombre: "Web3 & Blockchain",
          prompts: [
            {
              id: "fs_w3_001",
              titulo: "DApp Fullstack con Smart Contracts, Wallet Connect y NFT Marketplace",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Blockchain Developer Senior con experiencia en Solidity, Web3.js/ethers.js, y DApp development. Experto en ERC standards, seguridad de smart contracts y UX de Web3.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Solidity + Hardhat + ethers.js v6 + Wagmi + PostgreSQL
- Blockchain: Ethereum/Sepolia, Polygon/Mumbai (testnets) o L2 (Base, Arbitrum)
- Smart Contracts: ERC-721 (NFT), ERC-1155 (Multi-token), Marketplace, ERC-20 (opcional)
- Wallet: WalletConnect v3, RainbowKit para conexión de wallets
- Storage: IPFS (Pinata/Web3.Storage) para metadata NFT
- Indexing: The Graph o ponder.sh para consultas on-chain
- Auth: Wallet-based auth (Sign-In with Ethereum)
- UI: Tailwind + Shadcn + Framer Motion
- Deploy: Vercel (frontend) + Railway (backend) + Hardhat (contracts)

TAREA:
Desarrolla "ChainMarket", NFT marketplace completo:

1. SMART CONTRACTS (SOLIDITY):
   - NFT Collection factory (ERC-721 con royalties EIP-2981)
   - Marketplace contract: list, buy, cancel, accept offer, auction
   - Royalties automáticos en cada venta secundaria
   - Tests con Hardhat + Chai (100% coverage)
   - Deploy scripts para Sepolia/Base testnet
   - Verificación en Etherscan automática
   - NatSpec documentation

2. WALLET INTEGRATION:
   - RainbowKit con soporte: MetaMask, WalletConnect, Coinbase Wallet, Rainbow
   - Sign-In with Ethereum (SIWE) para auth sin contraseñas
   - Switch network automático
   - Balance de ETH/MATIC y estimación de gas
   - Transacciones con notificaciones toast

3. EXPLORE Y DISCOVER:
   - Grid de NFTs con lazy loading infinito
   - Filtros: por colección, precio, rareza, chain, estado (buy now/auction)
   - Búsqueda por nombre, colección, token ID
   - Trending collections (por volumen)
   - Activity feed on-chain en tiempo real

4. PÁGINA DE NFT:
   - Imagen/Video/Animación con preview
   - Metadata: creator, owner, collection, token ID, blockchain
   - Price history chart (últimas ventas)
   - Offer history
   - Traits y rareza
   - Botones: Buy Now, Make Offer, List for Sale

5. CREAR Y MINTEAR:
   - Create collection: nombre, símbolo, descripción, imagen, royalties %
   - Mint NFT: upload a IPFS (imagen/metadata), nombre, descripción, traits
   - Batch mint para múltiples NFTs
   - Lazy minting (gasless hasta la primera venta)
   - Preview en tiempo real

6. PERFIL DE USUARIO:
   - Owned NFTs gallery
   - Created collections
   - Activity history (compras, ventas, ofertas)
   - Favoritos/bookmarks
   - Notifications de ofertas recibidas, ventas, etc.

7. AUCTIONS Y OFERTAS:
   - Timed auctions con precio de reserva
   - Bids incrementales automáticos
   - Countdown timer en tiempo real
   - Make Offer: ofrecer precio por cualquier NFT
   - Aceptar/rechazar ofertas

ENTREGABLE FINAL:
NFT Marketplace DApp completo con smart contracts auditables, wallet connect, explore/discover, minting, auctions, perfil de usuario y UX de primera clase.`,
              tags: ["Web3", "NFT", "Solidity", "blockchain", "Ethereum", "Next.js", "IPFS"],
              uso: "Marketplace NFT descentralizado"
            },
            {
              id: "fs_w3_002",
              titulo: "DeFi Dashboard con Yield Aggregator y Portfolio Tracker",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: DeFi Developer con experiencia en protocolos DeFi (Uniswap, Aave, Compound, Lido), agregación de datos on-chain y gestión de portfolios crypto.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + ethers.js v6 + Wagmi + PostgreSQL + Redis
- Datos: Subgraph (The Graph) + RPC providers (Alchemy/Infura) + DeFiLlama API
- Price Feeds: Chainlink + CoinGecko API
- Wallet: RainbowKit + WalletConnect v3
- Charts: Lightweight Charts + Recharts para APY historical
- Auth: SIWE (Sign-In with Ethereum)
- UI: Tailwind + Shadcn + Framer Motion
- Deploy: Vercel + Railway

TAREA:
Desarrolla "YieldHub", DeFi dashboard y agregador:

1. PORTFOLIO TRACKER:
   - Conectar wallet para ver balances en tiempo real
   - Tokens en wallet con precios USD
   - Valor total del portfolio con gráfico histórico
   - Breakdown por chain (Ethereum, Polygon, Arbitrum, Base, Optimism)
   - Transacciones recientes
   - P&L calculado

2. YIELD OPPORTUNITIES:
   - Ranking de pools por APY (stablecoins, ETH, BTC)
   - Filtros: chain, protocol, TVL, risk level, APY range
   - Detalle de pool: APY historical chart, TVL chart, risk score
   - Smart routing: mejor ruta para depositar (considerando gas + APY)
   - Calculadora de rendimiento: "si deposito X, gano Y en Z días"

3. PROTOCOL INTEGRATIONS:
   - Lending: Aave v3, Compound v3
   - DEX: Uniswap v3, Curve, Balancer
   - Staking: Lido, Rocket Pool
   - Vaults: Yearn, Beefy
   - Mostrar posición actual en cada protocolo (si tiene)
   - Simulación de depósito/retiro

4. RISK ANALYSIS:
   - Risk score por protocolo (audit status, TVL, age, exploits history)
   - Impermanent loss calculator para LPs
   - Health factor para posiciones de lending
   - Alertas: health factor bajo, APY cambió significativamente

5. SAVINGS GOALS:
   - Setear goal de ahorro en crypto (ej: "ahorrar 10 ETH")
   - Tracking de progreso
   - Sugerencia de estrategia para alcanzar meta más rápido
   - Projections a 6m, 1a, 5a

6. NEWS & SENTIMENT:
   - Crypto news aggregator
   - Governance proposals alerts (protocolos que usas)
   - Whale tracking: grandes movimientos de tokens
   - Gas tracker (mejores momentos para transaccionar)

ENTREGABLE FINAL:
DeFi dashboard completo con portfolio tracker multi-chain, yield aggregator con smart routing, análisis de riesgo, calculadora de impermanent loss y alertas personalizadas.`,
              tags: ["DeFi", "yield", "portfolio", "Web3", "blockchain", "Next.js", "Ethereum"],
              uso: "Dashboard DeFi personal"
            }
          ]
        },
        {
          id: "fs_mobile",
          nombre: "Mobile-First & PWA",
          prompts: [
            {
              id: "fs_mob_001",
              titulo: "PWA de Delivery/Restaurante con Pedidos en Tiempo Real",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Fullstack Mobile Developer con experiencia en PWAs de alto rendimiento, aplicaciones de delivery y sistemas de pedidos en tiempo real.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + WebSocket + PWA (Workbox)
- PWA: Service Worker con Workbox para cache y offline
- Tiempo real: Socket.io para tracking de pedidos
- Mapas: Leaflet.js o Google Maps para tracking de delivery
- Notificaciones: Push API + Web Notifications
- Pagos: Stripe con soporte para Apple Pay/Google Pay
- Auth: NextAuth.js + verificación de teléfono (Twilio)
- UI: Tailwind + Shadcn + Mobile-first responsive
- Deploy: Vercel + Railway

TAREA:
Desarrolla "FoodDash", app de delivery de restaurante:

1. APP DEL CLIENTE (PWA):
   - Catálogo con categorías, imágenes, descripciones, precios
   - Búsqueda y filtros (vegetariano, sin gluten, picante, etc.)
   - Personalización de items (tamaño, extras, instrucciones especiales)
   - Carrito con resumen y total
   - Checkout: dirección de entrega (mapa + autocomplete), método de pago
   - Tracking de pedido en tiempo real (mapa con ruta del repartidor)
   - Historial de pedidos y re-orden con un click

2. APP DEL RESTAURANTE (DASHBOARD):
   - Panel de pedidos entrantes en tiempo real con sonido
   - Aceptar/rechazar pedidos
   - Estados: received → preparing → ready → out for delivery → delivered
   - Gestión de menú: CRUD de categorías e items, precios, disponibilidad
   - Configuración: horarios, zonas de delivery, precios por zona
   - Analytics: pedidos/día, items más vendidos, revenue, ticket promedio

3. APP DEL REPARTIDOR (PWA):
   - Lista de deliveries asignados
   - Aceptar/rechazar delivery
   - Mapa con ruta optimizada (múltiples deliveries)
   - Navegación GPS integrada (Google Maps/Waze)
   - Confirmación de entrega con foto
   - Historial de deliveries y earnings

4. TIEMPO REAL:
   - WebSocket para sincronización instantánea entre los 3 roles
   - Notificaciones push: nuevo pedido, pedido listo, repartidor llegando
   - Sound alerts para restaurante
   - Indicadores de estado en vivo

5. PWA FEATURES:
   - Installable en home screen (Android/iOS)
   - Offline: catálogo cacheado, pedidos offline con sync
   - Splash screen y iconos
   - Badge de notificaciones en el icono
   - Geolocalización para sugerir dirección
   - Native-like transitions y gestos

6. PAGOS:
   - Tarjeta (Stripe Elements)
   - Apple Pay / Google Pay
   - Efectivo contra entrega
   - Propinas configurables (%, fijo, no)
   - Recibo digital por email

ENTREGABLE FINAL:
App de delivery completa con 3 roles (cliente, restaurante, repartidor), tracking en tiempo real, PWA instalable, pagos integrados y panel de analytics.`,
              tags: ["PWA", "delivery", "real-time", "mobile", "Stripe", "Next.js", "offline"],
              uso: "App de delivery y restaurantes"
            },
            {
              id: "fs_mob_002",
              titulo: "Health & Fitness Tracker PWA con AI Coach",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Fullstack Developer con experiencia en aplicaciones de salud, PWAs con capacidades de dispositivo y integración de AI para recomendaciones personalizadas.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + OpenAI + PWA (Workbox)
- Charts: Recharts para gráficos de progreso
- AI: OpenAI GPT-4o para coach personalizado y planes
- PWA: Service Worker, Background Sync, Periodic Sync (si disponible)
- Auth: NextAuth.js con credenciales y OAuth
- UI: Tailwind + Shadcn + Framer Motion (animaciones fluidas)
- Deploy: Vercel + Railway

TAREA:
Desarrolla "FitSync", health & fitness tracker con AI coach:

1. ONBOARDING Y PERFIL:
   - Cuestionario inicial: edad, peso, altura, objetivos, nivel fitness
   - Cálculo de IMC, BMR, TDEE
   - Objetivos: perder peso, ganar músculo, mantener, resistencia
   - AI genera plan personalizado inicial
   - Configuración de metas diarias/semanales

2. TRACKING DE ACTIVIDAD:
   - Registro manual de ejercicios (tipo, duración, intensidad, calorías)
   - Integración con Health API (iOS) / Google Fit (Android) si está disponible
   - Contador de pasos diario
   - Streak tracker (días consecutivos)
   - Logros y badges por milestones

3. NUTRICIÓN:
   - Diario de comidas con búsqueda en base de datos de alimentos
   - Escaneo de código de barras (API de Open Food Facts)
   - Tracking de macros: proteínas, carbs, grasas, fibra
   - Calorías diarias con gráfico circular
   - AI sugiere comidas según objetivos y preferencias

4. PLANES DE ENTRENAMIENTO:
   - AI genera rutinas semanales según nivel y objetivos
   - Biblioteca de ejercicios con videos/gifs y descripciones
   - Timer de descanso entre sets
   - Progreso de pesos/reps con gráficos
   - Personalización por equipo disponible (casa, gimnasio)

5. AI COACH:
   - Chat con AI coach para preguntas sobre fitness
   - Análisis semanal de progreso con recomendaciones
   - Ajuste dinámico del plan según adherencia y resultados
   - Motivación personalizada
   - Respuestas a preguntas de nutrición

6. DASHBOARD Y PROGRESO:
   - Dashboard con métricas clave: peso, calorías, actividad, streak
   - Gráficos de progreso semanal/mensual/anual
   - Body measurements tracker
   - Fotos de progreso (antes/después)
   - Exportación de datos

7. PWA CAPABILITIES:
   - Offline: registrar ejercicios y comidas sin conexión + sync
   - Notificaciones push: recordatorio de workout, hora de comer, logros
   - Widget simple para registrar rápido
   - Instalable con splash screen

ENTREGABLE FINAL:
App de fitness completa tipo MyFitnessPal + Fitbod con tracking de actividad y nutrición, AI coach personalizado, planes de entrenamiento generados por AI, PWA instalable con soporte offline.`,
              tags: ["health", "fitness", "AI", "PWA", "tracking", "Next.js", "offline"],
              uso: "App de salud y fitness"
            }
          ]
        },
        {
          id: "fs_enterprise",
          nombre: "Enterprise & Internal Tools",
          prompts: [
            {
              id: "fs_ent_001",
              titulo: "Employee Directory & Org Chart con Gestión de Time Off",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Fullstack Developer con experiencia en sistemas HR, gestión de empleados y herramientas internas empresariales.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + Redis + React Flow (org chart)
- Org Chart: React Flow o D3.js para organigrama interactivo
- Auth: NextAuth.js + Azure AD/Google Workspace SSO
- Email: React Email + Resend para notificaciones y approvals
- Calendario: Google Calendar API o Outlook API para sync
- Charts: Recharts + Tremor para HR analytics
- UI: Tailwind + Shadcn + Framer Motion
- Deploy: Vercel + Railway

TAREA:
Desarrolla "PeopleOS", directorio de empleados y HR tools:

1. EMPLOYEE DIRECTORY:
   - Listado con búsqueda, filtros (departamento, oficina, rol, manager)
   - Tarjetas de perfil: foto, nombre, cargo, departamento, email, teléfono, ubicación
   - Skills y expertise tags
   - Timeline de carrera en la empresa
   - Diagrama de equipo directo
   - Exportar directorio a PDF/CSV

2. ORG CHART INTERACTIVO:
   - Organigrama con React Flow (zoom, pan, drag)
   - Expandir/colapsar departamentos
   - Ver equipo directo de cualquier persona
   - Vacant positions visibles
   - Exportar como imagen/SVG
   - Actualización automática con cambios

3. TIME OFF MANAGEMENT:
   - Tipos: vacaciones, sick day, personal day, maternity/paternity, estudio
   - Saldo por tipo y por empleado (según antigüedad y política)
   - Solicitud con fechas, tipo, notas
   - Flujo de aprobación: employee → manager → HR
   - Calendario de team absences
   - Políticas configurables por país/oficina
   - Public holidays automáticos

4. ONBOARDING CHECKLIST:
   - Templates de onboarding por departamento
   - Tareas con asignado, deadline, dependencias
   - Tracking de progreso del nuevo empleado
   - Documentos para firmar y revisar
   - Welcome email automático

5. HR ANALYTICS:
   - Headcount por departamento, oficina, seniority
   - Rotation rate
   - Time off utilization
   - Average tenure
   - Diversity metrics
   - Reportes PDF automáticos

6. EMPLOYEE SELF-SERVICE:
   - Actualizar perfil: foto, bio, skills, contacto de emergencia
   - Ver payslips (PDF seguro)
   - Beneficios enrollment
   - Performance review history
   - Internal job board

ENTREGABLE FINAL:
Plataforma HR completa con directorio de empleados, organigrama interactivo, gestión de time off, onboarding, analytics y self-service portal.`,
              tags: ["HR", "org chart", "employee", "directory", "Next.js", "Prisma", "enterprise"],
              uso: "Sistema de gestión de personal"
            },
            {
              id: "fs_ent_002",
              titulo: "Asset Management & Inventory Tracking System",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Desarrollador especializado en sistemas de gestión de activos, inventario y tracking con códigos QR/barcode.

CONTEXTO TÉCNICO:
- Stack: Next.js 15 + TypeScript + Prisma + PostgreSQL + Redis + QR Code
- QR/Barcode: Generación + escaneo vía cámara (html5-qrcode)
- Notificaciones: Email (Resend) para alertas de mantenimiento y asignación
- Reportes: Exportación a PDF y Excel
- Auth: NextAuth.js con Azure AD/Okta SSO
- Dashboard: Recharts para métricas de activos
- UI: Tailwind + Shadcn + Mobile-first (escaneo en campo)
- Deploy: Vercel + Railway

TAREA:
Desarrolla "AssetTrack", sistema de gestión de activos:

1. INVENTARIO DE ACTIVOS:
   - Registro: nombre, categoría, marca, modelo, número de serie, fecha de compra, valor, ubicación, estado
   - Categorías: IT equipment, furniture, vehicles, machinery, tools, electronics
   - Estados: available, assigned, in repair, retired, lost
   - Código QR/Barcode único generado automáticamente por activo
   - Etiqueta imprimible con QR y datos del activo
   - Fotos del activo

2. ESCANEO Y BÚSQUEDA:
   - Escanear QR con cámara del dispositivo para ver info del activo
   - Búsqueda por: nombre, serial, tag, ubicación, asignado a, categoría
   - Bulk scan para inventario masivo
   - Resultados rápidos con acciones (asignar, mover, dar de baja)

3. CHECKOUT/CHECKIN:
   - Asignar activo a empleado con fecha de asignación y devolución esperada
   - Firma digital de recepción
   - Recordatorios automáticos de devolución
   - Historial de asignaciones por activo y por empleado
   - Transferencia entre empleados

4. MANTENIMIENTO:
   - Programar mantenimientos recurrentes (cada X meses)
   - Alertas de mantenimiento próximo (30, 15, 7 días)
   - Registro de mantenimientos realizados con costo
   - Historial de mantenimiento por activo
   - Vincular a proveedor externo

5. DEPRECIACIÓN Y VALOR:
   - Cálculo automático de depreciación (linear, acelerada)
   - Valor actual estimado de cada activo
   - Gráfico de depreciación en el tiempo
   - Alerta de activos totalmente depreciados

6. DASHBOARD:
   - Total activos, valor total del inventario
   - Activos asignados vs disponibles
   - Próximos mantenimientos
   - Activos por categoría y ubicación
   - Auditoría: últimos cambios, asignaciones, bajas

7. AUDITORÍA Y REPORTES:
   - Audit log completo: quién, qué, cuándo
   - Reportes: inventario completo, por ubicación, por empleado, por categoría
   - Export a Excel/CSV/PDF
   - Reporte de depreciación para contabilidad

ENTREGABLE FINAL:
Sistema de gestión de activos completo con QR/barcode, escaneo móvil, checkout/checkin, mantenimiento programado, depreciación automática y reportes de auditoría.`,
              tags: ["asset management", "inventory", "QR", "tracking", "Next.js", "enterprise"],
              uso: "Sistema de gestión de activos"
            }
          ]
        },
        {
          id: "fs_plugins",
          nombre: "Bots, Plugins & Automatización",
          prompts: [
            {
              id: "fs_plug_001",
              titulo: "Slack/Discord Bot Multifuncional con AI y Automatizaciones",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Desarrollador de bots y automatizaciones con experiencia en Slack API, Discord API, OpenAI y sistemas de integración.

CONTEXTO TÉCNICO:
- Stack: Node.js + TypeScript + Express + OpenAI + Slack Bolt API + Discord.js + PostgreSQL + Redis
- AI: OpenAI GPT-4o para respuestas inteligentes, resúmenes y análisis
- Queues: BullMQ para procesamiento asíncrono de comandos pesados
- Deploy: Railway o Docker
- Testing: Vitest + MSW para mock de APIs

TAREA:
Desarrolla "OmniBot", bot multi-plataforma con AI:

1. SLACK INTEGRATION:
   - Instalación vía OAuth en workspaces de Slack
   - Slash commands: /ai (pregunta a AI), /summary (resumir canal/hilo), /poll, /remind, /standup
   - Event listeners: message events para comandos en canal
   - Interactive messages con botones y modals
   - Home tab con dashboard personalizado
   - Mención @bot para preguntas directas

2. DISCORD INTEGRATION:
   - Mismos comandos adaptados a Discord
   - Slash commands registrados en Discord Developer Portal
   - Embed messages con formato rico
   - Voice channel join para resúmenes de reunión (opcional)
   - Role-based permissions para comandos

3. AI FEATURES:
   - /ai [pregunta]: responde usando GPT-4o con contexto de conversación
   - /summary: resume los últimos N mensajes o un hilo completo
   - /translate [idioma] [texto]
   - /code-review: analiza snippet de código compartido
   - /image: genera imagen con DALL-E 3
   - Memoria de conversación por canal/usuario

4. STANDUP BOT:
   - /standup start: inicia ronda de standup en el canal
   - Preguntas configurables: qué hiciste ayer, qué harás hoy, bloqueos
   - Recolección de respuestas en hilos
   - Resumen automático al final
   - Export de standups a Notion/Google Sheets

5. POLLS Y ENCUESTAS:
   - /poll "pregunta" "opción1" "opción2" "opción3"
   - Votación con reacciones/emojis
   - Resultados en tiempo real
   - Cierre automático con resumen

6. KNOWLEDGE BASE:
   - Entrenar al bot con documentación de la empresa (RAG)
   - /ask [pregunta] busca en docs internos
   - Indexación de PDFs, Markdown, Confluence, Notion
   - Actualización automática periódica

7. ADMIN PANEL WEB:
   - Dashboard de uso: comandos/día, usuarios activos, tokens gastados
   - Configuración de comandos por workspace/servidor
   - Gestión de knowledge base (subir docs)
   - Analytics de uso del bot
   - Billing y límites

ENTREGABLE FINAL:
Bot multi-plataforma Slack + Discord con AI integrado, standups, polls, knowledge base RAG y admin panel de configuración y analytics.`,
              tags: ["bot", "Slack", "Discord", "AI", "OpenAI", "Node.js", "TypeScript"],
              uso: "Automatización de equipo"
            },
            {
              id: "fs_plug_002",
              titulo: "Browser Extension Fullstack con AI y Sync Multi-Dispositivo",
              categoria: "Aplicación Fullstack",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Desarrollador de extensiones de navegador multi-plataforma (Chrome, Firefox, Edge) con experiencia en APIs de extensión, sistemas de sync y AI.

CONTEXTO TÉCNICO:
- Stack: TypeScript + React + Vite (para popup/dashboard) + Chrome Extension Manifest V3 + Node.js API
- Extension: Manifest V3, Service Worker, Content Scripts, Side Panel API
- Sync: Cloud sync vía API REST + WebSocket para real-time
- AI: OpenAI para resúmenes, traducción, asistente
- Backend: Express/Fastify + PostgreSQL + Redis para datos de usuario
- Auth: OAuth (Google, GitHub) + JWT
- UI: Tailwind + Shadcn (popup y opciones)

TAREA:
Desarrolla "OmniExt", extensión de navegador productiva con AI:

1. POPUP INTERFAZ:
   - Vista compacta con acciones rápidas
   - AI chat rápido (Ctrl+Shift+K shortcut)
   - Bookmarks rápidos con búsqueda
   - Notas rápidas (sync con cuenta)
   - Tabs abiertas con búsqueda y switch
   - Modo focus: bloquear sitios distractores por tiempo

2. AI ASSISTANT:
   - Seleccionar texto en cualquier página → AI action (explicar, resumir, traducir, reescribir)
   - Side panel con chat AI contextual a la página actual
   - Resumir artículo/página completa
   - Explicar concepto seleccionado como si tuvieras 5 años
   - Traducción inline de texto seleccionado

3. WEB HIGHLIGHTER & ANNOTATIONS:
   - Resaltar texto en páginas web con colores
   - Añadir notas a highlights
   - Persistencia y sync entre dispositivos
   - Compartir highlights con otros usuarios
   - Exportar todos los highlights de una página

4. TAB MANAGER:
   - Vista de tabs abiertas con búsqueda (Ctrl+Shift+A)
   - Agrupar tabs por dominio, fecha, custom
   - Suspender tabs inactivas para ahorrar memoria
   - Sessions: guardar grupo de tabs y restaurar después
   - Sync de sessions entre dispositivos

5. SNIPPETS & SCRIPTS:
   - Guardar snippets de código/texto con shortcuts
   - Expandir snippets en cualquier input (ej: ;email → email completo)
   - Ejecutar custom scripts en páginas específicas
   - Compartir snippets con equipo

6. DASHBOARD WEB:
   - Todas las notas, highlights, bookmarks, snippets en un dashboard
   - Búsqueda global en todos los datos
   - Analytics de productividad: tiempo en sitios, pestañas usadas
   - Configuración de la extensión

7. PRIVACIDAD Y SEGURIDAD:
   - Datos cifrados end-to-end (clave de cifrado solo en cliente)
   - Zero-knowledge sync
   - Permisos mínimos necesarios
   - GDPR compliant

ENTREGABLE FINAL:
Extensión de navegador completa multi-plataforma con AI assistant, web highlighter, tab manager, snippets, sync multi-dispositivo y dashboard de productividad.`,
              tags: ["browser extension", "Chrome", "AI", "sync", "React", "TypeScript", "Manifest V3"],
              uso: "Extensión de productividad"
            }
          ]
        }
      ]
    }
  ]
};