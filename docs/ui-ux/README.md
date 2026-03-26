# OpenForge — UI, UX & theming

Product-facing experience documentation for the web platform. It extends the normative **design language** with implementation-oriented theming and interface patterns.

| Document | Purpose |
|----------|---------|
| [Design language](../openforge-DL-1.0.md) (DL-1.0) | Voice, terminology, principles, accessibility bar, traceability to FR/NFR. |
| **[Theming](./theming.md)** | Design tokens, colour roles, light/dark, data-visualisation semantics (e.g. profile timeline). |
| **[UI patterns](./ui-patterns.md)** | Page-level layouts, components, states, loading, degraded mode, forms. |
| **[UI engineering (web)](./ui-engineering-web.md)** | Strict theming, shadcn-svelte-first, component reuse, `app/` layout (`ui/` vs `shell/`). |

**Related sources**

- [Low-level design (LLD)](../ldd/README.md) — API, database schema, flows, integrations.
- [FR-1.1](../requirements/openforge_FR-1.1.tex) — functional behaviour and labels.
- [NFR-1.1](../requirements/openforge_NFR-1.1.tex) — usability, performance, security UX constraints.
- [APD-1.0](../architecture/openforge_APD-1.0.md) — delivery priorities and dogfooding context.
- Web implementation (reference): `app/src/app.css` (shadcn + OpenForge tokens); `app/src/lib/components/ui/*` (shadcn-svelte registry); `app/src/lib/components/shell/*` (app chrome). Git root is `web/` — see [repo-layout](../deployment/repo-layout.md).

When FR/NFR and this folder disagree, **FR/NFR win**; update these docs after requirement changes.
