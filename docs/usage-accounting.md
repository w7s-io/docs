---
id: usage-accounting
title: Usage Accounting
description: Read per-app daily usage rollups for W7S deployments.
---

W7S records simple daily usage rollups for each deployed repository and environment. These rollups help app owners see which W7S platform features their repo is using.

The usage response also includes daily soft limits and warnings. These are advisory today; W7S does not block traffic from these limits yet.

## Read usage

Use the usage API with a GitHub token that can access the target repo:

```sh
curl "https://w7s.cloud/api/v1/usage/<owner>/<repo>?date=2026-05-26" \
  -H "Authorization: Bearer $GITHUB_TOKEN"
```

By default, usage reads the `production` environment. Override the environment with either:

```text
?environment=staging
x-w7s-environment: staging
```

## Response

```json
{
  "status": "success",
  "data": {
    "usage": {
      "version": 1,
      "date": "2026-05-26",
      "orgSlug": "w7s-io",
      "repoSlug": "example-workflows",
      "environment": "production",
      "repository": "w7s-io/example-workflows",
      "metrics": {
        "workflow.create": {
          "count": 4,
          "units": 4,
          "success": 4,
          "error": 0,
          "lastAt": "2026-05-26T12:00:00.000Z"
        }
      },
      "updatedAt": "2026-05-26T12:00:00.000Z"
    },
    "limits": {
      "version": 1,
      "period": "daily",
      "mode": "warn",
      "metrics": {
        "workflow.create": {
          "metric": "workflow.create",
          "used": 4,
          "limit": 10000,
          "remaining": 9996,
          "usageRatio": 0.0004,
          "status": "ok"
        }
      },
      "warnings": []
    },
    "warnings": []
  }
}
```

An app with no usage for the requested day returns the same shape with an empty usage `metrics` object and `updatedAt: null`.

## Metrics

Current metric names:

```text
deploy
rpc.dispatch
queue.send
queue.delivery
schedule.delivery
workflow.create
workflow.delivery
```

`count` is the event count. `units` is usually the same value. Batch-like paths can record more units than a single event, such as queue delivery batches.

## Soft limits

Current daily soft limits:

```text
deploy               100
rpc.dispatch         100000
queue.send           100000
queue.delivery       100000
schedule.delivery    10000
workflow.create      10000
workflow.delivery    10000
```

Each metric gets one of these statuses:

```text
ok        below 80%
warning   at or above 80%
exceeded  above 100%
```

Non-`ok` metrics are also listed in `warnings` for simpler dashboards and CLI output.

## Current limits caveat

Usage rollups are best-effort counters stored by W7S. They are useful for visibility, support, and planning quotas.

They are not billing-grade yet. Concurrent events can be approximate, and W7S does not enforce hard limits from these counters today.
