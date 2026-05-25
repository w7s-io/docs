---
id: backend-durable-objects
title: Durable Objects
description: Bind Cloudflare Durable Objects to W7S native backends.
---

Native W7S backends can declare Durable Object classes in `w7s.json`. W7S uploads those declarations as Cloudflare `durable_object_namespace` bindings and creates SQLite-backed classes the first time it sees them.

Working example repository:

- [`w7s-io/example-durable-counter`](https://github.com/w7s-io/example-durable-counter): backend that uses a Durable Object as a persistent counter.

## Declare a Durable Object

Add `bindings.durableObjects` to `w7s.json`:

```json title="w7s.json"
{
  "bindings": {
    "durableObjects": [
      {
        "binding": "COUNTER",
        "className": "Counter"
      }
    ]
  }
}
```

The backend must export the class named by `className`.

## Implement the class

```js title="backend/index.js"
export class Counter {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async fetch(request) {
    const count = (await this.ctx.storage.get("count")) ?? 0;

    if (new URL(request.url).pathname === "/increment") {
      await this.ctx.storage.put("count", count + 1);
      return Response.json({ count: count + 1 });
    }

    return Response.json({ count });
  }
}

export default {
  fetch(request, env) {
    const id = env.COUNTER.idFromName("global");
    return env.COUNTER.get(id).fetch(request);
  }
};
```

## Redeploy behavior

Durable Object apps use a stable Worker script name for each GitHub owner, repo, and environment. This is different from regular native backends, which use commit-specific script names.

The stable script name is what lets Durable Object state survive W7S redeploys.

W7S automatically creates newly declared SQLite-backed classes. It does not automate Durable Object class renames, transfers, or deletes yet.

## Live example

- App: [`w7s-io.w7s.cloud/example-durable-counter`](https://w7s-io.w7s.cloud/example-durable-counter/)
- Current value: [`/value`](https://w7s-io.w7s.cloud/example-durable-counter/value)

The example workflow reads the current counter, increments it twice, and verifies the new value after deploy. That proves the Durable Object binding works and state persists across W7S redeploys.
