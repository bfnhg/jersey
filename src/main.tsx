// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";        // ON LE REMET ICI
import { CartProvider } from "./context/CartContext";

// Optimisations globales (GPU + anti double-tap zoom)
const GlobalOptimizations = () => {
  React.useEffect(() => {
    // Force GPU
    document.body.style.transform = "translateZ(0)";

    // Anti double-tap zoom sur mobile
    let lastTouchEnd = 0;
    const preventZoom = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    };
    document.addEventListener("touchend", preventZoom, { passive: false });

    return () => document.removeEventListener("touchend", preventZoom);
  }, []);

  return null;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>                     {/* ICI ET UNIQUEMENT ICI */}
      <CartProvider>
        <GlobalOptimizations />
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);