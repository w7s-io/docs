---
title: Replacing Dapr With W7S Components
description: How to map Dapr sidecars, service invocation, pub/sub, state stores, bindings, actors, workflows, secrets, config, and observability onto W7S-native primitives.
slug: replacing-dapr-with-w7s-components
tags: [architecture, rpc, queues, workflows, stateful-objects]
---

Dapr is a strong distributed application runtime. It gives teams a sidecar, service invocation, pub/sub, state management, bindings, actors, workflows, secrets, configuration, and a component model that can sit beside services across different hosting environments.

W7S starts from a different premise. If the application already deploys through W7S, the platform can own many of those concerns directly: deployment identity, internal routing, managed bindings, storage provisioning, background delivery, workflow dispatch, local multi-repo testing, and usage accounting.

That makes the useful question narrower than "can W7S run Dapr?"

> Can the product behavior people reach for Dapr to get be built from W7S components that already exist?

For many W7S apps, yes.

<!-- truncate -->

## The Short Mapping

| Dapr concept | W7S replacement | Best fit |
| --- | --- | --- |
| Sidecar runtime | W7S platform bindings | Platform-owned routing, identity, and resource access |
| App ID and name resolution | GitHub owner/repo identity | Repo-scoped services and environments |
| Service invocation | Backend RPC | Synchronous service-to-service calls |
| Pub/sub | Event router plus queues | Explicit fanout to known subscribers |
| State management | Serverless DB, KV, FS, or stateful objects | Durable app state scoped to repo and environment |
| Bindings | W7S managed bindings and backend routes | Storage, queues, schedules, files, AI, and external service access |
| Actors | Stateful Objects | Per-key durable compute and state |
| Workflows | W7S Workflows | Retryable business processes |
| Secrets | GitHub secrets plus W7S secret bindings | Deployment-time secret injection |
| Configuration | `w7s.json`, vars, KV, DB | Versioned runtime contract and app-owned config |
| Resiliency policies | Queues, workflows, and explicit retry helpers | Retry where the product needs it |
| Local runtime | `w7s-local` plus service doubles | Testing repo boundaries without a sidecar mesh |

## Source-Backed Comparison Points

Dapr's current docs describe it as a runtime built around a [sidecar architecture and distributed application building blocks](https://docs.dapr.io/concepts/overview/). That is the right abstraction when a team needs one API surface across different languages, hosts, and infrastructure providers. It is also a meaningful operational choice: every app now depends on the sidecar lifecycle, component configuration, ports, and runtime behavior.

