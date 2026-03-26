# Staging stack: containers, Postgres, Redis (step-by-step + concepts)

This guide matches workplan precondition **“Deployment target (containers, Postgres, Redis)”** ([WP-1.0 §2](../workplan/openforge-WP-1.0.md)): a **repeatable** way to run backing services the platform will need, before the app fully uses them.

**Git root** for this project is the directory that contains **`app/`**, **`docs/`**, and **`deploy/`** (named `web/` in a typical clone). Companion files:

- `deploy/compose/docker-compose.yml` — defines the stack (path from repo root `web/`).
- `deploy/compose/env.example` — copy to `deploy/compose/.env` for passwords and connection strings.

---

## Part A — What you are doing (the “why”)

### 1. DevOps is not a separate magic role (for this step)

**DevOps** (Development + Operations) is the practice of making software **releasable and operable**: same setup for you, a teammate, and a server; recoverable data; observable failures. For OpenForge, the first slice is: **run Postgres and Redis the same way everywhere** via **containers** and a **manifest** (`docker-compose.yml`).

You are not configuring production at scale yet—you are establishing a **contract**: “this is how we run the data layer locally and on a small staging VM.”

### 2. Containers (Docker)

A **container** packages an app (here, Postgres or Redis) plus its filesystem view so it runs **identically** on your laptop, a Linux VM, or a cloud VM. The **image** is the blueprint; the **container** is a running instance.

**Why it matters today:** Without containers, everyone installs Postgres differently (versions, paths, services). With containers, the version is pinned in `docker-compose.yml` (`postgres:16-alpine`, `redis:7-alpine`).

### 3. Docker Compose

**Compose** reads a YAML file and starts **multiple** containers together, with **ports**, **volumes**, and **environment variables** wired up.

**Why it matters:** One command brings up the whole stack; one file is reviewable in Git; CI can use the same file later.

### 4. PostgreSQL (Postgres)

**Postgres** is a **relational database**. OpenForge will store requests, users, reviews, votes, etc. as **structured rows** with **constraints** and **transactions** (see [LLD db-schema](../ldd/db-schema/schema.md)).

**Why before the app uses it:** The workplan asks for an **empty** stack first so networking, credentials, and persistence are solved **before** S2+ (requests in DB). You remove “it works on my machine” surprises early.

### 5. Redis

**Redis** is an **in-memory** data store, often used for **queues**, **caching**, **rate limits**, and **session offload** in modern stacks. OpenForge’s LLD assumes **job/webhook queues** and similar patterns ([queues-and-delivery](../ldd/jobs/queues-and-delivery.md)).

**Why now:** Same as Postgres—prove connectivity and a **shared** recipe. The web app does not need to talk to Redis on day one.

### 6. Volumes

Compose declares **named volumes** (`openforge_pgdata`, `openforge_redis`). Data survives **container restarts** and `docker compose down` **without** `-v`.

**Why it matters:** You can iterate on code without losing local DB data every time.

### 7. Healthchecks

Compose **healthchecks** let Docker report when Postgres accepts connections and Redis responds to `PING`. Orchestrators (and future `depends_on: condition: service_healthy`) use this to avoid starting dependents too early.

---

## Part B — Do this on your machine (the “how”)

### Prerequisites

- **Docker** installed and running (Docker Desktop, Rancher Desktop, or Linux `docker` daemon).
- **Docker Compose** — you need **one** of these (many Linux `docker.io` packages do **not** include `docker compose`):

| What you have | What to run | Install on Ubuntu (example) |
|-----------------|-------------|-----------------------------|
| Compose **V2** plugin | `docker compose up -d` | `sudo apt install docker-compose-v2` **or** [Docker Engine + plugin](https://docs.docker.com/engine/install/ubuntu/) then `sudo apt install docker-compose-plugin` |
| Standalone **v1-style** binary | `docker-compose up -d` (hyphen) | `sudo apt install docker-compose` |

If you see `docker: unknown command: docker compose`, install a row from the table, **or** use `docker-compose` if `docker-compose version` works.

**Correct folder:** run commands from **`deploy/compose/`** relative to the **Git root** (`web/`). Full path example: `…/OpenForge/web/deploy/compose`.

### Troubleshooting: `permission denied` on `/var/run/docker.sock`

Your user must be allowed to talk to the Docker daemon. On Ubuntu:

```bash
sudo usermod -aG docker "$USER"
```

Then **log out and back in** (or reboot), and retry `docker compose up -d`. One-off: `sudo docker compose up -d` (not ideal long term).

### Step 1 — Configure environment

```bash
cd deploy/compose
cp env.example .env
```

Edit `.env`:

- Change **`POSTGRES_PASSWORD`** to something strong if this host is shared or exposed (staging VM).
- Keep **`DATABASE_URL`** and **`POSTGRES_*`** in sync (same user, password, db name, port). If you map host ports **5433** / **6380**, use those ports in `DATABASE_URL` / `REDIS_URL`.

### Step 2 — Start the stack

From `deploy/compose`:

```bash
docker compose up -d
```

- **`-d`** runs in the background (**detached**).

Check status:

```bash
docker compose ps
```

You should see `postgres` and `redis` **healthy** (or running, then healthy after a few seconds).

### Step 3 — Verify Postgres

Using the client inside the container (no local `psql` required):

```bash
docker compose exec postgres psql -U openforge -d openforge -c "SELECT 1 AS ok;"
```

Expected: one row `ok = 1`.

### Step 4 — Verify Redis

```bash
docker compose exec redis redis-cli ping
```

Expected: `PONG`.

### Step 5 — (Optional) Connect from the host

If you have `psql` and `redis-cli` installed locally, using values from `.env`:

```bash
psql "$DATABASE_URL" -c "SELECT 1;"
redis-cli -u "$REDIS_URL" ping
```

### Stop / reset

- **Stop containers, keep data:**  
  `docker compose down`
- **Stop and delete volumes (wipe DB + Redis data):**  
  `docker compose down -v`  
  Use only when you intend to reset.

---

## Part C — Connect to OpenForge `app/` (later)

When the SvelteKit app reads `DATABASE_URL` / `REDIS_URL` (S2+ workers, API), set **`app/.env.secret`** to the same URLs as in `deploy/compose/.env` (see [env-secrets.md](./env-secrets.md)). For local Compose, `localhost` and the **published** host ports are correct.

---

## Part D — “Staging VM” vs laptop

- **Same files:** Copy the repo (or deploy from CI) to the VM, install Docker, run the same `docker compose up -d` from `deploy/compose`.
- **Security:** Use strong passwords, firewall (only your office/VPN IPs on DB ports if exposed), and eventually move secrets to a **secret manager**—not committed `.env` on the server.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial Compose stack + teaching notes for WP-1.0 precondition. |
| 1.1 | Docker / Ubuntu compose + socket permissions; custom ports note. |
| 2.0 | Paths from Git root `web/`; `app/` for SvelteKit. |
