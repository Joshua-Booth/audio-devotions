import React from "react";
import ReactDOM from "react-dom";

// Component
import App from "./App";

// Service Worker
import * as serviceWorker from "./serviceWorker";

// Styles
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
