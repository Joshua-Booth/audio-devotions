/**
 * @module theme
 */
import * as stylex from "@stylexjs/stylex";

import { colors } from "./styles/tokens.stylex";

const yellowOnBlack = stylex.createTheme(colors, {
  page: "#000000",
  ink: "#ffe14d",
  key: "#000000",
  keyHover: "#1a1a1a",
  keyEdge: "#ffe14d",
  keyInk: "#ffe14d",
  stop: "#ffe14d",
  play: "#ffe14d",
  playEdge: "#ffe14d",
  playInk: "#000000",
  alert: "#ffe14d",
  alertEdge: "#ffe14d",
  alertInk: "#000000",
  focus: "#00e5ff",
  track: "#000000",
  trackRing: "#ffe14d",
  trackFill: "#ffe14d",
  thumb: "#000000",
  thumbEdge: "#ffe14d",
});

const root = stylex.create({
  page: { backgroundColor: colors.page },
});

const classesOf = ({ className = "" }: { className?: string }) =>
  className.split(" ").filter(Boolean);

const pageClasses = classesOf(stylex.props(root.page));
const themeClasses = classesOf(stylex.props(yellowOnBlack));

export function setYellowOnBlack(on: boolean) {
  const html = document.documentElement;
  html.classList.add(...pageClasses);
  html.classList.toggle("dark", on);
  for (const name of themeClasses) html.classList.toggle(name, on);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", getComputedStyle(html).backgroundColor);
}

function readStoredTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function storeTheme(theme: "dark" | "light") {
  try {
    localStorage.setItem("theme", theme);
  } catch {}
}

/**
 * Initialize theme based on localStorage or system preference.
 * Should be called before React renders to avoid flash of wrong theme.
 * @example
 * initializeTheme()
 */
export function initializeTheme() {
  const stored = readStoredTheme();
  setYellowOnBlack(
    stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/**
 * Toggle the colour theme of the app.
 * @example
 * toggleColour()
 */
export function toggleColour() {
  const on = !document.documentElement.classList.contains("dark");
  setYellowOnBlack(on);
  storeTheme(on ? "dark" : "light");
}
