---
title: Replacing Raw Cloudflare Workers Setup With W7S
description: W7S does not replace Cloudflare Workers as infrastructure. It replaces the repeated product workflow around Workers projects, bindings, deploys, URLs, environments, and app conventions.
slug: replacing-cloudflare-workers-with-w7s
tags: [platforms, cloudflare, workers, bindings]
---

Cloudflare Workers are powerful infrastructure. Workers, Pages, D1, KV, R2, Queues, Durable Objects, Workflows, AI, and service bindings give developers a large set of edge-native primitives.

That power is also the reason teams end up rebuilding the same product workflow:

- how should repositories deploy?
- where do bindings live?
- how should branch environments be named?
- how should URLs be derived?
- how should one app call another?
- how are storage resources named and reused?
- which settings live in the dashboard, Wrangler config, Terraform, or CI?

W7S is built on a focused subset of these primitives. It does not replace Cloudflare Workers as the underlying runtime. It replaces the repeated app-platform layer many teams build on top.

<!-- truncate -->

## The Short Mapping

| Raw Cloudflare setup | W7S replacement | Best fit |
| --- | --- | --- |
| Wrangler deploy | W7S GitHub Action | Repo-native CI deploys |
| Worker script name | GitHub owner/repo identity | Predictable app identity |
| Workers routes | W7S owner/repo URL and custom domains | Convention-based routing |
| Wrangler bindings | `w7s.json` bindings | App-declared runtime contract |
| Manual resource naming | Repo/environment-scoped resources | Reusable conventions |
| Service bindings | Backend RPC | Internal app-to-app calls |
| Queues setup | W7S queues | Background jobs |
| Cron triggers | W7S schedules | Time-based backend routes |
| Durable Objects config | Stateful Objects | Per-key durable state |
| Dashboard state | GitHub workflow plus manifest | Reviewable deploy surface |

## Source-Backed Comparison Points

Cloudflare's own docs describe [Workers](https://developers.cloudflare.com/workers/) as a serverless execution environment and [Pages](https://developers.cloudflare.com/pages/) as a full-stack deployment product. That is a strong foundation, but it still leaves each team deciding how repositories, deploy credentials, preview branches, routes, and runtime configuration should be standardized across many apps.

