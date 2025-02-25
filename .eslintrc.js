module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    // 'airbnb' (if you chose Airbnb style guide)
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'import',
  ],
  rules: {
    'react/prop-types': 'off', // Optional: disable prop-types rule if you don’t use it
    'no-unused-vars': 'warn',  // Customize rules as needed
    'semi': ['error', 'always'], // Enforce semicolons at the end of statements
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'], // Group module imports together (no newline within)
          ['internal', 'parent', 'sibling', 'index'], // Group file imports together (no newline within)
        ],
        'newlines-between': 'never', // Enforce a newline between the two main groups
        pathGroups: [
          {
            pattern: 'react',       // Match React specifically
            group: 'external',      // Place it in the external group
            position: 'before',     // Before other externals
          },
          {
            pattern: 'react-*',     // Match React-related modules (e.g., react-dom)
            group: 'external',
            position: 'before',     // Before other externals, after React
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'], // Ensure pathGroups only apply to non-builtins
        alphabetize: { order: 'asc', caseInsensitive: true }, // Alphabetize within groups
      },
    ],
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect React version
    },
  },
};