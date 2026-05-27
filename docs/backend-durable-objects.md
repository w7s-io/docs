---
id: backend-durable-objects
title: Stateful Objects
description: Bind persistent stateful objects to W7S JavaScript/TypeScript native backends.
---

JavaScript/TypeScript native W7S backends can declare stateful object classes in `w7s.json`. W7S creates persistent classes the first time it sees them and binds each class to the backend by name.

Working example repository:

- [`w7s-io/example-durable-counter`](https://github.com/w7s-io/example-durable-counter): backend that uses a stateful object as a persistent counter.

## Declare a stateful object

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

Stateful object apps use a stable runtime identity for each GitHub owner, repo, and environment. This is different from regular JavaScript/TypeScript native backends, which use commit-specific runtime identities.

The stable identity is what lets state survive W7S redeploys.

W7S automatically creates newly declared persistent classes. It does not automate class renames, transfers, or deletes yet.

## Live example

- App: [`w7s-io.w7s.cloud/example-durable-counter`](https://w7s-io.w7s.cloud/example-durable-counter/)
- Current value: [`/value`](https://w7s-io.w7s.cloud/example-durable-counter/value)

The example workflow reads the current counter, increments it twice, and verifies the new value after deploy. That proves the stateful binding works and state persists across W7S redeploys.
