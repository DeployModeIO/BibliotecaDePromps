const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'js', 'prompts-data-industries.js');
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/\}\s*\]\s*\}\s*;$/, '\n');

const catAgro = `    {
      "id": "agroindustria", "nombre": "Agroindustria",
      "icono": "\\u{1F33E}", "color": "#4caf50",
      "descripcion":"Agricultura precision ganaderia agronegocios cultivos",
      "subcategorias":[
        {"id":"agro_gestion","nombre":"Gestión Agricola","prompts":[
          {"id":"ag_001","titulo":"Sistema Gestion Produccion Agricola 5000 hectareas","categoria":"Aplicación Web","prioridad":"alta","uso":"Semanal","tags":["agricultura","campos","cultivos","siembra","rotacion"],"prompt":"ACTÚA COMO ingeniero agronomo 20 anos produccion granos oleaginosas.\nMÓDULOS: Mapa campos parcelas caracteristicas suelo planificacion anual registro actividades maquinas insumos rendimiento por hectarea rentabilidad.\nFORMATO: Código HTML+CSS+JS completo."},
          {"id":"ag_002","titulo":"App Agricultura Precision Sensores NDVI","categoria":"Aplicación Móvil","prioridad":"media","uso":"Diario","tags":["precision","NDVI","drones","riego variable rate"],"prompt":"ACTÚA COMO especialista agricultura precision 10 anos drones satelites VRT.\nMÓDULOS: Monitoreo sensores humedad indices vegetales NDVI recomendaciones IA aplicacion variable rate exportar tractor auto-guia.\nFORMATO: Código HTML+CSS+JS completo."}
        ]},
        {"id":"agro_ganado","nombre":"Gestion Ganadera","prompts":[
          {"id":"ag_003","titulo":"Sistema Gestion Ganadera Bovina Reproduccion Sanidad","categoria":"Aplicación Web","prioridad":"alta","uso":"Semanal","tags":["ganaderia","bovinos","reproduccion","sanidad animal"],"prompt":"ACTÚA COMO medico veterinario produccion animal bovina 18 anos.\nMÓDULOS: Registro animales identificacion control celos inseminacion partos sanidad vacunas pesaje produccion lactancia pastoreo carga animal.\nFORMATO: Código HTML+CSS+JS completo."}
        ]}
      ]
    },`;

const catScience = `    {
      "id": "ciencia", "nombre": "Ciencia y Laboratorios",
      "icono": "\\u{1F52C}", "color": "#673ab7",
      "descripcion":"Investigacion cientifica laboratorios publicaciones LIMS",
      "subcategorias":[
        {"id":"ci_lab","nombre":"Laboratorio Investigacion","prompts":[
          {"id":"cl_001","titulo":"LIMS Gestion Laboratorio Investigacion Cientifico","categoria":"Aplicación Web","prioridad":"alta","uso":"Diario","tags":["LIMS","laboratorio","muestras","experimentos"],"prompt":"ACTÚA COMO director laboratorio investigacion 20 anos GLP BPM.\nMÓDULOS: Proyectos muestras experimentos protocolos datos inventario reactivos seguridad SDS publicaciones.\nFORMATO: Código HTML+CSS+JS completo."},
          {"id":"cl_002","titulo":"Plataforma Colaborativa Investigacion Publicaciones","categoria":"Aplicación Web","prioridad":"media","uso":"Semanal","tags":["colaboracion","papers","preprints","ORCID"],"prompt":"ACTÚA COMO investigador senior 15 anos colaboraciones internacionales.\nMÓDULOS: Perfil CV h-index share papers comments project spaces discovery search trending.\nFORMATO: Código HTML+CSS+JS completo."}
        ]}
      ]
    },`;

