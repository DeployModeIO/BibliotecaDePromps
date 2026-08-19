# 🏭 Biblioteca de Promps Industriales v3.0

## 🚀 Descripción

Aplicación web profesional (PWA) con **mega-prompts de ingeniería** especializados para generar **aplicaciones completas y funcionales** al pegarlos en cualquier IA (ChatGPT, Claude, Gemini, etc.). Diseñada para funcionar en **Android, iOS, Web y Tablets** con soporte completo offline.

## 🎯 ¿Qué son los Mega-Prompts?

Los mega-prompts son **prompts de ingeniería estructurados** que contienen:

- **ROL**: Definición del experto que la IA debe asumir
- **CONTEXTO TÉCNICO**: Información detallada de la industria, normas y estándares
- **TAREA**: Especificación completa de lo que se debe desarrollar
- **MÓDULOS**: Desglose detallado de funcionalidades requeridas
- **FORMATO DE SALIDA**: Especificación exacta del entregable
- **RESTRICCIONES**: Limitaciones y requisitos técnicos
- **CRITERIOS DE CALIDAD**: Estándares a cumplir
- **ENTREGABLE FINAL**: Descripción del producto completo

**Resultado**: Al pegar estos prompts en una IA, se generan **aplicaciones web completas, funcionales y listas para usar**, no simples textos o ideas genéricas.

## 🎯 Industrias Cubiertas

- **🛢️ Oil & Gas** - Exploración, producción, refinación y transporte
- **⛏️ Minería** - Extracción, procesamiento y transporte de minerales
- **🌊 Desalinizadoras** - Plantas de tratamiento de agua por ósmosis inversa
- **🏭 Plantas de Procesamiento** - Química, petroquímica, alimentaria
- **⚡ Plantas de Energía** - Generación térmica, renovable, subestaciones
- **🏗️ Construcción Industrial** - Proyectos de montaje y obra
- **🚢 Marítimo y Offshore** - Plataformas, puertos, operaciones marítimas
- **💊 Farmacéutica y Alimentos** - GMP/BPM, salas limpias

## 📋 Categorías de Prompts

### 🔧 Inspección de Equipos

- Checklists pre-operacionales
- Protocolos de mantenimiento
- Inspecciones de integridad
- Control de calidad

### 📝 Bitácoras Operacionales

- Registros de producción
- Bitácoras de turno
- Parámetros operacionales
- Seguimiento de mantenimiento

### ⛑️ Seguridad y HSE

- Permisos de trabajo
- Análisis de riesgo (JSA)
- Reportes de incidentes
- Procedimientos de emergencia

### ✉️ Correos Profesionales

- Reportes a gerencia
- Solicitudes de autorización
- Comunicaciones regulatorias
- Coordinación con proveedores

### 🔄 Gestión de Turnos

- Handover operacional
- Programación de turnos
- Pase de guardia

## 🚀 Características

✅ **100% Offline** - Funciona sin conexión a internet (PWA)  
✅ **Multiplataforma** - Android, iOS, Web, Tablets  
✅ **Exportación Multi-formato** - PDF, Excel, Email  
✅ **Búsqueda Inteligente** - Por título, tags o palabras clave  
✅ **Favoritos** - Guarda tus prompts más usados  
✅ **Historial** - Registro de prompts utilizados  
✅ **Modo Oscuro/Claro** - Adaptable a preferencias  
✅ **Responsive** - Diseño adaptativo para cualquier dispositivo  
✅ **Instalable** - Se instala como app nativa

## 📦 Instalación

### Opción 1: Servidor Web Local (Recomendado)

1. **Usando Python:**

   ```bash
   cd D:\Proyectos\BibliotecaDePromps
   python -m http.server 8000
   ```

   Abre: `http://localhost:8000`

2. **Usando Node.js:**

   ```bash
   npx serve D:\Proyectos\BibliotecaDePromps
   ```

3. **Usando PHP:**
   ```bash
   php -S localhost:8000 -t D:\Proyectos\BibliotecaDePromps
   ```

### Opción 2: Abrir Directamente

Simplemente abre `index.html` en tu navegador. Algunas funcionalidades PWA requieren servidor web.

### Opción 3: Despliegue en la Nube

Sube los archivos a cualquier servicio de hosting estático:

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Firebase Hosting**

## 📱 Instalación como App

### En Android (Chrome):