The most common Dapr building blocks map to product behaviors W7S already tries to provide inside the platform. Dapr [service invocation](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/) becomes [Backend RPC](/docs/backend-rpc/) when W7S apps call each other by repository identity. Dapr [publish and subscribe](https://docs.dapr.io/developing-applications/building-blocks/pubsub/) becomes explicit event fanout over [backend queues](/docs/backend-queues/) when the subscribers are known W7S apps.

State is another place where W7S narrows the problem. Dapr has a broad [state management](https://docs.dapr.io/developing-applications/building-blocks/state-management/) abstraction because it must support many backing stores. W7S instead lets a repository declare app-local data through [storage bindings](/docs/storage-bindings/), [serverless database](/docs/serverless-database/), key-value storage, or file storage, with environment-specific provisioning handled by the platform.

Dapr [actors](https://docs.dapr.io/developing-applications/building-blocks/actors/) and [workflow](https://docs.dapr.io/developing-applications/building-blocks/workflow/) are powerful when the application needs virtual actor semantics or durable orchestration across services. W7S should not pretend to be a drop-in implementation of those APIs. The W7S-native path is [stateful objects](/docs/backend-durable-objects/) for per-key state and [backend workflows](/docs/backend-workflows/) for retryable business processes that fit the platform runtime.

That framing keeps the article honest. Dapr remains the better fit for heterogeneous fleets that require its exact API, sidecar model, or portability promise. W7S is the better fit when the app already lives in W7S and the team wants fewer moving parts: repository identity, internal RPC, queues, storage, workflows, local testing with `w7s-local`, and usage accounting from one deployment surface.

This is not a claim that W7S is a drop-in Dapr runtime. Dapr is built to be portable across hosts, languages, and infrastructure providers. W7S is built to make a GitHub repository deploy as an app with first-class platform bindings.

If the app needs Dapr's exact API surface, Dapr can remain an external dependency. If the app is using Dapr mostly to avoid rebuilding common distributed app plumbing, W7S can usually provide a smaller default.

## Sidecars Become Platform Bindings

Dapr puts a runtime process next to each service. The application talks to that sidecar over HTTP or gRPC, and the sidecar handles service discovery, component calls, state stores, pub/sub brokers, secret stores, and other building blocks.

That is valuable when the hosting platform is not opinionated enough to provide those pieces consistently. It also has costs:

- every service needs a sidecar process;
- local development needs Dapr initialization and component config;
- production needs sidecar lifecycle, ports, health checks, and resource limits;
- the app now depends on another runtime contract beside the host.

In W7S, the deployment platform already knows the repository, owner, branch environment, runtime, and declared resources. For JavaScript/TypeScript native backends, W7S injects bindings directly into `env`:

```text
W7S_RPC
W7S_QUEUE
W7S_WORKFLOW
W7S_AI
W7S_OWNER
W7S_REPO
W7S_REPOSITORY
W7S_ENVIRONMENT
```

App-declared storage bindings such as DB, KV, and FS are also exposed on `env`. The backend calls the binding directly rather than sending every operation through a local sidecar.

That is the core tradeoff. Dapr standardizes through a sidecar API. W7S standardizes through repository deployment metadata and platform bindings.

## App Identity Becomes Repository Identity

Dapr service invocation depends on app IDs. W7S already has a stable app identity: the GitHub owner and repository, plus the deployment environment.

For example:

```text
github.com/acme/auth
github.com/acme/checkout
```

become W7S repositories:

```text
acme/auth
acme/checkout
```

Production deploys call production targets. Branch deploys call matching branch environments when those targets exist. Same-owner calls are allowed by default, while cross-owner calls stay target-controlled through allowlists.

This removes a separate service naming layer. The repo is the service boundary.

## Service Invocation Becomes Backend RPC

Dapr service invocation often looks like this:

```ts title="backend/auth-client.ts"
const response = await fetch(
  "http://localhost:3500/v1.0/invoke/auth/method/session",
  {
    headers: {
      cookie: request.headers.get("cookie") ?? ""
    }
  }
);
```

The application calls the local sidecar, and the sidecar routes to the service named `auth`.

In W7S, a backend calls the target repository through `W7S_RPC`:

```ts title="backend/auth-client.ts"
type Env = {
  W7S_RPC: Fetcher;
  W7S_RPC_TOKEN: string;
};

export async function getSession(request: Request, env: Env) {
  const response = await env.W7S_RPC.fetch(
    "https://w7s.internal/api/v1/rpc/acme/auth/session",
    {
      headers: {
        authorization: `Bearer ${env.W7S_RPC_TOKEN}`,
        cookie: request.headers.get("cookie") ?? ""
      }
    }
  );

  if (!response.ok) {
    throw new Error("Auth service unavailable");
  }

  return response.json();
}
```

The target backend receives a normal HTTP request at `/session`. W7S resolves the caller from the deployment token, checks authorization, dispatches to the target in the same environment, and injects caller identity headers.

Use RPC when the caller needs a response before it can finish its own request.

## Pub/Sub Becomes Explicit Event Fanout

Dapr pub/sub gives an app a stable publish API while the underlying broker can be Redis, Kafka, Azure Service Bus, NATS, RabbitMQ, or another component.

That abstraction is useful when broker portability is the primary goal. In W7S, the better default is often explicit app-level fanout:

1. a publisher calls an event-router backend through RPC;
2. the router validates the subject and publisher;
3. the router looks up subscribers from repo metadata or app config;
4. the router enqueues one queue message per subscriber;
5. each subscriber consumes its own W7S queue.

The queue consumer declares its queue in `w7s.json`:

```json title="w7s.json"
{
  "queues": [
    {
      "name": "events",
      "consumer": "/_w7s/queues/events"
    }
  ]
}
```

The router sends to the subscriber through `W7S_QUEUE`:

```ts title="backend/event-router.ts"
type Env = {
  W7S_QUEUE: Fetcher;
  W7S_QUEUE_TOKEN: string;
};

export async function deliver(env: Env, event: unknown) {
  return env.W7S_QUEUE.fetch(
    "https://w7s.internal/api/v1/queues/acme/email-worker/events",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.W7S_QUEUE_TOKEN}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(event)
    }
  );
}
```

The consumer receives a queue batch:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/_w7s/queues/events" && request.method === "POST") {
      const batch = await request.json();

      for (const message of batch.messages) {
        console.log("event", message.body);
      }

      return Response.json({ok: true, processed: batch.messages.length});
    }

    return new Response("Not found", {status: 404});
  }
};
```

This is less dynamic than Dapr broker-backed topics, but it keeps topology visible in repositories and W7S metadata. For many product systems, that is an advantage.

The runnable local version of this pattern is in
[`examples/w7s-local-native-events`](https://github.com/w7s-io/docs/tree/main/examples/w7s-local-native-events).

## State Stores Become App-Owned Storage

Dapr state management gives apps a key/value API over a configured state store. That is a useful portable floor, especially when many services need the same API across hosts.

W7S has a different storage model: declare the storage the app actually needs, then read the binding directly from the backend.

```json title="w7s.json"
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
  }
}
```

Use the narrowest storage primitive that matches the data:

| State need | W7S component |
| --- | --- |
| App-local relational data | Serverless DB |
| Cache or latest value by key | KV |
| Files and larger payloads | FS |
| Per-entity state with compute | Stateful Objects |
| External Postgres | Managed Postgres binding |

For relational app state, keep migrations in the repo:

```sql title="migrations/0001_create_orders.sql"
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
```

Then query through `env.DB`:

```ts title="backend/index.ts"
type Env = {
  DB: D1Database;
};

