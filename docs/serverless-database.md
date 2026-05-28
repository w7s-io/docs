---
id: serverless-database
title: Serverless Database
description: Use the W7S serverless database from JavaScript and TypeScript native backends, with SQL migrations and Drizzle ORM.
---

W7S can provision a serverless SQL database for a JavaScript/TypeScript native backend. Declare the database in `w7s.json`, keep SQL migrations in the repo, and read the binding from `env.DB` inside the backend worker.

The full Drizzle example is available here:

- GitHub: [w7s-io/example-serverless-database](https://github.com/w7s-io/example-serverless-database)
- Live app: [w7s-io.w7s.cloud/example-serverless-database](https://w7s-io.w7s.cloud/example-serverless-database/)
- Live notes API: [w7s-io.w7s.cloud/example-serverless-database/api/notes](https://w7s-io.w7s.cloud/example-serverless-database/api/notes)

## Declare The Database

Add a `d1` binding in `w7s.json`. The binding name becomes the property available on `env`.

```json
{
  "bindings": {
    "d1": [
      {
        "binding": "DB",
        "migrations": "migrations"
      }
    ]
  }
}
```

W7S creates and reuses one database per repository and environment. For the manifest above, backend code reads the database at `env.DB`.

## Add Migrations

Keep migrations as plain `.sql` files in the directory named by `migrations`.

```text
migrations/
  0001_create_notes.sql
  0002_seed_notes.sql
```

```sql title="migrations/0001_create_notes.sql"
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes (created_at);
```

```sql title="migrations/0002_seed_notes.sql"
INSERT INTO notes (body)
VALUES ('Hello from the W7S serverless database');
```

W7S applies `.sql` files in sorted order during deploy. Applied migration filenames are tracked in `_w7s_migrations` inside the app database, so later deploys only run new migrations.

## Use Drizzle

Install Drizzle and a normal TypeScript build toolchain:

```sh
npm install drizzle-orm
npm install -D drizzle-kit esbuild typescript @cloudflare/workers-types
```

Define the schema once and let Drizzle type your queries:

```ts title="backend/src/schema.ts"
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)
});
```

Point Drizzle Kit at the schema if you want to generate future SQL migrations from the TypeScript schema:

```ts title="drizzle.config.ts"
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./backend/src/schema.ts",
  out: "./migrations",
  dialect: "sqlite"
});
```

## Query From The Backend

Native backends default-export a `fetch(request, env, ctx)` handler. The database binding is available on `env.DB`.

```ts title="backend/src/index.ts"
import type { D1Database } from "@cloudflare/workers-types";
import { desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { notes } from "./schema";

type Env = {
  DB: D1Database;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const db = drizzle(env.DB);

    if (url.pathname === "/api/notes" && request.method === "GET") {
      const rows = await db
        .select()
        .from(notes)
        .orderBy(desc(notes.createdAt))
        .limit(20);

      return Response.json({ notes: rows });
    }

    if (url.pathname === "/api/notes" && request.method === "POST") {
      const { body } = await request.json<{ body: string }>();
      const [note] = await db
        .insert(notes)
        .values({ body, createdAt: new Date().toISOString() })
        .returning();

      return Response.json({ note }, { status: 201 });
    }

    return Response.json({ status: "ok" });
  }
};
```

The example repo includes a complete notes API with input validation, a health endpoint, and a GitHub Actions smoke test that writes and reads a note after deploy.

## Deploy It

Bundle npm dependencies into `backend/index.js` before running the W7S action. W7S native backends can use npm packages, but the deployed backend entrypoint should not depend on bare npm imports at runtime.

```json title="package.json"
{
  "scripts": {
    "build": "esbuild backend/src/index.ts --bundle --format=esm --platform=neutral --target=es2022 --minify --legal-comments=none --outfile=backend/index.js",
    "check": "tsc --noEmit && npm run build"
  }
}
```

Then run the check before deploy:

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

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run check

      - uses: w7s-io/w7s-cloud@v1
        with:
          token: ${{ github.token }}
```

## When To Use It

Use the W7S serverless database for app-local relational data: users, settings, notes, small product catalogs, internal dashboards, prototypes, and early production apps that benefit from SQL without separate database setup.

If the app already depends on an external Postgres service, use [Postgres Bindings](./backend-hyperdrive.md) instead.
