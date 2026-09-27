# SIH26019 — National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance
### Ministry of Rural Development / Department of Land Resources (DoLR), Government of India
**Smart India Hackathon 2026 — Category: Software / Blockchain & Cybersecurity / Land Governance**

---

## 1. Problem Statement Overview
Land governance in India has historically operated across fragmented administrative siloes:
- Statutory property records, cadastral surveys (Bhu-Naksha), and deed registrations exist in disjointed systems.
- Policy decisions regarding infrastructure corridors, special economic zones, and master plan zoning often lack integrated geospatial evidence, accelerating irreversible conversion of prime agricultural farmland.
- Researchers and policy analysts lack a centralized, verifiable platform unifying statutory acts (RFCTLARR 2013, Forest Rights Act 2006), cadastral drone surveys (SVAMITVA), digital land registers (DILRMP / Bhu-Aadhaar), and multi-spectral satellite remote sensing.

---

## 2. The Solution
The **National Digital Platform for Land Governance** is a production-grade Digital Public Infrastructure (DPI) delivering:
1. **Centralized Research Knowledge Repository**: Verified catalog of statutory acts, policy circulars, and peer-reviewed research papers.
2. **Hybrid Semantic Search & Grounded RAG Assistant**: Dual BM25 + dense/sparse vector retrieval with strict zero-hallucination guardrails and verifiable verbatim citations.
3. **GIS & Remote Sensing Intelligence Engine**: Multi-temporal Land-Use and Land-Cover (LULC) transition detection (2018 vs 2026), vegetative health indices (NDVI), and vector polygon inspection.
4. **Socioeconomic Integration & Analytics**: Standardized district indicators correlating urbanization velocity with agricultural workforce displacement.
5. **Policy Innovation Lab**: Sandbox simulating counterfactual regulatory scenarios (e.g. 5 km agricultural conservation buffers + Transit-Oriented Density) comparing Baseline vs. Alternative paths.
6. **Cryptographic Provenance Ledger**: Tamper-evident SHA-256 Merkle block ledger guaranteeing end-to-end data integrity for datasets, document transformations, and scenario runs.
7. **Automated Evidence Briefings**: One-click compilation of authoritative policy briefs combining spatial data, citations, and model projections.

---

## 3. Technology Stack
- **Backend Core**: Python 3.11, FastAPI, Pydantic, Uvicorn, SQLite3 (with PostGIS/PostgreSQL migration architecture).
- **Geospatial & Scientific**: Shapely, GeoPandas, NumPy, Pandas, Scipy, Matplotlib.
- **Cryptography & Security**: PBKDF2-HMAC-SHA256, HMAC-SHA256 JWT, SHA-256 Merkle chain.
- **AI & NLP**: In-memory dense/sparse TF-IDF + BM25 hybrid vector engine, citation tracking extractor.
- **Frontend Portal**: Semantic HTML5, CSS Grid/Flexbox design system, interactive SVG GIS vector canvas, client-side controller.
- **DevOps & Testing**: Docker, Docker Compose, GitHub Actions CI/CD, Python unittest suite.

---

## 4. Key Architectural Highlights
```
User / Official
   │
   ▼
[Security Gateway & RBAC] ──► FastAPI Backend (42 REST Endpoints)
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      ▼                           ▼                           ▼
[Grounded RAG & Search]   [GIS & LULC Engine]       [Policy Simulation Lab]
 • BM25 + Vector Hybrid    • Sentinel-2 MSI LULC     • Cellular Sprawl Model
 • Exact Document Quotes   • 2018 vs 2026 Matrix     • Agri Buffer & TOD
 • Zero Hallucination      • NDVI Vegetation Health  • CapEx Savings Analysis
      │                           │                           │
      └───────────────────────────┼───────────────────────────┘
                                  ▼
                   [Cryptographic Provenance]
                     • SHA-256 Merkle Chain
                     • Tamper-Evident Ledger
```

---

