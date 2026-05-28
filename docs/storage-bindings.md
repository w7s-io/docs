---
id: storage-bindings
title: Storage Bindings
description: Declare per-app storage, vars, and secrets for W7S backends.
---

JavaScript/TypeScript native W7S backends can declare durable resources in `w7s.json`. W7S creates one set of resources per repository and environment, then reuses them on later deploys.

```json
{
  "bindings": {
    "kv": ["CACHE"],
    "r2": ["FILES"],
    "d1": [
      {
        "binding": "DB",
        "migrations": "migrations"
      }
    ]
  },
  "vars": ["PUBLIC_API_KEY"],
  "secrets": ["PRIVATE_API_KEY"]
}
```

## Storage

`bindings.kv` creates key-value namespaces:

```json
{ "bindings": { "kv": ["CACHE"] } }
```

`bindings.r2` creates object storage buckets:

```json
{ "bindings": { "r2": ["FILES"] } }
```

`bindings.d1` creates SQL databases:

```json
{ "bindings": { "d1": [{ "binding": "DB" }] } }
```

By default, W7S generates resource names from the environment, owner, repo, resource type, and binding name. You can provide explicit names:

```json
{
  "bindings": {
    "kv": [{ "binding": "CACHE", "name": "my-cache" }],
    "r2": [{ "binding": "FILES", "bucket": "my-files" }],
    "d1": [{ "binding": "DB", "name": "my-db" }]
  }
}
```

## SQL migrations

Point a SQL binding at a migrations directory:

```json
{
  "bindings": {
    "d1": [{ "binding": "DB", "migrations": "migrations" }]
  }
}
```

W7S applies `.sql` files in sorted order. Applied migration filenames are tracked in `_w7s_migrations` inside the app database.

## Runtime Values

Names listed in `vars` and `secrets` are collected automatically by the official GitHub Action when those values are present in the workflow environment:

```yaml
- uses: w7s-io/w7s-cloud@v1
  env:
    PUBLIC_API_KEY: ${{ vars.PUBLIC_API_KEY }}
    PRIVATE_API_KEY: ${{ secrets.PRIVATE_API_KEY }}
  with:
    token: ${{ github.token }}
```

You can also pass names directly:

```yaml
- uses: w7s-io/w7s-cloud@v1
  env:
    PUBLIC_API_KEY: ${{ vars.PUBLIC_API_KEY }}
  with:
    token: ${{ github.token }}
    vars: PUBLIC_API_KEY
```

Secret values are passed as backend secret bindings. Deploy summaries show secret counts, not secret values.

W7S also injects platform bindings for JavaScript/TypeScript native backends, including `W7S_RPC` for backend-to-backend calls, `W7S_QUEUE` for background work, and declared `W7S_AI` bindings for model calls. See [Backend RPC](./backend-rpc.md), [Backend Queues](./backend-queues.md), and [Backend AI](./backend-ai.md).
