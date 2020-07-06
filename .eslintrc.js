module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'no-plusplus': 'off',
    camelcase: ['error', { properties: 'never' }],
  },

  // 'rules': {
  //   'max-len' : ["error", {code : 300}],
  //   'require-jsdoc' : 0,
  // },
};
