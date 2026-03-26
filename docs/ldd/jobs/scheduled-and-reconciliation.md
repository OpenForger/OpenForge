# Scheduled jobs & reconciliation

**Sources:** [NFR-PE-10], [NFR-RE-05], [FR-QA-08], [S-PR-02], [C-MN-01], [NFR-PE-13].

---

## 1. Package registry polling ([S-PR-02], [NFR-PE-10])

| Aspect | Design |
|--------|--------|
| Trigger | **Cron** (e.g. hourly) or per-request stagger to spread load. |
| Execution | **Isolated worker**; never block API request path. |
| Behaviour | Fetch PyPI/npm/crates/AUR as linked from tool metadata; update cached **install band** + `fetched_at` ([integrations](../integrations/package-registries.md)). |
| Failure | Keep last value; log warning; metric `openforge_registry_poll_failures_total`. |

---

## 2. GitHub metadata refresh ([NFR-PE-13])

| Job | Frequency | Notes |
|-----|-----------|--------|
| Fork count | Daily per active shipped tool | [S-GH-01] |
| Check runs / head SHA | On webhook or periodic for stale PRs | Align with degraded staleness UX |
| Open PR validation | Low frequency reconcile | Fix drift if webhook missed |

Batch and **cache** responses to stay within GitHub rate limits ([NFR-PE-13]).

---

## 3. Stale Tool repository workflow ([FR-QA-08], [C-MN-01])

| Aspect | Design |
|--------|--------|
| Eligibility | **Tool** requests with platform-created repo only; **180 days** post-merge no commits. |
| Job | **Daily** scan; transition state; notify Nominated Maintainer ([FR-QA-08]). |
| Volume | **Could Have** for v1.0 per APD — implement job + feature flag off until launch criteria met. |

---

## 4. Denormalised stats reconciliation

| Job | Frequency | Notes |
|-----|-----------|--------|
| `user_contribution_stats` / `user_review_stats` / `user_tag_footprint` | **Nightly** full recompute from source tables | Heals drift after partial failures ([schema §3](../db-schema/schema.md)). |
| Compare checksum or row counts | Optional alert if delta > threshold | |

---

## 5. Webhook DLQ replay

- **Manual** replay from operator tool after fixing bug; re-validate idempotency keys.
- Optional **scheduled** sweep: retry DLQ items once if error class was transient (use cautiously).

---

## 6. Session cleanup

- **Cron:** delete expired sessions older than retention window ([NFR-SE-02]).

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial jobs LLD. |
