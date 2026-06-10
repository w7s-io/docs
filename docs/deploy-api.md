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
Authorization: Bearer <github-actions-oidc-token>
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

W7S authenticates deploys with a GitHub Actions OIDC JWT. The token must be issued by `https://token.actions.githubusercontent.com`, use `w7s.cloud`, `https://w7s.cloud`, or the default GitHub owner URL as the audience, and include a `repository` claim matching `x-github-repository`.

Workflows must grant OIDC token access:

```yaml
permissions:
  id-token: write
  contents: read
```

Legacy GitHub API bearer tokens are still accepted for compatibility.

## Environments

By default:

- `main` and `master` deploy to `production`.
- Other branches deploy to a sanitized branch environment.

Custom domains declared with `CNAME` are only honored from the `main` branch. Other branches ignore `CNAME` declarations and use their default branch environment URL.

Environment names are DNS-safe. W7S lowercases the branch or explicit override, replaces runs of characters outside `a-z`, `0-9`, and `-` with `-`, collapses repeated hyphens, trims leading/trailing hyphens, and caps the result at 63 characters.

Production deployments are served from the owner host:

```text
https://<owner>.w7s.cloud/<repo>/
```

Non-production branch deployments are served from a branch-prefixed host:

```text
https://<branch-environment>--<owner>.w7s.cloud/<repo>/
```

For example, branch `feature/API.v2_test` becomes environment `feature-api-v2-test`:

```text
https://feature-api-v2-test--owner.w7s.cloud/repo/
```

You can override the environment with either:

```text
?environment=staging
x-w7s-environment: staging
```

## Deployable Outputs

Native backend entrypoints are JavaScript or TypeScript runtime modules only:

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

Static roots normally need an `index.html`. `dist/client/` may be asset-only when paired with `dist/server/index.js`, which is the output produced by TanStack Start and similar SSR builds.

If `backend/`, `worker/`, or `dist/server/` exists but does not contain a supported JavaScript or TypeScript entrypoint, W7S still deploys a valid static frontend and returns a `deploymentWarnings` entry explaining that the backend was skipped. If there is no deployable frontend, the archive is rejected.

See [Project Layouts](./project-layouts.md#native-backend-function-shape) for the native backend handler contract and a Hono example.

## Free-tier shape caps

W7S rejects deploys that are too large or declare too many resources before anything is published:

```text
archive zip bytes       25 MB
uncompressed bytes      100 MB
static files            1000
static total bytes      100 MB
static single file      10 MB
Key-value bindings      3
FS bindings             3
SQL bindings            2
Stateful object classes 2
queues                  2
schedules               5
workflows               5
custom domains          3
SQL migration files     50
SQL migration bytes     5 MB
```

Native backends are dispatched with a custom CPU limit from `W7S_USER_WORKER_CPU_MS`, default `50`, and a subrequest limit from `W7S_USER_WORKER_SUBREQUESTS`, default `25`.

Native backend uploads include W7S-managed log capture unless the platform operator disables it. See [Observability](./observability.md) for the logs API.

## App manifest

JavaScript/TypeScript native backends can include a `w7s.json` manifest to declare platform resources:

```json
{
  "bindings": {
    "kv": ["CACHE"],
    "fs": ["FILES"],
    "db": [{ "binding": "DB", "migrations": "migrations" }],
    "durableObjects": [
      {
        "binding": "COUNTER",
        "className": "Counter"
      }
    ],
    "hyperdrive": [
      {
        "binding": "DB",
        "id": "postgres-binding-id"
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

`queues` declares managed background queues for the app. A string queue declaration uses the default consumer path `/_w7s/queues/<queue>`. Use an object to set a custom consumer path:

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

`bindings.durableObjects` declares stateful object classes exported by the JavaScript/TypeScript native backend. W7S creates persistent classes when first deployed. See [Stateful Objects](./backend-durable-objects.md) for examples.

`bindings.hyperdrive` declares existing managed Postgres binding configs by ID. W7S exposes them to the backend at the configured binding name. See [Postgres Bindings](./backend-hyperdrive.md) for examples.

See [Storage Bindings](./storage-bindings.md), [Backend AI](./backend-ai.md), [Backend RPC](./backend-rpc.md), and [Backend Queues](./backend-queues.md) for the runtime behavior of the other declarations.

`schedules` declares cron-driven backend jobs. Each entry has a five-field UTC cron expression and an absolute backend path. See [Backend Schedules](./backend-schedules.md) for examples.

## Usage API

W7S also exposes per-app daily usage rollups with daily limits and warning thresholds:

```text
GET https://w7s.cloud/api/v1/usage/<owner>/<repo>?date=YYYY-MM-DD
Authorization: Bearer <github-actions-oidc-token>
```

Effective limit policies are available without usage counters:

```text
GET https://w7s.cloud/api/v1/limits/<owner>/<repo>
Authorization: Bearer <github-actions-oidc-token>
```

The token must have access to the GitHub repository, just like deploys. See [Usage Accounting](./usage-accounting.md) for the response shape and current limits.
