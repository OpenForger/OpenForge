# Flows — overview

End-to-end behavioural flows. Steps reference FR/NFR IDs for traceability.

| Document | Topic |
|----------|--------|
| [Authentication & session](./authentication-session.md) | GitHub OAuth, session cookie, `/me`. |
| [Request lifecycle](./request-lifecycle.md) | Create, states, voting, flags, claim, PR link, solved/closed. |
| [PR merge & credits](./pr-merge-credits.md) | Webhook merge, footprint, notifications. |
| [Review & annotations](./review-annotations.md) | Comments, severity, agree/extend/flag. |
| [Maintainer nomination](./maintainer-nomination.md) | Tool repos, CODEOWNERS, volunteer. |
| [Degraded mode](./degraded-mode.md) | GitHub/registry unavailable ([FR-GH-10], [NFR-RE-04], [NFR-RE-05]). |

**Related:** [REST API](../api/rest.md), [GitHub webhooks](../api/github-webhooks.md), [schema](../db-schema/schema.md), [security](../security/README.md), [jobs](../jobs/README.md), [observability](../observability/README.md).
