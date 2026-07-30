module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['js/**/*.js', '!js/prompts-data*.js'],
  transform: {}
};