# OpenForge — Design Language

| **Document ID** | DL-1.0 |
| **Version** | 1.2 |
| **Status** | Draft |
| **Date** | March 2026 |
| **Companion** | [FR-1.1](requirements/openforge_FR-1.1.tex), [NFR-1.1](requirements/openforge_NFR-1.1.tex), [UI / UX](ui-ux/README.md), [LLD](ldd/README.md) |

This document translates product and quality requirements into **experience, language, and interface conventions** for OpenForge. It does not replace FR/NFR; it guides designers and engineers so implementations stay consistent with those sources.

---

## 1. Purpose

OpenForge is a **lightweight prioritisation and reputation layer** on top of GitHub: demand voting, review annotation, and domain-tagged profiles. The design language should reinforce **clarity, trust, and equal dignity** for every actor—especially **new coders**, who are first-class participants, not a separate tier.

---

## 2. Product principles (from FR)

These are non-negotiable experience anchors; every surface should be checkable against them.

| Principle | Implication for design |
|-----------|-------------------------|
| **New coders first-class** | No UI that implies junior/senior lanes. Same threads, same visibility, same affordances for first review as for experienced reviewers ([FR-AC-01]–[FR-AC-03]). |
| **No permission walls** | Avoid copy like “unlock after X” or progress gates that block core actions. Differentiation is the **public record**, not locked features ([FR infobox: design principle]). |
| **GitHub as source of truth for code** | Prefer linking out or embedding GitHub context; do not duplicate issue threads as if they were the canonical UI ([FR-GH-01], [FR-GH-03]). |
| **Transparent, verifiable reputation** | Profiles show **raw activity**; the platform does not assign scores or grades ([FR “What Employers See”]). |
| **Lightweight platform** | Favour simple layouts, fast scans, and obvious next steps over decorative chrome (aligns with NFR lightweight architecture). |

---

## 3. Voice and tone

| Attribute | Guidance |
|-----------|----------|
| **Plain language** | Prefer short sentences and familiar words. Avoid jargon unless it is domain-standard (e.g. PR, merge, webhook) and explain once where needed. |
| **Action-oriented** | Buttons and headings describe what happens next (“Link pull request”, “Nominate maintainer”), not vague labels (“Submit”, “Continue” alone). |
| **Supportive, not patronising** | Encourage review-before-contribute and **Extend** as a gentle default for newcomers ([FR-QA-05], success box on Extend)—not mandatory tutorials that block work. |
| **Honest about limits** | When GitHub or registry data is stale or unavailable, say so and show **last updated** or queue state ([FR-GH-10], [NFR-RE-04], [NFR-RE-05]). |
| **Errors** | Plain language + **suggested corrective action** where possible ([NFR-US-09]). |

---

## 4. Terminology and naming

Use these terms **consistently** in UI, navigation, and help copy. Definitions are normative in FR-1.1 §Definitions.

| User-facing term | Notes |
|------------------|--------|
| **Request** | A submitted need (tool, feature, bug fix, etc.), not “ticket” or “issue” for the platform object—though it **links** to a GitHub issue. |
| **Contributor** | Someone who ships code via a **linked GitHub PR** toward a request. |
| **Reviewer** | Anyone who left at least one review comment on a platform-linked PR; tag awarded on first comment ([FR-AC-01]). Do not imply “approved reviewer” status. |
| **Maintainer** | Merge authority on GitHub (nominated/upstream); distinguish **Nominated** vs **Upstream** only when the distinction helps the user ([FR §Maintainer]). |
| **Requester** | Submitter of the request; optional “you” in self-facing flows. |
| **Annotation** | Thread actions on a review comment: **Agree**, **Extend**, **Flag as incorrect** ([FR-QA-04], Appendix). |
| **Solved** | Requester-confirmed outcome ([FR definitions: Solved signal]); not “Done” unless paired with clear definition. |
| **Domain footprint** | Tag-derived record of where someone contributed or reviewed; use in profiles and filters. |

**Categories** (exact labels for submission and filters): Tool, Feature, Bug Fix, UI/UX Improvement, Documentation ([FR-RL-01]).

**Request states** (mutually exclusive; show one primary badge + optional sub-status): Open, Claimed, In Development, In Review, Merged, Solved, Stale, Maintained, Closed ([FR-RL-02]). Tool-only states (Stale, Maintained) must be visually distinct or annotated so users do not assume they apply to every category.

**Review severity** (on primary review comments): Blocker, Concern, Suggestion ([FR-QA-03])—use consistent visual weight (e.g. Blocker strongest).

---

## 5. Information architecture cues

| Area | FR/NFR-driven expectation |
|------|---------------------------|
| **Discovery** | **Good first review** and **good first contribution** appear on the **primary discovery surface** without opening an advanced filter panel ([FR-AC-04], [NFR-US-07]). |
| **Request detail** | Vote count, state, tags, links to repo/issue, review summary, CI/check flag when failed ([FR-QA-01]). |
| **Profiles** | Single unified profile: contribution and review **side by side** ([FR-PR-01]). Activity tags (Contributor, Reviewer, Maintainer, Requester) with counts ([FR-PR-02]). |
| **Maintainer nomination** | Step-by-step flow for Tool + new repo; must not assume GitHub admin literacy ([NFR-US-08]). Clear **pending acceptance** when suggesting a maintainer ([FR-MN-01]). |

---

## 6. Visual language — data and status

### 6.1 Profile activity timeline (canonical colours)

