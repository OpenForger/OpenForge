# Authentication, sessions & webhooks

**Sources:** [NFR-SE-01], [NFR-SE-02], [NFR-SE-03], [NFR-SE-04], [NFR-SE-05], [FR-GH-02].

---

## 1. GitHub OAuth 2.0

| Control | Implementation note |
|---------|---------------------|
| No passwords | Platform does **not** store user passwords ([NFR-SE-01]). |
| Authorization code flow | Server-side `code` exchange; never expose `client_secret` to browsers. |
| State parameter | Cryptographically random `state`; validate on callback to prevent CSRF. |
| Scopes | Request **minimum** scopes required for v1 features (read user, optional `repo` only if product needs user-owned repo actions). Document chosen scopes in deployment runbook. |

---

## 2. Sessions

| Control | Implementation note |
|---------|---------------------|
| Binding | Session references **internal user id**; display identity is `github_login` ([FR-GH-02]). |
| Transport | Session cookie: **HttpOnly**, **Secure**, **SameSite** appropriate for OAuth redirect flow (often `Lax`; justify if `None`). |
| Expiry | **30 days of inactivity** ([NFR-SE-02]); sliding window on authenticated activity. |
| Storage | DB row or Redis; revoke on logout; optional rotation of session id on privilege-sensitive actions. |

---

## 3. API authorisation

| Control | Implementation note |
|---------|---------------------|
| Writes | All **mutating** endpoints require valid session ([NFR-SE-03]) unless explicitly public (there should be none for writes). |
| Reads | Public reads per FR (requests, profiles, published reviews); enforce **resource-level** checks (e.g. draft visible only to owner). |
| Moderation | Moderator role enforced server-side; audit every action ([NFR-SE-13], [NFR-PL-10]). |

**CSRF:** Cookie-based sessions require **CSRF tokens** or **double-submit cookie** for state-changing `POST`/`PATCH`/`DELETE` from browsers. For SPA + API-only pattern, prefer **SameSite** + short-lived tokens or header-based anti-CSRF.

---

## 4. Inbound GitHub webhooks

| Control | Implementation note |
|---------|---------------------|
| Signature | Verify `X-Hub-Signature-256` HMAC-SHA256 of **raw body** with shared secret ([NFR-SE-04]). Constant-time compare. |
| Rejections | Invalid signature → **401/403**; log **event type + delivery id**, not full payload if it may contain secrets. |
| Idempotency | Use `X-GitHub-Delivery` to dedupe ([NFR-MA-08]). |

---

## 5. Outbound GitHub tokens (CODEOWNERS, API)

| Control | Implementation note |
|---------|---------------------|
| Least privilege | GitHub App or PAT with **minimum** repo scope for CODEOWNERS PR creation ([NFR-SE-05]). |
| Secret handling | Tokens in **secret manager** or env injected at runtime; **never** in git, **never** in structured logs ([NFR-SE-05]). |
| Rotation | Document rotation procedure; support dual-secret during webhook rotation ([github-webhooks.md](../api/github-webhooks.md)). |

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial security LLD. |
