# Health checks

**Sources:** [NFR-RE-03], [NFR-RE-01].

---

## 1. `GET /health`

| Requirement | Design |
|-------------|--------|
| Response time | **< 200ms** at edge ([NFR-RE-03]). |
| Purpose | Load balancer / orchestrator **liveness**; process is up and event loop responsive. |

**Shallow check (recommended default):**

- Return `200` with `{ "status": "ok" }` if process accepts HTTP.
- **Do not** block on PostgreSQL or Redis in the hot path (avoids cascading kill during DB maintenance).

---

## 2. Readiness (optional `GET /health/ready`)

Use for **traffic routing** when you need stricter guarantees:

- Check **PostgreSQL** `SELECT 1`.
- Check **Redis** if required for sessions/rate limits.
- Return `503` if any hard dependency fails.

Document which probe Kubernetes/Swarm uses for **liveness** vs **readiness**.

---

## 3. GitHub status

- **`GET /v1/system/github`** is a **product** signal for clients ([REST §3](../api/rest.md)), not a substitute for infra health.
- Optionally include `github_reachable` in `/health/ready` with **short timeout** (e.g. 300ms) — beware false negatives.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial observability LLD. |
