import json
import re
from typing import List, Dict, Any, Optional
from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY
from app.db import get_all_products, get_product_by_id
from app.services.razorpay_service import create_payment_link, create_order, get_audit_trail

# Initialize Gemini Client with real API Key
genai_client = None
if GEMINI_API_KEY:
    try:
        genai_client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"Gemini client init warning: {e}")

SYSTEM_INSTRUCTION = """
You are Antigravity AI Growth Agent, an autonomous commerce assistant.
You answer user queries accurately based on store catalog data, negotiate dynamic discounts, and generate live Razorpay payment links.

CRITICAL FORMATTING RULES:
1. Always format your responses with clean line breaks and bullet points. Never compress paragraphs onto a single line.
2. Use this structured layout when recommending or detailing products:

**[Product Name]**

• **Original Price:** ₹[Original Price]
• **Negotiated Price:** ₹[Final Price] ([Discount]% discount applied)
• **Key Features:** [Product Description]

3. Be polite, concise, and direct.
"""

def execute_agent_task(prompt: str, conversation_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
    steps = []
    steps.append({"type": "thought", "content": f"Analyzing request: '{prompt}'"})
    
    prompt_lower = prompt.lower()
    
    # Tool 1: Catalog Search
    steps.append({"type": "tool_call", "name": "search_catalog", "args": {"query": prompt}})
    
    query_term = None
    if "headphone" in prompt_lower or "audio" in prompt_lower:
        query_term = "audio"
    elif "watch" in prompt_lower or "smartwatch" in prompt_lower:
        query_term = "wearable"
    elif "keyboard" in prompt_lower:
        query_term = "keyboard"
    elif "light" in prompt_lower or "lamp" in prompt_lower:
        query_term = "lighting"
    elif "vase" in prompt_lower:
        query_term = "vases"
    elif "speaker" in prompt_lower:
        query_term = "speaker"
    elif "chair" in prompt_lower:
        query_term = "chair"

    matching_products = get_all_products(query=query_term or prompt)
    if not matching_products:
        matching_products = get_all_products()

    # Price bound filter
    price_match = re.search(r'(under|below|less than|<|budget of)?\s*₹?\s*(\d{3,6})', prompt_lower)
    if price_match:
        try:
            max_price = float(price_match.group(2))
            matching_products = [p for p in matching_products if p["price"] <= max_price]
        except ValueError:
            pass

    steps.append({
        "type": "tool_result", 
        "name": "search_catalog", 
        "result": f"Retrieved {len(matching_products)} relevant item(s)."
    })

    # Discount Negotiation
    discount_applied = 0.0
    if any(k in prompt_lower for k in ["negotiate", "discount", "best price", "offer", "cheap"]):
        discount_applied = 12.0
        steps.append({
            "type": "tool_call",
            "name": "apply_agent_discount",
            "args": {"discount_percentage": discount_applied}
        })
        steps.append({
            "type": "tool_result",
            "name": "apply_agent_discount",
            "result": f"Authorized {discount_applied}% agent discount."
        })

    # Create Payment Link or Order via Razorpay API
    payment_link_result = None
    checkout_action = None
    
    if any(k in prompt_lower for k in ["buy", "checkout", "order", "purchase", "pay", "link"]):
        target_product = matching_products[0] if matching_products else get_all_products()[0]
        final_price = target_product["price"] * (1.0 - (discount_applied / 100.0))
        
        # Call real Razorpay payment_link API
        steps.append({
            "type": "tool_call",
            "name": "create_payment_link",
            "args": {"amount_inr": final_price, "description": target_product["name"]}
        })
        
        link_res = create_payment_link(
            amount_in_inr=final_price,
            description=f"Purchase: {target_product['name']}",
            customer_email="customer@agentic.shop",
            customer_phone="+919876543210"
        )
        
        payment_link_result = link_res
        
        steps.append({
            "type": "tool_result",
            "name": "create_payment_link",
            "result": f"Razorpay Payment Link Generated: {link_res['url']}"
        })

        rp_order = create_order(
            amount_in_inr=final_price,
            notes={"product": target_product["name"], "link_id": link_res["link_id"]}
        )
        
        checkout_action = {
            "order_id": rp_order["order_id"],
            "amount": rp_order["amount"],
            "amount_inr": final_price,
            "currency": "INR",
            "key_id": rp_order["key_id"],
            "product": target_product,
            "discount_applied": discount_applied,
            "payment_link_url": link_res["url"]
        }

    # Gemini LLM Response Generation using gemini-3.6-flash / gemini-1.5-flash
    reply_text = ""
    if genai_client:
        for model_candidate in ['gemini-3.6-flash', 'gemini-1.5-flash', 'gemini-2.0-flash']:
            try:
                target_prod = matching_products[0] if matching_products else get_all_products()[0]
                final_p = target_prod["price"] * (1.0 - (discount_applied / 100.0))
                
                catalog_summary = f"Name: {target_prod['name']}\nOriginal Price: ₹{target_prod['original_price']}\nCatalog Price: ₹{target_prod['price']}\nFinal Price: ₹{final_p:.2f}\nDiscount: {discount_applied}%\nDescription: {target_prod['description']}"
                link_info = f"Payment Link URL: {payment_link_result['url']}" if payment_link_result else ""
                
                prompt_context = f"User Request: {prompt}\nTarget Product:\n{catalog_summary}\n{link_info}\nFormat the response strictly with clear bullet points and line breaks."
                
                response = genai_client.models.generate_content(
                    model=model_candidate,
                    contents=prompt_context,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_INSTRUCTION,
                        temperature=0.7,
                    )
                )
                if response and response.text:
                    reply_text = response.text
                    break
            except Exception as e:
                print(f"Gemini API note ({model_candidate}): {e}")

    if not reply_text:
        target_prod = matching_products[0] if matching_products else get_all_products()[0]
        final_p = target_prod["price"] * (1.0 - (discount_applied / 100.0))
        disc_str = f" ({discount_applied}% special agent discount applied)" if discount_applied > 0 else ""
        
        reply_text = (
            f"**{target_prod['name']}**\n\n"
            f"• **Original Price:** ₹{target_prod['original_price']:,}\n"
            f"• **Negotiated Best Price:** ₹{final_p:,.2f}{disc_str}\n"
            f"• **Product Details:** {target_prod['description']}\n\n"
        )
        if payment_link_result:
            reply_text += f"👉 **[Proceed to Checkout via Razorpay]({payment_link_result['url']})**"

    return {
        "reply": reply_text,
        "reasoning_steps": steps,
        "products": matching_products,
        "payment_link": payment_link_result,
        "checkout_action": checkout_action
    }
