---
id: local-development
title: Local Development
description: Run W7S-shaped local URLs with w7s-local and test multi-repo backends before deploying.
---

`w7s-local` runs a local `workerd` router that mirrors the W7S URL shape. Use it when you want to test a frontend, backend dev server, or fullstack app with the same owner, repo, branch, and path routing model that W7S uses after deploy.

It does not require Wrangler, a Cloudflare account, KV, R2, D1, Durable Objects, Workers for Platforms, or a W7S deploy.

## Quick start

For a backend or framework dev server:

```sh
npx w7s-local@latest --backend http://localhost:5173
```

For static build output:

```sh
npx w7s-local@latest --frontend dist
```

To have `w7s-local` start the app dev server first:

```sh
npx w7s-local@latest \
  --command "npm run dev -- --host 127.0.0.1 --port 5173" \
  --backend http://localhost:5173
```

The local router listens on `127.0.0.1:8787` by default and prints the W7S-shaped URL when it starts.

## Local URL shape

Production environment:

```text
http://<owner>.local.w7s.cloud:8787/<repo>/
```

Branch or named environment:

```text
http://<environment>--<owner>.local.w7s.cloud:8787/<repo>/
```

If local DNS for `local.w7s.cloud` is not available, send the host header yourself:

```sh
curl -H "host: acme.local.w7s.cloud" http://127.0.0.1:8787/app/
```

`w7s-local` also accepts direct `127.0.0.1` requests as a fallback, which is useful when one local repo calls another local repo on a different port.

## Common options

```text
--root <dir>             App root. Defaults to cwd.
--owner <slug>           GitHub owner/org slug. Inferred from git remote when possible.
--repo <slug>            GitHub repo slug. Inferred from package.json or cwd.
--environment <name>     W7S environment. Defaults to production.
--base-domain <domain>   Local W7S base domain. Defaults to local.w7s.cloud.
--port <port>            Local workerd HTTP port. Defaults to 8787.
--frontend <dir>         Static output directory. Auto-detected by W7S conventions.
--backend <url>          Backend/dev server origin to proxy after stripping the repo prefix.
--command <command>      Start a dev command before serving.
--workerd <path>         workerd executable. Defaults to the bundled npm dependency.
```

Example with explicit owner, repo, environment, and port:

```sh
npx w7s-local@latest \
  --owner acme \
  --repo app \
  --environment feature-login \
  --port 8788 \
  --backend http://localhost:3000
```

## What it simulates

`w7s-local` simulates:

- W7S owner and environment host parsing;
- repo prefix stripping before backend proxying;
- static asset serving from local build output;
- static exact match before backend proxy;
- SPA fallback after backend `404` or `405`;
- W7S request headers such as `x-w7s-org-slug`, `x-w7s-repo-slug`, and `x-w7s-original-path`.

Check local router state with:

```sh
curl http://127.0.0.1:8787/_w7s/local/status
```

`w7s-local` does not provision or emulate W7S-managed bindings such as storage, queues, workflows, Workers AI, or the production RPC token path. Use local service doubles or local HTTP fallbacks for those dependencies, then keep hosted smoke tests for the managed binding path.

## Test RPC between two local repos

Hosted W7S RPC uses `env.W7S_RPC.fetch("https://w7s.internal/api/v1/rpc/<owner>/<repo>/<path>")`. `w7s-local` does not create that internal service binding, so local multi-repo tests should put the RPC call behind a small helper:

- in hosted W7S, call `env.W7S_RPC` with `env.W7S_RPC_TOKEN`;
- under `w7s-local`, call the target repo's local W7S URL on another port.

This tests routing, repo-prefix stripping, request serialization, response handling, and most app-level behavior locally. It does not replace a hosted smoke test for W7S RPC authorization and deployment tokens.

The docs repo includes two copyable example repos:

- [`examples/w7s-local-rpc-time-service`](https://github.com/w7s-io/docs/tree/main/examples/w7s-local-rpc-time-service): target service with a `/datetime` backend route.
- [`examples/w7s-local-rpc-client`](https://github.com/w7s-io/docs/tree/main/examples/w7s-local-rpc-client): caller service with a `/datetime` route that calls the target.

Run the target service in one terminal:

```sh
cd examples/w7s-local-rpc-time-service
npm install
npm run local
```

Run the caller service in a second terminal:

```sh
cd examples/w7s-local-rpc-client
npm install
npm run local
```

Call the client through its local W7S router:

```sh
curl -H "host: acme.local.w7s.cloud" \
  http://127.0.0.1:8789/rpc-client/datetime
```

Expected response shape:

```json
{
  "ok": true,
  "source": "local-w7s-url",
  "target": {
    "ok": true,
    "service": "rpc-time",
    "received": {
      "routedOwner": "acme",
      "routedRepo": "rpc-time",
      "originalPath": "/rpc-time/datetime",
      "callerRepository": "acme/rpc-client"
    }
  }
}
```

The target router runs on port `8788`; the caller router runs on port `8789`. The caller's default local target is:

```text
http://127.0.0.1:8788/rpc-time/datetime
```

Override it when testing a different owner, repo, port, or path:

```sh
LOCAL_RPC_DATETIME_URL=http://127.0.0.1:8788/other-service/datetime npm run local
```

## Production RPC helper shape

Keep production and local behavior in one helper:

```js title="backend/index.js"
const callDatetimeService = (env) => {
  if (env.W7S_RPC && env.W7S_RPC_TOKEN) {
    return env.W7S_RPC.fetch(
      "https://w7s.internal/api/v1/rpc/acme/rpc-time/datetime",
      {
        headers: {
          authorization: `Bearer ${env.W7S_RPC_TOKEN}`
        }
      }
    );
  }

  return fetch(
    env.LOCAL_RPC_DATETIME_URL ??
      "http://127.0.0.1:8788/rpc-time/datetime",
    {
      headers: {
        "x-w7s-rpc": "1",
        "x-w7s-rpc-caller-owner": env.W7S_OWNER ?? "acme",
        "x-w7s-rpc-caller-repo": env.W7S_REPO ?? "rpc-client",
        "x-w7s-rpc-caller-repository":
          env.W7S_REPOSITORY ?? "acme/rpc-client",
        "x-w7s-rpc-caller-environment":
          env.W7S_ENVIRONMENT ?? "production"
      }
    }
  );
};
```

The local `x-w7s-rpc-*` headers are only a development convenience so the target service can exercise caller-aware code paths. In hosted W7S, those identity headers are injected by W7S after the internal RPC authorization check.
