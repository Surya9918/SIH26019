from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from backend.services.workspace_service import workspace_service
from backend.auth.rbac import require_auth

router = APIRouter(prefix="/api/workspaces", tags=["Research Workspaces"])

class CreateWorkspaceRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    is_public: Optional[bool] = False

class AddItemRequest(BaseModel):
    item_type: str # document, dataset, query, scenario, note
    item_id: Optional[int] = 0
    notes: Optional[str] = ""
    item_data: Optional[Dict[str, Any]] = None

@router.post("/")
def create_workspace(req: CreateWorkspaceRequest, current_user: dict = Depends(require_auth)):
    res = workspace_service.create_workspace(
        name=req.name,
        description=req.description,
        owner_id=current_user["id"],
        is_public=req.is_public
    )
    return {"status": "SUCCESS", "workspace": res}

@router.get("/")
def list_workspaces(current_user: dict = Depends(require_auth)):
    workspaces = workspace_service.list_workspaces(user_id=current_user["id"])
    return {"status": "SUCCESS", "workspaces": workspaces}

@router.get("/{ws_id}")
def get_workspace(ws_id: int, current_user: dict = Depends(require_auth)):
    ws = workspace_service.get_workspace(ws_id, current_user["id"])
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return {"status": "SUCCESS", "workspace": ws}

@router.post("/{ws_id}/items")
def add_item_to_workspace(ws_id: int, req: AddItemRequest, current_user: dict = Depends(require_auth)):
    item_id = workspace_service.add_item(
        workspace_id=ws_id,
        item_type=req.item_type,
        item_id=req.item_id or 0,
        notes=req.notes,
        item_data=req.item_data
    )
    return {"status": "SUCCESS", "item_id": item_id}
