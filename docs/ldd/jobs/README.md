# Jobs & background processing — overview

Asynchronous work: **queues**, **retries**, **scheduled** tasks, and **workers**. Aligns with [NFR-RE-06], [NFR-PE-09], [NFR-PE-10], [M-WH-04], and LLD [degraded mode](../flows/degraded-mode.md).

| Document | Topics |
|----------|--------|
| [Queues & delivery](./queues-and-delivery.md) | Webhook ingestion, retry/backoff, dead-letter, idempotency. |
| [Workers](./workers.md) | Process topology, Redis vs DB queue, concurrency, graceful shutdown. |
| [Scheduled & reconciliation](./scheduled-and-reconciliation.md) | Stale Tool repos, registry polling, GitHub sync catch-up, stats repair. |

**Related:** [GitHub webhooks](../api/github-webhooks.md), [integrations](../integrations/README.md), [observability](../observability/metrics-and-alerts.md).
