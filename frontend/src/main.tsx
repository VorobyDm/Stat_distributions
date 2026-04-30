import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Theme, presetGpnDefault } from "@consta/uikit/Theme";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme preset={presetGpnDefault}>
      <App />
    </Theme>
  </StrictMode>
);
