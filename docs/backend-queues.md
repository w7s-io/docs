---
id: backend-queues
title: Backend Queues
description: Send background work between W7S native backends through internal queues.
---

Native W7S backends can declare queues in `w7s.json`. W7S creates the Cloudflare Queue, connects it to the W7S core worker, and delivers batches to the declaring backend.

Working example repositories:

- [`w7s-io/example-queue-worker`](https://github.com/w7s-io/example-queue-worker): backend that enqueues work to its own queue and stores the latest processed message.
- [`w7s-io/example-queue-consumer`](https://github.com/w7s-io/example-queue-consumer): backend that owns and consumes a queue.
- [`w7s-io/example-queue-producer`](https://github.com/w7s-io/example-queue-producer): separate backend that sends messages to the consumer's queue.

## Declare a queue

The simplest form declares a queue named `jobs`:

```json title="w7s.json"
{
  "queues": ["jobs"]
}
```

By default, W7S delivers `jobs` batches to:

```text
/_w7s/queues/jobs
```

Use an object when you want a different consumer path:

```json title="w7s.json"
{
  "queues": [
    {
      "name": "emails",
      "consumer": "/internal/queues/emails"
    }
  ]
}
```

Queues require a native backend deployment. Static-only apps cannot declare queues.

## Runtime bindings

Every native backend receives:

```text
W7S_QUEUE
W7S_QUEUE_TOKEN
W7S_OWNER
W7S_REPO
W7S_REPOSITORY
W7S_ENVIRONMENT
```

`W7S_QUEUE` is a Cloudflare service binding to the W7S core Worker. `W7S_QUEUE_TOKEN` is a secret used by W7S to prove which deployed app is enqueueing the message.

## Send a message

Send messages through:

```text
/api/v1/queues/<owner>/<repo>/<queue>
```

Example:

```ts title="backend/index.ts"
type Env = {
  W7S_QUEUE: Fetcher;
  W7S_QUEUE_TOKEN: string;
  W7S_REPOSITORY: string;
  W7S_ENVIRONMENT: string;
};

export default {
  async fetch(_request: Request, env: Env) {
    const response = await env.W7S_QUEUE.fetch(
      "https://w7s.internal/api/v1/queues/w7s-io/example-queue-worker/jobs",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.W7S_QUEUE_TOKEN}`,
          "content-type": "application/json",
          "x-w7s-queue-caller": env.W7S_REPOSITORY,
          "x-w7s-queue-environment": env.W7S_ENVIRONMENT
        },
        body: JSON.stringify({
          type: "ping",
          createdAt: new Date().toISOString()
        })
      }
    );

    return response.ok
      ? Response.json({ status: "queued" })
      : new Response(await response.text(), { status: 502 });
  }
};
```

To delay delivery, add:

```text
x-w7s-queue-delay-seconds: 60
```

The delay value must be an integer from `0` to `86400`.

## Receive messages

Create a backend route for the queue consumer path:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/_w7s/queues/jobs" && request.method === "POST") {
      const batch = await request.json();

      for (const message of batch.messages) {
        console.log("received", message.id, message.body);
      }

      return Response.json({ ok: true, processed: batch.messages.length });
    }

    return new Response("Not found", { status: 404 });
  }
};
```

W7S sends this payload to the consumer route:

```json
{
  "queue": "jobs",
  "queueName": "w7s-production-w7s-io-example-queue-worker-queue-jobs",
  "messages": [
    {
      "id": "message-id",
      "attempts": 1,
      "timestamp": "2026-05-24T22:00:00.000Z",
      "enqueuedAt": "2026-05-24T21:59:00.000Z",
      "caller": {
        "orgSlug": "w7s-io",
        "repoSlug": "example-queue-worker",
        "repository": "w7s-io/example-queue-worker",
        "environment": "production"
      },
      "body": {
        "type": "ping"
      }
    }
  ]
}
```

Return any `2xx` response after processing. Non-`2xx` responses make W7S throw from the queue consumer, so Cloudflare Queues can retry the batch.

## Separate producer and consumer

A backend does not need to own a queue in order to produce messages. It only needs to be a native W7S backend, because W7S injects `W7S_QUEUE` and `W7S_QUEUE_TOKEN` into every native backend.

The consumer declares and receives the queue:

```json title="w7s.json"
{
  "bindings": {
    "kv": ["STATE"]
  },
  "queues": ["jobs"]
}
```

The producer sends to that consumer's queue:

```ts title="backend/index.ts"
await env.W7S_QUEUE.fetch(
  "https://w7s.internal/api/v1/queues/w7s-io/example-queue-consumer/jobs",
  {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.W7S_QUEUE_TOKEN}`,
      "content-type": "application/json",
      "x-w7s-queue-caller": env.W7S_REPOSITORY,
      "x-w7s-queue-environment": env.W7S_ENVIRONMENT
    },
    body: JSON.stringify({
      id: crypto.randomUUID(),
      text: "work for the consumer"
    })
  }
);
```

The live pair is:

- Producer: [`w7s-io/example-queue-producer`](https://github.com/w7s-io/example-queue-producer), served at [`w7s-io.w7s.cloud/example-queue-producer`](https://w7s-io.w7s.cloud/example-queue-producer/)
- Consumer: [`w7s-io/example-queue-consumer`](https://github.com/w7s-io/example-queue-consumer), served at [`w7s-io.w7s.cloud/example-queue-consumer`](https://w7s-io.w7s.cloud/example-queue-consumer/)

Try the producer:

```sh
curl -X POST "https://w7s-io.w7s.cloud/example-queue-producer/enqueue?text=hello"
```

The response includes a `checkDeliveryAt` URL. Queue delivery is asynchronous, so poll that URL until the consumer has processed the message.

## Authorization

Apps under the same GitHub owner can enqueue messages to each other by default.

For cross-owner sends, the target app must allow the caller in `w7s.json`.

To allow one exact repo:

```json
{
  "queue": {
    "allow": ["guerrerocarlos/notepad"]
  }
}
```

To allow every repo under an owner:

```json
{
  "queue": {
    "allow": ["guerrerocarlos"]
  }
}
```

Allowlist entries can be:

- a GitHub owner, such as `w7s-io`;
- an exact GitHub repository, such as `guerrerocarlos/notepad`.

The target deployment controls this list. The caller cannot grant itself access.

## Environment behavior

Queue sends stay in the caller's deployment environment. If a feature branch deploy sends to `owner/service`, W7S looks for the target deployment in that same branch environment.

Production callers use production targets.
