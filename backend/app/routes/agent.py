from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.services.agent_service import execute_agent_task
from app.services.razorpay_service import create_payment_link, get_audit_trail

router = APIRouter(prefix="/api/agent", tags=["Autonomous AI Agent"])

class AgentChatRequest(BaseModel):
    prompt: str
    conversation_history: Optional[List[Dict[str, str]]] = None

class CreatePaymentLinkRequest(BaseModel):
    amount: float # in INR
    description: Optional[str] = "AI Agent Purchase"
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None

@router.post("/chat")
def chat_with_agent(payload: AgentChatRequest):
    """
    Executes autonomous AI agent workflow based on user prompt.
    """
    if not payload.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
        
    result = execute_agent_task(
        prompt=payload.prompt,
        conversation_history=payload.conversation_history
    )
    return result

@router.post("/payment-link")
def api_create_payment_link(payload: CreatePaymentLinkRequest):
    """
    Directly creates a Razorpay payment link and logs to audit trail.
    """
    try:
        res = create_payment_link(
            amount_in_inr=payload.amount,
            description=payload.description,
            customer_phone=payload.customer_phone,
            customer_email=payload.customer_email
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/audit-log")
def get_agent_audit_log():
    """
    Returns the real-time audit log of all payment links and orders created by the agent.
    """
    return {
        "total_entries": len(get_audit_trail()),
        "audit_log": get_audit_trail()
    }
