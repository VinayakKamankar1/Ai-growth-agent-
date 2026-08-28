import httpx
import asyncio
from typing import List, Dict, Any, Optional

USD_TO_INR = 85.0

CURATED_PRODUCTS = [
    # 🛋️ INTERIOR & HOME DECOR
    {
        "id": "prod_lamp_1",
        "name": "Awesome Bell Lamp — Sand White",
        "brand": "HK Living",
        "category": "Interior & Home",
        "subcategory": "Lighting",
        "price": 14999,
        "original_price": 18999,
        "description": "Minimalist bell-shaped pendant lamp with matte sand ceramic finish, warm ambient illumination, and braided textile cord.",
        "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        "stock": 18,
        "rating": 4.9,
        "tags": ["lighting", "lamp", "home", "minimalist", "bell lamp"]
    },
    {
        "id": "prod_vase_1",
        "name": "Hand-Thrown Ceramic Vase — Terracotta",
        "brand": "HK Living",
        "category": "Interior & Home",
        "subcategory": "Vases",
        "price": 6499,
        "original_price": 8999,
        "description": "Organic handcrafted terracotta ceramic vase with tactile stoneware glaze, ideal for dried botanicals.",
        "image": "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=800&q=80",
        "stock": 24,
        "rating": 4.8,
        "tags": ["ceramic vase", "vase", "terracotta", "decor", "home decor"]
    },
    {
        "id": "prod_pillow_1",
        "name": "Linen Throw Pillow — Cream & Ochre",
        "brand": "Ferm Living",
        "category": "Interior & Home",
        "subcategory": "Textiles",
        "price": 3299,
        "original_price": 4499,
        "description": "100% Belgian washed linen throw cushion with feather fill and hand-stitched detailing.",
        "image": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
        "stock": 35,
        "rating": 4.7,
        "tags": ["pillow", "linen", "textile", "cushion", "home decor"]
    },
    {
        "id": "prod_basket_1",
        "name": "Woven Storage Basket — Natural Jute",
        "brand": "Muuto",
        "category": "Interior & Home",
        "subcategory": "Baskets",
        "price": 2799,
        "original_price": 3999,
        "description": "Handwoven natural jute floor basket with sturdy carry handles for throws and magazine storage.",
        "image": "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
        "stock": 15,
        "rating": 4.9,
        "tags": ["basket", "jute", "storage", "woven", "home"]
    },
    
    # 🥛 GROCERIES & DAIRY
    {
        "id": "prod_dairy_1",
        "name": "Organic Whole Milk (1L)",
        "brand": "Amul Organic",
        "category": "Dairy & Groceries",
        "subcategory": "Dairy",
        "price": 95,
        "original_price": 110,
        "description": "Farm-fresh 100% pure organic whole milk pasteurized and unhomogenized.",
        "image": "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80",
        "stock": 50,
        "rating": 4.9,
        "tags": ["milk", "dairy", "organic", "grocery"]
    },
    {
        "id": "prod_dairy_2",
        "name": "Artisanal Aged Cheddar Cheese",
        "brand": "Amul Reserve",
        "category": "Dairy & Groceries",
        "subcategory": "Dairy",
        "price": 449,
        "original_price": 549,
        "description": "Sharp 12-month aged vintage cheddar block crafted from grass-fed cow milk.",
        "image": "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80",
        "stock": 30,
        "rating": 4.8,
        "tags": ["cheese", "cheddar", "dairy", "grocery"]
    }
]

DYNAMIC_CATALOG: List[Dict[str, Any]] = list(CURATED_PRODUCTS)
PRODUCTS_DB = DYNAMIC_CATALOG
ORDERS_DB: List[Dict[str, Any]] = []

def map_category(raw_cat: str) -> str:
    raw = raw_cat.lower()
    if "grocer" in raw or "food" in raw or "dairy" in raw or "fruit" in raw or "meat" in raw:
        return "Dairy & Groceries"
    elif any(k in raw for k in ["laptop", "smartphone", "mobile", "electronics", "audio", "camera"]):
        return "Electronics"
    elif any(k in raw for k in ["home", "furniture", "kitchen", "decor", "lighting"]):
        return "Interior & Home"
    elif any(k in raw for k in ["beauty", "fragrance", "skin", "cosmetics"]):
        return "Beauty & Fragrance"
    elif any(k in raw for k in ["shirt", "dress", "shoe", "watch", "bag", "jewel", "men", "women", "cloth", "fashion"]):
        return "Fashion"
    return "Electronics"

