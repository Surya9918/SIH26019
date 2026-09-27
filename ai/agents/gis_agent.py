import re
from typing import Dict, Any

class AIGISAgent:
    """
    Translates natural language spatial queries into structured GIS layer operations,
    bounding boxes, and map state changes.
    """

    REGIONS = {
        "hyderabad": {"lat": 17.3850, "lon": 78.4867, "zoom": 11, "state": "Telangana"},
        "telangana": {"lat": 17.8749, "lon": 78.1008, "zoom": 8, "state": "Telangana"},
        "andhra pradesh": {"lat": 15.9129, "lon": 79.7400, "zoom": 7, "state": "Andhra Pradesh"},
        "visakhapatnam": {"lat": 17.6868, "lon": 83.2185, "zoom": 11, "state": "Andhra Pradesh"},
        "rangareddy": {"lat": 17.3000, "lon": 78.3500, "zoom": 10, "state": "Telangana"},
        "medchal": {"lat": 17.6200, "lon": 78.4800, "zoom": 11, "state": "Telangana"},
        "warangal": {"lat": 17.9689, "lon": 79.5941, "zoom": 11, "state": "Telangana"},
        "bengaluru": {"lat": 12.9716, "lon": 77.5946, "zoom": 11, "state": "Karnataka"},
        "india": {"lat": 21.7679, "lon": 78.8718, "zoom": 5, "state": "National"}
    }

    def process_command(self, user_prompt: str) -> Dict[str, Any]:
        text = user_prompt.lower()
        
        # 1. Identify Target Region
        matched_region = "telangana"
        for region_key in self.REGIONS:
            if region_key in text:
                matched_region = region_key
                break
        
        target_coords = self.REGIONS[matched_region]

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
