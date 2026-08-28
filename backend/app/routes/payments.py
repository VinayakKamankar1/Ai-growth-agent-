from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.config import RAZORPAY_KEY_ID
from app.services.razorpay_service import create_order, verify_signature
from app.db import save_order, ORDERS_DB

router = APIRouter(prefix="/api/payments", tags=["Payments"])

class CreateOrderRequest(BaseModel):
    amount: float # in INR
    receipt: Optional[str] = None
    items: Optional[List[Dict[str, Any]]] = None
    notes: Optional[Dict[str, Any]] = None

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    customer_info: Optional[Dict[str, Any]] = None
    items: Optional[List[Dict[str, Any]]] = None
    amount: float

@router.get("/config")
def get_payment_config():
    """
    Returns Razorpay public key ID for Checkout JS initialization.
    """
    return {
        "key_id": RAZORPAY_KEY_ID,
        "currency": "INR"
    }

@router.post("/create-order")
def api_create_order(payload: CreateOrderRequest):
    """
    Creates a Razorpay payment order.
    """
    try:
        result = create_order(
            amount_in_inr=payload.amount,
            receipt=payload.receipt,
            notes=payload.notes
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
def api_verify_payment(payload: VerifyPaymentRequest):
    """
    Verifies payment signature from Razorpay Checkout JS and persists order.
    """
    is_valid = verify_signature(
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        razorpay_signature=payload.razorpay_signature
    )
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid Razorpay payment signature verification failed.")
    
    # Save order to DB
    order_record = {
        "order_id": payload.razorpay_order_id,
        "payment_id": payload.razorpay_payment_id,
        "amount": payload.amount,
        "currency": "INR",
        "status": "PAID",
        "items": payload.items or [],
        "customer": payload.customer_info or {"name": "Customer", "email": "customer@agentic.shop"},
        "timestamp": payload.razorpay_order_id.split("_")[-1] if "_" in payload.razorpay_order_id else "1700000000"
    }
    
    saved = save_order(order_record)
    
    return {
        "success": True,
        "message": "Payment verified and order confirmed successfully!",
        "order": saved
    }

@router.get("/orders")
def get_all_orders():
    """
    Retrieve completed orders for Merchant Dashboard analytics.
    """
    return {
        "total_orders": len(ORDERS_DB),
        "total_revenue": sum(o.get("amount", 0) for o in ORDERS_DB),
        "orders": ORDERS_DB
    }
