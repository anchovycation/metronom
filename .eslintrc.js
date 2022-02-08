module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-underscore-dangle': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'no-return-await': 0,
    'no-param-reassign': 0,
    'implicit-arrow-linebreak': 0
  },
};
