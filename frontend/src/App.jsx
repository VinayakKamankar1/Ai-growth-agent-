import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Storefront from './components/Storefront';
import SearchResults from './components/SearchResults';
import AgentStudio from './components/AgentStudio';
import MerchantDashboard from './components/MerchantDashboard';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'search' | 'agent' | 'merchant'
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [agentInitialPrompt, setAgentInitialPrompt] = useState('');
  const [toast, setToast] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (e) {
      console.log("Error fetching catalog products:", e);
    }
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAgentBuy = (prompt) => {
    setAgentInitialPrompt(prompt);
    setActiveTab('agent');
  };

  const handlePaymentSuccess = (orderRecord) => {
    showToast(`🎉 Razorpay Payment Authorized! Order ID: ${orderRecord.order_id || 'CONFIRMED'}`);
    setOrders(prev => [orderRecord, ...prev]);
    fetchProducts();
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f2f4f5' }}>
      {/* Toast Banner */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 300,
          background: '#111827',
          color: '#FFF',
          padding: '14px 22px',
          borderRadius: '9999px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>{toast}</span>
        </div>
      )}

      {/* Navigation Bar & Vertical Rail */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)}
        openCart={() => setIsCartOpen(true)}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {activeTab === 'store' && (
          <Storefront
            products={products}
            onAddToCart={handleAddToCart}
            onAgentBuy={handleAgentBuy}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'search' && (
          <SearchResults
            products={products}
            onAddToCart={handleAddToCart}
            onAgentBuy={handleAgentBuy}
          />
        )}

        {activeTab === 'agent' && (
          <AgentStudio
            initialPrompt={agentInitialPrompt}
            onPaymentSuccess={handlePaymentSuccess}
            apiBase={API_BASE}
          />
        )}

        {activeTab === 'merchant' && (
          <div style={{ marginLeft: '64px', padding: '36px' }}>
            <MerchantDashboard orders={orders} apiBase={API_BASE} />
          </div>
        )}
      </main>

      {/* Checkout Modal / Slideover */}
      <CheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
        onCheckoutSuccess={handlePaymentSuccess}
        apiBase={API_BASE}
      />

      {/* 4-Column Minimal Footer */}
      <Footer />
    </div>
  );
}
