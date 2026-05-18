import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';

// Critical CSS first - layout and design tokens
import "./global.css";
import "./index.css";

// Font CSS
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/700.css";

// Ant Design base reset (small, foundational)
import "antd/dist/reset.css";

// Non-critical CSS - Ant Design customizations (loaded after critical path)
import "./antd-custom.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
