---
title: Vercel Pricing
description: A current, practical comparison of Vercel pricing and W7S pricing for teams deciding whether a GitHub-native deployment model is a better fit.
slug: vercel-pricing
tags: [platforms, pricing, vercel, alternatives]
---

Vercel pricing is not one number.

It is a plan plus usage model. The public pricing page currently lists Hobby, Pro, and Enterprise plans. Pro is listed as a monthly plan with additional usage, and Vercel's pricing docs explain that managed infrastructure usage is billed through specific metrics such as data transfer, requests, and compute duration.

W7S is intentionally different:

> W7S starts free without a W7S account, credit card, or separate cloud setup, then aims to price real apps by usage instead of a subscription just to keep them online.

This article compares the models, not just the sticker prices.

<!-- truncate -->

## Short Version

| Question | Vercel | W7S |
| --- | --- | --- |
| Can I start free? | Yes, with the Hobby plan | Yes, without a W7S account or card |
| Is there a paid team plan? | Yes, Pro is listed as a monthly plan plus usage | W7S is designed around free start and usage-based overage |
| What drives cost? | Plan, seats, bandwidth, requests, compute, builds, observability, storage, images, add-ons, and product-specific meters | Runtime requests, CPU, storage, DB rows, KV, FS, queues, stateful work, logs, and W7S platform overhead |
| Where is deployment configured? | Vercel project plus Git integration | GitHub Actions workflow |
| Where is runtime shape declared? | Project settings, framework output, environment variables, and platform products | `w7s.json` plus backend code |
| Best fit | Teams that want Vercel's managed frontend platform and framework integrations | Teams that want GitHub-native deploys and app primitives in the repo |

Vercel can be the right choice. W7S is better when the repo should own deploy behavior and the app fits static assets plus native backends and managed bindings.

## Source-Backed Comparison Points

