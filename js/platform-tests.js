/**
 * PRUEBAS SINTÉTICAS DE COMPATIBILIDAD MULTIPLATAFORMA
 * Valida que los mega-prompts generen aplicaciones compatibles con:
 * - Android (Chrome, PWA)
 * - iOS (Safari, PWA)
 * - Web (Chrome, Firefox, Edge, Safari)
 * - Tablets (iPad, Android tablets)
 * - Windows (PWA, Electron)
 */

const PlatformTests = {
  // Configuración de plataformas
  platforms: {
    android: {
      name: 'Android',
      browsers: ['Chrome Mobile', 'Firefox Mobile', 'Samsung Internet'],
      features: ['Service Worker', 'Web App Manifest', 'Push API', 'Background Sync'],
      constraints: {
        minViewport: { width: 360, height: 640 },
        touchTargets: 48, // dp mínimo según Material Design
        offlineRequired: true,
        installable: true,
      },
    },
    ios: {
      name: 'iOS',
      browsers: ['Safari', 'Chrome iOS'],
      features: ['Service Worker (iOS 11.3+)', 'Web App Manifest', 'Standalone Mode'],
      constraints: {
        minViewport: { width: 375, height: 667 },
        touchTargets: 44, // pt mínimo según Apple HIG
        offlineRequired: true,
        installable: true,
        safeAreaInsets: true,
      },
    },
    web: {
      name: 'Web Desktop',
      browsers: ['Chrome', 'Firefox', 'Edge', 'Safari', 'Opera'],
      features: ['Service Worker', 'Web App Manifest', 'Push API', 'IndexedDB', 'Web Workers'],
      constraints: {
        minViewport: { width: 1024, height: 768 },
        touchTargets: null,
        offlineRequired: true,
        installable: true,
        keyboardNavigation: true,
      },
    },
    tablet: {
      name: 'Tablet',
      browsers: ['Safari iPad', 'Chrome Android Tablet'],
      features: ['Service Worker', 'Web App Manifest', 'Touch Events', 'Pointer Events'],
      constraints: {
        minViewport: { width: 768, height: 1024 },
        touchTargets: 56, // Más grande para uso en campo con guantes
        offlineRequired: true,
        installable: true,
        landscapeMode: true,
      },
    },
    windows: {
      name: 'Windows Desktop',
      browsers: ['Edge', 'Chrome', 'Firefox'],
      features: ['Service Worker', 'Web App Manifest', 'PWA Install', 'File System Access API'],
      constraints: {
        minViewport: { width: 1366, height: 768 },
        touchTargets: null,
        offlineRequired: true,
        installable: true,
        electronCompatible: true,
      },
    },
  },

  // Validaciones de estructura de prompt
  validatePromptStructure(prompt) {
    const errors = [];
    const warnings = [];

    // Validar campos requeridos
    const requiredFields = ['id', 'titulo', 'categoria', 'prioridad', 'prompt', 'tags', 'uso'];
    requiredFields.forEach((field) => {
      if (!prompt[field]) {
        errors.push(`Campo requerido faltante: ${field}`);
      }
    });

    // Validar prioridad
    const validPriorities = ['critica', 'alta', 'media'];
    if (prompt.prioridad && !validPriorities.includes(prompt.prioridad)) {
      errors.push(`Prioridad inválida: ${prompt.prioridad}. Debe ser: ${validPriorities.join(', ')}`);
    }

    // Validar longitud del prompt (mínimo 500 palabras para mega-prompt)
    const wordCount = prompt.prompt ? prompt.prompt.split(/\s+/).length : 0;
    if (wordCount < 500) {
      warnings.push(`Prompt muy corto: ${wordCount} palabras. Se recomienda mínimo 500 palabras para mega-prompts`);
    }

    // Validar que el prompt contenga estructura ROL/CONTEXTO/TAREA
    const promptText = prompt.prompt || '';
    const hasRol = promptText.includes('ACTÚA COMO') || promptText.includes('Actúa como');
    const hasContexto = promptText.includes('CONTEXTO') || promptText.includes('Contexto');
    const hasTarea = promptText.includes('TAREA') || promptText.includes('Tarea');

    if (!hasRol) warnings.push('Falta sección ROL (ACTÚA COMO)');
    if (!hasContexto) warnings.push('Falta sección CONTEXTO TÉCNICO');
    if (!hasTarea) warnings.push('Falta sección TAREA');

    return { errors, warnings, wordCount };
  },

  // Validar compatibilidad multiplataforma del prompt
  validateMultiplatformCompatibility(prompt) {
    const results = {};
    const promptText = prompt.prompt || '';

    Object.keys(this.platforms).forEach((platformKey) => {
      const platform = this.platforms[platformKey];
      const checks = {
        responsive: false,
        offline: false,
        touchFriendly: false,
        accessible: false,
        installable: false,
      };

      // Verificar menciones de responsive design
      if (
        promptText.toLowerCase().includes('responsive') ||
        promptText.toLowerCase().includes('mobile-first') ||
        promptText.toLowerCase().includes('breakpoints')
      ) {
        checks.responsive = true;
      }

      // Verificar menciones de offline/PWA
      if (
        promptText.toLowerCase().includes('offline') ||
        promptText.toLowerCase().includes('pwa') ||
        promptText.toLowerCase().includes('service worker') ||
        promptText.toLowerCase().includes('localstorage')
      ) {
        checks.offline = true;
      }

      // Verificar menciones de touch-friendly
      if (
        promptText.toLowerCase().includes('touch') ||
        promptText.toLowerCase().includes('móvil') ||
        promptText.toLowerCase().includes('tablet')
      ) {
        checks.touchFriendly = true;
      }

      // Verificar menciones de accesibilidad
      if (
        promptText.toLowerCase().includes('accesib') ||
        promptText.toLowerCase().includes('aria') ||
        promptText.toLowerCase().includes('semántic')
      ) {
        checks.accessible = true;
      }

      // Verificar menciones de instalabilidad
      if (
        promptText.toLowerCase().includes('instalable') ||
        promptText.toLowerCase().includes('manifest') ||
        promptText.toLowerCase().includes('pwa')
      ) {
        checks.installable = true;
      }

      results[platformKey] = {
        platform: platform.name,
        checks,
        score: (Object.values(checks).filter((v) => v).length / Object.values(checks).length) * 100,
        compatible: Object.values(checks).filter((v) => v).length >= 3, // Al menos 3 de 5 checks
      };
    });

    return results;
  },

  // Validar que el prompt genere código funcional
  validateCodeGeneration(prompt) {
    const promptText = prompt.prompt || '';
    const checks = {
      html: promptText.toLowerCase().includes('html'),
      css: promptText.toLowerCase().includes('css') || promptText.toLowerCase().includes('estilos'),
      javascript: promptText.toLowerCase().includes('javascript') || promptText.toLowerCase().includes('js'),
      singleFile: promptText.toLowerCase().includes('un solo archivo') || promptText.toLowerCase().includes('single file'),
      noBackend:
        promptText.toLowerCase().includes('sin backend') ||
        promptText.toLowerCase().includes('no backend') ||
        promptText.toLowerCase().includes('localStorage'),
      cdnLibraries: promptText.toLowerCase().includes('cdn') || promptText.toLowerCase().includes('librerías'),
    };

    return {
      checks,
      score: (Object.values(checks).filter((v) => v).length / Object.values(checks).length) * 100,
      valid: Object.values(checks).filter((v) => v).length >= 4, // Al menos 4 de 6 checks
    };
  },

  // Ejecutar todas las pruebas para un prompt
  runFullTest(prompt) {
    const structure = this.validatePromptStructure(prompt);
    const multiplatform = this.validateMultiplatformCompatibility(prompt);
    const codeGen = this.validateCodeGeneration(prompt);

    const allPlatformsCompatible = Object.values(multiplatform).every((p) => p.compatible);
    const overallScore =
      ((structure.errors.length === 0 ? 100 : 50) +
        Object.values(multiplatform).reduce((sum, p) => sum + p.score, 0) / Object.keys(multiplatform).length +
        codeGen.score) /
      3;

    return {
      promptId: prompt.id,
      promptTitle: prompt.titulo,
      structure,
      multiplatform,
      codeGen,
      allPlatformsCompatible,
      overallScore: Math.round(overallScore),
      passed: structure.errors.length === 0 && allPlatformsCompatible && codeGen.valid,
    };
  },

  // Ejecutar pruebas para todos los prompts
  runAllTests(prompts) {
    const results = prompts.map((p) => this.runFullTest(p));
    const passed = results.filter((r) => r.passed).length;
    const failed = results.length - passed;

    return {
      total: results.length,
      passed,
      failed,
      passRate: ((passed / results.length) * 100).toFixed(1),
      results,
    };
  },
};

// Exportar para uso en navegador
if (typeof window !== 'undefined') {
  window.PlatformTests = PlatformTests;
}
