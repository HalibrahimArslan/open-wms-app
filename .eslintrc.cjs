module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['prettier'],
  rules: {},
  overrides: [
    {
      files: ['src/services/**/*.{js,jsx}'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'FunctionDeclaration[id.name=/^fetch.*/]',
            message: "Services klasoru altinda 'fetch' ile baslayan fonksiyon isimleri kullanilamaz.",
          },
          {
            selector: "VariableDeclarator[id.name=/^fetch.*/][init.type='ArrowFunctionExpression']",
            message: "Services klasoru altinda 'fetch' ile baslayan fonksiyon isimleri kullanilamaz.",
          },
          {
            selector: "VariableDeclarator[id.name=/^fetch.*/][init.type='FunctionExpression']",
            message: "Services klasoru altinda 'fetch' ile baslayan fonksiyon isimleri kullanilamaz.",
          },
          {
            selector: "MethodDefinition[key.name=/^fetch.*/]",
            message: "Services klasoru altinda 'fetch' ile baslayan fonksiyon isimleri kullanilamaz.",
          },
          {
            selector: "Property[key.name=/^fetch.*/][value.type='FunctionExpression']",
            message: "Services klasoru altinda 'fetch' ile baslayan fonksiyon isimleri kullanilamaz.",
          },
        ],
      },
    },
  ],
}
