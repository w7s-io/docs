---
id: self-host
title: Self Host W7S
description: Run your own W7S cloud on Cloudflare.
---

W7S is open source. The hosted `w7s.cloud` service is one deployment of the W7S core Worker, and you can run the same core on your own Cloudflare account and domain.

Self-hosting gives you the same deployment model:

```text
https://<github-owner>.<your-domain>/<repo>/
```

The public hosted service uses:

```text
https://<github-owner>.w7s.cloud/<repo>/
```

Your self-hosted cloud uses the same GitHub-token authorization model, the same `w7s-io/w7s-cloud@v1` deploy action, and the same app repository layout.

## What You Run

A W7S cloud is one Cloudflare Worker plus Cloudflare account resources:

- a public W7S core Worker that serves the landing page, API, static assets, and runtime router;
- one Workers for Platforms dispatch namespace for native backend Workers;
- one KV namespace for deployment metadata, manifests, usage, logs, limits, and app records;
- one R2 bucket for deployed static frontend assets;
- one Cloudflare Workflow binding for app workflow dispatch;
- optional Analytics Engine dataset for platform event analytics;
- optional Telegram bot secrets for platform manager and repo notifications.

The core deploy workflow creates or reuses the KV namespace, R2 bucket, and dispatch namespace. DNS records are intentionally manual so the domain owner stays in control.

## Requirements

You need:

- a Cloudflare account;
- a Cloudflare zone you control, such as `example.com`;
- Workers for Platforms available on that Cloudflare account;
- a GitHub repo forked from [`w7s-io/w7s-core`](https://github.com/w7s-io/w7s-core);
- a Cloudflare API token available to the fork's GitHub Actions workflow;
- the ability to create DNS records in the Cloudflare zone.

The current core expects `W7S_ZONE_NAME` to be a Cloudflare zone name. Use a dedicated zone like `example.com` or `w7s.example.com` only if that subdomain is onboarded as its own Cloudflare zone.

## 1. Fork The Core

Fork the core repo:

```text
https://github.com/w7s-io/w7s-core
```

The fork keeps the included workflow:

```text
.github/workflows/deploy.yml
```

That workflow installs dependencies, runs checks, generates a Wrangler config from Cloudflare API state, deploys the core Worker, and reconciles Worker routes.

## 2. Create A Cloudflare API Token

Create a Cloudflare API token for the account that owns the zone.

The token needs enough access to:

- deploy Workers;
- manage Workers routes for the W7S zone;
- read zones;
- create and read KV namespaces;
- create and read R2 buckets;
- create, read, and query managed DB resources for app bindings;
- create and read Workers for Platforms dispatch namespaces;
- publish scripts into the dispatch namespace;
- deploy Cloudflare Workflows attached to the core Worker.

If you want deployed apps to claim custom domains under other Cloudflare zones, the same token also needs zone read and Workers route permissions for those zones.

## 3. Set GitHub Secrets

In your core fork, add these repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

Optional Telegram manager notification secrets:

```text
W7S_TELEGRAM_BOT_TOKEN
W7S_TELEGRAM_CHAT_ID
W7S_TELEGRAM_WEBHOOK_SECRET
```

The manager chat id is the chat, group, or channel the bot should message. For a private chat, send `/start` to the bot before using the chat id.

## 4. Set GitHub Variables

At minimum, set the base domain and enable the wildcard route:

```text
W7S_ZONE_NAME=example.com
W7S_ATTACH_WILDCARD_ROUTE=true
```

Optional variables let you change resource names and runtime limits:

```text
W7S_DEPLOYMENTS_KV_NAME=w7s-io-deployments
W7S_STATIC_ASSETS_BUCKET=w7s-io-static-assets
W7S_DISPATCH_NAMESPACE=w7s-isolate
W7S_ANALYTICS_DATASET=w7s_platform_events
W7S_WORKFLOW_NAME=w7s-workflows
W7S_USER_WORKER_CPU_MS=50
W7S_USER_WORKER_SUBREQUESTS=25
W7S_TELEGRAM_EVENTS=all
```

Use different names if the Cloudflare account already has resources with the defaults.

## 5. Configure DNS

Create a proxied wildcard record in the Cloudflare zone:

```text
Type: CNAME
Name: *
Target: example.com
Proxy status: Proxied
TTL: Auto
```

This makes `guerrerocarlos.example.com`, `w7s-io.example.com`, and every other owner host reach the core Worker.

The core deploy attaches the Worker to:

```text
example.com
*.example.com/*
```

The apex host can serve the default W7S page or a same-name GitHub repo. Owner subdomains serve deployed apps.

## 6. Deploy The Core

Run the core repo's `Deploy` workflow from GitHub Actions, or push to `main`.

The workflow runs:

```sh
npm ci
npm run check
npm run prepare:cloudflare
npx wrangler deploy --config wrangler.generated.jsonc --secrets-file .wrangler/secrets.json
npm run reconcile:cloudflare-routes
```

`npm run prepare:cloudflare` creates or reuses:

- the `DEPLOYMENTS_KV` namespace;
- the `STATIC_ASSETS` R2 bucket;
- the `DISPATCHER` Workers for Platforms dispatch namespace;
- the generated Wrangler config used for the deploy.

Validate the deployment:

```sh
curl https://example.com/health
```

A healthy response includes the core commit, branch, and deployment timestamp.

## 7. Deploy Apps To Your Cloud

In an app repo, point the official action at your self-hosted deploy API:

```yaml
name: Deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  issues: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - uses: w7s-io/w7s-cloud@v1
        with:
          token: ${{ github.token }}
          deploy-url: https://example.com/api/v1/deploy
```

After deployment, a repo such as `github.com/acme/api` is served at:

```text
https://acme.example.com/api/
```

Non-production branches are served from branch-prefixed hosts:

```text
https://feature-login--acme.example.com/api/
```

## Custom Domains

Apps can still declare custom domains with a `CNAME` file:

```text
app.customer.com
```

The domain owner must point DNS at your W7S cloud, usually:

```text
Type: CNAME
Name: app
Target: example.com
Proxy status: Proxied
TTL: Auto
```

For stronger ownership control, add a TXT allowlist at the custom domain zone:

```text
Name: _w7s.customer.com
Value: acme/api
```

TXT values can be comma-separated and may allow a whole GitHub owner or one repo:

```text
acme
acme/api,partners
```

## Operations

Self-hosting means you own the Cloudflare bill and the operational policy.

Keep these in place from day one:

- daily usage limits and burst limits;
- `W7S_USER_WORKER_CPU_MS` and `W7S_USER_WORKER_SUBREQUESTS` caps;
- short log retention with `W7S_LOG_RETENTION_SECONDS`;
- `W7S_ANALYTICS_DATASET` for platform events, if you want queryable history;
- the daily GitHub Actions quota-check workflow for app repos;
- Telegram manager notifications for deploy warnings, deploy errors, app suspensions, and usage collection failures.

Because deploys are still authorized with the app repo's GitHub token, you do not need a separate W7S account system for app owners. If the workflow token can read `owner/repo`, it can deploy `owner/repo` to your W7S cloud.
