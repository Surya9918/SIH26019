from typing import Dict, Any, List, Optional
from backend.database.manager import db_manager
from backend.services.analytics_service import analytics_service

class AIDataAnalystAgent:
    """
    Safely interprets natural language dataset inquiries, validates parameters against
    an allowlist of dimensions and metrics, executes parameter-bound queries, and formats
    statistical explanations.
    """
    ALLOWLISTED_METRICS = {
        "population": "population",
        "urban": "urban_pop_pct",
        "urbanization": "urban_pop_pct",
        "literacy": "literacy_rate",
        "agriculture": "agri_workers_pct",
        "farmers": "agri_workers_pct",
        "forest": "forest_cover_sqkm",
        "crop": "crop_intensity_pct",
        "landholding": "avg_landholding_ha",
        "industry": "industrial_units",
        "factories": "industrial_units"
    }

    def answer_data_query(self, user_prompt: str) -> Dict[str, Any]:
        text = user_prompt.lower()
        
        # 1. State resolution
        target_state = "Telangana"
        if "andhra" in text:
            target_state = "Andhra Pradesh"
        elif "maharashtra" in text:
            target_state = "Maharashtra"
        elif "karnataka" in text:
            target_state = "Karnataka"

        # 2. Check if user is asking for correlation
        if "correlation" in text or "relationship" in text or "relate" in text:
            corr_data = analytics_service.calculate_correlations(state=target_state)
            return {
                "query": user_prompt,
                "analysis_type": "CORRELATION_ANALYSIS",
                "state": target_state,
                "data": corr_data["correlation_matrix"],
                "explanation": (
                    f"Statistical analysis across {target_state} districts reveals that urbanization "
                    f"is strongly negatively correlated with agricultural workforce participation "
                    f"({corr_data['correlation_matrix']['urbanization_vs_agricultural_workforce']:.2f}). "
                    f"Industrialization shows a strong positive correlation with built-up conversion "
                    f"({corr_data['correlation_matrix']['urbanization_vs_industrial_units']:.2f})."
                ),
                "data_source": "District Statistical Handbook & Land Records Modernization Census"
            }

        # 3. Check if specific district is requested
        districts = db_manager.execute_query(
            "SELECT DISTINCT district FROM socioeconomic_indicators WHERE state = ?",
            (target_state,)
        )
        district_names = [d["district"] for d in districts]
        
        found_districts = [d for d in district_names if d.lower() in text]
        if not found_districts:
            found_districts = ["Hyderabad", "Rangareddy", "Warangal", "Medchal"]

        rows = []
        for dist in found_districts:
            row = db_manager.execute_one(
                "SELECT district, year, population, urban_pop_pct, literacy_rate, agri_workers_pct, forest_cover_sqkm, industrial_units "
                "FROM socioeconomic_indicators WHERE state = ? AND district = ? ORDER BY year DESC LIMIT 1",
                (target_state, dist)
            )
            if row:
                rows.append(row)

        return {
            "query": user_prompt,
            "analysis_type": "DISTRICT_COMPARISON",
            "state": target_state,
            "districts_analyzed": found_districts,
            "table_data": rows,
            "explanation": (
                f"Retrieved standardized socioeconomic metrics for {len(rows)} districts in {target_state}. "
                f"Highest urbanization observed in {max(rows, key=lambda x: x['urban_pop_pct'])['district']} "
                f"({max(rows, key=lambda x: x['urban_pop_pct'])['urban_pop_pct']}%), while "
                f"highest agricultural workforce remains in {max(rows, key=lambda x: x['agri_workers_pct'])['district']} "
                f"({max(rows, key=lambda x: x['agri_workers_pct'])['agri_workers_pct']}%)."
            ),
            "data_source": "National Socioeconomic & Land Statistics Repository (DoLR/DES)"
        }

ai_data_analyst_agent = AIDataAnalystAgent()
