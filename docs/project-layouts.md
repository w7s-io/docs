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

## Native backends

W7S publishes native backend code from either:

```text
backend/index.ts
backend/index.js
worker/index.ts
worker/index.js
```

`index.mts` and `index.mjs` are also supported.

Native backend modules must use local relative imports. If the backend depends on npm packages, bundle it in CI and upload the bundled backend files.

## Fullstack repositories

A repository can include both:

```text
backend/index.ts
dist/index.html
```

Requests go to the backend first. If the backend returns `404` or `405` for a `GET` or `HEAD` request, W7S can fall back to the static frontend's `index.html` for SPA routes.
