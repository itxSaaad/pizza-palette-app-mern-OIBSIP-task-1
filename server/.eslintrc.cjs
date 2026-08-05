module.exports = {
  root: true,
  env: { node: true, es2021: true },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' },
  ignorePatterns: ['node_modules', 'coverage'],
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
