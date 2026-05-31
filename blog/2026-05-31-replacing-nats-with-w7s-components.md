---
title: Replacing NATS With W7S Components
description: How to map NATS-style messaging, request/reply, queues, schedules, durable streams, and event workflows onto W7S-native primitives.
slug: replacing-nats-with-w7s-components
tags: [architecture, queues, rpc, workflows, events]
---

NATS is a strong general-purpose messaging system. It gives teams subjects, request/reply, publish/subscribe, queue groups, persistence through JetStream, and a fast broker that can sit between many services.

W7S does not need to copy that model to support the same application patterns. In many W7S apps, adding NATS would introduce another control plane, another credential model, another operational surface, and another local development story. The better default is to ask a narrower question:

> Can the same product behavior be built from W7S components we already have?

For many cases, the answer is yes.

<!-- truncate -->

## The Short Mapping

| NATS concept | W7S replacement | Best fit |
| --- | --- | --- |
| Request/reply | Backend RPC | Synchronous service-to-service calls |
| Work queue | Backend queues | Async jobs owned by one consumer app |
| Pub/sub subject | Event router plus queues | Explicit fanout to known consumers |
| Queue groups | One W7S queue consumer path per app | Work distribution inside a consumer backend |
| JetStream durable stream | DB, KV, or R2 plus queues | Stored events, replay, audit, large payloads |
| Scheduled publish | Backend schedules | Time-based event creation |
| Long-running orchestration | Workflows | Retryable multi-step processes |
| Local broker for development | `w7s-local` plus HTTP fallbacks | Testing routing and repo boundaries |

This is not a claim that W7S is a drop-in NATS server. It is a design choice: use W7S-native components for app-level messaging, and reserve NATS for projects that truly need broker semantics.

## Request/Reply Becomes Backend RPC

NATS request/reply is often used when one service needs an answer from another service right now:

- auth service returns a session;
- billing service returns entitlement state;
- inventory service returns availability;
- internal API returns a computed result.

That maps cleanly to W7S Backend RPC.

```ts title="backend/index.ts"
type Env = {
  W7S_RPC: Fetcher;
  W7S_RPC_TOKEN: string;
};

export default {
  async fetch(request: Request, env: Env) {
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
      return new Response("Auth service unavailable", {status: 502});
    }

    const session = await response.json();
    return Response.json({session});
  }
};
```

The target backend receives a normal HTTP request at the target path. W7S resolves the caller from the deployment token, loads the target deployment in the same environment, checks cross-owner authorization when needed, and injects caller identity headers into the target request.

This has a few advantages over introducing a broker for request/reply:

- the call path is HTTP-shaped and easy to debug;
- same-owner apps can call each other without extra manifest work;
- cross-owner calls stay target-controlled through `rpc.allow`;
- usage accounting can attribute the dispatch to the caller app;
- branch environments naturally call the matching target environment.

Use RPC when the caller needs the response before it can finish its own response.

## Work Queues Become W7S Queues

NATS queue groups are useful when work should be processed asynchronously by one of several workers. In W7S, the queue is owned by a target repository, and producers send JSON messages through the W7S queue binding.

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

A producer sends to the target repo and queue:

```ts title="backend/index.ts"
type Env = {
  W7S_QUEUE: Fetcher;
  W7S_QUEUE_TOKEN: string;
};

export const enqueueJob = (env: Env, payload: unknown) =>
  env.W7S_QUEUE.fetch(
    "https://w7s.internal/api/v1/queues/acme/worker/jobs",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.W7S_QUEUE_TOKEN}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );
```

The consumer receives batches at its configured path:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/_w7s/queues/jobs" && request.method === "POST") {
      const batch = await request.json();

      for (const message of batch.messages) {
        console.log("processing", message.id, message.body);
      }

      return Response.json({ok: true, processed: batch.messages.length});
    }

    return new Response("Not found", {status: 404});
  }
};
```

Use queues when the caller does not need an immediate result and retry behavior is more important than latency.

## Pub/Sub Becomes Explicit Event Fanout

NATS subjects are attractive because publishers do not need to know every subscriber. That flexibility is valuable, but it also means the broker becomes the place where important topology lives.

W7S can take a more explicit approach: add an event router backend that owns subscription metadata and forwards each event to target queues.

One possible manifest shape:

```json title="w7s.json"
{
  "events": {
    "publish": ["orders.created", "orders.cancelled"],
    "subscribe": [
      {
        "subject": "orders.created",
        "queue": "order-events"
      }
    ]
  },
  "queues": ["order-events"]
}
```

The first version does not need to introduce new infrastructure. Internally, it can be built from:

- deployment metadata in W7S records;
- a `W7S_EVENTS` service binding, similar to `W7S_QUEUE`;
- Cloudflare Queues for delivery;
- existing queue delivery and usage accounting paths.

The event router would:

1. authenticate the publisher with a W7S-issued token;
2. validate that the publisher is allowed to publish the subject;
3. look up subscriptions for the same environment;
4. enqueue one delivery message per subscriber queue;
5. record `event.publish` and `event.delivery` usage.

This is less dynamic than NATS wildcard subjects, but it is easier to explain from a repository. The repo declares what it emits and what it consumes.

## Durable Streams Become DB, KV, R2, and Queues

JetStream is one of the places where "replace NATS" needs more care. Persistence is not one feature; it is several different product needs that can look similar at first.

For W7S, split the need by data shape:

| Need | W7S component |
| --- | --- |
| Audit trail with query filters | Serverless DB |
| Latest state by key | KV |
| Large event payloads | R2 |
| Async delivery after writing event | Queue |
| Multi-step replay or repair | Workflow |

A common W7S-native event store can look like this:

```json title="w7s.json"
{
  "bindings": {
    "d1": [
      {
        "binding": "DB",
        "migrations": "migrations"
      }
    ],
    "r2": ["EVENT_BODIES"]
  },
  "queues": ["event-delivery"]
}
```

The publisher writes a durable event record, stores large bodies in R2 when needed, and then sends a queue message that references the stored event id.

```ts title="backend/events.ts"
export async function persistAndDispatch(env: Env, event: AppEvent) {
  const id = crypto.randomUUID();
  const body = JSON.stringify(event);

  await env.DB.prepare(
    "insert into events (id, subject, body, created_at) values (?, ?, ?, ?)"
  )
    .bind(id, event.subject, body, new Date().toISOString())
    .run();

  await env.W7S_QUEUE.fetch(
    "https://w7s.internal/api/v1/queues/acme/events/event-delivery",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.W7S_QUEUE_TOKEN}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({eventId: id})
    }
  );

  return id;
}
```

That does not reproduce every JetStream feature. It does give the application explicit storage, query, replay, and delivery behavior using W7S resources that are already scoped per repo and environment.

## Schedules Replace Scheduled Publishes

If a NATS subject is mostly fed by cron jobs, W7S schedules are the cleaner primitive. The app declares a schedule and a backend path.

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

The scheduled handler can write an event, call RPC, or enqueue work:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/_w7s/schedules/sync") {
      await enqueueSync(env);
      return Response.json({ok: true});
    }

    return new Response("Not found", {status: 404});
  }
};
```

