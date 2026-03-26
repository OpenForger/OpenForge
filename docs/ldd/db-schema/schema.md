# Database schema (logical)

Primary keys use **UUID** unless a natural stable key is better (e.g. GitHub `node_id`). All timestamps **UTC** (`timestamptz`).

---

## 1. Enumerations

Map to PostgreSQL `ENUM` or lookup tables (prefer lookup tables if values need metadata or i18n keys later).

| Enum                           | Values                                                                                                | Source      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- | ----------- |
| `request_category`             | `tool`, `feature`, `bug_fix`, `ui_ux`, `documentation`                                                | [FR-RL-01]  |
| `request_state`                | `open`, `claimed`, `in_development`, `in_review`, `merged`, `solved`, `stale`, `maintained`, `closed` | [FR-RL-02]  |
| `review_severity`              | `blocker`, `concern`, `suggestion`                                                                    | [FR-QA-03]  |
| `annotation_type`              | `agree`, `extend`, `flag_incorrect`                                                                   | [FR-QA-04]  |
| `vote_kind`                    | `upvote` (v1 only in API; column documents direction explicitly)                                      | [FR-RL-04], [NFR-SE-11] |
| `flag_reason`                  | `duplicate`, `out_of_scope`, `already_solved`                                                         | [FR-RL-04]  |
| `maintainer_nomination_kind`   | `self`, `suggest_user`, `open_volunteer`                                                              | [FR-MN-01]  |
| `maintainer_nomination_status` | `pending`, `accepted`, `rejected`, `superseded`                                                       | Workflow    |
| `moderation_action_type`       | (product-defined)                                                                                     | [NFR-PL-10] |
| `review_draft_status`          | `active`, `discarded`                                                                                 | LLD         |

---

## 2. Core entities

### `users`

| Column                     | Type        | Notes                                 |
| -------------------------- | ----------- | ------------------------------------- |
| `id`                       | UUID        | PK                                    |
| `github_id`                | BIGINT      | Unique; from OAuth                    |
| `github_login`             | TEXT        | Unique; display identity ([FR-GH-02]) |
| `avatar_url`               | TEXT        |                                       |
| `created_at`               | TIMESTAMPTZ |                                       |
| `deleted_at`               | TIMESTAMPTZ | Nullable; anonymise per [NFR-PL-02]   |
| `display_name_replacement` | TEXT        | e.g. `deleted user`                   |

Email from GitHub: store **encrypted** or avoid persistence except where legally required; **never log plain** ([NFR-SE-07]).

### `sessions`

| Column       | Type        | Notes                         |
| ------------ | ----------- | ----------------------------- |
| `id`         | UUID        | PK                            |
| `user_id`    | UUID        | FK → users                    |
| `expires_at` | TIMESTAMPTZ | Inactivity policy [NFR-SE-02] |
| `created_at` | TIMESTAMPTZ |                               |

Implementation may use Redis instead; if so, document session reference table optional.

### `tags`

| Column          | Type        | Notes                                    |
| --------------- | ----------- | ---------------------------------------- |
| `id`            | UUID        | PK                                       |
| `slug`          | TEXT        | Unique; e.g. `linux-desktop`             |
| `parent_id`     | UUID        | Nullable FK → tags; hierarchy [FR-RL-09] |
| `version`       | INT         | Taxonomy version [NFR-MA-01]             |
| `deprecated_at` | TIMESTAMPTZ | Nullable                                 |
| `label_key`     | TEXT        | i18n resource key [NFR-US-10]            |

### `requests`

