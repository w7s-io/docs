---
title: Replacing Kubernetes for Small Apps With W7S
description: Kubernetes is excellent infrastructure for container fleets. W7S is a smaller default when an app only needs static assets, request handlers, storage bindings, queues, schedules, and workflows.
slug: replacing-kubernetes-for-small-apps-with-w7s
tags: [platforms, kubernetes, alternatives, workflows]
---

Kubernetes is powerful because it can run almost anything. Pods, Deployments, Services, Ingress, Jobs, CronJobs, ConfigMaps, Secrets, volumes, operators, service meshes, and controllers can model a huge range of systems.

That flexibility is also why Kubernetes is often too much for small apps.

Many apps do not need a cluster. They need:

- a frontend;
- a few backend routes;
- a database;
- file storage;
- a background queue;
- a schedule;
- a durable workflow;
- a deploy path from GitHub;
- logs and usage feedback.

W7S is designed for that smaller shape.

<!-- truncate -->

## The Short Mapping

| Kubernetes concept | W7S replacement | Best fit |
| --- | --- | --- |
| Cluster | W7S cloud or self-hosted W7S | Shared app platform |
| Namespace | GitHub owner/repo/environment | App and branch isolation |
| Deployment | W7S deploy | Static assets and native backend |
| Pod / container | Native backend request handler | HTTP app logic |
| Service | W7S owner/repo URL or Backend RPC | Public and internal routing |
| Ingress | W7S routing and custom domains | HTTP routing without ingress config |
| ConfigMap | `w7s.json` vars or app storage | Runtime configuration |
| Secret | GitHub secrets plus W7S secret bindings | Deploy-time secrets |
| PersistentVolume | DB, KV, FS, or Stateful Objects | App-level state |
| Job | Queue message or workflow | Background work |
| CronJob | W7S schedule | Time-based work |
| Operator | W7S managed binding provisioning | Common platform resources |

## Source-Backed Comparison Points

