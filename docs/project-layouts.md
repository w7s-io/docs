---
id: project-layouts
title: Project Layouts
description: Repository layouts that W7S can deploy.
---

W7S detects deploy targets from the archive uploaded by GitHub Actions.

## Static frontends

W7S serves static assets from the first matching output root:

```text
frontend/dist/
dist/client/
dist/
build/
out/
```

Each static root should include an `index.html`.

One exception is framework SSR output. Frameworks such as TanStack Start may build frontend assets into `dist/client/` without an `index.html`, while rendering HTML from `dist/server/index.js`. W7S supports that paired layout:

```text
dist/server/index.js
dist/client/assets/app.js
```

## Native backends

Native backends must be JavaScript or TypeScript runtime modules. W7S publishes native backend code from either:

```text
backend/index.ts
backend/index.js
worker/index.ts
worker/index.js
```

`index.mts` and `index.mjs` are also supported.

Other backend languages are not uploaded directly. Build or bundle them to one of the supported JavaScript/TypeScript entrypoints before deploying.

Native backend modules must use local relative imports. If the backend depends on npm packages, bundle it in CI and upload the bundled backend files.

Framework SSR builds can also publish their generated JavaScript server entrypoint:

```text
dist/server/index.js
```

When an SSR build emits runtime compatibility metadata, W7S includes supported flags such as `nodejs_compat` when uploading the backend module.

Uploaded JavaScript/TypeScript native backends also get W7S-managed log capture. That lets W7S expose app `console.*` output and uncaught exceptions through the [Observability](./observability.md) logs API.

## Fullstack repositories

A repository can include both:

```text
backend/index.ts
dist/index.html
```

or a framework SSR build:

```text
dist/server/index.js
dist/client/assets/app.js
```

Requests go to the backend first. If the backend returns `404` or `405` for a `GET` or `HEAD` request, W7S can fall back to the static frontend's `index.html` for SPA routes.
