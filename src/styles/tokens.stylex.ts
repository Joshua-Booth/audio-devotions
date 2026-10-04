import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  page: "#ffffff",
  ink: "#000000",
  key: "#ffffff",
  keyHover: "#eef0f3",
  keyEdge: "#000000",
  keyInk: "#000000",
  stop: "#b30000",
  play: "#ffffff",
  playEdge: "#000000",
  playInk: "#005a00",
  alert: "#fff0f0",
  alertEdge: "#b30000",
  alertInk: "#7a0000",
  focus: "#1d4ed8",
  track: "#3071a9",
  trackRing: "transparent",
  trackFill: "#173a5e",
  thumb: "#ffffff",
  thumbEdge: "#000000",
});

export const textSize = stylex.defineConsts({
  primary: "3rem",
  secondary: "2.25rem",
});

export const screens = stylex.defineConsts({
  large: "@media (min-width: 40rem) and (min-height: 30rem)",
  sideways: "@media (min-width: 40rem) and (max-height: 29.99rem)",
  roomyPhone:
    "@media (min-width: 22rem) and (max-width: 39.99rem) and (min-height: 44rem)",
  cramped: "@media (max-height: 44rem), (max-width: 24rem)",
  narrow: "@media (max-width: 24rem)",
  wide: "@media (min-width: 40rem)",
});
