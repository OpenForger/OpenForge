**OPENFORGE**

Architecture Planning Document

*MoSCoW Prioritisation & Dogfooding Workflow*

|                 |                  |
|-----------------|------------------|
| **Document ID** | APD-1.0          |
| **Version**     | 1.0 — Initial    |
| **Status**      | Draft            |
| **Date**        | March 2026       |
| **Companion**   | FR-1.1 / NFR-1.1 |
| **Workplan**    | [WP-1.0](../workplan/openforge-WP-1.0.md) — execution phases & dogfooding gates |

**Table of Contents**

**1. Purpose and Framing**

This document serves two purposes. The first is to prioritise every OpenForge feature using the MoSCoW method (Must Have, Should Have, Could Have, Won't Have in v1.0), giving the engineering team a clear build order. The second is to define a dogfooding workflow — a disciplined process by which the platform is built through itself as early as possible, validating the core loop with real requests, real contributors, and real review annotations before public launch.

The dogfooding constraint has a direct effect on MoSCoW classification. A feature that would normally be a Should Have is promoted to Must Have if the dogfooding loop cannot close without it. Conversely, features that are in the FR but are not required for the loop to close remain Should or Could.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Dogfooding constraint</strong></p>
<p><em>Core dogfooding principle: the thinnest possible version of OpenForge that can accept a real request, let a contributor claim it, submit a PR, receive annotated reviews, detect a merge, and credit the contributor — is the version that gets built first. Every subsequent feature is then requested, built, and reviewed through that live platform.</em></p></td>
</tr>
</tbody>
</table>

**2. MoSCoW Prioritisation**

Features are drawn from FR-1.1 and NFR-1.1. Each is assigned to exactly one MoSCoW bucket. The dogfooding flag (★) marks features whose Must Have classification is driven primarily by the dogfooding constraint rather than general user value alone.

**2.1 Must Have — v1.0 launch blockers**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Must Have</strong></p>
<p><em>All Must Have features must be complete, tested, and deployed before the platform is opened to external contributors. A missing Must Have means the dogfooding loop cannot close.</em></p></td>
</tr>
</tbody>
</table>

**2.1.1 Authentication and Identity**

| **ID**      | **Must Have — Feature**                                         | **Rationale**                                                                                                            |
|-------------|-----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **M-AU-01** | GitHub OAuth login and session management                       | All platform identity is GitHub-based. Without this, no actor can perform any action. Required for dogfooding day one. ★ |
| **M-AU-02** | GitHub username as platform identity — no separate registration | Removes friction for first-time users. A separate signup flow would gate the dogfooding loop before it starts. ★         |
| **M-AU-03** | Session persistence with 30-day inactivity expiry               | Users must stay logged in across sessions for the dogfooding loop to feel like a real product, not a prototype.          |

**2.1.2 Request Submission and Discovery**

| **ID**      | **Must Have — Feature**                                                                                          | **Rationale**                                                                                                          |
|-------------|------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| **M-RQ-01** | Request submission form with all required fields (title, description, category, tags, linked repo, linked issue) | The request is the entry point of the entire platform. Without it, nothing else can start. ★                           |
| **M-RQ-02** | Request listing page with basic sort (newest, most voted)                                                        | Contributors must be able to find open requests. Required for the claim step of dogfooding. ★                          |
| **M-RQ-03** | Individual request detail page                                                                                   | Contributors and reviewers need to see the full request before acting. ★                                               |
| **M-RQ-04** | Upvote on requests (one per account)                                                                             | The primary prioritisation signal. Without it, the platform is just a list with no demand signal.                      |
| **M-RQ-05** | Request state machine (Open → Claimed → In Development → In Review → Merged → Solved → Closed)                   | State transitions driven by GitHub webhooks and user actions are the backbone of the lifecycle. ★                      |
| **M-RQ-06** | Tag selection from curated taxonomy (v1.0 seed list from FR-1.1 Appendix A)                                      | Tags are required at submission and drive domain footprinting. The seed list covers the Linux tooling launch vertical. |

**2.1.3 Contributor Claim and PR Linking**

| **ID**      | **Must Have — Feature**                                             | **Rationale**                                                                                         |
|-------------|---------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| **M-CL-01** | Contributor claim — assign self to an open request                  | Without claim, there is no way to indicate intent and no state transition to Claimed. ★               |
| **M-CL-02** | PR link submission — contributor links a GitHub PR URL to a request | The bridge between the platform and GitHub. Without it, the merge webhook has nothing to attach to. ★ |
| **M-CL-03** | PR link verification — confirm PR exists and is open via GitHub API | Prevents broken or fraudulent links entering the system before review begins.                         |

**2.1.4 GitHub Webhook Integration**

| **ID**      | **Must Have — Feature**                                                                                    | **Rationale**                                                                                                                           |
|-------------|------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| **M-WH-01** | GitHub webhook receiver for PR events (opened, synchronised, closed/merged)                                | Merge detection is what closes the dogfooding loop — without it, the platform never learns a PR was merged. ★                           |
| **M-WH-02** | HMAC-SHA256 webhook signature verification                                                                 | Security baseline. An unverified webhook endpoint is an injection vector on day one.                                                    |
| **M-WH-03** | Merge event handler — update request state to Merged, credit contributor, inherit tags to domain footprint | The merge event is the most consequential state change in the system. All downstream credit depends on it. ★                            |
| **M-WH-04** | Webhook retry queue with exponential backoff (up to 24 hours)                                              | GitHub webhooks can fail transiently. Without retry, missed merge events mean missed credits — unacceptable for a trust-based platform. |

**2.1.5 Review Annotation System**

| **ID**      | **Must Have — Feature**                                                                                       | **Rationale**                                                                                                        |
|-------------|---------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| **M-RV-01** | Platform-native review comment on a linked PR (with optional severity marker: Blocker / Concern / Suggestion) | The primary differentiator from GitHub alone. Without this, the platform adds no review value. ★                     |
| **M-RV-02** | Agree annotation on a review comment                                                                          | The simplest annotation — lowest barrier for new coders. Required for the annotation layer to exist at all. ★        |
| **M-RV-03** | Extend annotation — child comment in thread                                                                   | The key learning mechanic for new coders. Explicitly cited in the FR as the encouraged first action. ★               |
| **M-RV-04** | Flag as incorrect annotation with required explanation                                                        | Completes the three-annotation model. Without it the annotation layer is incomplete for v1.0.                        |
| **M-RV-05** | Reviewer tag awarded on first review comment                                                                  | Must fire correctly from day one — it is the platform's promise to new coders that their first action is credited. ★ |
| **M-RV-06** | Review thread display — inline, indented, with agree/extend/flag counts visible                               | The review thread is the primary UI surface reviewers and contributors interact with. ★                              |

**2.1.6 Contributor and Reviewer Profile (Minimum Viable)**

| **ID**      | **Must Have — Feature**                                                                              | **Rationale**                                                                                                                         |
|-------------|------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| **M-PR-01** | Unified profile page showing both contributor and reviewer activity                                  | Profiles are the dogfooding output — the artifact that proves the loop ran. Without them, contributors cannot see what they earned. ★ |
| **M-PR-02** | Contributor profile data: tools shipped, requests solved, domain footprint by tag                    | The three most important employer-facing signals. Must be accurate from the first merge. ★                                            |
| **M-PR-03** | Reviewer profile data: PRs reviewed, review comments, reviewing since date, comments agreed/extended | The equivalent for reviewers. Must be accurate from the first review comment. ★                                                       |
| **M-PR-04** | Activity tags (Contributor, Reviewer, Requester, Maintainer) awarded automatically                   | The visible identity markers that confirm role participation. ★                                                                       |
| **M-PR-05** | Contribution timeline (week-by-week, colour-coded event types)                                       | Not cosmetic — the timeline is the consistency signal employers read. Required for the profile to be legible at launch.               |

**2.1.7 Maintainer Nomination (Minimum Viable)**

| **ID**      | **Must Have — Feature**                                              | **Rationale**                                                                                                                                              |
|-------------|----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **M-MN-01** | Self-nomination by Requester for new Tool repositories               | The simplest nomination path. Required because the dogfooding repository (OpenForge itself) is a new Tool repository — the founding team self-nominates. ★ |
| **M-MN-02** | Contributor volunteer as Maintainer when claim is accepted           | Required for requests where the Requester cannot self-nominate. Without this, new Tool requests are permanently blocked at Claimed. ★                      |
| **M-MN-03** | CODEOWNERS file generation on nomination acceptance (via GitHub API) | The mechanism that gives the Nominated Maintainer actual merge authority on GitHub without requiring platform-side gating.                                 |

**2.1.8 GitHub Actions Status Display**

| **ID**      | **Must Have — Feature**                                                                                      | **Rationale**                                                                                                                                                                    |
|-------------|--------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **M-CI-01** | Read GitHub Actions check statuses for linked PRs and display on request page                                | The platform's automated quality signal. Requires no CI hosting — just a GitHub API read. Without it, reviewers lack the basic build/lint signal before they begin reading code. |
| **M-CI-02** | Platform-provided GitHub Actions workflow template (checks attribution header, request ID in PR description) | The two checks the platform owns that GitHub Actions does not provide natively. Delivered as a template contributors add to their repository.                                    |

**2.1.9 Moderation Baseline**

| **ID**      | **Must Have — Feature**                                         | **Rationale**                                                                                              |
|-------------|-----------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| **M-MD-01** | Flag a request as duplicate / out of scope / already solved     | Without basic flagging, the platform has no spam defence on day one.                                       |
| **M-MD-02** | 5-flag threshold triggers moderation queue entry (configurable) | The automatic tripwire. Without it, moderation is entirely manual and does not scale even at small volume. |
| **M-MD-03** | Append-only moderation audit log                                | Required for trust and accountability from day one. Non-negotiable.                                        |

**2.2 Should Have — targeted for v1.0, deferrable with justification**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Should Have</strong></p>
<p><em>Should Have features significantly improve the platform but their absence does not break the dogfooding loop. They should be built in the first release cycle but may slip to a v1.1 patch with documented justification.</em></p></td>
</tr>
</tbody>
</table>

| **ID**      | **Should Have — Feature**                                                          | **Rationale**                                                                                                                                             |
|-------------|------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **S-RQ-01** | Good first review and good first contribution filters on discovery page            | Directly serves new coders. High value but the discovery page functions without it.                                                                       |
| **S-RQ-02** | Requester marks request Solved                                                     | Closes the post-ship loop and generates the strongest profile signal. Technically simple but requires the full lifecycle to have run at least once first. |
| **S-RQ-03** | Suggest a GitHub username as Maintainer (with acceptance flow)                     | Second nomination path. Not required for dogfooding (self-nomination covers it) but needed for requesters who cannot self-nominate.                       |
| **S-RQ-04** | Tag proposal queue — users propose new tags for curation                           | The taxonomy grows stale without this. Not required at launch with the seed list, but needed within weeks.                                                |
| **S-RQ-05** | Request flag appeal form (30-day window)                                           | Required by NFR-PL-11. Deferrable by a few weeks post-launch without material harm.                                                                       |
| **S-PR-01** | Contrarian accuracy metric on reviewer profile                                     | The most sophisticated reviewer signal. Requires accumulated data before it is meaningful — suitable for v1.1 or a Should target.                         |
| **S-PR-02** | Install / download count via package registry APIs (PyPI, npm, crates.io, AUR)     | High value post-ship signal. The polling infrastructure adds complexity; deferrable to shortly after launch.                                              |
| **S-GH-01** | Fork count detection for post-ship signals                                         | GitHub API read. Low complexity but not in the critical path.                                                                                             |
| **S-GH-02** | GitHub Release events surfaced on request page as version milestones               | Nice signal for active tools. Not required for the core loop.                                                                                             |
| **S-GH-03** | Upstream maintainer notification via GitHub mention when tagged by requester       | High value for existing-repo requests. Requires careful rate-limit management; deferrable.                                                                |
| **S-CI-01** | Binary blob and attribution header checks in platform webhook handler              | The two platform-owned checks from FR-QA-01. Low complexity, high hygiene value.                                                                          |
| **S-MD-01** | Conflict-of-interest guard — moderators cannot moderate requests they are party to | Good governance. Straightforward to implement but not a day-one blocker.                                                                                  |
| **S-NF-01** | WCAG 2.1 AA accessibility compliance across all pages                              | Non-negotiable ethically; technically the compliance audit takes time. Target v1.0 but allow a post-launch remediation sprint.                            |
| **S-NF-02** | Profile pages readable without JavaScript (progressive enhancement)                | Required by NFR-US-04. Architectural decision that must be made early even if full compliance slips slightly.                                             |
| **S-NF-03** | Structured JSON logging with trace IDs                                             | Operational necessity at any non-trivial traffic level. Should be in from the start.                                                                      |
| **S-NF-04** | Health check endpoint and Prometheus metrics endpoint                              | Required for deployment monitoring. Low effort, high operational value.                                                                                   |

**2.3 Could Have — v1.1 or later**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Could Have</strong></p>
<p><em>Could Have features are desirable but explicitly deferred. They should be designed so that adding them later does not require rework of Must Have or Should Have components.</em></p></td>
</tr>
</tbody>
</table>

| **ID**      | **Could Have — Feature**                                                                                    | **Rationale**                                                                                                      |
|-------------|-------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| **C-RQ-01** | Community triage votes (usable / duplicate / README missing / off-topic) aggregated as summary signal on PR | Stage 2 of the quality pipeline. Valuable once volume is sufficient; noise at low volume.                          |
| **C-MN-01** | Stale detection and Maintainer claim workflow for Tool repositories (180-day inactivity)                    | Low urgency at launch — no tools will have been live for 180 days. Build after first cohort of tools ships.        |
| **C-PR-01** | Upstream adoption manual flag on request page                                                               | Requires someone to trigger it. Low-frequency event; can be added whenever the first upstream adoption occurs.     |
| **C-PR-02** | Dependent projects signal (other platform requests declaring dependency)                                    | Requires the platform to have a critical mass of requests first. Premature in v1.0.                                |
| **C-GH-01** | Review mirroring — sync GitHub PR review comments to platform review thread                                 | Useful once external contributors review on GitHub without visiting the platform. Not a v1.0 concern.              |
| **C-NF-01** | Internationalisation (i18n) — externalise all UI strings to resource files                                  | Architectural groundwork is low cost; translation is deferred until community demand emerges.                      |
| **C-NF-02** | CDN for static assets with versioned cache TTLs                                                             | Performance improvement. The platform will be fast enough without it at v1.0 traffic levels.                       |
| **C-NF-03** | Self-hosted deployment configuration (PostgreSQL, Redis, nginx)                                             | Valuable for organisations. Not needed for the hosted platform launch.                                             |
| **C-SE-01** | Automated bot detection for high-frequency voting patterns                                                  | Needed at scale. Overkill at launch volume.                                                                        |
| **C-FU-01** | Funding model database schema fields (nullable fund amount, funder records)                                 | The schema placeholder for the deferred funding feature. Low effort; should be included to avoid future migration. |

**2.4 Won't Have in v1.0 — explicitly out of scope**

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Won't Have in v1.0</strong></p>
<p><em>Won't Have features are not deferred — they are explicitly excluded from v1.0 and any planning conversation about them should be redirected to the future extensions section of FR-1.1.</em></p></td>
</tr>
</tbody>
</table>

| **ID**      | **Won't Have — Feature**                                           | **Rationale**                                                                                                       |
|-------------|--------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| **W-FU-01** | Monetary funding and bounty activation                             | Deferred to a future release. Payment infrastructure, legal review, and tax implications are out of scope for v1.0. |
| **W-FU-02** | Sponsored request organisation accounts                            | Depends on funding activation. Deferred.                                                                            |
| **W-MO-01** | Native mobile application (iOS / Android)                          | Out of scope per FR-1.1. The web application must be mobile-responsive but no native app.                           |
| **W-GH-01** | Native code hosting — the platform does not store git repositories | Architectural boundary. OpenForge is an idea layer on top of GitHub, not a code host.                               |
| **W-GH-02** | GitLab, Codeberg, or Gitea provider support                        | v1.0 is GitHub-only. The abstraction layer is designed for this; the implementation is deferred.                    |
| **W-ED-01** | University course integration API                                  | Future extension. Requires university partnerships that do not yet exist.                                           |
| **W-CR-01** | W3C Verifiable Credentials for domain footprint                    | Future extension requiring standards maturity and employer adoption.                                                |
| **W-AI-01** | AI tool provider API integration (surfacing requests in IDEs)      | Future extension. Requires API partnerships.                                                                        |
| **W-ME-01** | Mentorship pairing system                                          | Future extension. Requires sufficient user volume to make pairing meaningful.                                       |

**3. Dogfooding Workflow**

The dogfooding workflow is the discipline by which OpenForge is built through OpenForge. It is not a metaphor — it is a concrete process with defined phases, real GitHub repositories, real platform requests, and real review annotations. Every feature built after the minimum viable loop is live must go through the platform's own request and review process.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Dogfooding rule</strong></p>
<p><em>Non-negotiable rule: once Phase 1 is deployed (the minimum viable loop), no new feature may be committed to the OpenForge codebase unless a corresponding platform request exists, has been claimed by the contributor, and the PR is linked to that request. The only exceptions are critical security patches.</em></p></td>
</tr>
</tbody>
</table>

**3.1 Pre-Dogfood Bootstrap (Phase 0)**

Phase 0 is the only phase built outside the platform's own loop — it must be, because the platform does not yet exist. Phase 0 is kept as thin as possible so that the transition to Phase 1 (self-hosting) happens as early as achievable.

- Create the OpenForge GitHub organisation and the platform repository.

- Create a GitHub OAuth App for authentication.

- Create a GitHub issue for each Must Have feature group (Auth, Request Submission, Claim/PR Link, Webhook, Review Annotation, Minimum Profile, Minimum Maintainer Nomination, CI Status Display, Moderation Baseline).

- These issues will become the first platform requests once Phase 1 is live — they are pre-written so that the transition is immediate.

- Set up the deployment environment (containerised, PostgreSQL, Redis).

- Implement Must Have features M-AU-01 through M-MD-03 in a single sprint. No feature reviews through the platform yet — this is the bootstrap exception.

- Write a minimal test suite covering the webhook handler, the claim flow, and the annotation mechanics.

- Deploy to a private staging environment accessible to the founding team only.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Phase 0 exit criterion</strong></p>
<p><em>Phase 0 ends when a founding team member can: log in via GitHub, submit a request, claim it as another account, link a PR, leave a review annotation, merge the PR on GitHub, and see the contributor credit appear on the profile — all in a single end-to-end run.</em></p></td>
</tr>
</tbody>
</table>

**3.2 Minimum Viable Loop — Phase 1**

Phase 1 is the moment the platform begins eating its own dog food. The pre-written GitHub issues from Phase 0 are immediately submitted as platform requests. The founding team acts as Requesters, Contributors, and Reviewers simultaneously — wearing different hats deliberately to stress-test the role separation.

| **Phase**        | **What gets built**                                                    | **Request on platform**                                                                                                                               | **Validates**                                                                   |
|------------------|------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| Phase 1 Week 1   | Submit the first real platform requests using the live platform itself | REQUEST-001: Good first contribution filter on discovery page REQUEST-002: Suggest-a-maintainer nomination flow REQUEST-003: Solved mark by Requester | Request submission form, tag selection, GitHub issue linking, state → Open      |
| Phase 1 Week 1–2 | Claim requests, open PRs, link them to platform                        | Founding team member claims REQUEST-001, opens a PR on the OpenForge repo, links it via the platform widget                                           | Claim flow, PR verification, state → In Development                             |
| Phase 1 Week 2   | Leave review annotations on the linked PRs                             | A second founding team member leaves a review on REQUEST-001's PR. A third extends it. A fourth agrees.                                               | Review annotation thread, Agree / Extend / Flag mechanics, Reviewer tag awarded |
| Phase 1 Week 2–3 | Merge PR on GitHub — observe platform response                         | Nominated Maintainer merges the PR. Platform detects merge via webhook, updates state to Merged, credits contributor, updates domain footprint.       | Webhook handler, merge detection, tag inheritance, profile credit               |
| Phase 1 Week 3   | Requester marks Solved — inspect profile                               | Requester marks REQUEST-001 Solved. Contributor's profile now shows: 1 tool shipped, 1 request solved, linux-desktop tag in footprint.                | Solved signal, full profile data accuracy, domain footprint end-to-end          |
| Phase 1 Week 3   | Open platform to a small external cohort (5–10 trusted contributors)   | Post the platform URL and 10 pre-seeded Linux tooling requests in relevant communities (Linux subreddit, Fosstodon, HN Show). Observe real usage.     | Cold-start seeding, real request volume, first external reviewer annotations    |

**3.3 Should Have Build Loop — Phase 2**

Phase 2 begins after the external cohort has produced at least three merged PRs through the platform. From this point, every Should Have feature is built through the dogfooding loop: a request is submitted, discussed, claimed, PRed, reviewed via the annotation layer, and merged.

- Each Should Have feature from section 2.2 becomes a platform request, submitted by a founding team member in the Requester role.

- Contributors — including external community members from the Phase 1 cohort — claim and build these features. This is the first time non-founding-team members contribute to OpenForge itself.

- Reviews happen through the platform's own annotation layer. Founding team members play Reviewer for community contributions; community members play Reviewer for founding team contributions.

- The domain footprint of every participant accumulates across these contributions. By the end of Phase 2, early contributors have a demonstrable OpenForge domain footprint in platform-infrastructure and linux-tooling tags.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Phase 2 exit criterion</strong></p>
<p><em>Phase 2 exit criterion: all Should Have features are shipped, the platform has at least 25 open requests across at least 5 different tags, and at least 3 external contributors have a Contributor tag on their profile from merged PRs.</em></p></td>
</tr>
</tbody>
</table>

**3.4 Public Launch Readiness — Phase 3**

Phase 3 is the final pre-launch phase. It focuses on quality hardening, accessibility audit, and seeding the platform with enough real content that a first-time visitor sees a credible, active community rather than an empty marketplace.

- Conduct a full WCAG 2.1 AA accessibility audit. Raise any failures as platform requests and resolve them through the dogfooding loop.

- Seed at least 40 curated Linux tooling requests across all tag families in Appendix A of FR-1.1 — these are real requests for real tools, written by people who actually need them.

- Write the platform's own public-facing documentation (README, contributing guide, request submission guide) as Markdown files in the OpenForge repository — surfaced as Documentation-type requests on the platform, built through the dogfooding loop.

- Run a load test against the 1,000 concurrent users target from NFR-PE-07.

- Conduct a security review of the webhook handler, OAuth flow, and CODEOWNERS token scope.

- Announce v1.0 public launch with a blog post that includes the platform's own contribution history as evidence of the dogfooding process.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Launch narrative</strong></p>
<p><em>The public launch announcement should include a link to the platform's own request history — showing every feature of OpenForge v1.0 that was built through OpenForge itself. This is the most credible possible demonstration of the platform's value proposition.</em></p></td>
</tr>
</tbody>
</table>

**3.5 Ongoing Dogfooding Discipline**

Post-launch, the dogfooding discipline is maintained through a simple standing rule: any change to the OpenForge codebase that adds user-visible behaviour requires a platform request. This includes bug fixes that users would notice, UI changes, new features, and deprecations. It excludes internal refactors, dependency updates, and security patches.

- The OpenForge repository README shall display a live count of platform requests linked to the repository, updated by webhook.

- Each quarter, the team publishes a transparency report showing: requests opened on the platform for OpenForge itself, how many were claimed by community vs. founding team, average time from Open to Merged, and reviewer annotation counts. This report is itself a Documentation-type platform request.

- The platform's own tag footprint (platform-infrastructure, web, postgresql, redis) shall be visible on the OpenForge organisation page — demonstrating that the platform has a domain identity just as any other tool does.

**4. Build Sequence Summary**

The following sequence synthesises the MoSCoW priorities and the dogfooding phases into a recommended build order for the engineering team.

| **Sprint** | **Phase** | **Features**                                                                                                                                  | **Dogfooding gate**                                         |
|------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|
| 1          | Phase 0   | M-AU-01, M-AU-02, M-AU-03 GitHub OAuth, sessions, identity                                                                                    | None — bootstrap exception                                  |
| 2          | Phase 0   | M-RQ-01, M-RQ-02, M-RQ-03, M-RQ-04 Request submission, listing, detail, upvote                                                                | None — bootstrap exception                                  |
| 3          | Phase 0   | M-RQ-05, M-RQ-06 State machine, tag taxonomy                                                                                                  | None — bootstrap exception                                  |
| 4          | Phase 0   | M-CL-01, M-CL-02, M-CL-03 Claim, PR link, PR verification                                                                                     | None — bootstrap exception                                  |
| 5          | Phase 0   | M-WH-01, M-WH-02, M-WH-03, M-WH-04 Webhook receiver, signature, merge handler, retry                                                          | Phase 0 exit: full end-to-end run by founding team          |
| 6          | Phase 0   | M-RV-01 through M-RV-06 Review annotation layer                                                                                               | Phase 0 exit: full end-to-end run by founding team          |
| 7          | Phase 0   | M-PR-01 through M-PR-05 Minimum viable profile                                                                                                | Phase 0 exit: full end-to-end run by founding team          |
| 8          | Phase 0   | M-MN-01, M-MN-02, M-MN-03 Maintainer nomination (self + volunteer)                                                                            | Phase 0 exit: full end-to-end run by founding team          |
| 9          | Phase 0   | M-CI-01, M-CI-02, M-MD-01 through M-MD-03 CI status display, moderation baseline                                                              | Phase 0 exit confirmed — deploy to staging                  |
| 10         | Phase 1   | Submit first platform requests for Should Have features All subsequent work through dogfooding loop                                           | Phase 1 begins: all new features via platform requests      |
| 11–14      | Phase 1–2 | S-RQ-01, S-RQ-02, S-RQ-03, S-RQ-04 Good first filter, Solved mark, suggest maintainer, tag proposals                                          | Each built through a platform request                       |
| 15–18      | Phase 2   | S-PR-01, S-PR-02, S-GH-01 through S-GH-03 Contrarian accuracy, install counts, fork count, release events, upstream notify                    | Each built through a platform request                       |
| 19–20      | Phase 2   | S-CI-01, S-MD-01, S-NF-01 through S-NF-04 Binary/attribution checks, conflict guard, accessibility, progressive enhancement, logging, metrics | Phase 2 exit: 25 open requests, 3 external Contributor tags |
| 21–22      | Phase 3   | Accessibility audit, 40 seed requests, documentation, load test, security review                                                              | Phase 3 exit: public launch ready                           |

**Appendix A — MoSCoW Feature Count Summary**

| **Bucket**      | **Feature count** | **NFR requirements**                         |
|-----------------|-------------------|----------------------------------------------|
| Must Have       | 27 features       | All NFR-SE-01–04, NFR-RE-07–09, NFR-PL-05–08 |
| Should Have     | 16 features       | NFR-US-01–04, NFR-MA-07–11, NFR-NF remainder |
| Could Have      | 11 features       | NFR-SE-12, NFR-PO-04, C-FU-01 schema         |
| Won't Have v1.0 | 9 features        | All future extension NFRs                    |

**Appendix B — Dogfooding Roles Reference**

During Phases 0 and 1, the founding team plays multiple roles simultaneously. This table clarifies which hat each role wears at each step of the loop.

| **Platform role**      | **Action in dogfooding loop**                                                                                     | **GitHub action**                                                       | **Profile credit earned**                         |
|------------------------|-------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|---------------------------------------------------|
| Requester              | Submits a Should/Could Have feature as a platform request with linked GitHub issue                                | Creates or references a GitHub issue in the OpenForge repo              | Requester tag                                     |
| Contributor            | Claims the request, builds the feature, opens a PR linking it to the platform request ID                          | Opens a PR on the OpenForge GitHub repo; includes request ID in PR body | Contributor tag (on merge), domain footprint tags |
| Reviewer               | Leaves review comments via the platform annotation layer; uses Agree / Extend / Flag on other reviewers' comments | May also comment on GitHub PR — mirroring is supplementary              | Reviewer tag, review stats, domain footprint      |
| Nominated Maintainer   | Merges the PR on GitHub after review. Platform detects via webhook.                                               | Performs the GitHub merge. Is listed in CODEOWNERS.                     | Maintainer tag, maintainer activity in timeline   |
| Requester (post-merge) | Marks the request Solved after confirming the feature works as expected on the live platform                      | No GitHub action required                                               | Solved signal added to contributor's profile      |

*OpenForge APD-1.0 — Contributor-selected OSI-approved license*
