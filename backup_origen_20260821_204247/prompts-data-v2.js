/* ============================================================
   BIBLIOTECA DE PROMPS INDUSTRIALES — PROMPTS DATA V2 v3.3 (ULTRA PRO)
   Módulo 3: Extensiones Avanzadas de Oil & Gas, Automatización y Capacitación
   ============================================================ */

const PROMPTS_DB_V2 = {
  categorias: [
    {
      id: 'oil_gas_v2',
      nombre: 'Oil & Gas Avanzado',
      icono: '🛢️',
      color: '#e65100',
      descripcion: 'Sistemas avanzados de gestión de paradas de planta y control de corrosión',
      subcategorias: [
        {
          id: 'og_paradas',
          nombre: 'Gestión de Paradas de Planta',
          prompts: [
            {
              id: 'og_par_001',
              titulo: 'Sistema de Gestión de Paradas de Planta (Shutdown/Turnaround)',
              categoria: 'Aplicación Web',
              prioridad: 'critica',
              uso: 'Diario',
              tags: ['Paradas de Planta', 'Turnaround', 'Shutdown', 'Ruta Crítica', 'Curva S', 'Mantenimiento Mayor', 'Gantt'],
              prompt:
                'ACTÚA COMO: Director de Paradas de Planta y Grandes Mantenimientos (Turnaround / Shutdown Manager) con 25 años de experiencia liderando eventos mayores de mantenimiento (Turnarounds de más de $50M USD y 500,000 HH) en refinerías y complejos petroquímicos. Certificado PMP, experto en metodología de gestión de paradas (Modelo de 5 Fases: Estrategia, Definición, Planificación, Ejecución y Cierre) y control de proyectos por Ruta Crítica (CPM) y Valor Ganado (EVM). Desarrollador de dashboards de control de avance de proyectos en tiempo real.\n\nCONTEXTO TÉCNICO:\n- Parada Mayor de Refinería (Unidad de Craqueo Catalítico FCCU / Hidrotratamiento HDT) con duración programada de 35 días, 1,500 órdenes de trabajo, 45 equipos mayores intervenidos simultáneamente (Columnas de fraccionamiento, Reactores, Hornos, Compresores) y 1,200 trabajadores contratistas por turno.\n- Objetivo Crítico: Control estricto de la Ruta Crítica (Critical Path), avance físico real vs. programado (Curva S), control de costos, seguridad cero accidentes y cumplimiento de la ventana de parada para evitar sobrecostos por lucro cesante ($1M USD/día de retraso).\n\nTAREA:\nDesarrolla una aplicación web completa y profesional en un solo archivo HTML/CSS/JavaScript para el Control Diario, Seguimiento de Ruta Crítica y Curva S de Avance en Paradas de Planta (Turnaround Management System).\n\nMÓDULOS DEL SISTEMA Y METODOLOGÍA DE CONTROL:\n\n1. ESTRUCTURA DE DESGLOSE DE TRABAJO (WBS / EDT) Y RUTA CRÍTICA:\n   - Registro de Actividades: Código WBS (ej. 1.2.4.01), Equipo / Tag, Descripción de la Tarea, Disciplina (Mecánica, Piping, Electricidad, Instrumentación, Refractario, Aislamiento), Horas-Hombre Estimadas, Duración Programada (hrs/días), Predecesoras, Indicador de Ruta Crítica (Yes/No), Responsable / Empresa Contratista.\n   - Diagrama de Gantt Interactivo renderizado en Canvas nativo que resalta la Ruta Crítica en color rojo brillante y permite la actualización visual del % de avance real.\n\n2. MOTOR DE CÁLCULO DE VALOR GANADO (EVM) Y CURVA S DE PROYECTO:\n   - Métricas de Valor Ganado según PMI / ISO 21500:\n     * Valor Planificado ($PV$ - Planned Value): Horas planificadas acumuladas a la fecha.\n     * Valor Ganado ($EV$ - Earned Value): Horas ganadas reales ($EV = \\sum (\\text{HH Presupuestadas}_i \\times \\%\\text{Avance Real}_i)$).\n     * Costo Real ($AC$ - Actual Cost): Horas-Hombre reales consumidas.\n     * Índice de Desempeño del Cronograma ($SPI = EV / PV$).\n     * Índice de Desempeño del Costo ($CPI = EV / AC$).\n     * Estimación al Término ($EAC$ en días y costo proyectado).\n   - Generación gráfica de la Curva S Interactiva (Curva Base Planificada vs. Curva Real Ganada vs. Pronóstico de Término) con Canvas.\n\n3. CONTROL DE TRABAJOS DE DESCUBRIMIENTO (DISCOVERY WORK / SCOPE CREEP):\n   - Registro de Hallazgos Inesperados al abrir recipientes/tuberías: Evaluación de impacto en la ruta crítica, horas adicionales requeridas, proceso formal de aprobación de cambio de alcance (MOC).\n\n4. PERSISTENCIA, CONTROL DE TURNOS Y REPORTES:\n   - Base de datos local en IndexedDB para funcionamiento offline ininterrumpido en la sala de guerra de la parada (War Room).\n   - Generación automática del Informe Diario de Turno de Parada (Daily Shift Turnaround Report) en formato PDF A4 listo para distribución a la gerencia ejecutiva.\n\nDISEÑO:\n- UI Dark War Room (#0b0f19, #151d30, acentos rojo crítico #ef4444, ámbar #f59e0b y cian #06b6d4). Código limpio, completo y sin dependencias externas.',
            },
            {
              id: 'og_corr_001',
              titulo: 'Sistema de Monitoreo y Gestión de Corrosión',
              categoria: 'Aplicación Web',
              prioridad: 'alta',
              uso: 'Semanal',
              tags: ['Corrosión', 'NACE', 'Cupones', 'ER Probes', 'Inhibidores', 'H2S', 'CO2', 'Integridad'],
              prompt:
                'ACTÚA COMO: Especialista Principal en Corrosión e Integridad de Materiales en Petróleo y Gas con certificación NACE / AMPP Corrosion Specialist y más de 20 años de experiencia. Experto en mecanismos de corrosión por $CO_2$ (Sweet Corrosion - Modelo de De Waard / Milliams), corrosión por $H_2S$ (Sour Corrosion / Sulfide Stress Cracking - NACE MR0175/ISO 15156), monitoreo electroquímico en línea (Linear Polarization Resistance - LPR, Electrical Resistance - ER probes), cupones de corrosión gravimétricos y dosificación de inhibidores químicos.\n\nCONTEXTO TÉCNICO:\n- Red de recolección de gas amargo y crudo con 80 puntos de monitoreo de corrosión instalados en cabezas de pozo, manifolds y ductos de transporte.\n- Variables Clave: Tasa de corrosión en tiempo real (mpy - mils per year o mm/año), concentración de $H_2S$, $CO_2$, temperatura, corte de agua (% BSW), velocidad de flujo, dosificación de inhibidor de corrosión (ppm) y eficiencia de inhibición.\n\nTAREA:\nDesarrolla una aplicación web completa y autónoma en un único archivo HTML/CSS/JavaScript para el Monitoreo, Cálculo de Tasas de Corrosión y Gestión de Inhibidores según estándares NACE / AMPP.\n\nMÓDULOS DEL SISTEMA Y CÁLCULOS RIGUROSOS DE CORROSIÓN:\n\n1. BASE DE DATOS DE PUNTOS DE MONITOREO Y SONDAS:\n   - Ficha de Punto de Monitoreo: ID Punto (ej. MP-CORR-012), Línea / Ducto, Material de Tubería, Tipo de Monitoreo (Cupón Gravimétrico de Pérdida de Peso, Sonda de Resistencia Eléctrica ER, Sonda LPR, Medidor de Hidrógeno).\n   - Datos de Cupón de Corrosión: N° de Serie del Cupón, Material (Acero al Carbono AISI 1018), Área Expuesta ($A$ en $in^2$ o $cm^2$), Peso Inicial ($W_i$ en gramos), Peso Final post-limpieza ácida según ASTM G1 ($W_f$ en gramos), Días de Exposición ($t$).\n\n2. MOTOR DE CÁLCULO DE TASAS DE CORROSIÓN:\n   - Cálculo de Tasa de Corrosión por Cupones Gravimétricos ($CR$ en mpy según ASTM G4):\n     $$CR = \\frac{534 \\times (W_i - W_f) \\; [\\text{mg}]}{\\text{Densidad} \\; [\\text{g/cm}^3] \\times \\text{Área} \\; [\\text{in}^2] \\times \\text{Tiempo} \\; [\\text{horas}]}$$\n   - Clasificación de Severidad según NACE SP0775:\n     * Baja: $< 1.0\\text{ mpy}$ (0.025 mm/año).\n     * Moderada: $1.0 - 4.9\\text{ mpy}$.\n     * Alta: $5.0 - 9.9\\text{ mpy}$.\n     * Severa: $\\ge 10.0\\text{ mpy}$ (Acción Inmediata Requerida).\n   - Cálculo de Eficiencia de Inhibidor de Corrosión ($EI$ %):\n     $$EI = \\left(\\frac{CR_{\\text{sin inhibidor}} - CR_{\\text{con inhibidor}}}{CR_{\\text{sin inhibidor}}}\\right) \\times 100$$\n   - Monitoreo de Residual de Inhibidor en Agua de Producción (Concentración en ppm medida en laboratorio vs. Dosis de Inyección recomendada).\n\n3. MAPA DE CORROSIÓN Y MATRIZ DE RIESGO:\n   - Visualización de la red de tuberías con mapa de calor por severidad de corrosión (Verde, Amarillo, Naranja, Rojo).\n   - Gráficos interactivos de evolución histórica de la tasa de corrosión vs. tasa de inyección de químico inhibidor en Canvas.\n\n4. PERSISTENCIA Y EXPORTACIÓN:\n   - Almacenamiento local seguro en IndexedDB con soporte para importar y exportar datos en JSON.\n   - Generación de Informe Técnico Trimestral de Gestión de Corrosión en PDF A4.\n\nDISEÑO:\n- UI Dark Metallurgy (#0f172a, #1a273a, acentos cobre #d97706 y cian #38bdf8). Código completo sin omisiones.',
            },
          ],
        },
      ],
    },
    {
      id: 'automatizacion_v2',
      nombre: 'Automatización Avanzada',
      icono: '⚡',
      color: '#ff6f00',
      descripcion: 'Sistemas avanzados de inspección por QR y control de residuos',
      subcategorias: [
        {
          id: 'auto_extintores',
          nombre: 'Alertas de Extintores',
          prompts: [
            {
              id: 'auto_ext_001',
              titulo: 'Sistema de Alertas y Gestión de Extintores con Lector QR',
              categoria: 'Aplicación Web',
              prioridad: 'critica',
              uso: 'Mensual',
              tags: ['Extintores', 'QR', 'NFPA 10', 'Inspección Móvil', 'Alertas', 'Contra Incendio', 'Seguridad'],
              prompt:
                'ACTÚA COMO: Ingeniero Senior de Protección Contra Incendios y Desarrollador Web Móvil especializado en aplicaciones de campo para brigadas de emergencia. Especialista en la norma NFPA 10 y en la implementación de sistemas de trazabilidad mediante Códigos QR y geolocalización de equipos de respuesta a emergencias.\n\nCONTEXTO:\n- La brigada de emergencias y los inspectores HSE realizan inspecciones mensuales de extintores en una planta industrial extensa. Necesitan una herramienta web móvil de alta velocidad que permita escanear la etiqueta QR de cada extintor con la cámara del teléfono, registrar la inspección en 30 segundos y generar alertas instantáneas de vencimiento sin conexión a internet.\n\nTAREA:\nDesarrolla una aplicación web completa y responsive en un único archivo HTML/CSS/JavaScript optimizada para smartphones y tablets que incluya Escáner de Códigos QR por Cámara Web, Registro de Inspección NFPA 10 y Motor de Alertas.\n\nMÓDULOS DEL SISTEMA:\n\n1. ESCÁNER QR INTEGRADO Y BÚSQUEDA RÁPIDA:\n   - Lector QR nativo mediante la API de cámara del navegador (MediaDevices.getUserMedia) o carga de imagen QR con fallback a búsqueda rápida por Tag alfanumérico.\n   - Generador de Códigos QR descargables para imprimir y pegar en los extintores de planta.\n\n2. FORMULARIO DE INSPECCIÓN RÁPIDO DE CAMPO (CHECKLIST 1-TOUCH):\n   - Verificación táctil con interruptores grandes (Pasa / Falla): Presión en rango verde, precinto intacto, manguera sin fisuras, señalética visible, acceso despejado, soporte firme.\n   - Captura de foto de evidencia en caso de no conformidad.\n   - Actualización automática de la fecha de última inspección y cálculo del próximo vencimiento a 30 días.\n\n3. MOTOR DE ALERTAS Y SEMÁFORO:\n   - Panel de control con clasificación por colores: Vigentes (Verde), Por Vencer en 7 días (Amarillo), Vencidos / No Inspeccionados (Rojo), Rechazados (Negro con alerta visual).\n   - Generador de listas de reemplazo para el taller de recarga.\n\n4. PERSISTENCIA OFFLINE Y EXPORTACIÓN:\n   - Almacenamiento local en IndexedDB con soporte para guardar cientos de inspecciones sin red.\n   - Exportación de la base de extintores a Excel/CSV e informe de inspección mensual en PDF.\n\nDISEÑO:\n- UI Mobile-First Dark (#111827, #1f2937, acentos rojo alarma #ef4444 y verde #10b981) con touch targets mínimos de 56px para uso cómodo con una sola mano.',
            },
          ],
        },
        {
          id: 'auto_respel',
          nombre: 'Gestión de RESPEL',
          prompts: [
            {
              id: 'auto_respel_001',
              titulo: 'Sistema de Gestión de Residuos Peligrosos (RESPEL) Avanzado',
              categoria: 'Aplicación Web',
              prioridad: 'critica',
              uso: 'Semanal',
              tags: ['RESPEL', 'Medio Ambiente', 'Manifiestos', 'Trazabilidad', 'Alertas', 'ISO 14001', 'Economía Circular'],
              prompt:
                'ACTÚA COMO: Auditor Líder Ambiental ISO 14001 e Ingeniero de Gestión de Residuos Industriales con 20 años de experiencia en minería y química pesada. Experto en normativas de sustancias y residuos peligrosos, trazabilidad de cadena de custodia, balance de masa de residuos y sistemas de minimización de huella ambiental.\n\nCONTEXTO:\n- Complejo industrial que requiere una plataforma avanzada para el seguimiento desde el punto de generación en talleres/plantas hasta la recepción del certificado de disposición final emitido por el destinatario autorizado.\n\nTAREA:\nDesarrolla una aplicación web completa y autónoma en un único archivo HTML/CSS/JavaScript para el Control Integral de la Cadena de Custodia, Declaraciones Ambientales y Alertas de Residuos Peligrosos (RESPEL).\n\nMÓDULOS DEL SISTEMA:\n\n1. REGISTRO DE GENERACIÓN Y ETIQUETADO DIGITAL:\n   - Registro de Tambores/IBCs con generación de etiqueta estándar con código de barras/QR, pictogramas de peligro SGA/GHS, código de residuo, fecha de envasado y responsable de área.\n   - Matriz de balance de masa: Generación mensual por área vs. Límites máximos autorizados en la Declaración de Impacto Ambiental (DIA/EIA).\n\n2. GESTIÓN DE ALMACENAMIENTO TEMPORAL Y BAHÍAS:\n   - Mapa interactivo de la bodega RESPEL con capacidad volumétrica por bahía, control de pretiles de contención y verificación de incompatibilidad química.\n   - Alerta automática de permanencia: Contador regresivo individual de días restantes para cumplir con el plazo legal máximo de almacenamiento (180 días).\n\n3. GESTIÓN DE DESPACHOS Y MANIFIESTOS DE CARGA:\n   - Generación de Manifiesto de Carga y Transporte de Residuos Peligrosos con datos del transportista, chofer, patente, ruta autorizada y planta de tratamiento final.\n   - Control de cierre de ciclo: Marcado de recepción conforme y carga del N° de Certificado de Destrucción / Confinamiento.\n\n4. PERSISTENCIA Y REPORTABILIDAD:\n   - Base de datos IndexedDB con exportación a Excel/CSV y generación del Informe Anual Consolidado de Declaración de Residuos en PDF.\n\nDISEÑO:\n- UI Dark Forest (#0b1912, #14291f, acentos verde brillante #059669 y ámbar #d97706). 100% funcional y completo.',
            },
          ],
        },
      ],
    },
    {
      id: 'capacitacion_v2',
      nombre: 'Capacitación Avanzada',
      icono: '🎓',
      color: '#00897b',
      descripcion: 'Sistemas avanzados de inducción gamificada y charlas interactivas',
      subcategorias: [
        {
          id: 'cap_induccion_v2',
          nombre: 'Inducción de Personal',
          prompts: [
            {
              id: 'cap_ind_v2_001',
              titulo: 'Sistema Digital de Inducción de Personal Nuevo con Gamificación',
              categoria: 'Aplicación Web',
              prioridad: 'alta',
              uso: 'Diario',
              tags: ['Inducción', 'Gamificación', 'HSE', 'Evaluación Dinámica', 'Pases de Acceso', 'LMS', 'Onboarding'],
              prompt:
                'ACTÚA COMO: Diseñador Instruccional Senior y Desarrollador Fullstack de Plataformas Educativas Industriales con 20 años de experiencia. Experto en gamificación aplicada a la seguridad industrial (Serious Games), micro-aprendizaje y retención del conocimiento en entornos de alto riesgo.\n\nCONTEXTO:\n- Proceso de inducción interactivo para nuevos trabajadores que sustituye las presentaciones pasivas tradicionales por una experiencia dinámica con módulos interactivos, desafíos de identificación de peligros en escenarios simulados y evaluación final gamificada.\n\nTAREA:\nDesarrolla una aplicación web completa y profesional en un solo archivo HTML/CSS/JavaScript que funcione como una Plataforma Gamificada de Inducción de Seguridad en Planta.\n\nMÓDULOS DEL SISTEMA:\n\n1. REGISTRO Y PERFIL DEL PARTICIPANTE:\n   - Registro de trabajador, asignación de avatar y selección de área operativa.\n   - Barra de progreso interactiva con puntos de experiencia (XP) y medallas de seguridad por cada módulo superado.\n\n2. MÓDULOS DE APRENDIZAJE INTERACTIVOS:\n   - Simulación 1: "Encuentra los 5 Peligros Ocultos" en un entorno interactivo en Canvas (Trabajo en altura sin arnés, cable pelado, derrame de químico, extintor bloqueado, operario sin casco).\n   - Simulación 2: "Secuencia Correcta de Bloqueo LOTO" con mecánica de arrastrar y soltar (Drag & Drop) de candados y tarjetas.\n   - Simulación 3: "Selección del EPP Correcto" según el escenario de riesgo presentado.\n\n3. EVALUACIÓN FINAL Y PASAPORTE DE SEGURIDAD:\n   - Cuestionario dinámico de 15 preguntas con límite de tiempo y puntaje mínimo aprobatorio del 85%.\n   - Emisión del Pasaporte de Seguridad Digital descargable en PDF con código QR verificable y medallas obtenidas.\n\n4. PERSISTENCIA Y PANEL DEL INSTRUCTOR:\n   - Base de datos local en IndexedDB con histórico de calificaciones y tiempos de finalización.\n   - Exportación de actas de inducción en Excel y PDF para auditorías de RRHH y HSE.\n\nDISEÑO:\n- UI Dark Cyber-Academy (#0f172a, #1e293b, acentos violeta #8b5cf6 y esmeralda #10b981). Código completo y sin dependencias externas.',
            },
          ],
        },
        {
          id: 'cap_charlas_v2',
          nombre: 'Charlas de Seguridad (TBT)',
          prompts: [
            {
              id: 'cap_charla_v2_001',
              titulo: 'Generador de Charlas de Seguridad de 5 Minutos (TBT) con Banco de Preguntas',
              categoria: 'Herramienta',
              prioridad: 'alta',
              uso: 'Diario',
              tags: ['TBT', 'Charlas de Seguridad', 'Evaluación Rápida', 'HSE', 'Participación', 'Liderazgo', 'Prevención'],
              prompt:
                'ACTÚA COMO: Facilitador Experto en Dinámicas de Grupo y Prevención de Riesgos Laborales con 20 años de trayectoria en minería y construcción pesada. Especialista en técnicas de indagación apreciativa, diálogos reflexivos de seguridad y evaluación rápida de comprensión en campo.\n\nCONTEXTO:\n- Los líderes de grupo necesitan no solo exponer la charla de 5 minutos, sino también interactuar activamente con su equipo mediante preguntas rápidas de verificación para asegurar que los conceptos críticos fueron realmente comprendidos antes de iniciar los trabajos.\n\nTAREA:\nDesarrolla una aplicación web interactiva completa en un único archivo HTML/CSS/JavaScript que funcione como un Generador de Charlas TBT con Módulo de Preguntas de Reflexión y Registro Digital de Participación.\n\nMÓDULOS DEL SISTEMA:\n\n1. GENERADOR DE CONTENIDOS TBT PARAMÉTRICO:\n   - Más de 25 temas de seguridad industrial estructurados por riesgo operacional (Izajes, Excavaciones, Trabajo en Caliente, Manejo Manual de Cargas, Herramientas Manuales y de Poder, Exposición al Ruido, Químicos Peligrosos).\n   - Cada charla incluye: Introducción basada en un hecho real, Peligro y Consecuencia, 3 Controles Críticos Innegociables, y 3 Preguntas de Reflexión Abiertas para el equipo.\n\n2. MÓDULO DE INTERACCIÓN Y DINÁMICA DE GRUPO:\n   - Ruleta digital o selector aleatorio de trabajador para responder las preguntas de reflexión y fomentar la participación equitativa.\n   - Temporizador de 5 minutos con alarma sonora visual al concluir el tiempo.\n\n3. REGISTRO DIGITAL DE ASISTENCIA Y COMPROMISO:\n   - Formulario rápido de asistencia con lista de nombres y captura de firmas en Canvas.\n   - Registro del "Compromiso del Día" acordado por la cuadrilla.\n   - Almacenamiento en IndexedDB y generación de comprobante de charla en PDF A4 listo para auditoría.\n\nDISEÑO:\n- UI Dark Modern (#090d16, #141b2d, acentos en naranja de seguridad #f97316 y verde #22c55e). Código limpio, modular y 100% completo.',
            },
          ],
        },
      ],
    },
  ],
};
