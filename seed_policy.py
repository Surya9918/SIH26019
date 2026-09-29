import os
import sys
from dotenv import load_dotenv

# Ensure backend modules can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

from backend.database.manager import db_manager
from backend.services.document_service import document_service

def seed():
    # Create dummy user if not exists
    user = db_manager.execute_one("SELECT id FROM users WHERE id = 1")
    if not user:
        db_manager.execute_insert(
            "INSERT INTO users (id, username, email, hashed_password, full_name, role) VALUES (1, 'system', 'system@bhu-setu.gov.in', 'dummy', 'System Administrator', 'Administrator')"
        )

    # Seed 5 documents
    docs = [
        {
            "title": "[DEMO] Draft National Land Records Modernization Policy 2026",
            "content": "This is a demonstration seed document for the SIH demo. The Digital India Land Records Modernization Programme (DILRMP) aims to build a modern, comprehensive, and transparent land records management system. It emphasizes the integration of spatial and textual records, the digitization of cadastral maps, and the establishment of a conclusive land-titling system with title guarantee.",
            "category": "Policy",
            "author": "Ministry of Rural Development",
            "document_type": "Policy Brief",
            "publication_date": "2026"
        },
        {
            "title": "[DEMO] Framework for Geospatial Evidence in Land Disputes",
            "content": "This is a demonstration seed document. To minimize protracted land litigation, this policy framework outlines the standard operating procedure for admitting satellite imagery and drone surveys as primary evidence in cadastral boundary disputes. It mandates time-stamped, blockchain-secured metadata for all submitted spatial evidence.",
            "category": "Policy",
            "author": "Department of Land Resources",
            "document_type": "Government Report",
            "publication_date": "2025"
        },
        {
            "title": "[DEMO] Rural Cadastral Digitization Standards",
            "content": "This is a demonstration seed document. Establishes the technical specifications for vectorizing legacy paper maps. All rural cadastral maps must achieve a minimum positional accuracy of 0.5 meters and utilize the standard WGS 84 coordinate reference system. Topological validation rules require zero gaps and zero overlaps in land parcel definitions.",
            "category": "Policy",
            "author": "Survey of India",
            "document_type": "Act/Rule",
            "publication_date": "2026"
        },
        {
            "title": "[DEMO] AI in Land Valuation and Registration Policy",
            "content": "This is a demonstration seed document. Guidelines for deploying machine learning models in automated property valuation. To ensure equitable taxation and prevent undervaluation during property registration, AI models must be trained on at least five years of historical transaction data and verified against manual audits on a quarterly basis.",
            "category": "Policy",
            "author": "NITI Aayog",
            "document_type": "Policy Brief",
            "publication_date": "2026"
        },
        {
            "title": "[DEMO] Indigenous Land Rights and Data Sovereignty",
            "content": "This is a demonstration seed document. Recognizes the unique requirements of tribal land governance. Emphasizes community-led mapping initiatives and ensures that digitized records of indigenous territories are protected under strict data sovereignty principles, restricting unauthorized commercial access while enabling targeted government welfare programs.",
            "category": "Policy",
            "author": "Ministry of Tribal Affairs",
            "document_type": "Research Paper",
            "publication_date": "2024"
        }
    ]

    for doc in docs:
        res = document_service.add_document(
            title=doc["title"],
            content=doc["content"],
            category=doc["category"],
            author=doc["author"],
            organization="Demo Org",
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
