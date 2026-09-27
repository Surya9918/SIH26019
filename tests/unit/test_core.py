import unittest
from backend.auth.security import hash_password, verify_password, create_access_token, decode_access_token
from backend.services.provenance_service import provenance_service
from gis.lulc.change_detection import lulc_engine
from ai.scenario_engine.simulator import policy_simulator

class TestCoreModules(unittest.TestCase):
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
        subprocess.run(["python", "database/seeds/seed_data.py"], cwd=".", env=env, check=True)

    def test_password_hashing(self):
        pwd = "TestSecretPassword@2026"
        hashed = hash_password(pwd)
        self.assertTrue(verify_password(pwd, hashed))
        self.assertFalse(verify_password("WrongPassword", hashed))

    def test_jwt_token_generation_and_decoding(self):
        payload = {"sub": 42, "username": "test_researcher", "role": "Researcher"}
        token = create_access_token(payload, expires_in_seconds=3600)
        decoded = decode_access_token(token)
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded["sub"], 42)
        self.assertEqual(decoded["username"], "test_researcher")

    def test_provenance_ledger_integrity(self):
        is_valid, issues = provenance_service.verify_integrity()
        self.assertTrue(is_valid, f"Provenance issues found: {issues}")

    def test_lulc_change_detection(self):
        res = lulc_engine.compute_change(region="Telangana", year_from=2018, year_to=2026)
        self.assertIn("summary", res)
        self.assertIn("transition_matrix", res)
        # Check that net changes exist and built-up increased
        builtup = next(item for item in res["summary"] if item["category"] == "Built-up")
        self.assertGreater(builtup["net_change_sqkm"], 0)

    def test_policy_simulation_engine(self):
        sim = policy_simulator.run_simulation(state="Telangana", district="Rangareddy")
        self.assertIn("bau_scenario", sim)
        self.assertIn("policy_alternative", sim)
        self.assertIn("net_policy_benefits", sim)
        # Ensure model saved farmland in alternative
        agri_saved = sim["net_policy_benefits"]["prime_agricultural_land_conserved_sqkm"]
        self.assertGreater(agri_saved, 0)

if __name__ == "__main__":
    unittest.main()
