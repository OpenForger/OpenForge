# Workers — architecture

**Sources:** [NFR-PO-01], [NFR-PE-09], [NFR-RE-07].

---

## 1. Recommended topology

| Component | Role |
|-----------|------|
| **API service** | HTTP + OAuth + enqueue only for heavy/async paths. |
| **Worker service(s)** | Same codebase, different `CMD` / process flag; consume queues. |
| **PostgreSQL** | System of record; job state for idempotency. |
| **Redis** (optional but typical) | Queue backend (BullMQ, Faktory, Sidekiq-compatible, etc.) + rate limit buckets + session store. |

All deployable as **OCI containers** ([NFR-PO-01]).

---

## 2. Queue backend options

| Option | Pros | Cons |
|--------|------|------|
| **Redis + BullMQ** (Node) | Mature, retries, DLQ patterns | Extra infra |
| **PostgreSQL `SKIP LOCKED`** | No Redis; transactional with app data | Tuning for throughput |
| **Cloud vendor queue** | Managed | May conflict with [NFR-PO-02] portability |

Default LLD assumption: **Redis queue** for webhooks at v1 volume; document migration path to PG queue for self-host minimal stack.

---

## 3. Concurrency

- **Webhook workers:** multiple consumers; rely on **idempotency** not global mutex.
- **Per-installation or per-repo:** optional concurrency limit to respect GitHub rate limits ([NFR-PE-13]).

---

## 4. Graceful shutdown

- On **SIGTERM**: stop accepting new jobs, finish in-flight within timeout (e.g. 30s), **nack** or requeue unfinished for retry ([NFR-RE-07] no loss).

---

## 5. Local development

- Docker Compose: API + worker + Postgres + Redis.
- Recorded webhook **replay** CLI ([NFR-MA-08]) feeds worker without GitHub.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial jobs LLD. |
