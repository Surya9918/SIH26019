import json
import hashlib
from typing import Dict, Any, List, Optional
from backend.database.manager import db_manager
from backend.services.provenance_service import provenance_service
from backend.services.audit_service import audit_service

class DatasetService:
    def add_dataset(
        self,
        name: str,
        description: str,
        source: str,
        geographic_coverage: str,
        temporal_coverage: str,
        format_type: str,
        size_bytes: int = 1048576,
        update_frequency: str = "Annual",
        metadata: Dict[str, Any] = None,
        actor_id: int = 1
    ) -> Dict[str, Any]:
        meta_str = json.dumps(metadata or {}, sort_keys=True)
        prov_hash = hashlib.sha256(f"{name}|{source}|{meta_str}".encode('utf-8')).hexdigest()

        dataset_id = db_manager.execute_insert(
            """INSERT INTO datasets 
            (name, description, source, geographic_coverage, temporal_coverage, format, size_bytes, update_frequency, metadata_json, provenance_hash, is_verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)""",
            (name, description, source, geographic_coverage, temporal_coverage, format_type, size_bytes, update_frequency, meta_str, prov_hash)
        )

        provenance_service.record_event(
            entity_type="dataset",
            entity_id=dataset_id,
            action="DATASET_REGISTRATION",
            actor_id=actor_id,
            payload={"name": name, "source": source, "provenance_hash": prov_hash}
        )

        audit_service.log("DATASET_REGISTER", f"dataset:{dataset_id}", actor_id=actor_id, metadata={"name": name})

        return {
            "id": dataset_id,
            "name": name,
            "source": source,
            "provenance_hash": prov_hash
        }

    def list_datasets(self, coverage: Optional[str] = None, format_type: Optional[str] = None) -> List[Dict[str, Any]]:
        conditions = []
        params = []
        if coverage and coverage.lower() != "all":
            conditions.append("geographic_coverage = ?")
            params.append(coverage)
        if format_type and format_type.lower() != "all":
            conditions.append("format = ?")
            params.append(format_type)

        where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
        return db_manager.execute_query(f"SELECT * FROM datasets {where} ORDER BY id ASC", tuple(params))

    def get_dataset(self, dataset_id: int) -> Optional[Dict[str, Any]]:
        return db_manager.execute_one("SELECT * FROM datasets WHERE id = ?", (dataset_id,))

dataset_service = DatasetService()
