import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import eslint from "@eslint/js"
import eslintPluginPrettier from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"

export default [
  { files: ["src/**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  { ignores: ["node_modules/**", "dist/**"] },
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier: eslintPluginPrettier,
    },
  },
  {
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },
  eslint.configs.recommended,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]