The Vercel side of this pricing comparison is based on the live [Vercel pricing page](https://vercel.com/pricing), the [Vercel pricing docs](https://vercel.com/docs/pricing), and [Vercel Spend Management](https://vercel.com/docs/spend-management). Those pages are the source for the plan-plus-usage framing, active compute language, and spend-control discussion.

The backend-cost examples cite Vercel product docs for [Vercel Functions](https://vercel.com/docs/functions), [Vercel Blob](https://vercel.com/docs/vercel-blob), [Edge Config](https://vercel.com/docs/edge-config), [Queues](https://vercel.com/docs/queues), [Cron Jobs](https://vercel.com/docs/cron-jobs), and [Workflow](https://vercel.com/docs/workflow). Those sources explain why a Vercel bill can involve several product-specific meters once a frontend becomes an application.

The W7S side is based on [W7S pricing](/docs/pricing/), [Usage Accounting](/docs/usage-accounting/), [Deploy From GitHub](/docs/deploy-from-github/), and [Project Layouts](/docs/project-layouts/). Those pages back the argument that W7S cost should be understood through repository-owned deploys and app primitives rather than only an account plan.

The W7S backend model cited here comes from [Storage Bindings](/docs/storage-bindings/), [Serverless Database](/docs/serverless-database/), [Backend Queues](/docs/backend-queues/), [Backend Schedules](/docs/backend-schedules/), [Backend Workflows](/docs/backend-workflows/), and [Backend RPC](/docs/backend-rpc/). These docs support the claim that W7S can replace many small-app backend needs without moving the control plane into a dashboard.

The ownership and escape-hatch claims are backed by [URLs and Routing](/docs/urls-and-routing/) and [Self Host W7S](/docs/self-host/). Pricing pages change frequently, so the article links to current public sources instead of asking readers to trust a stale table.

## What Vercel Charges For

As of May 31, 2026, Vercel's public pricing material presents three plan levels:

- Hobby for personal and non-commercial starting points;
- Pro for professional developers, freelancers, teams, and businesses;
- Enterprise for custom security, performance, collaboration, support, and SLA needs.

The exact bill depends on product usage. Vercel's pricing docs describe managed infrastructure as usage-based, with resources billed by metrics such as data transferred, request count, and compute duration.

Examples on the public pricing page include:

- edge requests;
- fast data transfer;
- build minutes;
- Vercel Functions CPU, memory, and invocations;
- Blob storage and operations;
- Image Optimization;
- Edge Config reads and writes;
- Workflows;
- Queues;
- analytics and observability events;
- log drains and retention;
- add-ons such as deployment protection, static IPs, and compliance features.

That model is powerful because Vercel has a broad product surface. It also means the bill can come from several places once an app uses more than static hosting.

## What W7S Charges For

The W7S pricing page is built around an estimator rather than a simple plan grid.

The hosted service is free to start. You do not need a W7S account, a credit card, or a separate cloud setup to deploy through `w7s.cloud`. Small apps can deploy, test, demo, and share before billing matters.

When an app starts getting meaningful traffic, W7S is designed to price usage rather than require a subscription just to keep the app online.

The calculator models usage categories such as:

- runtime requests;
- runtime CPU;
- deployed runtimes;
- asset and FS storage;
- FS read and write operations;
- key-value reads, writes, and storage;
- SQL rows read, rows written, and storage;
- queue operations;
- Stateful Object requests, duration, and storage;
- app logs;
- W7S routing executions and CPU;
- W7S usage guard reads and counter writes.

The calculator subtracts the included baseline first, estimates operating cost, adds W7S platform overhead, and applies the W7S target margin. It is a planning tool, not a final hosted bill.

## The Important Pricing Difference

Vercel pricing starts from a hosted product account and plan. Usage then adds more detail.

W7S starts from a repository and GitHub Actions workflow. Usage is attached to the app primitives the repository asks for.

That changes how a team thinks about cost:

| Cost question | Vercel framing | W7S framing |
| --- | --- | --- |
| What did we deploy? | A Vercel project | A GitHub owner/repo environment |
| What created the deploy? | Vercel Git integration and project settings | A GitHub Actions workflow |
| What backend exists? | Functions, edge runtime, storage products, integrations | Native backend plus declared bindings |
| What background work exists? | Product-specific functions, cron, queues, workflows, or add-ons | Queues, schedules, and workflows in `w7s.json` |
| How do previews work? | Vercel preview deployments | Branch environments |
| How do we inspect usage? | Vercel usage dashboard and invoices | W7S usage rollups and GitHub-native warnings |

The W7S advantage is not that every meter is cheaper in every case. The advantage is that the app's deploy and runtime surface stay in source control.

## Example: Small App Before Traction

For a small app, Vercel can be generous. Hobby is useful for personal projects, and Pro includes more professional and team features.

W7S optimizes for a different early-stage path:

- deploy from GitHub Actions;
- use the GitHub token;
- get a repo-derived URL;
- add a backend route when needed;
- declare DB, KV, FS, queues, schedules, and workflows in `w7s.json`;
- stay in the free start path while usage is small.

That is why W7S can be better for prototypes, demos, internal tools, and small production apps that do not need a commercial frontend dashboard yet.

## Example: App With Backend Work

A frontend app often becomes a backend app gradually:

- contact form;
- checkout route;
- signed upload URL;
- webhook receiver;
- scheduled sync;
- queue for email or billing work;
- database-backed admin UI;
- service-to-service call.

On Vercel, those may map to multiple platform products and meters.

On W7S, they stay inside the W7S app model:

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
  "queues": ["mail"],
  "schedules": [
    {
      "cron": "0 * * * *",
      "path": "/_w7s/schedules/hourly"
    }
  ],
  "workflows": ["checkout"]
}
```

The usage still matters. The difference is that the repo shows which primitives the app uses.

## Spend Controls and Usage Feedback

Vercel provides spend management tools, budgets, alerts, and controls in its platform.

W7S exposes per-app usage rollups by repository and environment. The W7S deploy action can read usage after a deploy and write warnings into the GitHub Actions summary or open a GitHub issue when an app approaches limits.

That is a different feedback loop. The usage warning appears where the team is already reviewing the repository.

W7S also has free-tier guardrails. These are operational protections, not final billing-grade counters. They keep one app, owner, or global account from unexpectedly consuming shared infrastructure.

## When Vercel Pricing Is Worth It

Vercel can be worth the money when:

- the app is deeply tied to Next.js behavior on Vercel;
- the team wants Vercel's dashboard workflow;
- preview collaboration and deployment protection are important;
- Vercel analytics, observability, security, and add-ons are part of the product workflow;
- the organization is already standardized on Vercel;
- the team wants a mature commercial frontend cloud more than repository-owned deployment.

The right answer is not always to minimize the bill. Sometimes the hosted workflow is exactly what you are paying for.

## When W7S Is Better

W7S is better when:

- you want no W7S account or credit card to start;
- GitHub Actions should be the deploy control plane;
- the deploy token should be the GitHub token;
- the app URL should derive from GitHub owner and repository;
- branch environments should be predictable;
- static assets and backend routes should ship together;
- storage, jobs, schedules, workflows, vars, and secrets should live in the repo contract;
- usage feedback should return to GitHub;
- self-hostability matters as an escape hatch.

For these teams, the strongest W7S pricing feature is not only cost. It is that the operational model does not become another dashboard-centered subscription before the app has earned that complexity.

## Recommendation

Use Vercel when you want Vercel's frontend platform, framework integration, collaboration tools, and commercial product surface.

Use W7S when your app can be static assets plus native backend routes and managed bindings, and when you want deployment truth to live in GitHub.

The pricing comparison starts with dollars, but the durable decision is ownership: Vercel rents you a polished deployment product. W7S keeps the deploy workflow and runtime contract closer to the repository.

## Current Pricing Sources

Pricing changes. Check the current public pages before making a final cost decision:

- [Vercel pricing](https://vercel.com/pricing)
- [Vercel pricing docs](https://vercel.com/docs/pricing)
- [W7S pricing calculator](/docs/pricing)
- [W7S usage accounting](/docs/usage-accounting)
