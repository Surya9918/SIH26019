import json
from typing import Dict, Any, List, Optional
from backend.database.manager import db_manager
from backend.services.audit_service import audit_service

class WorkspaceService:
    def create_workspace(self, name: str, description: str, owner_id: int, is_public: bool = False) -> Dict[str, Any]:
        ws_id = db_manager.execute_insert(
            "INSERT INTO workspaces (name, description, owner_id, is_public) VALUES (?, ?, ?, ?)",
            (name, description, owner_id, 1 if is_public else 0)
        )
        db_manager.execute_insert(
            "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, ?)",
            (ws_id, owner_id, "Owner")
        )
        audit_service.log("WORKSPACE_CREATE", f"workspace:{ws_id}", actor_id=owner_id, metadata={"name": name})
        return {"id": ws_id, "name": name, "description": description, "owner_id": owner_id}

    def list_workspaces(self, user_id: int) -> List[Dict[str, Any]]:
        return db_manager.execute_query(
            """SELECT w.*, wm.role as member_role 
            FROM workspaces w 
            JOIN workspace_members wm ON w.id = wm.workspace_id 
            WHERE wm.user_id = ? OR w.is_public = 1
            ORDER BY w.created_at DESC""",
            (user_id,)
        )

    def get_workspace(self, workspace_id: int, user_id: int) -> Optional[Dict[str, Any]]:
        ws = db_manager.execute_one("SELECT * FROM workspaces WHERE id = ?", (workspace_id,))
        if not ws:
            return None
        members = db_manager.execute_query(
            """SELECT u.id, u.username, u.full_name, u.email, wm.role, wm.joined_at 
            FROM workspace_members wm 
            JOIN users u ON wm.user_id = u.id 
            WHERE wm.workspace_id = ?""",
            (workspace_id,)
        )
        items = db_manager.execute_query(
            "SELECT * FROM workspace_items WHERE workspace_id = ? ORDER BY added_at DESC",
            (workspace_id,)
        )
        ws["members"] = members
        ws["items"] = items
        return ws

    def add_item(self, workspace_id: int, item_type: str, item_id: int, notes: str = "", item_data: Dict[str, Any] = None) -> int:
        data_json = json.dumps(item_data or {})
        return db_manager.execute_insert(
            "INSERT INTO workspace_items (workspace_id, item_type, item_id, item_data_json, notes) VALUES (?, ?, ?, ?, ?)",
            (workspace_id, item_type, item_id, data_json, notes)
        )

workspace_service = WorkspaceService()
