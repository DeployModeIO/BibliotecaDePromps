module.exports = {
  root: true,
  env: { browser: true, es2021: true, jest: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'indent': ['error', 2, { SwitchCase: 1, ignoredNodes: ['TemplateLiteral *'] }],
    'max-len': ['warn', 140, { ignoreComments: true, ignoreStrings: true, ignoreTemplateLiterals: true }]
  }
};