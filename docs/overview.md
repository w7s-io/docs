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
- Native backend code from `backend/` or `worker/`.
- Fullstack apps that include both a backend root and a static frontend root.
- Durable Objects bound directly to native backends.
- Hyperdrive bindings for external Postgres databases.
- Backend-to-backend RPC through internal service bindings.
- Background queues delivered to backends/workers.
- Cron schedules delivered to native backends.
- Durable workflow instances delivered to native backends.
- Daily usage rollups, hourly Cloudflare usage sync, app suspension, warning thresholds, and hard daily limits.
- Platform event analytics exposed through an authenticated API.
- Custom domains declared with a `CNAME` file.

Continue with [Deploy From GitHub](./deploy-from-github.md), then add the [daily quota check recommendation](./recommendations.md).
