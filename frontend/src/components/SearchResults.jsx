import React, { useState } from 'react';
import { Search, X, Star, ShoppingBag, Zap, Heart } from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";

export default function SearchResults({ products, onAddToCart, onAgentBuy }) {
  const [query, setQuery] = useState(''); // Blank default search query
  const [selectedColor, setSelectedColor] = useState('All');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortOption, setSortOption] = useState('Featured');

  let filteredProducts = products.filter(p => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || 
                         p.name.toLowerCase().includes(q) || 
                         p.description.toLowerCase().includes(q) || 
                         (p.brand && p.brand.toLowerCase().includes(q)) ||
                         (p.category && p.category.toLowerCase().includes(q)) ||
                         (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
    const matchesPrice = p.price <= maxPrice;
    return matchesQuery && matchesPrice;
  });

  if (sortOption === 'PriceLow') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === 'PriceHigh') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortOption === 'Rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const colors = [
    { name: "All", color: "#111827" },
    { name: "White", color: "#FFFFFF", border: "#D1D5DB" },
    { name: "Terracotta", color: "#C05621" },
    { name: "Blue", color: "#2B6CB0" },
    { name: "Black", color: "#000000" }
  ];

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <div style={{ marginLeft: '64px', padding: '36px 36px 80px 36px' }}>
      
      {/* Search Bar - Blank by default */}
      <div style={{ maxWidth: '680px', margin: '0 auto 28px auto' }}>
        <div className="search-pill-container">
          <Search size={20} color="#9CA3AF" />
          <input
            type="text"
            className="search-pill-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalog (e.g. ceramic vase, laptop, dress)..."
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="btn-circle-violet"
              style={{ width: '36px', height: '36px', minWidth: '36px' }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Counter & Sort Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '1px solid #E5E7EB',
        paddingBottom: '16px'
      }}>
        <div style={{ fontSize: '0.95rem', color: '#6B7280' }}>
          <strong>{filteredProducts.length} results</strong> {query.trim() ? `for "${query}"` : 'in catalog'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>Sort:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #E5E7EB',
              borderRadius: '9999px',
              padding: '6px 16px',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Featured">Featured</option>
            <option value="PriceLow">Price: Low to High</option>
            <option value="PriceHigh">Price: High to Low</option>
            <option value="Rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Grid + Filter Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '28px' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '20px'
        }}>
          {filteredProducts.map(product => (
            <div key={product.id} className="card-modern card-bounce" style={{ padding: '16px' }}>
              <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '20px', overflow: 'hidden', marginBottom: '14px', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={product.image} 
                  onError={handleImageError} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                />
                <button style={{
                  position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: '#FFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}>
                  <Heart size={14} color="#6B7280" />
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>{product.brand || product.category}</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '4px 0 8px 0', color: '#111827', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px' }}>
                {product.name}
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{product.price.toLocaleString('en-IN')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.8rem', color: '#6B7280' }}>
                  <Star size={12} fill="#FBBF24" color="#FBBF24" />
                  <span>{product.rating}</span>
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

        {/* Filter Panel */}
        <aside className="card-modern" style={{ padding: '20px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }}>
            Filters
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
              Max Price: ₹{maxPrice.toLocaleString('en-IN')}
            </label>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--violet-primary)' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '10px' }}>
              Color
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {colors.map(c => (
                <div
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: c.color,
                    border: c.border ? `1px solid ${c.border}` : '1px solid transparent',
                    cursor: 'pointer',
                    boxShadow: selectedColor === c.name ? '0 0 0 2px var(--violet-primary)' : 'none'
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '10px' }}>
              Material
            </label>
            {["Ceramic", "Stoneware", "Porcelain", "Linen"].map(mat => (
              <label key={mat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#4B5563', marginBottom: '6px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--violet-primary)' }} />
                <span>{mat}</span>
              </label>
            ))}
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '10px' }}>
              Size
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {["S", "M", "L"].map(size => (
                <button
                  key={size}
                  className="btn-pill-white"
                  style={{ padding: '6px 14px', fontSize: '0.75rem', flex: 1, justifyContent: 'center' }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
