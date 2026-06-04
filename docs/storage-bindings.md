---
id: storage-bindings
title: Storage Bindings
description: Declare per-app storage, vars, and secrets for W7S backends.
---

JavaScript/TypeScript native W7S backends can declare durable resources in `w7s.json`. W7S creates one set of resources per repository and environment, then reuses them on later deploys.

For relational app data, the batteries-included path is `bindings.db`: a serverless DB that W7S provisions with the app. Most apps can start there without creating an external database account. See [Serverless Database](./serverless-database.md) for migrations and a complete example repo. If the app really needs an existing Postgres service, use a [Postgres binding](./backend-hyperdrive.md) instead.

```json
{
  "bindings": {
    "kv": ["CACHE"],
    "fs": ["FILES"],
    "db": [
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

`bindings.fs` creates FS buckets:

```json
{ "bindings": { "fs": ["FILES"] } }
```

`bindings.db` creates serverless DBs. The full setup flow is documented in [Serverless Database](./serverless-database.md).

```json
{ "bindings": { "db": [{ "binding": "DB" }] } }
```

By default, W7S generates resource names from the environment, owner, repo, resource type, and binding name. You can provide explicit names:

```json
{
  "bindings": {
    "kv": [{ "binding": "CACHE", "name": "my-cache" }],
    "fs": [{ "binding": "FILES", "name": "my-files" }],
    "db": [{ "binding": "DB", "name": "my-db" }]
  }
}
```

## SQL migrations

Point a SQL binding at a migrations directory:

```json
{
  "bindings": {
    "db": [{ "binding": "DB", "migrations": "migrations" }]
  }
}
```

W7S applies `.sql` files in sorted order. Applied migration filenames are tracked in `_w7s_migrations` inside the app database. See [Serverless Database](./serverless-database.md#add-migrations) for migration file examples.

## Runtime Values

Names listed in `vars` and `secrets` are collected automatically by the official GitHub Action when those values are present in the workflow environment:

```yaml
- uses: w7s-io/w7s-cloud@v1
  env:
    PUBLIC_API_KEY: ${{ vars.PUBLIC_API_KEY }}
    PRIVATE_API_KEY: ${{ secrets.PRIVATE_API_KEY }}
```

You can also pass names directly:

```yaml
- uses: w7s-io/w7s-cloud@v1
  env:
    PUBLIC_API_KEY: ${{ vars.PUBLIC_API_KEY }}
  with:
    vars: PUBLIC_API_KEY
```

Secret values are passed as backend secret bindings. Deploy summaries show secret counts, not secret values.

W7S also injects platform bindings for JavaScript/TypeScript native backends, including `W7S_RPC` for backend-to-backend calls, `W7S_QUEUE` for background work, and `W7S_AI` for model calls. See [Backend RPC](./backend-rpc.md), [Backend Queues](./backend-queues.md), and [Backend AI](./backend-ai.md).
