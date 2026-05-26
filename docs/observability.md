---
id: observability
title: Observability
description: Read W7S platform event analytics for deployed repositories.
---

W7S writes platform events to Workers Analytics Engine when the core is configured with `W7S_ANALYTICS_DATASET`. These are W7S platform events, not application `console.log` output.

## Analytics API

Read per-repository platform analytics with a GitHub token that can access the repo:

```sh
curl "https://w7s.cloud/api/v1/analytics/<owner>/<repo>?hours=24&limit=50" \
  -H "Authorization: Bearer $GITHUB_TOKEN"
```

Query parameters:

```text
environment  W7S environment, defaults to production
hours        trailing lookback window, 1 to 168, defaults to 24
from         optional ISO timestamp, overrides hours start
to           optional ISO timestamp, defaults to now
bucket       hour or day, defaults to hour
limit        recent event limit, 1 to 200, defaults to 50
```

The response includes:

- `summary`: aggregate counts by event and outcome.
- `timeseries`: counts by event and hour or day.
- `events`: recent platform events with source, target, method, status, and duration.

If Analytics Engine is not configured, the endpoint returns `configured: false` with empty arrays.

## Current log scope

The analytics API is useful for deploy events, runtime requests, RPC, queues, schedules, workflows, and platform troubleshooting. It does not expose user Worker `console.log`, stack traces, or arbitrary application logs yet.
