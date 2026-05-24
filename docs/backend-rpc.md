---
id: backend-rpc
title: Backend RPC
description: Let W7S native backends call each other through internal service bindings.
---

Native W7S backends can call other W7S backends without going through public DNS. W7S injects an internal service binding and a per-deployment token into every native backend.

## Runtime bindings

Every native backend receives:

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

## Authorization

Apps under the same GitHub owner can call each other by default.

For cross-owner calls, the target app must allow the caller in `w7s.json`:

```json
{
  "rpc": {
    "allow": ["guerrerocarlos/notepad", "w7s-io"]
  }
}
```

Allowlist entries can be:

- a GitHub owner, such as `w7s-io`;
- an exact GitHub repository, such as `guerrerocarlos/notepad`.

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
