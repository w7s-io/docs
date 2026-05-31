---
title: Heroku Alternatives
description: A practical guide to Heroku alternatives, including W7S, Render, Railway, Fly.io, Cloud Run, App Runner, Kubernetes, Coolify, and when W7S is the better fit.
slug: heroku-alternatives
tags: [platforms, alternatives, heroku, github-actions]
---

The best Heroku alternative depends on what you actually used Heroku for.

If you used Heroku as a simple process host, Render, Railway, Fly.io, Google Cloud Run, AWS App Runner, DigitalOcean App Platform, and Coolify are natural comparisons. If you used Heroku as a full application platform with dynos, add-ons, config vars, logs, and Git deploys, the decision is more subtle.

W7S is a Heroku alternative for a specific and common app shape:

> Use W7S when the app can be static assets, native backend routes, managed bindings, queues, schedules, and workflows instead of always-on processes.

That makes W7S better for small and medium apps where the process was mostly packaging around request handlers, background jobs, storage, and a deploy workflow from GitHub.

<!-- truncate -->

## The Short List

| Heroku alternative | Best fit | Tradeoff |
| --- | --- | --- |
| W7S | GitHub-native apps with static assets, native backends, DB, KV, FS, queues, schedules, workflows, and branch environments | Not an arbitrary container or long-running process platform |
| Render | Web services, background workers, cron jobs, managed databases, and simple process hosting | More service configuration than W7S needs for edge-native apps |
| Railway | Fast project setup for services and databases | Dashboard project model remains central |
| Fly.io | Apps that need machines, regions, private networking, and lower-level runtime control | You operate closer to infrastructure |
| Google Cloud Run | Containerized HTTP services on Google Cloud | Cloud IAM, container, and project setup become part of the app |
| AWS App Runner | Container or source-based web services on AWS | AWS account and service wiring come with it |
| DigitalOcean App Platform | Managed app hosting with familiar service concepts | Still a hosted service model around processes |
| Kubernetes | Teams that need a cluster platform | Too much operational surface for many small apps |
| Coolify | Self-hosted app and service management on your own servers | You bring and operate the servers |

Heroku is still useful. Its pricing page describes dynos as the heart of a Heroku app, with dyno tiers such as Eco, Basic, Standard, Performance, and larger private-space options. That is a process model: the app runs in isolated containers that handle code, dependencies, and scaling.

W7S competes by changing that model for apps that do not need a long-running process.

## Source-Backed Comparison Points

Heroku's runtime model is documented in its pages for [dynos](https://devcenter.heroku.com/articles/dynos), the [Procfile](https://devcenter.heroku.com/articles/procfile), [config vars](https://devcenter.heroku.com/articles/config-vars), [add-ons](https://devcenter.heroku.com/articles/add-ons), and [one-off dynos](https://devcenter.heroku.com/articles/one-off-dynos). Those sources back the article's description of Heroku as a process-centered app platform.

The W7S replacement model is backed by the W7S docs for [deploying from GitHub](/docs/deploy-from-github/), [project layouts](/docs/project-layouts/), [storage bindings](/docs/storage-bindings/), [serverless database](/docs/serverless-database/), and [URLs and routing](/docs/urls-and-routing/). Those pages show how a repository can own deployment, native backend shape, app URLs, and runtime bindings without a dyno layer.

The background-work comparison is based on the W7S docs for [Backend Queues](/docs/backend-queues/), [Backend Schedules](/docs/backend-schedules/), and [Backend Workflows](/docs/backend-workflows/). Those primitives are the reason W7S can replace worker dynos for common async jobs, scheduled syncs, webhook retries, and durable application processes.

