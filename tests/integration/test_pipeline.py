import unittest
from fastapi.testclient import TestClient
from backend.main import app

class TestPlatformIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import subprocess
        import os
        from pathlib import Path
        from backend.core.config import settings
        
        db_path = Path("data/land_governance.db")
        if db_path.exists():
            db_path.unlink()
            
        env = os.environ.copy()
        env["SECRET_KEY"] = settings.SECRET_KEY
        env["PYTHONPATH"] = str(Path(".").absolute())
        # Seed the database for integration tests
        subprocess.run(["python", "database/seeds/seed_data.py"], cwd=".", env=env, check=True)
        
    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoints(self):
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["status"], "HEALTHY")

        resp_ready = self.client.get("/health/ready")
        self.assertEqual(resp_ready.status_code, 200)

    def test_auth_login(self):
        resp = self.client.post("/api/auth/login", json={"username": "admin", "password": "AdminPass@2026"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["role"], "Administrator")

    def test_documents_and_search(self):
        # 1. List documents
        resp = self.client.get("/api/documents/")
        self.assertEqual(resp.status_code, 200)
        self.assertGreater(resp.json()["count"], 0)

        # 2. Hybrid Search
        search_resp = self.client.get("/api/search/?q=agricultural land conversion")
        self.assertEqual(search_resp.status_code, 200)
        self.assertGreater(search_resp.json()["total_matches"], 0)

    def test_grounded_rag_with_citations(self):
        rag_resp = self.client.post("/api/rag/query", json={
            "query": "What research exists on agricultural land conversion in Hyderabad?"
        })
        self.assertEqual(rag_resp.status_code, 200)
        data = rag_resp.json()["data"]
        self.assertTrue(data["has_sufficient_evidence"])
        self.assertGreater(len(data["citations"]), 0)
        # Verify citation structure
        first_citation = data["citations"][0]
        self.assertIn("document_title", first_citation)
        self.assertIn("verbatim_excerpt", first_citation)

    def test_rag_zero_hallucination_refusal(self):
        rag_resp = self.client.post("/api/rag/query", json={
            "query": "How do alien extraterrestrial civilizations mine minerals on Mars?"
        })
        self.assertEqual(rag_resp.status_code, 200)
        data = rag_resp.json()["data"]
        self.assertFalse(data["has_sufficient_evidence"])
        self.assertEqual(len(data["citations"]), 0)

    def test_gis_change_detection(self):
        resp = self.client.post("/api/gis/change-detection", json={
            "region": "Telangana",
            "year_from": 2018,
            "year_to": 2026
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()["data"]
        self.assertIn("summary", data)
        self.assertIn("transition_matrix", data)

    def test_policy_simulation_and_provenance(self):
        # 1. Run simulation
        sim_resp = self.client.post("/api/scenarios/simulate", json={
            "state": "Telangana",
            "district": "Rangareddy",
            "parameters": {"urban_growth_rate_pct": 2.5, "agri_protection_buffer_km": 4.0}
        })
        self.assertEqual(sim_resp.status_code, 200)
        sim_data = sim_resp.json()["simulation"]
        self.assertIn("net_policy_benefits", sim_data)

        # 2. Verify Provenance Ledger
        prov_resp = self.client.get("/api/provenance/verify")
        self.assertEqual(prov_resp.status_code, 200)
        self.assertTrue(prov_resp.json()["is_tamper_free"])

    def test_ai_orchestrator(self):
        # Test routing to GIS Agent
        resp_gis = self.client.post("/api/ai/orchestrate", json={
            "query": "Show agricultural land in Telangana"
        })
        self.assertEqual(resp_gis.status_code, 200)
        self.assertEqual(resp_gis.json()["data"]["route"], "GIS_SPATIAL_AGENT")

        # Test routing to Policy Simulation
        resp_sim = self.client.post("/api/ai/orchestrate", json={
            "query": "Simulate policy scenario for urban expansion in Rangareddy"
        })
        self.assertEqual(resp_sim.status_code, 200)
        self.assertEqual(resp_sim.json()["data"]["route"], "POLICY_SCENARIO_SIMULATION")

    def test_serve_frontend(self):
        resp = self.client.get("/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("National Digital Platform for Land Governance", resp.text)

if __name__ == "__main__":
    unittest.main()
