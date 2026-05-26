---
id: backend-workflows
title: Backend Workflows
description: Start durable W7S workflow instances from native backends.
---

Native W7S backends can declare workflow consumers in `w7s.json`. W7S owns one Cloudflare Workflow in the core worker, creates instances for app requests, and dispatches each instance to the declaring backend through a durable step with retries.

## Declare a workflow

The simplest form declares a workflow named `process-order`:

```json title="w7s.json"
{
  "workflows": ["process-order"]
}
```

By default, W7S delivers that workflow to:

```text
/_w7s/workflows/process-order
```

Use an object when you want a different consumer path:

```json title="w7s.json"
{
  "workflows": [
    {
      "name": "process-order",
      "path": "/internal/workflows/process-order"
    }
  ]
}
```

Workflows require a native backend deployment. Static-only apps cannot declare workflows.

## Runtime bindings

Every native backend receives:

```text
W7S_WORKFLOW
W7S_WORKFLOW_TOKEN
W7S_OWNER
W7S_REPO
W7S_REPOSITORY
W7S_ENVIRONMENT
```

`W7S_WORKFLOW` is a Cloudflare service binding to the W7S core worker. `W7S_WORKFLOW_TOKEN` is a secret used by W7S to prove which deployed app is starting the workflow.

## Start a workflow

Start workflow instances through:

```text
/api/v1/workflows/<owner>/<repo>/<workflow>
```

Example:

```ts title="backend/index.ts"
type Env = {
  W7S_WORKFLOW: Fetcher;
  W7S_WORKFLOW_TOKEN: string;
  W7S_REPOSITORY: string;
  W7S_ENVIRONMENT: string;
};

export default {
  async fetch(_request: Request, env: Env) {
    const response = await env.W7S_WORKFLOW.fetch(
      "https://w7s.internal/api/v1/workflows/w7s-io/example-workflow/process-order",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.W7S_WORKFLOW_TOKEN}`,
          "content-type": "application/json",
          "x-w7s-workflow-caller": env.W7S_REPOSITORY,
          "x-w7s-workflow-environment": env.W7S_ENVIRONMENT,
          "x-w7s-workflow-instance-id": crypto.randomUUID()
        },
        body: JSON.stringify({
          orderId: "123"
        })
      }
    );

    return response.ok
      ? Response.json({ status: "started", result: await response.json() })
      : new Response(await response.text(), { status: 502 });
  }
};
```

`x-w7s-workflow-instance-id` is optional. If omitted, W7S generates an id.

## Receive workflow runs

Create a backend route for the workflow consumer path:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/_w7s/workflows/process-order" && request.method === "POST") {
      const run = await request.json();

      console.log("workflow", run.instanceId, run.payload);

      return Response.json({
        ok: true,
        processedOrderId: run.payload.orderId
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
```

W7S sends this payload to the consumer route:

```json
{
  "workflow": "process-order",
  "workflowName": "process-order",
  "instanceId": "production-w7s-io-example-workflow-process-order-abc123",
  "createdAt": "2026-05-26T00:00:00.000Z",
  "caller": {
    "orgSlug": "w7s-io",
    "repoSlug": "example-workflow",
    "repository": "w7s-io/example-workflow",
    "environment": "production"
  },
  "target": {
    "orgSlug": "w7s-io",
    "repoSlug": "example-workflow",
    "repository": "w7s-io/example-workflow",
    "environment": "production",
    "workflow": "process-order",
    "path": "/_w7s/workflows/process-order"
  },
  "payload": {
    "orderId": "123"
  }
}
```

Return any `2xx` response after processing. Non-`2xx` responses make the workflow step fail and retry according to W7S core retry policy.

## Status

Check an instance through:

```text
GET /api/v1/workflows/<owner>/<repo>/<workflow>/<instance-id>
```

Use the same `Authorization`, `x-w7s-workflow-caller`, and `x-w7s-workflow-environment` headers used to start the workflow.

## Authorization

Apps under the same GitHub owner can start each other's workflows by default.

For cross-owner starts, the target app must allow the caller in `w7s.json`.

To allow one exact repo:

```json title="w7s.json"
{
  "workflow": {
    "allow": ["guerrerocarlos/notepad"]
  }
}
```

To allow every repo under an owner:

```json title="w7s.json"
{
  "workflow": {
    "allow": ["guerrerocarlos"]
  }
}
```

## Current model

W7S apps do not define Cloudflare `WorkflowEntrypoint` classes directly yet. The first implementation is a core bridge: W7S starts a Cloudflare Workflow instance and dispatches one durable step to the app's HTTP consumer path.

This keeps the app API simple and works with W7S apps deployed as Workers for Platforms dispatch-namespace scripts.
