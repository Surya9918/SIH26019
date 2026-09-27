from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from ai.rag.pipeline import rag_pipeline

router = APIRouter(prefix="/api/rag", tags=["Grounded RAG Research Assistant"])

class RAGQueryRequest(BaseModel):
    query: str
    category: Optional[str] = None
    state: Optional[str] = None
    top_k: Optional[int] = 5

@router.post("/query")
def execute_rag(req: RAGQueryRequest):
    response = rag_pipeline.answer_query(
        query=req.query,
        category=req.category,
        state=req.state,
        top_k=req.top_k or 5
    )
    
    # Store cryptographic provenance of the AI claim synthesis
    if response.get("has_sufficient_evidence"):
        from backend.services.provenance_service import provenance_service
        import json
        
        # We record the exact claims generated from the retrieved citations
        provenance_service.record_event(
            action="AI_CLAIM_SYNTHESIS",
            entity_type="RAG_QUERY",
            entity_id=hash(req.query) % 10000000, # deterministic stub ID
            actor_id=1, # Default user (System/AI)
            payload={
                "query": req.query,
                "citations_used": [c["citation_id"] for c in response.get("citations", [])],
                "confidence_score": response.get("confidence_score")
            }
        )
        
    return {
        "status": "SUCCESS",
        "data": response
    }
