# Security — overview

Low-level security design aligned with [NFR-1.1](../../requirements/openforge_NFR-1.1.tex) (identifiers `NFR-SE-*`, `NFR-PL-*` where relevant).

| Document | Topics |
|----------|--------|
| [Authentication, sessions & webhooks](./authentication-and-webhooks.md) | GitHub OAuth, sessions, write auth, inbound webhook HMAC, GitHub token scope ([NFR-SE-01]–[NFR-SE-05], [NFR-SE-03]). |
| [Application hardening](./application-hardening.md) | TLS, CSP, XSS sanitisation, headers, CSRF, rate limits, abuse ([NFR-SE-06]–[NFR-SE-12]). |
| [Privacy & audit](./privacy-and-audit.md) | PII, logs, account deletion, moderation audit, GDPR pointers ([NFR-SE-07], [NFR-SE-13], [NFR-PL-01]–[NFR-PL-04], [NFR-PL-10]). |

**Related:** [REST API](../api/rest.md), [GitHub webhooks](../api/github-webhooks.md), [schema](../db-schema/schema.md), [flows](../flows/README.md).

**Precedence:** NFR wins; update these docs when controls change.
