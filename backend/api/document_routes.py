from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from backend.services.document_service import document_service
from backend.auth.rbac import require_auth, require_roles

router = APIRouter(prefix="/api/documents", tags=["Research Knowledge Repository"])

class DocumentCreateRequest(BaseModel):
    title: str
    content: str
    category: str
    author: Optional[str] = "Researcher"
    organization: Optional[str] = "Academic / Independent"
    publication_date: Optional[str] = "2026"
    state: Optional[str] = "National"
    district: Optional[str] = "All"
    keywords: Optional[str] = ""
    document_type: Optional[str] = "Research Paper"

@router.get("")
@router.get("/")
def list_documents(
    category: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    verification_status: Optional[str] = Query(None),
    limit: int = Query(50)
):
    docs = document_service.list_documents(
        category=category,
        state=state,
        verification_status=verification_status,
        limit=limit
    )
    return {"status": "SUCCESS", "count": len(docs), "documents": docs}

@router.get("/{doc_id}")
def get_document(doc_id: int):
    doc = document_service.get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"status": "SUCCESS", "document": doc}

@router.post("/")
def upload_document(
    req: DocumentCreateRequest,
    current_user: dict = Depends(require_roles(["Researcher", "Academic", "Policy Analyst", "Government Official", "Administrator"]))
):
    res = document_service.add_document(
        title=req.title,
        content=req.content,
        category=req.category,
        author=req.author or current_user["full_name"],
        organization=req.organization or current_user.get("organization", "DoLR"),
        publication_date=req.publication_date,
        state=req.state,
        district=req.district,
        keywords=req.keywords,
        document_type=req.document_type,
        uploader_id=current_user["id"],
        verification_status="VERIFIED" if current_user["role"] in ["Administrator", "Government Official"] else "PENDING"
    )
    return {"status": "SUCCESS", "message": "Document successfully ingested and indexed", "data": res}
