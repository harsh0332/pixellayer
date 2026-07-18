import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Raw uploaded assets — never linted:
    "public/**",
    // Vendored PixelLayerr motion-library components (ported as-is; the
    // integration brief forbids changing their animation logic):
    "components/motion/animkit/*.jsx",
  ]),
]);

export default eslintConfig;
