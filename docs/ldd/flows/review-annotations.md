# Flow: Review & annotations

**Sources:** [FR-QA-03], [FR-QA-04], [FR-QA-05], [FR-AC-01]–[FR-AC-03], [M-RV-01]–[M-RV-06], [NFR-PE-05].

---

## Data model (chosen threading)

1. **`reviews`** — One row per “review session” on a **single** `linked_pull_request` for a given `request_id`. A user may open multiple reviews over time (e.g. follow-up passes); each contains **many** comments.
2. **`review_comments`** — Primary observations ([FR-QA-03]): body, optional **Blocker / Concern / Suggestion**, optional file + line range. **All** belong to a `review_id`. There is **no** separate “extend as child comment” row — **Extend** lives in annotations.
3. **`review_annotations`** — **Comment on a comment**: attached to `review_comment_id`. Types **Agree**, **Extend**, **Flag incorrect** ([FR-QA-04]).
   - **`body_md`:** optional for **Agree** (product: **highly recommended** for context); **required** for **Extend** and **Flag incorrect**.
   - **`parent_annotation_id`:** optional. If set, this annotation is a **reply** to another annotation (nested thread under an Extend or discussion). If null, the annotation attaches directly to the **review comment** root.

UI renders: **Review → list of comments → under each comment, flat or nested annotations** ([M-RV-06]).

---

## Publish review (GitHub healthy)

1. Client `POST /v1/requests/{id}/reviews` with `linked_pull_request_id` and `comments[]` ([REST §7](../api/rest.md)).
2. Server verifies GitHub **`ok`** and PR still valid; insert `reviews` + `review_comments`.
3. **Reviewer tag:** if this is the author’s **first** published `review_comments` row on **any** platform-linked PR → award **Reviewer** ([FR-AC-01], [M-RV-05]).
4. **Request state:** if first published comment on **this** request → **In Review** ([FR-RL-02]).
5. Bump **`user_review_stats`** (and footprint on merge — see [pr-merge-credits](./pr-merge-credits.md)).

---

## Append comment to existing review

- `POST /v1/reviews/{review_id}/comments` when GitHub **`ok`**; same validation and stats updates.

---

## Annotations

| Type | `body_md` | Notes |
|------|-----------|--------|
| **Agree** | Optional; **highly recommended** | Increments agree signal; notify optional ([FR-QA-04]). |
| **Extend** | **Required** | Adds supporting detail; encouraged first action for new coders ([FR-QA-05]). |
| **Flag incorrect** | **Required** | Notifies original commenter ([FR-QA-04]). |

**Threading:** `POST` with optional `parent_annotation_id` to reply under another annotation; server validates the parent belongs to the same `review_comment_id` tree.

**Stats:** maintain annotation counts on **`user_review_stats`** and profile-facing aggregates ([FR-QA-05], [FR-PR-01]).

---

## GitHub degraded — drafts only

When integration is **degraded**, **do not** insert into `reviews` / `review_comments` / `review_annotations` via live endpoints. Users persist **`review_drafts`** and **publish** when GitHub is **`ok`** ([degraded-mode](./degraded-mode.md), [REST §8](../api/rest.md)).

---

## Loading

- List endpoint returns reviews with nested comments and annotation trees; **paginate** comments or reviews per [NFR-PE-05].

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial flow. |
| 1.1 | Chose nested model: reviews → comments → annotations (`parent_annotation_id`); align with drafts + degraded path. |
