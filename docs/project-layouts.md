---
id: project-layouts
title: Project Layouts
description: Repository layouts that W7S can deploy.
---

W7S detects deploy targets from the archive uploaded by GitHub Actions.

## Static frontends

W7S serves static assets from the first matching output root:

```text
frontend/dist/
dist/client/
dist/
build/
out/
```

Each static root should include an `index.html`.

One exception is framework SSR output. Frameworks such as TanStack Start may build frontend assets into `dist/client/` without an `index.html`, while rendering HTML from `dist/server/index.js`. W7S supports that paired layout:

```text
dist/server/index.js
dist/client/assets/app.js
```

## Native backends

Native backends must be JavaScript or TypeScript runtime modules. W7S publishes native backend code from either:

```text
backend/index.ts
backend/index.js
worker/index.ts
worker/index.js
```

`index.mts` and `index.mjs` are also supported.

Other backend languages are not uploaded directly. Build or bundle them to one of the supported JavaScript/TypeScript entrypoints before deploying.

Native backend modules must use local relative imports. If the backend depends on npm packages, bundle it in CI and upload the bundled backend files.

Framework SSR builds can also publish their generated JavaScript server entrypoint:

```text
dist/server/index.js
```

When an SSR build emits runtime compatibility metadata, W7S includes supported flags such as `nodejs_compat` when uploading the backend module.

Uploaded JavaScript/TypeScript native backends also get W7S-managed log capture. That lets W7S expose app `console.*` output and uncaught exceptions through the [Observability](./observability.md) logs API.

## Native backend function shape

A native backend is a JavaScript or TypeScript module that exposes one request handler. The module must default export either:

- an object with a `fetch(request, env, ctx)` method; or
- a framework app whose default export has a compatible `fetch` method.

The handler receives standard runtime values:

| Argument | Shape | Purpose |
| --- | --- | --- |
| `request` | `Request` | The incoming HTTP request. Use `new URL(request.url)` to route by pathname and query string. |
| `env` | object | W7S vars, secrets, storage bindings, queues, RPC, schedules, and workflow bindings declared for the app. |
| `ctx` | `ExecutionContext`-like object | Background work hooks such as `waitUntil`, when supported by the runtime. |

The handler must return a `Response` or a promise that resolves to a `Response`.

```ts title="backend/index.ts"
type Env = {
  PUBLIC_GREETING?: string;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ok: true});
    }

    if (url.pathname === "/api/greeting") {
      return Response.json({
        message: env.PUBLIC_GREETING ?? "Hello from W7S",
      });
    }

    return new Response("Not found", {status: 404});
  },
};
```

Use web runtime APIs instead of starting a server process. Do not call `listen()`, bind a port, or keep a Node HTTP server running inside the backend module. The W7S runtime already owns request dispatch and calls the exported `fetch` handler for each request.

For fullstack apps, requests reach the backend first. If the backend returns `404` or `405` for a `GET` or `HEAD` request, W7S can fall back to the static frontend's `index.html` for SPA routes. Return explicit JSON or text responses for API routes, and return `404` or `405` for routes the backend does not own.

### Hono example

Hono works well because a Hono app exposes the same `fetch` handler shape that W7S expects.

```ts title="backend/index.ts"
import {Hono} from "hono";

type Bindings = {
  PUBLIC_GREETING?: string;
};

const app = new Hono<{Bindings: Bindings}>();

app.get("/api/health", (c) => c.json({ok: true}));

app.get("/api/greeting", (c) =>
  c.json({
    message: c.env.PUBLIC_GREETING ?? "Hello from Hono on W7S",
  }),
);

app.post("/api/echo", async (c) => {
  const body = await c.req.json().catch(() => ({}));

  return c.json({body});
});

app.notFound((c) => c.text("Not found", 404));

export default app;
```

Install and bundle dependencies before the deploy action uploads the repository archive:

```yaml
- run: npm ci
- run: npm run build
- uses: w7s-io/w7s-cloud@v1
```

If the backend uses `hono` directly from `backend/index.ts`, make sure the build step bundles it into the deployed JavaScript output or keeps the dependency available in the uploaded backend files.

## Fullstack repositories

A repository can include both:

```text
backend/index.ts
dist/index.html
```

or a framework SSR build:

```text
dist/server/index.js
dist/client/assets/app.js
```

Requests go to the backend first. If the backend returns `404` or `405` for a `GET` or `HEAD` request, W7S can fall back to the static frontend's `index.html` for SPA routes.
