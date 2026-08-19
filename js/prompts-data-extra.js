/* ============================================================
   BIBLIOTECA DE PROMPS INDUSTRIALES — PROMPTS DATA EXTRA v3.3 (ULTRA PRO)
   Módulo 2: Automatización, Alertas y Capacitación Industrial
   ============================================================ */

const PROMPTS_DB_EXTRA = {
  categorias: [
    {
      id: 'automatizacion',
      nombre: 'Automatización y Alertas',
      icono: '⚡',
      color: '#ff6f00',
      descripcion: 'Sistemas de monitoreo proactivo, alertas preventivas y notificaciones automatizadas',
      subcategorias: [
        {
          id: 'auto_alertas_mant',
          nombre: 'Alertas de Mantenimiento',
          prompts: [
            {
              id: 'auto_mant_001',
              titulo: 'Sistema de Alertas de Mantenimiento de Vehículos y Flota',
              categoria: 'Aplicación Web',
              prioridad: 'alta',
              uso: 'Diario',
              tags: ['Flota', 'Vehículos', 'Mantenimiento Preventivo', 'Kilometraje', 'Horómetro', 'Alertas', 'ISO 55000'],
              prompt:
                'ACTÚA COMO: Gerente de Mantenimiento de Flota de Transporte y Maquinaria Pesada con 20 años de experiencia en minería, logística y construcción. Auditor ISO 55001 y especialista en mantenimiento predictivo y preventivo basado en uso (telemetría, kilometraje y horómetros). Desarrollador de aplicaciones web progresivas de gestión de activos de transporte.\n\nCONTEXTO TÉCNICO:\n- Flota heterogénea de 120 activos: Camionetas 4x4 de faena, camiones tolva, buses de transporte de personal, generadores móviles y grúas horquilla.\n- Desafío Operativo: Prevenir fallas catastróficas por sobrepaso de límites de servicio (cambios de aceite, correas de distribución, revisión de frenos, inspecciones técnicas legales y seguros obligatorios).\n\nTAREA:\nDesarrolla una aplicación web completa y autónoma en un único archivo HTML/CSS/JavaScript para el Control de Flota, Monitoreo de Odómetros/Horómetros y Disparo Automatizado de Alertas Preventivas.\n\nMÓDULOS DEL SISTEMA Y REGLAS DE NEGOCIO:\n\n1. CATÁLOGO DE ACTIVOS Y PAUTAS DE MANTENIMIENTO:\n   - Registro de Vehículo: Patente/Placa, N° Interno, Tipo (Camioneta, Camión, Bus, Maquinaria), Marca/Modelo, Año, Centro de Costos, Conductor Asignado, Odómetro/Horómetro Actual, Fecha de Última Actualización.\n   - Matriz de Pautas de Servicio (Planes de Mantenimiento):\n     * Servicio Menor (Pauta A): Cada 10,000 km o 250 hrs (Aceite de motor, filtros de aceite/aire, inspección de 30 puntos).\n     * Servicio Mayor (Pauta B): Cada 40,000 km o 1,000 hrs (Fluidos de transmisión, diferenciales, refrigerante, frenos, suspensión).\n     * Mantenimiento Mayor (Pauta C): Cada 100,000 km (Kit de distribución, bomba de agua, inyectores).\n     * Vencimientos Legales/Documentales: Revisión Técnica / ITV, Permiso de Circulación, Seguro Obligatorio (SOAT/Seguro de Faena), Extintor vehicular.\n\n2. MOTOR INTELIGENTE DE CÁLCULO DE ALERTAS Y PROYECCIÓN:\n   - Cálculo del Promedio Diario de Kilometraje / Horas de Operación ($KPD$ / $HPD$):\n     $$KPD = \\frac{Km_{actual} - Km_{inicial}}{\\text{Días transcurridos}}$$\n   - Proyección de Fecha Estimada de Próximo Servicio:\n     $$\\text{Días Restantes} = \\frac{Km_{pauta} - Km_{actual}}{KPD}$$\n   - Clasificación Dinámica de Alertas en 4 Niveles:\n     * Verde (Normal): Restan > 1,500 km o > 15 días.\n     * Amarillo (Próximo): Restan entre 500 y 1,500 km o entre 7 y 14 días (Planificar ingreso a taller).\n     * Naranja (Urgente): Restan < 500 km o < 7 días (Coordinar parada inmediata).\n     * Rojo (Vencido / Fuera de Rango): $Km_{actual} \\ge Km_{pauta}$ o fecha vencida (BLOQUEO OPERACIONAL RECOMENDADO).\n\n3. BANDEJA DE ALERTAS PROACTIVAS Y NOTIFICACIONES:\n   - Centro de notificaciones visuales y auditivas con sintetizador Web Audio API para alertas críticas.\n   - Generación de Órdenes de Trabajo (OT) automáticas al cambiar el estado a Urgente o Vencido.\n\n4. PERSISTENCIA, ANALÍTICA Y EXPORTACIÓN:\n   - Base de datos IndexedDB para manejo offline completo de toda la flota.\n   - Dashboard de KPIs: % Cumplimiento del Plan Preventivo, Flota Operativa vs. En Taller, Costo acumulado de mantenimiento por activo.\n   - Exportación de la matriz de flota a Excel/CSV y reporte de estado de flota en PDF imprimible.\n\nDISEÑO:\n- UI Dark Dashboard (#0f172a, #1e293b, acento ámbar #f59e0b y azul #38bdf8). Código monolítico 100% funcional y completo.',
            },
            {
              id: 'auto_mant_002',
              titulo: 'Sistema de Alertas de Mantenimiento de Extintores y Equipos Contra Incendio',
              categoria: 'Aplicación Web',
              prioridad: 'critica',
              uso: 'Mensual',
              tags: ['Extintores', 'NFPA 10', 'Contra Incendio', 'Seguridad', 'HSE', 'Inspección', 'Alertas', 'Prueba Hidrostática'],
              prompt:
                'ACTÚA COMO: Ingeniero Especialista en Protección Contra Incendios y Seguridad Humana con 20 años de experiencia en instalaciones industriales y plantas de procesos. Certificado en normas NFPA 10 (Standard for Portable Fire Extinguishers), NFPA 25 (Inspection, Testing, and Maintenance of Water-Based Fire Protection Systems) y NFPA 72. Desarrollador web enfocado en cumplimiento normativo y trazabilidad de activos críticos de emergencia.\n\nCONTEXTO TÉCNICO Y NORMATIVO:\n- Complejo industrial con más de 300 extintores portátiles y rodantes (PQS ABC, $CO_2$, Acetato de Potasio Clase K, Agua Desmineralizada) y 40 gabinetes de mangueras contra incendio.\n- Exigencias Mandatorias NFPA 10:\n  * Inspección Visual Mensual (30 días).\n  * Mantenimiento Anual en Taller Autorizado (1 año).\n  * Prueba Hidrostática Periódica de Cilindros (cada 5 años para $CO_2$ y agua, cada 12 años para PQS con cilindro de acero).\n\nTAREA:\nDesarrolla una aplicación web completa y autónoma en un único archivo HTML/CSS/JavaScript para el Control, Inspección y Gestión Automatizada de Alertas de Extintores y Equipos Contra Incendio según NFPA 10.\n\nMÓDULOS DEL SISTEMA Y REGLAS DE NEGOCIO NFPA 10:\n\n1. REGISTRO Y CATASTRO DETALLADO DE EXTINTORES:\n   - Datos de Identificación: N° de Extintor (Tag / QR), Ubicación Exacta (Área, Nave, Columna, Nivel), Tipo de Agente (PQS, $CO_2$, Clase K, Espuma AFFF), Capacidad (kg / lbs), Clasificación de Fuego (4A:80B:C, etc.), Fabricante, N° de Serie del Cilindro, Fecha de Fabricación del Cilindro.\n   - Historial de Vencimientos: Fecha de Última Recarga, Fecha de Vencimiento de Recarga (1 año), Fecha de Última Prueba Hidrostática, Fecha de Vencimiento de Prueba Hidrostática.\n\n2. CHECKLIST DE INSPECCIÓN MENSUAL RÁPIDA (NFPA 10 Secc. 7.2):\n   - Inspección en Campo: Extintor visible y sin obstáculos (acceso libre), señalética adecuada y altura correcta (máximo 1.5m suelo), pasador de seguridad y sello de precinto intactos, manómetro en zona verde (presión nominal correcta), manguera y tobera libres de grietas y obstrucciones, cilindro sin corrosión ni abolladuras mecánicas, tarjeta de control física legible y firmada.\n   - Lógica de Rechazo Inmediato: Si el manómetro está en zona roja o el precinto está roto, clasificar como "NO APTO / REQUIERE REEMPLAZO INMEDIATO" y disparar alerta al supervisor de HSE.\n\n3. MOTOR DE ALERTAS Y SEMÁFORO DE CADUCIDAD:\n   - Panel de control con alertas divididas en 3 niveles temporales:\n     * Alerta Mensual: Extintores no inspeccionados en los últimos 30 días.\n     * Alerta Anual: Extintores con recarga anual vencida o a vencer en <30 días.\n     * Alerta Hidrostática: Cilindros con prueba hidrostática vencida o a vencer en el año en curso.\n   - Notificaciones proactivas y filtro por áreas de planta para programar lotes de recarga por rotación.\n\n4. MAPA DE PLANTA, PERSISTENCIA Y EXPORTACIÓN:\n   - Mapa interactivo de planta en SVG/Canvas donde los extintores aparecen como pines interactivos que cambian de color según su estado de salud (Verde, Amarillo, Rojo).\n   - Base de datos IndexedDB para inspección en campo sin conexión a internet.\n   - Generación de Informe de Inspección Mensual para Auditoría y Bomberos en formato PDF con firma digital del inspector.\n\nDISEÑO:\n- UI Dark Fire Safety (#111827, #1f2937, acentos rojo fuego #ef4444 y verde #22c55e). Código limpio, completo y 100% funcional.',
            },
          ],
        },
        {
          id: 'auto_alertas_compras',
          nombre: 'Alertas de Compras y Abastecimiento',
          prompts: [
            {
              id: 'auto_comp_001',
              titulo: 'Sistema de Alertas de Solicitudes de Compra y Órdenes de Compra',
              categoria: 'Aplicación Web',
              prioridad: 'alta',
              uso: 'Diario',
              tags: ['Compras', 'Supply Chain', 'Órdenes de Compra', 'Lead Time', 'Stock Crítico', 'Alertas', 'Abastecimiento'],
              prompt:
                'ACTÚA COMO: Gerente de Cadena de Suministro y Abastecimiento Industrial (Supply Chain Director) con 20 años de experiencia en industrias de procesos continuos. Especialista en gestión de compras estratégicas, control de Lead Time, gestión de repuestos críticos para paradas de planta y mitigación del efecto Bullwhip. Desarrollador de software de aprovisionamiento.\n\nCONTEXTO:\n- Operación industrial que gestiona cientos de Solicitudes de Pedido (SolPed / Requisiciones) y Órdenes de Compra (OC) para repuestos críticos, consumibles, servicios especializados y contratos marco.\n- Riesgo Operacional: Detención imprevista de producción por desabastecimiento de repuestos críticos no gestionados dentro del Lead Time del proveedor.\n\nTAREA:\nDesarrolla una aplicación web completa y autónoma en un único archivo HTML/CSS/JavaScript para el Seguimiento, Control de Lead Times y Disparo Automatizado de Alertas de Solicitudes y Órdenes de Compra.\n\nMÓDULOS DEL SISTEMA Y REGLAS DE NEGOCIO:\n\n1. MATRIZ DE REQUISICIONES Y ÓRDENES DE COMPRA:\n   - Ficha de Compra: N° SolPed / N° OC, Código de Material / Servicio, Descripción, Categoría (MRO, Químicos, Eléctrico, Mecánico, EPP, Servicios), Criticidad del Ítem (Crítico para Planta, Operacional, General), Proveedor Asignado, Cantidad, Unidad, Monto Estimado/Real (USD), Solicitante, Centro de Costos.\n   - Cronograma y Trazabilidad: Fecha de Creación SolPed, Fecha de Aprobación Técnica, Fecha de Emisión OC, Fecha de Entrega Comprometida por Proveedor (Promised Date), Fecha de Entrega Real en Almacén.\n\n2. MOTOR DE CÁLCULO DE TIEMPOS DE CICLO Y LEAD TIMES:\n   - Lead Time Total del Proceso ($LTT$):\n     $$LTT = \\text{Tiempo Interno de Aprobación} + \\text{Lead Time del Proveedor} + \\text{Tiempo de Tránsito/Aduana}$$\n   - Cálculo de Desviación de Entrega (Delivery Delay):\n     $$\\Delta t = \\text{Fecha Actual} - \\text{Fecha Prometida}$$\n   - Indicador de Desempeño del Proveedor (On-Time In-Full - OTIF %):\n     $$OTIF = \\frac{\\text{Órdenes Entregadas a Tiempo y Completas}}{\\text{Total de Órdenes Recibidas}} \\times 100$$\n\n3. SISTEMA DE ALERTAS TEMPRANAS POR ETAPAS:\n   - Alerta Etapa 1 (Cuello de Botella Interno): SolPed sin aprobación técnica tras > 5 días hábiles.\n   - Alerta Etapa 2 (Demora de Adjudicación): SolPed aprobada sin OC emitida tras > 7 días.\n   - Alerta Etapa 3 (Alerta Preventiva de Entrega): OC pendiente con fecha prometida en los próximos 5 días (Disparar recordatorio al comprador para seguimiento con proveedor).\n   - Alerta Etapa 4 (OC Vencida / En Retraso): Fecha actual > Fecha prometida sin recepción en almacén (Escalamiento automático por criticidad).\n\n4. DASHBOARD ANALÍTICO Y EXPORTACIÓN:\n   - KPIs en tiempo real: Gasto total comprometido (USD), Número de OCs en riesgo crítico, OTIF promedio por proveedor, Tiempo promedio de ciclo SolPed-a-Recepción.\n   - Base de datos IndexedDB para persistencia local offline.\n   - Exportación de la matriz de seguimiento a Excel/CSV y generación de informes de gestión en PDF.\n\nDISEÑO:\n- UI Dark Supply Chain (#0e1726, #1b2e4b, acentos en cian #00d2d3 y verde #10b981). Código limpio, completo y 100% funcional.',
            },
          ],
        },
        {
          id: 'auto_alertas_ambiental',
          nombre: 'Alertas Ambientales y RESPEL',
          prompts: [
            {
              id: 'auto_amb_001',
              titulo: 'Sistema de Gestión de Residuos Peligrosos (RESPEL) con Alertas',
              categoria: 'Aplicación Web',
              prioridad: 'critica',
              uso: 'Semanal',
              tags: ['RESPEL', 'Medio Ambiente', 'Residuos Peligrosos', 'NFPA 704', 'Incompatibilidad Química', 'Alertas', 'ISO 14001'],
              prompt:
                'ACTÚA COMO: Ingeniero Senior de Medio Ambiente y Cumplimiento Regulatorio Ambiental en complejos industriales y químicos con 20 años de experiencia. Especialista en gestión de Residuos Peligrosos (RESPEL), normas ISO 14001, Sistema Globalmente Armonizado (SGA/GHS), NFPA 704 y normativa de almacenamiento temporal (plazo máximo legal de 6 meses / 180 días). Desarrollador de sistemas de gestión ambiental.\n\nCONTEXTO TÉCNICO Y LEGAL:\n- Planta industrial que genera múltiples corrientes de residuos peligrosos (Aceites usados, solventes clorados, lodos con hidrocarburos, baterías de plomo-ácido, trapos contaminados, envases con químicos tóxicos).\n- Obligación Legal Estricta: Declaración de generación, almacenamiento en patio RESPEL segregado según matriz de incompatibilidad química, no exceder el tiempo máximo legal de almacenamiento y trazabilidad con manifiestos de transporte y disposición final en destinatario autorizado.\n\nTAREA:\nDesarrolla una aplicación web completa y autónoma en un único archivo HTML/CSS/JavaScript para el Control, Inventario y Alertas Automatizadas de Residuos Peligrosos (RESPEL) según normas ambientales.\n\nMÓDULOS DEL SISTEMA Y REGLAS DE NEGOCIO AMBIENTAL:\n\n1. REGISTRO Y CARACTERIZACIÓN DE RESIDUOS (SGA / NFPA 704):\n   - Ficha de Residuo: Código Interno / Lote, Nombre del Residuo, Proceso de Origen, Clasificación de Peligrosidad (Tóxico, Inflamable, Reactivo, Corrosivo, Biológico-Infeccioso), Rombo NFPA 704 (Salud, Inflamabilidad, Inestabilidad, Especial 0-4), Tipo de Contenedor (Tambor 208L, IBC 1000L, Maxisaco), Cantidad/Peso (kg o toneladas), Ubicación en Patio RESPEL (Bahía A, B, C).\n   - Fechas de Control: Fecha de Generación / Ingreso al Patio, Fecha Límite Legal de Almacenamiento (Calculada automáticamente a 180 días desde el ingreso).\n\n2. MATRIZ DINÁMICA DE INCOMPATIBILIDAD QUÍMICA:\n   - Verificador de Compatibilidad Cruzada: Al asignar o mover un residuo a una bahía, el sistema verifica automáticamente contra los residuos ya existentes en dicha bahía para evitar la proximidad física de sustancias incompatibles (ej. Ácidos con Bases, Inflamables con Oxidantes Fuertes, Tóxicos con Ácidos que liberen gases tóxicos).\n   - Bloqueo y Alerta Visual si se intenta almacenar combinaciones de alto riesgo.\n\n3. MOTOR DE ALERTAS TEMPORALES Y CONTROL DE CAPACIDAD:\n   - Semáforo de Tiempo de Almacenamiento:\n     * Verde: Menos de 90 días en patio.\n     * Amarillo: Entre 90 y 140 días (Planificar retiro con empresa de transporte autorizada).\n     * Naranja: Entre 141 y 170 días (Coordinar manifiesto de retiro de emergencia).\n     * Rojo: > 170 días o Vencido (>180 días) (NO CONFORMIDAD LEGAL INMEDIATA).\n   - Alerta de Capacidad de Patio: % de ocupación de las bahías de contención y capacidad de pretiles de retención de derrames (110% del contenedor mayor).\n\n4. MANIFIESTOS DE RETIRO, TRAZABILIDAD Y PERSISTENCIA:\n   - Registro de Despacho / Retiro: N° Manifiesto, Transportista Autorizado (Resolución Sanitaria/Ambiental), Destinatario Final (Incineración, Celda de Seguridad, Reciclaje), Certificado de Disposición Final recibido.\n   - Base de datos local IndexedDB para funcionamiento offline en patios aislados.\n   - Generación de Declaración Periódica de RESPEL y reportes oficiales en PDF/Excel.\n\nDISEÑO:\n- UI Dark Eco-Industrial (#0c1a14, #132a20, acentos verde esmeralda #10b981 y ámbar de advertencia #f59e0b). Código completo y sin omisiones.',
            },
          ],
        },
        {
          id: 'auto_alertas_planta',
          nombre: 'Alertas Integrales de Planta',
          prompts: [
            {
              id: 'auto_planta_001',
              titulo: 'Sistema Integral de Alertas y Notificaciones para Plantas Industriales',
              categoria: 'Aplicación Web',
              prioridad: 'alta',
              uso: 'Diario',
              tags: ['Alertas', 'Centro de Notificaciones', 'SCADA', 'Mantenimiento', 'HSE', 'Operaciones', 'Push'],
              prompt:
                'ACTÚA COMO: Arquitecto Principal de Sistemas de Control Distribuido (DCS/SCADA) y Gestión de Alarmas Industriales según la norma ANSI/ISA-18.2 (Management of Alarm Systems for the Process Industries) con 20 años de experiencia. Experto en optimización de interfaces de sala de control, mitigación del "Alarm Flooding" (inundación de alarmas) y diseño de centros unificados de notificación operacional.\n\nCONTEXTO:\n- Complejo industrial que necesita unificar en una sola consola de monitoreo las alertas de diversas áreas: Variables de Proceso fuera de rango, Alarmas de Mantenimiento Preventivo, Vencimiento de Permisos de Trabajo HSE, Alarmas Ambientales y Eventos de Calidad.\n\nTAREA:\nDesarrolla una aplicación web completa y profesional en un solo archivo HTML/CSS/JavaScript que funcione como un Centro Unificado de Gestión de Alarmas y Notificaciones Industriales según ISA-18.2.\n\nMÓDULOS DEL SISTEMA Y REQUISITOS ISA-18.2:\n\n1. CONSOLA CENTRALIZADA DE ALARMAS Y EVENTOS:\n   - Clasificación por Prioridad según ISA-18.2: Crítica (Disparo inminente / Riesgo a la vida o equipo mayor), Alta (Requiere acción en <15 min), Media (Requiere acción en <1 hora), Baja / Informativa.\n   - Estados de Alarma: Activa No Reconocida (Intermitente), Activa Reconocida (Fija), Normalizada No Reconocida, Normalizada / Histórica.\n   - Registro con Sellado de Tiempo en Milisegundos, Tag, Área, Descripción del Evento, Causa Probable y Acción Recomendada.\n\n2. MECANISMOS DE GESTIÓN Y OPERACIÓN DE ALARMAS:\n   - Botones de Control de Operador: Reconocer Alarma (Acknowledge), Silenciar Sonido (Mute), Suprimir / Inhibir Alarma con justificación (Shelving / Suppress) por mantenimiento.\n   - Sistema de Alerta Auditiva Sintetizada con Web Audio API (tonos diferenciados por nivel de criticidad según estándares de sala de control).\n\n3. MÉTRICAS DE SALUD DEL SISTEMA DE ALARMAS (KPIs ISA-18.2):\n   - Tasa de Alarmas por Operador por Hora (Objetivo ISA: < 6 alarmas/hora en régimen normal).\n   - Detección automática de "Alarm Floods" (> 10 alarmas en 10 minutos).\n   - Lista de "Bad Actors" (Las 10 alarmas más frecuentes o molestas / Chattering alarms).\n\n4. PERSISTENCIA, FILTRADO AVANZADO Y EXPORTACIÓN:\n   - Base de datos IndexedDB con motor de filtrado instantáneo por área, fecha, prioridad y estado.\n   - Exportación de la secuencia de eventos (SOE - Sequence of Events) a CSV/Excel y reporte de auditoría en PDF.\n\nDISEÑO:\n- UI Dark Control Room (#0a0e17, #131b2e, acentos rojo alarma #dc2626, ámbar #f59e0b, azul #3b82f6 y verde #22c55e). Código limpio, completo y 100% funcional.',
            },
          ],
        },
      ],
    },
    {
      id: 'capacitacion',
      nombre: 'Capacitación e Inducción',
      icono: '🎓',
      color: '#00897b',
      descripcion: 'Sistemas de inducción de personal, charlas de seguridad y matrices de competencias',
      subcategorias: [
        {
          id: 'cap_induccion',
          nombre: 'Inducción de Personal',
          prompts: [
            {
              id: 'cap_ind_001',
              titulo: 'Sistema Digital de Inducción de Personal Nuevo en Planta',
              categoria: 'Aplicación Web',
              prioridad: 'alta',
              uso: 'Diario',
              tags: ['Inducción', 'Capacitación', 'HSE', 'Onboarding', 'Evaluación', 'Certificado QR', 'Personal Nuevo'],
              prompt:
                'ACTÚA COMO: Director Corporativo de Capacitación, Desarrollo Organizacional y Cultura de Seguridad en industrias de alto riesgo con 20 años de experiencia. Experto en diseño instruccional (Metodología ADDIE), gamificación del aprendizaje para adultos (Andragogía) y evaluación de competencias críticas de seguridad. Desarrollador web de plataformas LMS offline-first.\n\nCONTEXTO:\n- Todo trabajador nuevo o transferido debe completar obligatoriamente la Inducción General de Seguridad de Planta antes de ingresar al área operativa: Políticas HSE, Reglas que Salvan Vidas (Life Saving Rules), Riesgos Críticos, EPP Obligatorio, Plan de Evacuación y Respuesta a Emergencias.\n\nTAREA:\nDesarrolla una aplicación web completa y profesional en un solo archivo HTML/CSS/JavaScript para el proceso interactivo de Inducción, Evaluación de Conocimientos y Emisión Digital de Pases de Acreditación de Seguridad.\n\nMÓDULOS DEL SISTEMA:\n\n1. REGISTRO DE TRABAJADOR Y ASIGNACIÓN DE CURSO:\n   - Datos del Participante: Nombre Completo, DNI/Pasaporte, Cargo, Empresa (Propia / Contratista), Área de Destino, Fotografía de Perfil (captura directa por cámara web o carga de archivo base64).\n\n2. MÓDULOS DE APRENDIZAJE INTERACTIVOS:\n   - Módulo 1: Políticas Corporativas y Reglas que Salvan Vidas.\n   - Módulo 2: Matriz de Peligros y Jerarquía de Controles en Planta.\n   - Módulo 3: Equipos de Protección Personal (EPP Básico y Específico).\n   - Módulo 4: Bloqueo de Energías Peligrosas (LOTO) y Permisos de Trabajo.\n   - Módulo 5: Plan de Emergencias, Alarmas, Puntos de Encuentro y Primeros Auxilios.\n   - Contenido con tarjetas visuales, resúmenes interactivos y validación de lectura.\n\n3. MOTOR DE EVALUACIÓN CON BANCO DE PREGUNTAS DINÁMICO:\n   - Examen interactivo de 10 a 20 preguntas de opción múltiple seleccionadas aleatoriamente de un banco de preguntas.\n   - Nota Mínima de Aprobación Mandatoria: 85% o 100% en preguntas críticas no negociables.\n   - Retroalimentación explicativa inmediata en caso de respuesta incorrecta y opción de reintento.\n\n4. EMISIÓN DIGITAL DEL PASE DE SEGURIDAD (CREDENCIAL CON QR):\n   - Generación automática de Credencial / Certificado de Inducción con foto, datos del trabajador, fecha de vigencia (1 año) y Código QR único con hash SHA-256 de verificación.\n   - Formato imprimible en tamaño carnet / A4 y almacenamiento en IndexedDB.\n   - Panel de control para el instructor con registro de aprobados y reprobados.\n\nDISEÑO:\n- UI Dark Academy (#0f172a, #1e293b, acentos verde esmeralda #10b981 y azul #38bdf8). 100% funcional y completo.',
            },
            {
              id: 'cap_ind_002',
              titulo: 'Sistema de Inducción y Control de Acceso para Contratistas',
              categoria: 'Aplicación Web',
              prioridad: 'alta',
              uso: 'Diario',
              tags: ['Contratistas', 'Acreditación', 'Control de Acceso', 'HSE', 'Seguridad Laboral', 'Documentación'],
              prompt:
                'ACTÚA COMO: Superintendente de Seguridad Patrimonial, Control de Contratistas y Compliance Laboral en plantas mineras e industriales con 20 años de experiencia. Auditor de cumplimiento legal en subcontratación y gestión de riesgos de terceros. Desarrollador web de sistemas de control de acceso y acreditación.\n\nCONTEXTO:\n- Planta industrial con más de 40 empresas contratistas y 500 trabajadores externos que realizan obras civiles, montajes mecánicos, mantenimiento eléctrico y servicios generales.\n- Exigencia Crítica: Ningún contratista puede ingresar a planta si no cuenta con su inducción vigente, exámenes médicos ocupacionales aptos, seguro de accidentes laborales al día y entrega de EPP certificado.\n\nTAREA:\nDesarrolla una aplicación web completa y autónoma en un único archivo HTML/CSS/JavaScript para la Gestión de Acreditación, Control Documental y Validación de Acceso en Garita para Empresas Contratistas.\n\nMÓDULOS DEL SISTEMA:\n\n1. REGISTRO DE EMPRESAS CONTRATISTAS Y TRABAJADORES:\n   - Empresa: Razón Social, RUT/NIT, Administrador de Contrato, Contrato N° / Orden de Servicio, Nivel de Riesgo de la Empresa.\n   - Trabajador Contratista: Nombre, Documento de Identidad, Especialidad (Soldador, Andamiero, Electricista, Mecánico, Peón), Estado de Inducción HSE (Vigente / Vencida), Estado Médico Ocupacional (Apto / No Apto / Con Restricciones), Seguro de Accidentes (Fecha de vencimiento de póliza).\n\n2. MÓDULO DE CONTROL EN GARITA (SCANNER DE ACCESO):\n   - Búsqueda instantánea por DNI o escaneo de Código QR para validación en portería de planta:\n     * Semáforo Verde: Acreditado (Todos los requisitos al día -> AUTORIZAR INGRESO).\n     * Semáforo Rojo: Denegado (Inducción vencida, Seguro vencido o No apto médico -> ACCESO BLOQUEADO con detalle de motivo).\n   - Registro de Marca de Entrada y Salida con sellado de tiempo para control de horas-hombre trabajadas y censo de personas en planta ante emergencias.\n\n3. TABLERO DE CONTROL Y EXPIRACIONES:\n   - Alertas preventivas a administradores de contrato (30, 15 y 7 días antes del vencimiento de documentos).\n   - Base de datos IndexedDB para operación local autónoma en garitas de acceso remotas.\n   - Exportación de informes de dotación y cumplimiento legal en Excel y PDF.\n\nDISEÑO:\n- UI Dark Security Gate (#111827, #1f2937, acentos ámbar #f59e0b y verde #22c55e). Código 100% completo.',
            },
          ],
        },
        {
          id: 'cap_charlas',
          nombre: 'Charlas de Seguridad y TBT',
          prompts: [
            {
              id: 'cap_charla_001',
              titulo: 'Generador Inteligente de Charlas de Seguridad de 5 Minutos (TBT)',
              categoria: 'Herramienta',
              prioridad: 'alta',
              uso: 'Diario',
              tags: ['TBT', 'Toolbox Talk', 'Charlas de 5 Minutos', 'HSE', 'Prevención de Riesgos', 'Liderazgo', 'Seguridad'],
              prompt:
                'ACTÚA COMO: Especialista Senior en Cultura de Seguridad y Liderazgo Visible en Terreno con 20 años de experiencia facilitando Charlas de Seguridad de 5 Minutos (Toolbox Talks - TBT / Diálogos Diarios) en minería, petróleo y construcción. Maestro en comunicación asertiva y dinámicas de concientización para equipos de primera línea.\n\nCONTEXTO:\n- Los supervisores de turno y líderes de cuadrilla deben iniciar cada jornada de trabajo con una charla de seguridad de 5 minutos enfocada en los riesgos específicos de las tareas del día, lecciones aprendidas o condiciones climáticas adversas.\n\nTAREA:\nDesarrolla una aplicación web completa y dinámica en un solo archivo HTML/CSS/JavaScript que funcione como un Generador Inteligente y Biblioteca de Charlas de Seguridad de 5 Minutos (TBT) con Registro Digital de Asistencia.\n\nMÓDULOS DEL SISTEMA:\n\n1. GENERADOR DINÁMICO DE CHARLAS POR FAMILIAS DE RIESGO:\n   - Biblioteca categorizada con más de 30 temas pre-cargados de alto impacto: Trabajos en Altura, Riesgo Eléctrico y Arco Eléctrico, Espacios Confinados, Líneas de Fuego y Puntos de Pellizco, Maniobras de Izaje, Fatiga y Somnolencia en Turnos Noche, Bloqueo LOTO, Manejo Defensivo en Faena, Protección Ocular y Auditiva, Estrés Térmico (Calor/Frío extremo).\n   - Generador Paramétrico: Permite ingresar la tarea específica del día y condiciones de entorno para generar una charla personalizada estructurada en:\n     * 1. Historia o Caso Real (Gancho de atención).\n     * 2. Riesgos Críticos de la Tarea.\n     * 3. Controles Mandatorios que Salvan Vidas.\n     * 4. Preguntas Abiertas de Verificación para el Equipo.\n     * 5. Compromiso del Día.\n\n2. MÓDULO DIGITAL DE REGISTRO DE ASISTENCIA Y FIRMA:\n   - Registro de Cuadrilla: Supervisor, Área, Título de la Charla, Fecha/Hora.\n   - Lista interactiva de trabajadores asistentes con captura de firma táctil en Canvas para cada uno.\n   - Temporizador de 5 minutos integrado en pantalla para controlar la duración exacta del diálogo.\n\n3. PERSISTENCIA Y REGISTRO AUDITABLE:\n   - Almacenamiento local en IndexedDB con histórico de charlas realizadas por cuadrilla.\n   - Generación de Hoja de Charla de Seguridad firmada en formato PDF A4 listo para archivo y auditoría HSE.\n\nDISEÑO:\n- UI Dark Tactical (#0f172a, #1e293b, acento naranja de seguridad #f97316). Código completo y sin dependencias externas.',
            },
          ],
        },
        {
          id: 'cap_gestion',
          nombre: 'Gestión de Capacitación',
          prompts: [
            {
              id: 'cap_gest_001',
              titulo: 'Sistema de Gestión de Capacitación y Matriz de Competencias',
              categoria: 'Aplicación Web',
              prioridad: 'alta',
              uso: 'Semanal',
              tags: ['Matriz de Competencias', 'ILUO', 'Skills Matrix', 'Capacitación', 'Brechas', 'ISO 9001', 'Desarrollo de Personal'],
              prompt:
                'ACTÚA COMO: Gerente Corporativo de Desarrollo de Talento y Capacitación Técnica Industrial con 20 años de experiencia. Especialista en matrices de competencias y habilidades (Metodología ILUO / Niveles 1 al 4), planes anuales de capacitación (PAC) y auditorías de competencia del personal según ISO 9001:2015 (Cláusula 7.2) e ISO 45001. Desarrollador de sistemas de gestión de competencias.\n\nCONTEXTO:\n- Planta de manufactura y procesos con 150 operadores y técnicos distribuidos en 5 líneas de producción. Necesidad de visualizar brechas de competencia (Skill Gap), programar cursos y garantizar que ninguna máquina crítica sea operada por personal no calificado.\n\nTAREA:\nDesarrolla una aplicación web completa y profesional en un único archivo HTML/CSS/JavaScript para la Gestión de Matrices de Habilidades (Skills Matrix ILUO), Evaluación de Brechas y Control del Plan de Capacitación.\n\nMÓDULOS DEL SISTEMA Y METODOLOGÍA ILUO:\n\n1. DEFINICIÓN DE COMPETENCIAS Y PUESTOS DE TRABAJO:\n   - Catálogo de Competencias: Habilidades Técnicas Operativas (Operación de Calderas, Manejo de Puente Grúa, Soldadura TIG, Análisis Químico), Competencias de Seguridad (LOTO, Espacios Confinados, Rescate) y Competencias de Calidad.\n   - Definición del Perfil de Cargo: Nivel de competencia requerido por puesto (Nivel 1 al 4).\n\n2. MATRIZ DE HABILIDADES INTERACTIVA (ILUO):\n   - Escala Estándar ILUO:\n     * I (Nivel 1 - 25%): En Formación / Conocimiento teórico básico. No puede operar solo.\n     * L (Nivel 2 - 50%): Autónomo / Puede realizar la tarea bajo supervisión ocasional.\n     * U (Nivel 3 - 75%): Experto / Realiza la tarea con total autonomía y alta calidad.\n     * O (Nivel 4 - 100%): Instructor / Domina el proceso y está calificado para capacitar a otros.\n   - Visualización matricial tipo cuadrícula donde las filas son los trabajadores y las columnas son las competencias, con gráficos circulares o barras visuales de nivel.\n\n3. ANÁLISIS DE BRECHAS (GAP ANALYSIS) Y PLAN DE CAPACITACIÓN:\n   - Cálculo automático del índice de brecha de competencias por área y trabajador ($Skill\\_Gap = Nivel_{requerido} - Nivel_{actual}$).\n   - Programador del Plan Anual de Capacitación (PAC): Registro de cursos, fechas programadas, instructor, horas de capacitación y presupuesto.\n\n4. PERSISTENCIA, ANALÍTICA Y EXPORTACIÓN:\n   - Dashboard de KPIs: % de Cobertura de Competencias Críticas, Polivalencia del Equipo (Multi-skilling Index), Horas de Capacitación por Trabajador.\n   - Persistencia local en IndexedDB con soporte para importar/exportar datos en JSON.\n   - Exportación de la Matriz de Competencias a Excel (CSV con formato visual) y reporte ejecutivo en PDF.\n\nDISEÑO:\n- UI Dark Enterprise (#0f172a, #1e293b, acentos en azul índigo #6366f1 y cian #06b6d4). Código 100% terminado.',
            },
          ],
        },
      ],
    },
  ],
};