This keeps time-based behavior in the target repo instead of hiding it in a broker-side convention.

## Workflows Replace Durable Orchestration

Some NATS usage is not really messaging. It is orchestration:

- start task A;
- wait for task B;
- retry task C;
- write status;
- notify another app.

W7S Workflows are a better fit for that shape than raw pub/sub. They give a named process boundary, a start API, and durable delivery through W7S-managed workflow dispatch.

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

Callers start the workflow through `W7S_WORKFLOW`; the target receives the workflow payload at the declared path. Use this for user-visible processes where "message was published" is not enough. The product needs a durable process state.

## Local Development Without a Broker

One reason teams like NATS locally is that it gives every service the same communication surface in development. W7S can cover most of that with `w7s-local` and small HTTP fallbacks.

For RPC, write helpers with two paths:

- hosted W7S uses `env.W7S_RPC`;
- local development calls the target repo's `w7s-local` URL.

```ts title="backend/rpc.ts"
export function callAuth(env: Env, cookie: string) {
  if (env.W7S_RPC && env.W7S_RPC_TOKEN) {
    return env.W7S_RPC.fetch(
      "https://w7s.internal/api/v1/rpc/acme/auth/session",
      {
        headers: {
          authorization: `Bearer ${env.W7S_RPC_TOKEN}`,
          cookie
        }
      }
    );
  }

  return fetch(
    env.LOCAL_AUTH_URL ?? "http://127.0.0.1:8788/auth/session",
    {
      headers: {
        cookie,
        "x-w7s-rpc": "1",
        "x-w7s-rpc-caller-repository": "acme/app"
      }
    }
  );
}
```

This keeps local development simple without asking every developer to run a broker just to test two repositories talking to each other.

## What W7S Still Does Not Replace

There are real NATS capabilities that W7S should not pretend to have today:

- dynamic wildcard subject subscriptions;
- high-volume many-subscriber streaming;
- long-lived service subscriptions inside always-on processes;
- mature broker clustering and leaf-node topologies;
- JetStream consumer semantics such as replay policies and ordered consumers;
- NATS account/operator tooling.

If an application depends on those features directly, NATS may still be the right dependency. W7S compatibility can still be useful there, but it should be explicit external-service compatibility, not a hidden broker inside W7S.

## A W7S-Native Events Layer

The most useful future feature is not "run NATS inside W7S." It is a W7S-native Events layer built on the components already present.

The developer-facing API could be small:

```ts
await env.W7S_EVENTS.fetch("https://w7s.internal/api/v1/events/acme/orders", {
  method: "POST",
  headers: {
    authorization: `Bearer ${env.W7S_EVENTS_TOKEN}`,
    "content-type": "application/json"
  },
  body: JSON.stringify({
    subject: "orders.created",
    data: {
      orderId: "ord_123"
    }
  })
});
```

The manifest could stay explicit:

```json title="w7s.json"
{
  "events": {
    "publish": ["orders.created"],
    "subscribe": [
      {
        "subject": "orders.created",
        "queue": "orders"
      }
    ]
  },
  "queues": ["orders"]
}
```

Under the hood, W7S can reuse queue provisioning, queue delivery, deployment metadata, per-repo authorization, branch environment isolation, and usage accounting. That keeps the platform coherent.

## Recommendation

Do not add NATS as a required W7S dependency.

Use existing W7S primitives first:

- RPC for synchronous service calls;
- Queues for asynchronous work;
- Schedules for time-based producers;
- Workflows for durable orchestration;
- DB, KV, and R2 for persistence;
- `w7s-local` for multi-repo development.

Then add a small Events layer when the missing abstraction becomes painful. That gives W7S most of the product ergonomics people reach for NATS to get, without taking on a separate broker as part of the default platform.
