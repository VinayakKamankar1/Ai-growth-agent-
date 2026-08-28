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
                          │  (Up to 15% Off)     │       │  Payment Generation  │
                          └──────────────────────┘       └──────────────────────┘
                                                                  │
                                                                  ▼
                                                       ┌──────────────────────┐
                                                       │   1-Click Purchase   │
                                                       └──────────────────────┘
```

---

## 🌟 Key Platform Features

| Feature | Description |
| :--- | :--- |
| **🛋️ Curated Storefront** | 4 category sections (*Interior & Home*, *Dairy & Groceries*, *Electronics*, *Fashion*) with 8–10 scrollable items per track. |
| **🤖 AI Shopping Agent** | Autonomous product discovery, automated price negotiation, and payment link creation. |
| **💳 Razorpay Payment Links** | Instant checkout execution embedded directly in chat bubbles. |
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

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
