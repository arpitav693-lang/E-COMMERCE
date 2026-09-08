import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import RestaurantConflictModal from './components/RestaurantConflictModal';

import HomePage from './pages/HomePage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage from './pages/CartPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OffersPage from './pages/OffersPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-orange-100 selection:text-swiggy-orange">
            {/* Top Navbar */}
            <Navbar />

            {/* Main Application Routes */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order/:id" element={<OrderTrackingPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>

            {/* Bottom Footer */}
            <Footer />

            {/* Modals */}
            <AuthModal />
            <RestaurantConflictModal />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

