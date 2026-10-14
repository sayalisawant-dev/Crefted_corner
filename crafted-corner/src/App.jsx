import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import WishlistPage from './pages/WishlistPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"                  element={<HomePage />} />
        <Route path="/products"          element={<ProductsPage />} />
        <Route path="/products/:id"      element={<ProductDetailPage />} />
        <Route path="/cart"              element={<CartPage />} />
        <Route path="/checkout"          element={<CheckoutPage />} />
        <Route path="/wishlist"          element={<WishlistPage />} />
        {/* Catch-all */}
        <Route path="/404"               element={<NotFoundPage />} />
        <Route path="*"                  element={<Navigate to="/404" replace />} />
      </Routes>
    </Layout>
  )
}
