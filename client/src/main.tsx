import { createRoot } from "react-dom/client";
import { StrictMode, Suspense, lazy } from "react";
import logo from "../public/liveChatLogo.webp";
const App = lazy(() => import("./App.tsx"));

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense
      fallback={
        <div
          style={{
            position: "absolute",
            background: " #000000f8",
            color: "#a3a3a3",
            padding: "0",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            textAlign: "center",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "0",
          }}
        >
          <img    loading="lazy" src={logo} alt="Loading..." />
        </div>
      }
    >
      <App />
    </Suspense>
  </StrictMode>
);
