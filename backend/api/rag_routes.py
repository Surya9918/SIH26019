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
    return {
        "status": "SUCCESS",
        "data": response
    }
