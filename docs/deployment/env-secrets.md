# Environment variables & secrets

How to use the template at `app/.env.example` safely in development and production (Git root = `web/`).

---

## 1. Quick start (local)

```bash
cd app
cp .env.example .env.secret
```

Put **real** values in **`.env.secret`** (gitignored). `vite.config.ts` loads `.env` then **`.env.secret`** with override so secrets can live only in `.env.secret`.

You can also use plain **`.env`**; both are gitignored except `.env.example`.

Restart the dev server after changes:

```bash
npm run dev
```

---

## 2. SvelteKit rules ([Vite env](https://svelte.dev/docs/kit/$env-static-private))

| Prefix | Where it runs | Safe for secrets? |
|--------|----------------|-------------------|
| *(none)* | **Server only** (`+page.server.ts`, `hooks.server.ts`, `+server.ts`, etc.) | **Yes** — e.g. `GITHUB_OAUTH_CLIENT_SECRET` |
| `PUBLIC_` | **Server and browser** (import from `$env/static/public`) | **No** — treat as world-readable |

- `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` should stay **without** the `PUBLIC_` prefix so they are never bundled for the client.
- Use `$env/static/private` or `$env/dynamic/private` on the server to read them.

---

## 3. Git safety

- **Commit:** `.env.example` only (placeholders, no real secrets).
- **Never commit:** `.env`, `.env.local`, `.env.production`, files containing tokens.
- If you ever commit a secret, **rotate** it in GitHub (new OAuth client secret, etc.) and purge history if the repo was public.

`app/.gitignore` already ignores `.env` and `.env.*` but keeps `.env.example`. The repo root `web/.gitignore` also ignores `app/.env` and `deploy/compose/.env`.

---

## 4. Production

- Inject secrets via your host’s mechanism (Kubernetes secrets, Fly.io secrets, GitHub Actions encrypted secrets, etc.).
- Do not upload `.env` to the server as a plain file on shared hosting unless permissions are locked down.
- Set a strong **`AUTH_SECRET`** for session signing (same as local dev; required whenever OAuth sessions are enabled).

---

## 5. Postgres & Redis (Compose)

Local or small-VM **staging** stack (containers + `DATABASE_URL` / `REDIS_URL`): [staging-stack.md](./staging-stack.md).

## 6. OAuth-specific

See also [github-oauth-app.md](./github-oauth-app.md): callback URL in GitHub must match the URL your running app uses (including port and path).

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial env/secrets guide. |
| 1.1 | Link to staging-stack (Postgres/Redis Compose). |
