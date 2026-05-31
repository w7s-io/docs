---
title: Replacing Heroku, Render, Railway, and Fly.io With W7S
description: How to replace process-oriented app hosting with W7S when the app fits static assets, native backends, managed bindings, queues, schedules, and workflows.
slug: replacing-heroku-render-railway-and-fly-with-w7s
tags: [platforms, alternatives, backends, queues]
---

Heroku, Render, Railway, and Fly.io are good platforms when an application needs a process: a web server, a worker, a container image, a machine, or a long-running service with operational controls.

Many small apps do not need that much runtime. They need a frontend, a few backend routes, a database, a cache, file storage, maybe a background job, maybe a schedule, and a clean deploy path from GitHub.

For that shape, W7S can replace a process platform with a repository-native app platform.

> If the app can be a request handler plus managed bindings, do not start by operating services.

<!-- truncate -->

## The Short Mapping

| Process platform concept | W7S replacement | Best fit |
| --- | --- | --- |
| Web process / web service / machine | Native backend | HTTP request handling without an always-on service |
| Static file serving | Static asset deploy | Frontend and docs output |
| Worker process | Backend queues | Async jobs delivered to backend routes |
| Cron process / scheduled job | Backend schedules | Time-based work |
| Release phase / one-off task | GitHub Actions step or workflow route | Build-time and controlled operational work |
| Add-on database | Serverless DB or Postgres binding | App-local SQL or external Postgres |
| Redis add-on | KV or Stateful Objects | Cache, latest state, per-key state |
| Object storage add-on | FS binding | Files and larger payloads |
| Procfile / service command | Backend entrypoint and `w7s.json` | Runtime contract in repo |
| Platform environment vars | W7S vars and secrets | GitHub-provided runtime values |
| Dashboard deploy | GitHub Actions deploy | Auditable release flow |

## Source-Backed Comparison Points

