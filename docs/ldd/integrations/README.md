# Integrations — overview

Outbound and third-party systems outside the core REST + DB.

| Document | Content |
|----------|---------|
| [GitHub API](./github-api.md) | OAuth, REST calls for PR verify, checks, CODEOWNERS, rate limits. |
| [Package registries](./package-registries.md) | Install/download signals (Should Have) ([S-PR-02], [FR-GH-09]). |

**Inbound** GitHub traffic is documented under [API / GitHub webhooks](../api/github-webhooks.md). **Async processing** (retries, workers, scheduled polling) is under [jobs](../jobs/README.md).

**Related:** [flows](../flows/README.md), [NFR-PE-13] (batching/caching GitHub reads), [observability](../observability/README.md).
