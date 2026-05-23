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
