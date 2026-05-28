---
id: overview
slug: /
title: W7S
description: Open source deploy platform for GitHub-native apps.
---

W7S is an open source deploy platform managed directly from GitHub Actions workflows. It powers [w7s.cloud](https://w7s.cloud/), and the same core can power other deployment clouds.

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
- Native backend code from `backend/` or `worker/`, authored or built as JavaScript or TypeScript runtime modules.
- Fullstack apps that include both a JavaScript/TypeScript backend root and a static frontend root.
- Stateful object bindings for JavaScript/TypeScript native backends.
- Managed Postgres bindings for external databases.
- W7S-provided AI service bindings for JavaScript/TypeScript native backends.
- Backend-to-backend RPC through internal service bindings.
- Background queues delivered to JavaScript/TypeScript native backends.
- Cron schedules delivered to JavaScript/TypeScript native backends.
- Durable workflow instances delivered to JavaScript/TypeScript native backends.
- Daily usage rollups, hourly platform usage sync, app suspension, warning thresholds, and daily limits.
- Platform event analytics exposed through an authenticated API.
- Backend console and exception logs exposed through an authenticated API.
- Custom domains declared with a `CNAME` file.

Continue with [Deploy From GitHub](./deploy-from-github.md), then add the [daily quota check recommendation](./recommendations.md).

To run your own W7S cloud on a Cloudflare account and domain you control, see [Self Host W7S](./self-host.md).
