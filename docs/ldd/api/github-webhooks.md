# Inbound GitHub webhooks

GitHub → OpenForge delivery for repository events tied to **linked** repositories/PRs ([FR-GH-05], [M-WH-01]–[M-WH-04]).

---

## 1. Endpoint

- **URL:** `POST /v1/integrations/github/webhooks` (or dedicated host path; keep **secret** per delivery).
- **Verification:** `X-Hub-Signature-256` HMAC-SHA256 of raw body with webhook secret ([NFR-SE-04]). Reject missing/invalid with `401`/`403`; **log without storing payload secrets** ([NFR-SE-05]).

---

## 2. Subscribed events (minimum)

| Event | Use |
|-------|-----|
| `pull_request` | opened, synchronize, closed, merged → sync PR state, detect **merge** → request **Merged**, contributor credit, tag inheritance ([M-WH-03], [FR-QA-06]). |
| `push` | Optional: attribution/binary checks in platform handler ([S-CI-01]) if not-only Actions. |

**Future:** `release` ([S-GH-02]), additional events as needed.

---

## 3. Processing rules

1. **Parse** JSON; extract `action`, `repository.full_name`, `pull_request` payload.
2. **Resolve** internal `request_id` / `pull_request` link by GitHub repo + PR number (unique constraint).
3. **Idempotency:** use `delivery` id header (`X-GitHub-Delivery`) or event `id` to skip duplicates ([NFR-MA-08] replay harness).
4. **Merge:** single transactional unit: update request state, record merge event, enqueue domain-footprint updates ([FR-QA-06]).
5. **Failures:** retry with **exponential backoff** up to 24h → dead-letter ([NFR-RE-06]).

---

## 4. Async and load

- Target: ingest sustained **500 events/minute** ([NFR-PE-09]); respond `202 Accepted` quickly after verify + enqueue if processing is async.
- Alert if processing latency > 60s sustained ([NFR-MA-14]).
- **Retry, DLQ, worker topology:** [jobs / queues](../jobs/queues-and-delivery.md), [workers](../jobs/workers.md).

---

## 5. Security

- **Org/repo** allowlist: only process repositories that are **linked** to at least one platform request (or registered install) to reduce noise/abuse.
- Rotate webhook secret; support multiple secrets during rotation.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial webhook LLD. |
| 1.1 | Cross-link jobs LLD. |
