# SECURITY ARCHITECTURE & THREAT MODEL — SIH26019
## National Digital Platform for Land Governance

---

## 1. Authentication & Token Security
- **Password Storage**: Key-stretching using PBKDF2-HMAC-SHA256 with 100,000 iterations and unique 16-byte cryptographic salts.
- **Session Tokens**: Tamper-evident JWT tokens with HMAC-SHA256 signatures, issued with strictly bounded expiry windows.
- **Role-Based Access Control (RBAC)**: 7 discrete roles with hierarchical privilege boundaries (Public, Researcher, Academic, Policy Analyst, Official, Data Manager, Admin).

---

## 2. SQL & Input Injection Prevention
- Zero raw string concatenation in SQL queries.
- Strict parameter binding across all SQLite/PostgreSQL query interfaces.
- Allowlisted metric mapping in the AI Data Analyst agent preventing arbitrary SQL execution.

---

## 3. Cryptographic Provenance Ledger
- Immutability enforced via SHA-256 Merkle chain.
- Each block links to the preceding block's hash.
- Tamper detection verifies re-calculated hashes and digital signatures across all historical events.
