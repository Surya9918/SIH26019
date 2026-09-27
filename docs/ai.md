# AI & SEMANTIC ENGINE ARCHITECTURE — SIH26019
## National Digital Platform for Land Governance

---

## 1. AI Orchestrator & Routing
The orchestrator acts as the central brain classifying incoming natural-language queries:
1. **Research & Legal Inquiries** $\rightarrow$ Grounded Evidence RAG Pipeline
2. **Map & Geospatial Instructions** $\rightarrow$ AI GIS Agent (bounding boxes, layer toggling)
3. **Statistical & Dataset Requests** $\rightarrow$ Safe Allowlisted Data Analyst Agent
4. **Policy "What-If" Queries** $\rightarrow$ Policy Innovation Lab Simulation Engine

---

## 2. Hybrid Search Engine
Combines:
- **BM25 Sparse Lexical Matching**: Precision scoring for statutory terms (e.g., "Section 10", "DILRMP", "ULPIN").
- **Dense/Sparse Vector Cosine Similarity**: Semantic conceptual similarity across related terminology.
- **Reranking**: Reciprocal Rank Fusion (RRF) prioritizing verified government documents over general texts.

---

## 3. Strict Hallucination Guardrails
To prevent hallucination in government policy decision making:
- Evidence threshold verification: If top chunk relevance $< 0.12$, the agent explicitly returns a refusal stating insufficient verified evidence was found.
- Citation binding: Every generated statement is directly anchored to an excerpt quote with document title, authority, and category.
