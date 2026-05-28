---
id: backend-hyperdrive
title: Postgres Bindings
description: Bind existing managed Postgres configs to W7S JavaScript/TypeScript native backends.
---

JavaScript/TypeScript native W7S backends can declare managed Postgres bindings in `w7s.json`. These bindings let backend modules connect to external Postgres databases through the W7S-managed connection layer.

W7S currently binds existing managed Postgres configs by ID. It does not create those configs or rotate database credentials yet.

Working example repository:

- [`w7s-io/example-postgres-binding`](https://github.com/w7s-io/example-postgres-binding): backend source, build workflow, runtime compatibility metadata, and manual deploy workflow for a managed Postgres binding.

## Create a Postgres binding config

Create or request the managed Postgres binding config from the W7S operator, then copy its ID:

```text
postgres://user:password@host:5432/database
```

## Declare the binding

Add `bindings.hyperdrive` to `w7s.json`:

```json title="w7s.json"
{
  "bindings": {
    "hyperdrive": [
      {
        "binding": "DB",
        "id": "postgres-binding-id"
      }
    ]
  }
}
```

W7S exposes this binding to the backend at `env.DB`.

## Use it from a backend

Most Postgres clients need to be bundled in CI before deployment. A typical backend uses the managed connection string:

```ts title="backend/index.ts"
import postgres from "postgres";

type Env = {
  DB: {
    connectionString: string;
  };
};

export default {
  async fetch(_request: Request, env: Env) {
    const sql = postgres(env.DB.connectionString);
    const rows = await sql`select now() as now`;

    return Response.json({
      now: rows[0]?.now
    });
  }
};
```

Because W7S does not install dependencies or bundle apps during deploy, run your build in GitHub Actions before `w7s-io/w7s-cloud@v1`.

## Compatibility flags

Many Postgres drivers require Node.js compatibility in edge runtimes. If your build emits `dist/server/index.js`, include runtime compatibility metadata with the backend output:

```json title="runtime compatibility metadata"
{
  "compatibility_flags": ["nodejs_compat_v2"]
}
```

W7S reads supported compatibility flags from the backend output when uploading the backend module.

## Limitations

- Managed Postgres bindings require a JavaScript or TypeScript native backend deployment.
- W7S does not create or update managed Postgres configs yet.
- W7S does not manage origin database credentials.
- The shared example is manual-deploy because a useful live smoke test requires a real external database and managed Postgres binding config ID.