| Column                    | Type             | Notes                                              |
| ------------------------- | ---------------- | -------------------------------------------------- |
| `id`                      | UUID             | PK                                                 |
| `requester_id`            | UUID             | FK → users                                         |
| `title`                   | TEXT             |                                                    |
| `description_md`          | TEXT             | Markdown [FR-RL-01]                                |
| `motivation_md`           | TEXT             | Nullable                                           |
| `category`                | request_category |                                                    |
| `state`                   | request_state    |                                                    |
| `github_repo_owner`       | TEXT             | Normalised from URL                                |
| `github_repo_name`        | TEXT             |                                                    |
| `github_issue_number`     | INT              |                                                    |
| `github_issue_url`        | TEXT             |                                                    |
| `license_spdx`            | TEXT             | Nullable until PR/In Development rules [NFR-PL-08] |
| `fund_amount_cents`       | BIGINT           | Nullable; future funding [NFR-MA-06]               |
| `good_first_review`       | BOOLEAN          | Default false; filter [FR-AC-04]                   |
| `good_first_contribution` | BOOLEAN          | Default false                                      |
| `created_at`              | TIMESTAMPTZ      |                                                    |
| `updated_at`              | TIMESTAMPTZ      |                                                    |

**Constraints:** enforce tag count 1–8 via trigger or app ([FR-RL-08]).

### `request_tags`

| Column       | Type                   | Notes |
| ------------ | ---------------------- | ----- |
| `request_id` | UUID                   | FK    |
| `tag_id`     | UUID                   | FK    |
| PK           | `(request_id, tag_id)` |       |

### `request_votes`

| Column       | Type                    | Notes |
| ------------ | ----------------------- | ----- |
| `request_id` | UUID                    | FK    |
| `user_id`    | UUID                    | FK    |
| `vote_kind`  | vote_kind               | **v1:** `CHECK (vote_kind = 'upvote')` — FR has no public downvote ([FR-RL-04]); column keeps the model explicit and leaves room for a future **non-public** downvote or moderation signal via schema migration. |
| `created_at` | TIMESTAMPTZ             |       |
| PK           | `(request_id, user_id)` | One row per user per request ([NFR-SE-11]); kind is always `upvote` in v1. |

### `request_flags`

| Column         | Type                            | Notes                                        |
| -------------- | ------------------------------- | -------------------------------------------- |
| `id`           | UUID                            | PK                                           |
| `request_id`   | UUID                            | FK                                           |
| `user_id`      | UUID                            | FK                                           |
| `reason`       | flag_reason                     |                                              |
| `created_at`   | TIMESTAMPTZ                     |                                              |
| Unique         | `(request_id, user_id, reason)` | Optional: one flag type per user per request |

### `claims`

| Column        | Type        | Notes            |
| ------------- | ----------- | ---------------- |
| `id`          | UUID        | PK               |
| `request_id`  | UUID        | FK               |
| `user_id`     | UUID        | FK (contributor) |
| `created_at`  | TIMESTAMPTZ |                  |
| `released_at` | TIMESTAMPTZ | Nullable         |

Rules: multiple claims vs single assignee—align with FR (claim accepted wording).

### `linked_pull_requests`

| Column              | Type        | Notes              |
| ------------------- | ----------- | ------------------ |
| `id`                | UUID        | PK                 |
| `request_id`        | UUID        | FK                 |
| `github_pr_number`  | INT         |                    |
| `github_pr_url`     | TEXT        |                    |
| `github_repo_owner` | TEXT        | Denormalised       |
| `github_repo_name`  | TEXT        |                    |
| `state`             | TEXT        | open/closed/merged |
| `merged_at`         | TIMESTAMPTZ | Nullable           |
| `head_sha`          | TEXT        | Optional sync      |
| `created_at`        | TIMESTAMPTZ |                    |

Unique `(github_repo_owner, github_repo_name, github_pr_number)` for webhook routing.

### `reviews`

Container for **multiple** published comments on one linked PR ([FR-QA-03], API §7).

