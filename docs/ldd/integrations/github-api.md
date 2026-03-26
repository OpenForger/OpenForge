# GitHub API (outbound)

**Sources:** [FR-GH-02]–[FR-GH-09], [M-CL-03], [M-CI-01], [NFR-PE-13], [NFR-SE-05].

---

## OAuth

- Scopes: minimal set for login + operations user consents to (repo hooks, `repo` or fine-grained PAT per deployment model).
- Tokens: **short-lived** access + refresh where applicable; **encrypt at rest**; never log ([NFR-SE-05]).

---

## Typical calls

| Use case | API | Notes |
|----------|-----|--------|
| Verify PR exists/open | `GET /repos/{owner}/{repo}/pulls/{pull_number}` | [M-CL-03] |
| Check runs | `GET /repos/{owner}/{repo}/commits/{sha}/check-runs` or Checks API | [M-CI-01]; **cache** ([NFR-PE-13]) |
| Fork count | `GET /repos/{owner}/{repo}` | [S-GH-01] |
| Releases | `GET /repos/{owner}/{repo}/releases` | [S-GH-02] |
| CODEOWNERS PR | Contents + create tree + PR via Git API | [FR-MN-03] |
| Mention maintainer | Issue comment with `@username` | [FR-GH-08] |

---

## Rate limits

- **Batch and cache** non-critical reads ([NFR-PE-13]).
- Handle `403` rate limit: backoff, surface staleness in UI.

---

## Webhook registration

- Register per organisation/repo with shared secret; document rotation.

---

## Abstraction (NFR)

- Implement behind `VcsProvider` interface for future GitLab/Codeberg ([NFR-MA-05]).

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial integration LLD. |
