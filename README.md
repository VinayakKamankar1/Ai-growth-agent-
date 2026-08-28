# SHOP.AI — Agentic Commerce Platform

> Autonomous e-commerce platform blending **Pinterest x Apple minimalism** with an AI shopping agent, live price negotiations, and 1-click Razorpay payment link generation.

---

## 🤖 AI Agent Workflow Architecture

```text
 ┌────────────────┐       ┌────────────────────────┐       ┌──────────────────────┐
 │  User Request  │ ───►  │   AI Commerce Agent    │ ───►  │ Live Product Search  │
 └────────────────┘       └────────────────────────┘       └──────────────────────┘
                                      │                               │
                                      ▼                               ▼
                          ┌──────────────────────┐       ┌──────────────────────┐
                          │  Dynamic Negotiation │ ───►  │ Razorpay Payment Link│
                          │  (Up to 15% Off)     │       │ (https://rzp.io/...) │
                          └──────────────────────┘       └──────────────────────┘
                                                                  │
                                                                  ▼
                                                       ┌──────────────────────┐
                                                       │   1-Click Purchase   │
                                                       └──────────────────────┘
```

---

## ⚡ Practical Agent Workflows & Examples

### 1. Product Search & Discount Negotiation
**User Prompt:**
> *"Find Awesome Bell Lamp — Sand White and negotiate the best price."*

**AI Agent Response:**
```text
**Awesome Bell Lamp — Sand White**

• Original Price: ₹18,999
• Negotiated Price: ₹14,999 (15% discount applied)
• Features: Minimalist bell-shaped pendant lamp with matte sand ceramic finish.

👉 Proceed to Checkout: https://rzp.io/rzp/VwoIDsD6
```

### 2. Standalone Agent CLI Execution
```bash
python agent.py
```
**Terminal Output:**
```text
AI Growth Agent - Razorpay Active
==================================================
Task: Create payment link for Premium Widget (₹2,499)

Live Payment Link Created!
Link ID: plink_TV8y6pRbAIAoZy
URL: https://rzp.io/rzp/VwoIDsD6
Amount: ₹2499.0
Status: created
```

---

## 🌟 Key Platform Features

| Feature | Description |
| :--- | :--- |
| **🛋️ Curated Storefront** | 4 category sections (*Interior & Home*, *Dairy & Groceries*, *Electronics*, *Fashion*) with 8–10 scrollable items per track. |
| **🤖 AI Shopping Agent** | Autonomous search, automated price negotiation, and direct payment link creation. |
| **💳 Razorpay Payment Links** | 1-click checkout execution embedded directly in chat bubbles. |
| **📦 100+ Live Products** | Asynchronous catalog synchronization with real-time INR (₹) prices. |
| **📊 Merchant Analytics** | Real-time transaction monitoring, order history, and revenue metrics. |

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Vanilla CSS Design System, Lucide Icons |
| **Backend** | Python 3.12, FastAPI, Uvicorn, HTTPX Async Client |
| **Payments** | Razorpay Payment Gateway & Payment Links API |

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` to launch the web dashboard.
