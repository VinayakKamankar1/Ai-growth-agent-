# SHOP.AI — Agentic Commerce Platform

> A modern, autonomous AI-powered e-commerce platform blending **Pinterest x Apple minimalism** with real-time product negotiations, 100+ live items, and encrypted Razorpay payment generation.

---

## 🌟 Key Features

- **🛍️ Curated Section-Wise Storefront**:
  Horizontal sliding product carousels organized by category (*Interior & Home*, *Dairy & Groceries*, *Electronics*, *Fashion*) with 8–10 items per track, marketing banners, and sponsored deal spotlights.

- **🤖 AI Agent Command Studio**:
  Autonomous assistant powered by Gemini AI (`gemini-3.6-flash`). Users can chat with the agent to search products, negotiate discounts (up to 15%), and generate instant Razorpay payment links (`https://rzp.io/...`).

- **📦 100+ Live Product Catalog**:
  Real-time asynchronous catalog sync powered by Fake Store API and DummyJSON (`https://dummyjson.com/products?limit=100&skip=0`) with prices converted to INR (₹).

- **💳 Encrypted Razorpay Checkout**:
  Sleek 60/40 two-column checkout modal featuring pill inputs (`9999px` radius), multi-tier shipping selection, and instant order verification.

- **📊 Merchant Analytics Hub**:
  Real-time merchant dashboard tracking completed sales, revenue metrics, conversion rates, and transaction settlement logs.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Vanilla CSS Design System, Lucide Icons |
| **Backend** | Python 3.12, FastAPI, Uvicorn, HTTPX Async Client |
| **AI Engine** | Google GenAI SDK (`gemini-3.6-flash`) |
| **Payments** | Razorpay Payment Gateway & Payment Links API |

---

## 🚀 Quick Start Guide

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt

# Start backend server on port 8000
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

The web dashboard will be live at `http://localhost:5173` and the backend API docs at `http://localhost:8000/docs`.

---

## 🔗 Key API Endpoints

- `GET /api/products?limit=100&skip=0` — Retrieve paginated catalog products
- `GET /api/products/search?q=laptop` — Search products by query keyword
- `GET /api/products/category/electronics` — Get items by category
- `POST /api/agent/chat` — Send user prompt to AI Growth Agent
- `POST /api/payments/create-order` — Create Razorpay order
