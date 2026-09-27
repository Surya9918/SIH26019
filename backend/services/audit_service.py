import json
from typing import Optional, Dict, Any
from backend.database.manager import db_manager

class AuditService:
    def log(
        self,
        action: str,
        resource: str,
        result: str = "SUCCESS",
        actor_id: Optional[int] = None,
        actor_email: Optional[str] = None,
        ip_address: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> int:
        metadata_str = json.dumps(metadata or {}, sort_keys=True)
        return db_manager.execute_insert(
            """INSERT INTO audit_logs 
            (actor_id, actor_email, action, resource, result, ip_address, metadata_json)
            VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (actor_id, actor_email, action, resource, result, ip_address, metadata_str)
        )

    def list_logs(self, limit: int = 100, action: Optional[str] = None):
        if action:
            return db_manager.execute_query(
                "SELECT * FROM audit_logs WHERE action = ? ORDER BY timestamp DESC LIMIT ?",
                (action, limit)
            )
        return db_manager.execute_query(
            "SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?",
            (limit,)
        )

audit_service = AuditService()
