/**
 * @module theme
 */

/**
 * Initialize theme based on localStorage or system preference.
 * Should be called before React renders to avoid flash of wrong theme.
 * @example
 * initializeTheme()
 */
export function initializeTheme() {
  const stored = localStorage.getItem("theme");
  if (stored === "dark") {
    document.documentElement.classList.add("dark");
  } else if (stored === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // No preference stored, use system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }
}

/**
 * Toggle the colour theme of the app.
 * @example
 * toggleColour()
 */
export function toggleColour() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
