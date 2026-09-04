/* ============================================================
   BIBLIOTECA DE PROMPS — PROMPTS SIMPLIFICADOS v1.0
   Plantillas simplificadas para generar apps HTML/CSS interactivas
   con diseño bento-grid profesional (shadcn port).
   ============================================================ */
/* global module */

const PROMPTS_SIMPLIFIED = {
  version: '1.0.0',
  designSystem: 'bento-grid',
  generated: new Date().toISOString(),

  apps: [
    {
      id: 'simpl_psv_inspection',
      titulo: 'Inspección de Válvulas PSV',
      categoria: 'Oil & Gas',
      prioridad: 'alta',
      descripcion: 'Sistema de inspección y trazabilidad de válvulas de seguridad (PSV) con dashboard bento-grid.',
      estructura: {
        layout: 'dashboard',
        secciones: [
          {
            tipo: 'bento-stats',
            titulo: 'Métricas de Inspección',
            tarjetas: [
              { titulo: 'Total PSV', valor: '180', status: 'info', icono: 'valve' },
              { titulo: 'Inspeccionadas', valor: '142', status: 'ok', icono: 'check-circle' },
              { titulo: 'Pendientes', valor: '38', status: 'warn', icono: 'clock' },
              { titulo: 'Vencidas', valor: '5', status: 'err', icono: 'alert-triangle' },
              { titulo: 'Próx. Vencimiento', valor: '12', status: 'warn', icono: 'calendar' },
              { titulo: 'Conformidad', valor: '94%', status: 'ok', icono: 'trending-up' },
            ],
          },
          {
            tipo: 'bento-table',
            titulo: 'Registro de Inspecciones',
            columnas: ['Tag', 'Servicio', 'Fabricante', 'Última Inspección', 'Próxima', 'Estado'],
            datos: 'psv_data',
          },
          {
            tipo: 'bento-chart',
            titulo: 'Tendencia de Inspecciones',
            chartTipo: 'bar',
            datos: 'psv_trend',
          },
        ],
      },
      datos: {
        psv_data: [
          { tag: 'PSV-0412A', servicio: 'Gas Ácido', fabricante: 'Crosby', ultima: '2026-08-15', proxima: '2027-02-15', estado: 'ok' },
          { tag: 'PSV-0520B', servicio: 'Condensado', fabricante: 'Farris', ultima: '2026-06-01', proxima: '2026-12-01', estado: 'warn' },
          {
            tag: 'PSV-0310C',
            servicio: 'GLP',
            fabricante: 'Anderson Greenwood',
            ultima: '2025-11-20',
            proxima: '2026-05-20',
            estado: 'err',
          },
        ],
      },
      colores: { primary: '#e65100', accent: '#ffb020', bg: '#0c1220' },
    },
    {
      id: 'simpl_piping_integrity',
      titulo: 'Integridad de Tuberías API 570',
      categoria: 'Oil & Gas',
      prioridad: 'alta',
      descripcion: 'Monitoreo de corrosión y vida remanente de circuitos de tubería con cálculos API 570.',
      estructura: {
        layout: 'dashboard',
        secciones: [
          {
            tipo: 'bento-stats',
            titulo: 'Estado de Circuitos',
            tarjetas: [
              { titulo: 'Circuitos', valor: '250', status: 'info', icono: 'layers' },
              { titulo: 'CMLs Activos', valor: '1200', status: 'info', icono: 'target' },
              { titulo: 'Vida Remanente >5a', valor: '180', status: 'ok', icono: 'shield-check' },
              { titulo: 'Vida <1 año', valor: '23', status: 'err', icono: 'alert-triangle' },
              { titulo: 'Tasa Promedio', valor: '3.2 mpy', status: 'warn', icono: 'activity' },
              { titulo: 'Próx. Inspección', valor: '15 días', status: 'warn', icono: 'calendar' },
            ],
          },
          {
            tipo: 'bento-table',
            titulo: 'Circuitos Críticos',
            columnas: ['Circuito', 'Material', 't_min (mm)', 't_act (mm)', 'Vida Rem. (años)', 'Riesgo'],
            datos: 'circuitos_data',
          },
        ],
      },
      datos: {
        circuitos_data: [
          { circuito: '04-HC-201-12"', material: 'A106 Gr. B', tmin: '6.35', tact: '5.12', vida: '0.8', riesgo: 'Alto' },
          { circuito: '04-HC-302-8"', material: 'A312 TP304L', tmin: '4.20', tact: '6.80', vida: '15.2', riesgo: 'Bajo' },
        ],
      },
      colores: { primary: '#e65100', accent: '#ffb020', bg: '#0c1220' },
    },
    {
      id: 'simpl_flota_mant',
      titulo: 'Control de Flota y Mantenimiento',
      categoria: 'Automatización',
      prioridad: 'alta',
      descripcion: 'Gestión de flota vehicular con alertas de mantenimiento preventivo basado en kilometraje y horómetro.',
      estructura: {
        layout: 'dashboard',
        secciones: [
          {
            tipo: 'bento-stats',
            titulo: 'Resumen de Flota',
            tarjetas: [
              { titulo: 'Total Activos', valor: '120', status: 'info', icono: 'truck' },
              { titulo: 'Operativos', valor: '108', status: 'ok', icono: 'check-circle' },
              { titulo: 'En Taller', valor: '8', status: 'warn', icono: 'tool' },
              { titulo: 'Fuera de Servicio', valor: '4', status: 'err', icono: 'x-circle' },
              { titulo: 'Alertas Activas', valor: '15', status: 'warn', icono: 'bell' },
              { titulo: 'Próx. Servicio', valor: '22', status: 'info', icono: 'calendar' },
            ],
          },
          {
            tipo: 'bento-table',
            titulo: 'Vehículos con Alerta',
            columnas: ['Patente', 'Tipo', 'Km Actual', 'Km Próx. Serv.', 'Diferencia', 'Estado'],
            datos: 'flota_data',
          },
        ],
      },
      datos: {
        flota_data: [
          { patente: 'ABCD-12', tipo: 'Camioneta 4x4', kmActual: '48500', kmProx: '50000', diff: '1500', estado: 'warn' },
          { patente: 'EFGH-34', tipo: 'Camión Tolva', kmActual: '98700', kmProx: '100000', diff: '1300', estado: 'warn' },
          { patente: 'IJKL-56', tipo: 'Bus Personal', kmActual: '45200', kmProx: '50000', diff: '4800', estado: 'info' },
        ],
      },
      colores: { primary: '#ff6f00', accent: '#ffb020', bg: '#0c1220' },
    },
    {
      id: 'simpl_extintores',
      titulo: 'Gestión de Extintores NFPA 10',
      categoria: 'Automatización',
      prioridad: 'critica',
      descripcion: 'Control de extintores con lector QR, alertas de vencimiento y checklist NFPA 10.',
      estructura: {
        layout: 'dashboard',
        secciones: [
          {
            tipo: 'bento-stats',
            titulo: 'Estado de Extintores',
            tarjetas: [
              { titulo: 'Total Instalados', valor: '300', status: 'info', icono: 'shield' },
              { titulo: 'Vigentes', valor: '265', status: 'ok', icono: 'check-circle' },
              { titulo: 'Por Vencer (7d)', valor: '18', status: 'warn', icono: 'clock' },
              { titulo: 'Vencidos', valor: '12', status: 'err', icono: 'alert-triangle' },
              { titulo: 'Próx. Prueba Hidro.', valor: '45', status: 'info', icono: 'droplet' },
              { titulo: 'No Conformes', valor: '5', status: 'err', icono: 'x-circle' },
            ],
          },
          {
            tipo: 'bento-table',
            titulo: 'Extintores con Alerta',
            columnas: ['Tag', 'Ubicación', 'Tipo', 'Última Inspección', 'Vencimiento', 'Estado'],
            datos: 'extintores_data',
          },
        ],
      },
      datos: {
        extintores_data: [
          {
            tag: 'EXT-001',
            ubicacion: 'Nave A - Col 3',
            tipo: 'PQS 10kg',
            ultima: '2026-08-01',
            vencimiento: '2026-09-01',
            estado: 'warn',
          },
          {
            tag: 'EXT-045',
            ubicacion: 'Oficinas - Piso 2',
            tipo: 'CO2 5kg',
            ultima: '2026-02-15',
            vencimiento: '2026-08-15',
            estado: 'err',
          },
          { tag: 'EXT-120', ubicacion: 'Bodega Químicos', tipo: 'PQS 20kg', ultima: '2026-08-20', vencimiento: '2027-02-20', estado: 'ok' },
        ],
      },
      colores: { primary: '#ff6f00', accent: '#ffb020', bg: '#0c1220' },
    },
    {
      id: 'simpl_respel',
      titulo: 'Gestión de Residuos Peligrosos',
      categoria: 'Automatización',
      prioridad: 'critica',
      descripcion: 'Control de RESPEL con matriz de incompatibilidad química, alertas de almacenamiento y trazabilidad.',
      estructura: {
        layout: 'dashboard',
        secciones: [
          {
            tipo: 'bento-stats',
            titulo: 'Inventario RESPEL',
            tarjetas: [
              { titulo: 'Lotes Activos', valor: '85', status: 'info', icono: 'package' },
              { titulo: 'Peso Total (ton)', valor: '12.4', status: 'info', icono: 'scale' },
              { titulo: 'Próx. a Vencer', valor: '14', status: 'warn', icono: 'clock' },
              { titulo: 'Vencidos', valor: '3', status: 'err', icono: 'alert-triangle' },
              { titulo: 'Días Promedio', valor: '45', status: 'ok', icono: 'calendar' },
              { titulo: 'Bahías Ocupadas', valor: '7/12', status: 'info', icono: 'grid' },
            ],
          },
          {
            tipo: 'bento-table',
            titulo: 'Lotes por Vencer',
            columnas: ['Lote', 'Residuo', 'NFPA 704', 'Ingreso', 'Límite 180d', 'Días Rest.', 'Estado'],
            datos: 'respel_data',
          },
        ],
      },
      datos: {
        respel_data: [
          {
            lote: 'RES-2026-042',
            residuo: 'Aceite Usado',
            nfpa: '2-1-0',
            ingreso: '2026-03-15',
            limite: '2026-09-11',
            dias: '7',
            estado: 'err',
          },
          {
            lote: 'RES-2026-058',
            residuo: 'Solventes Clorados',
            nfpa: '3-3-0',
            ingreso: '2026-04-20',
            limite: '2026-10-17',
            dias: '43',
            estado: 'warn',
          },
          {
            lote: 'RES-2026-071',
            residuo: 'Baterías Pb-Ácido',
            nfpa: '3-0-1-COR',
            ingreso: '2026-06-01',
            limite: '2026-11-28',
            dias: '85',
            estado: 'ok',
          },
        ],
      },
      colores: { primary: '#ff6f00', accent: '#ffb020', bg: '#0c1220' },
    },
    {
      id: 'simpl_compras',
      titulo: 'Control de Compras y Abastecimiento',
      categoria: 'Automatización',
      prioridad: 'alta',
      descripcion: 'Seguimiento de órdenes de compra con alertas de lead time, control de stock crítico y métricas de proveedores.',
      estructura: {
        layout: 'dashboard',
        secciones: [
          {
            tipo: 'bento-stats',
            titulo: 'Métricas de Abastecimiento',
            tarjetas: [
              { titulo: 'OC Pendientes', valor: '47', status: 'info', icono: 'file-text' },
              { titulo: 'Entregadas a Tiempo', valor: '82%', status: 'ok', icono: 'trending-up' },
              { titulo: 'Con Retraso', valor: '12', status: 'err', icono: 'alert-triangle' },
              { titulo: 'Stock Crítico', valor: '8', status: 'err', icono: 'alert-circle' },
              { titulo: 'Lead Time Prom.', valor: '18 días', status: 'warn', icono: 'clock' },
              { titulo: 'Monto Total', valor: '$245K', status: 'info', icono: 'dollar-sign' },
            ],
          },
          {
            tipo: 'bento-table',
            titulo: 'Órdenes en Riesgo',
            columnas: ['OC #', 'Material', 'Proveedor', 'Fecha Prometida', 'Días Retraso', 'Criticidad', 'Estado'],
            datos: 'compras_data',
          },
        ],
      },
      datos: {
        compras_data: [
          {
            oc: 'OC-2026-0142',
            material: 'Sello Mecánico 6"',
            proveedor: 'FlowServe',
            prometida: '2026-08-15',
            retraso: '20',
            crit: 'Crítico',
            estado: 'err',
          },
          {
            oc: 'OC-2026-0158',
            material: 'Válvula Globo 4"',
            proveedor: 'Emerson',
            prometida: '2026-08-28',
            retraso: '7',
            crit: 'Operacional',
            estado: 'warn',
          },
          {
            oc: 'OC-2026-0165',
            material: 'Motor 50HP',
            proveedor: 'WEG',
            prometida: '2026-09-10',
            retraso: '0',
            crit: 'General',
            estado: 'ok',
          },
        ],
      },
      colores: { primary: '#ff6f00', accent: '#ffb020', bg: '#0c1220' },
    },
    {
      id: 'simpl_energia',
      titulo: 'Monitoreo de Consumo Energético',
      categoria: 'Energía',
      prioridad: 'alta',
      descripcion: 'Dashboard de consumo eléctrico con gráficos de tendencia, comparativa por área y alertas de sobreconsumo.',
      estructura: {
        layout: 'dashboard',
        secciones: [
          {
            tipo: 'bento-stats',
            titulo: 'Consumo en Tiempo Real',
            tarjetas: [
              { titulo: 'Potencia Actual', valor: '2.4 MW', status: 'ok', icono: 'zap' },
              { titulo: 'Consumo Diario', valor: '48.2 MWh', status: 'info', icono: 'bar-chart' },
              { titulo: 'Factor de Potencia', valor: '0.94', status: 'ok', icono: 'activity' },
              { titulo: 'Sobreconsumo', valor: '+3.2%', status: 'warn', icono: 'trending-up' },
              { titulo: 'Costo Estimado', valor: '$5,780', status: 'info', icono: 'dollar-sign' },
              { titulo: 'CO2 Evitado', valor: '12.4 ton', status: 'ok', icono: 'leaf' },
            ],
          },
          {
            tipo: 'bento-chart',
            titulo: 'Consumo por Área (kWh)',
            chartTipo: 'bar',
            datos: 'energia_areas',
          },
          {
            tipo: 'bento-table',
            titulo: 'Alertas de Consumo',
            columnas: ['Área', 'Límite (kW)', 'Actual (kW)', 'Desviación', 'Horario', 'Estado'],
            datos: 'energia_alertas',
          },
        ],
      },
      datos: {
        energia_areas: [
          { area: 'Compresores', consumo: 850 },
          { area: 'Bombas', consumo: 620 },
          { area: 'Iluminación', consumo: 280 },
          { area: 'HVAC', consumo: 410 },
          { area: 'Oficinas', consumo: 180 },
        ],
        energia_alertas: [
          { area: 'Compresores', limite: 800, actual: 850, desviacion: '+6.2%', horario: '14:00-16:00', estado: 'warn' },
          { area: 'Bombas', limite: 650, actual: 620, desviacion: '-4.6%', horario: '08:00-18:00', estado: 'ok' },
        ],
      },
      colores: { primary: '#00c853', accent: '#35d69a', bg: '#0c1220' },
    },
    {
      id: 'simpl_capacitacion',
      titulo: 'Gestión de Capacitación Industrial',
      categoria: 'Capacitación',
      prioridad: 'media',
      descripcion: 'Control de capacitaciones del personal con matriz de competencias, vencimientos y dashboard de cumplimiento.',
      estructura: {
        layout: 'dashboard',
        secciones: [
          {
            tipo: 'bento-stats',
            titulo: 'Cumplimiento de Capacitación',
            tarjetas: [
              { titulo: 'Personal Activo', valor: '450', status: 'info', icono: 'users' },
              { titulo: 'Capacitados', valor: '412', status: 'ok', icono: 'award' },
              { titulo: 'Por Vencer (30d)', valor: '28', status: 'warn', icono: 'clock' },
              { titulo: 'Vencidos', valor: '10', status: 'err', icono: 'alert-triangle' },
              { titulo: 'Cumplimiento', valor: '91.5%', status: 'ok', icono: 'trending-up' },
              { titulo: 'Cursos Programados', valor: '15', status: 'info', icono: 'book-open' },
            ],
          },
          {
            tipo: 'bento-table',
            titulo: 'Personal con Capacitación Vencida',
            columnas: ['RUT', 'Nombre', 'Curso', 'Fecha Vencimiento', 'Días Vencido', 'Área', 'Estado'],
            datos: 'capacitacion_data',
          },
        ],
      },
      datos: {
        capacitacion_data: [
          {
            rut: '12.345.678-9',
            nombre: 'Juan Pérez',
            curso: 'Trabajo en Altura',
            vencimiento: '2026-07-15',
            dias: '51',
            area: 'Mantenimiento',
            estado: 'err',
          },
          {
            rut: '23.456.789-0',
            nombre: 'María López',
            curso: 'Espacios Confinados',
            vencimiento: '2026-08-20',
            dias: '15',
            area: 'Operaciones',
            estado: 'err',
          },
          {
            rut: '34.567.890-1',
            nombre: 'Carlos Ruiz',
            curso: 'Manejo Defensivo',
            vencimiento: '2026-09-25',
            dias: '0',
            area: 'Logística',
            estado: 'warn',
          },
        ],
      },
      colores: { primary: '#1565c0', accent: '#4cc3ff', bg: '#0c1220' },
    },
  ],

  componentes: {
    'bento-stats': {
      descripcion: 'Grid de tarjetas de métricas (2-3 columnas) con icono, valor numérico y status pill.',
      clases: 'bento-grid',
      itemClases: 'bento-item',
      spanClases: 'bento-item-span2',
    },
    'bento-table': {
      descripcion: 'Tabla de datos con encabezado sticky, filas alternadas y pills de estado.',
      clases: 'bento-table',
      filaClases: 'bento-table-row',
      statusPills: { ok: 'bento-status-ok', warn: 'bento-status-warn', err: 'bento-status-err', info: 'bento-status-info' },
    },
    'bento-chart': {
      descripcion: 'Contenedor de gráfico con título y controles de rango de tiempo.',
      clases: 'bento-chart-container',
      tipos: ['bar', 'line', 'pie'],
    },
  },

  tema: {
    oscuro: {
      '--bg': '#0c1220',
      '--bg2': '#111a2b',
      '--bg3': '#182338',
      '--line': '#22314b',
      '--txt': '#e9f0fa',
      '--txt2': '#a9bad2',
    },
    claro: {
      '--bg': '#f8fafc',
      '--bg2': '#f1f5f9',
      '--bg3': '#e2e8f0',
      '--line': '#cbd5e1',
      '--txt': '#0f172a',
      '--txt2': '#475569',
    },
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROMPTS_SIMPLIFIED };
}
