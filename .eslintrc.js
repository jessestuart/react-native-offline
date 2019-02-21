module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
    'prettier/react',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'prettier', '@typescript-eslint', 'jest'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true, // This is necessary for React Native XMLHttpRequest, see https://github.com/eslint/eslint/issues/4015
    es6: true,
    jasmine: true,
    jest: true,
    mocha: true,
    node: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 80,
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    'import/extensions': 0,
    'no-use-before-define': 0,
    'import/no-extraneous-dependencies': 0,
    'global-require': 0,
    'prefer-promise-reject-errors': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'react/display-name': 0,
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  globals: {
    jest: true,
    jasmine: true,
  },
};
