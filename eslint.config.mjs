import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Type-scale guardrail: flag new arbitrary Tailwind font sizes (e.g.
  // `text-[10px]`) so they don't keep bypassing the semantic scale. Prefer the
  // semantic classes in app/globals.css (.text-label, .text-caption,
  // .text-body-sm, .text-body, heading-*). `warn` (not `error`) so the existing
  // occurrences being migrated incrementally don't break CI.
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/text-\\[[0-9.]+px\\]/]",
          message:
            "Avoid arbitrary font sizes like text-[10px]; use a semantic type class (.text-label / .text-caption / .text-body-sm / .text-body).",
        },
        {
          selector: "TemplateElement[value.raw=/text-\\[[0-9.]+px\\]/]",
          message:
            "Avoid arbitrary font sizes like text-[10px]; use a semantic type class (.text-label / .text-caption / .text-body-sm / .text-body).",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
