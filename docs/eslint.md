Here’s a basic `.eslintrc.json` configuration for **Node.js** that follows **clean code principles** and industry standards. This configuration will help maintain code quality, enforce consistency, and encourage best practices.

### **Key Features of This ESLint Configuration:**
- **ECMAScript 6+ features**: Allows modern JavaScript syntax.
- **Node.js environment**: Recognizes Node.js-specific global variables and syntax.
- **Best practices**: Enforces clean code, consistent formatting, and best practices for functions, variables, and structure.
- **Prettier**: Optionally integrates with **Prettier** for automatic formatting.

### **.eslintrc.json**:
```json
{
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    // Best practices
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "no-console": "off", // Allow console logs in Node.js for debugging
    "consistent-return": "error",
    "no-var": "error", // Enforce let/const over var
    "prefer-const": "error", // Prefer const if variables are not re-assigned

    // Clean code principles
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "arrow-body-style": ["error", "as-needed"],
    "no-magic-numbers": ["warn", { "ignoreArrayIndexes": true, "enforceConst": true }],
    "no-param-reassign": ["error", { "props": false }],
    "no-shadow": ["error"],
    "camelcase": ["error", { "properties": "never" }],
    
    // Stylistic preferences
    "indent": ["error", 2], // 2 spaces indentation
    "quotes": ["error", "single", { "avoidEscape": true }],
    "semi": ["error", "always"],
    "space-before-blocks": "error",
    "no-trailing-spaces": "error",
    "keyword-spacing": ["error", { "before": true, "after": true }],
    "comma-dangle": ["error", "never"],

    // Prettier integration
    "prettier/prettier": ["error", {
      "singleQuote": true,
      "semi": true,
      "printWidth": 80,
      "trailingComma": "none",
      "tabWidth": 2
    }]
  }
}
```

### **Explanation of Key Rules:**

1. **Best Practices**:
   - **eqeqeq**: Enforces the use of `===` and `!==` to avoid type coercion issues.
   - **curly**: Requires curly braces around all control statements (e.g., `if`, `else`, `while`).
   - **no-console**: Allows console logs (which are common in Node.js for debugging).
   - **no-var**: Prohibits the use of `var`, encouraging the use of `let` and `const`.
   - **prefer-const**: Enforces using `const` for variables that are not re-assigned.

2. **Clean Code Principles**:
   - **no-unused-vars**: Disallows unused variables, but allows ignoring function arguments prefixed with `_` (e.g., `_req`, `_next`).
   - **no-multiple-empty-lines**: Limits consecutive empty lines to 1.
   - **arrow-body-style**: Enforces concise arrow function syntax when possible.
   - **no-magic-numbers**: Warns about using "magic numbers" (numbers in the code without explanation).
   - **camelcase**: Enforces camelCase for variable and function names, except for object properties.

3. **Stylistic Preferences**:
   - **indent**: Enforces 2 spaces for indentation.
   - **quotes**: Enforces the use of single quotes (`'`), except when avoiding escape (`"don't"`).
   - **semi**: Requires semicolons at the end of statements.
   - **trailing-spaces**: Prohibits trailing spaces at the end of lines.

4. **Prettier Integration**:
   - **Prettier**: Automatically enforces consistent code formatting, including single quotes, 80-character line width, and trailing commas.

---

### **Installing ESLint and Prettier**:

1. **Install ESLint** and its plugins:
   ```bash
   npm install eslint eslint-plugin-node eslint-plugin-prettier eslint-config-prettier --save-dev
   ```

2. **Install Prettier**:
   ```bash
   npm install prettier --save-dev
   ```

3. **Run ESLint**:
   - To lint your code and check for issues:
     ```bash
     npx eslint .
     ```

4. **Run Prettier** (optional):
   - To automatically format your code using Prettier:
     ```bash
     npx prettier --write .
     ```

---

### **Optional: Add Scripts in `package.json`**:

To simplify running ESLint and Prettier, you can add the following scripts to your `package.json`:
```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

---

This ESLint configuration ensures that your Node.js project follows modern standards, maintains clean and readable code, and uses best practices for maintainability. Let me know if you need further customization!