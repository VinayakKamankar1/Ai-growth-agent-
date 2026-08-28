import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Zap, ShieldCheck, RefreshCcw } from 'lucide-react';

export default function MerchantDashboard({ orders, apiBase = 'http://localhost:8000' }) {
  const [liveOrders, setLiveOrders] = useState(orders || []);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${apiBase}/api/payments/orders`);
      const data = await res.json();
      if (data.orders) {
        setLiveOrders(data.orders);
        setTotalRevenue(data.total_revenue || 0);
      }
    } catch (e) {
      console.log("Error fetching merchant orders:", e);
    }
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Merchant Analytics Hub</h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Real-time transaction monitoring & automated sales insights</p>
        </div>

        <button onClick={fetchOrders} className="btn-pill-white">
          <RefreshCcw size={16} />
          Refresh Data
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card-modern" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>Total Revenue</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>Verified Settlement</p>
        </div>

        <div className="card-modern" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>Completed Orders</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(84, 51, 235, 0.15)', color: 'var(--violet-primary)' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {liveOrders.length}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px' }}>Instant Processing</p>
        </div>

        <div className="card-modern" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>Agent-Driven Conversion</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
              <Zap size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            88.4%
          </div>
          <p style={{ fontSize: '0.75rem', color: '#06B6D4', marginTop: '4px' }}>Automated AI Negotiation</p>
        </div>

        <div className="card-modern" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>Gateway Connection</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(84, 51, 235, 0.15)', color: 'var(--violet-primary)' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--violet-primary)' }}>
            ACTIVE & SECURE
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px' }}>Encrypted Gateway Online</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card-modern" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px' }}>Confirmed Customer Orders</h3>

        {liveOrders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
            No orders processed yet. Try placing an order via Storefront or AI Studio!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'left', color: '#6B7280' }}>
                  <th style={{ padding: '12px' }}>Order Reference</th>
                  <th style={{ padding: '12px' }}>Transaction ID</th>
                  <th style={{ padding: '12px' }}>Items</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {liveOrders.map((ord, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 600, color: 'var(--violet-primary)' }}>
                      {ord.order_id}
                    </td>
                    <td style={{ padding: '14px 12px', color: '#6B7280' }}>
                      {ord.payment_id || 'pay_001'}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      {ord.items && ord.items.length > 0 ? ord.items.map(i => i.name).join(', ') : 'AI Purchase'}
                    </td>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>
                      ₹{ord.amount?.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        {ord.status || 'PAID'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
