import { createRoot } from "react-dom/client";

import { App } from "./app";
import { initializeTheme } from "./utils";

import "./index.css";

// Initialize theme before React renders to avoid flash of wrong theme
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
