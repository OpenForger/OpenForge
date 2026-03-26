# Queues & delivery

**Sources:** [NFR-RE-06], [NFR-RE-07], [NFR-PE-09], [M-WH-04], [NFR-MA-08], [NFR-MA-14].

---

## 1. Webhook pipeline

| Stage | Behaviour |
|-------|-----------|
| **Ingress** | HTTP handler verifies HMAC ([NFR-SE-04]), parses payload, enqueues **job** with `delivery_id`, `event_type`, raw payload ref or normalized fields. |
| **Respond** | Return **202** quickly after enqueue ([NFR-PE-09] sustained throughput); avoid heavy work in request thread. |
| **Worker** | Idempotent handler: skip if `github_webhook_deliveries` already `processed` ([schema](../db-schema/schema.md)). |
| **Apply** | Merge events run transactional credit + denormalised stats ([pr-merge flow](../flows/pr-merge-credits.md)). |

---

## 2. Retry policy ([NFR-RE-06])

| Parameter | Value |
|-----------|--------|
| Strategy | **Exponential backoff** with jitter (e.g. base 30s, cap 1h). |
| Max age | **24 hours** from first failure; then move to **dead-letter queue** (DLQ). |
| DLQ | Persist payload metadata + error stack; operator UI or CLI to **replay** / **discard** after inspection. |

Transient failures: GitHub 5xx, DB deadlock, timeout. **Non-retry:** 4xx from GitHub for bad repo (move to DLQ with reason).

---

## 3. Other queued work

| Job type | Retry | Notes |
|----------|-------|--------|
| GitHub API: PR verification | Short backoff | On claim/PR link path. |
| CODEOWNERS PR creation | Medium backoff | [NFR-SE-05] token errors → alert. |
| Draft publish (GitHub re-check) | User-triggered | Primary path synchronous; optional async if slow. |

---

## 4. Ordering and duplicates

- **Per-repo** optional ordering key so related PR events serialize if needed.
- **Dedup** always on `X-GitHub-Delivery` ([NFR-MA-08]).

---

## 5. Backpressure

- Monitor **queue depth** ([observability metrics](../observability/metrics-and-alerts.md)).
- If depth exceeds threshold: scale workers; alert if sustained ([NFR-MA-14] pattern).

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial jobs LLD. |