The platforms in this comparison are strong because they run process-oriented applications well. Heroku documents [dynos](https://devcenter.heroku.com/articles/dynos) and [Procfile process types](https://devcenter.heroku.com/articles/procfile); Render documents [web services](https://render.com/docs/web-services) and [background workers](https://render.com/docs/background-workers); Railway documents projects, services, environments, and deployments in its [platform docs](https://docs.railway.com/platform); and Fly.io exposes low-level control through [Fly Machines](https://fly.io/docs/machines/). Those are useful models when the app needs a real process, container, machine, or worker lifecycle.

W7S competes in a narrower and more specific lane. If the app is static assets plus a JavaScript or TypeScript backend handler, [project layouts](/docs/project-layouts/) and [deploys from GitHub](/docs/deploy-from-github/) can replace the service-definition step. The repository builds in CI, W7S receives the archive, and the runtime dispatches HTTP requests without the team choosing a process size, start command, port, machine count, or idle service behavior.

Background work is where the distinction becomes operationally important. Process platforms commonly model async work as another long-running worker process. W7S models the common small-app version as [backend queues](/docs/backend-queues/), [backend schedules](/docs/backend-schedules/), and [backend workflows](/docs/backend-workflows/). That removes a class of service management when the work can be delivered to a route or coordinated as a durable platform workflow.

Storage follows the same pattern. Instead of treating a database, cache, and file bucket as separate add-ons or external services for every app, W7S lets the repository declare resources with [storage bindings](/docs/storage-bindings/) and [serverless database](/docs/serverless-database/). For small products, that is often the difference between shipping an app and operating a set of support services around the app.

The honest boundary is containers. If a project needs arbitrary processes, custom images, private networking details, long-lived daemons, or VM-level controls, Heroku, Render, Railway, or Fly.io may remain the better fit. If the process is mostly incidental and the app naturally fits request handlers, static assets, managed bindings, queues, schedules, and workflows, W7S is a real replacement with less operational surface.

This is not a claim that W7S replaces containers. It replaces a common subset of process-platform usage where the process was mostly a packaging detail.

## Processes Become Request Handlers

On process platforms, the application usually runs a web command:

```text title="Procfile"
web: npm start
worker: npm run worker
```

or a service definition that eventually starts a long-running server.

In W7S, a native backend exports a request handler:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ok: true});
    }

    if (url.pathname === "/api/orders") {
      return handleOrders(request, env);
    }

    return new Response("Not found", {status: 404});
  }
};
```

There is no port to bind, process size to choose, idle machine to keep warm, or web dyno count to scale. W7S owns the runtime and dispatches requests to the backend.

That is a better fit for apps whose backend work is naturally request/response.

## Workers Become Queues

Process platforms often push background work into a worker process. That worker then needs a queue, credentials, scaling rules, logs, retry behavior, and deployment coordination.

W7S makes the queue part of the app contract:

```json title="w7s.json"
{
  "queues": [
    {
      "name": "jobs",
      "consumer": "/_w7s/queues/jobs"
    }
  ]
}
```

Producers enqueue through `W7S_QUEUE`:

```ts title="backend/jobs.ts"
export async function enqueueEmail(env: Env, payload: unknown) {
  return env.W7S_QUEUE.fetch(
    "https://w7s.internal/api/v1/queues/acme/app/jobs",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.W7S_QUEUE_TOKEN}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );
}
```

The backend consumes batches through a normal route:

```ts title="backend/index.ts"
if (url.pathname === "/_w7s/queues/jobs" && request.method === "POST") {
  const batch = await request.json();
  for (const message of batch.messages) {
    await sendEmail(message.body);
  }
  return Response.json({ok: true, processed: batch.messages.length});
}
```

The app owns the code. W7S owns the delivery mechanism.

## Scheduled Jobs Become Schedules

A process platform may use a cron add-on, scheduled job service, or always-on worker loop.

W7S schedules are declared next to the backend:

```json title="w7s.json"
{
  "schedules": [
    {
      "cron": "0 * * * *",
      "path": "/_w7s/schedules/hourly"
    }
  ]
}
```

The schedule invokes the backend route:

```ts title="backend/index.ts"
if (url.pathname === "/_w7s/schedules/hourly") {
  await refreshReports(env);
  return Response.json({ok: true});
}
```

That removes a separate scheduler service for jobs that already belong to the app.

## Add-Ons Become Bindings

Heroku-style platforms popularized the add-on model. That works well, but it can scatter the runtime contract across a dashboard, environment variables, provider credentials, and app code.

W7S uses `w7s.json`:

```json title="w7s.json"
{
  "bindings": {
    "db": [
      {
        "binding": "DB",
        "migrations": "migrations"
      }
    ],
    "kv": ["CACHE"],
    "fs": ["FILES"]
  },
  "vars": ["PUBLIC_API_ORIGIN"],
  "secrets": ["STRIPE_SECRET_KEY"]
}
```

The app receives the declared resources through `env`. Storage is scoped by repository and environment, so a feature branch does not need to share production resource names.

Use the right primitive:

| Need | W7S component |
| --- | --- |
| Relational app data | Serverless DB |
| Existing Postgres | Managed Postgres binding |
| Cache or latest value | KV |
| Files and larger payloads | FS |
| Per-entity state and compute | Stateful Objects |
| Async work | Queues |
| Durable process | Workflows |

## Deployment Becomes a GitHub Workflow

Process platforms often expose multiple deploy paths: Git push, dashboard deploy, CLI deploy, container deploy, or GitHub integration.

W7S keeps one boring default:

```yaml title=".github/workflows/deploy.yml"
- uses: actions/checkout@v5
- uses: actions/setup-node@v6
  with:
    node-version: 22
- run: npm ci
- run: npm run build
- uses: w7s-io/w7s-cloud@v1
  with:
    token: ${{ github.token }}
```

If the app needs tests, migrations, type checks, generated files, or a custom build directory, put those steps in the workflow. The release behavior is code-reviewed with the app.

## What You Give Up

W7S is not a process platform. Do not replace Heroku, Render, Railway, or Fly.io with W7S if the app needs:

- arbitrary containers;
- long-running daemons;
- custom TCP listeners;
- WebSocket-heavy always-on services that need process-level control;
- language runtimes outside the W7S native backend model;
- private networks with process services;
- manual machine sizing and placement;
- shell access into a running container;
- process supervisors or multi-process containers.

Those are real platform needs. Use a process platform when the process is the product.

## Recommendation

Use W7S when the app can be reduced to:

- static assets;
- JavaScript/TypeScript request handlers;
- managed DB, KV, FS, queues, schedules, and workflows;
- GitHub Actions as the release boundary;
- branch environments instead of long-lived staging services.

Keep a process platform when the app genuinely needs a process.

The important distinction is not "simple versus serious." It is runtime shape. A serious app can be static assets plus request handlers and managed bindings. For that shape, W7S removes service management that was never central to the product.
