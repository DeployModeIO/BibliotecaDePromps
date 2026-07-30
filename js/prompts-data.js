const PROMPTS_DB = {
  categorias: [
    {
      id: "oil_gas",
      nombre: "Oil & Gas",
      icono: "🛢️",
      color: "#e65100",
      descripcion: "Exploración, producción, refinación y transporte de hidrocarburos",
      subcategorias: [
        {
          id: "og_inspeccion",
          nombre: "Inspección de Equipos",
          prompts: [
            {
              id: "og_insp_001",
              titulo: "Sistema Web de Inspección de Válvulas de Seguridad (PSV)",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero Senior de Confiabilidad especializado en Oil & Gas con 20 años de experiencia en inspección de válvulas de seguridad, certificado API 510 y API 576.

CONTEXTO TÉCNICO:
- Industria: Planta de procesamiento de gas natural
- Equipo: Válvulas de seguridad (PSV - Pressure Safety Valves)
- Normas aplicables: API 576 (Inspection of Pressure-Relieving Systems), API 520/521 (Pressure-Relieving Systems), ASME Section VIII
- Cantidad de válvulas: 150 PSVs en servicio
- Criticalidad: Alta (protección contra sobrepresión)

TAREA:
Desarrolla una aplicación web completa en HTML/CSS/JavaScript (un solo archivo) para gestionar inspecciones pre-operacionales de válvulas de seguridad. La aplicación debe:

1. FORMULARIO DE INSPECCIÓN con los siguientes campos:
   - Datos de la válvula: Tag number, Ubicación, Tamaño (inches), Clase (ANSI), Set pressure (psig), Temperatura de diseño (°F), Tipo (spring-loaded/pilot-operated), Fabricante, Modelo, Año de instalación
   - Inspección visual: Estado de sellos, Condición de disco/asiento, Corrosión externa, Fugas visibles, Condición de palanca
   - Pruebas funcionales: Prueba de calibración (fecha última, próxima), Prueba de fugas (bubble test), Prueba de operación (pop test)
   - Documentación: Certificado de calibración, Historial de mantenimiento, Cálculo de capacidad requerida

2. SISTEMA DE EVALUACIÓN:
   - Criterios de aceptación/rechazo basados en API 576
   - Cálculo automático de desviación (% sobre set pressure)
   - Clasificación de condición: Satisfactorio/Requiere atención/No satisfactorio
   - Recomendaciones automáticas basadas en hallazgos

3. BASE DE DATOS LOCAL (localStorage):
   - Registro de todas las inspecciones
   - Historial por válvula
   - Tendencia de condiciones
   - Alertas de vencimiento de calibración

4. REPORTES:
   - Dashboard con KPIs: % de válvulas en condición satisfactoria, próximas a vencer calibración, críticas
   - Gráficos de tendencia (Chart.js)
   - Exportación a Excel/CSV
   - Generación de PDF con formato profesional

5. FUNCIONALIDADES ADICIONALES:
   - Modo offline (PWA)
   - Escaneo de QR/Barcode para identificación rápida
   - Firma digital del inspector
   - Fotografías adjuntas (base64)
   - Búsqueda y filtrado avanzado

FORMATO DE SALIDA:
- Código HTML completo en un solo archivo (inline CSS y JavaScript)
- Interfaz profesional con diseño responsive (mobile-first)
- Comentarios en el código explicando secciones críticas
- Datos de ejemplo precargados para demostración
- Instrucciones de uso al final del código

RESTRICCIONES:
- No uses frameworks externos (solo vanilla JS)
- Librerías permitidas: Chart.js (CDN), jsPDF (CDN), SheetJS (CDN)
- Todo debe funcionar offline después de la primera carga
- Código limpio, modular y mantenible
- Validación de datos en tiempo real

CRITERIOS DE CALIDAD:
- La aplicación debe ser inmediatamente funcional al abrir el archivo
- Interfaz intuitiva que no requiera entrenamiento
- Cálculos precisos según API 576
- Manejo robusto de errores
- Performance óptima incluso con 1000+ registros

ENTREGABLE FINAL:
Aplicación web completa lista para usar en campo, que un inspector pueda utilizar inmediatamente para registrar, evaluar y reportar inspecciones de PSVs cumpliendo con API 576.`,
              tags: ["PSV", "API 576", "válvulas", "inspección", "aplicación web", "PWA"],
              uso: "Diario / Pre-operacional"
            },
            {
              id: "og_insp_002",
              titulo: "Sistema de Gestión de Integridad de Tuberías (Piping)",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero de Integridad de Activos especializado en piping con certificación API 570 y NACE Level 2, con experiencia en ductos de Oil & Gas.

CONTEXTO TÉCNICO:
- Aplicación: Ducto de crudo de 24 pulgadas, 50 km de longitud
- Material: API 5L X60
- Presión de operación: 1200 psig
- Temperatura: 180°F
- Servicio: Crudo pesado con alto contenido de azufre (H2S: 2.5%)
- Normas: API 570 (Piping Inspection Code), API 1160 (Pipeline Integrity Management), ASME B31.4 (Liquid Pipelines)
- Edad del ducto: 15 años
- Historial: 3 fallas por corrosión interna en últimos 5 años

TAREA:
Desarrolla un sistema web completo de gestión de integridad de tuberías que incluya:

1. MÓDULO DE INVENTARIO DE TUBERÍAS:
   - Registro de tramos (ID, longitud, diámetro, espesor nominal, material, año instalación)
   - Mapa interactivo (Leaflet.js) con trazado del ducto
   - Clasificación por criticalidad (consecuencia de falla)
   - Historial de inspecciones y reparaciones por tramo

2. MÓDULO DE INSPECCIÓN Y MONITOREO:
   - Registro de inspecciones visuales (formato checklist)
   - Mediciones de espesor por ultrasonido (UT) con tendencias
   - Datos de inspección inteligente (ILI - smart pig)
   - Monitoreo de corrosión (coupons, probes)
   - Inspección de soldaduras (RT/UT/MT/PT)
   - Evaluación de soportes y anclajes

3. MÓDULO DE ANÁLISIS Y EVALUACIÓN:
   - Cálculo de MAWP (Maximum Allowable Working Pressure) según ASME B31G
   - Evaluación de defectos (corrosión, gouges, dents)
   - Tasa de corrosión calculada y predicción de vida remanente
   - Análisis de riesgo (probabilidad x consecuencia)
   - Matriz de criticalidad dinámica

4. MÓDULO DE GESTIÓN DE DEFECTOS:
   - Registro de anomalías encontradas
   - Clasificación por severidad (leve/moderada/severa/crítica)
   - Acciones correctivas (reparación/monitoreo/reemplazo)
   - Seguimiento de reparaciones (tipo: sleeve, cut-out, composite wrap)
   - Validación de reparaciones

5. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard ejecutivo con KPIs:
     * Integrity Operating Window (IOW) compliance
     * % de tramos inspeccionados vs. plan
     * Tasa de corrosión promedio
     * Vida remanente estimada
     * Risk score por tramo
   - Gráficos de tendencia de espesores
   - Mapas de calor de criticalidad
   - Reportes automáticos (PDF/Excel)
   - Alertas y notificaciones

6. MÓDULO DE PLANIFICACIÓN:
   - Plan de inspección basado en riesgo (RBI)
   - Programación de actividades de integridad
   - Gestión de presupuestos
   - Tracking de acciones y compromisos

FORMATO DE SALIDA:
- Aplicación web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo dashboard industrial
- Diseño responsive para tablets y desktop
- Código modular y bien documentado
- Datos de ejemplo realistas para demostración

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Leaflet.js, Chart.js, jsPDF, SheetJS (todas vía CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia de datos
- No requiere backend

CRITERIOS DE CALIDAD:
- Cálculos de integridad precisos según ASME B31G
- Interfaz intuitiva para ingenieros de integridad
- Manejo de grandes volúmenes de datos
- Exportación de datos en formatos estándar
- Trazabilidad completa de acciones

ENTREGABLE FINAL:
Sistema integral de gestión de integridad de tuberías que permita a un ingeniero de integridad gestionar todo el ciclo de vida del ducto, desde inspección hasta planificación de reparaciones, cumpliendo con API 570 y API 1160.`,
              tags: ["tuberías", "API 570", "API 1160", "integridad", "corrosión", "ASME B31G"],
              uso: "Continuo / Gestión de activos"
            },
            {
              id: "og_insp_003",
              titulo: "Calculadora de Capacity de Válvulas de Alivio según API 520",
              categoria: "Herramienta de Cálculo",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Ingeniero de Procesos Senior especializado en diseño de sistemas de alivio de presión, con 15 años de experiencia en plantas de Oil & Gas y certificación como Professional Engineer (PE).

CONTEXTO TÉCNICO:
- Norma principal: API 520 Part I (Sizing and Selection) y API 520 Part II (Installation)
- Aplicación: Cálculo de capacidad requerida y selección de válvulas de alivio de presión
- Tipos de servicio: Gas/Vapor, Líquido, Two-phase flow
- Industrias: Refinerías, plantas de gas, petroquímicas
- Escenarios de alivio: Fire case, blocked outlet, control valve failure, power failure, etc.

TAREA:
Desarrolla una calculadora web profesional completa para dimensionamiento de válvulas de alivio de presión según API 520. La calculadora debe:

1. MÓDULO DE CÁLCULO PARA GAS/VAPOR:
   - Input: Presión de diseño (psig), temperatura de diseño (°F), presión de alivio (set pressure + overpressure), coeficiente Kd (0.975 para gas), coeficiente Kb (back pressure), coeficiente Kc (combination), peso molecular, relación de calores específicos (k = Cp/Cv), factor de compresibilidad (Z), flujo másico requerido (lb/hr) o calor de entrada (BTU/hr) para fire case
   - Cálculo de área requerida usando fórmula API 520: A = W / (C * Kd * P1 * Kb * Kc) * sqrt(T*Z/MW)
   - Cálculo de coeficiente C para gas ideal o real
   - Selección de orificio estándar (D, E, F, G, H, J, K, M, N, P, Q, R, T) según API 526
   - Verificación de flujo crítico vs. subcrítico
   - Cálculo de back pressure afectado

2. MÓDULO DE CÁLCULO PARA LÍQUIDO:
   - Input: Presión de alivio (psig), presión de back (psig), densidad del líquido a condiciones de alivio (lb/ft³), viscosidad (cP), coeficiente Kv (viscosidad), flujo volumétrico requerido (GPM)
   - Cálculo de área requerida usando fórmula API 520: A = Q / (Kd * Kw * Kc) * sqrt(G / (P1 - P2))
   - Corrección por viscosidad
   - Selección de orificio estándar
   - Verificación de flujo turbulento vs. laminar

3. MÓDULO DE ESCENARIOS DE ALIVIO:
   - Fire case externo: Cálculo de calor de entrada Q = 43200 * F * A^0.82, donde F es factor de ambiente (1.0 para bare vessel, 0.3 para insulated) y A es área húmeda
   - Blocked outlet: Cálculo basado en capacidad de bombeo o flujo máximo
   - Control valve failure: Análisis de posición fail-open/fail-close
   - Power failure: Análisis de equipos críticos
   - Check valve failure: Análisis de reverse flow
   - Internal source: Despresurización de equipos

4. MÓDULO DE SELECCIÓN DE VÁLVULA:
   - Base de datos de orificios estándar API 526 con áreas efectivas
   - Selección automática del tamaño siguiente disponible
   - Recomendación de tipo de válvula (conventional, balanced bellows, pilot-operated)
   - Consideraciones de back pressure
   - Cálculo de capacity real vs. requerida

5. MÓDULO DE REPORTES:
   - Hoja de datos (datasheet) profesional con todos los parámetros
   - Memoria de cálculo detallada paso a paso
   - Justificación de selección
   - Referencias a normas aplicables
   - Exportación a PDF con formato de ingeniería
   - Exportación de datasheet a Excel

6. FUNCIONALIDADES ADICIONALES:
   - Guardar cálculos en localStorage
   - Comparar múltiples escenarios
   - Historial de cálculos
   - Conversión de unidades (psig/bar, °F/°C, lb/hr/kg/hr)
   - Validación de inputs con rangos típicos
   - Ayuda contextual con explicaciones de cada parámetro

FORMATO DE SALIDA:
- Aplicación web completa en un solo archivo HTML
- Interfaz profesional tipo herramienta de ingeniería
- Cálculos en tiempo real (sin necesidad de submit)
- Diseño responsive para desktop y tablets
- Código bien comentado explicando las fórmulas
- Datos de ejemplo precargados (caso de estudio real)

RESTRICCIONES:
- Todo en un solo archivo HTML (inline CSS y JS)
- Librerías permitidas: jsPDF (CDN), SheetJS (CDN)
- Cálculos precisos según API 520 Part I Edition 11 (2020)
- No requiere backend
- Funcionalidad offline completa

CRITERIOS DE CALIDAD:
- Precisión de cálculos validada contra ejemplos de API 520
- Interfaz intuitiva para ingenieros de procesos
- Manejo robusto de errores de input
- Reportes profesionales listos para revisión por pares
- Documentación técnica completa

ENTREGABLE FINAL:
Calculadora profesional de dimensionamiento de PSVs que un ingeniero de procesos pueda usar para diseñar sistemas de alivio cumpliendo con API 520, generando memoria de cálculo y datasheets listos para aprobación.`,
              tags: ["API 520", "PSV", "dimensionamiento", "cálculo", "alivio", "presión"],
              uso: "Diseño de ingeniería"
            },
            {
              id: "og_insp_004",
              titulo: "Sistema de Gestión de Inspección de Tanques API 653",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero Inspector de Tanques certificado API 653 con 25 años de experiencia en inspección, reparación y evaluación de tanques de almacenamiento atmosférico en terminales petroleros.

CONTEXTO TÉCNICO:
- Norma principal: API 653 (Tank Inspection, Repair, Alteration, and Reconstruction)
- Norma complementaria: API 650 (Welded Tanks for Oil Storage), API 620 (Large Low-Pressure Tanks)
- Tipo de tanques: Tanques de techo fijo y techo flotante para almacenamiento de crudo, productos refinados y agua
- Capacidades: 5,000 a 150,000 barriles
- Materiales: Acero al carbono, aceros inoxidables
- Servicios: Crudo, gasolina, diesel, fuel oil, agua de producción
- Edad promedio: 20-40 años
- Ambiente: Costero (alta corrosividad)

TAREA:
Desarrolla un sistema web integral para gestión de inspección de tanques de almacenamiento según API 653. El sistema debe incluir:

1. MÓDULO DE REGISTRO DE TANQUES:
   - Datos de diseño: Diámetro, altura, capacidad, año de construcción, fabricante, código de diseño
   - Materiales: Especificaciones de shell, bottom, roof, componentes internos
   - Historial: Fecha de instalación, reparaciones mayores, alteraciones
   - Diagramas: Vista general del tanque con identificación de componentes
   - Documentos: Planos, datasheets, certificados de materiales

2. MÓDULO DE INSPECCIÓN EXTERNA (IN-SERVICE):
   - Checklist de inspección visual externa según API 653 Section 4.3:
     * Shell: Deformaciones, corrosión, soldaduras, conexiones
     * Bottom: Estado de fundación, anillo de borde, sistema de drenaje
     * Roof: Condición estructural, sellos, sistemas de venteo
     * Accesorios: Escaleras, plataformas, sistemas contra incendios
     * Dique: Integridad, drenajes, contención
   - Registro de mediciones de espesor (UT) en puntos específicos
   - Fotografías georreferenciadas de hallazgos
   - Evaluación de condiciones (bueno/regular/malo/crítico)

3. MÓDULO DE INSPECCIÓN INTERNA (OUT-OF-SERVICE):
   - Checklist completo según API 653 Section 4.4:
     * Fondo: Inspección 100% por MFL (Magnetic Flux Leakage) o perfilrado
     * Shell: Inspección por métodos NDE según servicio
     * Techo: Inspección estructural y de sellos
     * Componentes internos: Bombas, agitadores, calentadores
   - Mapa de corrosión con ubicación de mediciones
   - Análisis de tasas de corrosión
   - Evaluación de reparaciones existentes

4. MÓDULO DE EVALUACIÓN Y ANÁLISIS:
   - Cálculo de espesor mínimo requerido según API 650: tmin = (2.6 * D * (H-1) * G) / (S * E)
   - Evaluación de defectos (corrosión, deformaciones)
   - Cálculo de vida remanente basada en tasa de corrosión
   - Evaluación de asentamiento del fondo (settlement)
   - Análisis de estabilidad del tanque
   - Determinación de presión máxima de operación (MAWP)
   - Evaluación de soldaduras (eficiencia de junta)

5. MÓDULO DE REPARACIONES:
   - Registro de reparaciones realizadas (tipo, ubicación, fecha)
   - Tipos de reparación según API 653:
     * Patch plates (insert plates)
     * Weld buildup
     * Bottom liners
     * Shell replacement plates
     * Nozzle replacements
   - Procedimientos de reparación aprobados
   - Inspección post-reparación
   - Pruebas hidrostáticas

6. MÓDULO DE GESTIÓN DE RIESGO:
   - Matriz de criticalidad (consecuencia x probabilidad)
   - Factores de riesgo: Corrosión, edad, servicio, ubicación, historial
   - Priorización de inspecciones y reparaciones
   - Análisis de modo de falla
   - Plan de acción basado en riesgo

7. MÓDULO DE DASHBOARD Y REPORTES:
   - Dashboard ejecutivo con KPIs:
     * % de tanques con inspección vigente
     * Tanques con vida remanente < 5 años
     * Tasa de corrosión promedio
     * Costo de mantenimiento por tanque
     * Risk score por instalación
   - Gráficos de tendencia de espesores
   - Mapas de calor de condición
   - Reportes regulatorios
   - Exportación a PDF/Excel
   - Alertas de vencimiento de inspecciones

8. MÓDULO DE PLANIFICACIÓN:
   - Programa de inspección basado en API 653
   - Cálculo de intervalos de inspección
   - Planificación de paradas (out-of-service)
   - Gestión de presupuestos
   - Tracking de acciones

FORMATO DE SALIDA:
- Aplicación web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo sistema de gestión de activos
- Diseño responsive optimizado para tablets (uso en campo)
- Código modular y bien documentado
- Datos de ejemplo realistas (5-10 tanques)

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Chart.js, Leaflet.js, jsPDF, SheetJS (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- No requiere backend

CRITERIOS DE CALIDAD:
- Cálculos precisos según API 653 y API 650
- Interfaz intuitiva para inspectores de tanques
- Manejo de grandes volúmenes de datos
- Reportes profesionales listos para presentación
- Trazabilidad completa de inspecciones y reparaciones

ENTREGABLE FINAL:
Sistema integral de gestión de integridad de tanques que un inspector API 653 pueda usar para gestionar todo el ciclo de vida de tanques de almacenamiento, desde inspección hasta planificación de reparaciones, cumpliendo con API 653.`,
              tags: ["tanques", "API 653", "API 650", "inspección", "MFL", "integridad"],
              uso: "Continuo / Gestión de activos"
            }
          ]
        },
        {
          id: "og_bitacora",
          nombre: "Bitácoras y Sistemas Operacionales",
          prompts: [
            {
              id: "og_bit_001",
              titulo: "Sistema Digital de Bitácora Operacional para Compresores",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero de Operaciones Senior con 20 años de experiencia en plantas de compresión de gas natural, especializado en operaciones de compresores centrífugos y reciprocantes, con conocimiento profundo de sistemas de control y monitoreo de condición.

CONTEXTO TÉCNICO:
- Industria: Estación de compresión de gas natural
- Equipos: 6 compresores centrífugos (gas lift y transporte) + 2 compresores reciprocantes (boosters)
- Potencia: 5,000 - 25,000 HP por unidad
- Conductores: Turbinas de gas y motores eléctricos
- Sistema de control: DCS (Distributed Control System)
- Parámetros críticos: Presión de succión/descarga, temperatura, vibración, flujo, eficiencia
- Turnos: 3 turnos rotativos (12 horas cada uno)
- Normas: API 617 (Axial and Centrifugal Compressors), API 618 (Reciprocating Compressors), API 670 (Machinery Protection Systems)

TAREA:
Desarrolla un sistema web completo de bitácora operacional digital para reemplazar las bitácoras en papel de una estación de compresión. El sistema debe:

1. MÓDULO DE REGISTRO POR TURNO:
   - Datos generales: Fecha, turno (A/B/C/D), operador principal, operador secundario, supervisor
   - Condiciones de operación al inicio del turno
   - Eventos relevantes durante el turno
   - Resumen del turno y pase al siguiente turno (handover)

2. MÓDULO DE MONITOREO DE COMPRESORES:
   Para cada compresor, registrar cada hora:
   - Parámetros de proceso:
     * Presión de succión (psig)
     * Presión de descarga (psig)
     * Temperatura de succión (°F)
     * Temperatura de descarga (°F)
     * Flujo de gas (MMSCFD)
     * Velocidad (RPM)
     * Potencia consumida (HP/kW)
   - Parámetros mecánicos:
     * Vibración radial DE (mils pk-pk)
     * Vibración radial NDE (mils pk-pk)
     * Vibración axial (mils pk-pk)
     * Temperatura de cojinete DE (°F)
     * Temperatura de cojinete NDE (°F)
     * Temperatura de sello (°F)
   - Sistema de lubricación:
     * Presión de aceite (psig)
     * Temperatura de aceite (°F)
     * Nivel de tanque (%)
     * Diferencia de presión de filtros (psid)
   - Sistema de gas de sello:
     * Presión de gas de sello (psig)
     * Flujo de gas de sello (SCFM)
     * Diferencia de presión (psid)

3. MÓDULO DE CÁLCULOS AUTOMÁTICOS:
   - Relación de compresión: Pd / Ps
   - Eficiencia isentrópica calculada
   - Potencia específica (HP/MMSCFD)
   - Head poli trópico
   - Desviación de condiciones de diseño (%)
   - Factor de carga (% de capacidad máxima)
   - Consumo específico de combustible (para turbinas)
   - Disponibilidad del equipo (% uptime)

4. MÓDULO DE ALERTAS Y ALARMAS:
   - Sistema de alertas automáticas cuando parámetros exceden límites:
     * Advertencia (Warning): 10% sobre valor normal
     * Alarma (Alarm): 20% sobre valor normal
     * Alarma crítica: Valor de disparo de protección
   - Notificaciones visuales y sonoras
   - Registro de alarmas con timestamp y acción tomada
   - Escalamiento automático según severidad

5. MÓDULO DE EVENTOS Y ANOMALÍAS:
   - Registro de eventos no rutinarios:
     * Arranques/paradas
     * Cambios de carga significativos
     * Alarmas activadas
     * Condiciones anormales
     * Mantenimiento de emergencia
   - Descripción detallada del evento
   - Acciones correctivas tomadas
   - Impacto en producción
   - Lecciones aprendidas

6. MÓDULO DE MANTENIMIENTO:
   - Registro de horas de operación por equipo (running hours)
   - Alertas de mantenimiento preventivo basado en horas:
     * Cambio de aceite (cada 2,000 horas)
     * Inspección de cojinetes (cada 8,000 horas)
     * Overhaul mayor (cada 25,000 horas)
   - Tracking de órdenes de trabajo
   - Registro de repuestos utilizados
   - Costos de mantenimiento por equipo

7. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard en tiempo real con:
     * Estado de todos los compresores (corriendo/standby/mantenimiento)
     * Producción total de la estación (MMSCFD)
     * Consumo de combustible/power
     * Eficiencia global
     * KPIs de confiabilidad (MTBF, MTTR, disponibilidad)
   - Gráficos de tendencia de parámetros críticos
   - Reportes automáticos:
     * Reporte diario de operaciones
     * Reporte semanal de producción
     * Reporte mensual de KPIs
     * Reporte de eventos y alarmas
   - Exportación a PDF/Excel
   - Comparación vs. condiciones de diseño

8. MÓDULO DE HANDOVER (PASE DE TURNO):
   - Resumen automático del turno
   - Equipos en condiciones anormales
   - Mantenimiento en progreso
   - Pendientes para siguiente turno
   - Instrucciones especiales
   - Firma digital de entrega y recepción

9. MÓDULO DE ANÁLISIS DE PERFORMANCE:
   - Curvas de performance vs. mapa del compresor
   - Análisis de eficiencia energética
   - Identificación de degradación de performance
   - Recomendaciones de optimización
   - Benchmarking entre unidades similares

10. FUNCIONALIDADES ADICIONALES:
    - Modo offline con sincronización automática
    - Firma digital de operadores
    - Adjuntar fotografías y documentos
    - Búsqueda avanzada en historial
    - Exportación de datos para análisis externo
    - Integración con sistemas SCADA/DCS (API)
    - Control de acceso por roles (operador, supervisor, ingeniero)

FORMATO DE SALIDA:
- Aplicación web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo SCADA/DCS moderno
- Diseño responsive optimizado para tablets en sala de control
- Código modular y bien documentado
- Datos de ejemplo realistas (24 horas de operación)
- Gráficos interactivos y dashboards en tiempo real

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- No requiere backend (pero prepararse para integración futura)

CRITERIOS DE CALIDAD:
- Interfaz intuitiva para operadores de campo
- Cálculos precisos de termodinámica y mecánica
- Manejo robusto de datos en tiempo real
- Reportes profesionales listos para gerencia
- Performance óptima con múltiples usuarios concurrentes

ENTREGABLE FINAL:
Sistema digital completo de bitácora operacional que reemplace las bitácoras en papel, permita monitoreo en tiempo real de compresores, genere reportes automáticos y mejore la toma de decisiones operativas en una estación de compresión de gas natural.`,
              tags: ["compresores", "bitácora digital", "operaciones", "monitoreo", "API 617"],
              uso: "Diario por turno"
            },
            {
              id: "og_bit_002",
              titulo: "Sistema de Gestión de Producción de Pozos Petroleros",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero de Producción Senior con 25 años de experiencia en producción de campos petroleros, especializado en análisis de comportamiento de pozos, optimización de producción y gestión de activos de yacimiento.

CONTEXTO TÉCNICO:
- Industria: Campo petrolero onshore con 150 pozos productores
- Tipo de pozos: 80 pozos de aceite, 50 pozos de gas, 20 pozos de agua
- Métodos de levantamiento artificial: 40 pozos con bombeo mecánico (beam pumps), 20 pozos con ESP (Electrical Submersible Pumps), 10 pozos con gas lift
- Yacimiento: Arenisca, profundidad 8,000-12,000 ft, API gravity 28°, presión inicial 4,500 psig
- Infraestructura: 5 baterías de separación, 2 plantas de tratamiento de agua, 1 planta de compresión
- Sistemas: SCADA para monitoreo remoto, DCS en baterías
- Personal: 30 operadores de campo, 5 ingenieros de producción, 2 geólogos

TAREA:
Desarrolla un sistema web integral de gestión de producción de pozos petroleros que incluya:

1. MÓDULO DE INVENTARIO DE POZOS:
   - Datos básicos: Tag, ubicación (GPS), tipo (aceite/gas/agua), fecha de completación, profundidad total, profundidad de completación
   - Características del yacimiento: Zona productora, permeabilidad, porosidad, saturación de aceite
   - Completación: Tipo (vertical/horizontal/direccional), número de zonas, tipo de estimulación (fracking/acid)
   - Equipos de levantamiento artificial: Tipo, modelo, capacidad, fecha de instalación
   - Conexión a superficie: Línea de flujo, batería asignada, distancia

2. MÓDULO DE MONITOREO DIARIO DE PRODUCCIÓN:
   Para cada pozo, registrar diariamente:
   - Presiones:
     * Presión de cabeza de pozo (THP - Tubing Head Pressure) en psig
     * Presión de línea de flujo (FLP - Flowing Line Pressure) en psig
     * Presión de anular (CHP - Casing Head Pressure) en psig
     * Presión de fondo fluyendo (BHP - Bottom Hole Pressure) calculada
   - Temperaturas:
     * Temperatura de cabeza de pozo (°F)
     * Temperatura de línea (°F)
   - Flujos:
     * Flujo de aceite (bbl/día)
     * Flujo de agua (bbl/día)
     * Flujo de gas total (Mscf/día)
     * Flujo de gas de formación (Mscf/día)
     * Flujo de gas de inyección (Mscf/día) para gas lift
   - Calidad del fluido:
     * BS&W (Basic Sediment & Water) %
     * API gravity
     * Corte de agua (Water Cut) %
   - Horas de operación:
     * Horas produciendo
     * Horas inyectando (gas lift)
     * Horas parado

3. MÓDULO DE CÁLCULOS AUTOMÁTICOS:
   - GOR (Gas-Oil Ratio): Gas total / Aceite total en scf/bbl
   - WOR (Water-Oil Ratio): Agua / Aceite en bbl/bbl
   - WOR injection (para gas lift): Gas inyectado / Aceite producido
   - Productividad (PI): Tasa de aceite / Drawdown en bbl/día/psi
   - Índice de productividad de aceite (OPI)
   - Eficiencia de levantamiento artificial
   - Factor de recobro estimado
   - Declinación diaria/mensual/anual
   - Volumen de yacimiento drenado

4. MÓDULO DE ANÁLISIS DE COMPORTAMIENTO:
   - Curvas de declinación (Arps, exponential, harmonic, hyperbolic)
   - Análisis de tendencias (30, 60, 90 días)
   - Identificación de problemas:
     * Problemas de arena
     * Problemas de agua (coning, channeling)
     * Problemas de escala
     * Problemas de parafina
     * Problemas de H2S/CO2
   - Análisis de eficiencia de estimulación
   - Evaluación de potencial de workover

5. MÓDULO DE EVENTOS Y ACCIONES:
   - Registro de intervenciones:
     * Workovers
     * Estimulaciones
     * Cambios de equipo de levantamiento
     * Reparaciones menores
     * Limpieza de pozos
   - Registro de problemas operativos:
     * Paradas no programadas
     * Problemas de arena
     * Problemas de emulsión
     * Problemas de corrosión
   - Costos de intervención
   - Incremento de producción post-intervención

6. MÓDULO DE OPTIMIZACIÓN:
   - Optimización de gas lift (inyección óptima)
   - Optimización de bombeo mecánico (SPM, stroke length)
   - Optimización de ESP (frecuencia, HP)
   - Análisis nodal simplificado
   - Recomendaciones de choke size
   - Balance de producción por batería

7. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard ejecutivo con KPIs:
     * Producción total de aceite (bopd)
     * Producción total de gas (mmcfd)
     * Producción total de agua (bwpd)
     * Corte de agua promedio (%)
     * Pozos activos vs. inactivos
     * Factor de disponibilidad (%)
     * Producción vs. plan vs. potencial
   - Gráficos de producción por campo/área/pozo
   - Mapas de ubicación con código de colores por producción
   - Reportes automáticos:
     * Reporte diario de producción
     * Reporte semanal de tendencias
     * Reporte mensual de KPIs
     * Reporte de declinación por pozo
   - Exportación a PDF/Excel
   - Comparación vs. plan de producción

8. MÓDULO DE PLANIFICACIÓN:
   - Plan de producción mensual/anual
   - Programación de intervenciones
   - Presupuesto de producción
   - Forecast de producción
   - Análisis de economía de pozos

9. MÓDULO DE INTEGRACIÓN:
   - Importación de datos desde SCADA/DCS
   - Exportación a sistemas corporativos (SAP, etc.)
   - API para integración con otros sistemas
   - Sincronización con bases de datos externas

10. FUNCIONALIDADES ADICIONALES:
    - Modo offline con sincronización
    - Alertas automáticas por desviaciones
    - Firma digital de operadores
    - Adjuntar fotografías y documentos
    - Búsqueda avanzada
    - Control de acceso por roles

FORMATO DE SALIDA:
- Aplicación web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo sistema de gestión de producción
- Diseño responsive para desktop, tablets y móviles
- Código modular y bien documentado
- Datos de ejemplo realistas (150 pozos, 30 días de operación)
- Dashboards interactivos y gráficos dinámicos

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Chart.js, Leaflet.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Preparado para integración con backend futuro

CRITERIOS DE CALIDAD:
- Cálculos precisos de ingeniería de producción
- Interfaz intuitiva para operadores e ingenieros
- Manejo eficiente de grandes volúmenes de datos
- Reportes profesionales listos para gerencia
- Performance óptima

ENTREGABLE FINAL:
Sistema integral de gestión de producción que permita a ingenieros de producción monitorear, analizar y optimizar la producción de 150 pozos, generando reportes automáticos y mejorando la toma de decisiones operativas.`,
              tags: ["producción", "pozos", "bombeo", "gas lift", "ESP", "declinación"],
              uso: "Diario / Continuo"
            }
          ]
        },
        {
          id: "og_seguridad",
          nombre: "Seguridad y HSE",
          prompts: [
            {
              id: "og_hse_001",
              titulo: "Sistema Digital de Permisos de Trabajo y Análisis de Riesgo",
              categoria: "Aplicación Web",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Profesional de Seguridad Industrial (CSP - Certified Safety Professional) con 20 años de experiencia en gestión de HSE para Oil & Gas, especializado en sistemas de permisos de trabajo, análisis de riesgo y gestión de cambios, con conocimiento profundo de OSHA PSM, EPA RMP y regulaciones IOGP.

CONTEXTO TÉCNICO:
- Industria: Planta de procesamiento de gas natural con área de proceso, almacenamiento de GLP, utilities y oficinas
- Personal: 250 empleados + 50 contratistas
- Tipos de trabajo: Mantenimiento mecánico, eléctrico, instrumentación, trabajo en caliente, espacios confinados, trabajo en altura, izajes críticos, excavaciones
- Zonas clasificadas: Clase I División 1 y 2 (áreas con gas inflamable)
- Sistemas existentes: LOTO (Lock Out Tag Out), JSA (Job Safety Analysis), MOC (Management of Change)
- Normas aplicables: OSHA 29 CFR 1910.119 (PSM), OSHA 29 CFR 1910.146 (Confined Space), OSHA 29 CFR 1910.147 (LOTO), NFPA 51B (Hot Work), API RP 750 (Management of Process Hazards)
- Incidentes históricos: 2 incendios menores, 5 fugas de gas, 3 lesiones con tiempo perdido en últimos 3 años

TAREA:
Desarrolla un sistema web completo de gestión de permisos de trabajo y análisis de riesgo que digitalice y mejore el proceso actual en papel. El sistema debe:

1. MÓDULO DE PERMISOS DE TRABAJO:
   - Tipos de permisos:
     * Permiso de trabajo en caliente (Hot Work Permit)
     * Permiso de entrada a espacio confinado (Confined Space Entry Permit)
     * Permiso de trabajo en altura (Working at Heights Permit)
     * Permiso de excavación (Excavation Permit)
     * Permiso de izaje crítico (Critical Lift Permit)
     * Permiso de trabajo eléctrico (Electrical Work Permit)
     * Permiso de trabajo en área clasificada (Classified Area Permit)
     * Permiso general de trabajo (General Work Permit)
   
   - Para cada permiso, capturar:
     * Datos generales: Número de permiso, solicitante, área solicitante, fecha y hora de solicitud
     * Descripción del trabajo: Ubicación específica, descripción detallada, duración estimada
     * Identificación de peligros: Lista de peligros potenciales (checklist dinámico según tipo de permiso)
     * Medidas de control: Controles de ingeniería, controles administrativos, EPP requerido
     * Aislamientos requeridos: LOTO, purga, inertización, bloqueo mecánico
     * Gas testing: Resultados de monitoreo de atmosfera (LEL, O2, H2S, CO)
     * Autorizaciones: Firma digital de solicitante, área operativa, seguridad, bomberos (si aplica)
     * Vigencia: Fecha/hora de inicio y vencimiento, extensiones si aplican
     * Cierre del permiso: Verificación de área limpia, restauración de sistemas, firma de cierre

2. MÓDULO DE ANÁLISIS DE RIESGO (JSA/JHA):
   - Plantilla de JSA (Job Safety Analysis) estructurada:
     * Paso 1: Descomposición del trabajo en pasos secuenciales
     * Paso 2: Identificación de peligros por paso (físicos, químicos, biológicos, ergonómicos, psicosociales)
     * Paso 3: Evaluación de riesgo inicial (probabilidad x severidad)
     * Paso 4: Definición de medidas de control
     * Paso 5: Evaluación de riesgo residual
     * Paso 6: Aprobación del análisis
   
   - Matriz de riesgo 5x5:
     * Probabilidad: 1 (Raro) a 5 (Casi seguro)
     * Severidad: 1 (Leve) a 5 (Catastrófico)
     * Niveles de riesgo: Bajo (1-4), Medio (5-9), Alto (10-16), Crítico (17-25)
   
   - Base de datos de peligros y controles por tipo de trabajo
   - Recomendaciones automáticas basadas en tipo de trabajo
   - Lecciones aprendidas de incidentes similares

3. MÓDULO DE GAS TESTING:
   - Registro de mediciones de atmosfera:
     * Ubicación y punto de muestreo
     * Fecha y hora de medición
     * Instrumento utilizado (tag, calibración)
     * Resultados: LEL (%), O2 (%), H2S (ppm), CO (ppm), otros gases si aplican
     * Condiciones ambientales (temperatura, humedad, viento)
     * Nombre y firma del gas tester
   - Criterios de aceptación:
     * LEL: < 10% para trabajo en caliente, < 20% para otros trabajos
     * O2: 19.5% - 23.5%
     * H2S: < 10 ppm (TLV-TWA)
     * CO: < 25 ppm (TLV-TWA)
   - Frecuencia de monitoreo según tipo de trabajo
   - Alertas automáticas cuando valores exceden límites

4. MÓDULO DE LOTO (LOCK OUT TAG OUT):
   - Procedimientos de aislamiento por equipo:
     * Identificación de fuentes de energía (eléctrica, mecánica, hidráulica, neumática, química, térmica, potencial)
     * Secuencia de bloqueo
     * Puntos de aislamiento específicos
     * Verificación de aislamiento
   - Registro de bloqueos aplicados:
     * Quien aplica el bloqueo
     * Fecha/hora de aplicación
     * Tipo de bloqueo (candado, válvula, brida ciega, etc.)
     * Tag number del equipo
   - Liberación de bloqueos:
     * Verificación de trabajo completado
     * Remoción de bloqueos en orden inverso
     * Prueba de arranque
     * Firma de liberación

5. MÓDULO DE SUPERVISIÓN EN CAMPO:
   - Checklist de supervisión de permisos activos:
     * Verificación de controles implementados
     * Verificación de EPP utilizado
     * Verificación de gas testing vigente
     * Verificación de comunicación entre trabajadores
     * Verificación de condiciones cambiantes
   - Registro de observaciones de seguridad (BBS - Behavior Based Safety)
   - Registro de actos y condiciones subestándar
   - Acciones correctivas inmediatas

6. MÓDULO DE GESTIÓN DE CONTRATISTAS:
   - Registro de contratistas autorizados:
     * Datos de la empresa
     * Seguro y certificaciones
     * Personal calificado
     * Historial de seguridad (EMR, TRIR)
   - Control de acceso a planta
   - Inducción y capacitación requerida
   - Performance de seguridad

7. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard en tiempo real con:
     * Permisos activos por tipo y área
     * Trabajos de alto riesgo en ejecución
     * Gas testing pendientes
     * Próximos vencimientos de permisos
     * KPIs de seguridad (permisos emitidos, Cerrar a tiempo, desviaciones)
   - Reportes automáticos:
     * Reporte diario de permisos
     * Reporte semanal de trabajos de alto riesgo
     * Reporte mensual de KPIs de seguridad
     * Análisis de tendencias
   - Exportación a PDF/Excel
   - Alertas y notificaciones

8. MÓDULO DE ANÁLISIS Y MEJORA:
   - Análisis de efectividad de controles
   - Identificación de tendencias de riesgo
   - Benchmarking por tipo de trabajo
   - Recomendaciones de mejora
   - Lecciones aprendidas

9. MÓDULO DE INTEGRACIÓN:
   - Integración con sistema de MOC (Management of Change)
   - Integración con sistema de gestión de incidentes
   - Integración con sistema de capacitación
   - API para integración con otros sistemas

10. FUNCIONALIDADES ADICIONALES:
    - Modo offline con sincronización
    - Firma digital en tablets/móviles
    - Notificaciones push para aprobaciones
    - Escaneo de códigos QR para verificación
    - Fotografías adjuntas
    - Geolocalización de trabajos
    - Control de acceso por roles (solicitante, supervisor HSE, operador, aprobador)
    - Auditoría completa de cambios

FORMATO DE SALIDA:
- Aplicación web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo sistema de gestión de seguridad
- Diseño responsive optimizado para tablets (uso en campo) y desktop (oficina)
- Código modular y bien documentado
- Datos de ejemplo realistas (permisos de diferentes tipos)
- Dashboards interactivos y flujos de trabajo claros

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Chart.js, jsPDF, SheetJS, moment.js, signature_pad.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Cumplimiento con OSHA PSM y IOGP

CRITERIOS DE CALIDAD:
- Sistema robusto y confiable para gestión de seguridad crítica
- Interfaz intuitiva para usuarios con diferente nivel técnico
- Trazabilidad completa de permisos y aprobaciones
- Cálculos precisos de evaluación de riesgo
- Reportes profesionales listos para auditoría

ENTREGABLE FINAL:
Sistema digital integral de permisos de trabajo que reemplace el proceso en papel, mejore la gestión de riesgo, asegure el cumplimiento regulatorio y reduzca incidentes en una planta de procesamiento de gas natural.`,
              tags: ["permisos de trabajo", "JSA", "LOTO", "HSE", "OSHA PSM", "seguridad"],
              uso: "Continuo / Gestión de seguridad"
            },
            {
              id: "og_hse_002",
              titulo: "Sistema de Investigación de Incidentes y Análisis de Causa Raíz",
              categoria: "Aplicación Web",
              prioridad: "critica",
              prompt: `ACTÚA COMO: Investigador Senior de Incidentes con certificación TapRooT® y 20 años de experiencia investigando incidentes graves en industrias de Oil & Gas, Química y Minería. Experto en metodologías de análisis de causa raíz (RCA), incluyendo TapRooT®, Ishikawa, 5 Why's, Fault Tree Analysis (FTA) y Barrier Analysis.

CONTEXTO TÉCNICO:
- Industria: Complejo industrial con planta de procesamiento, terminal de almacenamiento y ductos
- Personal: 500 empleados + 200 contratistas
- Tipos de incidentes: Lesiones personales, fugas de proceso, incendios/explosiones, daños a equipo, derrames ambientales, cuasi-accidentes (near misses)
- Normas y guías: IOGP (International Association of Oil & Gas Producers), OSHA 29 CFR 1910.119 (PSM), EPA RMP, CSB (Chemical Safety Board) Guidelines
- Sistemas existentes: Reporte en papel, base de datos Excel, sin análisis sistemático de causas
- Problemática: Alta reincidencia de incidentes similares, análisis superficiales, acciones correctivas inefectivas

TAREA:
Desarrolla un sistema web integral de investigación de incidentes y análisis de causa raíz que permita investigaciones sistemáticas, rigurosas y orientadas a la prevención. El sistema debe:

1. MÓDULO DE REPORTE INICIAL DE INCIDENTE:
   - Datos del incidente:
     * Número único de incidente (generado automáticamente)
     * Fecha y hora del incidente
     * Ubicación específica (área, equipo, coordenadas GPS)
     * Tipo de incidente (lesión, fuga, incendio, daño, derrame, near miss)
     * Severidad potencial (LEC - Loss Event Catalog)
     * Severidad real (lesiones, daños, tiempo perdido)
   
   - Descripción del incidente:
     * Narrativa detallada del evento
     * Secuencia de eventos (timeline)
     * Personas involucradas (empleados, contratistas, públicos)
     * Equipos/sistemas involucrados
     * Sustancias involucradas (si aplica)
     * Condiciones ambientales al momento del incidente
   
   - Respuesta inmediata:
     * Acciones de emergencia tomadas
     * Equipos de respuesta activados
     * Contención inicial
     * Notificaciones realizadas (internas/externas)
     * Estado actual del incidente (controlado, en progreso, cerrado)
   
   - Evidencia inicial:
     * Fotografías del lugar
     * Videos (si disponibles)
     * Documentos relevantes
     * Testigos identificados

2. MÓDULO DE INVESTIGACIÓN SISTEMÁTICA:
   - Asignación de equipo investigador:
     * Líder de investigación
     * Miembros del equipo (operaciones, mantenimiento, HSE, ingeniería)
     * Expertos técnicos (si se requieren)
     * Representantes de contratistas (si aplica)
   
   - Recolección de información:
     * Entrevistas con testigos y personas involucradas (formato estructurado)
     * Revisión de documentos (procedimientos, permisos, bitácoras)
     * Análisis de datos de proceso (tendencias, alarmas)
     * Inspección del lugar del incidente
     * Análisis de equipos/sistemas (si aplica)
     * Revisión de mantenimiento e inspecciones previas
   
   - Timeline detallado:
     * Construcción de línea de tiempo con eventos clave
     * Identificación de puntos de decisión
     * Análisis de ventanas de oportunidad perdidas

3. MÓDULO DE ANÁLISIS DE CAUSA RAÍZ (RCA):
   - Metodología TapRooT® simplificada:
     * Definición del incidente (qué pasó, cuándo, dónde)
     * Identificación de eventos causales
     * Análisis de cada evento causal usando TapRooT® Root Cause Tree
     * Identificación de causas contribuyentes
     * Identificación de causas raíz (generic causes)
   
   - Otras metodologías disponibles:
     * Diagrama de Ishikawa (Espina de Pescado): 6M (Mano de obra, Máquina, Método, Material, Medición, Medio ambiente)
     * 5 Why's: Preguntas sucesivas hasta llegar a la causa raíz
     * Fault Tree Analysis (FTA): Árbol de fallas con puertas AND/OR
     * Barrier Analysis: Análisis de barreras de control (preventivas y mitigadoras)
     * Change Analysis: Análisis de cambios que pudieron contribuir
   
   - Análisis de barreras:
     * Identificación de barreras que debieron prevenir el incidente
     * Evaluación de efectividad de cada barrera
     * Identificación de barreras fallidas o ausentes
     * Análisis de factores que degradaron las barreras
   
   - Análisis de cultura organizacional (si aplica):
     * Factores humanos y organizacionales
     * Presiones de producción vs. seguridad
     * Normalización del desvío
     * Comunicación y trabajo en equipo

4. MÓDULO DE ACCIONES CORRECTIVAS Y PREVENTIVAS (CAPA):
   - Identificación de acciones:
     * Acciones inmediatas (contención, protección)
     * Acciones correctivas (eliminar causa raíz)
     * Acciones preventivas (evitar recurrencia en otros equipos/áreas)
     * Acciones de mejora (fortalecer barreras existentes)
   
   - Para cada acción:
     * Descripción detallada
     * Responsable de implementación
     * Fecha límite
     * Recursos requeridos (presupuesto, personal, equipos)
     * Prioridad (crítica, alta, media, baja)
     * Tipo de acción (ingeniería, administrativo, procedimiento, capacitación, etc.)
     * Jerarquía de controles (eliminación, sustitución, ingeniería, administrativo, EPP)
   
   - Seguimiento de implementación:
     * Estado (pendiente, en progreso, completada, vencida)
     * Evidencia de implementación
     * Verificación de efectividad
     * Cierre de acción con aprobación

5. MÓDULO DE LECCIONES APRENDIDAS:
   - Documentación de lecciones aprendidas:
     * Qué pasó
     * Por qué pasó
     * Qué se aprendió
     * Qué se debe hacer diferente
   - Disseminación de lecciones aprendidas:
     * Alertas de seguridad (Safety Alerts)
     * Boletines de seguridad
     * Presentaciones en reuniones de seguridad
     * Actualización de procedimientos
     * Capacitaciones
   - Base de datos de lecciones aprendidas buscable

6. MÓDULO DE ANÁLISIS DE TENDENCIAS:
   - Análisis estadístico de incidentes:
     * Frecuencia por tipo, área, equipo, actividad
     * Tendencias temporales (mensual, trimestral, anual)
     * Análisis de reincidencia
     * Análisis de severidad
   - Identificación de patrones:
     * Equipos con alta frecuencia de incidentes
     * Actividades de alto riesgo
     * Áreas/problemáticas recurrentes
     * Factores comunes en incidentes graves
   - Benchmarking interno y externo (IOGP data)

7. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard ejecutivo con KPIs:
     * TRIR (Total Recordable Incident Rate)
     * LTIR (Lost Time Incident Rate)
     * Número de incidentes por tipo/severidad
     * % de investigaciones completadas a tiempo
     * % de acciones correctivas cerradas
     * Tiempo promedio de investigación
     * Reincidencia de incidentes
   - Reportes automáticos:
     * Reporte individual de investigación (formato profesional)
     * Reporte ejecutivo mensual
     * Reporte de tendencias trimestral
     * Reportes regulatorios (OSHA, EPA)
   - Exportación a PDF/Excel
   - Gráficos y visualizaciones interactivas

8. MÓDULO DE GESTIÓN DE CALIDAD:
   - Revisión de calidad de investigaciones:
     * Checklist de calidad de investigación
     * Revisión por pares
     * Aprobación por gerencia
   - Auditoría de efectividad de acciones:
     * Verificación de implementación
     * Evaluación de reducción de riesgo
     * Ajustes si es necesario

9. MÓDULO DE INTEGRACIÓN:
   - Integración con sistema de permisos de trabajo
   - Integración con sistema de gestión de cambios (MOC)
   - Integración con sistema de capacitación
   - Integración con bases de datos de IOGP/CSB
   - API para integración con otros sistemas

10. FUNCIONALIDADES ADICIONALES:
    - Modo offline con sincronización
    - Notificaciones automáticas (email, SMS)
    - Control de acceso por roles (investigador, supervisor, gerencia)
    - Firma digital
    - Adjuntar evidencias (fotos, videos, documentos)
    - Geolocalización de incidentes
    - Auditoría completa de cambios
    - Confidencialidad y control de acceso a información sensible

FORMATO DE SALIDA:
- Aplicación web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo sistema de gestión de investigaciones
- Diseño responsive para desktop (oficina) y tablets (campo)
- Código modular y bien documentado
- Datos de ejemplo realistas (5-10 incidentes de diferentes tipos)
- Flujos de trabajo claros y guías paso a paso

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Cumplimiento con guías IOGP y OSHA PSM

CRITERIOS DE CALIDAD:
- Sistema robusto para investigaciones rigurosas
- Metodologías de RCA correctamente implementadas
- Interfaz intuitiva para investigadores
- Trazabilidad completa de investigaciones
- Reportes profesionales listos para presentación ejecutiva
- Análisis de tendencias que identifiquen patrones

ENTREGABLE FINAL:
Sistema integral de investigación de incidentes que permita realizar investigaciones sistemáticas y rigurosas, identificar causas raíz reales, implementar acciones correctivas efectivas y reducir la reincidencia de incidentes en un complejo industrial.`,
              tags: ["incidentes", "causa raíz", "RCA", "TapRooT", "IOGP", "investigación"],
              uso: "Post-incidente / Gestión de seguridad"
            }
          ]
        },
        {
          id: "og_correos",
          nombre: "Correos y Comunicaciones Profesionales",
          prompts: [
            {
              id: "og_cor_001",
              titulo: "Generador de Reportes Ejecutivos de Operaciones",
              categoria: "Herramienta de Redacción",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Gerente de Operaciones Senior con 25 años de experiencia en plantas de Oil & Gas, especializado en comunicación ejecutiva, reportes de gestión y presentaciones a directorio. Experto en sintetizar información técnica compleja en mensajes claros y accionables para audiencias ejecutivas.

CONTEXTO TÉCNICO:
- Industria: Planta de procesamiento de gas natural con capacidad de 500 MMSCFD
- Audiencia del reporte: VP de Operaciones, Gerente General, Directorio
- Periodicidad: Reporte diario (ejecutivo), reporte semanal (detallado), reporte mensual (estratégico)
- KPIs clave: Producción vs. plan, disponibilidad de equipos, seguridad (TRIR, LTIR), calidad de producto, costos operativos, consumo energético, emisiones ambientales
- Problemática: Los reportes actuales son demasiado técnicos, extensos y no enfocados en lo que importa a la gerencia
- Expectativa: Reportes ejecutivos que en 2-3 minutos comuniquen lo esencial y permitan tomar decisiones

TAREA:
Desarrolla una herramienta web que genere reportes ejecutivos profesionales de operaciones automáticamente a partir de datos ingresados. La herramienta debe:

1. MÓDULO DE INGRESO DE DATOS:
   - Datos de producción:
     * Producción actual (MMSCFD de gas, BPD de líquidos)
     * Producción plan (MMSCFD, BPD)
     * % de cumplimiento vs. plan
     * Factores que afectaron la producción (si aplica)
   
   - Datos de disponibilidad:
     * Disponibilidad global de planta (%)
     * Equipos principales fuera de servicio (lista)
     * Tiempo fuera de servicio (horas)
     * Razón de cada parada (mantenimiento, falla, proceso, seguridad)
   
   - Datos de seguridad:
     * Incidentes del periodo (número, tipo, severidad)
     * Horas hombre trabajadas sin accidentes
     * Near misses reportados
     * Permisos de trabajo emitidos
     * Observaciones de seguridad
   
   - Datos de calidad:
     * Especificaciones de producto (punto de rocío, H2S, CO2, etc.)
     * Fuera de especificación (si aplica)
     * Quejas de clientes (si aplica)
   
   - Datos de costos:
     * Costo operativo del periodo ($/MMSCFD)
     * Presupuesto vs. real
     * Varianza y explicación
   
   - Datos de mantenimiento:
     * Mantenimiento preventivo completado (% vs. plan)
     * Mantenimiento correctivo (número de órdenes)
     * Backlog de mantenimiento (horas)
     * Mantenimiento crítico completado
   
   - Eventos relevantes:
     * Proyectos completados
     * Proyectos en progreso
     * Problemas críticos
     * Decisiones pendientes
     * Riesgos identificados

2. MÓDULO DE GENERACIÓN DE REPORTES:
   - Formato de reporte diario (1 página):
     * Resumen ejecutivo (3-5 bullets clave)
     * Dashboard de KPIs con semáforo (verde/amarillo/rojo)
     * Gráfico de producción vs. plan (últimos 7 días)
     * Top 3 eventos relevantes
     * Top 3 pendientes/decisiones requeridas
   
   - Formato de reporte semanal (2-3 páginas):
     * Resumen ejecutivo
     * Análisis de producción (tendencias, desviaciones, causas)
     * Análisis de disponibilidad (Pareto de fallas, MTBF, MTTR)
     * Análisis de seguridad (tendencias, acciones en progreso)
     * Análisis de mantenimiento (preventivo vs. correctivo, backlog)
     * Análisis de costos (varianza, tendencias)
     * Proyectos y mejoras (avance, próximos hitos)
     * Plan para la próxima semana
   
   - Formato de reporte mensual (5-7 páginas):
     * Resumen ejecutivo estratégico
     * Análisis completo de todos los KPIs
     * Análisis de tendencias (últimos 12 meses)
     * Benchmarking vs. industria
     * Análisis de riesgos y oportunidades
     * Plan de acción para el próximo mes
     * Recomendaciones estratégicas

3. MÓDULO DE ESTILO Y TONO:
   - Lenguaje ejecutivo:
     * Claro y conciso (sin jerga técnica innecesaria)
     * Orientado a resultados e impacto
     * Enfocado en lo que importa a la gerencia
     * Con recomendaciones accionables
   
   - Estructura de mensajes:
     * Situación (qué pasó)
     * Impacto (cómo nos afecta)
     * Causa (por qué pasó)
     * Acción (qué estamos haciendo)
     * Recomendación (qué necesitamos decidir/aprobar)
   
   - Uso de visualizaciones:
     * Gráficos simples y claros
     * Semáforos para status
     * Tablas resumen
     * Infografías para KPIs clave

4. MÓDULO DE PERSONALIZACIÓN:
   - Plantillas personalizables por tipo de reporte
   - Logo y colores corporativos
   - Formato de exportación (PDF, Word, PowerPoint, Email)
   - Idioma (español/inglés)
   - Nivel de detalle (ejecutivo, gerencial, técnico)

5. MÓDULO DE AUTOMATIZACIÓN:
   - Generación automática de reportes periódicos
   - Envío automático por email
   - Programación de reportes (diario, semanal, mensual)
   - Integración con fuentes de datos (SCADA, ERP, etc.)

6. MÓDULO DE ANÁLISIS DE CALIDAD:
   - Verificación de consistencia de datos
   - Detección de anomalías y outliers
   - Sugerencias de mejora en redacción
   - Verificación de cumplimiento de formato

FORMATO DE SALIDA:
- Herramienta web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo generador de reportes
- Diseño responsive para desktop
- Código modular y bien documentado
- Ejemplos de reportes generados (diario, semanal, mensual)
- Plantillas de ejemplo precargadas

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Chart.js, jsPDF, docx.js, SheetJS (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Generación de documentos profesionales

CRITERIOS DE CALIDAD:
- Reportes claros, concisos y accionables
- Lenguaje ejecutivo apropiado
- Visualizaciones efectivas
- Formato profesional listo para presentación
- Personalización fácil

ENTREGABLE FINAL:
Herramienta de generación automática de reportes ejecutivos que permita a gerentes de operaciones crear reportes profesionales en minutos, mejorando la comunicación con directorio y facilitando la toma de decisiones basada en datos.`,
              tags: ["reportes ejecutivos", "comunicación", "KPIs", "gerencia", "automatización"],
              uso: "Diario / Semanal / Mensual"
            }
          ]
        }
      ]
    },
    {
      id: "mineria",
      nombre: "Minería",
      icono: "⛏️",
      color: "#4e342e",
      descripcion: "Exploración, extracción, procesamiento y transporte de minerales",
      subcategorias: [
        {
          id: "min_inspeccion",
          nombre: "Inspección de Equipos Mineros",
          prompts: [
            {
              id: "min_insp_001",
              titulo: "Sistema de Gestión de Inspección Pre-Operacional de Flota Minera",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero de Mantenimiento Minero Senior con 20 años de experiencia en mantenimiento de equipos móviles de minería a cielo abierto (haul trucks, palas, perforadoras, cargadores), certificado en reliability-centered maintenance (RCM) y con conocimiento profundo de sistemas de gestión de mantenimiento (CMMS/EAM).

CONTEXTO TÉCNICO:
- Industria: Mina a cielo abierto de cobre con producción de 150,000 ton/día de mineral
- Flota principal:
  * 25 haul trucks (CAT 793F - 240 ton capacity, Komatsu 930E - 290 ton capacity)
  * 4 palas eléctricas (P&H 4100XPC - 59 m³ bucket)
  * 6 cargadores frontales (CAT 994K - 36 m³ bucket)
  * 8 perforadoras (P&H PV-351 - 12 3/4" drill)
  * 10 motoniveladoras (CAT 24M)
  * 15 camiones de agua (CAT 777G - 90 ton)
- Turnos: 3 turnos rotativos (12 horas)
- Objetivo: 85% disponibilidad física de flota
- Problemática actual: Inspecciones pre-operacionales en papel, inconsistentes, sin seguimiento de hallazgos, alta tasa de fallas inesperadas

TAREA:
Desarrolla un sistema web completo de gestión de inspecciones pre-operacionales para flota minera que reemplace las inspecciones en papel y mejore la confiabilidad de los equipos. El sistema debe:

1. MÓDULO DE CONFIGURACIÓN DE EQUIPOS:
   - Base de datos de equipos con:
     * Tag number, fabricante, modelo, año, número de serie
     * Tipo de equipo (haul truck, pala, cargador, etc.)
     * Componentes críticos (motor, transmisión, sistema hidráulico, frenos, etc.)
     * Checklist específico por tipo de equipo
     * Criterios de aceptación/rechazo por ítem
     * Fotografías de referencia (puntos de inspección)
   
   - Personalización de checklists por tipo de equipo:
     * Inspección de 360° (exterior)
     * Inspección de cabina
     * Inspección de compartimiento de motor
     * Pruebas de funcionamiento
     * Inspección bajo el equipo (pit)

2. MÓDULO DE INSPECCIÓN PRE-OPERACIONAL:
   Para cada tipo de equipo, checklist específico que incluya:

   HAUL TRUCKS (ejemplo CAT 793F):
   - Inspección exterior (360°):
     * Estado de neumáticos (presión, desgaste, daños, dual matching)
     * Estado de llantas y rines
     * Frenos (discos, pastillas, fugas)
     * Suspensión (cilindros, acumuladores)
     * Estructura (grietas, deformaciones, soldaduras)
     * Sistema de dirección (cilindros, barras)
     * Luces y señales (delanteras, traseras, estroboscópicas)
     * Espejos y cámaras
     * Sistema de supresión de polvo
     * Estado de la caja (desgaste, daños)
   
   - Inspección de cabina:
     * Asiento y cinturón de seguridad
     * Controles (joysticks, pedales, volante)
     * Instrumentos y pantallas
     * Sistema de climatización (AC/calor)
     * Radio y comunicaciones
     * Extintor y botiquín
     * Limpieza y visibilidad
   
   - Inspección de motor/compartimiento:
     * Nivel de aceite de motor
     * Nivel de refrigerante
     * Estado de mangueras y conexiones
     * Filtros de aire (indicador de restricción)
     * Sistema de combustible (fugas)
     * Batería y conexiones
     * Correas y tensores
   
   - Inspección bajo el equipo (pit):
     * Fugas de aceite/hidráulico
     * Estado de articulaciones y pasadores
     * Sistema de escape
     * Protecciones y guardas
     * Sistema de engrase automático
   
   - Pruebas de funcionamiento:
     * Arranque del motor
     * Prueba de frenos (servicio y estacionamiento)
     * Prueba de dirección
     * Prueba de levantamiento de caja
     * Prueba de sistema de apagado de emergencia
     * Prueba de alarmas y sensores

   PALAS ELÉCTRICAS (ejemplo P&H 4100XPC):
   - Sistema eléctrico (cables, motores, generadores)
   - Sistema hidráulico
   - Estructura y balancín
   - Sistema de cableado (power cable)
   - Sistema de lubricación automática
   - Sistema de refrigeración
   - Cabinas y controles
   - Sistemas de protección
   - Prueba de funciones críticas

3. MÓDULO DE REGISTRO Y SEGUIMIENTO:
   - Registro digital de inspección con:
     * Nombre del operador y turno
     * Fecha, hora y ubicación (GPS)
     * Horas de operación del equipo (hour meter)
     * Checklist completado (OK/NO OK/NA por ítem)
     * Fotografías de hallazgos
     * Comentarios y observaciones
     * Firma digital del operador
   
   - Clasificación de hallazgos:
     * Crítico: Equipo no puede operar (rojo)
     * Importante: Requiere atención pronto (amarillo)
     * Menor: Monitorear (verde)
   
   - Generación automática de órdenes de trabajo para hallazgos NO OK
   - Notificaciones automáticas a mantenimiento

4. MÓDULO DE ANÁLISIS Y REPORTES:
   - Dashboard con KPIs:
     * % de inspecciones completadas vs. plan
     * Tiempo promedio de inspección
     * Hallazgos por tipo de equipo
     * Equipos con más hallazgos críticos
     * Tendencias de hallazgos (30/60/90 días)
   
   - Análisis de confiabilidad:
     * Correlación entre hallazgos y fallas
     * Identificación de patrones de falla
     * Recomendaciones de mantenimiento predictivo
   
   - Reportes automáticos:
     * Reporte diario de inspecciones
     * Reporte semanal de hallazgos
     * Reporte mensual de tendencias
     * Reporte de equipos críticos
   
   - Exportación a PDF/Excel

5. MÓDULO DE INTEGRACIÓN:
   - Integración con CMMS (SAP PM, Maximo, etc.)
   - Integración con sistema de gestión de repuestos
   - Integración con sistema de telemetría (CAT MineStar, Komatsu Komtrax)
   - API para integración con otros sistemas

6. FUNCIONALIDADES ADICIONALES:
   - Modo offline con sincronización automática
   - Escaneo de QR/Barcode para identificación de equipos
   - Firma digital de operadores
   - Fotografías con anotaciones
   - Geolocalización de inspecciones
   - Control de acceso por roles (operador, supervisor, ingeniero)
   - Notificaciones push para hallazgos críticos
   - Búsqueda avanzada en historial

FORMATO DE SALIDA:
- Aplicación web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo sistema de gestión de mantenimiento
- Diseño responsive optimizado para tablets (uso en campo)
- Código modular y bien documentado
- Datos de ejemplo realistas (flota completa, 1 semana de inspecciones)
- Checklists detallados para cada tipo de equipo

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Preparado para integración con CMMS

CRITERIOS DE CALIDAD:
- Sistema robusto para uso en condiciones adversas (polvo, vibración)
- Interfaz intuitiva para operadores con diferente nivel técnico
- Checklists completos y específicos por tipo de equipo
- Trazabilidad completa de hallazgos y acciones
- Reportes profesionales listos para gerencia

ENTREGABLE FINAL:
Sistema digital integral de inspecciones pre-operacionales que reemplace las inspecciones en papel, mejore la detección temprana de problemas, reduzca fallas inesperadas y aumente la disponibilidad de flota en una mina a cielo abierto.`,
              tags: ["flota minera", "inspección pre-operacional", "haul trucks", "palas", "mantenimiento"],
              uso: "Diario / Pre-operacional"
            }
          ]
        },
        {
          id: "min_bitacora",
          nombre: "Bitácoras y Control de Producción",
          prompts: [
            {
              id: "min_bit_001",
              titulo: "Sistema de Control de Producción Minera en Tiempo Real",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Superintendente de Operaciones Mineras con 25 años de experiencia en minería a cielo abierto de cobre, hierro y oro, especializado en planificación de corto plazo, control de producción y optimización de flota. Experto en sistemas de despacho y monitoreo de producción en tiempo real.

CONTEXTO TÉCNICO:
- Industria: Mina a cielo abierto de cobre con producción de 150,000 ton/día de mineral y 300,000 ton/día de estéril
- Flota: 25 haul trucks (240-290 ton), 4 palas eléctricas (59 m³), 6 cargadores (36 m³), 8 perforadoras, 10 motoniveladoras
- Áreas de trabajo: 3 pits activos (Pit Norte, Pit Sur, Pit Este), 4 botaderos, 2 chancadoras primarias, 1 stockpile de mineral
- Turnos: 3 turnos de 12 horas (60 operadores de equipo, 15 supervisores)
- Sistemas existentes: Sistema de despacho manual por radio, GPS básico en equipos, sin integración de datos
- Problemática: Falta de visibilidad en tiempo real de producción, retrasos en reporte de producción, dificultad para optimizar asignación de equipos

TAREA:
Desarrolla un sistema web completo de control de producción minera en tiempo real que reemplace el sistema manual actual y optimice la operación. El sistema debe:

1. MÓDULO DE DESPACHO Y ASIGNACIÓN DE EQUIPOS:
   - Asignación dinámica de equipos a áreas de trabajo:
     * Haul trucks asignados a rutas específicas (pit -> chancadora/botadero)
     * Palas y cargadores asignados a bancos de perforación
     * Optimización de ciclos de carga-transporte-descarga
   - Cálculo automático de match factor (equilibrio pala-camión)
   - Recomendaciones de reasignación basadas en producción
   - Gestión de cambios de turno de equipos

2. MÓDULO DE MONITOREO EN TIEMPO REAL:
   - Tracking de posición de equipos (simulado con coordenadas)
   - Estado de equipos (cargando, transportando, descargando, esperando, mantenimiento)
   - Tiros de ciclo (cycle times) por equipo y ruta
   - Velocidad promedio y tiempos de espera
   - Conteo de ciclos completados por turno
   - Alertas de equipos detenidos o fuera de ruta

3. MÓDULO DE REGISTRO DE PRODUCCIÓN:
   - Registro automático de toneladas movidas por:
     * Área de origen (pit, banco)
     * Tipo de material (mineral, estéril, rehandle)
     * Destino (chancadora, botadero, stockpile)
   - Calidad de mineral (ley de Cu, humedad, granulometría estimada)
   - Distancia de acarreo promedio
   - Consumo de combustible por equipo
   - Eficiencia de operación (% tiempo productivo)

4. MÓDULO DE CONTROL DE CALIDAD:
   - Muestreo de mineral en puntos de control
   - Registro de leyes (Cu, Au, Ag, Fe, etc.)
   - Control de mezcla en stockpiles
   - Alimentación a chancadora vs. plan
   - Desviaciones de calidad y acciones correctivas

5. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard en tiempo real con:
     * Producción actual vs. plan (tonelaje, leyes)
     * Estado de flota (disponible, operando, mantenimiento)
     * Productividad por equipo (ton/hora, ciclos/hora)
     * Utilización de flota (%)
     * Combustible consumido vs. plan
   - Gráficos de producción por hora/turno/día
   - Mapas de producción por área
   - Reportes automáticos:
     * Reporte de producción por turno
     * Reporte diario de producción
     * Reporte semanal de KPIs
     * Reporte de eficiencia de flota
   - Exportación a PDF/Excel

6. MÓDULO DE ANÁLISIS DE PERFORMANCE:
   - Análisis de eficiencia de equipos (ton/hora real vs. diseño)
   - Identificación de cuellos de botella
   - Análisis de tiempos de espera y retrasos
   - Benchmarking entre equipos similares
   - Tendencias de productividad

7. MÓDULO DE PLANIFICACIÓN:
   - Plan de producción diario/semanal
   - Asignación de equipos por turno
   - Metas de producción por área
   - Plan de mantenimiento coordinado con producción

8. FUNCIONALIDADES ADICIONALES:
   - Modo offline con sincronización
   - Integración con sistemas de despacho (Wenco, Modular, etc.)
   - Alertas automáticas por desviaciones
   - Control de acceso por roles (despachador, supervisor, superintendente)
   - Historial completo de operaciones

FORMATO DE SALIDA:
- Aplicación web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo sistema de despacho minero
- Diseño responsive para desktop (sala de control) y tablets (campo)
- Código modular y bien documentado
- Datos de ejemplo realistas (1 turno completo de operación)
- Dashboards interactivos y mapas de operación

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Chart.js, Leaflet.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Preparado para integración con sistemas de despacho

CRITERIOS DE CALIDAD:
- Sistema robusto para operación 24/7
- Interfaz intuitiva para despachadores y supervisores
- Cálculos precisos de producción y eficiencia
- Reportes profesionales listos para gerencia
- Performance óptima con múltiples equipos

ENTREGABLE FINAL:
Sistema integral de control de producción minera que permita monitorear y optimizar la operación en tiempo real, mejorando la productividad de flota y asegurando el cumplimiento del plan de producción.`,
              tags: ["producción minera", "despacho", "flota", "control en tiempo real", "optimización"],
              uso: "Diario / Continuo"
            }
          ]
        }
      ]
    },
    {
      id: "desalinizacion",
      nombre: "Desalinizadoras",
      icono: "🌊",
      color: "#0277bd",
      descripcion: "Plantas de desalinización y tratamiento de agua",
      subcategorias: [
        {
          id: "des_aplicaciones",
          nombre: "Aplicaciones de Gestión",
          prompts: [
            {
              id: "des_app_001",
              titulo: "Sistema SCADA Web para Planta Desalinizadora por Osmosis Inversa",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero de Automatización y Control Senior con 20 años de experiencia en plantas de desalinización por ósmosis inversa, especializado en sistemas SCADA, instrumentación de proceso y optimización de plantas de agua. Experto en normas AWWA, IDA y estándares de calidad de agua OMS.

CONTEXTO TÉCNICO:
- Industria: Planta desalinizadora de agua de mar por ósmosis inversa
- Capacidad: 100,000 m³/día de agua producida
- Configuración: 6 trenes de RO ( Reverse Osmosis) con 80 membranas cada uno
- Sistema de captación: Intake marino con tamices y cloración
- Pre-tratamiento: Coagulación/floculación, filtración multimedia, cartridge filters
- Post-tratamiento: Remineralización con cal y CO2, desinfección UV/cloro
- Normas: OMS Guidelines for Drinking-water Quality, AWWA Standards, IDA Desalination Yearbook
- Personal: 15 operadores (3 turnos), 3 ingenieros de proceso, 1 laboratorio
- Problemática: Sistema SCADA antiguo, sin visualización moderna, reportes manuales, falta de optimización energética

TAREA:
Desarrolla un sistema SCADA web completo para monitoreo y control de planta desalinizadora por ósmosis inversa. El sistema debe:

1. MÓDULO DE CAPTACIÓN Y PRE-TRATAMIENTO:
   - Monitoreo de parámetros de agua de mar:
     * Temperatura (°C)
     * Salinidad/TDS (ppm)
     * Turbiedad (NTU)
     * pH
     * SDI (Silt Density Index)
     * Cloro libre (ppm)
   - Control de bombas de captación (estado, velocidad, flujo)
   - Estado de tamices y sistema de limpieza
   - Dosificación de cloro y coagulante
   - Niveles de tanques de agua cruda

2. MÓDULO DE ÓSMOSIS INVERSA (RO):
   - Monitoreo por tren de RO:
     * Presión de alimentación (bar)
     * Presión de concentrado (bar)
     * Presión diferencial (bar)
     * Flujo de permeado (m³/h)
     * Flujo de rechazo (m³/h)
     * Recovery (%)
     * Conductividad de permeado (μS/cm)
     * Conductividad de rechazo (μS/cm)
     * Temperatura de alimentación (°C)
   - Cálculos automáticos:
     * Normalización de datos (vs. condiciones de diseño)
     * Salt rejection (%)
     * Specific energy consumption (kWh/m³)
     * Flux (LMH - liters per square meter per hour)
   - Estado de bombas de alta presión
   - Dosificación de antiscalant y ácido

3. MÓDULO DE POST-TRATAMIENTO:
   - Monitoreo de remineralización:
     * Dosis de cal (kg/h)
     * Dosis de CO2 (kg/h)
     * pH de producto
     * Alcalinidad (mg/L CaCO3)
     * Dureza (mg/L CaCO3)
     * LSI (Langelier Saturation Index)
   - Desinfección final:
     * Dosis de UV (mJ/cm²)
     * Cloro residual (ppm)
   - Tanque de almacenamiento y bombas de distribución

4. MÓDULO DE CONTROL Y AUTOMATIZACIÓN:
   - Diagramas P&ID interactivos con animación de flujo
   - Control de bombas (start/stop, velocidad VFD)
   - Control de válvulas (abrir/cerrar, modulación)
   - Secuencias de arranque/parada
   - Secuencia de CIP (Clean In Place)
   - Lógica de protección y enclavamientos

5. MÓDULO DE ALERTAS Y ALARMAS:
   - Sistema de alarmas por desviación de parámetros:
     * Presión diferencial alta (fouling)
     * Conductividad de permeado alta (membrana dañada)
     * Recovery bajo
     * Temperatura fuera de rango
     * Nivel de tanques crítico
   - Priorización de alarmas (crítica, alta, media, baja)
   - Historial de alarmas con timestamps
   - Notificaciones por email/SMS

6. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard ejecutivo con KPIs:
     * Producción total (m³/día)
     * Calidad de permeado (TDS, pH)
     * Consumo energético específico (kWh/m³)
     * Recovery promedio (%)
     * Disponibilidad de planta (%)
     * Costo de producción ($/m³)
   - Tendencias históricas de parámetros críticos
   - Análisis de performance de membranas
   - Reportes automáticos:
     * Reporte diario de producción
     * Reporte de calidad de agua
     * Reporte de consumo energético
     * Reporte de CIP y limpieza de membranas
   - Exportación a PDF/Excel

7. MÓDULO DE OPTIMIZACIÓN ENERGÉTICA:
   - Análisis de consumo energético por tren
   - Recomendaciones de optimización de presión
   - Cálculo de costo energético por m³ producido
   - Benchmarking vs. mejores prácticas (IDA)

8. MÓDULO DE GESTIÓN DE MEMBRANAS:
   - Registro de membranas (instalación, limpieza, performance)
   - Predicción de vida útil
   - Programación de limpiezas CIP
   - Análisis de fouling y scaling

9. FUNCIONALIDADES ADICIONALES:
   - Modo offline con sincronización
   - Acceso remoto seguro
   - Control de acceso por roles (operador, supervisor, ingeniero)
   - Integración con laboratorio (LIMS)
   - Historial completo de operaciones

FORMATO DE SALIDA:
- Aplicación web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo SCADA moderno
- Diseño responsive para sala de control (desktop) y campo (tablets)
- Código modular y bien documentado
- Datos de ejemplo realistas (24 horas de operación)
- Diagramas P&ID interactivos

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Preparado para integración con PLC/SCADA real

CRITERIOS DE CALIDAD:
- Sistema robusto para operación 24/7
- Interfaz intuitiva para operadores
- Cálculos precisos de proceso
- Visualización clara de estado de planta
- Reportes profesionales listos para gerencia

ENTREGABLE FINAL:
Sistema SCADA web completo para monitoreo y control de planta desalinizadora que permita optimizar la operación, reducir consumo energético, asegurar calidad de agua y mejorar la toma de decisiones operativas.`,
              tags: ["SCADA", "ósmosis inversa", "desalinización", "control de proceso", "agua"],
              uso: "Continuo / Operación de planta"
            }
          ]
        }
      ]
    },
    {
      id: "energia",
      nombre: "Plantas de Energía",
      icono: "⚡",
      color: "#f9a825",
      descripcion: "Generación térmica, renovable, transmisión y distribución",
      subcategorias: [
        {
          id: "en_aplicaciones",
          nombre: "Aplicaciones de Gestión",
          prompts: [
            {
              id: "en_app_001",
              titulo: "Sistema de Monitoreo de Generación Fotovoltaica con Análisis de Performance",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Ingeniero de Energías Renovables Senior con 15 años de experiencia en plantas solares fotovoltaicas de utilidad, especializado en monitoreo de performance, análisis de datos y optimización de generación. Experto en estándares IEC 61724 (PV System Performance Monitoring) y normas IEEE.

CONTEXTO TÉCNICO:
- Industria: Planta fotovoltaica de 100 MW conectada a red de transmisión
- Configuración: 300,000 paneles monocristalinos de 335W, 50 inversores centrales de 2MW
- Ubicación: Desierto de Atacama, Chile (alta radiación, baja precipitación)
- Radiación promedio: 2,500 kWh/m²/año (una de las más altas del mundo)
- Sistema de monitoreo: Dataloggers por inversor, estación meteorológica, sensores de paneles
- Problemática: Sistema de monitoreo disperso, sin análisis integrado de performance, dificultad para identificar underperformance, falta de reportes automáticos

TAREA:
Desarrolla un sistema web completo de monitoreo y análisis de performance para planta fotovoltaica. El sistema debe:

1. MÓDULO DE MONITOREO EN TIEMPO REAL:
   - Datos de generación por inversor:
     * Potencia AC (kW)
     * Potencia DC (kW)
     * Energía generada (kWh)
     * Voltaje y corriente DC/AC
     * Frecuencia (Hz)
     * Factor de potencia
     * Estado (operando/falla/mantenimiento)
   - Datos meteorológicos:
     * Irradiancia global (W/m²)
     * Irradiancia directa y difusa
     * Temperatura ambiente (°C)
     * Temperatura de módulos (°C)
     * Velocidad y dirección de viento (m/s)
     * Humedad relativa (%)
   - Estado de subestación y conexión a red

2. MÓDULO DE ANÁLISIS DE PERFORMANCE:
   - Cálculos automáticos según IEC 61724:
     * Performance Ratio (PR) - índice de performance
     * Capacity Factor - factor de capacidad
     * Specific Yield - rendimiento específico (kWh/kWp)
     * Array Yield - rendimiento del arreglo
     * System losses - pérdidas del sistema
   - Análisis de underperformance:
     * Identificación de inversores con baja producción
     * Detección de strings problemáticos
     * Análisis de degradación de paneles
     * Pérdidas por sombreado, suciedad, temperatura
   - Benchmarking entre inversores y áreas

3. MÓDULO DE ANÁLISIS DE DATOS:
   - Tendencias históricas de generación
   - Análisis de correlación radiación vs. generación
   - Análisis de pérdidas por temperatura
   - Análisis de disponibilidad
   - Análisis de curvas de duración de potencia
   - Comparación vs. año típico (TMY)

4. MÓDULO DE ALERTAS Y MANTENIMIENTO:
   - Sistema de alertas automáticas:
     * Inversores fuera de servicio
     * Baja producción vs. esperado
     * Temperaturas de módulos elevadas
     * Problemas de conexión a red
   - Generación automática de órdenes de trabajo
   - Tracking de mantenimiento preventivo y correctivo
   - Análisis de MTBF y MTTR

5. MÓDULO DE REPORTES Y DASHBOARD:
   - Dashboard ejecutivo con KPIs:
     * Generación total (MWh) vs. plan
     * Performance Ratio (%)
     * Factor de capacidad (%)
     * Disponibilidad de planta (%)
     * Ingresos por generación ($)
     * Evitación de emisiones CO2 (ton)
   - Gráficos de generación diaria/mensual/anual
   - Mapas de calor de producción por inversor
   - Reportes automáticos:
     * Reporte diario de generación
     * Reporte mensual de performance
     * Reporte anual de energía
     * Reportes regulatorios
   - Exportación a PDF/Excel

6. MÓDULO DE PREDICCIÓN:
   - Predicción de generación diaria basada en pronóstico meteorológico
   - Predicción de ingresos
   - Análisis de estacionalidad
   - Planificación de mantenimiento basada en predicción

7. MÓDULO DE GESTIÓN AMBIENTAL:
   - Cálculo de evitación de emisiones de CO2
   - Reportes de sostenibilidad
   - Análisis de huella de carbono

8. FUNCIONALIDADES ADICIONALES:
   - Modo offline con sincronización
   - Acceso remoto seguro
   - Integración con pronóstico meteorológico
   - Control de acceso por roles
   - API para integración con otros sistemas

FORMATO DE SALIDA:
- Aplicación web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo sistema de monitoreo de generación
- Diseño responsive para desktop y tablets
- Código modular y bien documentado
- Datos de ejemplo realistas (1 mes de operación)
- Dashboards interactivos y gráficos dinámicos

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Chart.js, Leaflet.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Cálculos según IEC 61724

CRITERIOS DE CALIDAD:
- Sistema robusto para monitoreo 24/7
- Cálculos precisos de performance
- Interfaz intuitiva para ingenieros y operadores
- Reportes profesionales listos para inversionistas
- Análisis avanzado de datos

ENTREGABLE FINAL:
Sistema integral de monitoreo y análisis de performance para planta fotovoltaica que permita optimizar la generación, identificar problemas rápidamente, generar reportes automáticos y maximizar el retorno de inversión.`,
              tags: ["fotovoltaica", "solar", "monitoreo", "performance", "IEC 61724"],
              uso: "Continuo / Monitoreo de generación"
            }
          ]
        }
      ]
    },
    {
      id: "general",
      nombre: "Uso General Industrial",
      icono: "📋",
      color: "#37474f",
      descripcion: "Herramientas y aplicaciones transversales para cualquier industria",
      subcategorias: [
        {
          id: "gen_herramientas",
          nombre: "Herramientas de Gestión",
          prompts: [
            {
              id: "gen_herr_001",
              titulo: "Sistema de Gestión de Indicadores KPI con Dashboard Ejecutivo",
              categoria: "Aplicación Web",
              prioridad: "alta",
              prompt: `ACTÚA COMO: Gerente de Excelencia Operacional y Business Intelligence con 20 años de experiencia implementando sistemas de gestión de KPIs en industrias manufactureras, Oil & Gas, minería y servicios. Experto en metodologías de mejora continua (Lean, Six Sigma, TPM) y visualización de datos ejecutivos.

CONTEXTO TÉCNICO:
- Industria: Aplicable a cualquier industria manufacturera o de procesos
- Audiencia: Gerencia general, directores, superintendentes, supervisores
- Problemática: KPIs dispersos en Excel, sin visualización integrada, falta de tendencias, reportes manuales que consumen tiempo, dificultad para identificar desviaciones rápidamente
- Expectativa: Sistema centralizado de KPIs con dashboards ejecutivos, alertas automáticas, tendencias y análisis de performance

TAREA:
Desarrolla un sistema web completo de gestión de indicadores KPI con dashboards ejecutivos que centralice todos los indicadores de gestión de una planta industrial. El sistema debe:

1. MÓDULO DE CONFIGURACIÓN DE KPIs:
   - Definición de KPIs con:
     * Nombre del indicador
     * Fórmula de cálculo
     * Unidad de medida
     * Frecuencia de medición (diario, semanal, mensual)
     * Responsable del indicador
     * Meta/objetivo
     * Límites de semáforo (verde, amarillo, rojo)
     * Categoría (seguridad, producción, calidad, mantenimiento, costos, energía, RRHH)
   - Plantillas predefinidas de KPIs industriales:
     * Seguridad: TRIR, LTIR, días sin accidentes, % de observaciones cerradas
     * Producción: Tonelaje producido, OEE, disponibilidad, performance, calidad
     * Mantenimiento: MTBF, MTTR, disponibilidad de equipos, % preventivo vs. correctivo, backlog
     * Calidad: % producto conforme, reprocesos, quejas de clientes, costos de no calidad
     * Costos: Costo unitario, presupuesto vs. real, varianza
     * Energía: Consumo específico, intensidad energética, costo energético por unidad
     * RRHH: Rotación, absentismo, horas de capacitación, clima laboral

2. MÓDULO DE INGRESO DE DATOS:
   - Ingreso manual de valores de KPIs
   - Importación masiva desde Excel/CSV
   - Validación de datos (rangos, consistencia)
   - Historial de valores ingresados
   - Cálculo automático de indicadores derivados

3. MÓDULO DE DASHBOARDS EJECUTIVOS:
   - Dashboard general con vista de todos los KPIs:
     * Semáforo de cumplimiento (verde/amarillo/rojo)
     * Tendencia histórica (últimos 12 meses)
     * Comparación vs. meta
     * Ranking de KPIs críticos
   - Dashboards por categoría:
     * Dashboard de seguridad
     * Dashboard de producción
     * Dashboard de mantenimiento
     * Dashboard de calidad
     * Dashboard de costos
     * Dashboard de energía
   - Drill-down desde resumen ejecutivo hasta detalle
   - Personalización de vistas por usuario/rol

4. MÓDULO DE ANÁLISIS Y TENDENCIAS:
   - Gráficos de tendencia histórica
   - Análisis de variación (vs. periodo anterior, vs. mismo mes año anterior)
   - Análisis de correlación entre KPIs
   - Identificación de patrones y anomalías
   - Proyección de tendencias
   - Análisis de Pareto (80/20)

5. MÓDULO DE ALERTAS Y NOTIFICACIONES:
   - Alertas automáticas cuando KPIs exceden límites:
     * Notificación visual en dashboard
     * Email automático a responsables
     * Resumen ejecutivo diario/semanal
   - Escalamiento automático según severidad
   - Tracking de acciones correctivas por KPI en rojo

6. MÓDULO DE REPORTES:
   - Reportes automáticos:
     * Reporte ejecutivo mensual (1-2 páginas)
     * Reporte detallado por categoría
     * Reporte de tendencias trimestral
     * Reporte de análisis de causa raíz para KPIs críticos
   - Formatos: PDF, Excel, PowerPoint
   - Personalización de plantillas
   - Distribución automática por email

7. MÓDULO DE METAS Y OBJETIVOS:
   - Definición de metas anuales/mensuales
   - Tracking de cumplimiento
   - Análisis de gap vs. objetivos
   - Plan de acción para cerrar brechas

8. MÓDULO DE BENCHMARKING:
   - Comparación vs. estándares de industria
   - Benchmarking entre plantas/áreas similares
   - Mejores prácticas identificadas

9. FUNCIONALIDADES ADICIONALES:
   - Modo offline con sincronización
   - Control de acceso por roles y permisos
   - Auditoría de cambios
   - API para integración con otros sistemas
   - Exportación de datos para análisis externo

FORMATO DE SALIDA:
- Aplicación web completa en HTML/CSS/JavaScript
- Interfaz profesional tipo Business Intelligence
- Diseño responsive para desktop, tablets y móviles
- Código modular y bien documentado
- Datos de ejemplo realistas (12 meses de KPIs)
- Dashboards interactivos y gráficos dinámicos

RESTRICCIONES:
- Todo en un solo archivo HTML
- Librerías permitidas: Chart.js, jsPDF, SheetJS, moment.js (CDN)
- Funcionalidad offline completa
- LocalStorage para persistencia
- Preparado para integración con backend

CRITERIOS DE CALIDAD:
- Sistema robusto y escalable
- Visualización clara y ejecutiva
- Cálculos precisos de indicadores
- Reportes profesionales listos para presentación
- Interfaz intuitiva para todos los niveles

ENTREGABLE FINAL:
Sistema integral de gestión de KPIs que centralice todos los indicadores de una planta industrial, proporcione dashboards ejecutivos claros, genere alertas automáticas y facilite la toma de decisiones basada en datos.`,
              tags: ["KPIs", "dashboard ejecutivo", "Business Intelligence", "gestión", "indicadores"],
              uso: "Continuo / Gestión empresarial"
            }
          ]
        }
      ]
    }
  ],
  
  configuracion: {
    nombreApp: "Biblioteca de Promps Industriales",
    version: "3.0.0",
    autor: "Industrial Prompt Library",
    descripcion: "Colección profesional de mega-prompts para generación de aplicaciones industriales completas en Oil & Gas, Minería, Desalinización, Energía y más.",
    idiomas: ["es"],
    plataformas: ["Android", "iOS", "Web", "Tablet"],
    funcionalidades: [
      "Búsqueda por palabras clave",
      "Filtrado por industria y categoría",
      "Exportación a PDF",
      "Exportación a Excel",
      "Envío por correo electrónico",
      "Guardado offline (PWA)",
      "Favoritos personales",
      "Historial de uso",
      "Copiado rápido al portapapeles",
      "Modo oscuro/claro"
    ]
  }
};
