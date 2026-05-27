---
id: backend-rpc
title: Backend RPC
description: Let W7S JavaScript/TypeScript native backends call each other through internal service bindings.
---

JavaScript/TypeScript native W7S backends can call other W7S backends without going through public DNS. W7S injects an internal service binding and a per-deployment token into every JavaScript/TypeScript native backend.

Working example repositories:

- [`w7s-io/example-rpc-datetime`](https://github.com/w7s-io/example-rpc-datetime): target backend that returns the current UTC datetime.
- [`w7s-io/example-rpc-client`](https://github.com/w7s-io/example-rpc-client): public backend that calls the datetime service through RPC.

## Runtime bindings

Every JavaScript/TypeScript native backend receives:

```text
W7S_RPC
W7S_RPC_TOKEN
W7S_OWNER
W7S_REPO
W7S_REPOSITORY
W7S_ENVIRONMENT
```

`W7S_RPC` is a Cloudflare service binding to the W7S core Worker. `W7S_RPC_TOKEN` is a secret used by W7S to prove which deployed app is making the call.

## Call another backend

Call the target through:

```text
/api/v1/rpc/<owner>/<repo>/<path>
```

Example:

```ts
const response = await env.W7S_RPC.fetch(
  "https://w7s.internal/api/v1/rpc/guerrerocarlos/auth/session",
  {
    headers: {
      authorization: `Bearer ${env.W7S_RPC_TOKEN}`,
      "x-w7s-rpc-caller": env.W7S_REPOSITORY,
      "x-w7s-rpc-environment": env.W7S_ENVIRONMENT,
      cookie: request.headers.get("cookie") ?? ""
    }
  }
);

if (!response.ok) {
  return new Response("Auth service unavailable", { status: 502 });
}

const session = await response.json();
```

The target backend receives the request at `/session` in this example.

## Example: same-owner apps

Assume these two repositories exist under the same GitHub owner:

```text
github.com/guerrerocarlos/auth
github.com/guerrerocarlos/nodepad
```

`guerrerocarlos/nodepad` can call `guerrerocarlos/auth` without extra configuration because both apps share the same owner.

### Target backend

In `guerrerocarlos/auth`, expose a normal backend route:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/session") {
      return Response.json({
        ok: true,
        user: {
          id: "user_123",
          email: "hello@example.com"
        },
        calledBy: request.headers.get("x-w7s-rpc-caller-repository")
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
```

Deploying this repo makes the route available internally as:

```text
/api/v1/rpc/guerrerocarlos/auth/session
```

### Caller backend

In `guerrerocarlos/nodepad`, call the auth backend through `env.W7S_RPC`:

```ts title="backend/index.ts"
type Env = {
  W7S_RPC: Fetcher;
  W7S_RPC_TOKEN: string;
  W7S_REPOSITORY: string;
  W7S_ENVIRONMENT: string;
};

export default {
  async fetch(_request: Request, env: Env) {
    const response = await env.W7S_RPC.fetch(
      "https://w7s.internal/api/v1/rpc/guerrerocarlos/auth/session",
      {
        headers: {
          authorization: `Bearer ${env.W7S_RPC_TOKEN}`,
          "x-w7s-rpc-caller": env.W7S_REPOSITORY,
          "x-w7s-rpc-environment": env.W7S_ENVIRONMENT
        }
      }
    );

    if (!response.ok) {
      return new Response("Auth service failed", { status: 502 });
    }

    const session = await response.json();
    return Response.json({ session });
  }
};
```

## Example: reusable helper

For apps that call multiple W7S services, keep the request headers in one helper:

```ts title="backend/w7s-rpc.ts"
type W7sRpcEnv = {
  W7S_RPC: Fetcher;
  W7S_RPC_TOKEN: string;
  W7S_REPOSITORY: string;
  W7S_ENVIRONMENT: string;
};

export const callW7s = (
  env: W7sRpcEnv,
  target: `${string}/${string}`,
  path: `/${string}`,
  init: RequestInit = {}
) => {
  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${env.W7S_RPC_TOKEN}`);
  headers.set("x-w7s-rpc-caller", env.W7S_REPOSITORY);
  headers.set("x-w7s-rpc-environment", env.W7S_ENVIRONMENT);

  return env.W7S_RPC.fetch(
    `https://w7s.internal/api/v1/rpc/${target}${path}`,
    {
      ...init,
      headers
    }
  );
};
```

Use it from a backend:

```ts title="backend/index.ts"
import { callW7s } from "./w7s-rpc";

export default {
  async fetch(request: Request, env: Env) {
    const response = await callW7s(env, "guerrerocarlos/auth", "/session", {
      headers: {
        cookie: request.headers.get("cookie") ?? ""
      }
    });

    return response.ok
      ? response
      : new Response("Auth service failed", { status: 502 });
  }
};
```

## Authorization

Apps under the same GitHub owner can call each other by default.

For cross-owner calls, the target app must allow the caller in `w7s.json`.

To allow one exact repo:

```json
{
  "rpc": {
    "allow": ["guerrerocarlos/nodepad"]
  }
}
```

To allow every repo under an owner:

```json
{
  "rpc": {
    "allow": ["guerrerocarlos"]
  }
}
```

Allowlist entries can be:

- a GitHub owner, such as `w7s-io`;
- an exact GitHub repository, such as `guerrerocarlos/nodepad`.

The target deployment controls this list. The caller cannot grant itself access.

## Target identity headers

W7S injects caller identity headers before dispatching to the target backend:

```text
x-w7s-rpc: 1
x-w7s-rpc-caller-owner: <owner>
x-w7s-rpc-caller-repo: <repo>
x-w7s-rpc-caller-repository: <owner>/<repo>
x-w7s-rpc-caller-environment: <environment>
```

Use these headers for app-level authorization, audit logs, or tenant routing.

## Environment behavior

RPC calls stay in the caller's deployment environment. If a feature branch deploy calls `owner/service`, W7S looks for the target deployment in that same branch environment.

Production callers use production targets.
