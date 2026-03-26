# Privacy & audit

**Sources:** [NFR-SE-07], [NFR-SE-13], [NFR-PL-01]–[NFR-PL-04], [NFR-PL-10], [NFR-PL-11], [FR-PR-01].

---

## 1. Personal data minimisation

| Data | Rule |
|------|------|
| Email from GitHub | Not shown publicly ([NFR-PL-01]); not logged in plain text ([NFR-SE-07]). Store encrypted at rest if persisted. |
| Public profile | GitHub login, avatar, **aggregated** activity per FR; no internal scores “hidden” from user that affect others. |

---

## 2. Logging

| Rule | Detail |
|------|--------|
| Structured JSON | Align with [observability logging](../observability/logging.md). |
| PII scrubbing | Redact email, tokens, `Authorization`, cookies, webhook secrets in log pipelines. |
| Moderation | Separate **append-only** audit stream ([NFR-SE-13], [NFR-PL-10]). |

---

## 3. Account deletion

| Step | Detail |
|------|--------|
| Request | User-triggered deletion flow ([NFR-PL-02]). |
| Anonymise | Replace `github_login` with stable pseudonym `deleted user` + internal id hash if needed for FK integrity. |
| Preserve history | Contribution/review **records** remain for aggregate integrity ([NFR-PL-02]). |
| OAuth | Revoke tokens at GitHub if API supports it. |

---

## 4. Legal & policy

- **Privacy policy** published before registrations ([NFR-PL-03]).
- **GDPR** (EEA): access, erasure, portability — Should ([NFR-PL-04]); design export APIs and DSR workflow.

---

## 5. Moderation audit log

| Field | Required |
|-------|----------|
| `id`, `created_at` | Yes |
| `actor_id` (moderator) | Yes |
| `action` | Yes |
| `target_type`, `target_id` | Yes |
| `metadata_json` | Optional context |

**Append-only** table or WORM stream; **no** delete/update for application roles; DB superuser only for legal holds.

Appeals ([NFR-PL-11]) reference `audit` entries by id.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial security LLD. |
