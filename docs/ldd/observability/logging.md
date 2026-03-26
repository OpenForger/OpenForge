# Logging

**Sources:** [NFR-MA-12], [NFR-SE-07], [S-NF-03] (Should — structured logging with trace IDs).

---

## 1. Format

- **Structured JSON** one object per line (stdout in containers).
- **UTC** timestamps: ISO-8601 `ts` field.
- **Severity:** `debug`, `info`, `warn`, `error`, `fatal` (map to provider levels in hosted env).

---

## 2. Required fields (every request-bound log)

| Field | Description |
|-------|-------------|
| `trace_id` | Correlates API → workers → DB slow query logs ([NFR-MA-12]). Propagate from incoming `X-Request-Id` or generate UUID. |
| `span_id` | Optional; use if adopting OpenTelemetry later. |
| `service` | e.g. `openforge-api`, `openforge-worker`. |
| `http.method`, `http.route`, `http.status_code` | When applicable. |
| `user_id` | Internal UUID when authenticated; omit or `anonymous` for public reads. |
| `github_delivery_id` | On webhook handler paths. |

---

## 3. Event naming

Use stable `event` string: `request.created`, `webhook.merge.applied`, `review_draft.published`, `rate_limit.exceeded`.

---

## 4. PII and secrets

- **Never** log raw emails, OAuth tokens, session cookies, webhook signatures, or full GitHub payloads containing secrets ([NFR-SE-07], [security/privacy](../security/privacy-and-audit.md)).
- Log **decision** outcomes (e.g. `signature_valid: false`) not secret material.

---

## 5. Log shipping

- Container stdout → collector (e.g. Fluent Bit, Vector) → central store.
- Retention and access control per org policy; restrict production log query to on-call roles.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial observability LLD. |
