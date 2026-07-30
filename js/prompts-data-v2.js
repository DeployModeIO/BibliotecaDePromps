/**
 * MEGA-PROMPTS ADICIONALES v2.0
 * Prompts profesionales para todas las industrias
 */

const PROMPTS_DB_V2 = {
  categorias: [
    {
      id: "oil_gas_v2",
      nombre: "Oil & Gas Avanzado",
      icono: "🛢️",
      color: "#e65100",
      descripcion: "Gestión de paradas, corrosión, ductos e inventarios",
      subcategorias: [
        {
          id: "og_paradas",
          nombre: "Gestión de Paradas de Planta",
          prompts: [
            {
              id: "og_par_001",
              titulo: "Sistema de Gestión de Paradas de Planta (Shutdown/Turnaround)",
              categoria: "Aplicación Web",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Gerente de Paradas de Planta Senior con 25 años de experiencia en planificación y ejecución de turnarounds en refinerías y plantas de gas. Experto en gestión de proyectos de mantenimiento mayor, optimización de cronogramas y control de costos. Certificado PMP y con experiencia en plantas de 100,000+ bpd.

CONTEXTO TÉCNICO:
- Industria: Refinería de petróleo con capacidad de 150,000 bpd
- Tipo de parada: Turnaround mayor cada 4-5 años, duración 30-45 días
- Equipos involucrados: 500+ equipos (intercambiadores, reactores, columnas, bombas, compresores)
- Personal: 2,000+ personas durante la parada (propios + contratistas)
- Presupuesto: $50-100 millones USD
- Normas: API 510, API 570, API 653, ASME, OSHA PSM
- Problemática: Paradas anteriores con sobrecostos del 30%, retrasos de 15 días, problemas de seguridad

TAREA:
Desarrolla una aplicación web completa para gestión integral de paradas de planta. La aplicación debe:

1. MÓDULO DE PLANIFICACIÓN (12-18 meses antes):
   - Definición de alcance de la parada:
     * Lista maestra de equipos a intervenir
     * Priorización por criticidad (Risk-Based Inspection)
     * Estimación de costos por equipo y actividad
     * Identificación de long-lead items (repuestos de largo plazo)
   - Cronograma maestro:
     * WBS (Work Breakdown Structure) con 5,000+ actividades
     * Ruta crítica identificada
     * Hitos principales (shutdown, apertura, inspección, cierre, startup)
     * Diagrama de Gantt interactivo
   - Gestión de recursos:
     * Plan de personal por especialidad (mecánicos, soldadores, inspectores)
     * Plan de equipos (grúas, andamios, herramientas especiales)
     * Plan de materiales y repuestos
   - Gestión de contratistas:
     * Pre-calificación de contratistas
     * Contratos y alcances
     * Inducción y permisos

2. MÓDULO DE EJECUCIÓN (durante la parada):
   - Control diario de avance:
     * Registro de actividades completadas vs. planificadas
     * Actualización de % de avance por WBS
     * Identificación de desviaciones y acciones correctivas
   - Control de costos:
     * Registro de horas-hombre por actividad
     * Control de materiales consumidos
     * Variaciones vs. presupuesto
   - Control de seguridad:
     * Registro de incidentes y cuasi-accidentes
     * Permisos de trabajo activos
     * Observaciones de seguridad (BBS)
   - Gestión de cambios:
     * Registro de cambios de alcance
     * Aprobaciones y justificaciones
     * Impacto en cronograma y costos

3. MÓDULO DE INSPECCIÓN Y PRUEBAS:
   - Plan de inspección por equipo:
     * Tipo de inspección (visual, UT, RT, PT, MT)
     * Criterios de aceptación/rechazo
     * Resultados y recomendaciones
   - Pruebas post-mantenimiento:
     * Pruebas hidrostáticas
     * Pruebas de fugas
     * Pruebas funcionales
   - Documentación de cierre:
     * Reportes de inspección
     * Certificados de materiales
     * As-built drawings

4. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard ejecutivo en tiempo real:
     * % de avance global vs. plan
     * Costo acumulado vs. presupuesto
     * Días transcurridos vs. planificados
     * Incidentes de seguridad
     * Actividades críticas pendientes
   - Reportes automáticos:
     * Reporte diario de avance (para gerencia)
     * Reporte semanal de costos
     * Reporte de seguridad
     * Reporte final de la parada (lessons learned)
   - KPIs:
     * SPI (Schedule Performance Index)
     * CPI (Cost Performance Index)
     * TRIR (Total Recordable Incident Rate)
     * % de actividades completadas a tiempo

5. MÓDULO DE LECCIONES APRENDIDAS:
   - Registro de lecciones aprendidas por fase
   - Análisis de desviaciones y causas raíz
   - Mejores prácticas identificadas
   * Recomendaciones para próximas paradas

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo sistema de gestión de proyectos
- Diseño responsive para desktop (oficina) y tablets (campo)
- Gráficos interactivos (Gantt, curvas S, dashboards)
- Datos de ejemplo realistas (parada de 30 días, 500 actividades)
- Exportación a PDF/Excel

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Preparado para integración con Primavera P6/MS Project

CRITERIOS DE CALIDAD:
- Sistema robusto para gestión de proyectos complejos
- Interfaz intuitiva para planificadores y supervisores
- Cálculos precisos de EVM (Earned Value Management)
- Reportes profesionales listos para directorio

ENTREGABLE FINAL:
Sistema integral de gestión de paradas de planta que permita planificar, ejecutar y cerrar turnarounds de manera eficiente, controlando costos, cronograma y seguridad, y generando lecciones aprendidas para mejorar continuamente.`,
              tags: ["parada de planta", "turnaround", "shutdown", "EVM", "PMP", "gestión de proyectos"],
              uso: "Por evento / Continuo durante parada"
            }
          ]
        },
        {
          id: "og_corrosion",
          nombre: "Gestión de Corrosión",
          prompts: [
            {
              id: "og_corr_001",
              titulo: "Sistema de Monitoreo y Gestión de Corrosión",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero de Corrosión Senior certificado NACE Level 3 (CIP) con 20 años de experiencia en gestión de integridad de activos en Oil & Gas. Experto en mecanismos de corrosión, técnicas de monitoreo y programas de inhibición química.

CONTEXTO TÉCNICO:
- Industria: Planta de procesamiento de gas con alto contenido de H2S y CO2
- Equipos críticos: 200+ equipos (tuberías, recipientes, intercambiadores)
- Mecanismos de corrosión: CO2 (sweet corrosion), H2S (sour corrosion), MIC (microbiológica), erosión
- Técnicas de monitoreo: Cupones, sondas eléctricas, UT thickness, inspección inteligente
- Normas: NACE MR0175/ISO 15156, API 571, API 581 (RBI)
- Problemática: Fallas recurrentes por corrosión, costos de reparación elevados, falta de visibilidad del estado de activos

TAREA:
Desarrolla una aplicación web completa para gestión integral de corrosión. La aplicación debe:

1. MÓDULO DE INVENTARIO DE ACTIVOS:
   - Registro de equipos con datos de corrosión:
     * Material de construcción (carbon steel, stainless, alloys)
     * Condiciones de operación (temperatura, presión, composición)
     * Mecanismos de corrosión identificados
     * Historial de fallas y reparaciones
   - Clasificación por criticidad:
     * Consecuencia de falla (seguridad, ambiental, producción)
     * Probabilidad de falla (basada en tasa de corrosión)
     * Matriz de riesgo dinámica

2. MÓDULO DE MONITOREO DE CORROSIÓN:
   - Cupones de corrosión:
     * Registro de instalación y retiro
     * Cálculo de tasa de corrosión (mpy - mils per year)
     * Análisis de tipo de corrosión (uniforme, picadura, grietas)
     * Tendencias históricas
   - Sondas eléctricas (ER/LPR):
     * Lecturas en tiempo real (si hay integración)
     * Cálculo de tasa de corrosión instantánea
     * Alarmas por tasas elevadas
   - Mediciones de espesor (UT):
     * Registro de puntos de medición (TMLs - Thickness Measurement Locations)
     * Tendencias de espesor vs. tiempo
     * Cálculo de vida remanente
     * Identificación de áreas críticas

3. MÓDULO DE INHIBICIÓN QUÍMICA:
   - Programa de inyección de inhibidores:
     * Tipo de inhibidor (filmante, neutralizante, scavenger)
     * Dosificación (ppm)
     * Puntos de inyección
     * Consumo y costos
   - Monitoreo de efectividad:
     * Residual de inhibidor en puntos de muestreo
     * Correlación con tasas de corrosión
     * Optimización de dosificación

4. MÓDULO DE ANÁLISIS Y PREDICCIÓN:
   - Cálculo de tasas de corrosión:
     * Promedio histórico
     * Tendencia (creciente/decreciente)
     * Predicción de vida remanente
   - Análisis de mecanismos:
     * Identificación de mecanismo predominante
     * Factores contribuyentes
     * Recomendaciones de mitigación
   - Risk-Based Inspection (RBI):
     * Cálculo de probabilidad de falla (PoF)
     * Cálculo de consecuencia de falla (CoF)
     * Priorización de inspecciones

5. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard ejecutivo:
     * Tasa de corrosión promedio por área
     * Equipos con tasa crítica
     * Próximas inspecciones
     * Costos de corrosión (reparaciones + inhibidores)
   - Reportes:
     * Reporte mensual de monitoreo
     * Reporte de efectividad de inhibidores
     * Reporte de RBI y plan de inspección
     * Análisis de fallas y lecciones aprendidas
   - Exportación a PDF/Excel

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo sistema de gestión de integridad
- Diseño responsive para desktop y tablets
- Gráficos de tendencias y mapas de calor
- Datos de ejemplo realistas (200 equipos, 5 años de historial)

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia

CRITERIOS DE CALIDAD:
- Cálculos precisos según NACE y API
- Interfaz intuitiva para ingenieros de corrosión
- Visualización clara de tendencias y riesgos

ENTREGABLE FINAL:
Sistema integral de gestión de corrosión que permita monitorear, analizar y mitigar la corrosión en activos críticos, optimizando costos de mantenimiento y extendiendo la vida útil de los equipos.`,
              tags: ["corrosión", "NACE", "API 571", "RBI", "monitoreo", "integridad"],
              uso: "Continuo / Gestión de activos"
            }
          ]
        }
      ]
    },
    {
      id: "automatizacion_v2",
      nombre: "Automatización Avanzada",
      icono: "🤖",
      color: "#7b1fa2",
      descripcion: "Sistemas avanzados de alertas y automatización",
      subcategorias: [
        {
          id: "auto_extintores",
          nombre: "Alertas de Extintores",
          prompts: [
            {
              id: "auto_ext_001",
              titulo: "Sistema de Alertas y Gestión de Extintores",
              categoria: "Aplicación Web",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Ingeniero de Protección Contra Incendios certificado NFPA con 15 años de experiencia en sistemas de protección contra incendios industriales. Experto en NFPA 10 (Extintores Portátiles), NFPA 25 (Inspección y Mantenimiento) y normativas locales de bomberos.

CONTEXTO TÉCNICO:
- Industria: Planta industrial con 500+ extintores distribuidos en 20 edificios/áreas
- Tipos de extintores: PQS (ABC), CO2, agua, espuma, clase K (cocinas)
- Normas aplicables: NFPA 10, NFPA 25, normativas locales de bomberos
- Frecuencia de inspección: Mensual (visual), anual (mantenimiento), 5/12 años (prueba hidrostática)
- Problemática: Extintores vencidos sin detectar, falta de trazabilidad, multas de bomberos, riesgo de incendio

TAREA:
Desarrolla una aplicación web completa para gestión y alertas de extintores. La aplicación debe:

1. MÓDULO DE INVENTARIO DE EXTINTORES:
   - Registro completo de cada extintor:
     * ID único (código de barras/QR)
     * Ubicación exacta (edificio, piso, área, coordenadas GPS)
     * Tipo (PQS, CO2, agua, espuma, clase K)
     * Capacidad (kg/L)
     * Fabricante, modelo, año de fabricación
     * Fecha de última recarga
     * Fecha de última prueba hidrostática
     * Fecha de vencimiento
     * Estado (operativo, fuera de servicio, en mantenimiento)
   - Mapa interactivo de ubicaciones
   - Fotografías de cada extintor

2. MÓDULO DE INSPECCIONES:
   - Inspección mensual (visual):
     * Checklist digital: presión (manómetro en verde), sello de seguridad, manguera, boquilla, soporte, señalización, acceso libre
     * Registro fotográfico de hallazgos
     * Firma digital del inspector
     * Generación automática de OT para hallazgos
   - Mantenimiento anual:
     * Registro de empresa certificada
     * Actividades realizadas (descarga, inspección interna, recarga, prueba)
     * Certificado de mantenimiento
   - Prueba hidrostática (5/12 años):
     * Registro de prueba
     * Certificado de prueba
     * Nueva fecha de vencimiento

3. MÓDULO DE ALERTAS AUTOMÁTICAS:
   - Alertas por vencimiento:
     * 60 días antes: Alerta preventiva (planificar mantenimiento)
     * 30 días antes: Alerta urgente (programar mantenimiento)
     * 7 días antes: Alerta crítica (acción inmediata)
     * Vencido: Alerta crítica diaria + notificación a gerencia
   - Alertas por estado:
     * Extintor fuera de servicio
     * Extintor con presión baja
     * Extintor dañado o obstruido
   - Alertas regulatorias:
     * % de extintores operativos < 95% (incumplimiento)
     * Inspecciones mensuales no realizadas
     * Certificados de mantenimiento vencidos
   - Notificaciones:
     * Email diario: Resumen de alertas activas
     * Email semanal: Plan de mantenimiento de la semana
     * Email mensual: Reporte de cumplimiento
     * SMS/WhatsApp: Alertas críticas

4. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard ejecutivo:
     * Total de extintores y % operativos
     * Próximos vencimientos (próximos 30/60/90 días)
     * Alertas activas por prioridad
     * Cumplimiento de inspecciones mensuales
     * Costos de mantenimiento
   - Reportes:
     * Reporte mensual de inspecciones
     * Reporte de mantenimiento anual
     * Reporte para bomberos/autoridades
     * Reporte de costos
   - Exportación a PDF/Excel

5. MÓDULO DE ESCANEO QR:
   - Escaneo de código QR en cada extintor
   - Acceso rápido a historial del extintor
   * Registro rápido de inspección desde móvil
   * Verificación de autenticidad

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo sistema de gestión de seguridad
- Diseño responsive optimizado para tablets (uso en campo)
- Mapa interactivo de ubicaciones
- Datos de ejemplo realistas (500 extintores, 2 años de historial)
- Sistema de alertas visual con semáforos

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, Leaflet.js, jsPDF, SheetJS, QRCode.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Preparado para integración con sistema de notificaciones

CRITERIOS DE CALIDAD:
- Sistema robusto para gestión de activos críticos de seguridad
- Interfaz intuitiva para inspectores y supervisores
- Alertas precisas y oportunas
- Cumplimiento normativo garantizado

ENTREGABLE FINAL:
Sistema integral de gestión de extintores que garantice el 100% de cumplimiento normativo, elimine vencimientos no detectados, proporcione trazabilidad completa y reduzca el riesgo de incendio por extintores inoperativos.`,
              tags: ["extintores", "NFPA 10", "NFPA 25", "protección contra incendios", "alertas", "QR"],
              uso: "Mensual / Continuo"
            }
          ]
        },
        {
          id: "auto_respel",
          nombre: "Gestión de RESPEL",
          prompts: [
            {
              id: "auto_respel_001",
              titulo: "Sistema de Gestión de Residuos Peligrosos (RESPEL)",
              categoria: "Aplicación Web",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Ingeniero Ambiental Senior con 20 años de experiencia en gestión de residuos peligrosos industriales. Experto en normativas ambientales (EPA RCRA, directivas europeas, normativas locales), transporte de materiales peligrosos (DOT/ADR) y sistemas de gestión ambiental ISO 14001.

CONTEXTO TÉCNICO:
- Industria: Planta química con generación de 50+ toneladas/mes de residuos peligrosos
- Tipos de residuos: Solventes orgánicos, ácidos, bases, lodos con metales pesados, envases contaminados, baterías, lámparas fluorescentes, residuos biológicos
- Normas aplicables: EPA RCRA, ISO 14001, normativas locales de residuos peligrosos, DOT para transporte
- Infraestructura: Bodega RESPEL de 500 m², contenedores segregados por compatibilidad, sistema de contención de derrames
- Problemática: Acumulación excesiva de residuos, vencimiento de tiempos de almacenamiento (180 días), falta de trazabilidad, multas ambientales, riesgo de contaminación

TAREA:
Desarrolla una aplicación web completa para gestión integral de residuos peligrosos. La aplicación debe:

1. MÓDULO DE GENERACIÓN Y CLASIFICACIÓN:
   - Registro de generación de residuos:
     * Fecha, área generadora, proceso/actividad
     * Tipo de residuo (código CER/EPAL)
     * Cantidad generada (kg, L, unidades)
     * Características de peligrosidad (inflamable, corrosivo, reactivo, tóxico, biológico)
     * Envase/contenedor utilizado
   - Clasificación y etiquetado:
     * Generación automática de etiqueta con código QR
     * Pictogramas SGA/GHS
     * Información de peligrosidad
     * Fecha de inicio de acumulación

2. MÓDULO DE ALMACENAMIENTO:
   - Gestión de bodega RESPEL:
     * Inventario en tiempo real por tipo de residuo
     * Ubicación en bodega (zona, estante, contenedor)
     * Control de compatibilidad química (matriz de segregación)
     * Capacidad disponible vs. utilizada
   - Control de tiempos de almacenamiento:
     * Contador de días desde inicio de acumulación
     * Alertas a 150, 170, 180 días (límite legal)
     * Identificación de residuos próximos a vencer
   - Condiciones de almacenamiento:
     * Temperatura y humedad de bodega
     * Ventilación y extracción de vapores
     * Sistema de contención de derrames
     * Señalización y rutas de evacuación

3. MÓDULO DE TRANSPORTE Y DISPOSICIÓN:
   - Gestión de transportistas:
     * Registro de transportistas autorizados (licencia DOT/ADR)
     * Seguros y certificaciones
     * Historial de servicios
   - Manifiestos de transporte:
     * Generación automática de manifiestos
     * Información del generador, transportista, destinatario
     * Tipo y cantidad de residuos
     * Firma digital de todas las partes
   - Disposición final:
     * Registro de plantas de disposición autorizadas
     * Tipo de disposición (incineración, relleno de seguridad, reciclaje, tratamiento)
     * Certificados de disposición final
     * Trazabilidad completa (generación → almacenamiento → transporte → disposición)

4. MÓDULO DE ALERTAS AUTOMÁTICAS:
   - Alertas de tiempo de almacenamiento:
     * 150 días: Alerta preventiva (planificar retiro)
     * 170 días: Alerta urgente (programar retiro)
     * 180 días: Alerta crítica (incumplimiento normativo)
   - Alertas de capacidad:
     * Bodega al 80% de capacidad
     * Bodega al 95% de capacidad (crítica)
     * Contenedor específico lleno
   - Alertas de documentación:
     * Manifiestos pendientes de firma
     * Certificados de disposición pendientes
     * Declaraciones anuales pendientes
   - Alertas de seguridad:
     * Derrame detectado
     * Incompatibilidad química en almacenamiento
     * Temperatura de bodega fuera de rango
   - Notificaciones:
     * Email diario: Resumen de alertas activas
     * Email semanal: Plan de retiros de la semana
     * Email mensual: Reporte de generación y disposición
     * Email a autoridades: Declaraciones regulatorias

5. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard ejecutivo:
     * Total de residuos en bodega (toneladas)
     * % de capacidad utilizada
     * Residuos próximos a vencer (próximos 30 días)
     * Alertas activas por prioridad
     * Costos de gestión (transporte + disposición)
   - Reportes:
     * Reporte mensual de generación y disposición
     * Reporte de inventario de bodega
     * Declaración anual de residuos peligrosos
     * Reporte de costos
     * Reporte para auditoría ISO 14001
   - Exportación a PDF/Excel

6. MÓDULO DE ESCANEO QR:
   - Escaneo de código QR en cada contenedor
   - Acceso rápido a información del residuo
   - Registro rápido de movimientos (generación, traslado, retiro)
   - Verificación de trazabilidad

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo sistema de gestión ambiental
- Diseño responsive optimizado para tablets (uso en campo)
- Mapa interactivo de bodega RESPEL
- Datos de ejemplo realistas (50 tipos de residuos, 2 años de historial)
- Sistema de alertas visual con semáforos

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, Leaflet.js, jsPDF, SheetJS, QRCode.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Cumplimiento con normativas EPA RCRA e ISO 14001

CRITERIOS DE CALIDAD:
- Sistema robusto para gestión de residuos peligrosos
- Interfaz intuitiva para operadores y supervisores
- Trazabilidad completa desde generación hasta disposición
- Cumplimiento normativo garantizado

ENTREGABLE FINAL:
Sistema integral de gestión de RESPEL que garantice el 100% de cumplimiento normativo, elimine vencimientos de almacenamiento, proporcione trazabilidad completa y reduzca el riesgo ambiental y legal por mala gestión de residuos peligrosos.`,
              tags: ["RESPEL", "residuos peligrosos", "EPA RCRA", "ISO 14001", "alertas", "trazabilidad"],
              uso: "Diario / Continuo"
            }
          ]
        }
      ]
    },
    {
      id: "capacitacion_v2",
      nombre: "Capacitación Avanzada",
      icono: "🎓",
      color: "#00695c",
      descripcion: "Inducciones, charlas y gestión de competencias",
      subcategorias: [
        {
          id: "cap_induccion",
          nombre: "Inducción de Personal",
          prompts: [
            {
              id: "cap_ind_001",
              titulo: "Sistema Digital de Inducción de Personal Nuevo",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Gerente de HSE y Capacitación Senior con 20 años de experiencia en programas de inducción y capacitación industrial. Experto en andragogía (educación para adultos), OSHA, ISO 45001 y sistemas LMS (Learning Management Systems).

CONTEXTO TÉCNICO:
- Industria: Planta industrial con 500+ empleados, 20-30 ingresos nuevos por mes
- Proceso actual: Inducción presencial de 8 horas, presentaciones PowerPoint, evaluaciones en papel
- Contenido requerido: Seguridad industrial, salud ocupacional, medio ambiente, procedimientos de emergencia, EPP, permisos de trabajo, políticas de la empresa
- Problemática: Inducción repetitiva para instructores, sin estandarización, evaluaciones no verificables, sin trazabilidad de quién recibió qué capacitación, riesgo legal por falta de evidencia

TAREA:
Desarrolla una aplicación web completa para gestión digital de inducciones. La aplicación debe:

1. MÓDULO DE CONTENIDO DE INDUCCIÓN:
   - Módulos de inducción obligatorios (8 horas total):
     * Módulo 1: Bienvenida y políticas de la empresa (1 hora)
       - Misión, visión, valores
       - Organigrama y estructura
       - Políticas de conducta, alcohol y drogas
       - Reglamento interno de trabajo
       - Derechos y deberes del trabajador
     * Módulo 2: Seguridad Industrial (2 horas)
       - Peligros y riesgos específicos de la planta
       - EPP requerido por área (casco, lentes, guantes, botas, protección auditiva, respirador)
       - Señalización de seguridad (colores, formas, significados)
       - Zonas clasificadas y restricciones
       - Procedimientos de trabajo seguro
       - Sistema de permisos de trabajo
       - LOTO (bloqueo y etiquetado)
       - Trabajo en altura, espacios confinados, trabajo en caliente
     * Módulo 3: Salud Ocupacional (1 hora)
       - Factores de riesgo (ruido, vibración, químicos, ergonómicos)
       - Exámenes médicos ocupacionales
       - Primeros auxilios básicos
       - Ubicación de botiquines y estaciones de emergencia
     * Módulo 4: Medio Ambiente (1 hora)
       - Política ambiental
       - Gestión de residuos (segregación, RESPEL)
       - Prevención de derrames
       - Reporte de incidentes ambientales
     * Módulo 5: Respuesta a Emergencias (1.5 horas)
       - Plan de emergencia y evacuación
       - Rutas de evacuación y puntos de encuentro
       - Uso de extintores (teoría y práctica)
       - Alarmas y señales de emergencia
       - Números de emergencia
       - Brigadas de emergencia
     * Módulo 6: Procedimientos Específicos del Área (1.5 horas)
       - Procedimientos operacionales del área asignada
       - Equipos específicos y sus riesgos
       - Instrucciones de trabajo aplicables
   - Contenido multimedia:
     * Videos de seguridad
     * Imágenes de EPP y señalización
     * Diagramas de rutas de evacuación
     * Casos de estudio y lecciones aprendidas

2. MÓDULO DE EVALUACIÓN:
   - Evaluación por módulo:
     * 10-15 preguntas por módulo
     * Tipos de preguntas: selección múltiple, verdadero/falso, identificación de imágenes
     * Banco de preguntas aleatorio (diferente en cada intento)
     * Nota mínima de aprobación: 80%
     * Reintentos permitidos: 2 (con retroalimentación)
   - Evaluación final:
     * 30 preguntas de todos los módulos
     * Nota mínima: 85%
     * Certificado digital al aprobar

3. MÓDULO DE REGISTRO Y TRAZABILIDAD:
   - Datos del trabajador:
     * Nombre, RUT/DNI, cargo, área, fecha de ingreso
     * Empresa (propia o contratista)
     * Supervisor directo
   - Registro de inducción:
     * Fecha de inicio y fin
     * Módulos completados
     * Notas por módulo
     * Tiempo dedicado por módulo
     * Firma digital del trabajador
     * Firma digital del instructor
   - Certificado de inducción:
     * Generación automática de certificado PDF
     * Código QR de verificación
     * Validez: 1 año (renovación obligatoria)

4. MÓDULO DE ALERTAS Y RENOVACIONES:
   - Alertas de vencimiento:
     * 60 días antes: Alerta preventiva (planificar renovación)
     * 30 días antes: Alerta urgente (programar renovación)
     * 7 días antes: Alerta crítica (acción inmediata)
     * Vencido: Alerta crítica + bloqueo de acceso
   - Notificaciones:
     * Email al trabajador: "Tu inducción vence en X días"
     * Email al supervisor: "3 empleados de tu área tienen inducción por vencer"
     * Email a RRHH: Reporte semanal de inducciones vencidas

5. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard ejecutivo:
     * Total de empleados inducidos vs. total de empleados
     * % de cumplimiento de inducciones
     * Próximas renovaciones (próximos 30/60/90 días)
     * Promedio de notas por módulo
     * Tiempo promedio de inducción
   - Reportes:
     * Reporte mensual de inducciones realizadas
     * Reporte de empleados con inducción vencida
     * Reporte de efectividad de la inducción (notas promedio)
     * Reporte para auditoría ISO 45001
   - Exportación a PDF/Excel

6. MÓDULO DE ADMINISTRACIÓN:
   - Gestión de contenido:
     * Crear/editar módulos de inducción
     * Agregar preguntas al banco
     * Subir videos e imágenes
   - Gestión de usuarios:
     * Roles: administrador, instructor, supervisor, trabajador
     * Permisos por rol
   - Configuración:
     * Personalización de contenido por empresa/área
     * Configuración de notas mínimas
     * Configuración de alertas

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo LMS (Learning Management System)
- Diseño responsive para desktop, tablets y móviles
- Videos embebidos (YouTube/Vimeo o base64)
- Datos de ejemplo realistas (50 empleados, 6 módulos, 100 preguntas)
- Certificados digitales con QR

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS, QRCode.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Preparado para integración con sistema de RRHH

CRITERIOS DE CALIDAD:
- Sistema robusto para gestión de capacitaciones
- Interfaz intuitiva para trabajadores y administradores
- Evaluaciones seguras y confiables
- Trazabilidad completa para auditorías

ENTREGABLE FINAL:
Sistema integral de inducción digital que estandarice el proceso de inducción, elimine el papel, proporcione trazabilidad completa, mejore la retención del conocimiento y garantice el cumplimiento normativo.`,
              tags: ["inducción", "capacitación", "HSE", "ISO 45001", "LMS", "evaluación"],
              uso: "Por ingreso / Anual (renovación)"
            }
          ]
        },
        {
          id: "cap_charlas",
          nombre: "Charlas de Seguridad (TBT)",
          prompts: [
            {
              id: "cap_charla_001",
              titulo: "Generador de Charlas de Seguridad de 5 Minutos (TBT)",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Especialista en Seguridad Industrial y Behavior Based Safety (BBS) con 15 años de experiencia en programas de charlas de seguridad y cultura de seguridad. Experto en DuPont Bradley Curve, Heinrich Pyramid y metodologías de capacitación para adultos.

CONTEXTO TÉCNICO:
- Industria: Planta industrial con 500+ empleados, 20+ áreas de trabajo
- Frecuencia: Charla diaria de 5 minutos al inicio de cada turno
- Audiencia: Grupos de 5-30 trabajadores (operadores, técnicos, contratistas)
- Problemática: Charlas repetitivas, sin estructura, sin registro, sin seguimiento de temas tratados, sin medición de efectividad, los supervisores no saben qué tema tratar

TAREA:
Desarrolla una aplicación web completa para gestión de charlas de seguridad de 5 minutos. La aplicación debe:

1. MÓDULO DE BANCO DE TEMAS:
   - 365+ temas organizados por categoría (1 tema por día del año):
     * Seguridad General (50 temas): EPP, orden y limpieza, señalización, reportes de incidentes, ergonomía, trabajo en equipo, comunicación de peligros
     * Trabajo en Altura (30 temas): Arnés y línea de vida, andamios, escaleras, plataformas, protección de bordes, rescate en altura
     * Espacios Confinados (25 temas): Identificación, permisos, monitoreo de atmósfera, ventilación, rescate, roles del equipo
     * Trabajo en Caliente (20 temas): Permisos, gas testing, vigilante de fuego, extintores, soldadura segura
     * LOTO (25 temas): Procedimientos, tipos de energía, candados y tags, verificación, errores comunes
     * Manejo de Químicos (30 temas): SGA/GHS, hojas de seguridad, EPP químico, derrames, incompatibilidad, almacenamiento
     * Maquinaria y Equipos (35 temas): Guardas de seguridad, puntos de pellizco, inspección pre-operacional, mantenimiento seguro, energía almacenada
     * Electricidad (25 temas): Riesgo eléctrico, arco eléctrico, EPP dieléctrico, trabajos sin tensión, bloqueo eléctrico
     * Emergencias (25 temas): Evacuación, uso de extintores, primeros auxilios, simulacros, números de emergencia
     * Salud Ocupacional (30 temas): Ruido, estrés térmico, manejo manual de cargas, fatiga, estrés laboral
     * Medio Ambiente (25 temas): Residuos, derrames, emisiones, consumo responsable, reportes ambientales
     * Conducción Segura (25 temas): Manejo defensivo, inspección de vehículos, fatiga al volante, condiciones climáticas
     * Lecciones Aprendidas (25 temas): Casos reales de incidentes, análisis de causas, acciones preventivas
   - Cada tema incluye:
     * Título y objetivo de la charla
     * Puntos clave a discutir (3-5 puntos)
     * Pregunta de apertura para generar participación
     * Ejemplo o caso real (anónimo)
     * Compromiso del equipo (1 acción concreta)
     * Duración estimada: 5 minutos
     * Imágenes o diagramas de apoyo

2. MÓDULO DE CHARLA DIARIA:
   - Selección del tema del día:
     * Automático (según calendario programado)
     * Manual (supervisor elige del banco)
     * Basado en incidentes recientes o temas de actualidad
   - Presentación de la charla:
     * Vista de tarjetas (slide por slide)
     * Timer de 5 minutos
     * Notas para el facilitador
   - Registro de asistencia:
     * Lista de asistentes (nombre, área, firma digital)
     * Número de asistentes
     * Fecha, hora, turno
   - Registro de participación:
     * Preguntas realizadas por el equipo
     * Comentarios y sugerencias
     * Compromisos asumidos
   - Fotografía del grupo (opcional)

3. MÓDULO DE SEGUIMIENTO:
   - Calendario de temas tratados:
     * Evitar repetición de temas en períodos cortos
     * Planificación mensual de temas
   - Historial por área/equipo:
     * Charlas realizadas vs. programadas
     * Temas tratados
     * Asistencia promedio
   - Seguimiento de compromisos:
     * Registro de compromisos asumidos
     * Estado de cumplimiento (pendiente, en progreso, completado)
     * Responsable y fecha límite

4. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard ejecutivo:
     * % de charlas realizadas vs. programadas
     * Asistencia promedio
     * Temas más tratados
     * Compromisos pendientes
   - Reportes:
     * Reporte semanal de charlas realizadas
     * Reporte mensual de participación
     * Reporte de temas tratados por área
     * Reporte para auditoría ISO 45001
   - Exportación a PDF/Excel

5. MÓDULO DE ADMINISTRACIÓN:
   - Gestión de temas:
     * Crear/editar temas de charlas
     * Agregar imágenes y diagramas
     * Categorizar temas
   - Gestión de usuarios:
     * Roles: administrador, supervisor, trabajador
     * Permisos por rol
   - Configuración:
     * Programación automática de temas
     * Configuración de turnos y áreas
     * Configuración de alertas

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo presentación interactiva
- Diseño responsive optimizado para tablets (uso en campo)
- Timer integrado de 5 minutos
- Datos de ejemplo realistas (365 temas, 20 áreas, 6 meses de historial)
- Banco de temas precargado

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia

CRITERIOS DE CALIDAD:
- Sistema robusto para gestión de charlas diarias
- Interfaz intuitiva para supervisores
- Contenido de alta calidad y relevancia
- Trazabilidad completa para auditorías

ENTREGABLE FINAL:
Sistema integral de charlas de seguridad que elimine la improvisación, asegure la cobertura de todos los temas críticos, registre la participación, mida la efectividad y mejore continuamente la cultura de seguridad.`,
              tags: ["charlas de seguridad", "TBT", "Tool Box Talk", "BBS", "5 minutos", "capacitación"],
              uso: "Diario / Inicio de turno"
            }
          ]
        }
      ]
    }
  ]
};
