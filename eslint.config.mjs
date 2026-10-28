import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", ".vercel/**", "out/**", "node_modules/**", "raw/**"],
  },
];

export default config;
