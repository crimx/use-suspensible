module.exports = {
  settings: {
    react: {
      version: '16.8'
    }
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:prettier/recommended',
    'plugin:react/recommended'
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.eslint.json',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false
      }
    ],
    yoda: 'off',
    'react/prop-types': 'off',
    'import/first': 'off',
    // https://github.com/benmosher/eslint-plugin-import/issues/1357
    'import/export': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-dupe-class-members': 'off'
  }
}
