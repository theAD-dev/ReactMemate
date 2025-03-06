module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['react', 'react-hooks', 'import'],
  rules: {
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'semi': ['warn', 'always'],
    'import/order': [
      'warn',
      {
        groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index']],
        'newlines-between': 'never',
        pathGroups: [
          { pattern: 'react', group: 'external', position: 'before' },
          { pattern: 'react-*', group: 'external', position: 'before' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 'off',
    'react/display-name': 'off',
    'no-useless-escape': 'off',
    'react/jsx-key': 'warn',
    'valid-typeof': 'off',
    'no-empty': 'warn',
    'react/no-unknown-property': 'warn',
    'no-unsafe-optional-chaining': 'warn',
    'no-constant-condition': 'warn',
  },
  settings: {
    react: { version: 'detect' },
  },
};