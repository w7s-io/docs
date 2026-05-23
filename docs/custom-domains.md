---
id: custom-domains
title: Custom Domains
description: Serve a W7S deployment from your own hostname.
---

Add a `CNAME` file to claim a custom hostname for a deployment.

```text title="CNAME"
community.w7s.io
```

W7S reads `CNAME` from the deployed archive. Common locations include:

```text
CNAME
frontend/CNAME
frontend/dist/CNAME
dist/CNAME
build/CNAME
out/CNAME
```

## DNS

Create DNS for the hostname and point it at W7S.

For a subdomain, create a proxied CNAME:

```text
Type: CNAME
Name: docs
Target: w7s.cloud
Proxy: enabled
```

## TXT security allowlist

The first custom-domain claim can work without TXT verification. W7S still recommends adding a TXT record to restrict future claims.

For a host under `w7s.io`, add:

```text
Type: TXT
Name: _w7s.w7s.io
Value: w7s-io/docs
```

TXT values can list owners or exact repositories:

```text
w7s-io
w7s-io/docs
w7s-io/docs,guerrerocarlos
```

If multiple repositories try to claim the same hostname, the TXT allowlist decides which repository is allowed.
