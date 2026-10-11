import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/main.tsx"],
  project: ["src/**/*.{ts,tsx}"],

  ignoreDependencies: [
    // Run by lefthook through mise exec, which knip doesn't parse
    "@commitlint/cli",
    // CLI tool for spell checking (run via mise tasks)
    "cspell",
    // Coverage tooling (loaded dynamically by vitest)
    "@vitest/coverage-v8",
    // Font (imported in CSS, not JS)
    "@fontsource-variable/atkinson-hyperlegible-next",
  ],

  ignoreBinaries: [
    "mise",
    // TypeScript compiler (referenced in package.json scripts)
    "tsc",
  ],

  ignoreExportsUsedInFile: true,
};

export default config;
