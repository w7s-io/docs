---
id: examples
title: Examples
description: Example repositories for W7S deployments.
---

Use these repositories as starting points.

## Static Site

- GitHub: [w7s-io/example-static-site](https://github.com/w7s-io/example-static-site)
- W7S URL: [w7s-io.w7s.cloud/example-static-site](https://w7s-io.w7s.cloud/example-static-site/)

This example demonstrates a static-only deploy with `dist/index.html` and no build step.

See [Project Layouts](./project-layouts.md#static-frontends) for the static frontend output roots W7S detects.

## Native Backend

- GitHub: [w7s-io/example-native-backend](https://github.com/w7s-io/example-native-backend)
- Live health endpoint: [w7s-io.w7s.cloud/example-native-backend/api/health](https://w7s-io.w7s.cloud/example-native-backend/api/health)
- Live greeting endpoint: [w7s-io.w7s.cloud/example-native-backend/api/greeting](https://w7s-io.w7s.cloud/example-native-backend/api/greeting)

This example demonstrates a single JavaScript/TypeScript native backend module that default-exports a `fetch(request, env, ctx)` handler.

See [Project Layouts](./project-layouts.md#native-backend-function-shape) for the backend contract and Hono example.

## Fullstack TypeScript

- GitHub: [w7s-io/example-fullstack-ts](https://github.com/w7s-io/example-fullstack-ts)
- W7S URL: [w7s-io.w7s.cloud/example-fullstack-ts](https://w7s-io.w7s.cloud/example-fullstack-ts/)
- Custom domain: [fullstack-example.w7s.io](https://fullstack-example.w7s.io/)

This example demonstrates a bundled Hono backend, a React frontend, and a `frontend/CNAME` custom-domain claim deployed together through W7S.

## AI Joke Generator

- GitHub: [w7s-io/example-ai-joke](https://github.com/w7s-io/example-ai-joke)
- W7S URL: [w7s-io.w7s.cloud/example-ai-joke](https://w7s-io.w7s.cloud/example-ai-joke/)
- Backend health endpoint: [w7s-io.w7s.cloud/example-ai-joke/api/status](https://w7s-io.w7s.cloud/example-ai-joke/api/status)

This example demonstrates a Vite React frontend, a Hono backend, and a backend-only call through the W7S AI service binding. The browser calls `/api/joke`; the backend calls `env.W7S_AI` with a W7S-generated deployment token, so the repo does not need provider account IDs, provider API tokens, or GitHub secrets.

See [Backend AI](./backend-ai.md) for the request shape.

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

## Stateful Objects

- GitHub: [w7s-io/example-durable-counter](https://github.com/w7s-io/example-durable-counter)
- Live app endpoint: [w7s-io.w7s.cloud/example-durable-counter](https://w7s-io.w7s.cloud/example-durable-counter/)
- Live current value endpoint: [w7s-io.w7s.cloud/example-durable-counter/value](https://w7s-io.w7s.cloud/example-durable-counter/value)

This example declares a `Counter` stateful object in `w7s.json`, exports the `Counter` class from `backend/index.js`, and verifies persisted state across W7S redeploys.

See [Stateful Objects](./backend-durable-objects.md) for copy-pasteable examples showing:

- stateful object declaration in `w7s.json`;
- exporting the stateful object class;
- routing requests through the generated binding;
- redeploy behavior.

## Postgres Bindings

- GitHub: [w7s-io/example-postgres-binding](https://github.com/w7s-io/example-postgres-binding)

This example demonstrates the source, build, runtime compatibility metadata, and `w7s.json` shape for a backend that reads a W7S-managed Postgres binding from `env.DB`. It is manual-deploy because a real external database and managed Postgres binding config ID are required.

The W7S binding shape is:

```json
{
  "bindings": {
    "hyperdrive": [
      {
        "binding": "DB",
        "id": "postgres-binding-id"
      }
    ]
  }
}
```

See [Postgres Bindings](./backend-hyperdrive.md) for the full setup flow.

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

The producer sends to `https://w7s.internal/api/v1/queues/w7s-io/example-queue-consumer/jobs`. The consumer declares the queue in `w7s.json`, receives batches at `/_w7s/queues/jobs`, and stores processed messages in key-value storage.

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

This example declares a `* * * * *` schedule in `w7s.json`, receives the scheduled job at `/_w7s/schedules/tick`, and stores the latest schedule payload in key-value storage. The GitHub Actions workflow polls `/last` until a fresh scheduled tick arrives after deployment.

See [Backend Schedules](./backend-schedules.md) for copy-pasteable examples showing:

- schedule declaration in `w7s.json`;
- implementing the backend schedule route;
- persisting schedule results in key-value storage;
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

## Usage Check

- GitHub: [w7s-io/example-usage-check](https://github.com/w7s-io/example-usage-check)
- Live app endpoint: [w7s-io.w7s.cloud/example-usage-check](https://w7s-io.w7s.cloud/example-usage-check/)

This example deploys a tiny static app and includes a separate scheduled workflow that runs `w7s-io/w7s-cloud@v1` with `usage-check-only: true`. That reads usage and limit status without redeploying the app.

See [Usage Accounting](./usage-accounting.md) for the API response shape and limit behavior.

## Observability

- GitHub: [w7s-io/example-logs](https://github.com/w7s-io/example-logs)
- Live app endpoint: [w7s-io.w7s.cloud/example-logs](https://w7s-io.w7s.cloud/example-logs/)
- Warning endpoint: [w7s-io.w7s.cloud/example-logs/warn](https://w7s-io.w7s.cloud/example-logs/warn)
- Error endpoint: [w7s-io.w7s.cloud/example-logs/error](https://w7s-io.w7s.cloud/example-logs/error)

This example emits `console.log`, `console.warn`, `console.error`, and an intentional exception. It also includes manual GitHub Actions workflows for `logs-check-only: true` and the W7S analytics API.

See [Observability](./observability.md) for copy-pasteable examples showing:

- fetching platform analytics with curl;
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
- Redirect: [w7s.io](https://w7s.io/)

It builds the landing frontend from `landing/`, builds the docs with Docusaurus, assembles them into the generated `build/` directory, and deploys with `w7s-io/w7s-cloud@v1`.

The repo uses the same GitHub Actions deployment flow documented here: install dependencies, build the site, then deploy with the W7S action.

```yaml
- uses: w7s-io/w7s-cloud@v1
  with:
    token: ${{ github.token }}
```

Its `static/CNAME` file declares the canonical site host and the apex redirect host:

```text
www.w7s.io
w7s.io
```

The repo also ships a small `backend/index.ts` worker that redirects `w7s.io` to `https://www.w7s.io/`.
