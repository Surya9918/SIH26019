import os
import sys
import json
import requests
from typing import Dict, Any

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database.manager import db_manager

def ingest_gis_layer(source_url_or_path: str, layer_name: str, layer_type: str, state: str, district: str, year: int):
    print(f"Ingesting GIS layer from: {source_url_or_path}")
    
    geojson_data = None
    try:
        if source_url_or_path.startswith("http://") or source_url_or_path.startswith("https://"):
            response = requests.get(source_url_or_path)
            response.raise_for_status()
            geojson_data = response.json()
        else:
            with open(source_url_or_path, 'r', encoding='utf-8') as f:
                geojson_data = json.load(f)
    except Exception as e:
        print(f"Failed to load GIS data: {e}")
        return False
        
    if not geojson_data or geojson_data.get("type") != "FeatureCollection":
        print("Validation failed: Invalid GeoJSON format. Expected FeatureCollection.")
        return False
        
    # Ingestion
    db_manager.execute_insert(
        "INSERT INTO gis_layers (layer_name, layer_type, state, district, year, geojson_data) VALUES (?, ?, ?, ?, ?, ?)",
        (layer_name, layer_type, state, district, year, json.dumps(geojson_data))
    )
    print(f"Successfully ingested GIS layer '{layer_name}'.")
    return True

if __name__ == "__main__":
    # Example usage: python scripts/ingest_gis_layers.py <path_to_geojson> "LULC 2026" "lulc" "Telangana" "All" 2026
    if len(sys.argv) < 7:
        print("Usage: python scripts/ingest_gis_layers.py <source_path> <name> <type> <state> <district> <year>")
        sys.exit(1)
        
    target = sys.argv[1]
    name = sys.argv[2]
    layer_type = sys.argv[3]
    state = sys.argv[4]
    district = sys.argv[5]
    year = int(sys.argv[6])
    
    ingest_gis_layer(target, name, layer_type, state, district, year)
