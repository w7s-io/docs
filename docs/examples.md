---
id: examples
title: Examples
description: Example repositories for W7S deployments.
---

Use these repositories as starting points.

## Fullstack TypeScript

- GitHub: [w7s-io/example-fullstack-ts](https://github.com/w7s-io/example-fullstack-ts)
- W7S URL: [w7s-io.w7s.cloud/example-fullstack-ts](https://w7s-io.w7s.cloud/example-fullstack-ts/)
- Custom domain: [fullstack-example.w7s.io](https://fullstack-example.w7s.io/)

This example demonstrates a bundled Hono backend, a React frontend, and a `frontend/CNAME` custom-domain claim deployed together through W7S.

## Backend RPC

- Target service: [w7s-io/example-rpc-datetime](https://github.com/w7s-io/example-rpc-datetime)
- Client service: [w7s-io/example-rpc-client](https://github.com/w7s-io/example-rpc-client)
- Live client endpoint: [w7s-io.w7s.cloud/example-rpc-client/datetime](https://w7s-io.w7s.cloud/example-rpc-client/datetime)

The client exposes a public `/datetime` endpoint and gets the current datetime from the target service through `env.W7S_RPC`. Its GitHub Actions workflow includes a smoke test that verifies the response came through W7S RPC.

See [Backend RPC](./backend-rpc.md) for copy-pasteable examples showing:

- a target backend route;
- a caller backend using `env.W7S_RPC`;
- a reusable RPC helper;
- same-owner and cross-owner authorization.

## Durable Objects

- GitHub: [w7s-io/example-durable-counter](https://github.com/w7s-io/example-durable-counter)
- Live app endpoint: [w7s-io.w7s.cloud/example-durable-counter](https://w7s-io.w7s.cloud/example-durable-counter/)
- Live current value endpoint: [w7s-io.w7s.cloud/example-durable-counter/value](https://w7s-io.w7s.cloud/example-durable-counter/value)

This example declares a `Counter` Durable Object in `w7s.json`, exports the `Counter` class from `backend/index.js`, and verifies persisted state across W7S redeploys.

See [Durable Objects](./backend-durable-objects.md) for copy-pasteable examples showing:

- Durable Object declaration in `w7s.json`;
- exporting the Durable Object class;
- routing requests through the generated binding;
- redeploy behavior.

## Hyperdrive

Hyperdrive support is documented in [Hyperdrive](./backend-hyperdrive.md).

There is no shared live example yet because a useful smoke test requires a real Postgres origin and a Cloudflare Hyperdrive config ID. The W7S binding shape is:

```json
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

## Backend Queues

Single backend example:

- GitHub: [w7s-io/example-queue-worker](https://github.com/w7s-io/example-queue-worker)
- Live enqueue endpoint: [w7s-io.w7s.cloud/example-queue-worker/enqueue](https://w7s-io.w7s.cloud/example-queue-worker/enqueue)
- Live latest message endpoint: [w7s-io.w7s.cloud/example-queue-worker/last](https://w7s-io.w7s.cloud/example-queue-worker/last)

This example declares a `jobs` queue, sends JSON messages through `env.W7S_QUEUE.fetch("https://w7s.internal/api/v1/queues/w7s-io/example-queue-worker/jobs")`, and consumes the batch at `/_w7s/queues/jobs`.

Separate producer and consumer example:

- Producer GitHub: [w7s-io/example-queue-producer](https://github.com/w7s-io/example-queue-producer)
- Consumer GitHub: [w7s-io/example-queue-consumer](https://github.com/w7s-io/example-queue-consumer)
- Live producer endpoint: [w7s-io.w7s.cloud/example-queue-producer/enqueue](https://w7s-io.w7s.cloud/example-queue-producer/enqueue)
- Live consumer latest message endpoint: [w7s-io.w7s.cloud/example-queue-consumer/last](https://w7s-io.w7s.cloud/example-queue-consumer/last)

The producer sends to `https://w7s.internal/api/v1/queues/w7s-io/example-queue-consumer/jobs`. The consumer declares the queue in `w7s.json`, receives batches at `/_w7s/queues/jobs`, and stores processed messages in KV.

See [Backend Queues](./backend-queues.md) for copy-pasteable examples showing:

- queue declaration in `w7s.json`;
- sending messages through the internal queue binding;
- implementing the backend consumer route;
- splitting producer and consumer into separate backends;
- same-owner and cross-owner authorization.

## Backend Schedules

- GitHub: [w7s-io/example-schedules](https://github.com/w7s-io/example-schedules)
- Live app endpoint: [w7s-io.w7s.cloud/example-schedules](https://w7s-io.w7s.cloud/example-schedules/)
- Live latest tick endpoint: [w7s-io.w7s.cloud/example-schedules/last](https://w7s-io.w7s.cloud/example-schedules/last)

This example declares a `* * * * *` schedule in `w7s.json`, receives the scheduled job at `/_w7s/schedules/tick`, and stores the latest schedule payload in KV. The GitHub Actions workflow polls `/last` until a fresh scheduled tick arrives after deployment.

See [Backend Schedules](./backend-schedules.md) for copy-pasteable examples showing:

- schedule declaration in `w7s.json`;
- implementing the backend schedule route;
- persisting schedule results in KV;
- schedule environment behavior.

## Backend Workflows

- GitHub: [w7s-io/example-workflows](https://github.com/w7s-io/example-workflows)
- Live app endpoint: [w7s-io.w7s.cloud/example-workflows](https://w7s-io.w7s.cloud/example-workflows/)
- Live latest workflow endpoint: [w7s-io.w7s.cloud/example-workflows/last](https://w7s-io.w7s.cloud/example-workflows/last)

This example declares a `process-order` workflow in `w7s.json`, starts workflow instances through `env.W7S_WORKFLOW.fetch("https://w7s.internal/api/v1/workflows/w7s-io/example-workflows/process-order")`, and receives each workflow run at `/_w7s/workflows/process-order`.

See [Backend Workflows](./backend-workflows.md) for copy-pasteable examples showing:

- workflow declaration in `w7s.json`;
- starting workflow instances through the internal workflow binding;
- implementing the backend workflow route;
- checking instance status;
- same-owner and cross-owner authorization.

## Worker Logs

- GitHub: [w7s-io/example-logs](https://github.com/w7s-io/example-logs)
- Live app endpoint: [w7s-io.w7s.cloud/example-logs](https://w7s-io.w7s.cloud/example-logs/)
- Warning endpoint: [w7s-io.w7s.cloud/example-logs/warn](https://w7s-io.w7s.cloud/example-logs/warn)
- Error endpoint: [w7s-io.w7s.cloud/example-logs/error](https://w7s-io.w7s.cloud/example-logs/error)

This example emits `console.log`, `console.warn`, `console.error`, and an intentional exception. It also includes a manual GitHub Actions workflow that uses `w7s-io/w7s-cloud@v1` with `logs-check-only: true`.

See [Observability](./observability.md) for copy-pasteable examples showing:

- fetching logs with `w7s-io/w7s-cloud@v1`;
- fetching logs with curl;
- the JSON shape returned by the logs API;
- filtering by log kind and level.

## Docs site

This docs repo is itself deployed through W7S:

- GitHub: [w7s-io/docs](https://github.com/w7s-io/docs)
- W7S URL: [w7s-io.w7s.cloud/docs](https://w7s-io.w7s.cloud/docs/)
- Landing page: [www.w7s.io](https://www.w7s.io/)
- Custom domain: [www.w7s.io/docs](https://www.w7s.io/docs/)
- Redirects: [w7s.io](https://w7s.io/) and [community.w7s.io](https://community.w7s.io/)

It builds the landing frontend from `landing/`, builds the docs with Docusaurus, assembles them into the generated `build/` directory, and deploys with `w7s-io/w7s-cloud@v1`.

The repo uses the same GitHub Actions deployment flow documented here: install dependencies, build the site, then deploy with the W7S action.

```yaml
- uses: w7s-io/w7s-cloud@v1
  with:
    token: ${{ github.token }}
```

Its `static/CNAME` file declares the canonical site host, the apex redirect host, and the legacy docs host:

```text
www.w7s.io
w7s.io
community.w7s.io
```

The repo also ships a small `backend/index.ts` worker that redirects `w7s.io` to `https://www.w7s.io/` and legacy `community.w7s.io` docs paths to `https://www.w7s.io/docs/`.
