import re
from typing import Dict, Any

class AIGISAgent:
    """
    Translates natural language spatial queries into structured GIS layer operations,
    bounding boxes, and map state changes.
    """

    def process_command(self, user_prompt: str) -> Dict[str, Any]:
        text = user_prompt.lower()
        
        # 1. Identify Target Region
        from backend.database.manager import db_manager
        import json

        # Dynamic lookup from GIS layers
        db_layers = db_manager.execute_query("SELECT DISTINCT district, state, geojson_data FROM gis_layers")
        matched_region = None
        target_coords = None

        for layer in db_layers:
            dist_lower = layer["district"].lower()
            if dist_lower != "all" and dist_lower in text:
                matched_region = layer["district"]
                target_coords = {"lat": 17.3850, "lon": 78.4867, "zoom": 11, "state": layer["state"]} # Centroid should be computed from geojson_data
                # Compute centroid roughly
                try:
                    data = json.loads(layer["geojson_data"])
                    coords = data["features"][0]["geometry"]["coordinates"][0][0]
                    target_coords["lon"], target_coords["lat"] = coords[0], coords[1]
                except (KeyError, IndexError, json.JSONDecodeError):
                    pass
                break
            elif layer["state"].lower() in text:
                matched_region = layer["state"]
                target_coords = {"lat": 17.8749, "lon": 78.1008, "zoom": 8, "state": layer["state"]}
                break

        if not matched_region:
            return {
                "status": "unavailable",
                "reason": "region_not_found",
                "message": "Could not identify a valid spatial region from the query. Please mention a known state or district."
            }

        # 2. Identify Intent & Active Layers
        active_layers = []
        action = "NAVIGATE"
        explanation = f"Navigating GIS viewport to {matched_region.title()}."

        if "agriculture" in text or "crop" in text or "farming" in text:
            active_layers.append("lulc_agriculture")
            action = "FILTER_LAYER"
            explanation = f"Displaying prime agricultural land parcels and cropping zones across {matched_region.title()}."
        
        if "urban" in text or "built-up" in text or "expansion" in text or "sprawl" in text:
            active_layers.append("lulc_builtup")
            action = "HIGHLIGHT_CHANGE"
            explanation = f"Highlighting rapid built-up expansion zones and peri-urban growth corridors in {matched_region.title()}."

        if "forest" in text or "tree" in text or "conservation" in text:
            active_layers.append("lulc_forest")
            action = "FILTER_LAYER"
            explanation = f"Displaying designated forest reserves and green cover corridors in {matched_region.title()}."

        if "change" in text or "compare" in text or "2018" in text or "historical" in text:
            active_layers.extend(["lulc_2018", "lulc_2026", "change_hotspots"])
            action = "TEMPORAL_COMPARISON"
            explanation = f"Initiating multi-temporal LULC change detection overlay (2018 vs 2026) for {matched_region.title()}."

        if not active_layers:
            active_layers = ["administrative_boundary", "lulc_composite"]

        return {
            "status": "SUCCESS",
            "action": action,
            "region": matched_region.title(),
            "target_viewport": target_coords,
            "activated_layers": active_layers,
            "explanation": explanation,
            "spatial_predicate": {
                "state": target_coords["state"],
                "district": matched_region.title() if matched_region != "telangana" else "All"
            }
        }

ai_gis_agent = AIGISAgent()
