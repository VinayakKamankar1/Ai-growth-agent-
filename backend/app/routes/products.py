from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict, Any
from app.db import get_all_products, get_product_by_id, DYNAMIC_CATALOG

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[Dict[str, Any]])
def list_products(
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    limit: Optional[int] = Query(None),
    skip: int = Query(0)
):
    """
    List catalog products with pagination (limit & skip), category filtering, or search.
    """
    return get_all_products(category=category, query=q, limit=limit, skip=skip)

@router.get("/search")
def search_products(q: str = Query(""), limit: Optional[int] = Query(None)):
    """
    Search products matching query string.
    """
    results = get_all_products(query=q, limit=limit)
    return {
        "products": results,
        "total": len(results),
        "query": q
    }

@router.get("/category/{category_name}")
def get_products_by_category(category_name: str, limit: Optional[int] = Query(None)):
    """
    Get products belonging to a specific category.
    """
    results = get_all_products(category=category_name, limit=limit)
    return {
        "products": results,
        "total": len(results),
        "category": category_name
    }

@router.get("/{product_id}")
def get_product(product_id: str):
    """
    Get single product by ID.
    """
    product = get_product_by_id(product_id)
    if not product:
        # Fallback search if integer ID passed
        for p in DYNAMIC_CATALOG:
            if p["id"].endswith(f"_{product_id}"):
                return p
        raise HTTPException(status_code=404, detail="Product not found")
    return product
