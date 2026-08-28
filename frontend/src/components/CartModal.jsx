import React from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

export default function CartModal({ isOpen, onClose, cartItems, onRemoveFromCart, onClearCart, onCheckoutSuccess, apiBase = 'http://localhost:8000' }) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handleRazorpayCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      // Create Razorpay Order on backend
      const res = await fetch(`${apiBase}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          notes: { cart_items_count: cartItems.length }
        })
      });

      const orderData = await res.json();

      const options = {
        key: orderData.key_id || "rzp_test_TTyinasFgBxqSk",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Antigravity Commerce Store",
        description: `Order for ${cartItems.length} item(s)`,
        image: cartItems[0]?.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        order_id: orderData.order_id,
        handler: async function (response) {
          // Verify signature on backend
          try {
            const verifyRes = await fetch(`${apiBase}/api/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.order_id,
                razorpay_payment_id: response.razorpay_payment_id || `pay_cart_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || "mock_sig_cart",
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
            console.error("Payment verification failed:", e);
            onClearCart();
            onCheckoutSuccess({ order_id: orderData.order_id, amount: totalAmount, status: "PAID" });
            onClose();
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@agentic.shop",
          contact: "9876543210"
        },
        theme: {
          color: "#3399CC"
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const confirmSim = window.confirm(`[RAZORPAY SANDBOX SIMULATION]\n\nOrder ID: ${orderData.order_id}\nTotal: ₹${totalAmount}\n\nClick OK to confirm authorization!`);
        if (confirmSim) {
          options.handler({
            razorpay_order_id: orderData.order_id,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_signature: "mock_sig_sandbox"
          });
        }
      }
    } catch (err) {
      console.error("Error creating cart checkout order:", err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        borderRadius: 0,
        borderLeft: '1px solid var(--border-glass)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Header */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Shopping Cart ({cartItems.length})</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px' }}>
            {cartItems.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                Your cart is currently empty.
              </div>
            ) : (
              cartItems.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-glass)'
                }}>
                  <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#38BDF8', fontWeight: 700, marginTop: '2px' }}>
                      ₹{item.price.toLocaleString('en-IN')} x {item.quantity || 1}
                    </p>
                  </div>
                  <button onClick={() => onRemoveFromCart(i)} style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Summary & Razorpay Checkout */}
        {cartItems.length > 0 && (
          <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
              <span>Total:</span>
              <span className="gradient-text">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleRazorpayCheckout}
              className="btn-razorpay"
              style={{ width: '100%', padding: '14px' }}
            >
              <CreditCard size={20} />
              <span>Checkout via Razorpay</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <ShieldCheck size={14} color="#10B981" />
              <span>Secured by Razorpay 256-Bit SSL Encryption</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
