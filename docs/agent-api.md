---
title: Agent API
description: Inspect W7S deployments, resources, routes, observability links, and safe next actions through a read-only agent-facing API.
---

The W7S Agent API is a read-only surface for AI agents and automation that need to understand a repository's deployed infrastructure.

Agents can use it to answer questions like:

- what environments are deployed;
- which URLs and custom domains are active;
- which static and backend targets exist;
- which storage bindings, queues, schedules, workflows, RPC, and AI bindings are declared;
- where to read usage, limits, analytics, and logs;
- what repository changes should be proposed next.

The API does not mutate infrastructure. To change infrastructure, update `w7s.json` in the repository and redeploy through GitHub Actions.

## Discovery

Public discovery documents:

```text
GET https://w7s.cloud/agent.json
GET https://w7s.cloud/.well-known/agent.json
GET https://w7s.cloud/api/v1/agent/openapi.json
GET https://w7s.cloud/api/v1/agent/manifest-schema
```

`agent.json` describes the W7S service, GitHub OIDC authentication, read-only actions, endpoint templates, and docs links.

## Authentication

Repository-scoped endpoints use GitHub repository access:

```text
Authorization: Bearer <github-actions-oidc-token>
```

The token must be authorized for the requested `<owner>/<repo>`.

## Repository State

Read consolidated infrastructure state:

```text
GET https://w7s.cloud/api/v1/agent/repos/<owner>/<repo>?environment=production
```

Drill down:

```text
GET https://w7s.cloud/api/v1/agent/repos/<owner>/<repo>/deployments
GET https://w7s.cloud/api/v1/agent/repos/<owner>/<repo>/resources?environment=production
GET https://w7s.cloud/api/v1/agent/repos/<owner>/<repo>/routes?environment=production
```

Example:

```sh
curl "https://w7s.cloud/api/v1/agent/repos/w7s-io/demo?environment=production" \
  -H "Authorization: Bearer $GITHUB_ACTIONS_OIDC_TOKEN"
```

The response intentionally omits binding bearer token hashes, secret values, Cloudflare API tokens, and W7S operator credentials.

## Agent Workflow

Use the Agent API as the inspection step:

1. Read `agent.json`.
2. Inspect the repo state endpoint.
3. If changes are needed, edit `w7s.json` and app files in GitHub.
4. Redeploy through the normal W7S GitHub Actions workflow.
5. Re-read the Agent API state to verify the deployed infrastructure.
