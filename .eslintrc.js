module.exports = {
  parser: 'babel-eslint',
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: '16.4',
    },
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  env: {
    browser: true,
    jest: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb'],
  plugins: ['react', 'jsx-a11y', 'import'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'jsx-a11y/media-has-caption': 'off',
    'linebreak-style': 'off',
    'react/jsx-one-expression-per-line': 'off',
    indent: ['error', 2, { SwitchCase: 1 }],
    'max-len': [
      'warn',
      {
        code: 110,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js', 'jsx'],
      },
    ],
    'global-require': 'off',
    'react/forbid-prop-types': ['error', { forbid: ['any'] }],
    'import/no-dynamic-require': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'no-return-assign': 'off',
    'no-use-before-define': 'off',
    'jsx-a11y/label-has-associated-control': ['error', {
      'required': {
        'some': ['nesting', 'id']
      }
    }],
    'jsx-a11y/label-has-for': ['error', {
      'required': {
        'some': ['nesting', 'id']
      }
    }]
  },
};