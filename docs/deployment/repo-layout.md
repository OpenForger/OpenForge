# Repository layout and Git root

OpenForge’s **Git repository root is the `web/` directory** (the folder that contains `app/`, `docs/`, `deploy/`, and `.cursor/`).

| Path (from repo root `web/`) | Purpose |
|------------------------------|---------|
| **`app/`** | SvelteKit application (npm, `src/`, `package.json`, Vite, env files). |
| **`docs/`** | Specifications, UI docs, workplan, deployment guides. |
| **`deploy/`** | `compose/` — Docker Compose for Postgres + Redis. |
| **`.cursor/`** | Cursor rules for this repo. |

This layout keeps **existing Git history** (the repo used to be only the Svelte app at the root of `web/`). The former root files were moved into **`app/`** with `git mv`, so history is preserved as renames.

**Parent folder** (`OF/` above `web/`) is **not** part of Git; open the **`web/`** folder as the project root in your editor, or open `OF/` knowing that `.git` lives under `web/`.

---

## Daily commands

- **Install / dev / build** — always from **`web/app/`**:

  ```bash
  cd web/app
  npm install
  npm run dev
  ```

- **Docker Compose** — from **`web/deploy/compose/`** (repository root = `web/`):

  ```bash
  cd web/deploy/compose
  docker compose up -d
  ```

---

## If you opened this repo from the parent `OF/` folder

Tools that expect `.git` at the workspace root may be confused. Prefer:

- Opening **`web/`** as the Cursor / VS Code workspace folder, **or**
- A multi-root workspace that includes `web/` as the Git root.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial note on monorepo Git root vs `web/`-only init. |
| 2.0 | Git root = `web/`; SvelteKit under `app/`; `docs/` + `deploy/` colocated. |
