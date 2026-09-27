from fastapi import APIRouter, Query
from typing import Optional
from ai.search.hybrid_index import search_index

router = APIRouter(prefix="/api/search", tags=["Hybrid Semantic Search"])

@router.get("/")
def search_repository(
    q: str = Query(..., description="Search query string"),
    category: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    top_k: int = Query(10, le=50)
):
    results = search_index.search(
        query=q,
        category=category,
        state=state,
        district=district,
        top_k=top_k
    )
    return {
        "status": "SUCCESS",
        "query": q,
        "total_matches": len(results),
        "results": results
    }
