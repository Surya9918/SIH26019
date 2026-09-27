import os
import sys
import pandas as pd
from typing import Optional

# Add the project root to sys.path to allow imports from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database.manager import db_manager

def ingest_socioeconomic_data(source_url_or_path: str):
    print(f"Ingesting socioeconomic data from: {source_url_or_path}")
    try:
        # pd.read_csv handles both local files and http/https URLs natively
        df = pd.read_csv(source_url_or_path)
    except Exception as e:
        print(f"Failed to load dataset: {e}")
        return False
        
    required_cols = [
        "state", "district", "year", "population", "urban_pop_pct", 
        "literacy_rate", "agri_workers_pct", "forest_cover_sqkm", 
        "crop_intensity_pct", "avg_landholding_ha", "industrial_units"
    ]
    
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        print(f"Validation failed: missing required columns {missing}")
        return False
        
    # Validation and Normalization
    df = df.dropna(subset=["state", "district", "year"])
    
    records = df.to_dict(orient="records")
    for r in records:
        db_manager.execute_insert(
            """INSERT OR REPLACE INTO socioeconomic_indicators 
            (state, district, year, population, urban_pop_pct, literacy_rate, agri_workers_pct, forest_cover_sqkm, crop_intensity_pct, avg_landholding_ha, industrial_units)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                r["state"], r["district"], int(r["year"]), int(r["population"]),
                float(r["urban_pop_pct"]), float(r["literacy_rate"]), float(r["agri_workers_pct"]),
                float(r["forest_cover_sqkm"]), float(r["crop_intensity_pct"]), float(r["avg_landholding_ha"]),
                int(r["industrial_units"])
            )
        )
    print(f"Successfully ingested {len(records)} district socioeconomic records.")
    return True

if __name__ == "__main__":
    # Example usage: python scripts/ingest_socioeconomic.py data/socioeconomic.csv
    target = sys.argv[1] if len(sys.argv) > 1 else "data/socioeconomic.csv"
    ingest_socioeconomic_data(target)
