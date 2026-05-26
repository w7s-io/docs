---
id: pricing
title: Pricing
description: W7S community free tier and cost examples for usage beyond it.
---

W7S Community is designed to be useful before billing exists. The hosted `w7s.cloud` service currently protects the shared Cloudflare account with hard per-repository daily limits. When an app reaches a hard limit, W7S returns `429` or skips the internal delivery that would exceed the cap.

Self-serve paid billing is not implemented in this repo yet. For now, usage outside the community free tier means a W7S operator can raise a repo, owner, or environment limit with an explicit usage policy. The cost examples below are estimates from Cloudflare's published pricing and are meant to show what a paid tier would have to cover.

## What the free tier includes

These defaults apply per GitHub repository, per W7S environment, per UTC day.

| Area | Included | Usage metrics | Notes |
| --- | ---: | --- | --- |
| Deploys | 50 deploys | `deploy` | Separate from GitHub Actions minutes. |
| Runtime routing | 10,000 requests | `runtime.request` | Requests handled by W7S routing before static or Worker dispatch. |
| User Worker requests | 10,000 requests | `worker.request` | Native backend requests dispatched into the app Worker. |
| User Worker CPU | 300,000 ms | `runtime.cpu_ms` | W7S also sets a per-invocation CPU cap on user Workers. |
| Worker scripts | 5 script versions | `worker.script` | Protects the Cloudflare for Platforms script count. |
| Static frontend deploy writes | 1,000 R2 Class A ops | `static.r2_class_a` | Static assets are stored in R2. Deploy shape caps also apply. |
| Static frontend reads | 20,000 R2 Class B ops | `static.r2_class_b` | Typical asset reads from R2. |
| App R2 writes | 1,000 Class A ops | `r2.class_a` | For app-declared R2 bindings. |
| App R2 reads | 20,000 Class B ops | `r2.class_b` | For app-declared R2 bindings. |
| R2 storage | 100 MB | `r2.storage_bytes` | Applies to W7S-attributed app R2 usage. |
| KV reads | 10,000 reads | `kv.read` | For app-declared KV bindings. |
| KV writes | 1,000 writes | `kv.write` | Per-key KV operations. |
| KV deletes | 1,000 deletes | `kv.delete` | Per-key KV operations. |
| KV lists | 1,000 lists | `kv.list` | List operations can get expensive in scans. |
| KV storage | 50 MB | `kv.storage_bytes` | W7S logs also use KV internally with short retention. |
| D1 reads | 100,000 rows | `d1.rows_read` | D1 bills by rows scanned, not rows returned. |
| D1 writes | 10,000 rows | `d1.rows_written` | Inserts, updates, deletes, and index updates count. |
| D1 read queries | 10,000 queries | `d1.read_queries` | Query-count guard in addition to row counters. |
| D1 write queries | 1,000 queries | `d1.write_queries` | Query-count guard in addition to row counters. |
| D1 storage | 50 MB | `d1.storage_bytes` | Per app database storage guard. |
| Durable Object requests | 5,000 requests | `durable_object.request` | Includes calls routed to app Durable Objects. |
| Durable Object duration | 300,000 ms | `durable_object.duration_ms` | Synced from Cloudflare analytics. |
| Durable Object SQL reads | 100,000 rows | `durable_object.rows_read` | SQLite-backed Durable Objects. |
| Durable Object SQL writes | 10,000 rows | `durable_object.rows_written` | SQLite-backed Durable Objects. |
| Durable Object KV read units | 100,000 units | `durable_object.storage_read_units` | For Durable Object storage usage reported as units. |
| Durable Object KV write units | 10,000 units | `durable_object.storage_write_units` | For Durable Object storage usage reported as units. |
| Durable Object deletes | 10,000 deletes | `durable_object.storage_deletes` | For Durable Object storage delete operations. |
| Backend RPC | 10,000 dispatches | `rpc.dispatch` | Internal `env.W7S_RPC.fetch(...)` calls. |
| Queue sends | 10,000 sends | `queue.send` | W7S API sends; Cloudflare may bill multiple ops for large or retried messages. |
| Queue deliveries | 10,000 deliveries | `queue.delivery` | Delivery into the target backend consumer route. |
| Schedule deliveries | 2,000 deliveries | `schedule.delivery` | Cron-like scheduled dispatches into native backends. |
| Workflow starts | 1,000 starts | `workflow.create` | Calls to `env.W7S_WORKFLOW.fetch(...)`. |
| Workflow deliveries | 1,000 deliveries | `workflow.delivery` | Durable step delivery into the app backend. |
| Worker log ingestion | 5,000 records | `log.write` | Tail Worker console, exception, and outcome records retained in KV. |

