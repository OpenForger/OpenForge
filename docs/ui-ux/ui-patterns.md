# UI patterns

Concrete **layout and behaviour** patterns for OpenForge surfaces. Normative terms and states come from [DL-1.0](../openforge-DL-1.0.md) and FR-1.1.

---

## 1. Global shell

| Element | Pattern |
|---------|---------|
| **Navigation** | Persistent primary nav: Requests (discovery), Submit (logged-in), Profile (self). Secondary: docs/legal when applicable. |
| **Auth** | GitHub identity is primary ([FR-GH-02]); show GitHub username + avatar; no separate “username” field in copy. |
| **Page title** | Format `{{Page}} · OpenForge` or `{{Request title}} · OpenForge` for clarity and tabs. |

---

## 2. Discovery (request listing)

**Requirements:** [FR-AC-04], [NFR-US-07], [NFR-PE-01], [NFR-PE-04].

| Pattern | Detail |
|---------|--------|
| **Good first review / Good first contribution** | Exposed on the **main listing** as toggles, chips, or prominent filters—not buried in an “Advanced filters” drawer. |
| **Sort** | At minimum: newest, most voted ([APD / FR listing expectations]). Show active sort clearly. |
| **Row / card** | Title, **state** badge, upvote count, **category**, primary **tags** (truncate with “+N”), linked repo hint. |
| **Empty state** | Plain language + link to submit first request; no dead ends ([NFR-US-06]). |

---

## 3. Request detail

**Requirements:** [FR-RL-01], [FR-QA-01], [FR-GH-03], [NFR-PE-02].

| Section | Content |
|---------|---------|
| **Header** | Title, state, category, requester link, created date. |
| **Demand** | Upvote control (one per user, [NFR-SE-11]); **no** public downvote ([FR-RL-04]). |
| **Links** | Prominent **GitHub issue** and **repository** links; treat GitHub as canonical for issue discussion ([FR-GH-03]). |
| **Body** | Rendered Markdown ([FR-RL-01]); optional preview on compose. |
| **Tags** | Up to 8; show hierarchy where relevant ([FR-RL-08], [FR-RL-09]). |
| **Maintainer** | Tool + new repo: show nomination status (**pending acceptance**, volunteer path) ([FR-MN-01]–[FR-MN-03]). |
| **CI / checks** | Summarise GitHub Actions from API; **failed** checks visible but do not block reading review ([FR-QA-01]). |
| **License** | Visible picker result / default + OSI choice ([FR-LI-02], [NFR-PL-05]–[NFR-PL-08]). |

---

## 4. Review threads and annotations

**Requirements:** [FR-QA-03], [FR-QA-04], [NFR-PE-05], [NFR-US-02].

| Pattern | Detail |
|---------|--------|
| **Thread structure** | **Review** (group) → **multiple comments** → per comment **Agree** / **Extend** / **Flag** ([FR-QA-04]); optional **nested** replies via `parent_annotation_id` ([LLD](../ldd/flows/review-annotations.md)). Indent / connectors for comment vs annotation levels. |
| **New coders** | Same thread as everyone ([FR-AC-02]); optional inline hint promoting **Extend** as first action ([FR-QA-05]). |
| **Severity** | Blocker / Concern / Suggestion always visible as text + token styling ([FR-QA-03]). |
| **File/line** | Show path + line range when provided ([FR-QA-03]). |
| **Loading** | Initial thread within ~1s target where possible; load more / infinite scroll for long threads ([NFR-PE-05]). |
| **Keyboard** | Thread items focusable, actions reachable without mouse ([NFR-US-02]). |

---

## 5. Profiles

**Requirements:** [FR-PR-01], [FR-PR-02], [NFR-US-04].

| Pattern | Detail |
|---------|--------|
| **Layout** | **Single profile**; contribution and review **side by side** (two columns on wide view, stacked on narrow) ([FR-PR-01]). |
| **Activity tags** | Contributor, Reviewer, Maintainer, Requester with **counts** ([FR-PR-02]). |
| **Timeline** | Week chart using [timeline colour semantics](./theming.md#3-profile-activity-timeline-data-semantics); legend with text + non-colour cues. |
| **Metrics** | Install bands **10+, 100+, 1K+, 1M+** consistent with request pages ([FR-QA-07], [DL-1.0 §6.3](../openforge-DL-1.0.md#63-metrics-ranges)). |
| **No-JS** | Core stats and lists in **server-rendered HTML**; enhancements layered on top ([NFR-US-04]). |

---

## 6. Forms and wizards

**Requirements:** [NFR-US-06], [NFR-US-08], [NFR-US-09].

| Pattern | Detail |
|---------|--------|
| **Request submission** | Required fields clearly marked; inline validation with **plain language** and **fix hints** ([NFR-US-09]). |
| **Maintainer nomination** | **Step-by-step** wizard for Tool + new repo; explain CODEOWNERS in plain language, no assumption of prior admin experience ([NFR-US-08]). |
| **First-time flows** | User can complete first review or claim **without leaving for external docs**—use in-flow guidance ([NFR-US-06]). |

---

## 7. Voting, flags, and moderation UX

**Requirements:** [FR-RL-04], [NFR-SE-11], [NFR-PL-09], [NFR-PL-11].

| Pattern | Detail |
|---------|--------|
| **Duplicate upvote** | **Silent** failure—no error toast that implies fault ([NFR-SE-11]). |
| **Flags** | Duplicate / out of scope / already solved; confirm receipt without exposing vote tallies that do not exist publicly. |
| **Moderation threshold** | At 5 flags, item enters queue ([NFR-PL-09])—requester/contributor sees neutral “under review” if policy requires. |
| **Appeals** | **30-day** window and status visible ([NFR-PL-11]). |

---

## 8. Degraded and stale data

**Requirements:** [FR-GH-10], [NFR-RE-04], [NFR-RE-05], [DL-1.0 §3](../openforge-DL-1.0.md#3-voice-and-tone). **LLD:** [Degraded mode](../ldd/flows/degraded-mode.md), [REST §7–8](../ldd/api/rest.md).

| Scenario | UX |
|----------|-----|
| GitHub API down | **Read** requests, profiles, existing review threads. **Votes and flags** still allowed ([NFR-RE-04]). **New** published reviews / comments / annotations: **blocked** — offer **save as draft** and **publish** (or discard) when GitHub is healthy; explain **409** if PR/repo changed while offline ([LLD](../ldd/flows/degraded-mode.md)). PR link / claim: delayed or blocked with clear copy. |
| Checks status unknown | Show **last known** checks with **staleness** time ([FR-GH-10]). |
| Registry install counts | Show **cached value + last updated** ([NFR-RE-05]). |

---

## 9. Performance perception

**Requirements:** [NFR-PE-01]–[NFR-PE-05].

- Prefer **skeleton** or partial content over blank screens for list and request pages.
- **Search/filter** results should feel responsive ([NFR-PE-04]); show loading on the result region, not necessarily full page.
- Profile may use slightly longer budget ([NFR-PE-03])—still avoid blocking entire view on one slow widget.

---

## 10. Empty and error states

- **Errors**: message + **what to do next** ([NFR-US-09]); link to retry or support where relevant.
- **403/401**: Explain login with GitHub; no technical stack traces to users.
- **404 request**: Suggest discovery search or home.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial UI patterns doc under `docs/ui-ux/`. |
| 1.1 | Degraded UX: review drafts vs live posts; LLD cross-links. |
