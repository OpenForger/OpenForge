# Flow: Request lifecycle

**Sources:** [FR-RL-01], [FR-RL-02], [FR-RL-04], [FR-MN-02], [M-RQ-05], [M-CL-01]–[M-CL-03].

---

## State machine (summary)

```
Open → Claimed → In Development → In Review → Merged → Solved
  │                                    │
  └──────────────── Closed ────────────┘
  │
  └─ (Tool only) → Stale → Maintained ([FR-RL-02], [FR-QA-08])
```

**Rules**

- States are **mutually exclusive**; persist single `request_state`.
- Transitions driven by: user actions (claim, PR link, first review, solved), **webhooks** (merge), automation (stale job), moderation (close).

---

## Create request

1. Authenticated user submits POST with required fields ([FR-RL-01]).
2. Validate category, repo URL, issue URL, tag count 1–8, curated tags.
3. If **Tool + new repo**: require maintainer nomination payload before publish or before Claimed (per [FR-MN-02])—product choice: block **publish** vs block **claim**; FR says shall not progress past Claimed without maintainer.
4. Insert `requests` + `request_tags`; set `state = open`.
5. Optionally enqueue GitHub sanity checks (issue exists).

---

## Voting

1. POST upvote: insert `request_votes` if not exists.
2. Duplicate: **silent success** ([NFR-SE-11]); no error UI.
3. Enforce rate limit ([NFR-SE-10]).

---

## Flags → moderation

1. User submits flag with reason ([FR-RL-04]).
2. Count **distinct users** per request crossing threshold (default 5, configurable [NFR-PL-09]) → create moderation queue item.
3. Do **not** expose downvotes publicly ([FR-RL-04]).

---

## Claim

1. User posts claim on **open** (or policy-allowed) request.
2. Validate maintainer resolved for Tool path ([FR-MN-02]).
3. Insert `claims`; set `state = claimed` if first claim.

---

## Link PR

1. Contributor submits PR URL ([M-CL-02]).
2. GitHub API: verify PR exists, open, repo matches request ([M-CL-03]).
3. Insert `linked_pull_requests`; set `state = in_development` if `state != in_review`.
4. Optionally enqueue Actions status fetch ([M-CI-01]).

---

## First published review comment

1. On first **published** `review_comments` row on the request (via [reviews](../db-schema/schema.md)) → `state = in_review` ([FR-RL-02] table). Drafts do not transition state ([degraded-mode](./degraded-mode.md)).

---

## Merge (see [pr-merge-credits](./pr-merge-credits.md))

Webhook sets `merged`; then requester may mark `solved`.

---

## Solved / Closed

- **Solved:** requester-only action ([FR-RL-02]).
- **Closed:** withdraw or moderation/out-of-scope.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial flow. |
| 1.1 | In Review tied to published `review_comments`; draft exception. |
