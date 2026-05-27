---
id: backend-schedules
title: Backend Schedules
description: Run cron-driven background jobs in W7S JavaScript/TypeScript native backends.
---

JavaScript/TypeScript native W7S backends can declare cron schedules in `w7s.json`. W7S runs one core Cloudflare Cron Trigger every minute, checks deployed app schedules, and dispatches due jobs to the declaring backend.

Working example repository:

- [`w7s-io/example-schedules`](https://github.com/w7s-io/example-schedules): backend that receives a one-minute schedule and stores the latest tick in KV.

## Declare a schedule

Add a `schedules` array to `w7s.json`:

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

Schedules require a JavaScript or TypeScript native backend deployment. Static-only apps cannot declare schedules.

## Cron format

W7S supports five-field UTC cron expressions:

```text
minute hour day-of-month month day-of-week
```

Supported field syntax:

- `*`
- `*/n`
- numeric values
- comma-separated lists
- ranges such as `9-17`
- stepped ranges such as `9-17/2`

Day-of-week accepts `0` or `7` for Sunday.

W7S matches all five fields against the scheduled UTC minute.

## Receive a scheduled job

Implement the route from the schedule declaration:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/_w7s/schedules/sync") {
      const job = await request.json();

      console.log("scheduled job", job.schedule, job.scheduledTime);

      return Response.json({ ok: true });
    }

    return new Response("Not found", { status: 404 });
  }
};
```

W7S sends this JSON payload:

```json
{
  "schedule": "*/5 * * * *",
  "scheduledTime": "2026-05-25T12:00:00.000Z",
  "repository": "owner/repo",
  "environment": "production"
}
```

The backend also receives schedule identity headers:

```text
x-w7s-schedule: 1
x-w7s-schedule-cron: */5 * * * *
x-w7s-schedule-time: 2026-05-25T12:00:00.000Z
```

Return any `2xx` response after processing. Non-`2xx` responses make W7S report the schedule dispatch as failed.

## With storage

Schedules work well with per-app KV, R2, or D1 bindings. For example, a scheduled backend can keep the latest run in KV:

```json title="w7s.json"
{
  "bindings": {
    "kv": ["STATE"]
  },
  "schedules": [
    {
      "cron": "* * * * *",
      "path": "/_w7s/schedules/tick"
    }
  ]
}
```

```ts title="backend/index.ts"
type Env = {
  STATE: KVNamespace;
};

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/_w7s/schedules/tick") {
      const job = await request.json();
      await env.STATE.put("latest-schedule", JSON.stringify(job));
      return Response.json({ ok: true });
    }

    if (url.pathname === "/last") {
      const latest = await env.STATE.get("latest-schedule", "json");
      return Response.json({ latest });
    }

    return new Response("Not found", { status: 404 });
  }
};
```

## Environment behavior

Schedules are scoped to the deployment environment. A production deploy and a branch deploy can declare different schedules without sharing the same mapping.

W7S stores schedule mappings in the core deployment KV and removes stale mappings when the app is redeployed.

The live example is served at [`w7s-io.w7s.cloud/example-schedules`](https://w7s-io.w7s.cloud/example-schedules/). Check the latest delivered tick at [`/last`](https://w7s-io.w7s.cloud/example-schedules/last).
