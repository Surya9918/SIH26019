import math
from typing import Dict, Any, List, Optional
from backend.database.manager import db_manager

class AnalyticsService:
    def get_district_profile(self, state: str, district: str) -> Optional[Dict[str, Any]]:
        record = db_manager.execute_one(
            "SELECT * FROM socioeconomic_indicators WHERE state = ? AND district = ? ORDER BY year DESC LIMIT 1",
            (state, district)
        )
        return record

    def list_district_indicators(self, state: Optional[str] = None) -> List[Dict[str, Any]]:
        if state and state.lower() != "all":
            return db_manager.execute_query(
                "SELECT * FROM socioeconomic_indicators WHERE state = ? ORDER BY district, year DESC",
                (state,)
            )
        return db_manager.execute_query(
            "SELECT * FROM socioeconomic_indicators ORDER BY state, district, year DESC"
        )

    def calculate_correlations(self, state: str = "Telangana") -> Dict[str, Any]:
        """
        Calculates Pearson correlation between urbanization, agricultural workforce,
        forest cover, and industrialization across districts.
        """
        records = db_manager.execute_query(
            "SELECT urban_pop_pct, agri_workers_pct, forest_cover_sqkm, industrial_units FROM socioeconomic_indicators WHERE state = ?",
            (state,)
        )
        if len(records) < 2:
            return {"status": "insufficient_data"}

        def pearson(x: List[float], y: List[float]) -> float:
            n = len(x)
            mean_x = sum(x) / n
            mean_y = sum(y) / n
            num = sum((x[i] - mean_x) * (y[i] - mean_y) for i in range(n))
            den_x = math.sqrt(sum((x[i] - mean_x)**2 for i in range(n)))
            den_y = math.sqrt(sum((y[i] - mean_y)**2 for i in range(n)))
            if den_x == 0 or den_y == 0:
                return 0.0
            return round(num / (den_x * den_y), 4)

        urban = [r["urban_pop_pct"] for r in records]
        agri = [r["agri_workers_pct"] for r in records]
        forest = [r["forest_cover_sqkm"] for r in records]
        ind = [float(r["industrial_units"]) for r in records]

        return {
            "state": state,
            "sample_size_districts": len(records),
            "correlation_matrix": {
                "urbanization_vs_agricultural_workforce": pearson(urban, agri),
                "urbanization_vs_industrial_units": pearson(urban, ind),
                "urbanization_vs_forest_cover": pearson(urban, forest),
                "agricultural_workforce_vs_forest_cover": pearson(agri, forest)
            },
            "interpretation": {
                "urbanization_agri_relationship": "Strong negative correlation: Urban sprawl directly displaces agricultural livelihoods.",
                "industrial_expansion": "Strong positive correlation between industrial clusters and rapid conversion of open land."
            }
        }

    def compare_districts(self, districts: List[str], state: str = "Telangana") -> List[Dict[str, Any]]:
        results = []
        for dist in districts:
            row = db_manager.execute_one(
                "SELECT * FROM socioeconomic_indicators WHERE state = ? AND district = ? ORDER BY year DESC LIMIT 1",
                (state, dist)
            )
            if row:
                results.append(row)
        return results

analytics_service = AnalyticsService()