async def sync_external_products():
    """
    Fetches up to 100 products from DummyJSON (https://dummyjson.com/products?limit=100&skip=0)
    and 20 from Fake Store API, converting USD pricing to INR.
    """
    global DYNAMIC_CATALOG, PRODUCTS_DB
    fetched_products = []
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        # 1. Fetch 100 products from DummyJSON API
        try:
            dummy_res = await client.get("https://dummyjson.com/products?limit=100&skip=0")
            if dummy_res.status_code == 200:
                data = dummy_res.json().get("products", [])
                for item in data:
                    inr_price = int(float(item.get("price", 0)) * USD_TO_INR)
                    orig_price = int(inr_price * 1.3)
                    cat = map_category(item.get("category", ""))
                    fetched_products.append({
                        "id": f"dummy_{item['id']}",
                        "name": item.get("title", ""),
                        "brand": item.get("brand", "Global Brand"),
                        "category": cat,
                        "subcategory": item.get("category", ""),
                        "price": inr_price,
                        "original_price": orig_price,
                        "description": item.get("description", ""),
                        "image": item.get("thumbnail", item.get("images", [""])[0]),
                        "stock": item.get("stock", 15),
                        "rating": float(item.get("rating", 4.5)),
                        "tags": [cat.lower(), item.get("category", "").lower()]
                    })
        except Exception as e:
            print(f"DummyJSON API fetch note: {e}")

        # 2. Fetch 20 products from Fake Store API
        try:
            fakestore_res = await client.get("https://fakestoreapi.com/products?limit=20")
            if fakestore_res.status_code == 200:
                data = fakestore_res.json()
                for item in data:
                    inr_price = int(float(item.get("price", 0)) * USD_TO_INR)
                    orig_price = int(inr_price * 1.25)
                    cat = map_category(item.get("category", ""))
                    fetched_products.append({
                        "id": f"fakestore_{item['id']}",
                        "name": item.get("title", ""),
                        "brand": "FakeStore Collection",
                        "category": cat,
                        "subcategory": item.get("category", ""),
                        "price": inr_price,
                        "original_price": orig_price,
                        "description": item.get("description", ""),
                        "image": item.get("image", ""),
                        "stock": int(item.get("rating", {}).get("count", 20)),
                        "rating": float(item.get("rating", {}).get("rate", 4.5)),
                        "tags": [cat.lower(), item.get("category", "").lower()]
                    })
        except Exception as e:
            print(f"FakeStore API fetch note: {e}")

    if fetched_products:
        DYNAMIC_CATALOG = CURATED_PRODUCTS + fetched_products
        PRODUCTS_DB = DYNAMIC_CATALOG

def get_all_products(category: Optional[str] = None, query: Optional[str] = None, limit: Optional[int] = None, skip: int = 0) -> List[Dict[str, Any]]:
    results = DYNAMIC_CATALOG
    if category and category.lower() != "all":
        results = [
            p for p in results 
            if p["category"].lower() == category.lower() or p.get("subcategory", "").lower() == category.lower()
        ]
    if query:
        q = query.lower()
        results = [
            p for p in results 
            if q in p["name"].lower() 
            or q in p["description"].lower() 
            or q in p.get("brand", "").lower()
            or any(q in t.lower() for t in p.get("tags", []))
        ]
    
    if skip > 0:
        results = results[skip:]
    if limit and limit > 0:
        results = results[:limit]
        
    return results

def get_product_by_id(product_id: str) -> Optional[Dict[str, Any]]:
    for p in DYNAMIC_CATALOG:
        if p["id"] == product_id or p["id"] == f"dummy_{product_id}":
            return p
    return None

def save_order(order_data: Dict[str, Any]):
    ORDERS_DB.append(order_data)
    for item in order_data.get("items", []):
        p = get_product_by_id(item.get("id"))
        if p and p["stock"] >= item.get("quantity", 1):
            p["stock"] -= item.get("quantity", 1)
    return order_data
