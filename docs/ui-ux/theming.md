# Theming

Guidance for **CSS design tokens** and colour semantics so the UI stays aligned with [DL-1.0 §6](../openforge-DL-1.0.md#61-profile-activity-timeline-canonical-colours), **WCAG 2.1 AA** ([NFR-US-01]), and keyboard/focus rules ([NFR-US-02]).

---

## 1. Token layers

Organise variables in three layers. Naming is illustrative; keep names stable once shipped.

| Layer | Role | Examples |
|-------|------|----------|
| **Foundation** | Page chrome, body text, surfaces | `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-border` |
| **Interactive** | Links, primary actions, focus | `--color-accent`, `--color-accent-hover`, `--color-on-accent`, `--focus-ring` |
| **Semantic** | Status and review meaning | `--color-danger`, `--color-warning`, `--color-success`, `--color-info` |

Semantic tokens are for **UI state** (failed CI, Blocker severity, error banners). They are separate from **profile timeline** data colours (§3).

---

## 2. Light and dark

- Support at least **light** and **dark** presentation. Initial web scaffold uses `prefers-color-scheme` in `app/src/app.css`; a future **explicit theme toggle** should persist preference and still respect system default when set to “System”.
- Re-map **all** foundation and interactive tokens per theme. Do not only invert background—adjust borders, muted text, and shadows so contrast stays **AA** for normal and large text ([NFR-US-01]).
- **Graphs and badges**: timeline and state colours need **paired light/dark variants** so the same semantic label (e.g. “PR merged”) reads clearly on both canvas and surface backgrounds.

---

## 3. Profile activity timeline (data semantics)

FR-1.1 defines fixed meanings for the contribution timeline ([FR-PR-01], [DL-1.0 §6.1](../openforge-DL-1.0.md#61-profile-activity-timeline-canonical-colours)). Expose **named tokens** so charts and legends stay consistent:

| Semantic | Suggested token | Meaning |
|----------|-----------------|--------|
| PR opened | `--data-activity-pr-opened` | Yellow family |
| PR merged | `--data-activity-pr-merged` | Green family |
| Review | `--data-activity-review` | Sky blue family |
| Maintainer | `--data-activity-maintainer` | Purple family |
| Request submitted | `--data-activity-request` | Orange family |

**Accessibility ([DL-1.0 §7](../openforge-DL-1.0.md#7-accessibility-and-inclusive-design))**

- Every series needs a **non-colour cue**: legend labels, patterns (stripes/dots), or icons in tooltips/legend.
- Test palettes with **colour-blindness simulators**; avoid red–green-only distinction for unrelated semantics.
- If a timeline segment is focusable or selectable, expose **name + value** to assistive tech, not colour alone.

---

## 4. Request state and review severity

### 4.1 Request states ([FR-RL-02])

Use **one** primary state badge per request. Tool-only states (**Stale**, **Maintained**) should use a **distinct shape or icon** (e.g. wrench, clock) in addition to colour so users do not confuse them with the main lifecycle.

Recommended semantic mapping (implement as tokens, e.g. `--state-open`, `--state-merged`):

| State | Suggested tone | Notes |
|-------|----------------|--------|
| Open | Neutral / info | Entry state |
| Claimed, In Development | Info | In progress |
| In Review | Accent-adjacent | Active collaboration |
| Merged | Success | GitHub truth synced |
| Solved | Success (distinct from Merged if needed) | Requester-confirmed |
| Stale, Maintained | Warning / special | Tool-only; explain in tooltip |
| Closed | Muted / neutral | Terminal |

### 4.2 Review severity ([FR-QA-03])

| Severity | Visual weight |
|----------|----------------|
| Blocker | Strongest: semantic danger or high-contrast border |
| Concern | Medium: warning tone |
| Suggestion | Lightest: muted or info |

Severity must not be **only** colour—include the word “Blocker”, “Concern”, or “Suggestion” in the UI.

---

## 5. Typography and spacing

- **Body**: system UI stack for performance and familiarity ([NFR-PO-03] browser matrix). DL favours clarity over brand display fonts for chrome.
- **Code / monospace**: GitHub URLs, branch names, tag slugs, license IDs—use `--font-mono` with appropriate size so lines do not dominate.
- **Spacing scale**: keep a **small fixed scale** (e.g. `--space-1` … `--space-4` as in `app.css`) and use it for vertical rhythm on request and profile pages to support scannability ([DL-1.0 §2](../openforge-DL-1.0.md#2-product-principles-from-fr)).

---

## 6. Focus and interaction

- **Focus ring**: dedicated token, e.g. `--focus-ring: 2px solid var(--color-accent)` with offset, visible on keyboard focus for all interactive controls ([NFR-US-02]).
- **`:focus-visible`**: avoid removing outlines globally; suppress mouse-only focus noise if needed, not keyboard focus.
- **Touch**: favour adequately sized hit areas for primary actions on discovery and vote controls (reduces mis-taps; aligns with inclusive design goals).

---

## 7. Elevation and borders

- Prefer **border + subtle shadow** (`--shadow`) for cards (requests, profile sections) to keep the UI lightweight ([DL-1.0 §2](../openforge-DL-1.0.md#2-product-principles-from-fr)).
- Avoid heavy glassmorphism or motion that slows perceived performance ([NFR-PE-01]–[NFR-PE-04]).

---

## 8. Internationalisation and density

- Tokens should not hard-code **direction**: use logical properties (`margin-inline`, `padding-inline`) where possible for future RTL ([NFR-US-10], [NFR-US-11]).
- Layouts should survive **~30% longer strings** without clipping (German, Finnish, etc.).

---

## 9. Security-related presentation

- Sanitised markdown ([NFR-SE-09]) should use **prose styles** that do not strip heading/list semantics assistive tech relies on.
- External links (GitHub, registry): open in new tab only when necessary; indicate **external** in label or icon for predictability.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial theming doc under `docs/ui-ux/`. |