1. Abre la app en Chrome
2. Toca el menú (⋮) → "Agregar a pantalla principal"
3. Confirma la instalación

### En iOS (Safari):

1. Abre la app en Safari
2. Toca el botón Compartir (cuadrado con flecha)
3. Selecciona "Agregar a pantalla de inicio"

### En Desktop (Chrome/Edge):

1. Abre la app en el navegador
2. Busca el icono de instalación en la barra de direcciones
3. Confirma la instalación

## 🎨 Generación de Iconos

Para generar los iconos PNG de la PWA:

1. Abre `generar-iconos.html` en tu navegador
2. Haz clic en "Generar Todos"
3. Los iconos se descargarán automáticamente
4. Muévelos a la carpeta `icons/`

## 📖 Uso

### Buscar Prompts

- Usa la barra de búsqueda para encontrar por título, tag o palabra clave
- Los filtros rápidos permiten filtrar por prioridad o categoría

### Explorar por Industria

1. Haz clic en cualquier tarjeta de industria
2. Navega por las subcategorías
3. Selecciona un prompt para ver el detalle

### Acciones Disponibles

- **📋 Copiar** - Copia el prompt al portapapeles
- **⭐ Favoritos** - Guarda el prompt para acceso rápido
- **✉️ Email** - Envía el prompt por correo electrónico
- **📄 PDF** - Exporta como documento PDF
- **📊 Excel** - Exporta como archivo CSV (compatible con Excel)

## 🛠️ Estructura del Proyecto

```
BibliotecaDePromps/
├── index.html              # Página principal
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker (offline)
├── generar-iconos.html     # Generador de iconos
├── css/
│   └── styles.css         # Estilos responsive
├── js/
│   ├── app.js             # Lógica principal
│   └── prompts-data.js    # Base de datos de prompts
└── icons/
    ├── icon-192.png       # Icono 192x192 (generar)
    └── icon-512.png       # Icono 512x512 (generar)
```

## 📊 Estadísticas

- **10+ Mega-Prompts** de nivel profesional
- **8 Industrias** cubiertas
- **15+ Subcategorías** especializadas
- **100% Funcional** offline
- **0 Dependencias** externas
- **Aplicaciones completas** generadas por IA
- **Prompts de 2,000-5,000 palabras** cada uno

## 🔧 Personalización

### Agregar Nuevos Prompts

Edita `js/prompts-data.js` y sigue la estructura:

```javascript
{
  id: "unico_id",
  titulo: "Título del Prompt",
  categoria: "Categoría",
  prioridad: "alta|media|critica",
  prompt: "Texto completo del prompt...",
  tags: ["tag1", "tag2"],
  uso: "Frecuencia de uso"
}
```

### Cambiar Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
  --primary: #1a73e8;
  --secondary: #34a853;
  /* ... */
}
```

## 🌐 Compatibilidad

| Plataforma | Navegador             | Estado      |
| ---------- | --------------------- | ----------- |
| Android    | Chrome, Firefox, Edge | ✅ Completo |
| iOS        | Safari                | ✅ Completo |
| Windows    | Chrome, Edge, Firefox | ✅ Completo |
| macOS      | Safari, Chrome        | ✅ Completo |
| Tablets    | Todos                 | ✅ Completo |

## 📝 Notas Técnicas

- **Service Worker**: Cachea todos los recursos para funcionamiento offline
- **LocalStorage**: Almacena favoritos, historial y preferencias
- **PWA**: Instalable como app nativa en dispositivos móviles
- **Responsive**: Diseño mobile-first con breakpoints para tablets y desktop
- **Accesibilidad**: Navegación por teclado y lectores de pantalla

## 🚀 Próximas Funcionalidades

- [ ] Sincronización en la nube
- [ ] Compartir prompts con otros usuarios
- [ ] Generador de prompts personalizado con IA
- [ ] Plantillas editables
- [ ] Exportación a Word
- [ ] Modo colaborativo

## 📄 Licencia

Este proyecto es de uso libre para fines profesionales y educativos.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para agregar nuevos prompts:

1. Sigue la estructura de `prompts-data.js`
2. Mantén el tono profesional y técnico
3. Incluye tags relevantes
4. Prueba en múltiples dispositivos

## 📞 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Desarrollado con estándares industriales de alta calidad** ⚙️

_Versión 3.0.0 | Última actualización: Julio 2026_
_Mega-Prompts de Ingeniería para Generación de Aplicaciones Completas_
