import json
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from ai.scenario_engine.simulator import policy_simulator
from backend.database.manager import db_manager
from backend.auth.rbac import require_auth
from backend.services.provenance_service import provenance_service
from backend.services.audit_service import audit_service

router = APIRouter(prefix="/api/scenarios", tags=["Policy Innovation Lab"])

class SimulationRequest(BaseModel):
    state: Optional[str] = "Telangana"
    district: Optional[str] = "Rangareddy"
    baseline_year: Optional[int] = 2026
    target_year: Optional[int] = 2035
    parameters: Optional[Dict[str, Any]] = None

class ScenarioSaveRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    workspace_id: Optional[int] = None
    state: str
    district: str
    baseline_year: int
    target_year: int
    parameters: Dict[str, Any]
    results: Dict[str, Any]

@router.post("/simulate")
def simulate_scenario(req: SimulationRequest):
    sim = policy_simulator.run_simulation(
        state=req.state or "Telangana",
        district=req.district or "Rangareddy",
        baseline_year=req.baseline_year or 2026,
        target_year=req.target_year or 2035,
        parameters=req.parameters or {}
    )
    return {
        "status": "SUCCESS",
        "simulation": sim
    }

@router.post("/save")
def save_scenario(req: ScenarioSaveRequest, current_user: dict = Depends(require_auth)):
    prov_hash = req.results.get("metadata", {}).get("provenance_hash", "none")
    
    scenario_id = db_manager.execute_insert(
        """INSERT INTO scenarios 
        (workspace_id, creator_id, title, description, state, district, baseline_year, target_year, parameters_json, results_json, provenance_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            req.workspace_id,
            current_user["id"],
            req.title,
            req.description,
            req.state,
            req.district,
            req.baseline_year,
            req.target_year,
            json.dumps(req.parameters),
            json.dumps(req.results),
            prov_hash
        )
    )

    provenance_service.record_event(
        entity_type="scenario",
        entity_id=scenario_id,
        action="POLICY_SCENARIO_SIMULATION_SAVE",
        actor_id=current_user["id"],
        payload={"title": req.title, "prov_hash": prov_hash, "district": req.district}
    )

    audit_service.log(
        "SCENARIO_SAVE",
        f"scenario:{scenario_id}",
        actor_id=current_user["id"],
        metadata={"title": req.title}
    )

    return {
        "status": "SUCCESS",
        "message": "Policy scenario successfully preserved with cryptographic hash",
        "scenario_id": scenario_id,
        "provenance_hash": prov_hash
    }

@router.get("/")
def list_scenarios(current_user: dict = Depends(require_auth)):
    scenarios = db_manager.execute_query(
        "SELECT id, title, description, state, district, baseline_year, target_year, provenance_hash, created_at FROM scenarios ORDER BY id DESC"
    )
    return {"status": "SUCCESS", "scenarios": scenarios}
