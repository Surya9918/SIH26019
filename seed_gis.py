import json
import os
from backend.database.manager import db_manager

def seed():
    # Load india states
    frontend_path = os.path.join(os.path.dirname(__file__), "frontend", "src", "assets", "india_states.json")
    if not os.path.exists(frontend_path):
        print("Could not find india_states.json")
        return

    with open(frontend_path, "r", encoding="utf-8") as f:
        geojson = json.load(f)

    # Just take first feature for a test layer
    first_feature = geojson.get("features", [])[0]
    
    first_feature["properties"]["Risk Level"] = "High"
    first_feature["properties"]["Dispute Count"] = 12

    layer_geojson = {
        "type": "FeatureCollection",
        "features": [first_feature]
    }

    db_manager.execute_insert(
        "INSERT INTO gis_layers (layer_name, layer_type, state, year, geojson_data, metadata_json) VALUES (?, ?, ?, ?, ?, ?)",
        ("Test Climate Risk Layer", "Climate Risk", "Test State", 2026, json.dumps(layer_geojson), json.dumps({"description": "Climate risk analysis test layer."}))
    )
    print("Inserted dummy GIS layer!")

if __name__ == "__main__":
    seed()
