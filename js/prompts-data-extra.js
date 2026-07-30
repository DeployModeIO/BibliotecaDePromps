const PROMPTS_DB_EXTRA = {
  categorias: [
    {
      id: "automatizacion",
      nombre: "Automatización y Alertas",
      icono: "🤖",
      color: "#7b1fa2",
      descripcion: "Sistemas de alertas automatizadas, notificaciones y flujos de trabajo para plantas industriales",
      subcategorias: [
        {
          id: "auto_alertas_mant",
          nombre: "Alertas de Mantenimiento",
          prompts: [
            {
              id: "auto_mant_001",
              titulo: "Sistema de Alertas de Mantenimiento de Vehículos y Flota",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero de Gestión de Flota Senior con 20 años de experiencia en mantenimiento de vehículos industriales y flotas de plantas (camionetas, buses, montacargas, grúas, vehículos livianos), certificado en gestión de activos PAS 55 / ISO 55001 y con conocimiento profundo de sistemas CMMS y telemetría vehicular.

CONTEXTO TÉCNICO:
- Industria: Planta industrial con flota de 80 vehículos (30 camionetas 4x4, 10 buses de personal, 15 montacargas, 5 grúas, 20 vehículos livianos)
- Normas: ISO 55001 (Asset Management), SAE J1939 (diagnóstico vehicular), regulaciones de tránsito locales
- Tipos de mantenimiento: Preventivo por kilometraje/horas, predictivo por condición, correctivo por falla
- Problemática: Vencimientos de mantenimiento no detectados a tiempo, vehículos operando con mantenimientos atrasados, falta de visibilidad del estado de flota, costos de reparación elevados por falta de prevención
- Personal: 3 mecánicos, 1 supervisor de flota, 80 conductores

TAREA:
Desarrolla una aplicación web completa de gestión de alertas de mantenimiento de flota vehicular. La aplicación debe:

1. MÓDULO DE REGISTRO DE VEHÍCULOS:
   - Datos del vehículo: Placa/patente, marca, modelo, año, tipo (camioneta, bus, montacargas, grúa, liviano), número de motor, número de chasis/VIN, combustible (diésel, gasolina, eléctrico, GLP)
   - Datos operacionales: Kilometraje/horómetro actual, fecha de ingreso a flota, área asignada, conductor principal
   - Documentación: Seguro vehicular (vencimiento), revisión técnica (vencimiento), permiso de circulación, SOAT/seguro obligatorio
   - Historial: Mantenimientos realizados, costos acumulados, fallas recurrentes

2. MÓDULO DE PLANES DE MANTENIMIENTO:
   - Planes por tipo de vehículo con intervalos específicos:
     * Camionetas 4x4: Cada 5,000 km (aceite, filtros), 10,000 km (frenos, suspensión), 20,000 km (transmisión), 40,000 km (correa de distribución)
     * Buses: Cada 10,000 km (aceite, filtros), 20,000 km (frenos, neumáticos), 50,000 km (transmisión, embrague)
     * Montacargas: Cada 250 horas (aceite, filtros), 500 horas (hidráulico), 1,000 horas (transmisión), 2,000 horas (overhaul)
     * Grúas: Cada 500 horas (inspección general), 1,000 horas (cables, frenos), 2,000 horas (estructura)
   - Mantenimientos por tiempo: Cada 3 meses (inspección general), 6 meses (alineación, balanceo), 12 meses (revisión técnica)
   - Checklist de inspección diaria pre-operacional por tipo de vehículo

3. MÓDULO DE ALERTAS AUTOMÁTICAS:
   - Alertas por kilometraje/horas:
     * Verde: > 20% para próximo mantenimiento
     * Amarillo: < 20% para próximo mantenimiento (15 días antes)
     * Rojo: Mantenimiento vencido (alerta crítica diaria)
   - Alertas por tiempo:
     * Vencimiento de seguro vehicular (30, 15, 7 días antes)
     * Vencimiento de revisión técnica (30, 15, 7 días antes)
     * Vencimiento de SOAT (30, 15, 7 días antes)
   - Alertas por condición:
     * Fallas recurrentes (3+ fallas mismas en 30 días)
     * Costo acumulado > 60% del valor del vehículo (recomendación de reemplazo)
     * Vehículo inactivo > 7 días
   - Notificaciones: Email automático, dashboard con semáforo, resumen diario/semanal

4. MÓDULO DE ÓRDENES DE TRABAJO:
   - Generación automática de OT al vencer mantenimiento
   - Asignación a mecánico disponible
   - Registro de repuestos utilizados y costos
   - Tiempo de ejecución (inicio/fin)
   - Firma digital del mecánico y conductor
   - Cierre de OT con verificación

5. MÓDULO DE COSTOS Y KPIs:
   - Costo por vehículo (mensual, anual, acumulado)
   - Costo por kilómetro/hora
   - Disponibilidad de flota (%)
   - MTBF y MTTR por tipo de vehículo
   - Presupuesto vs. real
   - Análisis de reemplazo vs. reparación

6. MÓDULO DE DASHBOARD Y REPORTES:
   - Dashboard con semáforo de estado de flota
   - Calendario de próximos mantenimientos
   - Gráficos de costos por tipo de vehículo
   - Reporte mensual de gestión de flota (PDF/Excel)
   - Alertas pendientes por prioridad

7. MÓDULO DE AUTOMATIZACIÓN DE CORREOS:
   - Email diario: Resumen de alertas activas
   - Email semanal: Plan de mantenimiento de la semana
   - Email mensual: Reporte de KPIs de flota
   - Email automático al conductor: "Su vehículo requiere mantenimiento en X días"
   - Email al supervisor: Escalamiento de alertas críticas no atendidas

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo sistema de gestión de flota
- Diseño responsive para desktop y tablets
- Datos de ejemplo realistas (80 vehículos, 6 meses de historial)
- Sistema de alertas visual con semáforos

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia

ENTREGABLE FINAL:
Sistema completo de gestión de alertas de mantenimiento de flota que elimine los vencimientos no detectados, reduzca costos de reparación y asegure la disponibilidad operativa de todos los vehículos de la planta.`,
              tags: ["flota", "vehículos", "mantenimiento", "alertas", "kilometraje", "ISO 55001"],
              uso: "Continuo / Gestión de flota"
            },
            {
              id: "auto_mant_002",
              titulo: "Sistema de Alertas de Mantenimiento de Extintores y Equipos Contra Incendio",
              categoria: "Aplicación Web",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Ingeniero de Seguridad Contra Incendios Senior con 20 años de experiencia en protección contra incendios industrial, certificado NFPA y con conocimiento profundo de normas NFPA 10 (Extintores Portátiles), NFPA 25 (Sistemas de Protección Contra Incendio), NFPA 72 (Sistemas de Detección y Alarma) y regulaciones locales de bomberos.

CONTEXTO TÉCNICO:
- Industria: Complejo industrial con 5 áreas (proceso, almacenamiento, oficinas, talleres, subestación eléctrica)
- Equipos contra incendio: 350 extintores (PQS, CO2, agua, espuma, clase K), 25 gabinetes con mangueras, 8 sistemas de rociadores, 4 sistemas de diluvio, 120 detectores de humo/calor, 15 estaciones manuales de alarma, 3 bombas contra incendio
- Normas: NFPA 10 (inspección mensual, mantenimiento anual, prueba hidrostática cada 5/12 años), NFPA 25 (inspección trimestral de mangueras, prueba anual de bombas), NFPA 72 (prueba semestral de detectores)
- Problemática: Extintores vencidos sin detectar, falta de trazabilidad de inspecciones, incumplimiento normativo, riesgo de multas y clausura
- Personal: 2 técnicos de seguridad, 1 supervisor HSE, 5 brigadistas por área

TAREA:
Desarrolla una aplicación web completa de gestión de alertas de mantenimiento de extintores y equipos contra incendio. La aplicación debe:

1. MÓDULO DE INVENTARIO DE EQUIPOS:
   - Extintores: Tag/ID, tipo (PQS/CO2/agua/espuma/clase K), capacidad (kg/L), ubicación (área, edificio, piso, coordenadas), fabricante, modelo, año fabricación, fecha última recarga, fecha próxima recarga, fecha última prueba hidrostática, fecha próxima prueba hidrostática, estado (operativo/fuera de servicio/retirado)
   - Gabinetes con manguera: ID, ubicación, tipo de manguera (1.5"/2.5"), longitud, estado de acoples, fecha última inspección
   - Sistemas fijos: Rociadores (área cubierta, número de cabezales), diluvio, bombas (caudal, presión, tipo de accionamiento)
   - Detección y alarma: Detectores (tipo, ubicación, zona), estaciones manuales, panel de control

2. MÓDULO DE PLANES DE INSPECCIÓN Y MANTENIMIENTO:
   - Extintores según NFPA 10:
     * Inspección visual mensual: Presión (manómetro en verde), sello de seguridad, manguera, boquilla, soporte, señalización, acceso libre
     * Mantenimiento anual: Descarga, inspección interna, recarga, prueba de funcionamiento
     * Prueba hidrostática: Cada 5 años (PQS, agua, espuma), cada 12 años (CO2)
     * Vida útil máxima: 20 años (retiro obligatorio)
   - Mangueras según NFPA 25:
     * Inspección trimestral: Estado físico, acoples, enrollado, señalización
     * Prueba hidrostática anual: Presión de prueba según tipo
   - Bombas contra incendio según NFPA 25:
     * Prueba semanal: Arranque automático, presión, caudal
     * Prueba anual de caudal: Curva de bomba vs. diseño
   - Detectores según NFPA 72:
     * Prueba semestral: Funcionalidad, sensibilidad
     * Limpieza anual: Remoción de polvo y contaminantes

3. MÓDULO DE ALERTAS AUTOMÁTICAS:
   - Alertas por vencimiento:
     * Recarga de extintor vencida (alerta crítica diaria)
     * Prueba hidrostática próxima (30, 15, 7 días antes)
     * Inspección mensual pendiente (alerta al día 1 de cada mes)
     * Mantenimiento anual próximo (60, 30, 15 días antes)
     * Vida útil del extintor por vencer (6 meses antes)
   - Alertas por estado:
     * Extintor con presión baja (manómetro en rojo)
     * Extintor sin sello de seguridad
     * Extintor obstruido o sin señalización
     * Manguera con daños visibles
     * Detector fuera de servicio
   - Alertas regulatorias:
     * % de extintores operativos < 95% (incumplimiento)
     * Inspecciones mensuales no completadas
     * Certificados de mantenimiento vencidos
   - Notificaciones: Email, dashboard, resumen semanal

4. MÓDULO DE INSPECCIÓN DIGITAL:
   - Checklist de inspección mensual por extintor (formato digital)
   - Registro fotográfico de hallazgos
   - Firma digital del inspector
   - Generación automática de OT para equipos con hallazgos
   - Mapa interactivo de ubicación de extintores con estado

5. MÓDULO DE TRAZABILIDAD Y DOCUMENTACIÓN:
   - Historial completo por equipo (inspecciones, mantenimientos, recargas, pruebas)
   - Certificados de mantenimiento (generación PDF)
   - Registro de empresas proveedoras de servicio
   - Documentos para auditoría de bomberos/seguros
   - Código QR por extintor para escaneo rápido

6. MÓDULO DE DASHBOARD Y REPORTES:
   - Dashboard con:
     * % de extintores operativos vs. total
     * Próximos vencimientos (calendario)
     * Inspecciones pendientes del mes
     * Equipos fuera de servicio
     * Cumplimiento NFPA 10/25/72
   - Reportes:
     * Reporte mensual de inspecciones
     * Reporte de mantenimiento anual
     * Reporte para auditoría de bomberos
     * Reporte de costos de mantenimiento
   - Exportación a PDF/Excel

7. MÓDULO DE AUTOMATIZACIÓN DE CORREOS:
   - Email mensual: Plan de inspecciones del mes
   - Email semanal: Alertas de vencimientos próximos
   - Email automático: "Extintor TAG-XXX requiere recarga en X días"
   - Email al proveedor: Solicitud de servicio programado
   - Email a gerencia: Reporte de cumplimiento normativo

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo sistema de gestión de seguridad contra incendios
- Diseño responsive para desktop y tablets
- Datos de ejemplo realistas (350 extintores, 12 meses de historial)
- Mapa interactivo de ubicaciones

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, Leaflet.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Cumplimiento con NFPA 10, NFPA 25, NFPA 72

ENTREGABLE FINAL:
Sistema completo de gestión de alertas de mantenimiento de extintores y equipos contra incendio que asegure el cumplimiento normativo NFPA, elimine vencimientos no detectados y garantice la operatividad del 100% de los equipos de protección contra incendios.`,
              tags: ["extintores", "NFPA 10", "NFPA 25", "contra incendio", "alertas", "inspección"],
              uso: "Mensual / Continuo"
            }
          ]
        },
        {
          id: "auto_alertas_compras",
          nombre: "Alertas de Compras y Abastecimiento",
          prompts: [
            {
              id: "auto_comp_001",
              titulo: "Sistema de Alertas de Solicitudes de Compra y Órdenes de Compra",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Gerente de Abastecimiento y Cadena de Suministro Senior con 20 años de experiencia en compras industriales, gestión de proveedores y control de inventarios para plantas de proceso. Experto en SAP MM, metodologías de procurement y optimización de cadena de suministro industrial.

CONTEXTO TÉCNICO:
- Industria: Planta industrial con 500 empleados, consumo mensual de 2,000+ ítems (repuestos, consumibles, químicos, EPP, servicios)
- Proceso actual: Solicitudes de compra en papel/email, seguimiento manual en Excel, falta de visibilidad del estado de OCs, retrasos en entregas críticas
- Flujo: Solicitud de Compra (SC) → Aprobación → Orden de Compra (OC) → Seguimiento → Recepción → Factura → Pago
- Niveles de aprobación: < $1,000 (supervisor), $1,000-$10,000 (gerente de área), > $10,000 (gerente general)
- Problemática: SCs perdidas, OCs sin seguimiento, entregas atrasadas sin alerta, sobrestock y quiebres de stock, falta de trazabilidad

TAREA:
Desarrolla una aplicación web completa de gestión de alertas para solicitudes de compra y órdenes de compra. La aplicación debe:

1. MÓDULO DE SOLICITUDES DE COMPRA (SC):
   - Creación de SC con: Número automático, solicitante, área, fecha, prioridad (rutinaria/urgente/crítica), ítems solicitados (descripción, cantidad, unidad, especificación técnica), justificación, centro de costo
   - Flujo de aprobación digital con firma electrónica
   - Estados: Borrador → Enviada → En aprobación → Aprobada → Rechazada → Convertida a OC
   - Adjuntar cotizaciones y especificaciones técnicas

2. MÓDULO DE ÓRDENES DE COMPRA (OC):
   - Conversión de SC aprobada a OC
   - Datos de OC: Número, proveedor, ítems, precios, condiciones de pago, fecha de entrega comprometida, Incoterms
   - Estados: Emitida → Confirmada por proveedor → En tránsito → Recibida parcialmente → Recibida → Cerrada
   - Registro de recepciones parciales y totales
   - Registro de discrepancias (cantidad, calidad, precio)

3. MÓDULO DE ALERTAS AUTOMÁTICAS:
   - Alertas de SC:
     * SC pendiente de aprobación > 3 días (escalamiento automático)
     * SC urgente sin atender > 24 horas
     * SC rechazada (notificación al solicitante con motivo)
   - Alertas de OC:
     * OC sin confirmación del proveedor > 5 días
     * Entrega comprometida en 7 días (recordatorio)
     * Entrega vencida (alerta crítica diaria)
     * Recepción parcial sin completar > 15 días
     * OC abierta > 90 días sin cierre
   - Alertas de inventario:
     * Stock bajo (punto de reorder alcanzado)
     * Stock crítico (quiebre inminente)
     * Sobrestock (> 6 meses de consumo)
     * Ítems sin movimiento > 12 meses (obsoletos)
   - Alertas de proveedores:
     * Proveedor con entrega atrasada recurrente
     * Proveedor con rechazo de calidad > 10%
     * Vencimiento de contrato/certificación de proveedor

4. MÓDULO DE SEGUIMIENTO Y TRAZABILIDAD:
   - Timeline completo por SC/OC (cada cambio de estado con fecha y responsable)
   - Dashboard de estado de todas las SC/OC activas
   - Filtros por área, prioridad, proveedor, estado
   - Búsqueda avanzada por número, ítem, proveedor

5. MÓDULO DE KPIs Y REPORTES:
   - KPIs:
     * Tiempo promedio de aprobación de SC
     * Tiempo promedio de entrega de OC (lead time)
     * % de entregas a tiempo (OTIF - On Time In Full)
     * % de SC convertidas a OC
     * Ahorro vs. presupuesto
     * Rotación de inventario
   - Reportes:
     * Reporte semanal de SC/OC pendientes
     * Reporte mensual de gestión de compras
     * Reporte de performance de proveedores
     * Reporte de ahorros y variaciones de precio
   - Exportación a PDF/Excel

6. MÓDULO DE AUTOMATIZACIÓN DE CORREOS:
   - Email automático al aprobador: "SC-XXX requiere su aprobación"
   - Email de escalamiento: "SC-XXX lleva 5 días sin aprobación"
   - Email al proveedor: "Recordatorio de entrega OC-XXX en 7 días"
   - Email al solicitante: "Su OC-XXX ha sido recibida"
   - Email semanal: Resumen de estado de compras
   - Email mensual: Reporte de KPIs de abastecimiento

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo sistema de procurement
- Diseño responsive para desktop y tablets
- Datos de ejemplo realistas (50 SC/OC activas, 20 proveedores)
- Flujos de aprobación visuales

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia

ENTREGABLE FINAL:
Sistema completo de gestión de alertas de compras que elimine las SCs perdidas, asegure el seguimiento de OCs, reduzca los tiempos de aprovisionamiento y proporcione visibilidad total del proceso de abastecimiento.`,
              tags: ["compras", "OC", "SC", "proveedores", "abastecimiento", "alertas"],
              uso: "Continuo / Gestión de compras"
            }
          ]
        },
        {
          id: "auto_alertas_ambiental",
          nombre: "Alertas Ambientales y RESPEL",
          prompts: [
            {
              id: "auto_amb_001",
              titulo: "Sistema de Gestión de Residuos Peligrosos (RESPEL) con Alertas",
              categoria: "Aplicación Web",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Ingeniero Ambiental Senior con 20 años de experiencia en gestión de residuos industriales peligrosos (RESPEL), certificado en auditoría ambiental ISO 14001 y con conocimiento profundo de regulaciones ambientales locales e internacionales (EPA RCRA, Directiva Europea de Residuos, normativas locales de RESPEL).

CONTEXTO TÉCNICO:
- Industria: Complejo industrial con generación de 50+ toneladas/mes de residuos peligrosos
- Tipos de RESPEL generados:
  * Aceites usados (lubricantes, hidráulicos, transformadores): 15 ton/mes
  * Solventes y químicos vencidos: 5 ton/mes
  * Trapos y absorbentes contaminados: 8 ton/mes
  * Baterías de plomo-ácido: 2 ton/mes
  * Lodos de pintura y recubrimientos: 3 ton/mes
  * Residuos de laboratorio: 1 ton/mes
  * Envases contaminados (tambores, bidones): 6 ton/mes
  * Filtros de aceite y combustible: 3 ton/mes
  * Residuos electrónicos (RAEE): 1 ton/mes
  * Neumáticos usados: 4 ton/mes
  * Residuos con mercurio (lámparas, instrumentos): 0.5 ton/mes
  * Residuos biológicos-infecciosos: 0.5 ton/mes
- Infraestructura: Bodega RESPEL con 200 m², 5 contenedores de 20 m³, sistema de contención de derrames
- Problemática: Acumulación excesiva en bodega, vencimiento de tiempos máximos de almacenamiento (6 meses), falta de trazabilidad, riesgo de sanciones ambientales, retiros no programados

TAREA:
Desarrolla una aplicación web completa de gestión de residuos peligrosos (RESPEL) con sistema de alertas. La aplicación debe:

1. MÓDULO DE REGISTRO DE GENERACIÓN:
   - Registro diario de residuos generados por área:
     * Tipo de residuo (código CER/EPAL según clasificación)
     * Cantidad (kg, litros, unidades)
     * Área generadora
     * Responsable de la generación
     * Características de peligrosidad (inflamable, corrosivo, reactivo, tóxico, biológico)
     * Envase/contenedor utilizado
     * Etiquetado (rombo NFPA 704, pictogramas SGA/GHS)
   - Generación automática de etiqueta con código QR
   - Pesaje y verificación de cantidades

2. MÓDULO DE GESTIÓN DE BODEGA RESPEL:
   - Inventario en tiempo real de bodega:
     * Tipo de residuo, cantidad almacenada, fecha de ingreso
     * Ubicación en bodega (zona, estante, contenedor)
     * Compatibilidad química (segregación según matriz de incompatibilidad)
     * Estado del contenedor (íntegro, dañado, con fugas)
   - Control de capacidad:
     * % de ocupación de bodega (alerta al 80%, crítica al 95%)
     * % de ocupación por tipo de residuo
     * Proyección de llenado según tasa de generación
   - Condiciones de almacenamiento:
     * Temperatura y humedad de bodega
     * Ventilación y extracción de vapores
     * Sistema de contención de derrames
     * Señalización y rutas de evacuación

3. MÓDULO DE ALERTAS AUTOMÁTICAS:
   - Alertas de tiempo de almacenamiento:
     * Residuo con > 4 meses en bodega (alerta preventiva)
     * Residuo con > 5 meses en bodega (alerta urgente)
     * Residuo con > 6 meses en bodega (alerta crítica - incumplimiento normativo)
   - Alertas de capacidad:
     * Bodega al 80% de capacidad
     * Bodega al 95% de capacidad (crítica)
     * Contenedor específico lleno
   - Alertas de retiro:
     * Retiro programado en 7 días (recordatorio)
     * Retiro vencido sin ejecutar (alerta crítica)
     * Certificado de disposición pendiente
   - Alertas de documentación:
     * Manifiesto de transporte pendiente
     * Certificado de disposición final vencido
     * Licencia ambiental del transportista por vencer
     * Declaración anual de residuos pendiente
   - Alertas de seguridad:
     * Derrame detectado
     * Incompatibilidad química en almacenamiento
     * Contenedor dañado
     * Temperatura de bodega fuera de rango

4. MÓDULO DE RETIRO Y DISPOSICIÓN:
   - Programación de retiros:
     * Empresa transportista autorizada (licencia, seguros)
     * Fecha y hora de retiro
     * Manifiesto de transporte (generación automática)
     * Cantidad y tipo de residuos a retirar
   - Seguimiento de disposición final:
     * Planta de tratamiento/disposición (autorización ambiental)
     * Método de disposición (incineración, relleno de seguridad, reciclaje, tratamiento físico-químico)
     * Certificado de disposición final
     * Trazabilidad completa (generación → almacenamiento → transporte → disposición)
   - Gestión de proveedores:
     * Registro de transportistas autorizados
     * Registro de plantas de disposición
     * Vencimiento de licencias y permisos
     * Evaluación de desempeño

5. MÓDULO DE TRAZABILIDAD Y DOCUMENTACIÓN:
   - Código QR único por contenedor/lote de residuo
   - Historial completo: Generación → Almacenamiento → Retiro → Disposición
   - Manifiestos de transporte digitales
   - Certificados de disposición final
   - Declaraciones anuales de residuos
   - Documentos para auditoría ambiental (ISO 14001)
   - Reportes para autoridad ambiental

6. MÓDULO DE KPIs Y REPORTES:
   - KPIs:
     * Toneladas de RESPEL generadas por mes/área
     * Tiempo promedio de almacenamiento
     * % de residuos dispuestos dentro del plazo legal
     * % de residuos reciclados vs. dispuestos
     * Costo de gestión de RESPEL por tonelada
     * Tasa de generación (kg RESPEL / unidad producida)
   - Reportes:
     * Reporte mensual de generación de residuos
     * Reporte de inventario de bodega RESPEL
     * Reporte de retiros y disposiciones
     * Declaración anual de residuos peligrosos
     * Reporte para auditoría ISO 14001
   - Exportación a PDF/Excel

7. MÓDULO DE AUTOMATIZACIÓN DE CORREOS:
   - Email semanal: Estado de bodega RESPEL y alertas activas
   - Email automático: "Residuo XXX lleva 5 meses en bodega - programar retiro"
   - Email al transportista: Confirmación de retiro programado
   - Email a gerencia: Reporte mensual de gestión ambiental
   - Email de escalamiento: Alertas críticas no atendidas > 48 horas

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo sistema de gestión ambiental
- Diseño responsive para desktop y tablets
- Datos de ejemplo realistas (12 tipos de residuos, 6 meses de historial)
- Dashboard con semáforos de cumplimiento

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Cumplimiento con normativas RESPEL

ENTREGABLE FINAL:
Sistema completo de gestión de RESPEL que asegure el cumplimiento normativo ambiental, elimine vencimientos de almacenamiento, proporcione trazabilidad completa desde la generación hasta la disposición final y reduzca el riesgo de sanciones ambientales.`,
              tags: ["RESPEL", "residuos peligrosos", "ambiental", "ISO 14001", "alertas", "trazabilidad"],
              uso: "Diario / Continuo"
            }
          ]
        },
        {
          id: "auto_alertas_planta",
          nombre: "Alertas Integrales de Planta",
          prompts: [
            {
              id: "auto_planta_001",
              titulo: "Sistema Integral de Alertas y Notificaciones para Plantas Industriales",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Gerente de Operaciones Industriales Senior con 25 años de experiencia en gestión de plantas de proceso (Oil & Gas, química, manufactura, alimentos), especializado en sistemas de gestión integrada, automatización de flujos de trabajo y transformación digital industrial. Experto en ISO 9001, ISO 14001, ISO 45001 e ISO 55001.

CONTEXTO TÉCNICO:
- Industria: Aplicable a cualquier planta industrial (manufactura, proceso, Oil & Gas, minería, alimentos, farmacéutica)
- Problemática: Alertas dispersas en múltiples sistemas (email, WhatsApp, papel, Excel), falta de centralización, alertas críticas perdidas entre ruido, sin escalamiento automático, sin trazabilidad de acciones
- Necesidad: Sistema único que centralice TODAS las alertas de la planta con priorización, escalamiento y seguimiento automático

TAREA:
Desarrolla una aplicación web completa que funcione como centro de comando de alertas para una planta industrial. La aplicación debe:

1. MÓDULO DE CONFIGURACIÓN DE ALERTAS:
   - Tipos de alertas configurables:
     * Mantenimiento: Vencimiento de MP, fallas de equipos, horas de operación
     * Seguridad: Permisos de trabajo, inspecciones, incidentes, capacitaciones
     * Ambiental: RESPEL, emisiones, derrames, auditorías
     * Calidad: Desviaciones, no conformidades, auditorías, calibraciones
     * Compras: SC/OC pendientes, entregas, stock bajo
     * RRHH: Capacitaciones vencidas, exámenes médicos, certificaciones
     * Operaciones: Parámetros fuera de rango, producción vs. plan
     * Legal/Regulatorio: Permisos, licencias, declaraciones, auditorías
     * Vehículos: Mantenimiento, seguros, revisiones técnicas
     * Extintores: Inspecciones, recargas, pruebas hidrostáticas
   - Para cada tipo de alerta:
     * Nombre y descripción
     * Prioridad (crítica, alta, media, baja)
     * Frecuencia de verificación
     * Responsable por defecto
     * Umbral de escalamiento (horas sin atender)
     * Canal de notificación (email, dashboard, SMS)
     * Acción requerida

2. MÓDULO DE CENTRO DE COMANDO (DASHBOARD):
   - Vista general con:
     * Total de alertas activas por prioridad (semáforo)
     * Alertas críticas sin atender (destacadas en rojo)
     * Alertas por categoría (gráfico de barras)
     * Alertas por área/responsable
     * Tendencia de alertas (últimos 30 días)
     * Tiempo promedio de resolución
     * % de alertas atendidas dentro del plazo
   - Vista detallada por categoría
   - Vista de calendario con vencimientos futuros
   - Vista de mapa de calor por área

3. MÓDULO DE GESTIÓN DE ALERTAS:
   - Ciclo de vida de cada alerta:
     * Generada → Asignada → En progreso → Resuelta → Cerrada → Verificada
   - Asignación automática o manual de responsable
   - Registro de acciones tomadas
   - Evidencia de resolución (fotos, documentos)
   - Verificación de cierre por supervisor
   - Reapertura si la acción no fue efectiva

4. MÓDULO DE ESCALAMIENTO AUTOMÁTICO:
   - Reglas de escalamiento configurables:
     * Alerta crítica sin atender > 4 horas → Escalar a supervisor
     * Alerta crítica sin atender > 24 horas → Escalar a gerente
     * Alerta crítica sin atender > 72 horas → Escalar a director
     * Alerta alta sin atender > 7 días → Escalar a supervisor
     * Alerta media sin atender > 30 días → Escalar a supervisor
   - Notificación automática en cada escalamiento
   - Registro de escalamientos para auditoría

5. MÓDULO DE AUTOMATIZACIÓN DE CORREOS:
   - Email diario: Resumen de alertas activas por responsable
   - Email semanal: Reporte de estado de alertas por área
   - Email mensual: Reporte ejecutivo de KPIs de alertas
   - Email instantáneo: Alerta crítica nueva
   - Email de escalamiento: Alerta no atendida en plazo
   - Email de felicitación: Área con 0 alertas críticas en el mes
   - Plantillas de email personalizables
   - Distribución por listas (gerencia, supervisores, técnicos)

6. MÓDULO DE KPIs Y REPORTES:
   - KPIs:
     * Total de alertas generadas/resueltas/pendientes
     * Tiempo promedio de resolución por prioridad
     * % de alertas resueltas dentro del plazo (SLA)
     * Número de escalamientos por mes
     * Alertas recurrentes (mismo tipo, misma área)
     * Costo asociado a alertas no atendidas
   - Reportes:
     * Reporte diario de alertas (para supervisores)
     * Reporte semanal de estado (para gerentes)
     * Reporte mensual ejecutivo (para directores)
     * Reporte de tendencias trimestral
     * Reporte de cumplimiento normativo
   - Exportación a PDF/Excel

7. MÓDULO DE INTEGRACIÓN:
   - API para recibir alertas de otros sistemas
   - Importación de alertas desde Excel/CSV
   - Webhooks para notificaciones externas
   - Preparado para integración con SCADA, CMMS, ERP

8. FUNCIONALIDADES ADICIONALES:
   - Modo offline con sincronización
   - Control de acceso por roles (administrador, supervisor, técnico, viewer)
   - Auditoría completa de cambios
   - Búsqueda avanzada y filtros múltiples
   - Notas y comentarios por alerta
   - Adjuntar archivos y fotografías
   - Exportación de datos para análisis externo

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo centro de comando industrial
- Diseño responsive para desktop, tablets y móviles
- Datos de ejemplo realistas (100+ alertas de diferentes tipos)
- Dashboard interactivo con gráficos en tiempo real

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Preparado para integración con backend

ENTREGABLE FINAL:
Sistema integral de alertas que centralice todas las notificaciones de la planta, asegure que ninguna alerta crítica se pierda, proporcione escalamiento automático y mejore la capacidad de respuesta de la organización ante cualquier desviación operativa, de seguridad, ambiental o de mantenimiento.`,
              tags: ["alertas", "notificaciones", "centro de comando", "escalamiento", "planta", "integral"],
              uso: "Continuo / Gestión de planta"
            }
          ]
        }
      ]
    },
    {
      id: "capacitacion",
      nombre: "Capacitación e Inducción",
      icono: "🎓",
      color: "#00695c",
      descripcion: "Sistemas de inducción, capacitación, charlas de seguridad y gestión de competencias",
      subcategorias: [
        {
          id: "cap_induccion",
          nombre: "Inducción de Personal",
          prompts: [
            {
              id: "cap_ind_001",
              titulo: "Sistema Digital de Inducción de Personal Nuevo en Planta",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Gerente de HSE y Recursos Humanos Senior con 20 años de experiencia en gestión de seguridad industrial y desarrollo de programas de inducción para plantas de proceso (Oil & Gas, química, manufactura). Experto en OSHA, ISO 45001, y metodologías de capacitación para adultos (andragogía).

CONTEXTO TÉCNICO:
- Industria: Planta industrial con 500 empleados, 20-30 ingresos nuevos por mes
- Proceso actual: Inducción en papel (4-6 horas), presentaciones en PowerPoint, evaluaciones impresas, sin seguimiento post-inducción
- Contenido requerido: Seguridad industrial, salud ocupacional, medio ambiente, procedimientos de emergencia, EPP, permisos de trabajo, políticas de la empresa
- Problemática: Inducción repetitiva para instructores, sin estandarización, evaluaciones no verificables, sin trazabilidad de quién recibió qué capacitación, riesgo legal por falta de evidencia

TAREA:
Desarrolla una aplicación web completa de inducción digital para personal nuevo en planta. La aplicación debe:

1. MÓDULO DE CONTENIDO DE INDUCCIÓN:
   - Módulos de inducción obligatorios:
     * Módulo 1: Bienvenida y políticas de la empresa (30 min)
       - Misión, visión, valores
       - Organigrama y estructura
       - Políticas de conducta, alcohol y drogas
       - Reglamento interno de trabajo
       - Derechos y deberes del trabajador
     * Módulo 2: Seguridad Industrial (60 min)
       - Peligros y riesgos específicos de la planta
       - EPP requerido por área (casco, lentes, guantes, botas, protección auditiva, respirador)
       - Señalización de seguridad (colores, formas, significados)
       - Zonas clasificadas y restricciones
       - Procedimientos de trabajo seguro
       - Sistema de permisos de trabajo
       - LOTO (bloqueo y etiquetado)
       - Trabajo en altura, espacios confinados, trabajo en caliente
     * Módulo 3: Salud Ocupacional (30 min)
       - Factores de riesgo (ruido, vibración, químicos, ergonómicos)
       - Exámenes médicos ocupacionales
       - Primeros auxilios básicos
       - Ubicación de botiquines y estaciones de emergencia
     * Módulo 4: Medio Ambiente (30 min)
       - Política ambiental
       - Gestión de residuos (segregación, RESPEL)
       - Prevención de derrames
       - Reporte de incidentes ambientales
     * Módulo 5: Respuesta a Emergencias (45 min)
       - Plan de emergencia y evacuación
       - Rutas de evacuación y puntos de encuentro
       - Uso de extintores (teoría y práctica)
       - Alarmas y señales de emergencia
       - Números de emergencia
       - Brigadas de emergencia
     * Módulo 6: Procedimientos Específicos del Área (30 min)
       - Procedimientos operacionales del área asignada
       - Equipos específicos y sus riesgos
       - Instrucciones de trabajo aplicables

2. MÓDULO DE EVALUACIÓN:
   - Evaluación por módulo (mínimo 10 preguntas por módulo):
     * Preguntas de selección múltiple
     * Preguntas de verdadero/falso
     * Preguntas de identificación de imágenes (EPP, señales, riesgos)
   - Nota mínima de aprobación: 80%
   - Reintentos permitidos: 2 (con retroalimentación)
   - Banco de preguntas aleatorio (diferente en cada intento)
   - Registro de resultados con timestamp

3. MÓDULO DE REGISTRO Y TRAZABILIDAD:
   - Datos del trabajador: Nombre, RUT/DNI, cargo, área, fecha de ingreso, empresa (propia/contratista)
   - Registro de inducción: Fecha, módulos completados, notas, instructor
   - Certificado de inducción (generación automática PDF con código QR de verificación)
   - Validez de la inducción: 1 año (renovación obligatoria)
   - Alertas de vencimiento de inducción (30, 15, 7 días antes)

4. MÓDULO DE SEGUIMIENTO POST-INDUCCIÓN:
   - Evaluación de efectividad a los 30 días (encuesta al supervisor)
   - Verificación en campo de conocimientos (checklist)
   - Registro de observaciones de seguridad del trabajador inducido
   - Indicadores de efectividad de la inducción

5. MÓDULO DE DASHBOARD Y REPORTES:
   - Dashboard con:
     * Inducciones realizadas vs. pendientes del mes
     * % de aprobación por módulo
     * Próximas inducciones programadas
     * Inducciones por vencer (renovación)
     * KPIs de capacitación
   - Reportes:
     * Reporte mensual de inducciones
     * Reporte de efectividad de capacitación
     * Reporte para auditoría ISO 45001
     * Registro de capacitación (formato legal)
   - Exportación a PDF/Excel

6. MÓDULO DE AUTOMATIZACIÓN:
   - Email automático al nuevo ingreso: "Su inducción está programada para..."
   - Email al supervisor: "Trabajador XXX completó inducción"
   - Email de renovación: "Inducción de XXX vence en 30 días"
   - Email a RRHH: Reporte semanal de inducciones

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo LMS (Learning Management System)
- Diseño responsive para desktop, tablets y móviles
- Contenido de inducción precargado (6 módulos completos)
- Banco de 100+ preguntas de evaluación

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia

ENTREGABLE FINAL:
Sistema digital completo de inducción que estandarice el proceso, elimine el papel, proporcione trazabilidad legal completa, reduzca el tiempo de instructores y asegure que todo trabajador nuevo reciba una inducción de calidad antes de ingresar a planta.`,
              tags: ["inducción", "personal nuevo", "capacitación", "HSE", "ISO 45001", "LMS"],
              uso: "Por ingreso / Continuo"
            },
            {
              id: "cap_ind_002",
              titulo: "Sistema de Inducción y Control de Acceso para Contratistas",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Coordinador de Seguridad de Contratistas Senior con 20 años de experiencia en gestión de contratistas para plantas industriales de Oil & Gas, minería y manufactura. Experto en OSHA PSM, ISO 45001, y programas de seguridad de contratistas alineados con estándares IOGP y API RP 750.

CONTEXTO TÉCNICO:
- Industria: Planta industrial con 50+ contratistas activos, 200+ trabajadores contratistas en sitio diariamente
- Proceso actual: Inducción de contratistas en papel, control de acceso manual, sin verificación de documentación, sin seguimiento de performance de seguridad
- Requisitos: Inducción de seguridad, verificación de seguros, certificaciones de competencia, exámenes médicos, EPP, permisos de trabajo específicos
- Problemática: Contratistas ingresando sin inducción vigente, documentación vencida sin detectar, sin evaluación de performance de seguridad, riesgo legal y de seguridad

TAREA:
Desarrolla una aplicación web completa de inducción y control de acceso para contratistas. La aplicación debe:

1. MÓDULO DE REGISTRO DE CONTRATISTAS:
   - Datos de la empresa contratista:
     * Razón social, RUT/NIT, dirección, contacto
     * Tipo de servicio (mantenimiento, construcción, servicios, transporte)
     * Contrato vigente (número, fecha inicio, fecha fin, alcance)
     * Seguro de responsabilidad civil (póliza, vigencia, cobertura)
     * Seguro de accidentes de trabajo (póliza, vigencia)
     * Certificaciones (ISO 9001, ISO 14001, ISO 45001)
   - Datos del personal contratista:
     * Nombre, RUT/DNI, cargo, especialidad
     * Examen médico ocupacional (fecha, vigencia, aptitud)
     * Certificaciones de competencia (soldador, electricista, operador de grúa, etc.)
     * Capacitaciones específicas (trabajo en altura, espacios confinados, LOTO)
     * EPP asignado y verificado

2. MÓDULO DE INDUCCIÓN DE CONTRATISTAS:
   - Inducción general de seguridad (igual que personal nuevo + módulos adicionales):
     * Reglas específicas para contratistas
     * Procedimientos de permiso de trabajo
     * Restricciones de acceso por área
     * Protocolo de comunicación con personal de planta
     * Procedimiento de reporte de incidentes
     * Sanciones por incumplimiento
   - Inducción específica por tipo de trabajo:
     * Trabajo en caliente
     * Espacios confinados
     * Trabajo en altura
     * Izajes críticos
     * Excavaciones
     * Trabajo eléctrico
   - Evaluación con nota mínima 80%
   - Certificado de inducción con vigencia (30 días, 90 días, 1 año según tipo)

3. MÓDULO DE CONTROL DE ACCESO:
   - Verificación diaria de requisitos para ingreso:
     * Inducción vigente (check automático)
     * Examen médico vigente
     * Certificaciones vigentes
     * Seguro de accidentes vigente
     * EPP completo
     * Permiso de trabajo activo (si aplica)
   - Generación de pase de acceso diario (código QR)
   - Registro de ingreso/salida con timestamp
   - Bloqueo automático si algún requisito está vencido
   - Lista negra de contratistas con incidentes graves

4. MÓDULO DE ALERTAS AUTOMÁTICAS:
   - Alertas de documentación:
     * Seguro de RC por vencer (30, 15, 7 días)
     * Examen médico por vencer (30, 15, 7 días)
     * Certificación por vencer (30, 15, 7 días)
     * Inducción por vencer (15, 7, 3 días)
     * Contrato por vencer (60, 30, 15 días)
   - Alertas de performance:
     * Contratista con incidente reportable
     * Contratista con 3+ observaciones de seguridad en 30 días
     * Contratista con incumplimiento de permiso de trabajo
   - Alertas de acceso:
     * Intento de acceso con documentación vencida
     * Contratista en sitio sin inducción vigente

5. MÓDULO DE EVALUACIÓN DE PERFORMANCE:
   - Scorecard de seguridad por contratista:
     * TRIR (Total Recordable Incident Rate)
     * Número de observaciones de seguridad
     * Cumplimiento de permisos de trabajo
     * Resultados de auditorías de seguridad
     * Calidad del trabajo
     * Cumplimiento de cronograma
   - Ranking de contratistas
   - Recomendaciones de continuidad/terminación

6. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard con:
     * Contratistas activos en sitio hoy
     * Documentación por vencer (próximos 30 días)
     * Scorecard de seguridad por contratista
     * Inducciones pendientes
   - Reportes:
     * Reporte diario de acceso de contratistas
     * Reporte mensual de performance de seguridad
     * Reporte de documentación vencida
     * Reporte para auditoría
   - Exportación a PDF/Excel

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo sistema de control de acceso
- Diseño responsive para desktop y tablets
- Datos de ejemplo realistas (50 contratistas, 200 trabajadores)

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia

ENTREGABLE FINAL:
Sistema completo de inducción y control de acceso para contratistas que asegure que solo personal calificado y documentado ingrese a planta, reduzca el riesgo legal y de seguridad, y proporcione trazabilidad completa de todos los contratistas en sitio.`,
              tags: ["contratistas", "inducción", "control de acceso", "seguridad", "documentación"],
              uso: "Diario / Continuo"
            }
          ]
        },
        {
          id: "cap_charlas",
          nombre: "Charlas de Seguridad y TBT",
          prompts: [
            {
              id: "cap_charla_001",
              titulo: "Generador Inteligente de Charlas de Seguridad de 5 Minutos (TBT)",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Especialista en Seguridad Industrial y Capacitación con 20 años de experiencia en programas de Behavior Based Safety (BBS), charlas de seguridad de 5 minutos (Tool Box Talks) y cultura de seguridad para industrias de alto riesgo (Oil & Gas, minería, construcción, manufactura). Experto en metodologías de DuPont Bradley Curve, Heinrich Pyramid y seguridad basada en comportamiento.

CONTEXTO TÉCNICO:
- Industria: Aplicable a cualquier industria de alto riesgo
- Frecuencia: Charla diaria de 5 minutos al inicio de cada turno
- Audiencia: Grupos de 5-30 trabajadores (operadores, técnicos, contratistas)
- Problemática: Charlas repetitivas, sin estructura, sin registro, sin seguimiento de temas tratados, sin medición de efectividad, los supervisores no saben qué tema tratar
- Expectativa: Banco de 365+ temas de charlas organizados por categoría, con estructura profesional, registro de asistencia y medición de impacto

TAREA:
Desarrolla una aplicación web completa que funcione como generador y gestor de charlas de seguridad de 5 minutos. La aplicación debe:

1. MÓDULO DE BANCO DE TEMAS:
   - 52 temas organizados por semana (1 año completo), categorizados en:
     * Seguridad General (12 temas): EPP, orden y limpieza, señalización, reportes de incidentes, ergonomía, trabajo en equipo, comunicación de peligros, derecho a saber, investigación de incidentes, lecciones aprendidas, cultura de seguridad, liderazgo visible
     * Trabajo en Altura (6 temas): Arnés y línea de vida, andamios, escaleras, plataformas, protección de bordes, rescate en altura
     * Espacios Confinados (6 temas): Identificación, permisos, monitoreo de atmósfera, ventilación, rescate, roles del equipo
     * Trabajo en Caliente (4 temas): Permisos, gas testing, vigilante de fuego, extintores
     * LOTO (4 temas): Procedimientos, tipos de energía, candados y tags, verificación
     * Manejo de Químicos (6 temas): SGA/GHS, hojas de seguridad, EPP químico, derrames, incompatibilidad, almacenamiento
     * Maquinaria y Equipos (6 temas): Guardas de seguridad, puntos de pellizco, inspección pre-operacional, mantenimiento seguro, energía almacenada, vehículos industriales
     * Electricidad (4 temas): Riesgo eléctrico, arco eléctrico, EPP dieléctrico, trabajos sin tensión
     * Emergencias (4 temas): Evacuación, uso de extintores, primeros auxilios, simulacros
     * Salud Ocupacional (4 temas): Ruido, estrés térmico, manejo manual de cargas, fatiga
     * Medio Ambiente (4 temas): Residuos, derrames, emisiones, consumo responsable
     * Conducción Segura (4 temas): Manejo defensivo, inspección de vehículos, fatiga al volante, condiciones climáticas
   - Cada tema incluye:
     * Título y objetivo de la charla
     * Puntos clave a discutir (3-5 puntos)
     * Pregunta de apertura para generar participación
     * Ejemplo o caso real (anónimo)
     * Compromiso del equipo (1 acción concreta)
     * Duración estimada: 5 minutos

2. MÓDULO DE CHARLA DIARIA:
   - Selección del tema del día (automático por calendario o manual)
   - Presentación del tema en formato de tarjetas (slide por slide)
   - Timer de 5 minutos
   - Registro de asistencia:
     * Nombre del supervisor/facilitador
     * Lista de asistentes (nombre, área, firma digital)
     * Número de asistentes
   - Registro de participación:
     * Preguntas realizadas por el equipo
     * Comentarios y sugerencias
     * Compromisos asumidos
   - Fotografía del grupo (opcional)

3. MÓDULO DE SEGUIMIENTO:
   - Calendario de temas tratados (evitar repetición)
   * Historial de charlas por área/equipo
   * Temas pendientes por tratar
   * Registro de compromisos y su cumplimiento
   * Análisis de participación por trabajador

4. MÓDULO DE KPIs Y REPORTES:
   - KPIs:
     * % de charlas realizadas vs. programadas
     * Promedio de asistencia
     * Temas cubiertos vs. banco total
     * Compromisos cumplidos vs. pendientes
   - Reportes:
     * Reporte semanal de charlas realizadas
     * Reporte mensual de participación
     * Reporte de temas tratados por área
     * Reporte para auditoría ISO 45001
   - Exportación a PDF/Excel

5. MÓDULO DE AUTOMATIZACIÓN:
   - Email diario al supervisor: "Tema de charla de hoy: XXX"
   - Email semanal: Resumen de charlas de la semana
   - Email mensual: Reporte de participación y KPIs

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo presentación interactiva
- Diseño responsive para tablets (uso en campo)
- Banco de 52+ temas precargados con contenido completo
- Timer integrado

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia

ENTREGABLE FINAL:
Sistema completo de charlas de seguridad de 5 minutos que elimine la improvisación, asegure la cobertura de todos los temas críticos, registre la participación y mida la efectividad del programa de seguridad basada en comportamiento.`,
              tags: ["charlas de seguridad", "TBT", "Tool Box Talk", "BBS", "5 minutos", "capacitación"],
              uso: "Diario / Inicio de turno"
            }
          ]
        },
        {
          id: "cap_gestion",
          nombre: "Gestión de Capacitación",
          prompts: [
            {
              id: "cap_gest_001",
              titulo: "Sistema de Gestión de Capacitación y Matriz de Competencias",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Gerente de Desarrollo Organizacional y Capacitación Senior con 20 años de experiencia en gestión de competencias, planes de capacitación y cumplimiento normativo de formación para industrias de alto riesgo. Experto en ISO 45001 (competencia y toma de conciencia), ISO 9001 (competencia), y marcos de competencias industriales.

CONTEXTO TÉCNICO:
- Industria: Planta industrial con 500 empleados en 15 áreas diferentes
- Requisitos de capacitación: 40+ cursos obligatorios (seguridad, técnicos, regulatorios)
- Problemática: Matriz de competencias en Excel desactualizada, sin seguimiento de vencimientos, sin plan de capacitación anual, sin evidencia para auditorías, incumplimiento de requisitos legales de formación
- Normas: ISO 45001 Cláusula 7.2 (Competencia), ISO 9001 Cláusula 7.2, OSHA Training Requirements, regulaciones locales de capacitación

TAREA:
Desarrolla una aplicación web completa de gestión de capacitación y matriz de competencias. La aplicación debe:

1. MÓDULO DE MATRIZ DE COMPETENCIAS:
   - Definición de competencias por cargo/área:
     * Competencias de seguridad (obligatorias para todos): Inducción general, primeros auxilios, uso de extintores, evacuación, LOTO, trabajo en altura, espacios confinados
     * Competencias técnicas por cargo: Operación de equipos específicos, procedimientos de proceso, mantenimiento especializado
     * Competencias regulatorias: Licencias, certificaciones, habilitaciones
     * Competencias de liderazgo (para supervisores): Gestión de seguridad, investigación de incidentes, auditorías
   - Matriz visual: Filas = empleados, Columnas = competencias, Celdas = estado (vigente/vencido/pendiente/no aplica)
   - Niveles de competencia: Básico, Intermedio, Avanzado, Experto
   - Frecuencia de renovación por competencia (anual, bianual, trienal)

2. MÓDULO DE PLAN DE CAPACITACIÓN:
   - Plan anual de capacitación:
     * Cursos programados por mes
     * Instructor (interno/externo)
     * Presupuesto asignado
     * Cupos disponibles
     * Áreas/cargos objetivo
   - Inscripción de participantes
   - Registro de ejecución (fecha real, asistentes, resultados)
   - Evaluación de efectividad (reacción, aprendizaje, comportamiento, resultados - Modelo Kirkpatrick)

3. MÓDULO DE ALERTAS AUTOMÁTICAS:
   - Alertas de vencimiento de competencias:
     * Competencia por vencer en 60 días (planificar)
     * Competencia por vencer en 30 días (programar)
     * Competencia por vencer en 7 días (urgente)
     * Competencia vencida (crítica - no puede realizar la tarea)
   - Alertas de cumplimiento:
     * % de competencias vigentes por área < 90%
     * Empleado con competencia crítica vencida
     * Curso programado sin instructor asignado
     * Presupuesto de capacitación por agotarse
   - Alertas regulatorias:
     * Licencia/certificación por vencer
     * Capacitación obligatoria no completada
     * Auditoría próxima sin evidencia completa

4. MÓDULO DE REGISTRO Y EVIDENCIA:
   - Registro de cada capacitación:
     * Curso, fecha, instructor, duración
     * Lista de asistentes con firma digital
     * Resultado de evaluación (nota)
     * Certificado generado (PDF con QR)
     * Material de capacitación adjunto
   - Evidencia para auditorías:
     * Registro de capacitación por empleado (historial completo)
     * Certificados vigentes
     * Evaluaciones de efectividad
     * Plan de capacitación vs. ejecutado

5. MÓDULO DE DASHBOARD Y REPORTES:
   - Dashboard con:
     * % de cumplimiento de competencias por área
     * Próximos vencimientos (calendario)
     * Plan de capacitación del mes
     * Presupuesto ejecutado vs. plan
     * KPIs de capacitación (horas/empleado, cobertura, efectividad)
   - Reportes:
     * Reporte mensual de capacitación
     * Reporte de matriz de competencias
     * Reporte de cumplimiento normativo
     * Reporte para auditoría ISO 45001/9001
     * Reporte de presupuesto de capacitación
   - Exportación a PDF/Excel

6. MÓDULO DE AUTOMATIZACIÓN:
   - Email al empleado: "Su certificación XXX vence en 30 días"
   - Email al supervisor: "3 empleados de su área tienen competencias vencidas"
   - Email a RRHH: Plan de capacitación del mes
   - Email a gerencia: Reporte trimestral de KPIs de capacitación

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo sistema de gestión de talento
- Diseño responsive para desktop y tablets
- Datos de ejemplo realistas (50 empleados, 20 competencias, 12 meses)
- Matriz de competencias interactiva

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia

ENTREGABLE FINAL:
Sistema completo de gestión de capacitación que proporcione visibilidad total de las competencias del personal, asegure el cumplimiento normativo, optimice el presupuesto de capacitación y genere evidencia completa para auditorías ISO 45001 y ISO 9001.`,
              tags: ["capacitación", "competencias", "matriz", "ISO 45001", "plan de formación", "Kirkpatrick"],
              uso: "Continuo / Gestión de talento"
            }
          ]
        }
      ]
    }
  ]
};
