/// <reference types="vitest/config" />
import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

/**
 * StyleX's plugin starts an interval it only clears when an HTTP server closes.
 * Vitest's servers have none, so every test run hung until its close timeout.
 */
function stylexPlugin() {
  const plugin = stylex.vite();
  const { configureServer } = plugin;
  return {
    ...plugin,
    configureServer(server) {
      const setInterval = globalThis.setInterval;
      globalThis.setInterval = (...args) => setInterval(...args).unref();
      try {
        return configureServer.call(this, server);
      } finally {
        globalThis.setInterval = setInterval;
      }
    },
  };
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [stylexPlugin(), react()],
  build: {
    outDir: "build",
    sourcemap: true,
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
                launch: {
                  args: ["--autoplay-policy=no-user-gesture-required"],
                },
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
