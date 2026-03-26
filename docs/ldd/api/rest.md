# REST API (v1)

Conventions for the platform-owned HTTP API. GitHub remains canonical for code, issues, and merges; this API covers demand, annotations, profiles, and orchestration ([FR-GH-01]).

---

## 1. Transport and errors

- **TLS** only in production ([NFR-SE-06]).
- **Error envelope** (JSON):

```json
{
  "error": {
    "code": "string_machine_code",
    "message": "Human-readable plain language ([NFR-US-09])",
    "details": {},
    "request_id": "uuid"
  }
}
```

- Map **4xx/5xx** consistently: `401` unauthenticated, `403` forbidden, `404` not found, `409` conflict (e.g. duplicate upvote — may respond `204` or empty success per [NFR-SE-11] silent reject; **publish draft** fails if PR/repo changed — see §8), `422` validation, `429` rate limit ([NFR-SE-10]), `503` when dependency blocks the operation (optional `Retry-After`).
- **GitHub unavailable (published review path):** mutating endpoints in §7 return **`503`** with code `GITHUB_UNAVAILABLE` and message to use **review drafts** (§8). See [Degraded mode](../flows/degraded-mode.md).

---

## 2. Authentication

OAuth routes are **not** under `/v1/` so the GitHub **Authorization callback URL** matches the web app path (`/auth/github/callback`). Versioned JSON resources remain under `/v1/…`.

| Flow | Description |
|------|-------------|
| `GET /auth/github` | Redirect to GitHub OAuth authorize URL ([NFR-SE-01]). |
| `GET /auth/github/callback` | OAuth callback; establish **session** (HTTP-only, secure cookie). |
| `POST /auth/logout` | Invalidate session. |
| `GET /v1/me` | Current user: GitHub id, username, avatar URL; **email never returned publicly** ([NFR-PL-01]). |

**Session:** 30-day inactivity expiry ([NFR-SE-02], [M-AU-03]). Document cookie name and `SameSite` policy in deployment guide.

---

## 3. Public and authenticated reads

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| GET | `/v1/requests` | Public | List + filters (tags, category, sort: `newest` \| `most_voted`, good-first flags [NFR-US-07]). |
| GET | `/v1/requests/{id}` | Public | Full request detail; include vote count, state, tags, links, CI summary. |
| GET | `/v1/users/{github_login}/profile` | Public | Unified profile; serve from **denormalised stats tables** ([schema §3](../db-schema/schema.md)). SSR-friendly core ([NFR-US-04]). |
| GET | `/v1/tags` | Public | Curated taxonomy; support `parent_id` for hierarchy ([FR-RL-09]). |
| GET | `/v1/system/github` | Public | `{ "status": "ok" \| "degraded" }` — drives client draft vs publish ([degraded flow](../flows/degraded-mode.md)). |

**Performance targets:** list/detail/search latencies [NFR-PE-01]–[NFR-PE-04].

---

## 4. Requests (write)

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| POST | `/v1/requests` | User | When GitHub **degraded**, return **`503`** unless product allows queue-only create; validate repo/issue when `ok` ([FR-RL-01]). |
| PATCH | `/v1/requests/{id}` | Requester or policy | Same GitHub gate as other PR-correlated writes when validation required. |
| POST | `/v1/requests/{id}/solved` | Requester | Mark Solved ([FR-RL-02]). |

---

## 5. Voting and flags

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| POST | `/v1/requests/{id}/upvote` | User | Inserts `vote_kind = upvote` ([NFR-SE-11]); idempotent per user/request. |
| DELETE | `/v1/requests/{id}/upvote` | User | Optional vote removal; product decision. |
| POST | `/v1/requests/{id}/flags` | User | Reasons: duplicate, out_of_scope, already_solved ([FR-RL-04]). |

**Rate limit:** 60 voting actions/hour/user default ([NFR-SE-10]).

**Note:** [FR-RL-04] does **not** expose public downvotes. The schema supports a `vote_kind` column for clarity and future internal use; **v1 API only accepts `upvote`**.

---

## 6. Claims and pull requests

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| POST | `/v1/requests/{id}/claims` | User | **`503`** if GitHub degraded (cannot verify repo context). |
| DELETE | `/v1/requests/{id}/claims/{claim_id}` | User/Contributor | Allowed when policy permits without live GitHub (or gate consistently with §6). |
| POST | `/v1/requests/{id}/pull-requests` | Contributor | **`503`** if GitHub degraded; else verify PR ([M-CL-03]). |

---

