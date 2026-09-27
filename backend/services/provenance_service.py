import hashlib
import hmac
import json
import time
from typing import Dict, Any, List, Tuple
from backend.database.manager import db_manager
from backend.core.config import settings

class ProvenanceService:
    GENESIS_HASH = "0" * 64

    def __init__(self):
        self._ensure_genesis()

    def _ensure_genesis(self):
        latest = db_manager.execute_one(
            "SELECT id, current_hash FROM provenance_ledger ORDER BY block_index DESC LIMIT 1"
        )
        if not latest:
            # Create Genesis Block
            genesis_payload = json.dumps({"description": "National Land Governance Platform Genesis Block - SIH26019"})
            timestamp = "2026-01-01T00:00:00Z"
            block_index = 0
            prev_hash = self.GENESIS_HASH
            
            raw_data = f"{prev_hash}|{block_index}|GENESIS|0|INIT|0|{timestamp}|{genesis_payload}"
            current_hash = hashlib.sha256(raw_data.encode('utf-8')).hexdigest()
            signature = hmac.new(settings.SECRET_KEY.encode('utf-8'), current_hash.encode('utf-8'), hashlib.sha256).hexdigest()
            
            db_manager.execute_insert(
                """INSERT INTO provenance_ledger 
                (block_index, prev_hash, current_hash, entity_type, entity_id, action, actor_id, timestamp, payload_json, signature)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (block_index, prev_hash, current_hash, "GENESIS", 0, "INIT", 0, timestamp, genesis_payload, signature)
            )

    def record_event(
        self,
        entity_type: str,
        entity_id: int,
        action: str,
        actor_id: int,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        latest = db_manager.execute_one(
            "SELECT block_index, current_hash FROM provenance_ledger ORDER BY block_index DESC LIMIT 1"
        )
        block_index = (latest["block_index"] + 1) if latest else 0
        prev_hash = latest["current_hash"] if latest else self.GENESIS_HASH
        
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        payload_str = json.dumps(payload, sort_keys=True)
        
        raw_data = f"{prev_hash}|{block_index}|{entity_type}|{entity_id}|{action}|{actor_id}|{timestamp}|{payload_str}"
        current_hash = hashlib.sha256(raw_data.encode('utf-8')).hexdigest()
        signature = hmac.new(settings.SECRET_KEY.encode('utf-8'), current_hash.encode('utf-8'), hashlib.sha256).hexdigest()
        
        block_id = db_manager.execute_insert(
            """INSERT INTO provenance_ledger 
            (block_index, prev_hash, current_hash, entity_type, entity_id, action, actor_id, timestamp, payload_json, signature)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (block_index, prev_hash, current_hash, entity_type, entity_id, action, actor_id, timestamp, payload_str, signature)
        )
        
        return {
            "id": block_id,
            "block_index": block_index,
            "prev_hash": prev_hash,
            "current_hash": current_hash,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "action": action,
            "timestamp": timestamp,
            "signature": signature
        }

    def verify_integrity(self) -> Tuple[bool, List[str]]:
        blocks = db_manager.execute_query(
            "SELECT * FROM provenance_ledger ORDER BY block_index ASC"
        )
        if not blocks:
            return True, ["Ledger is empty."]

        issues = []
        for i, block in enumerate(blocks):
            # 1. Check prev_hash chaining
            if i == 0:
                if block["prev_hash"] != self.GENESIS_HASH:
                    issues.append(f"Genesis block has invalid prev_hash: {block['prev_hash']}")
            else:
                prev_block = blocks[i - 1]
                if block["prev_hash"] != prev_block["current_hash"]:
                    issues.append(
                        f"Block {block['block_index']} prev_hash mismatch: expected {prev_block['current_hash']}, got {block['prev_hash']}"
                    )

            # 2. Re-compute hash
            raw_data = f"{block['prev_hash']}|{block['block_index']}|{block['entity_type']}|{block['entity_id']}|{block['action']}|{block['actor_id']}|{block['timestamp']}|{block['payload_json']}"
            computed_hash = hashlib.sha256(raw_data.encode('utf-8')).hexdigest()
            if computed_hash != block["current_hash"]:
                issues.append(
                    f"Block {block['block_index']} hash corrupted: expected {computed_hash}, found {block['current_hash']}"
                )

            # 3. Verify signature
            expected_sig = hmac.new(settings.SECRET_KEY.encode('utf-8'), block["current_hash"].encode('utf-8'), hashlib.sha256).hexdigest()
            if not hmac.compare_digest(expected_sig, block["signature"]):
                issues.append(f"Block {block['block_index']} has invalid cryptographic signature.")

        is_valid = len(issues) == 0
        return is_valid, issues

provenance_service = ProvenanceService()
