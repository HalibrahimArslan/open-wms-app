import globals from 'globals'
import prettier from 'eslint-config-prettier/flat'

// ESLint 9+ flat config. Kural kumesi .eslintrc.cjs ile aynidir: Prettier ile
// catisan kurallar kapatilir, ayrica services altinda "fetch" ile baslayan
// fonksiyon isimleri yasaklanir.
const fetchNameMessage = "Services klasoru altinda 'fetch' ile baslayan fonksiyon isimleri kullanilamaz."

export default [
  {
    ignores: ['build/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  prettier,
  {
    files: ['src/services/**/*.{js,jsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration[id.name=/^fetch.*/]',
          message: fetchNameMessage,
        },
        {
          selector: "VariableDeclarator[id.name=/^fetch.*/][init.type='ArrowFunctionExpression']",
          message: fetchNameMessage,
        },
        {
          selector: "VariableDeclarator[id.name=/^fetch.*/][init.type='FunctionExpression']",
          message: fetchNameMessage,
        },
        {
          selector: 'MethodDefinition[key.name=/^fetch.*/]',
          message: fetchNameMessage,
        },
        {
          selector: "Property[key.name=/^fetch.*/][value.type='FunctionExpression']",
          message: fetchNameMessage,
        },
      ],
    },
  },
]
