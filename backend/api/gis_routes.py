import json
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Dict, Any
from backend.database.manager import db_manager
from gis.lulc.change_detection import lulc_engine
from gis.remote_sensing.spectral_pipeline import remote_sensing_pipeline

router = APIRouter(prefix="/api/gis", tags=["GIS & Remote Sensing Intelligence"])

class ChangeDetectionRequest(BaseModel):
    region: Optional[str] = "Telangana"
    year_from: Optional[int] = 2018
    year_to: Optional[int] = 2026

@router.get("/layers")
def list_gis_layers(
    layer_type: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    year: Optional[int] = Query(None)
):
    conditions = []
    params = []
    if layer_type:
        conditions.append("layer_type = ?")
        params.append(layer_type)
    if state:
        conditions.append("state = ?")
        params.append(state)
    if year:
        conditions.append("year = ?")
        params.append(year)
    
    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
    layers = db_manager.execute_query(
        f"SELECT id, layer_name, layer_type, state, district, year, created_at FROM gis_layers {where} ORDER BY id ASC",
        tuple(params)
    )
    return {"status": "SUCCESS", "count": len(layers), "layers": layers}

@router.get("/layers/{layer_id}/geojson")
def get_layer_geojson(layer_id: int):
    layer = db_manager.execute_one(
        "SELECT id, layer_name, layer_type, state, district, year, geojson_data FROM gis_layers WHERE id = ?",
        (layer_id,)
    )
    if not layer:
        raise HTTPException(status_code=404, detail="GIS layer not found")
    
    geojson = json.loads(layer["geojson_data"])
    return {
        "status": "SUCCESS",
        "layer_id": layer["id"],
        "layer_name": layer["layer_name"],
        "layer_type": layer["layer_type"],
        "year": layer["year"],
        "geojson": geojson
    }

@router.post("/change-detection")
def compute_lulc_change(req: ChangeDetectionRequest):
    result = lulc_engine.compute_change(
        region=req.region or "Telangana",
        year_from=req.year_from or 2018,
        year_to=req.year_to or 2026
    )
    return {
        "status": "SUCCESS",
        "data": result
    }

@router.get("/remote-sensing/acquisition")
def get_satellite_acquisition(region: str = Query("Telangana")):
    result = remote_sensing_pipeline.simulate_satellite_acquisition(region=region)
    return {
        "status": "SUCCESS",
        "data": result
    }
