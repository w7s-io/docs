---
id: urls-and-routing
title: URLs And Routing
description: How W7S maps GitHub repositories to public URLs.
---

W7S maps GitHub repositories to public URLs on `w7s.cloud`.

## Repository paths

A repository named:

```text
github.com/owner/repo
```

is served at:

```text
https://owner.w7s.cloud/repo/
```

Example:

```text
https://w7s-io.w7s.cloud/docs/
```

## Branch environments

`main` and `master` deploy to `production`, which uses the owner host. Other branches deploy to a branch environment and use a branch-prefixed host:

```text
https://<branch-environment>--owner.w7s.cloud/repo/
```

The branch environment is DNS-safe. W7S lowercases the branch name, replaces runs of characters outside `a-z`, `0-9`, and `-` with `-`, collapses repeated hyphens, trims leading/trailing hyphens, and caps the result at 63 characters. For example:

```text
feature/API.v2_test -> feature-api-v2-test
https://feature-api-v2-test--owner.w7s.cloud/repo/
```

## Owner roots

If the repository has the same name as the owner:

```text
github.com/owner/owner
```

it can serve the owner root:

```text
https://owner.w7s.cloud/
```

This is useful for personal or organization homepages.

## Missing routes

When W7S cannot find a deployment for a requested owner or repository path, it shows a deploy help page with the exact GitHub repository needed for that URL.

For example:

```text
https://sadasant.w7s.cloud/example/
```

points at:

```text
https://github.com/sadasant/example
```

## Custom-domain only routing

If your deployment has a [`CNAME`](https://w7s.io/docs/custom-domains/) custom domain, you can disable the default
`w7s.cloud` route:

```json title="w7s.json"
{
  "routing": {
    "defaultDomain": false
  }
}
```

When this is set, the deployment only serves through custom domains declared in
[`CNAME`](https://w7s.io/docs/custom-domains/). The deploy fails if no custom domain attaches successfully.

Use this when a production app should have one canonical origin, such as:

```text
https://app.example.com/
```

instead of also being reachable at:

```text
https://owner.w7s.cloud/repo/
```
