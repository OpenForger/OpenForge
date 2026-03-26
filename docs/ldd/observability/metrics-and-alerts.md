# Metrics & alerts

**Sources:** [NFR-MA-13], [NFR-MA-14], [NFR-MA-15].

---

## 1. Required time-series (NFR-MA-13)

Expose as **Prometheus** counters/gauges/histograms (naming: `openforge_*` prefix).

| Metric | Type | Labels (suggested) | Notes |
|--------|------|--------------------|--------|
| Request creation rate | Counter | — | Increment on successful `POST /requests`. |
| PR link rate | Counter | — | Successful PR link. |
| Review comment rate | Counter | `published` \| `draft` optional | Published comments only for FR-aligned signal. |
| Webhook processing latency | Histogram | `event_type` | Seconds from receive to successful commit; include queue wait if async. |
| Maintainer nomination acceptance rate | Counter | `outcome=accepted\|rejected\|expired` | |
| API error rate by endpoint | Counter | `route`, `status_class=4xx\|5xx` | |

Additional **recommended** metrics:

| Metric | Notes |
|--------|--------|
| `openforge_github_integration_status` | Gauge 0=degraded 1=ok (mirrors `/v1/system/github`). |
| Job queue depth | Per queue name ([jobs](../jobs/README.md)). |
| DB connection pool in use | Saturation signal. |
| OAuth callback success/failure | Counter. |

---

## 2. Prometheus endpoint

- **`GET /metrics`** on internal bind or protected by network policy ([NFR-MA-15]).
- Do not expose publicly without auth/mTLS.

---

## 3. Alerting ([NFR-MA-14])

| Condition | Action |
|-----------|--------|
| `p95(webhook_processing_latency) > 60s` for **> 5 minutes** | Page/on-call; check worker health, DB locks, GitHub incident. |

Add companion alerts:

- Error rate **5xx** > threshold for 5m.
- Worker queue depth growing unbounded 15m+.

---

## 4. Dashboards

- **Golden signals:** latency, traffic, errors, saturation for API and workers.
- **Business:** requests/day, merges/day, reviews/day, draft publish success vs 409 stale.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial observability LLD. |
