---
id: usage-accounting
title: Usage Accounting
description: Read per-app daily usage rollups for W7S deployments.
---

W7S records daily usage rollups for each deployed repository and environment. W7S-managed paths update counters directly, and direct Cloudflare resources are synced hourly from Cloudflare analytics into the same rollup.

The usage response also includes effective daily limits and warnings. W7S enforces immediate limits on deploys, runtime requests, RPC dispatches, queue sends, workflow starts, log ingestion, and internal queue/schedule/workflow deliveries. Direct binding usage such as D1/R2/KV/Durable Object cost is enforced after the hourly Cloudflare sync.

Repo events are also mirrored into owner-level and global aggregate rollups. Runtime guards check repo, owner, and global scopes so a single owner cannot multiply the free tier across many repos, and the shared account has a final circuit breaker.

## Read usage

Use the usage API with a GitHub token that can access the target repo:

```sh
curl "https://w7s.cloud/api/v1/usage/<owner>/<repo>?date=2026-05-26" \
  -H "Authorization: Bearer $GITHUB_TOKEN"
```

Include hourly Cloudflare records:

```sh
curl "https://w7s.cloud/api/v1/usage/<owner>/<repo>?date=2026-05-26&include=hourly" \
  -H "Authorization: Bearer $GITHUB_TOKEN"
```

By default, usage reads the `production` environment. Override the environment with either:

```text
?environment=staging
x-w7s-environment: staging
```

