from enum import Enum
from typing import List, Optional
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.auth.security import decode_access_token
from backend.database.manager import db_manager

class Role(str, Enum):
    PUBLIC = "Public User"
    RESEARCHER = "Researcher"
    ACADEMIC = "Academic"
    POLICY_ANALYST = "Policy Analyst"
    OFFICIAL = "Government Official"
    DATA_MANAGER = "Data Manager"
    ADMIN = "Administrator"

ROLE_HIERARCHY = {
    Role.PUBLIC: 1,
    Role.RESEARCHER: 2,
    Role.ACADEMIC: 2,
    Role.POLICY_ANALYST: 3,
    Role.OFFICIAL: 4,
    Role.DATA_MANAGER: 4,
    Role.ADMIN: 5
}

security_bearer = HTTPBearer(auto_error=False)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer)) -> Optional[dict]:
    if not credentials:
        return None
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials"
        )
    user = db_manager.execute_one(
        "SELECT id, username, email, full_name, role, organization, is_active FROM users WHERE id = ?",
        (payload["sub"],)
    )
    if not user or not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated or does not exist"
        )
    return user

def require_auth(credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer)) -> dict:
    user = get_current_user(credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required for this operation"
        )
    return user

def require_roles(allowed_roles: List[str]):
    def role_checker(user: dict = Security(require_auth)) -> dict:
        user_role = user.get("role")
        if user_role == Role.ADMIN.value:
            return user
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        return user
    return role_checker
