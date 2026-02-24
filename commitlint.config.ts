import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],

  rules: {
    "scope-case": [2, "always", "kebab-case"],
    "scope-empty": [0],
    "header-max-length": [2, "always", 72],
  },
};

export default config;
