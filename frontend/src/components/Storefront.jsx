import React, { useState } from 'react';
import { ArrowRight, Star, ShoppingBag, Zap, Search as SearchIcon, Heart, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck, Bot, Lock, Award, RefreshCw } from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";

export default function Storefront({ products, onAddToCart, onAgentBuy, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: "All", icon: "✨" },
    { name: "Interior & Home", icon: "🛋️" },
    { name: "Dairy & Groceries", icon: "🥛" },
    { name: "Electronics", icon: "⚡" },
    { name: "Fashion", icon: "👗" }
  ];

  // Strictly ONLY 4 Sections displayed on storefront homepage
  const sectionCategories = [
    { key: "Interior & Home", title: "Interior & Home Decor", subtitle: "Minimalist lamps, ceramic vases, furniture & jute textiles", icon: "🛋️" },
    { key: "Dairy & Groceries", title: "Dairy & Fresh Groceries", subtitle: "Farm-fresh organic milk, cheeses, honey & fresh pantry items", icon: "🥛" },
    { key: "Electronics", title: "Electronics & Smart Devices", subtitle: "ANC headphones, laptops, speakers & high-res displays", icon: "⚡" },
    { key: "Fashion", title: "Fashion & Apparel", subtitle: "Curated apparel, footwear, watches & luxury accessories", icon: "👗" }
  ];

  const sponsoredProducts = products.filter(p => 
    p.name.includes("Awesome Bell Lamp") || 
    p.name.includes("Organic Whole Milk") || 
    p.name.includes("Hand-Thrown Ceramic Vase") ||
    p.name.includes("Linen Throw Pillow")
  ).slice(0, 3);

  const floatingCards = [
    { title: "Awesome Bell Lamp", subtitle: "HK Living — Sand White", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80", price: "₹14,999" },
    { title: "Organic Whole Milk", subtitle: "Farm Fresh 100% Pure", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80", price: "₹95" },
    { title: "Terracotta Ceramic Vase", subtitle: "Hand-Thrown Stoneware", image: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=400&q=80", price: "₹6,499" },
    { title: "Linen Throw Pillow", subtitle: "Belgian Flax — Cream", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80", price: "₹3,299" }
  ];

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('search');
    }
  };

  const scrollTrack = (elementId, direction) => {
    const el = document.getElementById(elementId);
    if (el) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ marginLeft: '64px', padding: '0 36px 80px 36px' }}>
      
      {/* 1. MARKETING TICKER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '9999px',
        margin: '20px 0 28px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
          <Sparkles size={16} color="#F59E0B" className="pulse-glow" />
          <span>EXCLUSIVE OFFER: Save up to 15% instantly with AI Agent negotiation on all orders!</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '0.8rem', color: '#9CA3AF' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Truck size={14} color="#10B981" /> Free Express Delivery</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="#38BDF8" /> 100% Authentic Guarantee</span>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section style={{ padding: '20px 0 32px 0', textAlign: 'center' }}>
        
        {/* Floating Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', maxWidth: '1080px', margin: '0 auto 28px auto' }}>
          {floatingCards.map((card, idx) => (
            <div key={idx} className="floating-card">
              <img src={card.image} onError={handleImageError} alt={card.title} style={{ width: '60px', height: '60px', borderRadius: '16px', objectFit: 'cover', background: '#F3F4F6' }} />
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>{card.title}</h4>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px' }}>{card.subtitle}</p>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--violet-primary)', marginTop: '4px' }}>{card.price}</div>
              </div>
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
          Curated objects & <span style={{ color: 'var(--violet-primary)' }}>daily essentials</span>
        </h1>

        <form onSubmit={handleSearchSubmit} style={{ maxWidth: '640px', margin: '0 auto 24px auto' }}>
          <div className="search-pill-container">
            <SearchIcon size={20} color="#9CA3AF" />
            <input
              type="text"
              className="search-pill-input"
              placeholder="What are you shopping for today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-circle-violet btn-shine" title="Search">
              <ArrowRight size={20} />
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                if (cat.name !== 'All') {
                  setActiveTab('search');
                }
              }}
              className={`category-pill ${selectedCategory === cat.name ? 'btn-pill-active' : ''}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SPONSORED SPOTLIGHT */}
      {sponsoredProducts.length > 0 && (
        <section style={{ margin: '24px 0 40px 0' }}>
          <div className="card-modern" style={{
            background: 'linear-gradient(135deg, #5433eb 0%, #3b1fb5 100%)',
            borderRadius: '32px',
            padding: '36px',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="pulse-glow" style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  ⚡ SPONSORED SPOTLIGHT DEALS
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '10px' }}>Top Featured Picks of the Week</h2>
              </div>
              <button onClick={() => onAgentBuy("Negotiate deal for sponsored featured items")} className="btn-pill-dark btn-shine" style={{ background: '#ffffff', color: '#111827' }}>
                <Zap size={16} color="var(--violet-primary)" />
                Agent 1-Click Buy
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {sponsoredProducts.map(product => (
                <div key={product.id} className="card-modern card-bounce" style={{ padding: '16px', background: '#ffffff', color: '#111827' }}>
                  <div style={{ position: 'relative', width: '100%', height: '190px', borderRadius: '20px', overflow: 'hidden', marginBottom: '12px', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={product.image} onError={handleImageError} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} />
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--violet-primary)', color: '#FFF', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>
                      SPONSORED
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: '#111827' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--violet-primary)' }}>₹{product.price.toLocaleString('en-IN')}</span>
                    {product.original_price > product.price && (
                      <span style={{ fontSize: '0.85rem', color: '#9CA3AF', textDecoration: 'line-through' }}>₹{product.original_price.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  <button
                    onClick={() => onAgentBuy(`Buy ${product.name}`)}
                    className="btn-pill-primary btn-shine"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Zap size={16} /> Instant Agent Purchase
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. EXACTLY 4 CATEGORY SECTIONS WITH INTERSPERSED MARKETING CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', marginTop: '16px' }}>
        {sectionCategories.slice(0, 4).map((sec, sectionIndex) => {
          const categoryItems = products.filter(p => p.category.toLowerCase() === sec.key.toLowerCase());
          if (categoryItems.length === 0) return null;

          const curatedItems = categoryItems.slice(0, 10);
          const trackId = `track-${sec.key.replace(/\s+/g, '-').toLowerCase()}`;

          return (
            <React.Fragment key={sec.key}>
              {/* Product Section */}
              <section style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{sec.icon}</span>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>{sec.title}</h2>
                      <span style={{ fontSize: '0.78rem', color: '#6B7280', background: '#ffffff', border: '1px solid #E5E7EB', padding: '2px 10px', borderRadius: '9999px', fontWeight: 600 }}>
                        {curatedItems.length} items
                      </span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#6B7280', marginTop: '2px' }}>{sec.subtitle}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => scrollTrack(trackId, 'left')}
                      className="btn-circle-violet"
                      style={{ width: '40px', height: '40px', minWidth: '40px', background: '#ffffff', color: '#111827', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                      title="Scroll left"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => scrollTrack(trackId, 'right')}
                      className="btn-circle-violet"
                      style={{ width: '40px', height: '40px', minWidth: '40px', background: '#ffffff', color: '#111827', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                      title="Scroll right"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div id={trackId} className="horizontal-track">
                  {curatedItems.map(product => (
                    <div
                      key={product.id}
                      className="card-modern card-bounce horizontal-item"
                      style={{
                        minWidth: '270px',
                        maxWidth: '270px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ position: 'relative', width: '100%', height: '190px', borderRadius: '20px', overflow: 'hidden', marginBottom: '12px', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img 
                            src={product.image} 
                            onError={handleImageError} 
                            alt={product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                          />
                          <button style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: '#FFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
                            <Heart size={14} color="#6B7280" />
                          </button>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>{product.brand || product.category}</div>
                        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '4px 0 6px 0', color: '#111827', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px' }}>
                          {product.name}
                        </h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{product.price.toLocaleString('en-IN')}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.8rem', color: '#6B7280' }}>
                            <Star size={12} fill="#FBBF24" color="#FBBF24" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => onAddToCart(product)} className="btn-pill-white" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
                          <ShoppingBag size={14} /> Add
                        </button>
                        <button onClick={() => onAgentBuy(`Buy ${product.name}`)} className="btn-pill-primary" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
                          <Zap size={14} /> Agent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* INFORMATION BANNER 1: INSERTED AFTER EVERY 2 SECTIONS (After Section 2) */}
              {sectionIndex === 1 && (
                <div className="card-modern card-bounce" style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #F9FAFB 100%)',
                  padding: '36px',
                  borderRadius: '32px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
                  margin: '12px 0'
                }}>
                  <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 28px auto' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--violet-primary)', background: 'rgba(84, 51, 235, 0.1)', padding: '4px 14px', borderRadius: '9999px' }}>
                      WHY SHOP WITH SHOP.AI
                    </span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '8px', color: '#111827' }}>
                      Autonomous Commerce Built for Modern Shoppers
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(84, 51, 235, 0.12)', color: 'var(--violet-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '48px' }}>
                        <Bot size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Instant Price Negotiation</h4>
                        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '4px', lineHeight: 1.5 }}>
                          Our Gemini AI agent dynamically negotiates discounts up to 15% directly with live merchants.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '48px' }}>
                        <Truck size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Express 2-Day Dispatch</h4>
                        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '4px', lineHeight: 1.5 }}>
                          Free express shipping on all orders over ₹2,000 across 25,000+ pin codes nationwide.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.12)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '48px' }}>
                        <Lock size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Encrypted Razorpay Checkout</h4>
                        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '4px', lineHeight: 1.5 }}>
                          Instant 1-click Razorpay payment link generation for seamless 256-bit SSL transaction safety.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* INFORMATION BANNER 2: INSERTED AFTER SECTION 4 (Bottom Feature Banner) */}
              {sectionIndex === 3 && (
                <div className="card-modern card-bounce" style={{
                  background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
                  padding: '36px',
                  borderRadius: '32px',
                  color: '#ffffff',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
                  margin: '12px 0 20px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '24px'
                }}>
                  <div style={{ maxWidth: '520px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      AUTHENTICITY & SUSTAINABILITY GUARANTEE
                    </span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '8px' }}>
                      Direct Merchant Sourcing & Eco-Friendly Packaging
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#9CA3AF', marginTop: '8px', lineHeight: 1.6 }}>
                      Every item on SHOP.AI is sourced directly from verified manufacturers. Enjoy plastic-free packaging, carbon-neutral shipping, and 24/7 AI concierge support.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '16px 20px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
                      <Award size={24} color="#F59E0B" style={{ margin: '0 auto 6px auto' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Verified Quality</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '16px 20px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
                      <RefreshCw size={24} color="#10B981" style={{ margin: '0 auto 6px auto' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Instant Returns</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '16px 20px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
                      <ShieldCheck size={24} color="#38BDF8" style={{ margin: '0 auto 6px auto' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>24/7 Support</div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

    </div>
  );
}
