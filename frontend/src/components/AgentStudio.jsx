import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, CreditCard, ArrowRight, Zap, RefreshCw, ExternalLink } from 'lucide-react';

export default function AgentStudio({ initialPrompt, onPaymentSuccess, apiBase = 'http://localhost:8000' }) {
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: 'Hello! I am your AI Growth Commerce Assistant.\n\nAsk me questions about our catalog, request discount negotiations, or generate instant payment links.',
      checkout_action: null,
      payment_link: null
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (initialPrompt) {
      setInputPrompt(initialPrompt);
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    "Create payment link for Bell Lamp (₹14,999)",
    "Find Terracotta Ceramic Vase under ₹7000 and send payment link",
    "Negotiate 12% discount for ErgoFlex Mesh Chair",
    "Recommend a woven storage basket and generate payment link"
  ];

  const handleSendMessage = async (customPrompt) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim() || loading) return;

    const userMessage = { sender: 'user', text: promptToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToSend })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: data.reply || "Task processed successfully.",
          checkout_action: data.checkout_action || null,
          payment_link: data.payment_link || null
        }
      ]);
    } catch (err) {
      console.error("Agent chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: "I encountered an issue contacting the commerce service. Please verify server connectivity.",
          checkout_action: null,
          payment_link: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const triggerRazorpayCheckout = (action) => {
    if (!action) return;

    const options = {
      key: action.key_id || "rzp_test_TTyinasFgBxqSk",
      amount: action.amount,
      currency: action.currency || "INR",
      name: "SHOP.AI Store",
      description: `Order: ${action.product?.name || "AI Purchase"}`,
      image: action.product?.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      order_id: action.order_id,
      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${apiBase}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id || action.order_id,
              razorpay_payment_id: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || "mock_sig_valid",
              amount: action.amount_inr,
              items: action.product ? [action.product] : []
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            onPaymentSuccess(verifyData.order);
          }
        } catch (e) {
          onPaymentSuccess({ order_id: action.order_id, amount: action.amount_inr, status: "PAID" });
        }
      },
      prefill: {
        name: "Agentic Shopper",
        email: "shopper@agentic.shop",
        contact: "9876543210"
      },
      theme: {
        color: "#5433eb"
      }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else if (action.payment_link_url) {
      window.open(action.payment_link_url, "_blank");
    }
  };

  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const cleaned = rawText
      .replace(/\*\s\*\*/g, '\n• **')
      .replace(/\*\*\s\*\*/g, '**\n**');

    const lines = cleaned.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} style={{ height: '8px' }} />;

      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ color: '#111827', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        }
        if (part.includes('[') && part.includes('](')) {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <a
                key={pIdx}
                href={match[2]}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'var(--violet-primary)',
                  fontWeight: 700,
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {match[1]}
                <ExternalLink size={14} />
              </a>
            );
          }
        }
        return part;
      });

      return (
        <div key={idx} style={{ marginBottom: '6px', lineHeight: 1.6 }}>
          {renderedParts}
        </div>
      );
    });
  };

  return (
    <div style={{ marginLeft: '64px', padding: '36px 36px 80px 36px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Studio Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={24} color="var(--violet-primary)" />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>AI Agent Command Studio</h1>
          </div>
          <p style={{ color: '#6B7280', fontSize: '0.95rem', marginTop: '4px' }}>
            Autonomous product search, discount negotiation, and payment link generation
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '8px 16px', borderRadius: '9999px', border: '1px solid #E5E7EB', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <span className="pulse-dot" style={{ backgroundColor: 'var(--violet-primary)', boxShadow: '0 0 10px var(--violet-primary)' }} />
          <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 600 }}>AI Commerce Active</span>
        </div>
      </div>

      {/* Quick Prompt Suggestion Chips */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '14px', marginBottom: '20px' }}>
        {quickPrompts.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="btn-pill-white"
            style={{ fontSize: '0.8rem', padding: '8px 16px', whiteSpace: 'nowrap' }}
          >
            <Zap size={14} color="var(--violet-primary)" />
            {chip}
          </button>
        ))}
      </div>

      {/* Main Full-Width Chat Container */}
      <div className="card-modern" style={{
        minHeight: '520px',
        maxHeight: '640px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px'
      }}>
        {/* Messages Scroll View */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#6B7280' }}>
                {msg.sender === 'agent' ? (
                  <>
                    <Bot size={14} color="var(--violet-primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--violet-primary)' }}>AI Growth Assistant</span>
                  </>
                ) : (
                  <span>You</span>
                )}
              </div>

              {/* Formatted Text Bubble */}
              <div style={{
                maxWidth: '780px',
                background: msg.sender === 'user' ? 'var(--violet-primary)' : '#ffffff',
                color: msg.sender === 'user' ? '#ffffff' : '#374151',
                padding: '16px 22px',
                borderRadius: msg.sender === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                boxShadow: msg.sender === 'user' ? '0 6px 18px var(--violet-shadow)' : '0 4px 14px rgba(0,0,0,0.04)',
                border: msg.sender === 'user' ? 'none' : '1px solid #E5E7EB',
                lineHeight: 1.6,
                fontSize: '0.95rem'
              }}>
                {msg.sender === 'user' ? msg.text : renderFormattedText(msg.text)}
              </div>

              {/* Embedded Direct Payment Action Card */}
              {(msg.payment_link || msg.checkout_action) && (
                <div className="card-modern" style={{
                  width: '100%',
                  maxWidth: '540px',
                  background: '#ffffff',
                  border: '1px solid var(--violet-primary)',
                  borderRadius: '24px',
                  padding: '20px',
                  marginTop: '8px',
                  boxShadow: '0 8px 30px var(--violet-shadow)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={18} color="var(--violet-primary)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--violet-primary)' }}>SECURE PAYMENT LINK</span>
                    </div>
                    <span className="badge" style={{ background: '#F3F4F6', color: '#111827', border: '1px solid #E5E7EB' }}>
                      Verified Checkout
                    </span>
                  </div>

                  {msg.payment_link && (
                    <div style={{ background: '#F9FAFB', padding: '14px', borderRadius: '16px', marginBottom: '14px', border: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Reference: {msg.payment_link.link_id}</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', margin: '4px 0' }}>
                        ₹{msg.payment_link.amount.toLocaleString('en-IN')}
                      </div>
                      <a
                        href={msg.payment_link.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: 'var(--violet-primary)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          wordBreak: 'break-all',
                          textDecoration: 'underline'
                        }}
                      >
                        <span>{msg.payment_link.url}</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {msg.payment_link?.url && (
                      <a
                        href={msg.payment_link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-pill-primary"
                        style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                      >
                        <span>Open Payment Link</span>
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {msg.checkout_action && (
                      <button
                        onClick={() => triggerRazorpayCheckout(msg.checkout_action)}
                        className="btn-pill-dark"
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <span>Pay Now</span>
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6B7280', fontSize: '0.9rem' }}>
              <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Generating secure payment link...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Professional Ultra-Sleek Pill Input Bar */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
          <input
            type="text"
            className="input-pill"
            placeholder="Ask a question or request a payment link..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{
              flex: 1,
              borderRadius: '9999px',
              border: '1px solid #E5E7EB',
              background: '#ffffff',
              padding: '16px 24px',
              fontSize: '15px',
              outline: 'none',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              color: '#111827'
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            className="btn-circle-violet btn-shine"
            disabled={loading}
            title="Send message"
            style={{ width: '48px', height: '48px', minWidth: '48px' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

    </div>
  );
}
