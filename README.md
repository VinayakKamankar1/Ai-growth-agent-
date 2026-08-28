# SHOP.AI — Agentic Commerce Platform

> A modern, autonomous AI-powered e-commerce platform blending **Pinterest x Apple minimalism** with an interactive AI shopping concierge, live product negotiation, and instant 1-click payment link generation.

---

## 💡 About the Project

**SHOP.AI** is a next-generation autonomous e-commerce experience designed to bridge traditional browsing with AI-driven shopping assistance. 

Instead of searching manually through endless product pages, shoppers can interact directly with an intelligent AI Commerce Assistant to discover items, negotiate special prices, and complete transactions instantly.

---

## 🤖 What the AI Agent Does

The **AI Growth Commerce Assistant** acts as your personal autonomous shopper and sales concierge:

- **🔍 Smart Catalog Discovery**: Understands natural language requests (e.g. *"Find a terracotta ceramic vase under ₹7,000"*) and retrieves matching catalog items instantly.
- **🏷️ Autonomous Price Negotiation**: Dynamically evaluates product pricing and authorizes special agent discounts (up to 15% off) for shoppers.
- **💳 Instant Payment Generation**: Generates direct, secure payment links (`https://rzp.io/...`) embedded right inside the chat bubble for effortless 1-click checkout.
- **⚡ Direct Order Execution**: Communicates seamlessly with the merchant fulfillment service to process completed orders in real time.

---

## 🌟 Platform Highlights

- **🛍️ Curated Section-Wise Storefront**:
  Organized category carousels (*Interior & Home*, *Dairy & Fresh Groceries*, *Electronics*, *Fashion*) featuring 8–10 scrollable items per track, marketing banners, and sponsored deal spotlights.

- **🎨 Pinterest x Apple Minimalist Aesthetics**:
  Light canvas background (`#f2f4f5`), 28px rounded white cards, violet (`#5433eb`) accents, 9999px pill elements, and spring bounce physics animations.

- **📦 100+ Product Live Catalog**:
  Real-time synchronized product catalog spanning home decor, organic groceries, smart electronics, fashion apparel, and luxury accessories with INR (₹) pricing.

- **💳 Encrypted 1-Click Checkout**:
  Sleek two-column checkout modal featuring pill inputs (`9999px` radius), multi-tier shipping options, and instant payment verification.

- **📊 Merchant Analytics Hub**:
  Real-time merchant dashboard tracking sales metrics, total revenue, completed orders, and gateway connectivity.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS Design System, Lucide Icons
- **Backend**: Python 3.12, FastAPI, Uvicorn, HTTPX Async Client
- **Payments**: Razorpay Payment Link Gateway

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt

# Start backend server on port 8000
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser to launch the platform.
