---
title: Replacing Vercel and Netlify With W7S
description: When a frontend platform starts becoming an app platform, W7S can move deploys, backends, storage, previews, and domains back into the repository.
slug: replacing-vercel-and-netlify-with-w7s
tags: [platforms, alternatives, github-actions, backends]
---

Vercel and Netlify made frontend deployment feel simple: connect a repository, let the platform build it, get a URL, and add serverless functions when the site needs backend behavior.

That model is still useful. But as a project grows, the platform often becomes more than a static host. It starts owning deploy triggers, preview behavior, environment settings, backend functions, edge logic, storage integrations, domain configuration, observability, and team permissions.

W7S takes a different path:

> Keep the deployment workflow in GitHub, keep the runtime contract in the repository, and let the platform provide app bindings directly.

This article maps the common Vercel and Netlify product shape onto W7S components.

<!-- truncate -->

## The Short Mapping

| Vercel / Netlify concept | W7S replacement | Best fit |
| --- | --- | --- |
| Connected project | GitHub repository plus W7S action | Deploys controlled from CI |
| Production deploy | `main` or `master` workflow deploy | Stable production environment |
| Preview deploy | Branch environment | Reviewable URLs and isolated bindings |
| Serverless functions | Native backend | One backend entrypoint with normal routing |
| Edge functions | Native backend on the W7S runtime | Small request handlers near the app |
| Environment variables | `w7s.json` vars and secrets | Repo-declared runtime contract |
| Storage integrations | DB, KV, FS, queues, workflows | Managed resources scoped by repo and environment |
| Custom domains | [`CNAME`](https://w7s.io/docs/custom-domains/) file plus DNS authorization | Domain claims visible in the repo |
| Build settings | GitHub Actions workflow | Install, build, and package steps in code review |
| Platform dashboard | GitHub workflow plus W7S deploy API | Auditable deploy path |

## Source-Backed Comparison Points

Vercel and Netlify are credible references precisely because they made frontend deployment easy. Vercel documents [deployments](https://vercel.com/docs/deployments) and [functions](https://vercel.com/docs/functions) as core pieces of its app platform, while Netlify documents [deploy previews](https://docs.netlify.com/deploy/deploy-types/deploy-previews/), [functions](https://docs.netlify.com/build/functions/overview/), and product features such as [forms](https://docs.netlify.com/manage/forms/setup/). Those are strong defaults for teams that want the platform dashboard to own the release and app experience.

W7S makes a different architectural bet: the repository should own the release path. [Deploying from GitHub](/docs/deploy-from-github/) makes GitHub Actions the control plane, so build commands, output directories, permissions, and deploy triggers are reviewable with the code. That does not remove the need for a platform; it moves the platform interaction into an auditable workflow.

The backend story is also different. Vercel and Netlify expose functions as platform features attached to a project. W7S uses [project layouts](/docs/project-layouts/) to package static output and a native backend entrypoint from the same repository, then uses [URLs and routing](/docs/urls-and-routing/) to derive public routes from the GitHub owner and repo. For apps that want one backend handler with normal routing, that can be simpler than scattering logic across function files and dashboard settings.

W7S becomes especially attractive once the app needs state. [Storage bindings](/docs/storage-bindings/), [backend queues](/docs/backend-queues/), and [backend workflows](/docs/backend-workflows/) let the repository describe databases, caches, files, async work, and durable processes in the same deployment contract. That is the part that makes W7S a real alternative rather than just another static host.

The pricing and operations argument should be grounded in workflow, not slogans. W7S [usage accounting](/docs/usage-accounting/) focuses on app-level consumption and keeps the control plane self-hostable for teams that need ownership. Vercel and Netlify remain good choices when their integrated dashboards and ecosystem are the goal; W7S is better when the team wants GitHub-native deploys, portable conventions, and fewer hidden platform settings.

W7S is not a drop-in clone of either platform. It is a narrower app platform for repositories that can build in GitHub Actions and run as static assets plus JavaScript/TypeScript native backends.

## Deployment Moves Back to GitHub Actions

On Vercel and Netlify, the usual path starts by connecting a Git repository to a hosted project. That project watches pushes, runs a build, and publishes the result.

W7S keeps the same basic convenience, but changes the owner of the release process. The workflow file is the deploy control plane:

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
          production-branch: main
```

That makes deploy behavior reviewable with the app. If a branch changes the build command, environment inputs, output directory, or deploy permissions, reviewers see it in the pull request.

The tradeoff is direct: W7S gives up some dashboard-led convenience in exchange for a release path that is plain repository state.

## Static Sites Stay Static Until They Need More

For static frontends, W7S has the same core shape as a frontend platform:

1. GitHub Actions installs dependencies.
2. The workflow builds the frontend.
3. W7S publishes the generated output.
4. The app gets a stable URL derived from the GitHub owner and repository.

Common output directories such as `dist/`, `build/`, and `frontend/dist/` can be deployed directly.

The useful difference appears later. If the site needs a backend route, queue, schedule, workflow, serverless database, file bucket, key-value namespace, or internal service call, the repository can declare those pieces without moving to a different platform model.

Static does not become a dead end.

## Functions Become One Native Backend

Serverless function platforms often organize backend code as many files mapped to routes. That is convenient for small endpoints. It can become repetitive once the app needs shared middleware, auth, validation, logging, queue helpers, database access, and error handling.

W7S uses a native backend entrypoint:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ok: true});
    }

    if (url.pathname === "/api/orders" && request.method === "POST") {
      return createOrder(request, env);
    }

    return new Response("Not found", {status: 404});
  }
};
```

You can use a router such as Hono, but you do not have to. The backend is a small service that receives requests and decides routing in code.

That works well when the backend is more than a handful of independent functions but still does not need a container or long-running process.

## Storage Is Declared With the App

Frontend platforms often start with functions and then add storage through integrations, plugins, external databases, or provider-specific setup.

W7S puts the app's platform needs in `w7s.json`:

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
  "queues": ["jobs"],
  "schedules": [
    {
      "cron": "*/15 * * * *",
      "path": "/_w7s/schedules/sync"
    }
  ]
}
```

The backend reads the bindings from `env`:

```ts title="backend/index.ts"
type Env = {
  DB: D1Database;
  CACHE: KVNamespace;
  FILES: R2Bucket;
  W7S_QUEUE: Fetcher;
  W7S_QUEUE_TOKEN: string;
};
```

This keeps the runtime contract visible in the repository. The app does not need a separate dashboard checklist to explain which storage resources must exist.

## Preview Deploys Become Branch Environments

Vercel and Netlify popularized preview URLs because reviewing a deployed branch is better than reviewing screenshots.

W7S keeps that idea, but ties it to branch environments:

- `main` and `master` deploy to `production`;
- other branches deploy to branch-derived environment names;
- URLs include the environment prefix;
- managed resources can be scoped by repository and environment.

That means a branch can test more than a static UI. It can test backend routes, storage declarations, queues, schedules, and workflows without accidentally sharing production bindings.

This is the more important preview feature. The URL is useful. The isolated runtime contract is the real value.

## Custom Domains Stay in the Repository

On many platforms, custom domains are project settings. That is convenient until the domain becomes part of the app contract and no one remembers where it is configured.

W7S lets the repository declare hostnames with a [`CNAME`](https://w7s.io/docs/custom-domains/) file:

```text title="CNAME"
www.example.com
app.example.com
```

DNS still decides ownership. A domain owner can point records at W7S and use `_w7s.<zone>` TXT authorization to allow a whole GitHub owner or one exact `owner/repo`.

The result is a clean split:

- the repo requests the hostname;
- DNS authorizes the hostname;
- W7S maps the deploy.

## When Vercel or Netlify Still Fit Better

Keep Vercel or Netlify when the application depends on their exact product surface:

- framework-specific behavior that is tightly integrated with the platform;
- dashboard-managed team workflows and project settings;
- mature preview comment workflows and integrations;
- Netlify forms, plugins, or identity features;
- Vercel-specific Next.js platform capabilities;
- platform-specific analytics or observability;
- existing organization policy around those services.

W7S is not trying to copy every feature. It is trying to make the smaller path clearer for apps that fit its runtime.

## Recommendation

Use W7S when the app can be described as:

- static assets built in GitHub Actions;
- a JavaScript/TypeScript native backend;
- repo-declared storage, queues, schedules, workflows, vars, and secrets;
- branch environments for previews;
- GitHub as the release control plane.

Use Vercel or Netlify when their managed frontend platform and ecosystem integrations are the product you want.

The practical line is ownership. If you want deploy behavior and runtime shape to live in the repository, W7S is the cleaner model. If you want a hosted frontend dashboard to own that workflow, stay with the frontend platform.