Read the effective limit policy without usage counters:

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
      "cloudflareSyncedAt": "2026-05-26T13:03:00.000Z",
      "cloudflareHours": ["2026-05-26T12"],
      "updatedAt": "2026-05-26T12:00:00.000Z"
    },
    "limits": {
      "version": 1,
      "period": "daily",
      "mode": "enforce",
      "metrics": {
        "workflow.create": {
          "metric": "workflow.create",
          "used": 4,
          "limit": 1000,
          "remaining": 996,
          "usageRatio": 0.004,
          "status": "ok",
          "source": "default"
        }
      },
      "warnings": []
    },
    "policy": {
      "version": 1,
      "period": "daily",
      "mode": "enforce",
      "environment": "production",
      "orgSlug": "w7s-io",
      "repoSlug": "example-workflows",
      "policy": {
        "workflow.create": {
          "metric": "workflow.create",
          "dailyUnits": 1000,
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
runtime.request
worker.request
runtime.cpu_ms
worker.script
static.r2_class_a
static.r2_class_b
r2.class_a
r2.class_b
r2.storage_bytes
kv.read
kv.write
kv.delete
kv.list
kv.storage_bytes
d1.rows_read
d1.rows_written
d1.read_queries
d1.write_queries
d1.storage_bytes
durable_object.request
durable_object.duration_ms
durable_object.rows_read
durable_object.rows_written
durable_object.storage_read_units
durable_object.storage_write_units
durable_object.storage_deletes
rpc.dispatch
queue.send
queue.delivery
schedule.delivery
workflow.create
workflow.delivery
log.write
```

`count` is the event count. `units` is usually the same value. Batch-like paths can record more units than a single event, such as queue delivery batches, bytes, rows, or CPU milliseconds. Cloudflare-polled metrics can use `source: "cloudflare"` or `source: "cloudflare_estimated"`.

## Daily limits

Current default daily limits:

```text
deploy               50
runtime.request      10000
worker.request       10000
runtime.cpu_ms       300000
worker.script        5
static.r2_class_a    1000
static.r2_class_b    20000
r2.class_a           1000
r2.class_b           20000
r2.storage_bytes     104857600
kv.read              10000
kv.write             1000
kv.delete            1000
kv.list              1000
kv.storage_bytes     52428800
d1.rows_read         100000
d1.rows_written      10000
d1.read_queries      10000
d1.write_queries     1000
d1.storage_bytes     52428800
durable_object.request       5000
durable_object.duration_ms   300000
durable_object.rows_read     100000
durable_object.rows_written  10000
durable_object.storage_read_units  100000
durable_object.storage_write_units 10000
durable_object.storage_deletes     10000
rpc.dispatch         10000
queue.send           10000
queue.delivery       10000
schedule.delivery    2000
workflow.create      1000
workflow.delivery    1000
log.write            5000
```

Owner-level default limits are 10x the repo defaults, with minimums of 200 deploys/day and 50 Worker scripts/day. Global default limits are 100x the repo defaults, with minimums of 2,000 deploys/day and 1,000 Worker scripts/day.

Each metric gets one of these statuses:

```text
ok        below 80%
warning   at or above 80%
exceeded  above 100%
```

Non-`ok` metrics are also listed in `warnings` for simpler dashboards and CLI output. Requests that would push a metric above its effective daily limit return HTTP `429`.

The `w7s-io/w7s-cloud@v1` GitHub Action reads this API after a successful deploy. When warnings exist, it adds them to the GitHub Actions summary and opens or updates one GitHub issue for that repo/environment.

Issue notifications require this workflow permission:

```yaml
permissions:
  contents: read
  issues: write
```

Set `usage-warnings-issue: false` on the action to keep warnings in the workflow summary only.

Daily quota checks can run the action in usage-check-only mode from a separate workflow:

```yaml
- uses: w7s-io/w7s-cloud@v1
  with:
    token: ${{ github.token }}
    usage-check-only: true
```

In this mode the action does not package or deploy the repository. It only reads the current day's W7S usage and creates or updates the usage warning issue when warnings exist. See [Recommendations](./recommendations.md) for the complete daily workflow.

## Enforcement

W7S has an internal `checkUsageLimit(...)` helper for expensive primitives. It reads current usage, applies the effective policy, and reports whether projected usage would exceed the daily limit.

The hook now reports hard enforcement:

```json
{
  "mode": "enforce",
  "enforcement": "hard",
  "metric": "workflow.create",
  "scope": "repo",
  "used": 8,
  "requestedUnits": 3,
  "projectedUnits": 11,
  "limit": 10,
  "status": "warning",
  "projectedStatus": "exceeded",
  "wouldBlock": true
}
```

When `wouldBlock` is true, public APIs return HTTP `429`. Internal queue, schedule, and workflow delivery paths skip dispatch once their delivery metric would exceed the effective daily limit.

W7S also applies short-window burst limits:

```text
deploy            repo 5/hour      owner 25/hour      global 200/hour
runtime.request   repo 300/min     owner 2000/min     global 10000/min
rpc.dispatch      repo 120/min     owner 600/min      global 5000/min
queue.send        repo 120/min     owner 600/min      global 5000/min
queue.delivery    repo 300/min     owner 1500/min     global 10000/min
schedule.delivery repo 30/min      owner 200/min      global 2000/min
workflow.create   repo 60/min      owner 300/min      global 2000/min
workflow.delivery repo 120/min     owner 600/min      global 5000/min
log.write         repo 500/min     owner 2000/min     global 10000/min
```

## Hourly Cloudflare sync

The W7S core cron runs once per minute for app schedules and also takes an hourly lock named `usage_collect_lock:v1:<hour>`. The collector queries Cloudflare analytics for the previous closed hour, stores records under:

```text
usage_cf_hourly:v1:<hour>:<environment>:<owner>:<repo>
```

Then it merges those hourly records into the daily rollup. If any reliably attributed metric exceeds its effective daily limit, W7S stores:

```text
app_limit_state:v1:<environment>:<owner>:<repo>
```

Suspended apps return HTTP `429` before static serving, Worker dispatch, deploys, RPC, queue sends, or workflow starts. Apps automatically resume at the next UTC day unless an operator writes a stricter state.

Direct binding limits are delayed by the hourly sync. Immediate protection comes from deploy shape caps, runtime request limits, short-window burst limits, and Cloudflare dispatch custom CPU limits on user Workers. Static asset storage is capped by deploy shape limits, and immutable static assets are served through the Worker Cache API using versioned asset keys to reduce R2 reads. Durable Object storage operation units are attributed by namespace ID when W7S can discover namespace IDs from invocation analytics; stored bytes are not per-app attributable in the current Cloudflare analytics schema and remain a tracked gap.

Queue sends reject JSON envelopes larger than 64 KB by default. New Queue consumers use bounded batch and retry settings: batch size 10, max retries 3, retry delay 10 seconds, and visibility timeout 300 seconds.

Workflow starts reject instance payloads larger than 64 KB by default. W7S also tracks active workflow instances and blocks new starts for a target repo at 50 active instances by default.

Worker log ingestion is capped by `log.write`, has short KV retention, truncates large log values, and drops whole tail batches when the target repo would exceed daily or burst log limits.

The scheduled handler also removes stale static assets, expired app suspensions, old usage records, and stale dispatch-namespace Worker scripts.

## Policy overrides

Limit policies are platform-owned. Apps cannot raise or lower their own limits through `w7s.json`.

W7S reads optional policy override records in this order:

```text
usage_limit_policy:v1:owner:<owner>
usage_limit_policy:v1:owner_environment:<environment>:<owner>
usage_limit_policy:v1:repo:<owner>:<repo>
usage_limit_policy:v1:repo_environment:<environment>:<owner>:<repo>
usage_limit_policy:v1:owner_total:<owner>
usage_limit_policy:v1:owner_total_environment:<environment>:<owner>
usage_limit_policy:v1:global
usage_limit_policy:v1:global_environment:<environment>
```

The first four scopes tune a repo's own daily policy. `owner_total`, `owner_total_environment`, `global`, and `global_environment` tune aggregate guardrails. Later records override earlier records within their own policy family.

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

They are not billing-grade yet. Concurrent events can be approximate, and Cloudflare analytics can arrive late, so enforcement is intentionally conservative and should be treated as free-tier protection rather than exact billing. Metrics marked `cloudflare_estimated` are visible for warnings but are not used to suspend apps.