FR-1.1 specifies **colour coding** for the week-by-week activity chart ([FR-PR-01] contributor table). Implementations should preserve these semantics across themes (light/dark):

| Colour (semantic) | Meaning |
|-------------------|---------|
| **Yellow** | PR opened |
| **Green** | PR merged |
| **Sky blue** | Review activity |
| **Purple** | Maintainer activity |
| **Orange** | Request submitted |

Use distinct hues or patterns so meaning is not lost for colour-blind users; **do not rely on colour alone** (see §7).

### 6.2 Tags and hierarchy

Tags are **curated**, hierarchical where applicable ([FR-RL-06]–[FR-RL-09]). UI should support parent/child display (e.g. `gtk` under `linux-desktop`) and cap at **eight tags** per request ([FR-RL-08]).

### 6.3 Metrics ranges

Install/download style signals use **bands**: 10+, 100+, 1K+, 1M+ ([FR-QA-07]). Display consistently on request and profile surfaces.

---

## 7. Accessibility and inclusive design

Must align with **WCAG 2.1 Level AA** ([NFR-US-01]).

| Requirement | Design implication |
|-------------|-------------------|
| Keyboard-only | All flows for requests, review threads, and profiles operable without pointer ([NFR-US-02]). |
| Focus | **Visible focus** on every interactive control ([NFR-US-02]). |
| Screen readers | Test with **NVDA** and **VoiceOver** ([NFR-US-03]); use correct roles/labels for threads, votes, and state badges. |
| Progressive enhancement | **Profile core data** in server-rendered HTML; readable without JavaScript ([NFR-US-04]). |
| Automated audits | **axe-core**: zero **critical** violations per release ([NFR-US-05]). |
| User-generated content | Rich text/markdown areas must remain safe when rendered ([NFR-SE-09]); styling should not break structure for assistive tech. |

The tag taxonomy explicitly includes **accessibility** as a domain ([FR Appendix A]); feature work in that area should meet the same WCAG bar.

---

## 8. Content formats

| Content | Rule |
|---------|------|
| Request description | **Markdown supported** ([FR-RL-01]); provide preview where helpful. |
| Review comments | Support file/line context references ([FR-QA-03]); preserve threading for annotations. |
| Motivation field | Optional but **strongly encouraged** ([FR-RL-01])—use empty-state copy that explains value. |

---

## 9. Interaction and performance UX

NFRs imply predictable UI behaviour:

| ID | User-visible pattern |
|----|----------------------|
| [NFR-PE-01]–[NFR-PE-04] | List, request, profile, and filter views should feel **snappy**; avoid blocking full-page spinners when partial render is possible. |
| [NFR-PE-05] | Review threads: **initial content quickly**, remainder progressive ([NFR-PE-05]). |
| [NFR-RE-04], [NFR-RE-05] | **Degraded mode**: browsing/voting/annotations work; show **staleness** for GitHub checks, PR sync, or registry counts. |
| [NFR-PO-03] | Support **last two stable** Chrome, Firefox, Safari, Edge; test layouts and keyboard behaviour accordingly. |

---

## 10. Trust, privacy, and moderation

| Topic | Guidance |
|-------|----------|
| Voting | **One upvote per account per request** ([NFR-SE-11]); duplicate attempts fail silently—do not shame the user. |
| Downvotes | **Not public** ([FR-RL-04]); do not show downvote counts. |
| Flags | Duplicate / out of scope / already solved feed moderation ([FR-RL-04]); crossing threshold (default 5) enters queue ([NFR-PL-09]). |
| Email | Never displayed publicly ([NFR-PL-01]); never plain text in logs ([NFR-SE-07]). |
| Appeals | **30-day** structured appeals ([NFR-PL-11])—surface deadline and status clearly. |
| License | Request page shows **selected OSI-approved** license; picker is **curated** only ([FR-LI-02]–[FR-LI-04], [NFR-PL-05]–[NFR-PL-07]). |

---

## 11. Internationalisation

| ID | Guidance |
|----|----------|
| [NFR-US-10] | **All user-facing strings** externalised (resource files); no hard-coded copy in components for product UI. |
| [NFR-US-11] | Optional future: community translations—layout should tolerate **longer strings** and RTL when enabled later. |

---

## 12. Traceability (representative)

| Theme | FR references | NFR references |
|-------|----------------|----------------|
| New coder equity | [FR-AC-01]–[FR-AC-05], [FR-QA-05] | [NFR-US-06], [NFR-US-07] |
| States & categories | [FR-RL-01], [FR-RL-02] | — |
| Review & annotations | [FR-QA-03], [FR-QA-04] | [NFR-PE-05] |
| Profiles & timeline | [FR-PR-01]–[FR-PR-02] | [NFR-US-04] |
| Maintainer flows | [FR-MN-01]–[FR-MN-03] | [NFR-US-08] |
| Accessibility | — | [NFR-US-01]–[NFR-US-05] |
| Degraded / stale data | [FR-GH-10] | [NFR-RE-04], [NFR-RE-05] |
| Security of rendering | — | [NFR-SE-08], [NFR-SE-09] |

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial design language derived from FR-1.1 and NFR-1.1. |
| 1.1 | Linked companion docs: `docs/ui-ux/` (theming + UI patterns). |
| 1.2 | Linked `docs/ldd/` (API, db-schema, flows, integrations). |

---

*OpenForge DL-1.0 — Experience conventions aligned with FR-1.1 / NFR-1.1.*
