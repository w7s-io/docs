---
id: deploy-api
title: Deploy API
description: Low-level deploy API used by the W7S GitHub Action.
---

Most users should deploy with `w7s-io/w7s-cloud@v1`. The deploy action calls the W7S deploy API.

## Endpoint

```text
POST https://w7s.cloud/api/v1/deploy
```

The request body is a zip archive.

## Headers

```text
Authorization: Bearer <github-token>
x-github-repository: owner/repo
x-github-sha: <commit-sha>
x-github-branch: <branch-name>
content-type: application/zip
```

`application/octet-stream` is also accepted.

Optional runtime value headers are base64url-encoded JSON objects:

```text
x-w7s-vars: <base64url-json-object>
x-w7s-secrets: <base64url-json-object>
```

The official GitHub Action writes these headers from `w7s.json` and the workflow environment.

## Authentication

W7S checks the token against GitHub:

```text
GET https://api.github.com/repos/owner/repo
Authorization: Bearer <github-token>
```

If GitHub returns `401`, `403`, or `404`, W7S rejects the deploy.

## Environments

By default:

- `main` and `master` deploy to `production`.
- Other branches deploy to a sanitized branch environment.

Production deployments are served from the owner host:

```text
https://<owner>.w7s.cloud/<repo>/
```

Non-production branch deployments are served from a branch-prefixed host:

```text
https://<branch-name>--<owner>.w7s.cloud/<repo>/
```

The branch name in the hostname is sanitized for DNS. For example, `feature/login` becomes:

```text
https://feature-login--owner.w7s.cloud/repo/
```

You can override the environment with either:

```text
?environment=staging
x-w7s-environment: staging
```

## Deployable Outputs

Native backend entrypoints are JavaScript or TypeScript Worker modules only:

```text
backend/index.js
backend/index.mjs
backend/index.ts
backend/index.mts
worker/index.js
worker/index.mjs
worker/index.ts
worker/index.mts
dist/server/index.js
dist/server/index.mjs
```

Static frontend roots:

```text
frontend/dist/
frontend/build/
frontend/out/
dist/client/
dist/
build/
out/
```

Static roots normally need an `index.html`. `dist/client/` may be asset-only when paired with `dist/server/index.js`, which is the output produced by TanStack Start and similar Cloudflare/Vite SSR builds.

If `backend/`, `worker/`, or `dist/server/` exists but does not contain a supported JavaScript or TypeScript entrypoint, W7S still deploys a valid static frontend and returns a `deploymentWarnings` entry explaining that the backend was skipped. If there is no deployable frontend, the archive is rejected.

## Free-tier shape caps

W7S rejects deploys that are too large or declare too many resources before anything is published:

```text
archive zip bytes       25 MB
uncompressed bytes      100 MB
static files            1000
static total bytes      100 MB
static single file      10 MB
KV bindings             3
R2 bindings             3
D1 bindings             2
Durable Object classes  2
queues                  2
schedules               5
workflows               5
custom domains          3
D1 migration files      50
D1 migration SQL bytes  5 MB
```

Native Workers are dispatched with a custom CPU limit from `W7S_USER_WORKER_CPU_MS`, default `50`, and a subrequest limit from `W7S_USER_WORKER_SUBREQUESTS`, default `25`.

Native Worker uploads include a W7S-managed Tail Worker consumer for user Worker logs unless the platform operator disables it. See [Observability](./observability.md) for the logs API.

## App manifest

JavaScript/TypeScript native backends can include a `w7s.json` manifest to declare platform resources:

```json
{
  "bindings": {
    "kv": ["CACHE"],
    "r2": ["FILES"],
    "d1": [{ "binding": "DB", "migrations": "migrations" }],
    "durableObjects": [
      {
        "binding": "COUNTER",
        "className": "Counter"
      }
    ],
    "hyperdrive": [
      {
        "binding": "DB",
        "id": "cloudflare-hyperdrive-id"
      }
    ]
  },
  "queues": ["jobs"],
  "schedules": [
    {
      "cron": "*/5 * * * *",
      "path": "/_w7s/schedules/sync"
    }
  ],
  "rpc": {
    "allow": ["another-owner/client"]
  },
  "queue": {
    "allow": ["another-owner/client"]
  },
  "vars": ["PUBLIC_API_KEY"],
  "secrets": ["PRIVATE_API_KEY"]
}
```

`queues` declares Cloudflare Queues for the app. A string queue declaration uses the default consumer path `/_w7s/queues/<queue>`. Use an object to set a custom consumer path:

```json
{
  "queues": [
    {
      "name": "jobs",
      "consumer": "/internal/queues/jobs"
    }
  ]
}
```

`bindings.durableObjects` declares Durable Object classes exported by the JavaScript/TypeScript native backend. W7S uploads them as `durable_object_namespace` bindings and creates SQLite-backed classes when first deployed. See [Durable Objects](./backend-durable-objects.md) for examples.

`bindings.hyperdrive` declares existing Cloudflare Hyperdrive configs by ID. W7S uploads them as `hyperdrive` bindings. See [Hyperdrive](./backend-hyperdrive.md) for examples.

See [Storage Bindings](./storage-bindings.md), [Backend RPC](./backend-rpc.md), and [Backend Queues](./backend-queues.md) for the runtime behavior of the other declarations.

`schedules` declares cron-driven backend jobs. Each entry has a five-field UTC cron expression and an absolute backend path. See [Backend Schedules](./backend-schedules.md) for examples.

## Usage API

W7S also exposes per-app daily usage rollups with hard daily limits and warning thresholds:

```text
GET https://w7s.cloud/api/v1/usage/<owner>/<repo>?date=YYYY-MM-DD
Authorization: Bearer <github-token>
```

Effective limit policies are available without usage counters:

```text
GET https://w7s.cloud/api/v1/limits/<owner>/<repo>
Authorization: Bearer <github-token>
```

The token must have access to the GitHub repository, just like deploys. See [Usage Accounting](./usage-accounting.md) for the response shape and current limits.
