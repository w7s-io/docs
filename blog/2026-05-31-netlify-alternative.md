---
title: Netlify Alternative
description: Why W7S is a strong Netlify alternative for teams that want GitHub Actions, native backends, storage, queues, schedules, workflows, and branch environments in one repo.
slug: netlify-alternative
tags: [platforms, alternatives, netlify, backends]
---

The best Netlify alternative is not always another frontend platform.

Netlify is strong when you want a polished hosted workflow for frontend projects: Git-connected deploys, branch previews, functions, edge features, forms, a dashboard, team collaboration, analytics, and a growing set of platform services.

W7S is different:

> W7S is the Netlify alternative for teams that want GitHub Actions and the repository to own the deployment contract.

That makes W7S better when the site has become an app and the app needs backend routes, storage, queues, schedules, workflows, internal service calls, and predictable branch environments without moving the source of truth into a dashboard.

<!-- truncate -->

## Netlify vs W7S

| Need | Netlify | W7S |
| --- | --- | --- |
| Static frontend deploys | Hosted frontend platform | GitHub Actions deploy to W7S |
| Build settings | Netlify project settings and config | Workflow file in the repo |
| Preview deploys | Deploy previews and branch deploys | Branch environments with repo-scoped URLs |
| Functions | Netlify Functions and Edge Functions | Native backend entrypoint |
| Forms | Netlify Forms | Backend route plus DB, KV, queue, or workflow |
| Scheduled work | Scheduled Functions | W7S schedules |
| Storage | Netlify platform services and integrations | DB, KV, FS, Stateful Objects |
| Background work | Functions, scheduled work, integrations | Queues and workflows |
| Runtime config | Dashboard and environment variables | `w7s.json`, vars, and secrets |
| Control plane | Netlify dashboard plus Git integration | GitHub Actions plus W7S deploy API |

Netlify remains a good fit when the dashboard workflow, visual collaboration, forms product, plugins, and frontend platform surface are central to the team.

W7S is better when those features are less important than keeping deploys, runtime shape, and app resources visible in the repository.

## Why Teams Look for a Netlify Alternative

Teams usually start looking beyond Netlify for one of five reasons:

1. The site needs more backend behavior than a few isolated functions.
2. Storage and background jobs are becoming part of the product.
3. The team wants build and deploy behavior reviewed in pull requests.
4. Pricing needs to map more directly to app usage.
5. The app should have a self-hostable or open-source platform path.

These are not Netlify failures. They are signs that a static site has become an application.

W7S is built for that moment.

## Deploy From GitHub Actions

Netlify's default workflow is to connect a repository to a Netlify project. That project builds and deploys pushes and previews.

W7S moves the release logic into GitHub Actions:

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

The workflow can run tests, generate assets, build multiple packages, run migrations, package a specific directory, and deploy only after the checks you choose.

The practical win is reviewability. If the deploy command changes, the pull request shows it.

## Replace Functions With a Native Backend

File-per-function routing is convenient at first. It gets less convenient when the app needs shared auth, validation, error handling, logging, database helpers, queue helpers, and internal RPC.

W7S uses a native backend:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ok: true});
    }

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return submitContactForm(request, env);
    }

    if (url.pathname === "/api/orders" && request.method === "POST") {
      return createOrder(request, env, ctx);
    }

    return new Response("Not found", {status: 404});
  }
};
```

You can still keep route modules if you want. The difference is that the backend is one service-shaped entrypoint instead of a platform-specific folder convention.

## Replace Forms With App Code

Netlify Forms are useful for simple marketing and contact flows.

W7S does not try to clone that product feature. It gives you the primitives to implement the flow in application code:

- validate the submitted body in a backend route;
- write the record to DB or KV;
- store files in FS;
- enqueue notification work;
- start a workflow when the form needs approval or retries;
- keep spam filtering and business logic in code.

That is better when the form is not just a form anymore. Lead routing, account creation, checkout, waitlists, uploads, support intake, and moderation queues usually become app behavior.

## Declare Storage and Jobs With the App

A Netlify project can use environment variables, functions, build plugins, and external services. W7S pushes the app runtime contract into one manifest:

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
  },
  "queues": [
    {
      "name": "mail",
      "consumer": "/_w7s/queues/mail"
    }
  ],
  "schedules": [
    {
      "cron": "*/15 * * * *",
      "path": "/_w7s/schedules/sync"
    }
  ],
  "workflows": ["checkout"],
  "vars": ["PUBLIC_APP_ORIGIN"],
  "secrets": ["RESEND_API_KEY"]
}
```

That makes the repository the document for how the app runs.

## Branch Environments Are More Than Previews

Preview deploys are useful because reviewers can open the branch.

Branch environments are more useful because the branch can test runtime behavior:

- backend routes;
- database migrations;
- KV and FS usage;
- queues and schedules;
- internal RPC;
- workflows;
- vars and secrets scoped to the environment.

W7S turns branch names into environment names and derives predictable URLs from the GitHub owner and repository. A review app can be more than a rendered frontend.

## Pricing Model Difference

Netlify's current public pricing is credit-based. Its pricing page lists a Free plan with a monthly credit limit, Personal and Pro monthly plans, Enterprise custom pricing, and credit usage for production deploys, compute, bandwidth, web requests, and other platform work.

W7S is free to start on `w7s.cloud` without a W7S account, credit card, or separate cloud setup. The hosted service is designed so small apps can deploy, test, demo, and share before billing matters. When apps get meaningful traffic, the W7S model is intended to be usage-based instead of a mandatory subscription just to keep an app online.

The difference is not only price. It is what gets priced. W7S tries to keep the pricing conversation aligned with app primitives: runtime requests, CPU, storage, DB rows, queues, stateful work, logs, and W7S platform overhead.

## When Netlify Still Wins

Keep Netlify when you need:

- Netlify Forms as a product feature;
- Netlify's dashboard and team workflow;
- visual collaboration and preview tooling;
- plugins and extensions your build depends on;
- Netlify-specific edge or function behavior;
- organization policy already built around Netlify;
- a mature frontend platform with less custom CI setup.

Use W7S when the repository should own the deployment and the app can fit W7S's runtime model.

## Recommendation

Choose W7S as a Netlify alternative when the project can be described as:

- static assets built in GitHub Actions;
- JavaScript or TypeScript backend routes;
- repo-declared DB, KV, FS, queues, schedules, workflows, vars, and secrets;
- branch environments for runtime previews;
- GitHub as the release control plane.

Choose Netlify when its hosted frontend product is the workflow you want.

The practical question is simple: should this app be managed from a dashboard, or should the repository explain how it deploys and runs?

## Current Pricing Sources

Pricing changes. Check the current public pages before making a final cost decision:

- [Netlify pricing](https://www.netlify.com/pricing/)
- [W7S pricing calculator](/docs/pricing)
