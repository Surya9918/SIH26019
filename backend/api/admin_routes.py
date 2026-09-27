from fastapi import APIRouter, HTTPException, Depends
from backend.database.manager import db_manager
from backend.auth.rbac import require_roles
from backend.services.audit_service import audit_service

router = APIRouter(prefix="/api/admin", tags=["Administrative Governance"])

@router.get("/stats")
def get_platform_stats(current_user: dict = Depends(require_roles(["Administrator", "Government Official"]))):
    user_count = db_manager.execute_one("SELECT COUNT(*) as count FROM users")["count"]
    doc_count = db_manager.execute_one("SELECT COUNT(*) as count FROM documents")["count"]
    dataset_count = db_manager.execute_one("SELECT COUNT(*) as count FROM datasets")["count"]
    scenario_count = db_manager.execute_one("SELECT COUNT(*) as count FROM scenarios")["count"]
    block_count = db_manager.execute_one("SELECT COUNT(*) as count FROM provenance_ledger")["count"]

    return {
        "status": "SUCCESS",
        "statistics": {
            "registered_users": user_count,
            "indexed_documents": doc_count,
            "registered_datasets": dataset_count,
            "simulated_scenarios": scenario_count,
            "cryptographic_provenance_blocks": block_count
        }
    }

@router.get("/users")
def list_users(current_user: dict = Depends(require_roles(["Administrator"]))):
    users = db_manager.execute_query(
        "SELECT id, username, email, full_name, role, organization, is_active, created_at FROM users ORDER BY id ASC"
    )
    return {"status": "SUCCESS", "users": users}

@router.get("/audit-logs")
def get_audit_logs(limit: int = 100, current_user: dict = Depends(require_roles(["Administrator", "Government Official"]))):
    logs = audit_service.list_logs(limit=limit)
    return {"status": "SUCCESS", "count": len(logs), "logs": logs}
