module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['/*', '!/src'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: ['@typescript-eslint', 'unused-imports', 'simple-import-sort', 'prettier', 'unicorn'],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  env: {
    browser: true,
    node: true,
  },
  'settings': {
    'import/resolver': {
      'typescript': {
        'alwaysTryTypes': true,
        'project': './tsconfig.json',
      }
    }
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'error',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'unused-imports/no-unused-imports': 'warn',
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            overrides: {
              accessors: 'explicit',
              constructors: 'no-public',
              properties: 'explicit',
              parameterProperties: 'explicit',
            },
          },
        ],
      },
      noInlineConfig: true,
    },
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'lf',
          },
        ],
        '@typescript-eslint/consistent-type-imports': 'error',
      },
    },
  ],
};
