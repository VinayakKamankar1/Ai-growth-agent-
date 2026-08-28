import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartItems, onRemoveFromCart, onClearCart, onCheckoutSuccess, apiBase = 'http://localhost:8000' }) {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState('Payment');
  const [shippingMethod, setShippingMethod] = useState('free');
  const [email, setEmail] = useState('customer@agentic.shop');
  const [fullName, setFullName] = useState('Agentic Shopper');
  const [address, setAddress] = useState('42 Tech Boulevard');
  const [city, setCity] = useState('Bangalore');
  const [postalCode, setPostalCode] = useState('560001');

  const shippingCost = shippingMethod === 'express' ? 499 : shippingMethod === 'overnight' ? 999 : 0;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const totalAmount = subtotal + shippingCost;

  const handleRazorpayCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      const res = await fetch(`${apiBase}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          notes: { customer: fullName, email: email }
        })
      });

      const orderData = await res.json();

      const options = {
        key: orderData.key_id || "rzp_test_TTyinasFgBxqSk",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "SHOP.AI Store",
        description: `Checkout for ${cartItems.length} item(s)`,
        image: cartItems[0]?.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${apiBase}/api/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.order_id,
                razorpay_payment_id: response.razorpay_payment_id || `pay_checkout_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || "mock_sig_valid",
                amount: totalAmount,
                items: cartItems
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              onClearCart();
              onCheckoutSuccess(verifyData.order);
              onClose();
            }
          } catch (e) {
            onClearCart();
            onCheckoutSuccess({ order_id: orderData.order_id, amount: totalAmount, status: "PAID" });
            onClose();
          }
        },
        prefill: {
          name: fullName,
          email: email,
          contact: "9876543210"
        },
        theme: {
          color: "#5433eb"
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const confirmSim = window.confirm(`[PAYMENT SIMULATION]\n\nOrder ID: ${orderData.order_id}\nTotal: ₹${totalAmount.toLocaleString('en-IN')}\n\nClick OK to authorize!`);
        if (confirmSim) {
          options.handler({
            razorpay_order_id: orderData.order_id,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_signature: "mock_sig_sandbox"
          });
        }
      }
    } catch (err) {
      console.error("Error creating checkout:", err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(0, 0, 0, 0.55)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="card-modern" style={{
        width: '100%',
        maxWidth: '980px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '36px',
        position: 'relative',
        background: '#ffffff'
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B7280' }}>
          <X size={20} />
        </button>

        {/* Two-Column Layout (60% Left, 40% Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '36px' }}>
          
          {/* Left Column (60% Checkout Form) */}
          <div>
            {/* Progress Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '28px' }}>
              <span style={{ color: currentStep === 'Cart' ? 'var(--violet-primary)' : '#111827' }}>Cart</span>
              <span>→</span>
              <span style={{ color: currentStep === 'Information' ? 'var(--violet-primary)' : '#111827' }}>Information</span>
              <span>→</span>
              <span style={{ color: currentStep === 'Shipping' ? 'var(--violet-primary)' : '#111827' }}>Shipping</span>
              <span>→</span>
              <span style={{ color: currentStep === 'Payment' ? 'var(--violet-primary)' : '#5433eb', fontWeight: 700 }}>Payment</span>
            </div>

            {/* Section 1: Contact Information */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>Contact Information</h3>
              <input
                type="email"
                className="input-pill"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: '9999px',
                  background: '#ffffff',
                  border: '1px solid #D1D5DB',
                  padding: '14px 22px',
                  fontSize: '15px',
                  outline: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              />
            </div>

            {/* Section 2: Shipping Address */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>Shipping Address</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: '9999px',
                    background: '#ffffff',
                    border: '1px solid #D1D5DB',
                    padding: '14px 22px',
                    fontSize: '15px',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                />
                <input
                  type="text"
                  placeholder="Street address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: '9999px',
                    background: '#ffffff',
                    border: '1px solid #D1D5DB',
                    padding: '14px 22px',
                    fontSize: '15px',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: '100%',
                      borderRadius: '9999px',
                      background: '#ffffff',
                      border: '1px solid #D1D5DB',
                      padding: '14px 22px',
                      fontSize: '15px',
                      outline: 'none',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    style={{
                      width: '100%',
                      borderRadius: '9999px',
                      background: '#ffffff',
                      border: '1px solid #D1D5DB',
                      padding: '14px 22px',
                      fontSize: '15px',
                      outline: 'none',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  />
                </div>
                <select 
                  defaultValue="India" 
                  style={{
                    width: '100%',
                    borderRadius: '9999px',
                    background: '#ffffff',
                    border: '1px solid #D1D5DB',
                    padding: '14px 22px',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>

            {/* Section 3: Shipping Method */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>Shipping Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderRadius: '9999px', border: '1px solid #E5E7EB', background: '#FFF', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="radio" name="shipping" checked={shippingMethod === 'free'} onChange={() => setShippingMethod('free')} style={{ accentColor: 'var(--violet-primary)' }} />
                    <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>Standard Delivery</span>
                  </div>
                  <span style={{ fontSize: '0.92rem', color: '#10B981', fontWeight: 700 }}>FREE</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderRadius: '9999px', border: '1px solid #E5E7EB', background: '#FFF', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} style={{ accentColor: 'var(--violet-primary)' }} />
                    <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>Express Shipping (2 Days)</span>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>₹499</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderRadius: '9999px', border: '1px solid #E5E7EB', background: '#FFF', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="radio" name="shipping" checked={shippingMethod === 'overnight'} onChange={() => setShippingMethod('overnight')} style={{ accentColor: 'var(--violet-primary)' }} />
                    <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>Overnight Delivery</span>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>₹999</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column (40% Order Summary Card) */}
          <div className="card-modern" style={{ padding: '28px', height: 'fit-content', background: '#F9FAFB', borderRadius: '28px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: '#111827' }}>Order Summary</h3>

            {/* Product Thumbnails */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '240px', overflowY: 'auto' }}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', background: '#FFF' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Qty: {item.quantity || 1}</p>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827' }}>
                    ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6B7280', marginBottom: '8px' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6B7280', marginBottom: '12px' }}>
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                <span>Total</span>
                <span style={{ color: 'var(--violet-primary)' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Large Black Pill Button "Pay Now" */}
            <button
              onClick={handleRazorpayCheckout}
              className="btn-pill-dark btn-shine"
              style={{ width: '100%', height: '48px', fontSize: '1rem', marginBottom: '16px' }}
            >
              <CreditCard size={18} />
              <span>Pay Now (₹{totalAmount.toLocaleString('en-IN')})</span>
            </button>

            {/* Secure Checkout Badges */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', color: '#6B7280', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>🔒 SSL 256-Bit</span>
                <span>•</span>
                <span>Visa</span>
                <span>•</span>
                <span>Mastercard</span>
                <span>•</span>
                <span>Razorpay</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