export async function saveOrder(env: Env, order: Order) {
  await env.DB.prepare(
    "insert into orders (id, email, amount, created_at) values (?, ?, ?, ?)"
  )
    .bind(order.id, order.email, order.amount, new Date().toISOString())
    .run();
}
```

This gives up Dapr's common state API, but it gives the app a clearer data model and a deployment-owned migration path.

## Bindings Become Specific W7S Bindings

Dapr bindings provide a common way to call external systems and receive events from them. W7S should not reproduce that as a single generic binding layer unless the platform genuinely needs it.

The W7S default is more direct:

- queues for background work;
- schedules for cron-style triggers;
- workflows for durable processes;
- FS for files;
- DB and KV for data;
- AI bindings for model calls;
- runtime vars and secrets for provider credentials;
- normal `fetch` for external HTTP APIs.

For a time-based trigger, declare a schedule:

```json title="w7s.json"
{
  "schedules": [
    {
      "cron": "*/5 * * * *",
      "path": "/_w7s/schedules/sync"
    }
  ]
}
```

Handle it as a backend route:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/_w7s/schedules/sync") {
      await syncExternalSystem(env);
      return Response.json({ok: true});
    }

    return new Response("Not found", {status: 404});
  }
};
```

That keeps the trigger contract in the repository instead of hiding it behind a generic component file.

## Actors Become Stateful Objects

Dapr actors provide a virtual actor model: each actor has identity, state, single-threaded execution, activation, deactivation, timers, and reminders.

W7S Stateful Objects cover the most common app need behind that model: route all operations for one logical entity to one durable object with attached state.

Declare the object class:

```json title="w7s.json"
{
  "bindings": {
    "durableObjects": [
      {
        "binding": "CART",
        "className": "Cart"
      }
    ]
  }
}
```

Implement the object:

```js title="backend/index.js"
export class Cart {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const items = (await this.ctx.storage.get("items")) ?? [];

    if (url.pathname === "/add" && request.method === "POST") {
      const item = await request.json();
      const next = [...items, item];
      await this.ctx.storage.put("items", next);
      return Response.json({items: next});
    }

    return Response.json({items});
  }
}

export default {
  fetch(request, env) {
    const cartId = new URL(request.url).searchParams.get("cart") ?? "default";
    const id = env.CART.idFromName(cartId);
    return env.CART.get(id).fetch(request);
  }
};
```

This is not a full clone of Dapr actors. If the application depends on actor reminders, placement behavior, or Dapr actor SDK semantics, keep Dapr or build those semantics explicitly. If the application needs durable per-key compute and state, Stateful Objects are the W7S-native fit.

## Workflows Stay Workflows

Dapr workflows are for long-running, fault-tolerant, stateful processes. W7S Workflows target the same product need: start a named process, persist the instance, dispatch work to the app, retry failures, and expose status.

Declare a workflow:

```json title="w7s.json"
{
  "workflows": [
    {
      "name": "checkout",
      "path": "/_w7s/workflows/checkout"
    }
  ]
}
```

Start it through the platform binding:

```ts title="backend/index.ts"
type Env = {
  W7S_WORKFLOW: Fetcher;
  W7S_WORKFLOW_TOKEN: string;
};

export async function startCheckout(env: Env, orderId: string) {
  return env.W7S_WORKFLOW.fetch(
    "https://w7s.internal/api/v1/workflows/acme/checkout/checkout",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.W7S_WORKFLOW_TOKEN}`,
        "content-type": "application/json",
        "x-w7s-workflow-instance-id": orderId
      },
      body: JSON.stringify({orderId})
    }
  );
}
```

The app receives the workflow run at the configured path:

```ts title="backend/index.ts"
if (url.pathname === "/_w7s/workflows/checkout" && request.method === "POST") {
  const run = await request.json();
  await processCheckout(run.payload.orderId);
  return Response.json({ok: true});
}
```

W7S Workflows deliberately keep the app API small. The platform owns the workflow runner; the app owns the business step.

## Secrets and Configuration Stay in the Deploy Contract

Dapr can read secrets and configuration through component APIs. W7S keeps these concerns closer to GitHub and the deployment manifest.

Declare the values the backend expects:

```json title="w7s.json"
{
  "vars": ["PUBLIC_STRIPE_KEY"],
  "secrets": ["STRIPE_SECRET_KEY"]
}
```

Pass them from GitHub Actions:

```yaml title=".github/workflows/deploy.yml"
- uses: w7s-io/w7s-cloud@v1
  env:
    PUBLIC_STRIPE_KEY: ${{ vars.PUBLIC_STRIPE_KEY }}
    STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
  with:
    token: ${{ github.token }}
