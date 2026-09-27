from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from backend.services.dataset_service import dataset_service
from backend.auth.rbac import require_roles

router = APIRouter(prefix="/api/datasets", tags=["Data Catalog"])

class DatasetCreateRequest(BaseModel):
    name: str
    description: str
    source: str
    geographic_coverage: str
    temporal_coverage: str
    format: str
    size_bytes: Optional[int] = 1048576
    update_frequency: Optional[str] = "Annual"
    metadata: Optional[Dict[str, Any]] = None

@router.get("/")
def list_datasets(coverage: Optional[str] = Query(None), format_type: Optional[str] = Query(None)):
    datasets = dataset_service.list_datasets(coverage=coverage, format_type=format_type)
    return {"status": "SUCCESS", "count": len(datasets), "datasets": datasets}

@router.get("/{dataset_id}")
def get_dataset(dataset_id: int):
    ds = dataset_service.get_dataset(dataset_id)
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {"status": "SUCCESS", "dataset": ds}

@router.post("/")
def register_dataset(
    req: DatasetCreateRequest,
    current_user: dict = Depends(require_roles(["Administrator", "Data Manager", "Government Official"]))
):
    ds = dataset_service.add_dataset(
        name=req.name,
        description=req.description,
        source=req.source,
        geographic_coverage=req.geographic_coverage,
        temporal_coverage=req.temporal_coverage,
        format_type=req.format,
        size_bytes=req.size_bytes or 1048576,
        update_frequency=req.update_frequency or "Annual",
        metadata=req.metadata,
        actor_id=current_user["id"]
    )
    return {"status": "SUCCESS", "data": ds}
