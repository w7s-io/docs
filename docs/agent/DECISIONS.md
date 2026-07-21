# W7S Docs Agent Decisions

## 2026-07-16: Email Bindings Get a Dedicated Backend Page

Email Service support is documented as `backend-email.md`, adjacent to backend AI, Postgres, queues, workflows, and schedules.

Rationale: Email bindings are runtime backend capability, not general storage. The storage bindings page links to it because `w7s.json` remains the shared manifest surface.

## 2026-07-21: Custom Domains Can Mount Under Paths

W7S `CNAME` entries may include a hostname path prefix, for example `omattic.com/compress-video`.

Rationale: Some apps should live under an existing domain instead of owning a dedicated hostname. W7S owns the route match and strips the prefix before app dispatch, while frontend builds still need a matching public asset base path.
