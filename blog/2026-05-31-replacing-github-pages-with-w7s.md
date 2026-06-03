---
title: Replacing GitHub Pages With W7S
description: GitHub Pages is excellent for static sites. W7S is the next step when the same repository needs backend routes, storage, queues, schedules, workflows, or custom runtime bindings.
slug: replacing-github-pages-with-w7s
tags: [platforms, static-sites, github-actions, migration]
---

GitHub Pages is one of the cleanest ways to publish a static site. Put HTML, CSS, and JavaScript in a repository, optionally run a build, and publish the result.

For many docs sites, personal sites, and project pages, that is exactly enough.

W7S is for the moment after "static is enough" stops being true:

- the docs site needs a search endpoint;
- the landing page needs a form handler;
- the project page needs a status API;
- the app needs a database, file bucket, queue, schedule, or backend route;
- branch previews need isolated runtime resources.

> GitHub Pages is static hosting. W7S is repository-native app hosting.

<!-- truncate -->

## The Short Mapping

| GitHub Pages concept | W7S replacement | Best fit |
| --- | --- | --- |
| Static site | Static asset deploy | HTML, CSS, JS, docs, landing pages |
| Jekyll or Actions build | GitHub Actions build | Any build toolchain |
| `github.io` URL | W7S owner/repo URL | Predictable app URL |
| Custom domain | [`CNAME`](https://w7s.io/docs/custom-domains/) plus DNS authorization | Repo-visible hostname claims |
| Branch or docs folder source | Workflow-selected output directory | Explicit packaging |
| No backend | Native backend | API routes beside static assets |
| No storage | DB, KV, FS bindings | App data without another platform |
| No background jobs | Queues, schedules, workflows | Async and timed work |

## Source-Backed Comparison Points

GitHub's own [Pages documentation](https://docs.github.com/en/pages) makes the core boundary clear: GitHub Pages is a publishing feature for websites from a repository. That is ideal for docs, project pages, and static marketing sites. It is also the reason the article should not frame Pages as weak; it is excellent at the static publishing job it was designed to do.

The W7S argument starts when the repository needs more than static files. W7S keeps the release path in GitHub through [deploys from GitHub Actions](/docs/deploy-from-github/), but it can package a static frontend and native backend from the same repo. The [project layout docs](/docs/project-layouts/) are the important source here because they show how W7S detects frontend output and backend entrypoints without asking the team to split the app into separate platforms.

Custom domains are another practical difference. GitHub documents [custom domain configuration for Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), and W7S uses a similar repository-visible idea with [`CNAME`](https://w7s.io/docs/custom-domains/) plus DNS authorization in its [custom domains docs](/docs/custom-domains/). The W7S advantage is not merely owning a hostname; it is keeping that hostname attached to an app that can also have backend routes and bindings.

Once a site needs forms, search, uploads, status endpoints, or per-branch test data, W7S provides the next layer directly. [URLs and routing](/docs/urls-and-routing/) describe the owner/repository URL model, while [storage bindings](/docs/storage-bindings/) explain how databases, key-value stores, and file buckets can be declared by the app. That gives a growing Pages-style site a path to become a small application without creating a separate backend product.

The right conclusion is measured. Stay on GitHub Pages when static publishing is the whole requirement. Move to W7S when the repository should keep its GitHub-native release flow but also needs API routes, persistent state, queues, schedules, workflows, or branch-isolated runtime resources.

This does not make GitHub Pages obsolete. It keeps Pages in its lane and gives growing projects a next step without leaving GitHub as the release surface.

## Static Deploys Stay Simple

A W7S static deploy can still be boring:

```yaml title=".github/workflows/deploy.yml"
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - uses: w7s-io/w7s-cloud@v1
        with:
          token: ${{ github.token }}
```

If the build output is `dist/`, `build/`, or another supported output directory, W7S publishes the static assets.

The difference is what the repository can add later without changing platform class.

## Add a Backend Without Moving the Site

With GitHub Pages, dynamic behavior usually means calling an external API. That can be fine, but the project now has two deployment surfaces: the static site and the backend.

W7S can deploy both from the same repository:

```text
frontend/
  package.json
  dist/
backend/
  index.ts
w7s.json
```

The backend is a normal request handler:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/status") {
      return Response.json({
        ok: true,
        repository: env.W7S_REPOSITORY,
        environment: env.W7S_ENVIRONMENT
      });
    }

    return new Response("Not found", {status: 404});
  }
};
```

Now the same app can serve static pages and backend routes.

## Add Storage When Static State Is Not Enough

Static sites often begin with JSON files committed to the repo. That works until the data becomes user-created, generated, private, or large.

W7S lets the app declare managed storage:

```json title="w7s.json"
{
  "bindings": {
    "db": [
      {
        "binding": "DB",
        "migrations": "migrations"
      }
    ],
    "kv": ["CACHE"],
    "fs": ["FILES"]
  }
}
```

Use:

- Serverless DB for notes, forms, metadata, and app-local relational data;
- KV for small cached values and latest state;
- FS for uploaded files or generated artifacts.

The repo explains its runtime needs. The site does not have to bolt on a separate backend platform just to store a row.

## Add Background Work Without a Worker Server

Once a static site has backend routes, it often needs background behavior:

- send an email after form submission;
- regenerate a search index;
- refresh data from an external API;
- process an uploaded file;
- run a daily cleanup.

W7S covers those cases with queues and schedules:

```json title="w7s.json"
{
  "queues": ["jobs"],
  "schedules": [
    {
      "cron": "0 0 * * *",
      "path": "/_w7s/schedules/daily"
    }
  ]
}
```

The backend receives queue and schedule deliveries at declared paths. There is no separate worker service to run beside the static site.

## Custom Domains Stay Reviewable

GitHub Pages supports custom domains. W7S keeps the same repository-friendly idea with a [`CNAME`](https://w7s.io/docs/custom-domains/) file:

```text title="CNAME"
docs.example.com
```

W7S also supports DNS authorization records that allow a domain owner to control which GitHub owner or repository may claim names under a zone.

The repository requests the hostname. DNS authorizes it. The platform maps it.

## Branches Can Preview Runtime Changes

GitHub Pages is excellent at publishing one static output. W7S branch environments are more useful when a branch changes runtime behavior:

- new backend route;
- new database migration;
- new queue;
- new schedule;
- changed environment variable list;
- changed custom domain declaration.

Non-production branches get branch-derived environments and URLs. Managed resources can be scoped by repository and environment, making previews more honest than a static artifact alone.

## When GitHub Pages Still Fits Better

Keep GitHub Pages when the site is:

- purely static;
- documentation, project pages, or a personal site;
- intentionally free of backend routes and storage;
- already using a Pages-specific workflow that is good enough;
- better served by GitHub's built-in Pages settings.

There is no reason to add an app platform when static hosting is the whole need.

## Recommendation

Start with GitHub Pages when the project is just a static site.

Move to W7S when the repository starts needing app behavior:

- backend routes;
- storage bindings;
- queues or schedules;
- branch-isolated previews;
- internal service calls;
- a runtime contract in `w7s.json`.

The migration path is natural because both models start from GitHub. W7S keeps that source of truth and adds the app runtime GitHub Pages deliberately does not try to be.
