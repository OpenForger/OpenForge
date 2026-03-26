# GitHub OAuth App (OpenForge)

Use this when completing **WP-1.0 preconditions** and **Sprint S1** ([authentication LLD](../ldd/security/authentication-and-webhooks.md)).

## 1. Create the OAuth App

1. Open [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers) (personal) **or** your **organisation** settings → **Developer settings** → **OAuth Apps** if the app should belong to the org.
2. **Register a new OAuth application**
3. Suggested fields:
   - **Application name:** `OpenForge (local)` / `OpenForge (staging)` / `OpenForge (prod)` — one app per environment is easiest for callback URLs.
   - **Homepage URL:** Your deployed site or `http://localhost:5173` for local dev.
   - **Authorization callback URL** — must match what the app sends **byte-for-byte**:
     - Default: `{origin}/auth/github/callback` using the browser request origin (e.g. `http://localhost:5173/auth/github/callback`).
     - **`http://127.0.0.1:5173/...` and `http://localhost:5173/...` are different** to GitHub. Open the app with the same host you registered, **or** set `GITHUB_OAUTH_REDIRECT_URI` in `app/.env.secret` to a single canonical URL and register that exact value in GitHub.
     - No trailing slash on the callback path.
     - Production: `https://your.domain/auth/github/callback`.

If GitHub shows *“The redirect_uri is not associated with this application”*, the registered callback and the URI in the authorize request do not match — fix GitHub settings and/or `GITHUB_OAUTH_REDIRECT_URI`.

4. Create the app → copy **Client ID** and generate a **Client secret**.

**Session signing:** the app also needs **`AUTH_SECRET`** in `app/.env.secret` (generate with `openssl rand -hex 32`). Without it, sign-in completes at GitHub but the platform cannot issue a session cookie. Restart the dev server after editing env files.

## 2. Store secrets

- Never commit the client secret. Use a local **`.env`** file (from [`app/.env.example`](../../app/.env.example)) or a secret manager — see [env-secrets.md](./env-secrets.md).
- Typical names: `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`.
- Document chosen **OAuth scopes** in your runbook (start with minimum: read user profile; add `repo` or fine-grained permissions only if the product needs user actions on repos).

## 3. Implementation (in repo)

- **Start sign-in:** `GET /auth/github` → redirect to GitHub.  
- **Callback:** `GET /auth/github/callback` → exchanges code, sets `of_session` cookie ([M-AU-01]–[M-AU-03]).  
- **Logout:** `POST /auth/logout`.  
- Env: `app/.env.secret` with `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, and **`AUTH_SECRET`** (required; see [env-secrets.md](./env-secrets.md)).

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial deployment note for WP-1.0 / OAuth precondition. |
