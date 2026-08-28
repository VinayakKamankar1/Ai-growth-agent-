import React from 'react';
import { Home, Search, Zap, ShoppingBag, BarChart3, Bot, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartCount, openCart }) {
  return (
    <>
      {/* Left 64px Vertical Navigation Rail */}
      <aside className="nav-rail">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div 
            onClick={() => setActiveTab('store')}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--violet-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 6px 16px var(--violet-shadow)'
            }}
          >
            <Bot size={22} />
          </div>

          <div 
            onClick={() => setActiveTab('store')}
            className={`nav-rail-icon ${activeTab === 'store' ? 'active' : ''}`}
            title="Home"
          >
            <Home size={20} />
          </div>

          <div 
            onClick={() => setActiveTab('search')}
            className={`nav-rail-icon ${activeTab === 'search' ? 'active' : ''}`}
            title="Search Catalog"
          >
            <Search size={20} />
          </div>

          <div 
            onClick={() => setActiveTab('agent')}
            className={`nav-rail-icon ${activeTab === 'agent' ? 'active' : ''}`}
            style={{ position: 'relative' }}
            title="AI Agent Studio"
          >
            <Zap size={20} color={activeTab === 'agent' ? 'var(--violet-primary)' : '#111827'} />
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--violet-primary)'
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div 
            onClick={openCart}
            className="nav-rail-icon"
            style={{ position: 'relative' }}
            title="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: 'var(--violet-primary)',
                color: '#FFF',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </div>

          <div 
            onClick={() => setActiveTab('merchant')}
            className={`nav-rail-icon ${activeTab === 'merchant' ? 'active' : ''}`}
            title="Merchant Hub"
          >
            <BarChart3 size={20} />
          </div>
        </div>
      </aside>

      {/* Top Header Bar */}
      <header style={{
        margin: '0 0 0 64px',
        padding: '16px 36px',
        background: '#ffffff',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        sticky: 'top',
        top: 0,
        zIndex: 80
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
            SHOP.<span style={{ color: 'var(--violet-primary)' }}>AI</span>
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#6B7280', background: '#F3F4F6', padding: '4px 10px', borderRadius: '9999px', fontWeight: 600 }}>
            Pinterest x Apple Minimalism
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#4B5563', background: '#F9FAFB', padding: '6px 14px', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>
            <ShieldCheck size={14} color="var(--violet-primary)" />
            <span>Encrypted Secure Checkout</span>
          </div>

          <button 
            onClick={() => setActiveTab('agent')}
            className="btn-pill-primary"
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            <Zap size={15} />
            Ask AI Agent
          </button>
        </div>
      </header>
    </>
  );
}
