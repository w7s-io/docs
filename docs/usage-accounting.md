---
id: usage-accounting
title: Usage Accounting
description: Read per-app daily usage rollups for W7S deployments.
---

W7S records simple daily usage rollups for each deployed repository and environment. These rollups help app owners see which W7S platform features their repo is using.

The usage response also includes effective daily soft limits and warnings. These are advisory today; W7S does not block traffic from these limits yet.

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

Read the effective soft limit policy without usage counters:

```sh
curl "https://w7s.cloud/api/v1/limits/<owner>/<repo>" \
  -H "Authorization: Bearer $GITHUB_TOKEN"
```

The bearer token must be able to access the same GitHub repository.

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
          "status": "ok",
          "source": "default"
        }
      },
      "warnings": []
    },
    "policy": {
      "version": 1,
      "period": "daily",
      "mode": "warn",
      "environment": "production",
      "orgSlug": "w7s-io",
      "repoSlug": "example-workflows",
      "policy": {
        "workflow.create": {
          "metric": "workflow.create",
          "dailyUnits": 10000,
          "warningThreshold": 0.8,
          "source": "default"
        }
      },
      "lookups": []
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

The `w7s-io/w7s-cloud@v1` GitHub Action reads this API after a successful deploy. When warnings exist, it adds them to the GitHub Actions summary and opens or updates one GitHub issue for that repo/environment.

Issue notifications require this workflow permission:

```yaml
permissions:
  contents: read
  issues: write
```

Set `usage-warnings-issue: false` on the action to keep warnings in the workflow summary only.

Scheduled workflows can run the action in usage-check-only mode:

```yaml
- uses: w7s-io/w7s-cloud@v1
  with:
    token: ${{ github.token }}
    usage-check-only: ${{ github.event_name == 'schedule' }}
```

In this mode the action does not package or deploy the repository. It only reads the current day's W7S usage and creates or updates the usage warning issue when warnings exist.

## Enforcement hook

W7S has an internal `checkUsageLimit(...)` helper for upcoming expensive primitives. It reads current usage, applies the effective policy, and reports whether projected usage would exceed the daily limit.

The hook is report-only today:

```json
{
  "mode": "report",
  "enforcement": "off",
  "metric": "workflow.create",
  "used": 8,
  "requestedUnits": 3,
  "projectedUnits": 11,
  "limit": 10,
  "status": "warning",
  "projectedStatus": "exceeded",
  "wouldBlock": true
}
```

No existing deploy, RPC, queue, schedule, or workflow path blocks on this value yet.

## Policy overrides

Limit policies are platform-owned. Apps cannot raise or lower their own limits through `w7s.json`.

W7S reads optional policy override records in this order:

```text
usage_limit_policy:v1:owner:<owner>
usage_limit_policy:v1:owner_environment:<environment>:<owner>
usage_limit_policy:v1:repo:<owner>:<repo>
usage_limit_policy:v1:repo_environment:<environment>:<owner>:<repo>
```

Later records override earlier records. Repo/environment overrides are the most specific.

Policy record shape:

```json
{
  "version": 1,
  "metrics": {
    "workflow.create": {
      "dailyUnits": 5000,
      "warningThreshold": 0.7
    },
    "queue.send": 25000
  },
  "updatedAt": "2026-05-26T00:00:00.000Z"
}
```

A number is shorthand for `dailyUnits`. `warningThreshold` must be greater than `0` and less than or equal to `1`. Unknown metrics are ignored.

W7S operators can manage these records from the core repo:

```sh
npm run limits:get -- --owner w7s-io --repo example-workflows
```

```sh
npm run limits:set -- \
  --scope repo \
  --owner w7s-io \
  --repo example-workflows \
  --metric workflow.create \
  --daily-units 5000 \
  --warning-threshold 0.7
```

```sh
npm run limits:delete -- \
  --scope repo \
  --owner w7s-io \
  --repo example-workflows \
  --metric workflow.create
```

## Current limits caveat

Usage rollups are best-effort counters stored by W7S. They are useful for visibility, support, and planning quotas.

They are not billing-grade yet. Concurrent events can be approximate, and W7S does not enforce hard limits from these counters today.
