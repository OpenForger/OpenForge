# Application hardening

**Sources:** [NFR-SE-06], [NFR-SE-08], [NFR-SE-09], [NFR-SE-10], [NFR-SE-11], [NFR-SE-12], [NFR-US-01], [NFR-US-05].

---

## 1. Transport security

| Control | Implementation note |
|---------|---------------------|
| TLS | **TLS 1.2+** only; disable 1.0/1.1 ([NFR-SE-06]). |
| HSTS | Enable HTTP Strict Transport Security on public hosts. |
| Redirects | HTTP → HTTPS redirect at edge. |

---

## 2. HTTP security headers

| Header | Purpose |
|--------|---------|
| **Content-Security-Policy** | Mitigate XSS; start strict, relax only as needed ([NFR-SE-08]). |
| **X-Content-Type-Options: nosniff** | Reduce MIME confusion. |
| **Referrer-Policy** | Limit leakage of path/query to third parties. |
| **Permissions-Policy** | Disable unused browser features. |
| **Frame-Options** or **CSP frame-ancestors** | Prevent clickjacking on sensitive pages. |

CSP and inline scripts: SvelteKit/Vite may need **nonces** or **hashes** for any required inline scripts.

---

## 3. Stored and reflected XSS

| Control | Implementation note |
|---------|---------------------|
| User Markdown | Parse → sanitise allowlist (tags/attrs/URLs) → render ([NFR-SE-09]). Prefer a maintained library; unit tests for payload corpus. |
| JSON APIs | Never `eval` user input; use typed serializers. |
| Error pages | Do not echo raw user input in HTML error templates. |

Automated **axe-core** on release with zero **critical** violations ([NFR-US-05]).

---

## 4. Rate limiting & abuse

| Control | Implementation note |
|---------|---------------------|
| Voting / annotations | Default **60 actions/hour/user** ([NFR-SE-10]); key: `user_id` + window; return **429** with stable error code. |
| Upvote uniqueness | Enforced in DB + silent duplicate per product ([NFR-SE-11]); rate limiter still applies to attempts. |
| Global IP cap | Optional secondary limit on anonymous/public endpoints to reduce scraping abuse. |
| Bot detection | **Should:** anomaly detection → manual review queue ([NFR-SE-12]). |

Implementation: **Redis** token bucket or sliding window; fallback to PostgreSQL with advisory locks if Redis absent (document trade-offs).

---

## 5. Dependency and supply chain

- Lockfiles committed; CI **audit** (`npm audit`, `cargo audit`, etc.) on schedule.
- Pin base container images; scan images in CI.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial security LLD. |
