import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"},
  rules: {
    // Extends equivalent
    //...eslintPluginNode.configs.recommended.rules,
    //...eslintPluginPrettier.configs.recommended.rules,

    // Best practices
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
      "no-console": "off", // Allow console logs in Node.js for debugging
      "consistent-return": "error",
      "no-var": "error", // Enforce let/const over var
      "prefer-const": "error", // Prefer const if variables are not re-assigned

      // Clean code principles
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "arrow-body-style": ["error", "as-needed"],
      "no-magic-numbers": [
        "warn",
        { ignoreArrayIndexes: true, enforceConst: true }
      ],
      "no-param-reassign": ["error", { props: false }],
      "no-shadow": ["error"],
      camelcase: ["error", { properties: "never" }],

           // Stylistic preferences
           indent: ["error", 2], // 2 spaces indentation
           quotes: ["error", "single", { avoidEscape: true }],
           semi: ["error", "always"],
           "space-before-blocks": "error",
           "no-trailing-spaces": "error",
           "keyword-spacing": ["error", { before: true, after: true }],
           "comma-dangle": ["error", "never"],
  }
},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
];