from fastapi import APIRouter
from backend.services.provenance_service import provenance_service
from backend.database.manager import db_manager

router = APIRouter(prefix="/api/provenance", tags=["Cryptographic Provenance Ledger"])

@router.get("/ledger")
def get_ledger(limit: int = 50):
    blocks = db_manager.execute_query(
        "SELECT * FROM provenance_ledger ORDER BY block_index DESC LIMIT ?",
        (limit,)
    )
    return {
        "status": "SUCCESS",
        "total_blocks": len(blocks),
        "ledger": blocks
    }

@router.get("/verify")
def verify_ledger():
    is_valid, issues = provenance_service.verify_integrity()
    return {
        "status": "SUCCESS",
        "is_tamper_free": is_valid,
        "verification_result": "VALID" if is_valid else "CORRUPTED",
        "audit_issues": issues
    }
