---
id: overview
slug: /
title: W7S
description: Open source deploy platform for GitHub-native apps. Ship frontend apps and JavaScript/TypeScript backends from GitHub Actions to W7S Cloud, with no dashboard, card, or cloud setup required.
---

W7S is an [open source](https://github.com/w7s-io/w7s-core) deployment platform managed directly from GitHub Actions workflows. W7S LLC is the company behind [w7s.io](https://w7s.io/) and [w7s.cloud](https://w7s.cloud/). The same W7S core can power [other deployment clouds](https://w7s.io/docs/self-host/).

The core idea is simple:

1. Put an app in a GitHub repository.
2. Add the W7S GitHub Action.
3. Push to GitHub.
4. W7S verifies the GitHub token, receives the deploy archive, and serves the app.

## Minimal workflow

```yaml
name: Deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - uses: w7s-io/w7s-cloud@v1
        with:
          token: ${{ github.token }}
```

## What W7S can deploy

- Static frontends built into `dist/`, `dist/client/`, `build/`, `out/`, or `frontend/dist/`.
  - [`w7s-io/example-static-site`](https://github.com/w7s-io/example-static-site)
- Native backend code from `backend/` or `worker/`, authored or built as JavaScript or TypeScript runtime modules.
  - [`w7s-io/example-native-backend`](https://github.com/w7s-io/example-native-backend)
- Fullstack apps that include both a JavaScript/TypeScript backend root and a static frontend root.
  - [`w7s-io/example-fullstack-ts`](https://github.com/w7s-io/example-fullstack-ts)
- Stateful object bindings for JavaScript/TypeScript native backends.
  - [`w7s-io/example-durable-counter`](https://github.com/w7s-io/example-durable-counter)
- Serverless SQL databases for JavaScript/TypeScript native backends.
  - [`w7s-io/example-serverless-database`](https://github.com/w7s-io/example-serverless-database)
- Postgres bindings for external databases.
  - [`w7s-io/example-postgres-binding`](https://github.com/w7s-io/example-postgres-binding)
- W7S-provided AI service bindings for JavaScript/TypeScript native backends.
  - [`w7s-io/example-ai-joke`](https://github.com/w7s-io/example-ai-joke)
- Backend-to-backend RPC through internal service bindings.
  - [`w7s-io/example-rpc-client`](https://github.com/w7s-io/example-rpc-client)
  - [`w7s-io/example-rpc-datetime`](https://github.com/w7s-io/example-rpc-datetime)
- Background queues delivered to JavaScript/TypeScript native backends.
  - [`w7s-io/example-queue-worker`](https://github.com/w7s-io/example-queue-worker)
  - [`w7s-io/example-queue-producer`](https://github.com/w7s-io/example-queue-producer)
  - [`w7s-io/example-queue-consumer`](https://github.com/w7s-io/example-queue-consumer)
- Cron schedules delivered to JavaScript/TypeScript native backends.
  - [`w7s-io/example-schedules`](https://github.com/w7s-io/example-schedules)
- Durable workflow instances delivered to JavaScript/TypeScript native backends.
  - [`w7s-io/example-workflows`](https://github.com/w7s-io/example-workflows)
- Daily usage rollups, hourly platform usage sync, app suspension, warning thresholds, and daily limits.
  - [`w7s-io/example-usage-check`](https://github.com/w7s-io/example-usage-check)
- Platform event analytics exposed through an authenticated API.
  - [`w7s-io/example-logs`](https://github.com/w7s-io/example-logs)
- Backend console and exception logs exposed through an authenticated API.
  - [`w7s-io/example-logs`](https://github.com/w7s-io/example-logs)
- Custom domains declared with a `CNAME` file.
  - [`w7s-io/example-fullstack-ts`](https://github.com/w7s-io/example-fullstack-ts)

## W7S vs Others

| Feature | W7S | Vercel | Cloudflare Pages + Workers | Railway / Fly.io |
| --- | --- | --- | --- | --- |
| GitHub-native deployment | <span className="w7s-compare-yes">Yes (one Action)</span> | Good | Manual | Good |
| Open Source + Self-hostable | <span className="w7s-compare-yes">Yes</span> | No | Partial | No |
| Native JS/TS Backends | <span className="w7s-compare-yes">Yes</span> | Serverless Functions | Workers | <span className="w7s-compare-yes">Yes</span> |
| Serverless SQL database | D1 included | Add-on | D1 | External |
| External Postgres | Supported | <span className="w7s-compare-yes">Yes (paid)</span> | Manual | <span className="w7s-compare-yes">Yes</span> |
| Queues, Cron & Workflows | Native | Limited | <span className="w7s-compare-yes">Yes</span> | <span className="w7s-compare-yes">Yes</span> |
| Vendor Lock-in | None | High | Medium | High |
| Pricing | Free self-host + hosted | Usage-based | Usage-based | Usage-based |

Continue with [Deploy From GitHub](./deploy-from-github.md), then add the [daily quota check recommendation](./recommendations.md).

To run your own W7S cloud on a Cloudflare account and domain you control, see [Self Host W7S](./self-host.md).
