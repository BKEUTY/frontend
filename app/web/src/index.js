import React from "react";
import ReactDOM from "react-dom/client";
// CSS Import Order (DO NOT CHANGE):
// 1. Base styles
import "./index.css";
// 2. Global design system
import "./global.css";
// 3. Ant Design core styles
import "antd/dist/reset.css";
// 4. Ant Design custom theme (overrides)
import "./antd-custom.css";
// 5. Component-specific CSS will be imported in components

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
