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

For example:

```sh
curl "https://w7s.cloud/api/v1/logs/w7s-io/example-logs?hours=1&limit=20" \
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

Example response:

```json
{
  "status": "success",
  "data": {
    "logs": {
      "repository": "w7s-io/example-logs",
      "environment": "production",
      "from": "2026-05-26T13:00:00.000Z",
      "to": "2026-05-26T14:00:00.000Z",
      "limit": 20,
      "cursor": null,
      "records": [
        {
          "version": 1,
          "id": "log_abc123",
          "kind": "exception",
          "timestamp": "2026-05-26T13:42:10.534Z",
          "observedAt": "2026-05-26T13:42:11.001Z",
          "environment": "production",
          "orgSlug": "w7s-io",
          "repoSlug": "example-logs",
          "repository": "w7s-io/example-logs",
          "scriptName": "w7s-io--example-logs--production--6cc5bc0",
          "outcome": "exception",
          "level": "error",
          "text": "Error: example-logs intentional exception",
          "exception": {
            "name": "Error",
            "message": "example-logs intentional exception",
            "stack": "Error: example-logs intentional exception\n    at Object.fetch (...)"
          },
          "request": {
            "method": "GET",
            "path": "/throw",
            "status": 500,
            "colo": "IAD"
          }
        },
        {
          "version": 1,
          "id": "log_def456",
          "kind": "console",
          "timestamp": "2026-05-26T13:41:58.112Z",
          "observedAt": "2026-05-26T13:41:58.600Z",
          "environment": "production",
          "orgSlug": "w7s-io",
          "repoSlug": "example-logs",
          "repository": "w7s-io/example-logs",
          "scriptName": "w7s-io--example-logs--production--6cc5bc0",
          "outcome": "ok",
          "level": "warn",
          "message": [
            "example-logs warning",
            {
              "path": "/warn"
            }
          ],
          "text": "example-logs warning {\"path\":\"/warn\"}",
          "request": {
            "method": "GET",
            "path": "/warn",
            "status": 200,
            "colo": "IAD"
          }
        }
      ]
    }
  }
}
```

## Worker logs in GitHub Actions

Use `w7s-io/w7s-cloud@v1` with `logs-check-only: true` to fetch recent logs into a workflow run without deploying:

```yaml
name: Logs

on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  logs:
    runs-on: ubuntu-latest
    steps:
      - uses: w7s-io/w7s-cloud@v1
        with:
          token: ${{ github.token }}
          logs-check-only: true
          logs-hours: 1
          logs-limit: 25
```

The action prints a compact log table in the job output and adds a `W7S Logs` section to the GitHub Actions step summary. Optional filters:

```yaml
with:
  token: ${{ github.token }}
  logs-check-only: true
  logs-kind: exception
  logs-limit: 10
```

Log records are retained for a short operational window. The default W7S retention is seven days. Native backends deployed before this feature need to be redeployed once so their Worker upload metadata includes the Tail Worker consumer.
