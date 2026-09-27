from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from backend.database.manager import db_manager
from backend.auth.security import hash_password, verify_password, create_access_token
from backend.auth.rbac import require_auth
from backend.services.audit_service import audit_service

router = APIRouter(prefix="/api/auth", tags=["Authentication & Identity"])

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    full_name: str
    role: Optional[str] = "Researcher"
    organization: Optional[str] = "Academic / Independent"

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(req: RegisterRequest):
    existing = db_manager.execute_one(
        "SELECT id FROM users WHERE username = ? OR email = ?",
        (req.username, req.email)
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email is already registered."
        )

    allowed_roles = ["Public User", "Researcher", "Academic", "Policy Analyst"]
    assigned_role = req.role if req.role in allowed_roles else "Researcher"

    hashed = hash_password(req.password)
    user_id = db_manager.execute_insert(
        """INSERT INTO users (username, email, hashed_password, full_name, role, organization)
        VALUES (?, ?, ?, ?, ?, ?)""",
        (req.username, req.email, hashed, req.full_name, assigned_role, req.organization)
    )

    audit_service.log("USER_REGISTER", f"user:{user_id}", actor_id=user_id, actor_email=req.email)
    
    token = create_access_token({"sub": user_id, "username": req.username, "role": assigned_role})
    return {
        "status": "SUCCESS",
        "message": "User registered successfully",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "username": req.username,
            "full_name": req.full_name,
            "email": req.email,
            "role": assigned_role
        }
    }

@router.post("/login")
def login(req: LoginRequest):
    user = db_manager.execute_one(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        (req.username, req.username)
    )
    if not user or not verify_password(req.password, user["hashed_password"]):
        audit_service.log("LOGIN_FAILED", f"user:{req.username}", result="FAILURE")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or suspended"
        )

    audit_service.log("LOGIN_SUCCESS", f"user:{user['id']}", actor_id=user["id"], actor_email=user["email"])
    
    token = create_access_token({"sub": user["id"], "username": user["username"], "role": user["role"]})
    return {
        "status": "SUCCESS",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "full_name": user["full_name"],
            "email": user["email"],
            "role": user["role"],
            "organization": user["organization"]
        }
    }

@router.get("/me")
def get_me(current_user: dict = Depends(require_auth)):
    return {
        "status": "SUCCESS",
        "user": {
            "id": current_user["id"],
            "username": current_user["username"],
            "full_name": current_user["full_name"],
            "email": current_user["email"],
            "role": current_user["role"],
            "organization": current_user["organization"]
        }
    }