| Column                   | Type        | Notes                          |
| ------------------------ | ----------- | ------------------------------ |
| `id`                     | UUID        | PK                             |
| `request_id`             | UUID        | FK → requests                  |
| `linked_pull_request_id` | UUID        | FK → linked_pull_requests      |
| `author_id`              | UUID        | FK → users                     |
| `created_at`             | TIMESTAMPTZ |                                |
| `updated_at`             | TIMESTAMPTZ | Optional                       |

### `review_comments`

Each row is one observation (optionally file/line scoped). **No** `parent_comment_id` here — **Extend** is an **annotation**, not a second comment row ([threading choice](../flows/review-annotations.md)).

| Column                   | Type             | Notes                        |
| ------------------------ | ---------------- | ---------------------------- |
| `id`                     | UUID             | PK                           |
| `review_id`              | UUID             | FK → reviews                 |
| `author_id`              | UUID             | FK → users                   |
| `body_md`                | TEXT             | Sanitised render [NFR-SE-09] |
| `severity`               | review_severity  | Nullable                     |
| `file_path`              | TEXT             | Nullable                     |
| `line_start`             | INT              | Nullable                     |
| `line_end`               | INT              | Nullable                     |
| `created_at`             | TIMESTAMPTZ      |                              |

### `review_annotations`

**Comment-on-comment** layer: agrees, extends, flags ([FR-QA-04]). Optional `body_md` for `agree` (highly recommended); **required** for `extend` and `flag_incorrect` at validation layer.

| Column                  | Type             | Notes                                                |
| ----------------------- | ---------------- | ---------------------------------------------------- |
| `id`                    | UUID             | PK                                                   |
| `review_comment_id`     | UUID             | FK → review_comments                                 |
| `author_id`             | UUID             | FK → users                                           |
| `type`                  | annotation_type  |                                                      |
| `body_md`               | TEXT             | Nullable for `agree`; required for `extend` / `flag_incorrect` |
| `parent_annotation_id`  | UUID             | Nullable FK → review_annotations; **threading** under an annotation (e.g. replies to an Extend) |
| `created_at`            | TIMESTAMPTZ      |                                                      |

### `review_drafts`

Persisted **only** while GitHub is degraded or as user WIP; **publish** creates `reviews` + `review_comments` (+ annotations) after validation ([API §8](../api/rest.md), [flow](../flows/degraded-mode.md)).

| Column                   | Type                | Notes |
| ------------------------ | ------------------- | ----- |
| `id`                     | UUID                | PK    |
| `user_id`                | UUID                | FK → users |
| `request_id`             | UUID                | FK → requests |
| `linked_pull_request_id` | UUID                | Nullable FK |
| `payload`                | JSONB               | Mirrors publish body: `comments[]`, optional nested draft annotations with client temp ids |
| `status`                 | review_draft_status | `active` \| `discarded` |
| `created_at`             | TIMESTAMPTZ         |       |
| `updated_at`             | TIMESTAMPTZ         |       |

Index `(user_id, status)` for `/v1/me/review-drafts`.

### `maintainer_nominations`

| Column                   | Type                         | Notes                               |
| ------------------------ | ---------------------------- | ----------------------------------- |
| `id`                     | UUID                         | PK                                  |
| `request_id`             | UUID                         | FK unique active per request policy |
| `kind`                   | maintainer_nomination_kind   |                                     |
| `status`                 | maintainer_nomination_status |                                     |
| `nominated_github_login` | TEXT                         | Nullable for volunteer flow         |
| `volunteer_user_id`      | UUID                         | Nullable FK                         |
| `created_at`             | TIMESTAMPTZ                  |                                     |
| `resolved_at`            | TIMESTAMPTZ                  | Nullable                            |

### `github_webhook_deliveries`

| Column         | Type        | Notes                          |
| -------------- | ----------- | ------------------------------ |
| `delivery_id`  | TEXT        | PK; GitHub `X-GitHub-Delivery` |
| `event_type`   | TEXT        |                                |
| `received_at`  | TIMESTAMPTZ |                                |
| `processed_at` | TIMESTAMPTZ | Nullable                       |
| `status`       | TEXT        | ok / retry / dead              |

