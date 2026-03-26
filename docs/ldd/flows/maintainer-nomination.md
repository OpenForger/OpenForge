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

## Bootstrap (founding Tool repo)

Until the nomination UI and M-MN-03 API exist, the **OpenForge** platform repo can satisfy **M-MN-01** by maintaining **`.github/CODEOWNERS`** and documenting the volunteer interim for **M-MN-02**. See [openforge-codeowners-bootstrap.md](../../workplan/openforge-codeowners-bootstrap.md).

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial flow. |