## 7. Reviews (published) — multi-comment model

A **review** is a container for **one or more** platform-native **review comments** on a linked PR ([FR-QA-03]). **Annotations** are reactions on a **specific comment** (agree / extend / flag), not on the review root ([FR-QA-04]).

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| GET | `/v1/requests/{id}/reviews` | Public | Nested: each **review** → **comments** → **annotations**; pagination on comments or reviews ([NFR-PE-05]). |
| GET | `/v1/reviews/{review_id}` | Public | Single review with full tree. |
| POST | `/v1/requests/{id}/reviews` | User | **Requires GitHub `ok`.** Body: `linked_pull_request_id`, `comments[]` each with `body_md`, optional `severity`, `file_path`, `line_start`, `line_end`. Creates one `reviews` row + N `review_comments`. First **published** comment by user anywhere on platform-linked PRs awards **Reviewer** ([M-RV-05]); first published comment on this request → **In Review** ([FR-RL-02]). |
| POST | `/v1/reviews/{review_id}/comments` | User | **Requires GitHub `ok`.** Append comment to an existing review (same PR). |

### Annotations (on a comment)

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| POST | `/v1/review-comments/{comment_id}/annotations` | User | **Requires GitHub `ok`.** Body: `type`: `agree` \| `extend` \| `flag_incorrect`; `body_md` **required** for `extend` and `flag_incorrect`; **optional** for `agree` but **highly recommended** (UX + audit). Optional `parent_annotation_id` to reply under another annotation (threading model — [flow doc](../flows/review-annotations.md)). |

---

## 8. Review drafts (GitHub degraded or work-in-progress)

While GitHub integration is **`degraded`**, **§7 mutating endpoints MUST NOT** persist published threads; clients save work here and **publish** when GitHub is **`ok`** ([degraded flow](../flows/degraded-mode.md)).

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| GET | `/v1/me/review-drafts` | User | List current user’s drafts (optional `request_id` filter). |
| POST | `/v1/requests/{id}/review-drafts` | User | Create/replace-shaped payload: `linked_pull_request_id`, `comments[]` (same shape as §7), optional nested `annotations` keyed by **temporary** client ids for mapping on publish. **Allowed** when GitHub `degraded`. |
| PATCH | `/v1/review-drafts/{draft_id}` | User | Update draft body. |
| DELETE | `/v1/review-drafts/{draft_id}` | User | Discard draft. |
| POST | `/v1/review-drafts/{draft_id}/publish` | User | **Requires GitHub `ok`.** Re-validates linked PR (exists, open, repo matches request). If repo/PR **changed** (merged, closed, wrong head): **`409`** `DRAFT_STALE` with plain-language detail — user must **edit draft** or **discard**. On success: transactional create as in §7 + delete draft. |

---

## 9. Maintainer nomination

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| GET | `/v1/requests/{id}/maintainer` | Public | Current nomination state ([FR-MN-01]). |
| POST | `/v1/requests/{id}/maintainer/nominate` | Requester | **`503`** if GitHub degraded when API needs live GitHub. |
| POST | `/v1/requests/{id}/maintainer/accept` | Suggested user | Same gate. |
| POST | `/v1/requests/{id}/maintainer/volunteer` | Contributor | Same gate. |

CODEOWNERS PR creation happens **server-side** ([FR-MN-03], [NFR-SE-05]).

---

## 10. Tag proposals (Should Have)

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| POST | `/v1/tag-proposals` | User | New tag proposal → curation queue ([FR-RL-07]). |

---

## 11. Moderation (privileged)

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| GET | `/v1/moderation/queue` | Moderator | Items from flag threshold ([NFR-PL-09]). |
| POST | `/v1/moderation/actions` | Moderator | Decision + audit log ([NFR-PL-10]). |
| POST | `/v1/moderation/appeals` | User | Structured appeal ([NFR-PL-11]). |

Scope moderator permissions per product policy; **COI** rule Should Have ([S-MD-01]).

---

## 12. Operational

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| GET | `/health` | None | Fast health ([NFR-RE-03]). |
| GET | `/metrics` | Internal/network | Prometheus ([NFR-MA-15]). |

---

## 13. Future public API

FR mentions a **public request API** for future AI tool integration. Reserve design under `/v1/public/requests` read-only, API keys or rate limits TBD—document when activated.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial REST LLD. |
| 1.1 | Multi-comment reviews; annotations on comments; review drafts + publish/stale handling; GitHub status endpoint; `vote_kind` note; renumbered sections. |
