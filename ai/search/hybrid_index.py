import re
import math
from collections import Counter
from typing import List, Dict, Any, Optional

def tokenize(text: str) -> List[str]:
    return [w for w in re.findall(r'\b[a-zA-Z0-9_\-\.]{2,}\b', text.lower()) if len(w) > 1]

class DenseEmbedder:
    def __init__(self):
        self.model = None
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer('BAAI/bge-small-en-v1.5')
        except ImportError:
            pass

    def encode(self, text: str) -> List[float]:
        if self.model:
            return self.model.encode(text).tolist()
        # Fallback dummy dense vector
        return [0.0] * 384

class HybridSearchIndex:
    def __init__(self):
        self.documents: Dict[int, Dict[str, Any]] = {}
        self.doc_lengths: Dict[int, int] = {}
        self.avg_doc_len: float = 0.0
        self.df: Counter = Counter()
        self.total_docs: int = 0
        self.vocabulary: Dict[str, int] = {}
        self.dense_embedder = DenseEmbedder()
        self.chroma_collection = None
        try:
            import chromadb
            import os
            os.makedirs("data/chroma", exist_ok=True)
            self.chroma_client = chromadb.PersistentClient(path="data/chroma")
            self.chroma_collection = self.chroma_client.get_or_create_collection(name="land_documents")
        except ImportError:
            pass

    def ensure_loaded(self):
        if self.total_docs == 0:
            self.load_from_db()

    def load_from_db(self):
        from backend.database.manager import db_manager
        chunks = db_manager.execute_query(
            """SELECT c.id, c.document_id, c.chunk_index, c.content, 
                      d.title, d.category, d.author, d.organization, 
                      d.publication_date, d.state, d.district, d.keywords, d.verification_status
               FROM document_chunks c
               JOIN documents d ON c.document_id = d.id
               WHERE d.verification_status = 'VERIFIED'"""
        )
        for row in chunks:
            self.index_document(
                doc_id=row["id"],
                text=f"{row['title']}\n{row['content']}",
                metadata={
                    "document_id": row["document_id"],
                    "chunk_index": row["chunk_index"],
                    "title": row["title"],
                    "category": row["category"],
                    "author": row["author"],
                    "organization": row["organization"],
                    "publication_date": row["publication_date"],
                    "state": row["state"],
                    "district": row["district"],
                    "keywords": row["keywords"],
                    "verification_status": row["verification_status"]
                }
            )

    def index_document(self, doc_id: int, text: str, metadata: Dict[str, Any]):
        tokens = tokenize(text)
        term_counts = Counter(tokens)
        
        if doc_id in self.documents:
            old_tokens = set(self.documents[doc_id]["term_counts"].keys())
            for t in old_tokens:
                self.df[t] -= 1
                if self.df[t] <= 0:
                    del self.df[t]
            self.total_docs -= 1

        self.documents[doc_id] = {
            "text": text,
            "tokens": tokens,
            "term_counts": term_counts,
            "metadata": metadata
        }
        self.doc_lengths[doc_id] = len(tokens)
        for term in term_counts.keys():
            self.df[term] += 1
            if term not in self.vocabulary:
                self.vocabulary[term] = len(self.vocabulary)
        
        self.total_docs += 1
        self.avg_doc_len = sum(self.doc_lengths.values()) / max(1, self.total_docs)
        
        if self.chroma_collection is not None:
            dense_vector = self.dense_embedder.encode(text)
            # Serialize metadata for ChromaDB (no dicts inside dicts, etc)
            clean_metadata = {k: str(v) if v is not None else "" for k, v in metadata.items()}
            self.chroma_collection.add(
                ids=[str(doc_id)],
                embeddings=[dense_vector],
                documents=[text],
                metadatas=[clean_metadata]
            )

    def _bm25_score(self, query_terms: List[str], doc_id: int, k1: float = 1.5, b: float = 0.75) -> float:
        score = 0.0
        doc = self.documents[doc_id]
        doc_len = self.doc_lengths[doc_id]
        term_counts = doc["term_counts"]

        for term in query_terms:
            if term in term_counts:
                df_t = self.df.get(term, 0)
                idf = math.log((self.total_docs - df_t + 0.5) / (df_t + 0.5) + 1.0)
                tf = term_counts[term]
                num = tf * (k1 + 1)
                denom = tf + k1 * (1 - b + b * (doc_len / max(1.0, self.avg_doc_len)))
                score += idf * (num / denom)
        return max(0.0, score)

    def _cosine_sparse_score(self, query_terms: List[str], doc_id: int) -> float:
        doc = self.documents[doc_id]
        term_counts = doc["term_counts"]
        q_counts = Counter(query_terms)

        dot = 0.0
        q_norm_sq = 0.0
        doc_norm_sq = 0.0

        for t, q_c in q_counts.items():
            idf = math.log(1.0 + (self.total_docs / max(1, self.df.get(t, 1))))
            q_val = q_c * idf
            q_norm_sq += q_val ** 2
            if t in term_counts:
                d_val = term_counts[t] * idf
                dot += q_val * d_val

        for t, d_c in term_counts.items():
            idf = math.log(1.0 + (self.total_docs / max(1, self.df.get(t, 1))))
            doc_norm_sq += (d_c * idf) ** 2

        if q_norm_sq == 0.0 or doc_norm_sq == 0.0:
            return 0.0
        return dot / (math.sqrt(q_norm_sq) * math.sqrt(doc_norm_sq))

    def search(
        self,
        query: str,
        category: Optional[str] = None,
        state: Optional[str] = None,
        district: Optional[str] = None,
        top_k: int = 10
    ) -> List[Dict[str, Any]]:
        self.ensure_loaded()
        query_terms = tokenize(query)
        if not query_terms or not self.documents:
            return []

        results = []
        for doc_id, doc in self.documents.items():
            meta = doc["metadata"]

            if category and category.lower() != "all" and meta.get("category", "").lower() != category.lower():
                continue
            if state and state.lower() != "all" and meta.get("state", "").lower() != state.lower():
                continue
            if district and district.lower() != "all" and meta.get("district", "").lower() != district.lower():
                continue

            bm25 = self._bm25_score(query_terms, doc_id)
            cosine = 0.0
            hybrid_score = bm25 / 10.0 # fallback default

            if self.chroma_collection is not None:
                # Dense scores are populated below if chroma is used
                pass
            else:
                cosine = self._cosine_sparse_score(query_terms, doc_id)
                hybrid_score = (0.6 * cosine) + (0.4 * min(1.0, bm25 / 10.0))
            if hybrid_score > 0.05 or self.chroma_collection is not None:
                results.append({
                    "doc_id": doc_id,
                    "text": doc["text"],
                    "metadata": meta,
                    "bm25_score": round(bm25, 4),
                    "vector_score": 0.0,
                    "score": round(hybrid_score, 4)
                })

        if self.chroma_collection is not None and results:
            # Query chroma for top dense matches
            dense_query = self.dense_embedder.encode(query)
            try:
                chroma_res = self.chroma_collection.query(
                    query_embeddings=[dense_query],
                    n_results=min(len(results), 50)
                )
                
                dense_scores = {}
                if chroma_res and chroma_res["ids"] and chroma_res["ids"][0]:
                    for i, cid_str in enumerate(chroma_res["ids"][0]):
                        # distance to similarity (rough proxy since chroma default is l2, 1 / (1+dist))
                        dist = chroma_res["distances"][0][i]
                        dense_scores[int(cid_str)] = 1.0 / (1.0 + dist)

                for r in results:
                    did = r["doc_id"]
                    d_score = dense_scores.get(did, 0.0)
                    r["vector_score"] = round(d_score, 4)
                    r["score"] = round((0.7 * d_score) + (0.3 * min(1.0, r["bm25_score"] / 10.0)), 4)
                    
            except Exception:
                pass

        # Filter out low scores after hybrid mix
        results = [r for r in results if r["score"] > 0.05]
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

search_index = HybridSearchIndex()
