import { createRoot } from "react-dom/client";

import App from "./App";
import { initializeTheme } from "./utils";

import "./index.css";

// Initialize theme before React renders to avoid flash of wrong theme
initializeTheme();

const container = document.getElementById("root");
createRoot(container!).render(<App />);
