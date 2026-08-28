import React from 'react';
import { ArrowRight, Camera, Globe, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#1a1a1a',
      color: '#ffffff',
      marginLeft: '64px',
      padding: '64px 48px 32px 48px',
      borderTop: '1px solid #333333'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        marginBottom: '48px'
      }}>
        {/* Column 1: Shop */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Shop
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['New In', 'Women', 'Men', 'Home', 'Beauty', 'Sale'].map(item => (
              <li key={item}>
                <a href="#" style={{ color: '#9CA3AF', fontSize: '12px', textDecoration: 'none' }}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Help */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Help
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Shipping & Returns', 'FAQ', 'Track Order', 'Contact Us'].map(item => (
              <li key={item}>
                <a href="#" style={{ color: '#9CA3AF', fontSize: '12px', textDecoration: 'none' }}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Company */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Company
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['About', 'Careers', 'Press', 'Sustainability'].map(item => (
              <li key={item}>
                <a href="#" style={{ color: '#9CA3AF', fontSize: '12px', textDecoration: 'none' }}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Stay Connected */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Stay Connected
          </h4>
          <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '14px', lineHeight: 1.5 }}>
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                background: '#ffffff',
                border: '1px solid #333333',
                borderRadius: '9999px',
                padding: '10px 18px',
                fontSize: '12px',
                color: '#111827',
                outline: 'none',
                flex: 1
              }}
            />
            <button
              type="submit"
              style={{
                background: '#5433eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '10px 20px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Subscribe
            </button>
          </form>

          {/* Social Media Icons */}
          <div style={{ display: 'flex', gap: '16px', color: '#ffffff' }}>
            <Camera size={20} style={{ cursor: 'pointer' }} title="Instagram" />
            <Globe size={20} style={{ cursor: 'pointer' }} title="Website" />
            <Share2 size={20} style={{ cursor: 'pointer' }} title="Social" />
          </div>
        </div>
      </div>

      {/* Bottom Divider & Copyright */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        borderTop: '1px solid #333333',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
          © 2026 SHOP.AI. All rights reserved.
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '12px' }}>
          <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}
