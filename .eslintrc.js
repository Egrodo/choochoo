module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  env: {
    browser: true,
    node: true
  },
  plugins: ['react-hooks', 'prettier'],
  rules: {
    'max-len': 0,
    'linebreak-style': 0,
    'react/no-unused-state': 0,
    'react/no-array-index-key': 0,
    'react/jsx-filename-extension': 0,
    'class-methods-use-this': 0,
    'no-plusplus': 0,
    'no-param-reassign': 0,
    'no-continue': 0,
    'no-nested-ternary': 0,
    'no-console': 0,
    'react/no-unescaped-entities': 0,
    'react/destructuring-assignment': 0,
    'jsx-a11y/label-has-for': 0
  }
};
