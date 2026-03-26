# OpenForge — Workplan v1.0 (Dogfooding)

| **Document ID** | WP-1.0 |
| **Version** | 1.5 |
| **Status** | Draft |
| **Date** | March 2026 |
| **Source of truth** | [APD-1.0](../architecture/openforge_APD-1.0.md) (MoSCoW + dogfooding workflow) |
| **Related** | [FR-1.1](../requirements/openforge_FR-1.1.tex), [NFR-1.1](../requirements/openforge_NFR-1.1.tex), [LLD](../ldd/README.md), [DL-1.0](../openforge-DL-1.0.md) |

This document turns the APD into an **execution-oriented workplan**: phases, gates, deliverables, and how the team **eats its own dogfood** after Phase 0. It does not replace the APD; it operationalises it.

---

## 1. North star

**Dogfooding constraint (from APD):** Ship the **thinnest** OpenForge that can run the full loop: *request → claim → PR link → platform reviews + annotations → merge (webhook) → contributor credit → profile truth*.

**Non-negotiable rule (post–Phase 0):** No new user-visible behaviour ships without a **platform request**, **claim**, and **linked PR**—except **critical security** patches ([APD §3](../architecture/openforge_APD-1.0.md)).

---

## 2. Preconditions (before Sprint 1)

| Item | Owner | Done when |
|------|-------|-----------|
| GitHub **organisation** + canonical **platform repo** | Founding | Repo exists; default branch protected as policy dictates |
| **UI foundation** (theming + shell + shadcn primitives) | Founding | `app/src/app.css` matches [theming](../ui-ux/theming.md); nav shell matches [ui-patterns §1](../ui-ux/ui-patterns.md); demo components on home |
| GitHub **OAuth App** (staging + prod callbacks) | Founding | Client ID/secret in secret store; scopes documented ([LLD security](../ldd/security/authentication-and-webhooks.md)); [setup guide](../deployment/github-oauth-app.md) |
| Deployment **target** (containers, Postgres, Redis) | Founding | Staging namespace/cluster or VM compose runs empty stack |
| **One GitHub issue per Must-Have feature group** (Auth, Requests, Claim/PR, Webhook, Reviews, Profile, Maintainer, CI display, Moderation) | Founding | **OpenForge:** Auth in `app/` (no tracking issue); other groups tracked as [GitHub issues #1–#8](https://github.com/OpenForger/OpenForge/issues) — see **§2.2**; reuse in Phase 1 platform requests |
| **CODEOWNERS** + self-nomination path understood for Tool repo | Founding | [`.github/CODEOWNERS`](../../.github/CODEOWNERS) on default branch; team understands [bootstrap for founding repo](../ldd/flows/maintainer-nomination.md#bootstrap-openforge-platform-repo) (M-MN-01–M-MN-03) |

### 2.1 Status (rolling)

| Item | Status |
|------|--------|
| Org + platform repo + initial SvelteKit commit | Done (confirm branch protection locally) |
| UI foundation | Done — see `app/` (SvelteKit under Git root `web/`) |
| GitHub OAuth App | Done — callback + session in `app/`; secrets in `app/.env.secret` ([github-oauth-app.md](../deployment/github-oauth-app.md)) |
| Deployment target | **In progress** — `deploy/compose/` + [staging-stack.md](../deployment/staging-stack.md); complete when Compose runs and §B checks pass |
| GitHub issues (Must groups) | Done — [OpenForge](https://github.com/OpenForger/OpenForge/issues) **#1–#8** per §2.2 |
| CODEOWNERS + nomination path | Done — [`.github/CODEOWNERS`](../../.github/CODEOWNERS) + [maintainer nomination bootstrap](../ldd/flows/maintainer-nomination.md#bootstrap-openforge-platform-repo) |

### 2.2 OpenForge platform repo — Must-Have GitHub issues

Canonical repo: **[OpenForger/OpenForge](https://github.com/OpenForger/OpenForge)**. Auth epic has no issue (already implemented in `app/`). Remaining groups map **GitHub issue number = workplan epic order after Auth** (first epic = #1).

| Issue | Must-Have group | Req IDs |
|-------|-----------------|---------|
| — | Auth | M-AU-01–M-AU-03 (in `app/`) |
| [#1](https://github.com/OpenForger/OpenForge/issues/1) | Requests | M-RQ-01–M-RQ-06 |
| [#2](https://github.com/OpenForger/OpenForge/issues/2) | Claim + PR | M-CL-01–M-CL-03 |
| [#3](https://github.com/OpenForger/OpenForge/issues/3) | Webhooks | M-WH-01–M-WH-04 |
| [#4](https://github.com/OpenForger/OpenForge/issues/4) | Reviews | M-RV-01–M-RV-06 |
| [#5](https://github.com/OpenForger/OpenForge/issues/5) | Profiles | M-PR-01–M-PR-05 |
| [#6](https://github.com/OpenForger/OpenForge/issues/6) | Maintainer | M-MN-01–M-MN-03 |
| [#7](https://github.com/OpenForger/OpenForge/issues/7) | CI display | M-CI-01–M-CI-02 |
| [#8](https://github.com/OpenForger/OpenForge/issues/8) | Moderation | M-MD-01–M-MD-03 |

---

## 3. Phase 0 — Bootstrap (no platform gate)

**Goal:** Staging deployment where the founding team completes **one full loop** without using the platform to govern commits yet ([APD §3.1](../architecture/openforge_APD-1.0.md)).

### 3.1 Sprint map (aligned to APD §4)

Sprint length is indicative (e.g. 1–2 weeks); adjust to team size.

| Sprint | APD ref | Deliverables (engineering) | Exit notes |
|--------|---------|----------------------------|------------|
| **S1** | Sprint 1 | **Auth:** OAuth callback, session (30-day inactivity), `/me`, GitHub identity — [M-AU-01]–[M-AU-03] | Can log in on staging |
| **S2** | Sprint 2 | **Requests read/write:** create/list/detail/upvote — [M-RQ-01]–[M-RQ-04] | Seed taxonomy in DB; basic UI |
| **S3** | Sprint 3 | **State + tags:** state machine hooks, curated tags — [M-RQ-05], [M-RQ-06] | States consistent with [FR-RL-02] |
| **S4** | Sprint 4 | **Claim + PR:** claim, link PR, GitHub verify — [M-CL-01]–[M-CL-03] | PR must match repo/issue |
| **S5** | Sprint 5 | **Webhooks:** receiver, HMAC, merge handler, retries/DLQ — [M-WH-01]–[M-WH-04] | [LLD jobs](../ldd/jobs/queues-and-delivery.md) |
| **S6** | Sprint 6 | **Reviews:** multi-comment reviews, annotations Agree/Extend/Flag, thread UI — [M-RV-01]–[M-RV-06] | Align with [REST §7](../ldd/api/rest.md) / [schema](../ldd/db-schema/schema.md) |
| **S7** | Sprint 7 | **Profiles:** unified page, stats, activity tags, timeline colours — [M-PR-01]–[M-PR-05] | Denormalised reads per [schema §3](../ldd/db-schema/schema.md) |
| **S8** | Sprint 8 | **Maintainer:** self-nominate + volunteer + CODEOWNERS PR — [M-MN-01]–[M-MN-03] | OpenForge repo nominated |
| **S9** | Sprint 9 | **CI read + moderation:** Actions status on request; flags; threshold queue; audit log — [M-CI-01], [M-CI-02], [M-MD-01]–[M-MD-03] | [LLD security audit](../ldd/security/privacy-and-audit.md) |

**Parallel tracks:** From S2 onward, add **integration tests** for webhook replay ([NFR-MA-08]) and **structured logging** ([S-NF-03]) as early as possible; do not block S9.

### 3.2 Phase 0 exit gate (checklist)

All must be true on **staging** ([APD Phase 0 exit](../architecture/openforge_APD-1.0.md)):

- [ ] User A logs in with GitHub; session survives refresh; expires per policy.
- [ ] User B submits a **Tool-typed** request for the OpenForge repo with linked issue + tags (or agreed stand-in repo for first run).
- [ ] User B **claims** request; links an **open** PR; platform verifies via GitHub API.
- [ ] User C posts a **review** with ≥1 comment + **severity**; User D **Agree**s; User E **Extend**s; User F **Flag incorrect** with explanation (smoke path).
- [ ] **Maintainer** merges PR on GitHub; webhook updates state to **Merged**, credits contributor, updates **footprint** / stats.
- [ ] Profiles show expected **Contributor / Reviewer** signals and **timeline** colours per [DL-1.0 §6.1](../openforge-DL-1.0.md#61-profile-activity-timeline-canonical-colours).

**Failure handling:** If any step fails, Phase 0 does not end; open **internal** tickets until the loop passes once.

---

## 4. Phase 1 — Minimum viable dogfood

**Goal:** Every new capability ships **through** the platform; founding team rotates **Requester / Contributor / Reviewer / Maintainer** hats ([APD §3.2](../architecture/openforge_APD-1.0.md)).

### 4.1 Week 0 (transition)

| Action | Detail |
|--------|--------|
| File platform requests | Convert pre-written GitHub issues → platform requests (category **Tool** or **Feature** as appropriate); link same GitHub issues. |
| Communicate rule | Team agrees: **no direct-to-main feature commits** without request + linked PR (security excepted). |
| Deploy | Promote staging to **private production** or restricted staging used as “live” for dogfood. |

### 4.2 Week 1–3 (illustrative sequence from APD)

| Week | Build focus | Dogfood validation |
|------|-------------|-------------------|
| 1 | Submit **Should** items as real requests (e.g. good-first filters, suggest-maintainer, Solved mark — [S-RQ-01]–[S-RQ-03]) | Form, linking, Open state, listing sort |
| 1–2 | Claim → PR → link | Claimed → In Development; PR verification |
| 2 | Annotations on real OpenForge PRs | In Review; Reviewer tag; thread counts |
| 2–3 | Merge → profile | Merged; footprint; contributor stats |
| 3 | Requester **Solved** ([S-RQ-02]) | Solved signal on profile |
| 3 | Invite **5–10** external trusted contributors | Cold start, real annotations |

### 4.3 Phase 1 exit (to Phase 2)

Per APD: external cohort has used the product; you are ready to scale **Should** delivery through community claims. Capture **quantitative** baseline: merges via platform, annotation counts, time Open → Merged for OpenForge repo.

---

## 5. Phase 2 — Should Have through the loop

**Goal:** Majority of **Should** features delivered via platform requests; community contributors earn **Contributor** on OpenForge itself ([APD §3.3](../architecture/openforge_APD-1.0.md)).

### 5.1 Ordering (suggested)

1. **S-RQ-01**–**S-RQ-04** (discovery + solved + maintainer suggest + tag proposals)  
2. **S-PR-02**, **S-GH-01**–**S-GH-03** (signals + GitHub niceties)  
3. **S-PR-01** (contrarian accuracy — needs data; schedule after volume)  
4. **S-CI-01**, **S-MD-01** (hygiene + governance)  
5. **S-NF-01**–**S-NF-04** (a11y, progressive enhancement, logging, metrics) — **start architecture early** even if audit finishes late  

Each row: **request** → **claim** → **PR** → **annotations** → **merge** → **solved** (where applicable).

### 5.2 Phase 2 exit gate (APD)

- [ ] All **Should** items shipped **or** explicitly deferred with written rationale  
- [ ] ≥ **25** open requests across ≥ **5** tags (ecosystem seeding)  
- [ ] ≥ **3** **external** users with **Contributor** tag from **merged** OpenForge PRs  

---

## 6. Phase 3 — Launch readiness

**Goal:** Public v1.0 with credible surface area and hardening ([APD §3.4](../architecture/openforge_APD-1.0.md)).

| Workstream | Tasks |
|------------|--------|
| **Accessibility** | WCAG 2.1 AA audit; failures filed as **platform requests** and fixed through the loop ([S-NF-01]) |
| **Content** | ≥ **40** curated Linux tooling requests (FR Appendix A coverage) |
| **Docs** | README, contributing, request guide — as **Documentation** requests merged via dogfood |
| **Performance** | Load test to **1,000** concurrent users ([NFR-PE-07]); fix regressions via requests |
| **Security** | Review OAuth, webhooks, CODEOWNERS token scope; remediate via requests |
| **Narrative** | Launch post links **OpenForge’s own request history** as proof |

---

## 7. Ongoing discipline (post-launch)

From [APD §3.5](../architecture/openforge_APD-1.0.md):

| Rule | Implementation hint |
|------|---------------------|
| User-visible change → platform request | Template for “feature / bug / UI” requests; CI check optional (PR title/body mentions request ID) |
| README **live count** of linked requests | Small widget or badge fed by API |
| **Quarterly transparency report** | Documentation request + merge; metrics: opened/claimed/merged, annotation counts |
| **Tag footprint** for OpenForge org | Visible like any project — `platform-infrastructure`, `web`, `postgresql`, `redis`, etc. |

**Exempt without request:** internal refactors, dependency bumps, **critical security** patches.

---

## 8. Risk register (condensed)

| Risk | Mitigation |
|------|------------|
| Phase 0 drags | Cut UI polish; keep loop vertical slice; use LLD drafts for GitHub-down UX later |
| Webhook reliability | DLQ + replay from day one ([M-WH-04]); monitor p95 latency ([NFR-MA-14]) |
| Single maintainer bottleneck | Document volunteer path [M-MN-02]; rotate maintainer merges in dogfood |
| A11y deferred too long | SSR profiles ([NFR-US-04]); axe in CI early ([NFR-US-05]) |
| Dogfood rule fatigue | Make request creation **fast** (templates); celebrate merged “meta” requests in retro |

---

## 9. Traceability

| This workplan | APD section |
|---------------|-------------|
| §3 | APD §3.1, §4 Sprints 1–9 |
| §4 | APD §3.2 |
| §5 | APD §3.3, §4 Sprints 11–20 |
| §6 | APD §3.4, §4 Sprints 21–22 |
| §7 | APD §3.5 |

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial workplan from APD-1.0. |
| 1.1 | Preconditions: UI foundation row, OAuth guide link, rolling status. |
| 1.2 | Must-Have GitHub issues: companion doc with paste-ready issue bodies (later folded into §2.2). |
| 1.3 | OpenForge: Auth without GH issue; platform issues #1–#8; §2.1 status updated. |
| 1.4 | CODEOWNERS: `.github/CODEOWNERS` + bootstrap in maintainer LLD; §2.1 split. |
| 1.5 | §2.2 issue table; CODEOWNERS row done; removed task-only workplan MDs; Cursor rule frontmatter fixed. |

---

*OpenForge WP-1.0 — Build the platform through the platform.*
