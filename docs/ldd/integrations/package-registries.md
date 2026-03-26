# Package registries (post-ship signals)

**Sources:** [FR-GH-09], [FR-QA-07], [S-PR-02], [NFR-PE-10], [NFR-RE-05].

---

## Purpose

Aggregate **install/download** bands (10+, 100+, 1K+, 1M+) for tools distributed via PyPI, npm, crates.io, AUR, etc.

---

## Design

1. **Background workers** poll registry APIs ([NFR-PE-10]); never block user requests.
2. Store `package_signal` rows: `request_id`, `ecosystem`, `package_name`, `band`, `raw_count_range`, `fetched_at`.
3. On registry failure: keep last value; expose `fetched_at` ([NFR-RE-05]).

---

## Mapping

- Link request/tool to package coordinates via contributor-maintained metadata or repo detection (product decision).

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial integration LLD (Should Have). |
