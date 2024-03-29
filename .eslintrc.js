module.exports = {
  root: true

  , parser: '@typescript-eslint/parser'

  , parserOptions: {
    ecmaVersion: 2018
    , sourceType: 'module'
    , ecmaFeatures: { jsx: true }
  }

  , plugins: [
      '@typescript-eslint'
  ]

  , env: {
    browser: true
    , commonjs: true
    , es6: true
    , node: true
    , es2020: true
  }

  , globals: {}

  , settings: {
    react: {
      version: 'detect'
    }
  }

  , overrides: []

  , extends: [ 'eslint:recommended' ]

  , rules: {

    // 'custom-rules/no-todo-remove': 'warn'
    // , 'custom-rules/no-test-only': 'error'

    // http://eslint.org/docs/rules/
    'array-callback-return': 'warn'
    , 'default-case': ['warn', { commentPattern: '^no default$' }]
    , 'dot-location': ['warn', 'property']
    , eqeqeq: ['warn', 'smart']
    , 'new-parens': 'warn'
    , 'no-array-constructor': 'warn'
    , 'no-caller': 'warn'
    , 'no-cond-assign': ['warn', 'except-parens']
    , 'no-const-assign': 'warn'
    , 'no-control-regex': 'warn'
    , 'no-delete-var': 'warn'
    , 'no-dupe-args': 'warn'
    , 'no-dupe-class-members': 'warn'
    , 'no-dupe-keys': 'warn'
    , 'no-duplicate-case': 'warn'
    , 'no-empty-character-class': 'warn'
    , 'no-empty-pattern': 'warn'
    , 'no-eval': 'warn'
    , 'no-ex-assign': 'warn'
    , 'no-extend-native': 'warn'
    , 'no-extra-bind': 'warn'
    , 'no-extra-label': 'warn'
    , 'no-fallthrough': 'warn'
    , 'no-func-assign': 'warn'
    , 'no-implied-eval': 'warn'
    , 'no-invalid-regexp': 'warn'
    , 'no-iterator': 'warn'
    , 'no-label-var': 'warn'
    , 'no-labels': ['warn', { allowLoop: true, allowSwitch: false }]
    , 'no-lone-blocks': 'warn'
    , 'no-loop-func': 'warn'
    , 'no-mixed-operators': [
      'warn'
      , {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>']
          , ['==', '!=', '===', '!==', '>', '>=', '<', '<=']
          // ['&&', '||'],
          , ['in', 'instanceof']
         ]
        , allowSamePrecedence: false
      }
     ]
    , 'no-multi-str': 'warn'
    , 'no-native-reassign': 'warn'
    , 'no-negated-in-lhs': 'warn'
    , 'no-new-func': 'warn'
    , 'no-new-object': 'warn'
    , 'no-new-symbol': 'warn'
    , 'no-new-wrappers': 'warn'
    , 'no-obj-calls': 'warn'
    , 'no-octal': 'warn'
    , 'no-octal-escape': 'warn'
    , 'no-regex-spaces': 'warn'
    , 'no-restricted-syntax': ['warn', 'WithStatement']
    , 'no-script-url': 'warn'
    , 'no-self-assign': 'warn'
    , 'no-self-compare': 'warn'
    , 'no-sequences': 'off'
    , 'no-shadow-restricted-names': 'warn'
    , 'no-sparse-arrays': 'warn'
    , 'no-template-curly-in-string': 'off'
    , 'no-this-before-super': 'warn'
    , 'no-throw-literal': 'warn'
    , 'no-undef': 'error'
    // 'no-restricted-globals': ['error'].concat(restrictedGlobals),
    , 'no-unexpected-multiline': 'warn'
    , 'no-unreachable': 'warn'
    , 'no-unused-expressions': [
      'error'
      , {
        allowShortCircuit: true
        , allowTernary: true
        , allowTaggedTemplates: true
      }
     ]
    , 'no-unused-labels': 'warn'
    , '@typescript-eslint/no-unused-vars': [
      'error'
      , {
        args: 'none'
        , ignoreRestSiblings: true
      }
     ]
    // , 'no-unused-vars': [
    //   'warn'
    //   , {
    //     args: 'none'
    //     , ignoreRestSiblings: true
    //   }
    //  ]
    , "no-use-before-define": "off"
    // , "@typescript-eslint/no-use-before-define": ["error"]
    , "@typescript-eslint/no-use-before-define": ["error", {
      "variables": true
      , "functions": false
    }]
    , 'no-useless-computed-key': 'warn'
    , 'no-useless-concat': 'warn'
    , 'no-useless-constructor': 'warn'
    , 'no-useless-escape': 'warn'
    , 'no-useless-rename': [
      'warn'
      , {
        ignoreDestructuring: false
        , ignoreImport: false
        , ignoreExport: false
      }
     ]
    , 'no-with': 'warn'
    , 'no-whitespace-before-property': 'warn'
    , 'react-hooks/exhaustive-deps': 'off' // fixes wrong stuff
    , 'require-yield': 'warn'
    , 'rest-spread-spacing': ['warn', 'never']
    , strict: ['warn', 'never']
    , 'unicode-bom': ['warn', 'never']
    , 'use-isnan': 'warn'
    , 'valid-typeof': 'warn'
    , 'no-restricted-properties': [
      'error'
      , {
        object: 'require'
        , property: 'ensure'
        , message:
          'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting'
      }
      , {
        object: 'System'
        , property: 'import'
        , message:
          'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting'
      }
     ]
    , 'getter-return': 'warn'

    , 'comma-dangle': ['error']

    , 'comma-style': ['warn', 'first']
    , 'comma-spacing': ['warn', { before: false, after: true }]

    // // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
    // , 'import/first': 'error'
    // , 'import/no-amd': 'error'
    // // , 'import/no-webpack-loader-syntax': 'error'

    // // https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
    // , 'react-hooks/rules-of-hooks': 'error'

    // // https://github.com/gajus/eslint-plugin-flowtype
    // , 'flowtype/define-flow-type': 'warn'
    // , 'flowtype/require-valid-file-annotation': 'warn'
    // , 'flowtype/use-flow-type': 'warn'

    // Cypress
    , 'cypress/no-unnecessary-waiting': 'off'
  }
};
