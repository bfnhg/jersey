// src/App.tsx
import React from 'react'
import { CartProvider } from './context/CartContext'
import { Routes, Route } from 'react-router-dom'

import Home from './Home'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout' // si tu l'as

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* autres routes */}
      </Routes>
    </CartProvider>
  )
}

export default App