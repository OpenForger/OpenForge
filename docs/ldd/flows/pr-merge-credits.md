# Flow: PR merge & credits

**Sources:** [FR-QA-06], [FR-RL-10], [FR-RL-11], [FR-GH-05], [M-WH-01]–[M-WH-03].

---

## Trigger

GitHub `pull_request` event with `action` = `closed` and `merged` = `true` (or equivalent merged signal).

---

## Steps (single transactional unit preferred)

1. **Verify** webhook signature ([NFR-SE-04]).
2. **Idempotency:** skip if this `delivery_id` or merge event already processed.
3. Resolve `linked_pull_requests` row → `request_id`, contributor = PR author (GitHub login → `users`).
4. Update PR row: `state = merged`, `merged_at`.
5. Update request: `state = merged` (if policy: first merged PR wins or any merge—align with FR).
6. **Credit contributor:** increment merge stats; award **Contributor** tag on first merge ([FR-PR-02]).
7. **Tag inheritance:** for each `request_tags.tag_id`, upsert `user_tag_footprint` **merged_contribution** counts ([FR-RL-10]).
8. **Reviewers:** for each distinct user who authored **`review_comments`** on this request’s linked PR, upsert `user_tag_footprint.review_activity` ([FR-RL-11]) and refresh **`user_review_stats`** from source or deltas.
9. **Notify** requester and watchers (channels TBD; respect email privacy [NFR-PL-01]).

---

## Partial failure

- Retry queue ([NFR-RE-06]); never lose user-submitted platform data ([NFR-RE-07]).
- If footprint update fails after state commit: **reconciliation job** to recompute from source tables.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial flow. |
| 1.1 | Reference `reviews` / `review_comments` + denormalised stats. |
