import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/main.tsx"],
  project: ["src/**/*.{ts,tsx}"],

  ignoreDependencies: [
    // CLI tool for spell checking (run via mise tasks)
    "cspell",
    // Coverage tooling (loaded dynamically by vitest)
    "@vitest/coverage-v8",
    // CSS framework (imported in CSS, not JS)
    "tailwindcss",
  ],

  ignoreBinaries: [
    "mise",
    // TypeScript compiler (referenced in package.json scripts)
    "tsc",
  ],

  ignoreExportsUsedInFile: true,
};

export default config;
