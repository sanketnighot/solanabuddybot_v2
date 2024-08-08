import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"

export default [
  { files: ["src/**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  { ignores: ["node_modules/**/*", "dist/**/*"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]
