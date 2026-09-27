from typing import Dict, Any, Optional
from ai.rag.pipeline import rag_pipeline
from ai.agents.gis_agent import ai_gis_agent
from ai.agents.data_analyst_agent import ai_data_analyst_agent
from ai.scenario_engine.simulator import policy_simulator

class AIOrchestrator:
    def route_and_execute(self, query: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        text = query.lower()
        ctx = context or {}

        # 1. Check for Policy Scenario Simulation Intent
        if "what if" in text or "simulate" in text or "scenario" in text or "policy intervention" in text:
            state = ctx.get("state", "Telangana")
            district = ctx.get("district", "Rangareddy")
            sim_res = policy_simulator.run_simulation(state=state, district=district)
            return {
                "route": "POLICY_SCENARIO_SIMULATION",
                "orchestrator_decision": "Detected exploratory policy simulation request. Invoking Policy Innovation Lab engine.",
                "response": sim_res
            }

        # 2. Check for GIS / Map Intent
        gis_keywords = ["map", "layer", "gis", "highlight", "zoom", "show agricultural land", "show urban", "spatial", "boundary", "hotspots"]
        if any(k in text for k in gis_keywords):
            gis_res = ai_gis_agent.process_command(query)
            return {
                "route": "GIS_SPATIAL_AGENT",
                "orchestrator_decision": "Detected geospatial command. Invoking AI GIS Agent for map manipulation.",
                "response": gis_res
            }

        # 3. Check for Statistical / Dataset Analysis Intent
        data_keywords = ["compare district", "correlation", "literacy", "population of", "socioeconomic", "how many farmers", "industrial units"]
        if any(k in text for k in data_keywords):
            data_res = ai_data_analyst_agent.answer_data_query(query)
            return {
                "route": "DATA_ANALYST_AGENT",
                "orchestrator_decision": "Detected statistical data query. Invoking Safe AI Data Analyst Agent.",
                "response": data_res
            }

        # 4. Default to Grounded Evidence RAG
        rag_res = rag_pipeline.answer_query(query=query)
        return {
            "route": "RESEARCH_RAG_AGENT",
            "orchestrator_decision": "Detected research/statutory inquiry. Invoking Grounded Evidence RAG Assistant.",
            "response": rag_res
        }

ai_orchestrator = AIOrchestrator()
