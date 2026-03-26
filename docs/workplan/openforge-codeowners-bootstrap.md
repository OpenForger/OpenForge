# OpenForge — CODEOWNERS & maintainer nomination (bootstrap)

**Purpose:** Close [WP-1.0 §2](openforge-WP-1.0.md) precondition *CODEOWNERS + self-nomination path understood for Tool repo* before Phase 0 dogfood. The canonical platform repo is **[OpenForger/OpenForge](https://github.com/OpenForger/OpenForge)**.

**Normative product flow:** [Maintainer nomination LLD](../ldd/flows/maintainer-nomination.md) (M-MN-01–M-MN-03).

---

## 1. What `CODEOWNERS` does here

GitHub reads [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) to:

- Suggest or require review from listed users or teams (if you enable branch protection rules).
- Make **who has merge authority** visible and conventional: nominated maintainers should appear in this file ([FR-GH-06], M-MN-03).

This repository stores the file at **`.github/CODEOWNERS`** (repo root = Git root `web/`).

---

## 2. Self-nomination path (M-MN-01) — OpenForge as Tool repo

**Product intent:** For a **new Tool** repository, the **Requester** who is already a **GitHub admin** of that repo **self-nominates** as Maintainer; the platform records acceptance and drives a **CODEOWNERS** update ([maintainer-nomination.md § Paths 1](../ldd/flows/maintainer-nomination.md)).

**Bootstrap (today, no nomination UI yet):**

1. Founding maintainers are **already** admins of `OpenForger/OpenForge`.
2. **Self-nomination** is represented by **listing those GitHub handles** in `.github/CODEOWNERS` and merging that file to the default branch.
3. To add a co-maintainer: append their `@username` on the `*` line (space-separated) or add scoped paths if you split ownership later.

Example:

```gitattributes
* @AbdulHannanKhan @another-maintainer
```

---

## 3. Volunteer path (M-MN-02)

**Product intent:** If the Requester **cannot** self-nominate (not admin), they leave Maintainer **open for volunteer**; when a contributor’s **claim** is accepted, they may **volunteer**; first accepted volunteer wins; **CODEOWNERS** is updated ([FR-MN-01], [FR-MN-02], maintainer LLD § Paths 3 and Blocked state).

**Bootstrap (until Sprint 8 UI + API):**

- Team **understands** that requests **must not** stay stuck at **Claimed** without maintainer resolution ([FR-MN-02] in `docs/requirements/openforge_FR-1.1.tex`).
- Interim process: agree in team chat / issue who volunteers; **merge a PR** that updates `.github/CODEOWNERS` with the volunteer’s handle.
- Track full product behaviour under GitHub epic [#6 — Maintainer](https://github.com/OpenForger/OpenForge/issues/6).

---

## 4. Platform-generated CODEOWNERS PR (M-MN-03)

**Sprint 8** implements server-side branch + PR creation via GitHub API with **least-privilege** token ([NFR-SE-05], [github-api.md § CODEOWNERS PR](../ldd/integrations/github-api.md)).

Until then, **manual PRs** to `.github/CODEOWNERS` are the stand-in — same end state for GitHub.

---

## 5. Branch protection (recommended)

In **Settings → Branches** for `OpenForger/OpenForge`, consider:

- Require PR before merging to default branch.
- Optionally **Require review from Code Owners** once the team is larger than one person.

Do not over-tighten during early bootstrap if it blocks the founding loop.

---

## 6. Checklist (WP §2)

| Item | Done when |
|------|-----------|
| `.github/CODEOWNERS` on default branch | Lists all founding merge-capable `@handles` |
| Self-nomination **understood** | Team can explain M-MN-01 mapping above in one sentence |
| Volunteer path **understood** | Team can explain M-MN-02 + interim manual PR |
| M-MN-03 | Tracked as implementation work (issue #6); not required for “understood” gate |

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial bootstrap doc for WP-1.0 §2 + OpenForge repo. |
