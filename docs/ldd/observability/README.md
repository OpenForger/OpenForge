# Observability — overview

Low-level design for logs, metrics, health, and alerting ([NFR-MA-12]–[NFR-MA-15], [NFR-RE-03]).

| Document | Topics |
|----------|--------|
| [Logging](./logging.md) | Structured JSON, trace/request id, fields, PII scrubbing ([NFR-MA-12]). |
| [Metrics & alerts](./metrics-and-alerts.md) | Required series, Prometheus `/metrics`, webhook latency alert ([NFR-MA-13], [NFR-MA-14], [NFR-MA-15]). |
| [Health](./health.md) | `/health` semantics, dependency checks ([NFR-RE-03]). |

**Related:** [security/privacy](../security/privacy-and-audit.md), [jobs](../jobs/README.md), [API operational routes](../api/rest.md).
