# REQUIREMENT TRACEABILITY MATRIX — SIH26019
## National Digital Platform for Land Governance

| Module / Requirement | Product Feature | Backend Service / API | Frontend View | Verification Test |
|---|---|---|---|---|
| MODULE A: Authentication | JWT + PBKDF2 Password Hashing & RBAC | `backend/auth/`, `/api/auth/*` | Header & Login Tab | `test_auth_login` |
| MODULE B: Knowledge Repository | Verified Statutory & Research Catalog | `backend/services/document_service.py`, `/api/documents/*` | Research Repository Tab | `test_documents_and_search` |
| MODULE C: Semantic Search | Hybrid BM25 + Cosine Vector Index | `ai/search/hybrid_index.py`, `/api/search/*` | Search Bar in Repository | `test_documents_and_search` |
| MODULE D: Grounded RAG | Evidence-grounded QA with Citations | `ai/rag/pipeline.py`, `/api/rag/query` | AI Evidence Assistant Tab | `test_grounded_rag_with_citations` |
| MODULE E: GIS Intelligence | Interactive Vector Map & Layer Stacking | `gis/spatial_engine/`, `/api/gis/layers` | GIS Geospatial Studio | `test_gis_change_detection` |
| MODULE F: LULC Change Analysis | Multi-Temporal Transition Matrix (2018-2026) | `gis/lulc/change_detection.py`, `/api/gis/change-detection` | GIS Change Detection Table | `test_lulc_change_detection` |
| MODULE G: Remote Sensing | Satellite Spectral Indices (NDVI/NDBI) | `gis/remote_sensing/spectral_pipeline.py` | Remote Sensing API | `test_core.py` |
| MODULE H: Socioeconomic Data | Standardized District Data Model | `backend/services/analytics_service.py`, `/api/analytics/*` | Socioeconomic Tab | `test_pipeline.py` |
| MODULE I: Analytics Engine | Correlation Matrix & Regional Disparities | `backend/services/analytics_service.py` | Analytics Tab | `test_pipeline.py` |
| MODULE J: Policy Innovation Lab | Baseline vs Policy Scenario Simulation | `ai/scenario_engine/simulator.py`, `/api/scenarios/*` | Policy Innovation Lab Tab | `test_policy_simulation_engine` |
| MODULE K: AI Data Analyst | Safe Allowlisted Metric Query Engine | `ai/agents/data_analyst_agent.py` | AI Orchestrator | `test_ai_orchestrator` |
| MODULE L: AI GIS Assistant | Natural Language Spatial Directives | `ai/agents/gis_agent.py` | AI Orchestrator | `test_ai_orchestrator` |
| MODULE M: Workspaces | Collaborative Project Sandboxes | `backend/services/workspace_service.py`, `/api/workspaces/*` | Overview & Workspaces | `test_pipeline.py` |
| MODULE N: Data Catalog | OGD Metadata & Format Listings | `backend/services/dataset_service.py`, `/api/datasets/*` | Data Catalog Tab | `test_documents_and_search` |
| MODULE O: Data Provenance | SHA-256 Merkle Block Ledger | `backend/services/provenance_service.py`, `/api/provenance/*` | Cryptographic Provenance Tab | `test_provenance_ledger_integrity` |
| MODULE P: Security | Input sanitization, token security, RBAC | `backend/main.py`, `backend/auth/` | All views | `test_security` |
| MODULE Q: Audit Logging | Immutable Action Audit Trail | `backend/services/audit_service.py`, `/api/admin/audit-logs` | Admin Tab | `test_pipeline.py` |
| MODULE R: Admin Dashboard | Platform Stats & System Health | `backend/api/admin_routes.py` | Admin Tab | `test_pipeline.py` |
| MODULE S: Role Dashboards | Role-Tailored Interface Displays | `frontend/static/js/portal.js` | Main Header & Nav | `test_serve_frontend` |
| MODULE T: Report Generation | Evidence Policy Briefing Generator | `backend/services/report_service.py`, `/api/reports/*` | Policy Briefings Tab | `test_pipeline.py` |
| MODULE U: Demo Data | Realistic, labeled datasets for Telangana/AP | `database/seeds/seed_data.py` | Entire Portal | Database Seeding |
| MODULE V: SIH Demo Mode | 10-Step Guided Walkthrough | `frontend/static/js/portal.js` | SIH Demo Tab | `test_pipeline.py` |
