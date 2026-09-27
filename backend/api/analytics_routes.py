from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, List
from backend.services.analytics_service import analytics_service

router = APIRouter(prefix="/api/analytics", tags=["Socioeconomic & Land Analytics"])

class CompareDistrictsRequest(BaseModel):
    districts: List[str]
    state: Optional[str] = "Telangana"

@router.get("/indicators")
def get_indicators(state: Optional[str] = Query(None)):
    records = analytics_service.list_district_indicators(state=state)
    return {"status": "SUCCESS", "count": len(records), "data": records}

@router.get("/profile")
def get_profile(district: str = Query(...), state: str = Query("Telangana")):
    profile = analytics_service.get_district_profile(state=state, district=district)
    return {"status": "SUCCESS", "profile": profile}

@router.get("/correlations")
def get_correlations(state: str = Query("Telangana")):
    corr = analytics_service.calculate_correlations(state=state)
    return {"status": "SUCCESS", "correlations": corr}

@router.post("/compare")
def compare_districts(req: CompareDistrictsRequest):
    comp = analytics_service.compare_districts(districts=req.districts, state=req.state or "Telangana")
    return {"status": "SUCCESS", "comparison": comp}
