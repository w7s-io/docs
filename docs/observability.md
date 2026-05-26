---
id: observability
title: Observability
description: Read W7S platform event analytics and user Worker logs.
---

W7S exposes two observability streams:

- platform analytics from W7S core events;
- user Worker `console.*`, uncaught exceptions, and non-OK outcomes captured from Cloudflare Tail Worker events.

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

## Worker logs API

Read recent per-repository user Worker logs with the same kind of GitHub token:

```sh
curl "https://w7s.cloud/api/v1/logs/<owner>/<repo>?hours=1&limit=100" \
  -H "Authorization: Bearer $GITHUB_TOKEN"
```

Query parameters:

```text
environment  W7S environment, defaults to production
hours        trailing lookback window, 1 to 168, defaults to 1
from         optional ISO timestamp, overrides hours start
to           optional ISO timestamp, defaults to now
kind         console, exception, or outcome
level        debug, info, log, warn, or error
limit        record limit, 1 to 500, defaults to 100
cursor       opaque cursor from a previous response
```

The response includes `records` ordered newest first. Console records include `level`, structured `message`, and flattened `text`. Exception records include `exception.name`, `exception.message`, and `exception.stack` when Cloudflare provides one.

Log records are retained for a short operational window. The default W7S retention is seven days. Native backends deployed before this feature need to be redeployed once so their Worker upload metadata includes the Tail Worker consumer.
