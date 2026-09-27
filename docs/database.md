# DATABASE SPECIFICATION & SCHEMA — SIH26019
## National Digital Platform for Land Governance

---

## 1. Relational Entities
- `users`: Core identity table with PBKDF2 password hashes, role classifications, and organization affiliations.
- `documents`: Authoritative policy repository entries with cryptographic file hashes and verification states.
- `document_chunks`: Text segments chunked with sliding window token overlap, indexed for hybrid search.
- `datasets`: Catalog of spatial and tabular datasets with format, geographic/temporal coverage, and provenance hashes.
- `gis_layers`: Multi-temporal vector GeoJSON layers with spatial coordinate boundaries.
- `socioeconomic_indicators`: Standardized district metrics (population, urbanization %, agricultural workforce %, forest cover, industrial units).
- `workspaces` & `workspace_items`: Collaborative research sandboxes with member permissions and shared artifacts.
- `scenarios`: Exploratory policy simulation runs with input parameters and comparative impact projections.
- `provenance_ledger`: Immutable Merkle block ledger tracking all transformations and ingestions with SHA-256 hash chaining.
- `audit_logs`: Security audit log recording actor, action, resource, result, and timestamp.

---

## 2. Indexing Strategy
- B-Tree indexes on `users(username)`, `users(email)`, `users(role)`
- Covering indexes on `documents(category, state, verification_status)`
- Relational foreign key indexes on `document_chunks(document_id)`
- Spatial and temporal indexes on `gis_layers(layer_type, year)`
- Provenance hash lookups on `provenance_ledger(current_hash)`
