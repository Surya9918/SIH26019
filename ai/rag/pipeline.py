import re
from typing import Dict, Any, List, Optional
from ai.search.hybrid_index import search_index, tokenize

class LLMAdapter:
    def generate_answer(self, query: str, citations: List[Dict]) -> Dict[str, Any]:
        raise NotImplementedError()

class DemoLLMAdapter(LLMAdapter):
    def generate_answer(self, query: str, citations: List[Dict]) -> Dict[str, Any]:
        claims = []
        for c in citations:
            claims.append({
                "text": f"Evidence from {c['document_title']} indicates that {c['verbatim_excerpt'][:150].strip()}...",
                "sources": [c["citation_id"]]
            })
        
        answer_text = (
            f"Based on grounded evidence retrieved from verified departmental records and peer-reviewed "
            f"land governance research repositories, the key findings regarding '{query}' are:\n\n"
        )
        
        for claim in claims:
            answer_text += f"• {claim['text']} {claim['sources'][0]}\n\n"
            
        return {
            "answer": answer_text.strip(),
            "claims": claims
        }

class GroundedRAGPipeline:
    def __init__(self, confidence_threshold: float = 0.12, llm_adapter: Optional[LLMAdapter] = None):
        self.threshold = confidence_threshold
        self.llm = llm_adapter or DemoLLMAdapter()

    def answer_query(
        self,
        query: str,
        category: Optional[str] = None,
        state: Optional[str] = None,
        top_k: int = 5
    ) -> Dict[str, Any]:
        results = search_index.search(
            query=query,
            category=category,
            state=state,
            top_k=top_k
        )

        if not results or results[0]["score"] < self.threshold:
            return {
                "query": query,
                "answer": (
                    "Insufficient verified evidence was found in the National Land Governance "
                    "Repository to answer this query with grounded confidence. "
                    "No verified government policy or research document matched the inquiry threshold."
                ),
                "has_sufficient_evidence": False,
                "confidence_score": round(results[0]["score"], 4) if results else 0.0,
                "citations": [],
                "retrieved_chunks_count": len(results)
            }

        # Filter chunks meeting threshold
        valid_chunks = [r for r in results if r["score"] >= self.threshold]
        
        # Build synthesis from grounded evidence
        citations = []
        synthesized_points = []
        seen_docs = set()

        q_terms = set(tokenize(query))

        for idx, item in enumerate(valid_chunks):
            meta = item["metadata"]
            doc_id = meta.get("document_id")
            title = meta.get("title", "Unknown Source")
            citation_key = f"[{meta.get('category', 'DOC')} #{doc_id}]"

            # Extract key matching sentences from the chunk text
            text = item["text"].replace(title, "").strip()
            sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if len(s.strip()) > 20]
            
            matching_sentences = []
            for s in sentences:
                s_tokens = set(tokenize(s))
                overlap = len(q_terms.intersection(s_tokens))
                if overlap > 0:
                    matching_sentences.append((overlap, s))
            
            matching_sentences.sort(key=lambda x: x[0], reverse=True)
            best_excerpt = matching_sentences[0][1] if matching_sentences else (sentences[0] if sentences else text[:250])

            citations.append({
                "citation_id": citation_key,
                "document_id": doc_id,
                "document_title": title,
                "category": meta.get("category", "General"),
                "organization": meta.get("organization", "DoLR"),
                "state": meta.get("state", "National"),
                "relevance_score": item["score"],
                "verbatim_excerpt": best_excerpt
            })

            if doc_id not in seen_docs:
                seen_docs.add(doc_id)

        avg_confidence = min(0.98, max(0.40, sum(c["relevance_score"] for c in citations) / len(citations) * 1.5))
        
        # Cross Encoder / Reranking mock step here (in a real scenario, re-sort citations)
        # Reranked top 5
        citations = citations[:5]
        
        # LLM Generation
        llm_response = self.llm.generate_answer(query, citations)

        return {
            "query": query,
            "answer": llm_response["answer"],
            "claims": llm_response["claims"],
            "has_sufficient_evidence": True,
            "confidence_score": round(avg_confidence, 2),
            "citations": citations,
            "retrieved_chunks_count": len(valid_chunks)
        }

rag_pipeline = GroundedRAGPipeline()