## 5. Repository Structure
```
sih26019/
├── backend/
│   ├── api/             # 12 Domain API routers (Auth, Docs, GIS, RAG, Policy, Admin, etc.)
│   ├── auth/            # PBKDF2 security & 7-role RBAC enforcement
│   ├── core/            # Configuration and system settings
│   ├── database/        # Relational schema, SQLite/PostgreSQL manager
│   ├── services/        # Business logic (Document, Dataset, Report, Provenance, Audit)
│   └── main.py          # FastAPI application entrypoint
├── ai/
│   ├── orchestrator/    # Central query router
│   ├── rag/             # Evidence-grounded QA engine with citation validation
│   ├── search/          # BM25 + Cosine hybrid search index
│   ├── agents/          # GIS Agent, Research Agent, Safe Data Analyst Agent
│   └── scenario_engine/ # Policy Innovation Lab counterfactual simulator
├── gis/
│   ├── spatial_engine/  # Shapely vector geometry operations
│   ├── lulc/            # Multi-temporal LULC change detection matrix
│   └── remote_sensing/  # Spectral indices (NDVI, NDBI) pipeline
├── database/
│   ├── schema.sql       # Normalized database schema
│   └── seeds/           # Comprehensive demo datasets for Telangana & AP
├── frontend/
│   ├── static/          # Portal styling (CSS) and client controller (JS)
│   └── templates/       # Government-grade accessible HTML5 interface
├── tests/
│   ├── unit/            # Unit tests for core security, GIS, and simulation
│   └── integration/     # End-to-end API integration tests
├── docs/                # Architecture, API, GIS, Database, Security specifications
├── scripts/             # Startup and development scripts
├── Dockerfile           # Production container build
├── docker-compose.yml   # Multi-service container orchestration
└── .env.example         # Production environment template
```

---

## 6. Installation & Local Development

### Prerequisites
- Python 3.11+
- Git

### Quick Start
```bash
# 1. Clone the repository
git clone <repo-url>
cd sih26019

# 2. Run local initialization script (seeds DB, runs tests, starts server)
./scripts/run_local.sh
```

Alternatively, run manually:
```bash
# Install dependencies
pip install -r requirements.txt

# Seed database
python database/seeds/seed_data.py

# Run test suite
python -m unittest discover -s tests -p "test_*.py" -v

# Launch server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Open **http://localhost:8000** in your browser.

---

## 7. Docker Deployment
```bash
# Build and run with Docker Compose
docker compose up -d --build

# Verify container health
docker compose ps
curl http://localhost:8000/health
```

---

## 8. Demo User Credentials
The system comes pre-seeded with role-tailored demo accounts:
- **Administrator**: `admin` / `AdminPass@2026`
- **Researcher**: `researcher` / `ResearcherPass@2026`
- **Policy Analyst**: `analyst` / `PolicyPass@2026`
- **Government Official**: `official` / `OfficialPass@2026`
- **Public User**: `public` / `PublicPass@2026`

---

## 9. SIH Demonstration Workflow
Navigate to the **'★ SIH Demo Workflow'** tab on the web portal to execute the official 10-step judge walkthrough:
1. **Authenticate**: Sign in as Administrator with PBKDF2 verification.
2. **Overview**: View national-scale land governance indicators.
3. **Open GIS**: View Telangana state & Hyderabad metropolitan boundaries.
4. **LULC Matrix**: Calculate 2018–2026 physical transition matrix (+720 sq km urban expansion, -670 sq km agricultural loss).
5. **Sprawl Hotspots**: Inspect peri-urban conversion parcels along the Outer Ring Road.
6. **Grounded RAG**: Ask *"What research exists on agricultural land conversion in Hyderabad?"* to view exact citations.
7. **Policy Simulation**: Simulate 5 km agricultural conservation buffer + 1.4x TOD density.
8. **Provenance Hash**: Secure simulation into SHA-256 Merkle chain.
9. **Policy Brief**: Generate authoritative Markdown policy brief.
10. **Verify SIH Pass**: Confirm all criteria pass with zero mockups.

---

## 10. License & Disclaimers
- Released under the MIT License.
- **Disclaimer**: Simulated scenario models in the Policy Innovation Lab are exploratory decision-support estimates and do not constitute predictive guarantees.
#   S I H 2 6 0 1 9  
 