W7S also applies owner-level aggregate caps at 10x the repo defaults, and global aggregate caps at 100x the repo defaults. Those aggregate caps are circuit breakers for the shared account; they can block traffic even when one repo is still under its own daily cap.

Short-window burst caps protect fast cost burns before daily counters or hourly Cloudflare analytics can react. The main defaults are 300 runtime requests/minute per repo, 120 RPC or queue sends/minute per repo, 60 workflow starts/minute per repo, 500 log records/minute per repo, and 5 deploys/hour per repo.

Deploy archives also have shape caps:

```text
archive size          25 MB
expanded archive      100 MB
static files          1000
static total bytes    100 MB
static single file    10 MB
queues                2
schedules             5
workflows             5
```

See [Usage Accounting](./usage-accounting.md) for the live usage API, warning thresholds, and enforcement details.

## Cost basis outside the free tier

W7S runs on Cloudflare, so the platform has to cover Cloudflare usage. Current public Cloudflare pricing, checked on May 26, 2026:

| Cloudflare product | Included usage | Overage rate |
| --- | --- | --- |
| Workers for Platforms | $25/month, 20M requests, 60M CPU-ms, 1000 scripts | $0.30/M requests, $0.02/M CPU-ms, $0.02/script |
| Workers Standard | $5/month, 10M requests, 30M CPU-ms | $0.30/M requests, $0.02/M CPU-ms |
| R2 Standard | 10 GB-month, 1M Class A, 10M Class B | $0.015/GB-month, $4.50/M Class A, $0.36/M Class B |
| Workers KV | 10M reads, 1M writes, 1M deletes, 1M lists, 1 GB storage | $0.50/M reads, $5/M writes/deletes/lists, $0.50/GB-month |
| D1 | 25B rows read, 50M rows written, 5 GB storage | $0.001/M rows read, $1/M rows written, $0.75/GB-month |
| Durable Objects | 1M requests, 400,000 GB-s, 5 GB SQL storage | $0.15/M requests, $12.50/M GB-s, $0.20/GB-month SQL storage |
| Queues | 1M operations | $0.40/M operations |
| Workflows | 10M invocations, 30M CPU-ms, 1 GB state | $0.30/M invocations, $0.02/M CPU-ms, $0.20/GB-month state |
| Hyperdrive | 100,000 queries/day on Free; unlimited on Paid | No separate Hyperdrive query overage listed; origin database costs still apply |
| Workers Logs | 20M log events/month on Paid | $0.60/M log events |

Cloudflare for Platforms and Workers pricing are relevant to the W7S core. R2, KV, D1, Durable Objects, Queues, Workflows, Hyperdrive, and Logs depend on what deployed apps use.

## Example estimates

These examples assume usage is authorized outside W7S Community caps. They do not include W7S operator margin, support, domain registration, third-party APIs, or external database hosting.

### Static documentation site

Usage:

- 100 deploys/month.
- 500 files per deploy, or 50,000 R2 Class A writes.
- 2M asset reads/month.
- 500 MB stored.

Estimated Cloudflare R2 overage:

```text
Storage:      under 10 GB included       $0.00
Class A ops:  under 1M included          $0.00
Class B ops:  under 10M included         $0.00
Total:                                    $0.00
```

This can still exceed the W7S Community daily `static.r2_class_b` cap if traffic is bursty. The Cloudflare account may have room, but W7S blocks earlier to protect the shared platform.

### High-traffic static assets

Usage:

- 100,000 files averaging 100 KB.
- 10M asset reads/day for 30 days.

Estimated Cloudflare R2 overage:

```text
Storage:      under 10 GB included                  $0.00
Class A ops:  under 1M included                     $0.00
Class B ops:  (300M - 10M) * $0.36/M              $104.40
Total:                                             $104.40
```

### Busy API backend

Usage:

- 30M dynamic requests/month.
- 5 ms average CPU per request.
- Fewer than 1000 active user Worker scripts.

Estimated Cloudflare Workers for Platforms cost:

```text
Base Workers for Platforms plan:                    $25.00
Requests: (30M - 20M) * $0.30/M                      $3.00
CPU:      ((30M * 5 ms) - 60M) * $0.02/M CPU-ms       $1.80
Scripts:  under 1000 included                         $0.00
Total:                                                $29.80
```

### Fullstack app with heavy D1 usage

Usage:

- 5M dynamic requests/month, 3 ms average CPU.
- 30B D1 rows read.
- 100M D1 rows written.
- 10 GB D1 storage.

Estimated Cloudflare D1 overage:

```text
D1 reads:   (30B - 25B) rows * $0.001/M              $5.00
D1 writes:  (100M - 50M) rows * $1.00/M             $50.00
D1 storage: (10 GB - 5 GB) * $0.75/GB-month          $3.75
D1 total:                                             $58.75
```

The Worker compute for this example fits within Workers for Platforms included request and CPU allotments, so a self-hosted W7S platform would still need to cover the $25/month platform plan.

### Queue producer and consumer

Usage:

- 1M messages/month.
- Messages are under 64 KB.
- Each message is delivered once.

Cloudflare Queues usually needs one write, one read, and one delete operation per delivered message:

```text
Operations: (1M messages * 3) = 3M operations
Billable:   (3M - 1M included) * $0.40/M             $0.80
Total:                                                $0.80
```

Retries add read operations. Dead-letter queues add write operations. Messages larger than 64 KB are billed as multiple operation chunks.

### Durable Object app

Usage:

- 10M Durable Object requests/month.
- 800,000 GB-s of Durable Object duration.
- 20 GB SQLite Durable Object storage.

Estimated Cloudflare Durable Objects overage:

```text
Requests:  (10M - 1M) * $0.15/M                      $1.35
Duration:  (800,000 - 400,000) GB-s * $12.50/M        $5.00
Storage:   (20 GB - 5 GB) * $0.20/GB-month            $3.00
Total:                                                $9.35
```

This is the class of workload where W7S's conservative daily Durable Object caps matter most. Duration-heavy objects can accumulate platform cost quickly if they are unable to hibernate.

### Workflow-heavy app

Usage:

- 2M workflow starts/month.
- 5 ms average CPU per workflow.
- 2 GB workflow state retained.

Estimated Cloudflare Workflows overage:

```text
Invocations: under 10M included                       $0.00
CPU:         under 30M CPU-ms included                $0.00
State:       (2 GB - 1 GB) * $0.20/GB-month           $0.20
Total:                                                $0.20
```

The W7S Community cap is intentionally much lower: 1,000 workflow starts and 1,000 workflow deliveries per day. That keeps the shared platform safe while the workflow integration is still young.

## What this means for W7S pricing

A practical paid W7S tier would need to include:

- a monthly platform share for Workers for Platforms;
- per-repo limit overrides for requests, CPU, scripts, storage, queues, workflows, and logs;
- a buffer for bursty usage and delayed Cloudflare analytics;
- operator margin for support, incidents, and abuse handling.

Until billing exists, treat W7S Community as a free deployment playground with hard caps. For production apps that need higher limits, the current path is to run your own W7S instance on Cloudflare or arrange explicit hosted limit overrides.

## Source pricing pages

- [Cloudflare Workers for Platforms pricing](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/pricing/)
- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Cloudflare D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [Cloudflare Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- [Cloudflare Queues pricing](https://developers.cloudflare.com/queues/platform/pricing/)
- [Cloudflare Workflows pricing](https://developers.cloudflare.com/workflows/reference/pricing/)
- [Cloudflare Hyperdrive pricing](https://developers.cloudflare.com/hyperdrive/platform/pricing/)
- [Cloudflare Workers Logs pricing](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
