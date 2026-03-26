# Flow: Maintainer nomination (Tool + new repo)

**Sources:** [FR-MN-01]–[FR-MN-03], [NFR-US-08], [NFR-SE-05], [M-MN-01]–[M-MN-03].

---

## Paths

1. **Self-nominate:** Requester is GitHub repo admin; record nomination `kind=self`, `status=accepted`; trigger CODEOWNERS PR ([FR-MN-01]).
2. **Suggest user:** `nominated_github_login` set; status `pending`; notify suggested user (GitHub mention on issue [FR-GH-08] or platform notification); on accept → CODEOWNERS.
3. **Open for volunteer:** On claim, contributor may **volunteer**; first accepted volunteer wins ([FR-MN-01]); CODEOWNERS update.

---

## CODEOWNERS generation

1. Use GitHub API with **minimum scope** token ([NFR-SE-05]).
2. Create or update branch + PR adding/updating `CODEOWNERS` with nominated user ([FR-GH-06]).
3. Never log token ([NFR-SE-05]).

---

## UX constraints

- Step-by-step wizard for non-technical requesters ([NFR-US-08]).
- Show **pending acceptance** clearly when suggestion outstanding ([FR-MN-01]).

---

## Blocked state

- Request **must not** progress past **Claimed** without maintainer resolution ([FR-MN-02]); UI surfaces prompt to requester.

---

## Bootstrap: OpenForge platform repo

Until the nomination UI and M-MN-03 API exist, use GitHub + manual PRs as a stand-in. Canonical repo: **[OpenForger/OpenForge](https://github.com/OpenForger/OpenForge)**.

**M-MN-01 (self-nom):** Founding admins list their `@handles` in **`.github/CODEOWNERS`** (repo root) on the default branch. Add co-maintainers on the same `*` line, space-separated.

**M-MN-02 (volunteer):** If the Requester cannot self-nominate, agree who volunteers and **merge a PR** updating `.github/CODEOWNERS`. Requests must not stay stuck at **Claimed** without maintainer resolution ([FR-MN-02] in `docs/requirements/openforge_FR-1.1.tex`). Full product flow: GitHub epic for Maintainer (e.g. [OpenForge #6](https://github.com/OpenForger/OpenForge/issues/6)).

**M-MN-03:** Sprint 8 adds API-driven CODEOWNERS PRs ([NFR-SE-05], § CODEOWNERS generation above). Until then, manual PRs only.

**Branch protection:** Consider requiring PRs to default branch; add “require review from Code Owners” when the team grows. See GitHub [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial flow. |
| 1.1 | Bootstrap section expanded (OpenForge CODEOWNERS interim); workplan points here. |
