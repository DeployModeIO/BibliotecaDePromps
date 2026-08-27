module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['js/**/*.js', '!js/prompts-data*.js'],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 0,
      lines: 2,
      statements: 1
    }
  },
  transform: {}
};