Other Heroku alternatives still matter when an app is process-shaped. Render documents [web services](https://render.com/docs/web-services), [background workers](https://render.com/docs/background-workers), and [cron jobs](https://render.com/docs/cronjobs); Fly.io documents [Machines](https://fly.io/docs/machines/); Google documents [Cloud Run](https://docs.cloud.google.com/run/docs); and AWS documents [App Runner](https://docs.aws.amazon.com/apprunner/latest/dg/what-is-apprunner.html). Those sources back the article's recommendation to keep process platforms for process-shaped workloads.

The cost and ownership claims are tied to [Heroku pricing](https://www.heroku.com/pricing/), the [W7S pricing calculator](/docs/pricing/), [W7S usage accounting](/docs/usage-accounting/), and [self-hosting W7S](/docs/self-host/). Pricing pages change, so the article points readers to the live sources instead of treating any single number as permanent.

## What Heroku Gives You

Heroku became popular because it gave developers a simple application surface:

- a `Procfile`;
- web and worker dynos;
- config vars;
- add-on databases and services;
- logs and metrics;
- Git-based deploys;
- scaling through dyno counts and dyno sizes;
- release commands and one-off tasks;
- custom domains and TLS.

That is a good shape when the application genuinely needs processes. A Rails app, Django app, Phoenix app, long-running worker, or containerized service can fit that model well.

The cost is that every app becomes something you operate as a set of services. You think about process types, process sizes, worker counts, add-ons, startup commands, health checks, deployment phases, and idle behavior.

For many modern JavaScript and TypeScript apps, that is heavier than necessary.

## What W7S Replaces

W7S maps the common Heroku platform pieces to repository-native components:

| Heroku concept | W7S replacement |
| --- | --- |
| Git deploy | GitHub Actions deploy |
| `Procfile` web process | Native backend entrypoint |
| Static assets | Static asset deploy |
| Worker dyno | Queue consumer route |
| Scheduler add-on | W7S schedule |
| Release phase | GitHub Actions step or explicit backend route |
| Config vars | `w7s.json` vars and secrets |
| Add-on database | Serverless DB or Postgres binding |
| Redis-style cache | KV or Stateful Objects |
| Object storage add-on | FS binding |
| App URL | GitHub owner/repo-derived URL |
| Review apps | Branch environments |

The point is not to clone Heroku. The point is to remove the process layer when the app does not need it.

## From Procfile to Native Backend

A Heroku app often starts with a `Procfile`:

```text title="Procfile"
web: npm start
worker: npm run worker
```

In W7S, the backend is a request handler:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ok: true});
    }

    if (url.pathname === "/api/orders" && request.method === "POST") {
      return createOrder(request, env);
    }

    return new Response("Not found", {status: 404});
  }
};
```

There is no port to bind and no dyno size to choose. W7S owns request dispatch; the app owns the handler code.

That is a better fit when the backend is mostly HTTP routes, validation, auth, database access, file writes, and calls to other app components.

## From Worker Dynos to Queues

A Heroku worker dyno is a good abstraction when you have a long-running worker process.

Many apps only need async delivery. In W7S, the app declares a queue:

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

The backend consumes messages through a route:

```ts title="backend/index.ts"
if (url.pathname === "/_w7s/queues/jobs" && request.method === "POST") {
  const batch = await request.json();

  for (const message of batch.messages) {
    await sendReceipt(message.body, env);
  }

  return Response.json({ok: true, processed: batch.messages.length});
}
```

That removes a separate process for jobs that already belong to the app.

## From Add-Ons to Bindings

Heroku add-ons are convenient, but they often put the runtime contract across a dashboard, provider account, environment variables, and application code.

W7S puts common resources in `w7s.json`:

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
  "queues": ["jobs"],
  "schedules": [
    {
      "cron": "0 * * * *",
      "path": "/_w7s/schedules/hourly"
    }
  ],
  "vars": ["PUBLIC_APP_ORIGIN"],
  "secrets": ["STRIPE_SECRET_KEY"]
}
```

The repository explains what the app needs. Branch environments can get isolated resources without copying dashboard settings by hand.

## Why W7S Can Be Better Than Heroku

W7S is better than Heroku when these priorities matter more than process control:

- deploy behavior should be reviewable in `.github/workflows/deploy.yml`;
- the deploy token should be the GitHub token;
- static frontend and backend routes should ship together;
- storage and jobs should be declared with the app;
- branch previews should include backend and storage behavior;
- internal backend calls should use repository identity;
- cost should follow usage instead of an always-on process baseline;
- the platform should have an open-source and self-hostable path.

For a solo builder or small team, the biggest difference is not a feature checklist. It is the number of operational decisions removed from each repo.

## When Heroku or a Process Platform Still Wins

Do not replace Heroku with W7S if the app needs:

- arbitrary containers;
- non-JavaScript runtimes as the main app server;
- long-running daemon processes;
- custom TCP listeners;
- process-level WebSocket control;
- private networking between long-running services;
- shell access into running app containers;
- mature Heroku add-ons your team depends on;
- a Heroku-specific workflow already standardized across the organization.

Render, Railway, Fly.io, Cloud Run, App Runner, DigitalOcean App Platform, Kubernetes, or Coolify may be better if the workload is truly process-shaped.

## Recommendation

Start with the runtime shape.

Use W7S when the app is mostly:

- static assets;
- JavaScript or TypeScript request handlers;
- serverless DB, KV, FS, queues, schedules, workflows, and Stateful Objects;
- GitHub Actions deploys;
- branch environments;
- repo-owned runtime configuration.

Use Heroku or a Heroku-like process platform when the app really needs always-on processes.

The mistake is not choosing Heroku. The mistake is keeping a process platform just because the app used to need one.

## Current Pricing Sources

Pricing changes. Check the current public pages before making a final cost decision:

- [Heroku pricing](https://www.heroku.com/pricing/)
- [W7S pricing calculator](/docs/pricing)
