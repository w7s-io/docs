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

Native backend entrypoints:

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
dist/client/
dist/
build/
out/
```

Static roots normally need an `index.html`. `dist/client/` may be asset-only when paired with `dist/server/index.js`, which is the output produced by TanStack Start and similar Cloudflare/Vite SSR builds.

## App manifest

Native backends can include a `w7s.json` manifest to declare platform resources:

```json
{
  "bindings": {
    "kv": ["CACHE"],
    "r2": ["FILES"],
    "d1": [{ "binding": "DB", "migrations": "migrations" }]
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

See [Storage Bindings](./storage-bindings.md), [Backend RPC](./backend-rpc.md), and [Backend Queues](./backend-queues.md) for the runtime behavior of these declarations.

`schedules` declares cron-driven backend jobs. Each entry has a five-field UTC cron expression and an absolute backend path. See [Backend Schedules](./backend-schedules.md) for examples.