const catConstruction = `    {
      "id": "construccion", "nombre": "Construcción y Arquitectura",
      "icono": "\\u{1F3D3}\\uFE0F", "color": "#ff9800",
      "descripcion":"Obras BIM planos presupuestos cronogramas calidad seguridad",
      "subcategorias":[
        {"id":"cons_obra","nombre":"Gestión de Obra","prompts":[
          {"id":"co_001","titulo":"Sistema Gestión Obras Construcción Cronograma Presupuesto","categoria":"Aplicación Web","prioridad":"critica","uso":"Diario","tags":["obras","cronograma","presupuesto","bitacora","EVM"],"prompt":"ACTÚA COMO gerente proyectos construcción 25 anos.\nMÓDULOS: Infobase proyecto cronograma Gantt avance fisico control presupuestario bitacora diaria calidad seguridad CAPA permisos trabajo peligroso.\nFORMATO: Código HTML+CSS+JS completo."},
          {"id":"co_002","titulo":"App Levantamiento Topográfico Mediciones Takeoff","categoria":"Aplicación Móvil","prioridad":"media","uso":"Diario","tags":["topografía","takeoff","mediciones","drone","cantidad materiales"],"prompt":"ACTÚA COMO topógrafo profesional 15 anos levantamientos mediciones obra.\nMÓDULOS: Mediciones campo GPS area perimetro BOQ quantity survey reportes certificados digitales.\nFORMATO: Código HTML+CSS+JS completo."},
          {"id":"co_003","titulo":"Visor Planos Arquitectónicos BIM Viewer","categoria":"Aplicación Web","prioridad":"alta","uso":"Semanal","tags":["planos","BIM","DWG","PDF viewer","annotaciones"],"prompt":"ACTÚA COMO architectural technologist 12 anos visualización architects.\nMÓDULOS: Upload planos layers toggle pan zoom measurement markup collaboration RFI specs database.\nFORMATO: Código HTML+CSS+JS completo."}
        ]}
      ]
    },`;

const catEnv = `    {
      "id": "medio_ambiente", "nombre": "Medio Ambiente y Sostenibilidad",
      "icono": "\\u{1F33F}", "color": "#4caf50",
      "descripcion":"Sostenibilidad huella carbono energías renovables residuos agua",
      "subcategorias":[
        {"id":"amb_carbono","nombre":"Huella Carbono Emisiones","prompts":[
          {"id":"ac_001","titulo":"Calculadora Huella Carbono Corporativa Scope 1 2 3","categoria":"Aplicación Web","prioridad":"alta","uso":"Mensual","tags":["huella carbono","CO2","scope 1 2 3","GHG protocol","net-zero"],"prompt":"ACTÚA COMO consultor sustentabilidad corporativa 15 anos GHG Protocol ISO 14064.\nMÓDULOS: Inventario emisiones scope directas indirecta cadena valor objetivos reduccion SBTi compensacion credits reporte CDP.\nFORMATO: Código HTML+CSS+JS completo."}
        ]},
        {"id":"amb_energias","nombre":"Energías Renovables","prompts":[
          {"id":"ae_001","titulo":"Dashboard Monitorio Planta Solar Fotovoltaica","categoria":"Aplicación Web","prioridad":"alta","uso":"Continuo","tags":["solar fotovoltaica","paneles","monitoreo","inversores","KWh"],"prompt":"ACTÚA COMO ingeniero energético 12 anos plantas solares fotovoltaicas.\nMÓDULOS: Monitoreo tiempo real potencia energia performance ratio panel-health metricos financieros CO2 evitado ROI payback.\nFORMATO: Código HTML+CSS+JS completo."}
        ]},
        {"id":"amb_residuos","nombre":"Gestión Residuos Solidos","prompts":[
          {"id":"ar_001","titulo":"Sistema Gestión Residuos Solidos Urbanos Recycling","categoria":"Aplicación Web","prioridad":"alta","uso":"Semanal","tags":["residuos solidos","reciclaje","waste management","economia circular"],"prompt":"ACTÚA COMO ingeniero ambiental residuos solidos urbanos 15 anos.\nMÓDULOS: Recoleccion inteligente rutas centros transferencia educacion citizen gamification reporting toneladas recicladas CO2 evitado.\nFORMATO: Código HTML+CSS+JS completo."}
        ]},
        {"id":"amb_agua","nombre":"Recursos Hidricos","prompts":[
          {"id":"aa_001","titulo":"Monitorio Gestion Recursos Hídricos Estaciones","categoria":"Aplicación Web","prioridad":"alta","uso":"Continuo","tags":["recursos hidricos","estaciones","calidad agua","caudales"],"prompt":"ACTÚA COMO hidrologo 20 anos monitorizando cuencas.\nMÓDULOS: Niveles caudal precipitacion calidad agua WQI prevision inundaciones balance hidrico drought monitoring.\nFORMATO: Código HTML+CSS+JS completo."}
        ]}
      ]
    }
  ]
};`;

const finalContent = content + catAgro + catScience + catConstruction + catEnv;
fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('Added categories: Agroindustria, Ciencia, Construccion, Medio Ambiente');
const jsonStr = fs.readFileSync(filePath, 'utf8');
const promptCount = (jsonStr.match(/"titulo":/g) || []).length;
console.log('Total prompts:', promptCount);
console.log('File size:', fs.statSync(filePath).size, 'bytes');
