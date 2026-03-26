# Flow: Degraded mode (GitHub & registries)

**Sources:** [FR-GH-10], [NFR-RE-04], [NFR-RE-05], [DL-1.0](../../openforge-DL-1.0.md) voice/tone.

This LLD **tightens** behaviour for anything that must reflect **current GitHub repo/PR truth**. It may be stricter than the high-level NFR sentence on voting/annotations; the narrow rule is: **no new published review data** while GitHub is unavailable — use **drafts** and **publish** after validation. **Votes and flags** remain **platform-local** and stay **allowed** ([NFR-RE-04]).

---

## GitHub API unavailable — reads

| Capability | Behaviour |
|------------|-----------|
| Browse requests, profiles (from **denormalised** tables + cached GitHub fields) | **Continue** ([NFR-RE-04]). |
| Read published reviews / comments / annotations | **Continue** (cached DB content). |
| `GET /v1/system/github` | Returns `{ "status": "degraded" }` so clients switch to draft UX. |
| Actions / check status | **Last known** + **staleness** timestamp ([FR-GH-10]). |

---

## GitHub API unavailable — writes

| Write category | Behaviour |
|----------------|-----------|
| **Votes, flags** on existing requests | **Allow** — no GitHub round-trip required ([NFR-RE-04]). |
| **Published** `reviews`, `review_comments`, `review_annotations` | **Reject** (`503` `GITHUB_UNAVAILABLE`) — do **not** append to live threads ([REST §7](../api/rest.md)). |
| **Review drafts** | **Allow** `POST`/`PATCH`/`DELETE` on `/v1/review-drafts/*` — persist `review_drafts.payload` ([REST §8](../api/rest.md), [schema](../db-schema/schema.md)). |
| **PR link, claim, maintainer actions, request create** (when validation needs GitHub) | **Reject** `503` or queue with no user-visible success until verified (product choice; default **503** for simplicity). |
| **Session logout** | **Allow**. |

---

## Publish after recovery

1. User calls `POST /v1/review-drafts/{id}/publish` when `GET /v1/system/github` is **`ok`**.
2. Server **re-validates** linked PR: exists, **open**, repo matches request, optional `head_sha` match if stored in draft metadata.
3. If PR **merged**, **closed**, or repo moved: respond **`409` `DRAFT_STALE`** — explain in plain language ([NFR-US-09]); user **edits** draft or **discards**.
4. On success: **transaction** — insert `reviews` + `review_comments` + `review_annotations`, apply **Reviewer** / **In Review** rules ([review-annotations](./review-annotations.md)), update **denormalised stats**, delete draft.

---

## Webhook / merge queue

- Merge detection and PR sync **queue** for retry ([NFR-RE-06]); state catches up when GitHub returns.

---

## Package registry unavailable (install counts)

- Serve **cached** band + **last_updated** ([NFR-RE-05]); do not fabricate zero.

---

## User messaging

- Plain language: what is read-only, what can be saved as **draft**, and that **publish** checks live repo state ([NFR-US-09]).
- Align with [UI patterns](../../ui-ux/ui-patterns.md) (degraded / stale data).

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial flow. |
| 1.1 | Block published review writes when degraded; drafts + publish/stale; votes/flags still allowed. |
