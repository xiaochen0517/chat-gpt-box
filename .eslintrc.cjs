module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "parser": "@typescript-eslint/parser",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "vue"
  ],
  "rules": {
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1,
        "MemberExpression": "off",
        "CallExpression": {
          "arguments": "off"
        },
      }
    ],
    "vue/html-indent": [
      "error",
      2,
      {
        "attribute": 2,
        "closeBracket": 0,
        "alignAttributesVertically": true,
        "ignores": []
      }
    ],
    "vue/max-attributes-per-line": [
      "error",
      {
        "singleline": {
          "max": 5,
        },
        "multiline": {
          "max": 1,
        }
      }
    ],
    "vue/first-attribute-linebreak": ["error", {
      "singleline": "beside",
      "multiline": "below"
    }],
    "vue/html-closing-bracket-newline": ["error", {
      "singleline": "never",
      "multiline": "always"
    }],
    "@typescript-eslint/no-unused-vars": "warn",
    "vue/no-deprecated-slot-attribute": "off",
    "vue/no-dupe-keys": "off",
    "linebreak-style": [
      "error",
      "windows"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
