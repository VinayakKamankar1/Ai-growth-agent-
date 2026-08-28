from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.products import router as products_router
from app.routes.payments import router as payments_router
from app.routes.agent import router as agent_router
from app.config import PORT, HOST
from app.db import sync_external_products

app = FastAPI(
    title="Agentic Commerce Platform API",
    description="Autonomous AI Agent & Razorpay Payment Service with Live FakeStoreAPI & DummyJSON Catalog Sync",
    version="2.0.0"
)

# Enable CORS for frontend web application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    print("[INIT] Syncing external products from FakeStoreAPI and DummyJSON...")
    await sync_external_products()
    print("[INIT] Live Catalog Sync Complete!")

# Mount APIRouters
app.include_router(products_router)
app.include_router(payments_router)
app.include_router(agent_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Agentic Commerce Platform API",
        "docs_url": "/docs",
        "endpoints": {
            "products": "/api/products",
            "payments": "/api/payments/create-order",
            "agent": "/api/agent/chat"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
