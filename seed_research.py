import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database.manager import db_manager
from backend.services.document_service import document_service

def seed():
    user = db_manager.execute_one("SELECT id FROM users WHERE id = 1")
    if not user:
        db_manager.execute_insert(
            "INSERT INTO users (id, username, email, hashed_password, full_name, role) VALUES (1, 'system', 'system@bhu-setu.gov.in', 'dummy', 'System Administrator', 'Administrator')"
        )

    docs = [
        {
            "title": "[DEMO] Impact of Drone Cadastral Mapping on Dispute Resolution",
            "content": "This peer-reviewed paper analyzes the efficacy of SVAMITVA scheme's drone-based mapping in reducing boundary litigations in Haryana and Karnataka. The empirical findings suggest a 45% reduction in rural property disputes post-digitization.",
            "category": "Research Paper",
            "author": "Dr. A. Sharma",
            "document_type": "RESEARCH_PAPER",
            "publication_date": "2025"
        },
        {
            "title": "[DEMO] Blockchain for Conclusive Land Titling: A Feasibility Study",
            "content": "An analytical study on migrating from presumptive to conclusive titling in India using distributed ledger technology. Identifies key bottlenecks in legacy data sanitization and proposes a hybrid on-chain/off-chain storage model.",
            "category": "Research Paper",
            "author": "Prof. K. Iyer",
            "document_type": "RESEARCH_PAPER",
            "publication_date": "2024"
        },
        {
            "title": "[DEMO] Soil Health and Cadastral Overlay Analytics",
            "content": "This publication explores the integration of Soil Health Card (SHC) datasets with cadastral boundaries to predict crop yield volatility and enable dynamic agricultural insurance policies based on verified spatial coordinates.",
            "category": "Research Paper",
            "author": "Dr. R. Singh",
            "document_type": "RESEARCH_PAPER",
            "publication_date": "2026"
        }
    ]

    for doc in docs:
        res = document_service.add_document(
            title=doc["title"],
            content=doc["content"],
            category=doc["category"],
            author=doc["author"],
            organization="Academic Partner",
            publication_date=doc["publication_date"],
            state="National",
            district="All",
            document_type=doc["document_type"],
            uploader_id=1,
            verification_status="VERIFIED"
        )
        print(f"Inserted: {res['title']}")

if __name__ == '__main__':
    seed()
