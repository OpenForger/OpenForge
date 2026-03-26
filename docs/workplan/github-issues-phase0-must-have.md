# Phase 0 — GitHub issues (Must-Have groups)

**Purpose:** Satisfy [WP-1.0 §2 precondition](./openforge-WP-1.0.md): *one GitHub issue per Must-Have feature group* in the **canonical platform repo**, with bodies ready to paste. In **Phase 1**, reuse the same text (or link these issues) when filing **platform requests** ([WP-1.0 §4.1](./openforge-WP-1.0.md)).

**How to use**

1. In the platform repository on GitHub, create **one issue per section** below (**8 issues** if Auth is already shipped and you skip §1; **9** if you also want a paper-trail issue for Auth).
2. Optional labels: use the suggested **Labels** line if your repo uses a label set; otherwise skip or map to your convention.
3. After creation, add the resulting GitHub URLs to your tracker or to WP-1.0 §2.1 status.

**Source of truth for requirement text:** [APD-1.0 §4 MoSCoW — Must Have](../architecture/openforge_APD-1.0.md).

### Tracked issues — [OpenForger/OpenForge](https://github.com/OpenForger/OpenForge)

**§1 Auth:** No GitHub issue — OAuth, session, and GitHub identity are **already implemented** in `app/` (M-AU-01–M-AU-03). The precondition is satisfied without a separate tracking issue.

**§2–§9:** Section numbers in this file map to GitHub issue **`#(section − 1)`** (because §1 has no issue).

