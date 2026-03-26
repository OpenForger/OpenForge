# OpenForge — Web UI engineering (theme & components)

| **Document** | UI engineering for the SvelteKit app |
| **Normative design language** | [openforge-DL-1.0.md](../openforge-DL-1.0.md) (DL-1.0) |
| **Implementation** | `app/` (SvelteKit, Tailwind CSS v4, shadcn-svelte); Git root = parent `web/` |

This document binds **DL-1.0** to **concrete engineering rules**: strict theming, reuse, and preference for **shadcn-svelte** primitives. It does not restate FR/NFR; it tells builders how to implement surfaces without drifting from DL.

**Precedence:** FR-1.1 / NFR-1.1 → DL-1.0 → [theming.md](./theming.md) / [ui-patterns.md](./ui-patterns.md) → this file → code.

---

## 1. Goals (aligned with DL-1.0)

- **Clarity, trust, equal dignity** (DL §2): same affordances for all actors; no “junior lane” UI.
- **Lightweight platform** (DL §2): simple layouts, obvious next steps; avoid one-off styling and duplicate widgets.
- **Accessible by default** (DL §7, WCAG 2.1 AA): visible focus, correct roles/labels, keyboard operability; shadcn patterns are the baseline—do not strip focus rings or semantics.
- **Honest, actionable feedback** (DL §3 errors): use shadcn **Alert**, **Toast** (when added), or inline field errors—not ad-hoc coloured boxes without structure.
- **Traceable semantics** (DL §4, §6): request states, review severity, and profile timeline colours map to **tokens and named variants**, not arbitrary Tailwind colours in pages.

---

## 2. Strict theme following

### 2.1 Single pipeline

1. **Semantic colours and radii** live as CSS variables in `app/src/app.css` (`:root`, `.dark`) and are exposed to Tailwind via `@theme inline`.
2. **In components**, use **Tailwind semantic utilities** only: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-destructive`, etc.
3. **Do not** introduce raw hex/hsl/oklch or one-off `bg-zinc-500` in feature code unless adding a **new token** in `app.css` and documenting it (see [theming.md](./theming.md)).

### 2.2 OpenForge-specific semantics (DL §4, §6)

These are **product tokens**, not generic UI chrome:

| Concern | Source in CSS | Use in UI |
|--------|----------------|-----------|
| Profile timeline (PR opened, merged, review, maintainer, request) | `--data-activity-*` → `--color-data-*` in `@theme` | `bg-[color:var(--color-data-pr-opened)]` or mapped utilities; **always pair with text**, not colour alone (DL §6.1, §7). |
| Request / workflow badges | Badge variants in `app/src/lib/components/ui/badge/badge.svelte` (`open`, `in-review`, `merged`, …) | `<Badge variant="merged">` — do not recreate badge styling on pages. |
| Review severity | Same badge variants (`blocker`, `concern`, `suggestion`) | Consistent visual weight: Blocker strongest (DL §4). |

When DL adds or renames a state, **extend the theme and `badgeVariants`** in one place, then reuse.

### 2.3 Dark mode

- `app/src/app.html` syncs `class="dark"` on `<html>` with system preference.
- Prefer **`dark:`** utilities only when they respect the same tokens (shadcn defaults do). Do not fork separate colour systems for “custom dark”.

---

## 3. shadcn-svelte first (pre-baked components)

### 3.1 Registry is the default

- **Add** UI primitives with the CLI from `app/`:

  ```bash
  cd app && npx shadcn-svelte@latest add dialog -y
  ```

- Installed files live under **`app/src/lib/components/ui/<name>/`**. Treat them as **vendor-style source**: extend cautiously; prefer **composition** in routes or small local wrappers under `shell/` when needed.

### 3.2 Allowed layout of `app/src/lib/components/`

| Location | Purpose |
|----------|---------|
| **`ui/*`** (under `app/src/lib/components/`) | shadcn-svelte registry components only (Button, Card, Input, Label, Badge, Dialog, …). |
| **`shell/*`** | App-wide chrome (e.g. site header) composed **only** from `ui/*` + Tailwind. |
| **No** duplicate primitives next to `ui/*`. |

### 3.3 When to extend `ui/` vs compose

- **Extend** `badge.svelte` **variants** (tailwind-variants) for **domain enums** fixed in DL/FR (states, severity).
- **Compose** Card + Button + Input in **routes** or **shell** for flows; do not fork a second “Card” for product use.
- If a primitive is missing from the registry, **add it via shadcn** before writing a bespoke control.

---

## 4. Component reuse

1. **Search** `app/src/lib/components/ui/` and existing routes for an existing pattern.
2. **Compose** shadcn pieces with shared Tailwind layout classes (`flex`, `gap-*`, `max-w-*`).
3. **Extract** a shared fragment only when **three or more** call sites need the same structure; place extracts next to feature (`$lib/features/...`) or under `shell/` for global chrome—not loose duplicates in `ui/`.
4. **Strings and terminology** follow DL §4 (Request, Contributor, Reviewer, …). Reuse the same labels everywhere; centralise copy in constants or (long term) resource files per [NFR-US-10] / DL §11.

---

## 5. Voice, content, and patterns (DL cross-walk)

| DL section | Engineering note |
|------------|------------------|
| §3 Voice | Prefer shadcn **Button** text that states the action (“Link pull request”), not vague “Submit” alone where DL expects specificity. |
| §5 IA | Discovery and profile layouts: use **Card**, lists, and clear headings; avoid hiding good-first entry behind custom widgets. |
| §7 A11y | Use **Label** + `for`/`id` with **Input**; preserve `role` and focus from registry components. |
| §8–§9 | Markdown/review surfaces: when added, use documented patterns from [ui-patterns.md](./ui-patterns.md); loading/degraded: prefer skeleton/alert patterns from the same doc. |

---

## 6. Checklist before merging UI work

- [ ] No new raw colours in pages without a token in `app/src/app.css` / `@theme`.
- [ ] States and severity use **Badge** variants (or agreed token utilities), not one-off classes.
- [ ] New interactive control is a **shadcn** primitive or documented exception.
- [ ] Shell/layout changes live in **`shell/`** or routes, not scattered magic in `ui/`.
- [ ] DL terminology and DL §6 colour semantics preserved or explicitly updated in docs/tokens.

---

## Revision history

| Version | Changes |
|---------|---------|
| 1.0 | Initial UI engineering guide; ties `app/` stack to DL-1.0, theming, and shadcn-first reuse. |

---

*Companion to [openforge-DL-1.0.md](../openforge-DL-1.0.md).*
