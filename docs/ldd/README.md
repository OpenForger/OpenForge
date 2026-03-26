# OpenForge — Low-level design (LLD)

Implementation-facing specifications derived from [FR-1.1](../requirements/openforge_FR-1.1.tex), [NFR-1.1](../requirements/openforge_NFR-1.1.tex), [APD-1.0](../architecture/openforge_APD-1.0.md), and [DL-1.0 / UI docs](../openforge-DL-1.0.md).

| Area | Folder | Description |
|------|--------|-------------|
| **HTTP API** | [api](./api/README.md) | REST conventions, resources, errors, inbound GitHub webhooks. |
| **Database** | [db-schema](./db-schema/README.md) | PostgreSQL-oriented tables, enums, keys, indexing notes. |
| **Flows** | [flows](./flows/README.md) | End-to-end processes (auth, request lifecycle, PR merge, reviews, degraded mode). |
| **Integrations** | [integrations](./integrations/README.md) | Outbound GitHub API, package registries, queues. |
| **Security** | [security](./security/README.md) | Auth, sessions, webhooks, TLS/CSP/XSS, rate limits, privacy, audit. |
| **Observability** | [observability](./observability/README.md) | Structured logging, metrics, alerts, health. |
| **Jobs** | [jobs](./jobs/README.md) | Queues, retries, workers, scheduled & reconciliation tasks. |

**Precedence:** FR/NFR are authoritative. LLD documents are living—update them when requirements change.

**Suggested implementation stack** (from NFR: containers, no proprietary lock-in): PostgreSQL, Redis (optional, sessions/rate limits/queues), SvelteKit or separate API service behind TLS 1.2+ ([NFR-SE-06]).