| § | Epic | Issue |
|---|------|--------|
| 2 | Requests (M-RQ-01–M-RQ-06) | [#1](https://github.com/OpenForger/OpenForge/issues/1) |
| 3 | Claim + PR (M-CL-01–M-CL-03) | [#2](https://github.com/OpenForger/OpenForge/issues/2) |
| 4 | Webhooks (M-WH-01–M-WH-04) | [#3](https://github.com/OpenForger/OpenForge/issues/3) |
| 5 | Reviews (M-RV-01–M-RV-06) | [#4](https://github.com/OpenForger/OpenForge/issues/4) |
| 6 | Profiles (M-PR-01–M-PR-05) | [#5](https://github.com/OpenForger/OpenForge/issues/5) |
| 7 | Maintainer (M-MN-01–M-MN-03) | [#6](https://github.com/OpenForger/OpenForge/issues/6) |
| 8 | CI display (M-CI-01–M-CI-02) | [#7](https://github.com/OpenForger/OpenForge/issues/7) |
| 9 | Moderation (M-MD-01–M-MD-03) | [#8](https://github.com/OpenForger/OpenForge/issues/8) |

---

## 1 — Auth

**Title:** `Phase 0 — Auth: GitHub OAuth, session, identity (M-AU-01–M-AU-03)`

**Labels:** `phase-0`, `must-have`, `area-auth`

**Body:**

```markdown
## Summary
Deliver GitHub-based login, platform identity, and session policy so every actor can use staging. Maps to **Phase 0 Sprint 1** in `docs/workplan/openforge-WP-1.0.md`.

## Requirements
| ID | Deliverable |
|----|-------------|
| **M-AU-01** | GitHub OAuth login and session management |
| **M-AU-02** | GitHub username as platform identity — no separate registration |
| **M-AU-03** | Session persistence with **30-day inactivity** expiry |

## Done when
- [ ] User can complete OAuth on staging; callback and cookie behaviour match `docs/ldd/flows/authentication-session.md` and `docs/deployment/github-oauth-app.md`.
- [ ] Session survives refresh; expires per NFR-SE-02 / M-AU-03.
- [ ] Logout clears session as documented.

## References
- `docs/architecture/openforge_APD-1.0.md` (Must Have — Auth)
- `docs/deployment/github-oauth-app.md`
```

---

## 2 — Requests (submit, list, detail, vote, state, tags)

**Title:** `Phase 0 — Requests: CRUD surface, votes, state machine, tags (M-RQ-01–M-RQ-06)`

**Labels:** `phase-0`, `must-have`, `area-requests`

**Body:**

```markdown
## Summary
Requests are the entry point of the platform loop. This epic covers **Sprints 2–3** in `docs/workplan/openforge-WP-1.0.md`: read/write UX, prioritisation, lifecycle states, and curated tags.

## Requirements
| ID | Deliverable |
|----|-------------|
| **M-RQ-01** | Submission form: title, description, category, tags, linked repo, linked GitHub issue |
| **M-RQ-02** | Listing with basic sort (e.g. newest, most voted) |
| **M-RQ-03** | Request detail page |
| **M-RQ-04** | Upvote (one per account) |
| **M-RQ-05** | State machine: Open → Claimed → In Development → In Review → Merged → Solved → Closed (and tool-specific states per FR-RL-02) |
| **M-RQ-06** | Tags from curated taxonomy (FR-1.1 Appendix A seed) |

## Done when
- [ ] Tool-typed request can be created end-to-end on staging with valid links and tags.
- [ ] States and categories align with `docs/openforge-DL-1.0.md` and FR-RL-02.

## References
- `docs/ldd/flows/request-lifecycle.md`
- `docs/ldd/db-schema/schema.md`
```

---

## 3 — Claim and linked PR

**Title:** `Phase 0 — Claim + PR link + GitHub verification (M-CL-01–M-CL-03)`

**Labels:** `phase-0`, `must-have`, `area-claims`

**Body:**

```markdown
## Summary
Bridge platform requests to GitHub: claim, attach an **open** PR, verify via API. **Phase 0 Sprint 4** in `docs/workplan/openforge-WP-1.0.md`.

## Requirements
| ID | Deliverable |
|----|-------------|
| **M-CL-01** | Contributor can claim an open request |
| **M-CL-02** | Contributor submits GitHub PR URL linked to the request |
| **M-CL-03** | Platform verifies PR exists, is open, and matches repo/issue via GitHub API |

## Done when
- [ ] Claim transitions state appropriately (see M-RQ-05).
- [ ] Invalid or mismatched PR URLs are rejected with clear errors (NFR-US-09).

## References
- `docs/ldd/api/rest.md`
- `docs/ldd/flows/pr-merge-credits.md`
```

---

## 4 — GitHub webhooks

**Title:** `Phase 0 — Webhooks: receiver, HMAC, merge handler, retries (M-WH-01–M-WH-04)`

**Labels:** `phase-0`, `must-have`, `area-webhooks`

**Body:**

```markdown
## Summary
Ingest GitHub `pull_request` (and related) events securely; on merge, update request state and downstream credit. **Phase 0 Sprint 5** in `docs/workplan/openforge-WP-1.0.md`.

## Requirements
| ID | Deliverable |
|----|-------------|
| **M-WH-01** | Webhook receiver for PR events (opened, sync, closed/merged) |
| **M-WH-02** | HMAC-SHA256 signature verification |
| **M-WH-03** | Merge handler: request → **Merged**, contributor credit, tag inheritance to footprint |
| **M-WH-04** | Retry queue with backoff (e.g. up to 24h); DLQ / replay story per LLD |

## Done when
- [ ] Staging webhook passes GitHub “Recent Deliveries” and handles a test merge.
- [ ] Missed deliveries can be recovered (replay or manual reconcile documented).

## References
- `docs/ldd/api/github-webhooks.md`
- `docs/ldd/jobs/queues-and-delivery.md`
- `docs/ldd/security/authentication-and-webhooks.md`
```

---

## 5 — Reviews and annotations

**Title:** `Phase 0 — Reviews: platform comments, severity, Agree/Extend/Flag, threads (M-RV-01–M-RV-06)`

**Labels:** `phase-0`, `must-have`, `area-reviews`

**Body:**

```markdown
## Summary
Platform-native review layer on linked PRs: comments with severity, three annotation types, Reviewer tag, thread UI. **Phase 0 Sprint 6** in `docs/workplan/openforge-WP-1.0.md`.

## Requirements
| ID | Deliverable |
|----|-------------|
| **M-RV-01** | Review comment with optional severity (Blocker / Concern / Suggestion) |
| **M-RV-02** | **Agree** annotation |
| **M-RV-03** | **Extend** annotation (thread reply) |
| **M-RV-04** | **Flag as incorrect** with required explanation |
| **M-RV-05** | **Reviewer** tag on first published review comment (per FR) |
| **M-RV-06** | Thread UI: inline, indented, counts visible |

## Done when
- [ ] Phase 0 exit smoke path: multiple users can Agree / Extend / Flag on a real linked PR.
- [ ] API aligns with `docs/ldd/api/rest.md` (review endpoints).

## References
- `docs/openforge-DL-1.0.md` (terminology & severity)
```

---

## 6 — Profiles

**Title:** `Phase 0 — Profiles: unified page, stats, tags, timeline (M-PR-01–M-PR-05)`

**Labels:** `phase-0`, `must-have`, `area-profiles`

**Body:**

```markdown
## Summary
Public profiles prove the loop: contributor + reviewer signals, activity tags, colour-coded timeline. **Phase 0 Sprint 7** in `docs/workplan/openforge-WP-1.0.md`.

## Requirements
| ID | Deliverable |
|----|-------------|
| **M-PR-01** | Single profile: contributor and reviewer activity together |
| **M-PR-02** | Contributor signals: tools shipped, requests solved, domain footprint by tag |
| **M-PR-03** | Reviewer signals: PRs reviewed, comments, dates, agree/extend counts |
| **M-PR-04** | Activity tags (Contributor, Reviewer, Requester, Maintainer) automatic |
| **M-PR-05** | Week-by-week timeline with canonical colours (`docs/openforge-DL-1.0.md` §6.1) |

## Done when
- [ ] After one merged dogfood PR, profile shows expected credit and timeline colours.
- [ ] Denormalised reads consistent with `docs/ldd/db-schema/schema.md` §3.
- [ ] Profile core readable without JS where required (NFR-US-04).

## References
- `docs/requirements/openforge_NFR-1.1.tex`
```

---

## 7 — Maintainer nomination

**Title:** `Phase 0 — Maintainer: self-nominate, volunteer, CODEOWNERS (M-MN-01–M-MN-03)`

**Labels:** `phase-0`, `must-have`, `area-maintainer`

**Body:**

```markdown
## Summary
Nomination paths for Tool repos and merge authority via CODEOWNERS. **Phase 0 Sprint 8** in `docs/workplan/openforge-WP-1.0.md`. OpenForge repo dogfoods **M-MN-01**.

## Requirements
| ID | Deliverable |
|----|-------------|
| **M-MN-01** | Requester self-nomination for new Tool repositories |
| **M-MN-02** | Contributor can volunteer as Maintainer when claim is accepted |
| **M-MN-03** | CODEOWNERS creation/update on nomination acceptance (GitHub API) |

## Done when
- [ ] OpenForge (or stand-in Tool) can complete nomination path without blocking at Claimed.
- [ ] Team understands CODEOWNERS + self-nomination (WP-1.0 §2 companion row).

## References
- `docs/ldd/flows/maintainer-nomination.md`
- `docs/workplan/openforge-codeowners-bootstrap.md` (founding repo before M-MN-03 automation)
```

---

## 8 — CI display

**Title:** `Phase 0 — CI: GitHub Actions status on request + attribution workflow template (M-CI-01–M-CI-02)`

**Labels:** `phase-0`, `must-have`, `area-ci`

**Body:**

```markdown
## Summary
Surface GitHub check status for linked PRs on the request page; ship template workflow for platform-owned checks. **Part of Phase 0 Sprint 9** in `docs/workplan/openforge-WP-1.0.md`.

## Requirements
| ID | Deliverable |
|----|-------------|
| **M-CI-01** | Read Actions/check statuses for linked PRs; display on request detail |
| **M-CI-02** | Repo template workflow (e.g. attribution header, request ID in PR body) |

## Done when
- [ ] Failed checks visible before deep review (FR-QA-01).
- [ ] Template documented for contributors.

## References
- `docs/ldd/flows/request-lifecycle.md`
```

---

## 9 — Moderation baseline

**Title:** `Phase 0 — Moderation: flags, threshold queue, audit log (M-MD-01–M-MD-03)`

**Labels:** `phase-0`, `must-have`, `area-moderation`

**Body:**

```markdown
## Summary
Minimal trust & safety: flag reasons, automatic queue entry, append-only audit. **Part of Phase 0 Sprint 9** in `docs/workplan/openforge-WP-1.0.md`.

## Requirements
| ID | Deliverable |
|----|-------------|
| **M-MD-01** | Flag request: duplicate / out of scope / already solved (or agreed set) |
| **M-MD-02** | Configurable threshold (e.g. 5 flags) → moderation queue |
| **M-MD-03** | Append-only moderation audit log |

## Done when
- [ ] Moderator can process queue; every action leaves an audit trail.
- [ ] Aligns with `docs/ldd/security/privacy-and-audit.md`.

## References
- `docs/architecture/openforge_APD-1.0.md` (Must Have — Moderation)
```

---

## After you create the issues

Issue bodies use **repo-root paths** (`docs/...`) so they read correctly on GitHub next to your tree.

| Checklist |
|-----------|
| [ ] Eight (or nine) issues created in platform repo; mapping noted above for OpenForge |
| [ ] Optional: pin or milestone “Phase 0 — Must Have” |
| [ ] Phase 1: link platform requests to these GitHub issues where useful |

---

*Companion to [WP-1.0](./openforge-WP-1.0.md). Requirement IDs match [APD-1.0](../architecture/openforge_APD-1.0.md).*
