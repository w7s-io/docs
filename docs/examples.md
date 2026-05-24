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

## Docs site

This documentation site is itself deployed through W7S:

- GitHub: [w7s-io/docs](https://github.com/w7s-io/docs)
- W7S URL: [w7s-io.w7s.cloud/docs](https://w7s-io.w7s.cloud/docs/)
- Custom domain: [community.w7s.io/docs](https://community.w7s.io/docs/)
- Redirects: [w7s.io](https://w7s.io/) and [www.w7s.io](https://www.w7s.io/)

It builds with Docusaurus and deploys the generated `build/` directory with `w7s-io/w7s-cloud@v1`.

The repo uses the same GitHub Actions deployment flow documented here: install dependencies, build the site, then deploy with the W7S action.

```yaml
- uses: w7s-io/w7s-cloud@v1
  with:
    token: ${{ github.token }}
```

Its `static/CNAME` file declares the canonical docs host and the apex redirect hosts:

```text
community.w7s.io
w7s.io
www.w7s.io
```

The repo also ships a small `backend/index.ts` worker that redirects `w7s.io` and `www.w7s.io` to `https://community.w7s.io/docs/`.