```

Read them from `env` in the backend:

```ts title="backend/index.ts"
type Env = {
  PUBLIC_STRIPE_KEY: string;
  STRIPE_SECRET_KEY: string;
};
```

For dynamic app configuration, use app-owned storage:

- KV for simple flags and values;
- DB for configuration that needs audit, ownership, or query filters;
- FS for larger config documents.

That separates deploy-time secrets from runtime product configuration.

## Resiliency Is Attached to the Primitive

Dapr has a resiliency model that can apply retries, timeouts, and circuit breakers around building block calls. That is useful in a general distributed runtime.

In W7S, resiliency should usually be attached to the primitive that needs it:

- queues retry background delivery;
- workflows retry durable process steps;
- schedules retry by creating the next scheduled attempt;
- RPC callers use explicit timeout and retry helpers where the product can tolerate repeat calls;
- database writes use normal transaction and idempotency patterns.

A simple RPC helper can make retry behavior visible:

```ts title="backend/w7s-rpc.ts"
export async function callWithTimeout(
  fetcher: Fetcher,
  url: string,
  init: RequestInit,
  timeoutMs = 3000
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetcher.fetch(url, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}
```

Do not hide every failure behind a global policy. Some operations are safe to retry, some need idempotency keys, and some should fail fast.

## Observability Becomes Repo-Scoped Logs and Usage

Dapr gives a consistent runtime surface for metrics, tracing, and sidecar diagnostics. W7S can provide the platform part from deployment identity:

- logs are associated with repository and environment;
- RPC, queue, workflow, schedule, deploy, and runtime usage can be counted per app;
- the GitHub Action can report deploy summaries and usage warnings;
- branch environments can be inspected separately from production.

This is a different observability boundary. Dapr observes a distributed runtime. W7S observes repository deployments and platform-managed dispatch.

Apps can still emit structured logs and external telemetry where they need deeper product traces.

## Local Development Without Dapr

Dapr's local runtime is one of its strongest developer conveniences. W7S needs a local story too, but it should match the W7S deployment model.

Use `w7s-local` for repo-shaped routing:

```sh
w7s-local \
  --owner acme \
  --repo checkout \
  --port 8790 \
  --command "npm run dev" \
  --backend http://127.0.0.1:5173
```

For multi-repo tests, run one local W7S router per repo and put platform calls behind small helpers:

- hosted W7S calls `env.W7S_RPC`, `env.W7S_QUEUE`, or `env.W7S_WORKFLOW`;
- local development calls the target repo's `w7s-local` URL or a service double.

That keeps local tests honest about repository boundaries without requiring every developer to run a sidecar runtime and component stack.

## What W7S Still Does Not Replace

There are Dapr capabilities W7S should not pretend to replace today:

- a language-agnostic sidecar API for any host;
- Dapr's exact HTTP and gRPC API contracts;
- broker and state-store portability through Dapr component specs;
- Dapr actor SDK semantics, placement, timers, and reminders;
- Dapr's component ecosystem for many external services;
- Kubernetes-native Dapr operator behavior;
- Dapr resiliency policy resources;
- Dapr mTLS and sidecar-to-sidecar service mesh behavior.

If a team is standardizing across Kubernetes, VMs, edge nodes, local containers, and multiple languages, Dapr may still be the right abstraction. W7S compatibility should then mean making it easy to call external Dapr-enabled services, not pretending W7S is the Dapr runtime.

## A W7S-Native Distributed App Layer

The W7S direction should be smaller than reimplementing Dapr.

The most useful next layer is a W7S-native distributed app contract built from existing pieces:

```json title="w7s.json"
{
  "services": {
    "call": ["acme/auth", "acme/billing"]
  },
  "events": {
    "publish": ["orders.created"],
    "subscribe": [
      {
        "subject": "orders.created",
        "queue": "events"
      }
    ]
  },
  "queues": ["events"],
  "workflows": ["checkout"],
  "bindings": {
    "db": [{ "binding": "DB", "migrations": "migrations" }],
    "kv": ["CACHE"]
  }
}
```

Under the hood, W7S can reuse deployment metadata, managed bindings, queue delivery, workflow dispatch, per-repo authorization, branch environment isolation, and usage accounting.

That gives W7S much of the ergonomics people want from Dapr without adding a sidecar runtime as a required platform dependency.

## Recommendation

Do not add Dapr as a required W7S dependency.

Use W7S-native primitives first:

- Backend RPC for synchronous service invocation;
- queues and an event router for async fanout;
- Serverless DB, KV, FS, and Stateful Objects for state;
- schedules for time-based triggers;
- workflows for durable business processes;
- `w7s.json`, vars, and secrets for the runtime contract;
- `w7s-local` for multi-repo development.

Keep Dapr for applications that truly need Dapr's sidecar API, component ecosystem, actor runtime, or cross-host portability. For W7S-native apps, the simpler path is to let W7S be the platform instead of adding another distributed runtime beside it.
