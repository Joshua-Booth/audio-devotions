import * as stylex from "@stylexjs/stylex";

import { colors } from "./tokens.stylex";

export const focusRing = stylex.create({
  base: {
    outlineWidth: { default: null, ":focus-visible": 5 },
    outlineStyle: { default: null, ":focus-visible": "solid" },
    outlineColor: { default: null, ":focus-visible": colors.focus },
    outlineOffset: { default: null, ":focus-visible": 5 },
  },
  pill: {
    borderRadius: { default: null, ":focus-visible": 999 },
  },
});

export const visuallyHidden = stylex.create({
  base: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
});
