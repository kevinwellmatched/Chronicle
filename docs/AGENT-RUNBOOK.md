# Agent Runbook

## How To Pick Up Work

1. Read `/AGENTS.md`.
2. Read `/docs/PROJECT-INDEX.md`.
3. Read the issue or user request.
4. Check `/docs/FEATURE-REGISTRY.md` for feature status.
5. Check `/docs/DATA-MODEL.md` before changing schema or data access.
6. Check `/docs/DECISION-LEDGER.md` before revisiting durable architecture choices.
7. Keep the change small enough to review.

## Expected Workflow

- Work on a feature branch.
- Make one focused change per PR.
- Prefer implementation that fits existing docs and decisions.
- Update docs in the same PR when behavior changes.
- Add or update migrations for all schema changes.
- Run the available checks before reporting completion.

## Required Checks

Run the checks that exist in the repository:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

If a check does not exist yet, say that clearly in the final task notes. Do not claim it passed.

## PR Expectations

Every PR should include:

- Summary
- Scope
- Screenshots for UI changes
- Testing notes
- Database migration notes, if applicable
- Documentation updates
- Known limitations
- Follow-up tasks

## What Not To Do

- Do not build future-phase systems before their prerequisites exist.
- Do not start with maps, builders, imports, player portal, live mode, or a rules engine.
- Do not add a monorepo without a clear need.
- Do not add paid SaaS, marketplace, publishing, billing, or public sharing flows.
- Do not expose secrets or commit `.env` files.
- Do not place service-role keys in frontend code.
- Do not rely on database dashboard changes that are not represented in migrations.
- Do not copy proprietary UI, branding, content, text, icons, trade dress, or implementation.
- Do not design import workflows around DRM bypass, scraping proprietary platforms, or redistribution.

## How To Handle Uncertainty

- If the answer is in the repository, inspect the repository first.
- If the question is product intent, ask the user only when the decision materially changes the plan.
- Prefer small reversible decisions over broad abstractions.
- Record durable decisions in `/docs/DECISION-LEDGER.md`.

## Documentation Update Rules

Update these documents when relevant:

- `/docs/PROJECT-INDEX.md`: current capabilities, major directories, limitations, next tasks.
- `/docs/FEATURE-REGISTRY.md`: feature status and phase.
- `/docs/DATA-MODEL.md`: entities, relationships, ownership, visibility, schema notes.
- `/docs/ROADMAP.md`: phase sequencing.
- `/docs/DECISION-LEDGER.md`: durable architecture/product decisions.
- `/docs/MVP-SCOPE.md`: MVP boundary changes.
- `/docs/IMPLEMENTATION-PLAN.md`: build order and issue backlog.

## Ticket Template

```md
# Feature: [Feature Name]

## Goal

[What this feature accomplishes]

## User Story

As a GM, I want to [do thing], so that [benefit].

## Scope

Include:
- [Item]

Exclude:
- [Item]

## Acceptance Criteria

- [ ] Criterion

## Data Model Notes

[Any tables, fields, relationships, migrations]

## UI Notes

[Any layout, route, state, empty/loading/error behavior]

## Security / Visibility Notes

[Any auth, RLS, permission, GM/player separation concerns]

## Testing Notes

[How to test]

## Documentation Updates

Update:
- [ ] PROJECT-INDEX.md
- [ ] FEATURE-REGISTRY.md
- [ ] DATA-MODEL.md
- [ ] ROADMAP.md
- [ ] DECISION-LEDGER.md if needed
```
