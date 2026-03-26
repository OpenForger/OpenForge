# API — overview

| Document | Content |
|----------|---------|
| [REST API](./rest.md) | Resources, methods, auth, pagination, rate limits. |
| [Inbound GitHub webhooks](./github-webhooks.md) | Endpoint, verification, event handling, idempotency, retries. |

**Related:** [GitHub outbound integration](../integrations/github-api.md), [flows](../flows/README.md), [schema](../db-schema/schema.md).

**Principles**

- **JSON** request/response bodies; UTF-8; dates in **ISO-8601** UTC unless noted.
- **Versioning:** prefix public HTTP routes with `/v1/` (path versioning) so breaking changes can ship `/v2/` without silent breakage.
- **Authentication:** authenticated actions require a **valid session** established via GitHub OAuth ([NFR-SE-01], [NFR-SE-03]). Public read endpoints as allowed by FR (browsing requests, public profiles).
- **Idempotency:** unsafe retries for user writes use `Idempotency-Key` header where duplicate submission would be harmful (e.g. create request, cast upvote).
- **Observability:** propagate **request/trace ID** on responses (`X-Request-Id`) and in structured logs ([NFR-MA-12]).
- **GitHub degraded:** published review-thread writes go to **`503`**; use **review drafts** and **`/v1/system/github`** ([rest.md §7–8](./rest.md), [degraded flow](../flows/degraded-mode.md)).
