---
id: backend-hyperdrive
title: Hyperdrive
description: Bind existing Cloudflare Hyperdrive configs to W7S JavaScript/TypeScript native backends.
---

JavaScript/TypeScript native W7S backends can declare Cloudflare Hyperdrive bindings in `w7s.json`. Hyperdrive lets Workers connect to external Postgres databases through Cloudflare's connection pooling layer.

W7S currently binds existing Hyperdrive configs by ID. It does not create Hyperdrive configs or rotate database credentials yet.

## Create a Hyperdrive config

Create the Hyperdrive config in Cloudflare first, then copy its ID:

```sh
npx wrangler hyperdrive create my-db --connection-string="postgres://user:password@host:5432/database"
```

## Declare the binding

Add `bindings.hyperdrive` to `w7s.json`:

```json title="w7s.json"
{
  "bindings": {
    "hyperdrive": [
      {
        "binding": "DB",
        "id": "cloudflare-hyperdrive-id"
      }
    ]
  }
}
```

W7S uploads this as a Cloudflare `hyperdrive` Worker binding. The binding is available at `env.DB`.

## Use it from a backend

Most Postgres clients need to be bundled in CI before deployment. A typical backend uses the Hyperdrive connection string:

```ts title="backend/index.ts"
import postgres from "postgres";

type Env = {
  DB: Hyperdrive;
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

Many Postgres drivers require Node.js compatibility in Workers. If your build emits `dist/server/index.js`, include `dist/server/wrangler.json` with compatibility flags:

```json title="dist/server/wrangler.json"
{
  "compatibility_flags": ["nodejs_compat_v2"]
}
```

W7S reads compatibility flags from that file when uploading the Worker.

## Limitations

- Hyperdrive requires a JavaScript or TypeScript native backend deployment.
- W7S does not create or update Hyperdrive configs yet.
- W7S does not manage origin database credentials.
- There is no shared public example repo yet, because a useful smoke test requires a real database origin.