Kubernetes is broad infrastructure, not a small-app deployment product. Its official docs cover [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [Services](https://kubernetes.io/docs/concepts/services-networking/service/), [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/), [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/), and [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) as separate concepts. That separation is powerful for platform teams, but it is a lot of surface area for a small app that only needs a frontend, a few routes, and some managed state.

W7S replaces that cluster vocabulary with a repository vocabulary. [Deploying from GitHub](/docs/deploy-from-github/) defines the release mechanism, [project layouts](/docs/project-layouts/) define what the archive can contain, and [URLs and routing](/docs/urls-and-routing/) define how owner/repo identity becomes a public app URL. The result is less flexible than Kubernetes, but much easier to standardize for apps that fit the model.

For background work, Kubernetes has Jobs and CronJobs. W7S maps the small-app cases to [backend queues](/docs/backend-queues/), [backend schedules](/docs/backend-schedules/), and [backend workflows](/docs/backend-workflows/). That means the team can express async work as app behavior instead of maintaining queue workers, job manifests, schedule objects, service accounts, and cluster-level operational policy for every small service.

State also moves from infrastructure objects to app bindings. Kubernetes can support persistent volumes, operators, and external managed databases, but that usually creates more platform decisions. W7S [storage bindings](/docs/storage-bindings/) and [serverless database](/docs/serverless-database/) give a smaller default: declare the app resource, let the platform provision it per repository and environment, and keep the runtime access path in code.

The replacement claim should stay precise. W7S is not trying to run arbitrary containers, service meshes, custom controllers, or cluster-native workloads. It is a replacement for the recurring case where Kubernetes is being used as a deploy substrate for an app that could be static assets, request handlers, managed bindings, queues, schedules, and workflows.

This is not "Kubernetes is bad." It is "do not turn every small app into a cluster-management problem."

## Containers Become Native Backends

Kubernetes runs containers. That is the right abstraction when the application needs arbitrary runtimes, process managers, system packages, sidecars, or long-running daemons.

W7S native backends use a narrower contract:

```ts title="backend/index.ts"
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ok: true});
    }

    return new Response("Not found", {status: 404});
  }
};
```

The benefit is that the app no longer owns:

- container images;
- pod specs;
- service selectors;
- ingress resources;
- health probes;
- horizontal autoscaling config;
- node scheduling concerns.

If the app fits the backend handler model, that missing surface is a feature.

## Services Become Repository Routes

Kubernetes separates pods from Services and exposes traffic through Service and Ingress resources.

W7S uses repository identity:

```text
https://acme.w7s.cloud/checkout/
https://feature-payments--acme.w7s.cloud/checkout/
```

Internal service calls use Backend RPC:

```ts title="backend/auth.ts"
const response = await env.W7S_RPC.fetch(
  "https://w7s.internal/api/v1/rpc/acme/auth/session",
  {
    headers: {
      authorization: `Bearer ${env.W7S_RPC_TOKEN}`
    }
  }
);
```

That is not as general as Kubernetes networking, but it is enough for many HTTP-shaped app systems. The service boundary is the repository.

## ConfigMaps and Secrets Move to the Deploy Contract

Kubernetes uses ConfigMaps and Secrets as API objects. W7S keeps common app configuration in the repository and GitHub workflow:

```json title="w7s.json"
{
  "vars": ["PUBLIC_API_ORIGIN"],
  "secrets": ["STRIPE_SECRET_KEY"]
}
```

```yaml title=".github/workflows/deploy.yml"
- uses: w7s-io/w7s-cloud@v1
  env:
    PUBLIC_API_ORIGIN: ${{ vars.PUBLIC_API_ORIGIN }}
    STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
  with:
    token: ${{ github.token }}
```

The app reads values from `env`. Deploy summaries can count secrets without exposing secret values.

For dynamic product configuration, use KV or DB rather than redeploying platform config.

## Persistent Volumes Become App Storage Bindings

Kubernetes volumes are infrastructure-level storage. Many small apps need app-level storage instead:

- SQL rows;
- cache entries;
- uploaded files;
- per-entity durable state.

W7S declares those directly:

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
    "fs": ["FILES"],
    "durableObjects": [
      {
        "binding": "SESSION",
        "className": "Session"
      }
    ]
  }
}
```

This keeps storage at the level the application understands. A small app usually should not need to pick a storage class before it can save user settings.

## Jobs and CronJobs Become Queues, Schedules, and Workflows

Kubernetes Jobs and CronJobs are useful for containerized work. W7S maps app-level background work to platform primitives:

```json title="w7s.json"
{
  "queues": ["jobs"],
  "schedules": [
    {
      "cron": "0 * * * *",
      "path": "/_w7s/schedules/hourly"
    }
  ],
  "workflows": ["checkout"]
}
```

Use:

- queues for async work that can retry;
- schedules for time-based triggers;
- workflows for durable business processes with status.

This is less general than running any container as a job, but it fits the common app cases without introducing cluster resources.

## Operators Become Platform Provisioning

Kubernetes operators are powerful because they encode domain-specific operations into the cluster.

For small apps, many operator-like needs are common enough that W7S can own them:

- create a DB binding;
- apply SQL migrations;
- create a KV namespace;
- create a file bucket;
- wire a queue to a backend route;
- wire a schedule to a backend route;
- wire a workflow to a backend route;
- inject runtime bindings;
- account for usage by repository and environment.

The app declares intent in `w7s.json`; W7S handles the provisioning path.

That is not a replacement for custom operators. It is a replacement for needing operators before the app has operator-scale needs.

## GitHub Actions Replaces the Release Pipeline Layer

Kubernetes deploys often grow a release stack:

- image build;
- registry push;
- manifest render;
- Helm or Kustomize;
- kubectl apply;
- rollout status;
- environment promotion;
- secret management.

W7S keeps the default smaller:

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

For apps that fit the W7S runtime, this removes entire categories of release machinery.

## What Kubernetes Still Does Better

Use Kubernetes when the app or organization needs:

- arbitrary containers and languages;
- long-running processes;
- private cluster networking;
- service mesh behavior;
- custom controllers and operators;
- GPU workloads;
- stateful sets and storage classes;
- TCP or non-HTTP services;
- strict multi-tenant cluster policy;
- existing platform engineering built around Kubernetes;
- workloads that must run inside a specific VPC or cloud account.

Those needs are real. W7S should not pretend to cover them.

## Recommendation

Use W7S for small apps that can be:

- static assets;
- JavaScript/TypeScript native backends;
- managed storage bindings;
- queues, schedules, and workflows;
- GitHub Actions deploys;
- branch environments.

Use Kubernetes when the workload truly needs a cluster.

The mistake is not choosing Kubernetes. The mistake is choosing Kubernetes before the application has Kubernetes-shaped problems.
