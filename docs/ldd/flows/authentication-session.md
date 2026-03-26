# Flow: Authentication & session

**Sources:** [FR-GH-02], [NFR-SE-01], [NFR-SE-02], [NFR-SE-03], [M-AU-01]–[M-AU-03].

---

## Sequence (happy path)

1. User visits protected action → `401` → redirect to `GET /auth/github`.
2. Server redirects to GitHub OAuth authorize with `client_id`, `scope`, `state` (CSRF).
3. GitHub redirects to `GET /auth/github/callback?code=&state=`.
4. Server validates `state`, exchanges `code` for tokens, fetches GitHub user profile.
5. **Upsert** `users` by `github_id`; update `github_login`, `avatar_url`.
6. Create **session** record (or Redis session) with `expires_at` = now + 30 days inactivity window.
7. Set **HTTP-only, Secure, SameSite** session cookie; redirect to original destination.

---

## Session validation

- Every **write** and sensitive read runs middleware: resolve session → `user_id`; reject expired ([NFR-SE-02]).
- **Logout:** delete session server-side + clear cookie.

---

## Degraded OAuth

If GitHub OAuth is down: existing sessions continue until expiry ([FR-GH-10] auth fallback wording); new logins fail with plain-language error + retry ([NFR-US-09]).

---

## Revision history


| Version | Changes       |
| ------- | ------------- |
| 1.0     | Initial flow. |


