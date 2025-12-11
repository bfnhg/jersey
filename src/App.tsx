// src/App.tsx → Version finale propre
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        {/* <Route path="/checkout" element={<Checkout />} /> */}
      </Routes>
    </div>
  );
}

export default App;