from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from backend.services.report_service import report_service
from backend.auth.rbac import require_auth

router = APIRouter(prefix="/api/reports", tags=["Evidence Policy Reports"])

class GenerateReportRequest(BaseModel):
    region: Optional[str] = "Telangana (Hyderabad Peri-Urban)"
    topic: Optional[str] = "Agricultural Land Conversion & Peri-Urban Sprawl Mitigation"

@router.post("/generate")
def generate_report(req: GenerateReportRequest, current_user: dict = Depends(require_auth)):
    report = report_service.generate_policy_brief(
        region=req.region or "Telangana (Hyderabad Peri-Urban)",
        topic=req.topic or "Agricultural Land Conversion & Peri-Urban Sprawl Mitigation",
        author=f"{current_user['full_name']} ({current_user['organization'] or 'DoLR'})",
        actor_id=current_user["id"]
    )
    return {"status": "SUCCESS", "report": report}
