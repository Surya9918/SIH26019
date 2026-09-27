# National Digital Platform for Land Governance (SIH26019)

![Status](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

An AI-driven, highly scalable Digital Public Infrastructure (DPI) for predictive land governance, evidence-based policy analytics, and tamper-proof geospatial intelligence.

## 🌟 Key Features

1. **AI Evidence Assistant (Grounded RAG)**: Features a hybrid search architecture (BM25 + Dense Embeddings with `BAAI/bge-small-en-v1.5`) with a strict verified-source filter and LLM claim-level citation validation to completely eliminate hallucinations.
2. **Geospatial Intelligence Studio**: High-performance interactive vector mapping (`react-leaflet`) for analyzing dynamic LULC changes, rural cadastre (SVAMITVA), and satellite indices.
3. **Policy Simulation Engine**: Simulates the effects of urban sprawl and agricultural buffer protections on land degradation and economic output.
4. **Cryptographic Provenance Ledger**: Every document upload and policy simulation is hashed (SHA-256) and cryptographically chained to ensure complete auditability and tamper evidence.
5. **Multi-Agent Orchestrator**: Dynamically routes user queries to specialized sub-agents (e.g., Data Analyst, GIS Spatial Agent, Policy Simulator) for autonomous complex task resolution.
6. **Government-Grade UI/UX**: Designed with a responsive, modern interface featuring a global command palette (`Cmd+K` / `Ctrl+K`) for rapid navigation.

## 🏗️ Architecture

- **Frontend**: React + Vite, TailwindCSS (v4), Recharts, React-Leaflet
- **Backend**: FastAPI (Python 3.11+)
- **Database**: SQLite (with integrated JSON vector representations and cascading schemas)
- **Security**: JWT Authentication, strict CORS enforcement, Role-Based Access Control (RBAC)

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Surya9918/SIH26019.git
cd SIH26019
```

### 2. Backend Setup
Create a virtual environment and install the required Python dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Database Initialization
Seed the database with verified government documents, simulated users, GIS layers, and socioeconomic data:
```bash
export APP_ENV=development # Windows: $env:APP_ENV="development"
python database/seeds/seed_data.py
```

### 4. Run the Backend Server
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
*The FastAPI backend will now be available at `http://localhost:8000`. API documentation is automatically generated at `http://localhost:8000/docs`.*

### 5. Frontend Setup & Run
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run locally on `http://localhost:5173`.*

## 🧪 Testing

The repository maintains strict test coverage across routing, authentication, multi-agent orchestration, and the RAG pipeline.
```bash
# Run the integration test suite
pytest tests/integration/test_pipeline.py
```

## 🔒 Production Readiness
- ✅ Complete frontend and backend segregation.
- ✅ Secrets explicitly removed from source and injected via ENV.
- ✅ Strict DB-level `VERIFIED` filters for all LLM context generation.
- ✅ No placeholder statistics; all dashboard widgets draw from live SQLite aggregations.