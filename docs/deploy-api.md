---
id: deploy-api
title: Deploy API
description: Low-level deploy API used by the W7S GitHub Action.
---

Most users should deploy with `w7s-io/w7s-cloud@v1`. The deploy action calls the W7S deploy API.

## Endpoint

```text
POST https://w7s.cloud/api/v1/deploy
```

The request body is a zip archive.

## Headers

```text
Authorization: Bearer <github-token>
x-github-repository: owner/repo
x-github-sha: <commit-sha>
x-github-branch: <branch-name>
content-type: application/zip
```

`application/octet-stream` is also accepted.

Optional runtime value headers are base64url-encoded JSON objects:

```text
x-w7s-vars: <base64url-json-object>
x-w7s-secrets: <base64url-json-object>
```

The official GitHub Action writes these headers from `w7s.json` and the workflow environment.

## Authentication

W7S checks the token against GitHub:

```text
GET https://api.github.com/repos/owner/repo
Authorization: Bearer <github-token>
```

If GitHub returns `401`, `403`, or `404`, W7S rejects the deploy.

## Environments

By default:

- `main` and `master` deploy to `production`.
- Other branches deploy to a sanitized branch environment.

Production deployments are served from the owner host:

```text
https://<owner>.w7s.cloud/<repo>/
```

Non-production branch deployments are served from a branch-prefixed host:

```text
https://<branch-name>--<owner>.w7s.cloud/<repo>/
```

The branch name in the hostname is sanitized for DNS. For example, `feature/login` becomes:

```text
https://feature-login--owner.w7s.cloud/repo/
```

You can override the environment with either:

```text
?environment=staging
x-w7s-environment: staging
```
