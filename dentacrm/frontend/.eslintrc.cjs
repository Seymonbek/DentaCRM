/**
 * ESLint config for the DentaCRM frontend (React 18 + TypeScript + Vite).
 *
 * We stay on the classic (.eslintrc) format because the pinned ESLint
 * version is 8.57.x; flat config (eslint.config.js) is 9.x-only.
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: "18" },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    // React 18 + new JSX transform → we don't need React in scope.
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",

    // Uzbek text contains apostrophes ('), which the rule flags as
    // "unescaped entities". These render correctly and escaping every
    // occurrence would hurt readability of localized strings.
    "react/no-unescaped-entities": "off",

    // We rely on TypeScript for prop and unused-var checks.
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],

    // Escape-hatch for third-party libs whose types aren't strict.
    "@typescript-eslint/no-explicit-any": "warn",

    // Empty catches are sometimes intentional (retry loops); warn only.
    "no-empty": ["warn", { allowEmptyCatch: true }],
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "vitest.setup.ts"],
      env: { node: true },
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
  ignorePatterns: [
    "dist",
    "build",
    "node_modules",
    "coverage",
    "playwright-report",
    "*.config.js",
    "*.config.cjs",
    "*.config.ts",
    "vite.config.ts",
    "vitest.setup.ts",
    "tailwind.config.js",
    "postcss.config.js",
  ],
};
