---
id: custom-domains
title: Custom Domains
description: Serve a W7S deployment from your own hostname.
---

Add a [`CNAME`](https://w7s.io/docs/custom-domains/) file to claim one or more custom hostnames for a `main` branch deployment.

```text title="CNAME"
fullstack-example.w7s.io
www.fullstack-example.w7s.io
```

W7S reads [`CNAME`](https://w7s.io/docs/custom-domains/) from the deployed archive only when the GitHub branch is `main`. Non-`main` branch deploys ignore `CNAME` declarations and continue to use their default W7S branch URL. Common locations include:

```text
CNAME
frontend/CNAME
frontend/dist/CNAME
dist/CNAME
build/CNAME
out/CNAME
```

## DNS

Create DNS for each hostname and point it at W7S.

For a subdomain, create a proxied [CNAME](https://w7s.io/docs/custom-domains/):

```text
Type: CNAME
Name: fullstack-example
Target: w7w.cloud
Proxy: enabled
```

## TXT security allowlist

The first custom-domain claim can work without TXT verification. W7S still recommends adding a TXT record to restrict future claims.

For a host under `w7s.io`, add:

```text
Type: TXT
Name: _w7s.w7s.io
Value: w7s-io/example-fullstack-ts
```

TXT values can list owners or exact repositories:

```text
w7s-io
w7s-io/docs
w7s-io/docs,guerrerocarlos
```

If multiple repositories try to claim the same hostname, the TXT allowlist decides which repository is allowed.

## Custom-domain only

By default, W7S serves a `main` branch deployment from both its default `w7s.cloud` URL and
any custom domain declared in [`CNAME`](https://w7s.io/docs/custom-domains/).

For production apps that should only be reachable from your own hostname, add
`routing.defaultDomain=false` to `w7s.json`:

```json title="w7s.json"
{
  "routing": {
    "defaultDomain": false
  }
}
```

With this setting on `main`, the deployment must include a [`CNAME`](https://w7s.io/docs/custom-domains/) file and at least one
custom domain must attach successfully. Requests to the default `w7s.cloud` URL
will behave as if the deployment is not present. Non-`main` branch deploys ignore
`CNAME` and remain reachable from their default branch URL.

This is recommended when you want one canonical origin for cookies, browser
storage, CSP, redirects, and application security policy.
