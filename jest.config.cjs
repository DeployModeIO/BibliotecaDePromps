module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/tests/**/*.test.js'],
  // vendor excluido: son librerías de terceros minificadas, no código nuestro
  collectCoverageFrom: ['js/**/*.js', '!js/prompts-data*.js', '!js/vendor/**'],
  coverageThreshold: {
    // Thresholds reales (v3.6): el código nuevo no puede bajar la cobertura
    global: {
      branches: 6,
      functions: 6,
      lines: 7,
      statements: 7
    },
    // crypto.js es el módulo de seguridad: cobertura alta obligatoria
    './js/crypto.js': {
      branches: 75,
      functions: 100,
      lines: 90,
      statements: 85
    }
  },
  transform: {}
};