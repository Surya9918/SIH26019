# API SPECIFICATION & REFERENCE — SIH26019
## National Digital Platform for Land Governance

All endpoints are strongly typed and documented via OpenAPI at `/docs` and ReDoc at `/redoc`.

---

## 1. Authentication & Identity (`/api/auth`)
- `POST /api/auth/register`: Register new user (roles: Public, Researcher, Academic, Policy Analyst).
- `POST /api/auth/login`: Authenticate credentials, issue HMAC-SHA256 JWT bearer token.
- `GET /api/auth/me`: Retrieve authenticated user profile and permissions.

## 2. Research Knowledge Repository (`/api/documents`)
- `GET /api/documents/`: List indexed documents with optional category, state, and verification filters.
- `GET /api/documents/{doc_id}`: Retrieve detailed document metadata and chunked passages.
- `POST /api/documents/`: Ingest new document, perform automated chunking, indexing, and hash generation.

## 3. Hybrid Semantic Search (`/api/search`)
- `GET /api/search/?q={query}`: Dual-stream search combining BM25 keyword matching with dense/sparse vector embeddings.

## 4. Grounded RAG Assistant (`/api/rag`)
- `POST /api/rag/query`: Evidence-grounded synthesis with strict citation tracking, confidence metrics, and zero-hallucination guardrails.

## 5. GIS Intelligence (`/api/gis`)
- `GET /api/gis/layers`: List available geospatial layers.
- `GET /api/gis/layers/{id}/geojson`: Retrieve full GeoJSON feature collection.
- `POST /api/gis/change-detection`: Calculate multi-temporal LULC transition matrix (2018 vs 2026).
- `GET /api/gis/remote-sensing/acquisition`: Retrieve simulated Sentinel-2 MSI spectral metrics and NDVI.

## 6. Socioeconomic Analytics (`/api/analytics`)
- `GET /api/analytics/indicators`: List standardized district socioeconomic metrics.
- `GET /api/analytics/profile?district={d}`: Fetch specific district land and demographic profile.
- `GET /api/analytics/correlations`: Compute Pearson correlation matrix across districts.
- `POST /api/analytics/compare`: Multi-district comparative analysis.

## 7. Policy Innovation Lab (`/api/scenarios`)
- `POST /api/scenarios/simulate`: Execute counterfactual scenario simulation (urban growth, agricultural greenbelts, TOD).
- `POST /api/scenarios/save`: Save scenario run and append block to cryptographic ledger.
- `GET /api/scenarios/`: List saved policy experiments.

## 8. Cryptographic Provenance Ledger (`/api/provenance`)
- `GET /api/provenance/ledger`: View chronological SHA-256 block ledger.
- `GET /api/provenance/verify`: Audit Merkle chain and confirm tamper-evident integrity.

## 9. Policy Briefing Reports (`/api/reports`)
- `POST /api/reports/generate`: Compile evidence-backed policy brief combining research, GIS, and simulation.

## 10. AI Orchestrator (`/api/ai`)
- `POST /api/ai/orchestrate`: Intent routing across RAG, GIS, Data Analyst, and Scenario engines.
