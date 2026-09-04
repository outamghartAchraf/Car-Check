import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import UserContext from "./context/UserContext";

import "./index.css";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <UserContext>
      <App />
    </UserContext>
  </StrictMode>
);