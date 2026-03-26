# Database — overview

| Document | Content |
|----------|---------|
| [Schema](./schema.md) | Logical relational model, enums, constraints, indexing strategy. |

**Assumptions**

- **PostgreSQL** (NFR portability, self-host [NFR-PO-04]).
- Migrations **versioned** ([NFR-MA-10]); additive profile fields ([NFR-MA-04]); nullable **fund** column on requests for future use ([NFR-MA-06], [C-FU-01]).
- **Tags** and **categories** extensible per [NFR-MA-01], [NFR-MA-02].

**Related:** [REST API](../api/rest.md), [flows](../flows/README.md).
