---
id: examples
title: Examples
description: Example repositories for W7S deployments.
---

Use these repositories as starting points.

## Fullstack TypeScript

```text
https://github.com/w7s-io/example-fullstack-ts
https://w7s-io.w7s.cloud/example-fullstack-ts/
https://fullstack-example.w7s.io/
```

This example demonstrates a bundled Hono backend, a React frontend, and a `frontend/CNAME` custom-domain claim deployed together through W7S.

## Docs site

This documentation site is itself deployed through W7S:

```text
https://github.com/w7s-io/docs
https://w7s-io.w7s.cloud/docs/
https://community.w7s.io/docs/
https://w7s.io/
https://www.w7s.io/
```

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
