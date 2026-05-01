# Feature Registry

Feature status values:

- **Planned:** Intended but not started.
- **In Progress:** Active implementation.
- **Implemented:** Usable in the app.
- **Deferred:** Intentionally postponed.
- **Deprecated:** No longer part of the plan.

| Feature | Domain | Status | Phase | Description | Dependencies | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Documentation spine | Foundation | Implemented | 0 | Root docs, architecture summary, roadmap, data model, MVP scope, agent runbook. | None | First PR only. |
| Next.js app scaffold | Foundation | Implemented | 0 | Minimal app using TypeScript and Tailwind. | Documentation spine | Includes a Chronicle-branded shell only; no product features yet. |
| Supabase client setup | Foundation | Planned | 0 | Client/server configuration pattern without secrets. | App scaffold | Service role keys must never enter client code. |
| Auth shell | Foundation | Planned | 1 | Sign-in/sign-out flow using Supabase Auth. | Supabase setup | Required before workspace features. |
| Workspace model | Foundation | Planned | 1 | One private workspace per user initially, multi-workspace-compatible model. | Auth shell | Use `workspace_members` for future expansion. |
| World creation | Worldbuilding | Planned | 1 | Create and list reusable setting containers. | Workspace model | Worlds can exist without campaigns. |
| Campaign creation | Campaign Management | Planned | 1 | Create campaigns linked to worlds. | World creation | Campaigns hold play-state. |
| Entries CRUD | Worldbuilding | Planned | 1 | Create, read, update, archive/delete entries. | Worlds, campaigns | Universal content primitive. |
| Nested hierarchy | Worldbuilding | Planned | 1 | Parent/child entry tree. | Entries CRUD | Keep simple adjacency list first. |
| Markdown editor | Worldbuilding | Planned | 1 | Markdown-first entry editing and viewing. | Entries CRUD | Rich text editor deferred. |
| Entry types/templates | Worldbuilding | Planned | 1 | Basic types such as NPC, location, faction, quest, and session note. | Entries CRUD | Use `type` plus optional `custom_fields`. |
| Tags | Worldbuilding | Planned | 1 | Workspace-scoped tags and entry tagging. | Entries CRUD | Needed for browsing/search. |
| Basic search | Worldbuilding | Planned | 1 | PostgreSQL-backed search over entries. | Entries CRUD | External search deferred. |
| Visibility states | Permissions | Planned | 1 | `private_gm`, `player_visible`, `revealed`, `archived`. | Entries CRUD, auth | Must be respected in queries/RLS. |
| Basic export | Portability | Planned | 1 | Export entries as Markdown and structured JSON backup. | Entries CRUD | Export early to avoid lock-in. |
| Library core | Library | Planned | 2 | Systems, sources, reusable library entries, attribution, content browsing. | Wiki core | Comes after MVP wiki foundation. |
| World/campaign overlays | Campaign Management | Planned | 3 | Campaign-specific state over reusable world lore. | World/campaign model | Avoid mutating world truth for play-state. |
| Player preview | Permissions | Planned | 4 | Preview player-visible content safely. | Visibility states | Player portal still deferred. |
| Atlas/map foundation | Maps | Deferred | 5 | Upload image maps, pins, linked entries, pin visibility. | Wiki core, assets | Advanced map regions deferred. |
| Import/export foundation | Portability | Deferred | 6 | Import Markdown as draft entries, export structured backups. | Library and entries | PDF parsing deferred. |
| Rules package foundation | Rules | Deferred | 7 | Create/apply modular rules and content packages. | Library core | No rules engine yet. |
| Builder foundation | Builders | Deferred | 8 | Minimal schema-driven character sheet prototype. | Rules packages, permissions | Do not begin with D&D-level parity. |
| Live GM mode | Live Play | Deferred | 9 | Session dashboard with scenes, notes, quick links, reveal actions. | Campaign state, visibility | Separate experience from wiki mode. |
| Player portal | Player Experience | Deferred | 10 | Player login, character view, revealed lore, maps, handouts. | Visibility/RLS | Must never leak GM-only content. |
