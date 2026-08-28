import sys
import asyncio
import os
from datetime import datetime, timezone
import razorpay
from dotenv import load_dotenv

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

env_path = os.path.join(os.path.dirname(__file__), "backend", ".env")
if not os.path.exists(env_path):
    env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_TTyinasFgBxqSk")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "cfqfAtR6OplDy0M3Qq7W3EC9")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

audit_log = []

async def create_payment_link(
    amount: int,
    currency: str = "INR",
    description: str = "",
    customer_phone: str = None,
    customer_email: str = None
):
    data = {
        "amount": amount,
        "currency": currency,
        "description": description,
        "notify": {
            "sms": customer_phone is not None,
            "email": customer_email is not None
        }
    }
    
    if customer_phone or customer_email:
        data["customer"] = {}
        if customer_phone:
            data["customer"]["contact"] = customer_phone
        if customer_email:
            data["customer"]["email"] = customer_email
    
    link = client.payment_link.create(data)
    
    audit_entry = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'action': 'create_payment_link',
        'link_id': link['id'],
        'url': link['short_url'],
        'amount': link['amount'],
        'status': link.get('status', 'created')
    }
    audit_log.append(audit_entry)
    
    return {
        "link_id": link["id"],
        "url": link["short_url"],
        "amount": link["amount"],
        "currency": link["currency"],
        "status": link.get("status", "created")
    }

async def main():
    print("AI Growth Agent - Razorpay API Active")
    print("=" * 50)
    print(f"Key ID: {RAZORPAY_KEY_ID}")
    
    print("\nTask: Create payment link for Premium Widget (₹2,499)")
    
    result = await create_payment_link(
        amount=249900,
        currency="INR",
        description="Premium Widget Purchase",
        customer_phone="+919876543210",
        customer_email="customer@example.com"
    )
    
    print("\nLive Payment Link Created!")
    print(f"Link ID: {result['link_id']}")
    print(f"URL: {result['url']}")
    print(f"Amount: ₹{result['amount'] / 100}")
    print(f"Status: {result['status']}")
    
    print("\nAUDIT TRAIL:")
    print("-" * 50)
    for entry in audit_log:
        print(f"{entry['timestamp']}: {entry['action']} - {entry['status']}")
        print(f"  Link: {entry['url']}")
        print(f"  Amount: ₹{entry['amount'] / 100}")

if __name__ == "__main__":
    asyncio.run(main())
