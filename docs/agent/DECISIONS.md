# W7S Docs Agent Decisions

## 2026-07-16: Email Bindings Get a Dedicated Backend Page

Email Service support is documented as `backend-email.md`, adjacent to backend AI, Postgres, queues, workflows, and schedules.

Rationale: Email bindings are runtime backend capability, not general storage. The storage bindings page links to it because `w7s.json` remains the shared manifest surface.