### `moderation_audit_log`

Append-only ([NFR-PL-10], [NFR-SE-13]): `id`, `actor_id`, `action`, `target_type`, `target_id`, `metadata_json`, `created_at`.

### `rate_limit_buckets` (optional)

Redis-backed in practice; if SQL audit: `user_id`, `window`, `action_count`.

---

## 3. Denormalised profile tables (read-optimised)

**Strategy:** Maintain these in the **same transaction** as merge, first-review, and annotation events where practical; run a **nightly reconciliation** job from source tables to fix drift ([NFR-PE-03], [NFR-MA-04] additive model).

### `user_contribution_stats`

One row per user; hot path for profile contributor column ([FR-PR-01]).

| Column                         | Type        | Notes |
| ------------------------------ | ----------- | ----- |
| `user_id`                      | UUID        | PK, FK → users |
| `tools_shipped_merged_count`   | INT         | Merged PRs on platform-linked requests |
| `requests_solved_count`        | INT         | Requester-marked solved where user contributed merge |
| `install_signal_band`          | TEXT        | Aggregate display band 10+ / 100+ / … ([FR-QA-07]) |
| `tools_forked_count`           | INT         | From GitHub API cache ([S-GH-01]) |
| `active_maintainerships_count` | INT         | ([FR-PR-01]) |
| `updated_at`                   | TIMESTAMPTZ | |

### `user_review_stats`

| Column                        | Type        | Notes |
| ----------------------------- | ----------- | ----- |
| `user_id`                     | UUID        | PK, FK → users |
| `prs_reviewed_distinct_count` | INT         | Distinct PRs with ≥1 published comment ([FR-PR-01]) |
| `review_comments_count`       | INT         | Total published `review_comments` |
| `reviewing_since`             | TIMESTAMPTZ | First published comment timestamp |
| `comments_agreed_count`       | INT         | Annotations `agree` on user’s comments |
| `comments_extended_count`     | INT         | Annotations `extend` on user’s comments |
| `contrarian_accuracy_count`   | INT         | Nullable / S-PR-01 |
| `updated_at`                  | TIMESTAMPTZ | |

### `user_tag_footprint`

| Column                      | Type        | Notes      |
| --------------------------- | ----------- | ---------- |
| `user_id`                   | UUID        |            |
| `tag_id`                    | UUID        |            |
| `merged_contribution_count` | INT         | [FR-RL-10] |
| `review_activity_count`     | INT         | [FR-RL-11] |
| `updated_at`                | TIMESTAMPTZ |            |
| PK                          | `(user_id, tag_id)` | |

---

## 4. Indexing (initial)

- `requests(state, created_at DESC)` — discovery.
- `requests` GIN on full-text `(title, description_md)` if search is DB-backed ([NFR-PE-04]).
- `request_tags(tag_id, request_id)` — filter by tag.
- `linked_pull_requests(github_repo_owner, github_repo_name, github_pr_number)` — webhook lookup.
- `reviews(request_id, created_at)` — list reviews on request.
- `review_comments(review_id, created_at)` — comments in a review ([NFR-PE-05]).
- `review_annotations(review_comment_id, created_at)` — thread under comment.
- `review_drafts(user_id, status)` — my drafts.
- `users(github_login)` — profile URL.

Run **EXPLAIN ANALYZE** before release ([NFR-PE-11]).

---

## 5. Row-level security

Optional PostgreSQL RLS for defence in depth; app-layer auth remains mandatory ([NFR-SE-03]).

---

## Revision history

| Version | Changes |
| ------- | ------- |
| 1.0     | Initial schema LLD. |
| 1.1     | `reviews` + `review_comments` + `review_annotations` threading; `review_drafts`; `vote_kind`; denormalised profile tables; removed comment `parent_review_id` pattern. |
