---
id: custom-domains
title: Custom Domains
description: Serve a W7S deployment from your own hostname.
---

Add a [`CNAME`](https://w7s.io/docs/custom-domains/) file to claim one or more custom hostnames or hostname paths for a deployment.

```text title="CNAME"
fullstack-example.w7s.io
www.fullstack-example.w7s.io
omattic.com/compress-video
```

W7S reads [`CNAME`](https://w7s.io/docs/custom-domains/) from the deployed archive. The `main` branch uses the declared hostname exactly. Non-`main` branches prefix the sanitized branch name to the first label, so branch `dev` with `app.example.com` attaches `dev--app.example.com`.

You can also attach a deployment under a path on an existing hostname:

```text title="CNAME"
omattic.com/compress-video
```

For path routes, W7S routes requests that start with the declared path prefix and strips that prefix before dispatching to the app. A request for `https://omattic.com/compress-video/assets/app.js` reaches the deployment as `/assets/app.js`. Build frontend apps with the matching base path, such as `/compress-video/`, so browser asset URLs still point at the mounted public path.

DNS still has to resolve each exact hostname you want to use, including branch-prefixed hostnames. Common locations include:

```text
CNAME
frontend/CNAME
frontend/dist/CNAME
dist/CNAME
build/CNAME
out/CNAME
```

## DNS

Create DNS for each hostname and point it at W7S. Path routes reuse the hostname DNS record; the path is handled by W7S routing.

For a subdomain, create a proxied [CNAME](https://w7s.io/docs/custom-domains/):

```text
Type: CNAME
Name: fullstack-example
Target: w7w.cloud
Proxy: enabled
```

For a branch custom domain, create the branch-prefixed DNS record too:

```text
Type: CNAME
Name: dev--fullstack-example
Target: w7w.cloud
Proxy: enabled
```

For a path route such as `omattic.com/compress-video`, point only the hostname at W7S:

```text
Type: CNAME
Name: @
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

By default, W7S serves a deployment from both its default `w7s.cloud` URL and
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

With this setting, the deployment must include a [`CNAME`](https://w7s.io/docs/custom-domains/) file and at least one
custom domain must attach successfully. Requests to the default `w7s.cloud` URL
will behave as if the deployment is not present.

This is recommended when you want one canonical origin for cookies, browser
storage, CSP, redirects, and application security policy.