The same Cloudflare documentation set also exposes the breadth of the primitive layer: [KV](https://developers.cloudflare.com/kv/) for key-value data, [R2](https://developers.cloudflare.com/r2/) for object storage, [D1](https://developers.cloudflare.com/d1/) for serverless SQL, [Queues](https://developers.cloudflare.com/queues/) for async delivery, and [Workflows](https://developers.cloudflare.com/workflows/) for durable multi-step work. W7S is compelling precisely because it narrows that surface into a repository contract instead of asking every small app to assemble the same menu again.

In W7S, [deploying from GitHub](/docs/deploy-from-github/) is the primary release path. The CI workflow builds the app, the W7S action sends the archive, and the platform derives identity from the GitHub owner, repository, branch, and commit. That makes the deploy mechanism reviewable in code, which is harder to preserve when the important project state is split between Wrangler config, dashboard settings, manually named resources, and external automation.

The runtime shape is also documented in W7S instead of being left to convention. [Project layouts](/docs/project-layouts/) explain how static output and native backend entrypoints are discovered, while [storage bindings](/docs/storage-bindings/) define how databases, key-value stores, and file buckets are declared. This is where W7S becomes more than a thin deploy wrapper: it gives small apps a standard way to ask for platform resources.

The practical conclusion is not that teams should avoid Cloudflare. W7S depends on the same class of edge primitives and can also be [self-hosted](/docs/self-host/) when a team wants its own domain and Cloudflare account boundary. The difference is product shape: raw Cloudflare gives maximum primitive control, while W7S gives a repeatable app-platform workflow for repositories that should not need bespoke infrastructure design.

The goal is not less Cloudflare. The goal is less repeated platform glue.

## W7S Is a Product Workflow on Top of Primitives

With raw Workers, you decide how to wire the project:

```toml title="wrangler.toml"
name = "api"
main = "src/index.ts"
compatibility_date = "2026-05-31"

[[kv_namespaces]]
binding = "CACHE"
id = "..."

[[d1_databases]]
binding = "DB"
database_name = "api-db"
database_id = "..."
```

That is appropriate when the team wants direct Cloudflare control.

W7S chooses conventions for you:

```json title="w7s.json"
{
  "bindings": {
    "kv": ["CACHE"],
    "db": [
      {
        "binding": "DB",
        "migrations": "migrations"
      }
    ]
  }
}
```

The app declares intent. W7S maps that intent to platform resources using repository and environment identity.

This is the product stance: an app should not need to invent its own naming, routing, deployment, and authorization system before it can store data and serve requests.

## Deploys Move From Local CLI to GitHub Actions

Raw Workers often start with local CLI deploys:

```sh
npx wrangler deploy
```

That is good for direct control. W7S makes GitHub Actions the default release boundary:

```yaml title=".github/workflows/deploy.yml"
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

The deploy token is the GitHub token. The archive comes from CI. The platform verifies repository identity and publishes the app.

That makes deploys reviewable, repeatable, and easy to copy across repositories.

## Worker Names Become Repository Names

Raw Workers need names, routes, domains, and environment conventions. Different teams choose different patterns.

W7S derives the default app identity from GitHub:

```text
github.com/acme/docs -> https://acme.w7s.cloud/docs/
github.com/acme/api  -> https://acme.w7s.cloud/api/
```

Branch environments get branch-prefixed hosts. Custom domains can be declared in a [`CNAME`](https://w7s.io/docs/custom-domains/) file and authorized through DNS.

That convention is not as flexible as direct Cloudflare routing, but it removes decisions most small apps do not need to make.

## Service Bindings Become Backend RPC

Cloudflare service bindings are a strong primitive for Worker-to-Worker calls. The raw setup still leaves teams to decide naming, authorization, and environment routing.

W7S wraps the common app-level case as Backend RPC:

```ts title="backend/index.ts"
const response = await env.W7S_RPC.fetch(
  "https://w7s.internal/api/v1/rpc/acme/auth/session",
  {
    headers: {
      authorization: `Bearer ${env.W7S_RPC_TOKEN}`,
      cookie: request.headers.get("cookie") ?? ""
    }
  }
);
```

W7S resolves the caller from the deployment token, checks target authorization, dispatches to the matching environment, and injects caller identity headers.

Use raw service bindings when you need Cloudflare-specific binding control. Use W7S RPC when repositories are the service boundary.

## Bindings Stay in One Manifest

Raw Workers can use many Cloudflare resources, but each one has its own provisioning and configuration details.

W7S narrows the app-facing contract:

```json title="w7s.json"
{
  "bindings": {
    "db": [{ "binding": "DB", "migrations": "migrations" }],
    "kv": ["CACHE"],
    "fs": ["FILES"],
    "durableObjects": [
      {
        "binding": "COUNTER",
        "className": "Counter"
      }
    ]
  },
  "queues": ["jobs"],
  "workflows": ["process-order"]
}
```

This lets a reviewer understand the runtime surface from one file:

- data;
- files;
- stateful objects;
- background jobs;
- durable workflows;
- runtime values.

The platform can still use Cloudflare under the hood. The app does not have to expose every underlying configuration choice.

## Branch Environments Become a First-Class Convention

Cloudflare can support multiple environments, preview deployments, Workers Builds, and many configuration shapes. The flexibility is useful, but teams often need conventions around what "staging" or "preview" means.

W7S chooses:

- production comes from `main` or `master`;
- branches become environment names;
- environment identity is injected into the backend;
- resources are scoped by owner, repo, environment, type, and binding name.

That makes a branch deploy feel like a real app, not just a script with a different name.

## What Raw Cloudflare Still Does Better

Use raw Cloudflare Workers, Pages, Wrangler, Terraform, or Pulumi when you need:

- full control over Cloudflare account resources;
- advanced routing and zone configuration;
- compatibility flags and low-level runtime settings not surfaced by W7S;
- non-W7S deployment flows;
- custom Workers for Platforms behavior;
- exact Cloudflare product feature access on day one;
- direct operations through Cloudflare's dashboard, API, or IaC tools;
- architectures that are not repository-app shaped.

W7S intentionally gives up breadth to provide a smaller product workflow.

## Recommendation

Use W7S when the repeated questions are more expensive than the platform choices:

- where do deploys live?
- how are app URLs named?
- how are bindings declared?
- how do branch environments work?
- how does one backend call another?
- how are queues and workflows wired?

Use raw Cloudflare when the application needs direct infrastructure control.

W7S is not an alternative to Cloudflare as infrastructure. It is an alternative to every team rebuilding a small app platform from Cloudflare primitives.
