from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from ai.orchestrator.engine import ai_orchestrator

router = APIRouter(prefix="/api/ai", tags=["AI Orchestrator & Intelligence"])

class OrchestratorRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

@router.post("/orchestrate")
def orchestrate_query(req: OrchestratorRequest):
    result = ai_orchestrator.route_and_execute(query=req.query, context=req.context)
    return {
        "status": "SUCCESS",
        "data": result
    }
