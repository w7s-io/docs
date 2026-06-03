---
title: Security Best Practices for W7S Cloud Tenant Subdomains
description: How W7S treats organization subdomains as mutually untrusted tenants, and how to reduce cookie leakage, XSS, cookie bombing, and browser storage poisoning risk.
slug: w7s-cloud-security-best-practices
tags: [best-practices, security, cloud]
---

Every `*.w7s.cloud` subdomain is an organization tenant.

That detail matters. It means `acme.w7s.cloud` and `example.w7s.cloud` may both
run on W7S, but they belong to different GitHub organizations and must be
treated as mutually untrusted.

The parent domain is shared. The trust boundary is the exact tenant origin.

<!-- truncate -->

## The Tenant Model

W7S Cloud uses this model:

```text
w7s.cloud        marketing/root
<org>.w7s.cloud  mutually untrusted organization tenant
```

There is no shared `admin.w7s.cloud`, `api.w7s.cloud`, `app.w7s.cloud`, or
`uploads.w7s.cloud` inside the tenant wildcard namespace.

If W7S needs a privileged control plane, it should live outside the tenant
wildcard. If a tenant needs admin pages, API routes, previews, or uploads, those
should be modeled as tenant-owned paths or served from a separate content domain.

The key rule is simple:

> Never rely on the shared parent domain as a security boundary.

## Prevent Cookie Leakage

Do not set cookies for the parent domain:

```http
Set-Cookie: session=...; Domain=.w7s.cloud; Path=/
Set-Cookie: session=...; Domain=w7s.cloud; Path=/
```

A parent-domain cookie can be sent to sibling tenants. That is the wrong shape
for a platform where every organization subdomain is mutually untrusted.

Use host-only cookies instead:

```http
Set-Cookie: session=...; Path=/; Secure; HttpOnly; SameSite=Lax
```

For sensitive cookies, prefer the `__Host-` prefix:

```http
Set-Cookie: __Host-session=...; Path=/; Secure; HttpOnly; SameSite=Lax
```

`__Host-` cookies must be `Secure`, must use `Path=/`, and must not include a
`Domain` attribute. That makes them fit the tenant model because the cookie is
bound to the exact host that set it.

## Prevent Cookie Bombing

Cookie bombing happens when an attacker causes a browser to send too many or too
large cookies, often with the goal of exceeding request header limits or
disrupting another host on the same parent domain.

For W7S tenant subdomains, the first defense is the same as the cookie leakage
defense: do not allow parent-domain cookies for `w7s.cloud`.

Then add request limits at the edge:

```text
<org>.w7s.cloud: reject Cookie headers over 8 KB
```

When the platform controls cookie names, keep a small allowlist:

```text
__Host-session
__Host-csrf
tenant_pref
```

Requests with excessive cookie size or cookie count should be logged and
blocked before they reach tenant code.

## Prevent XSS

XSS is still primarily an application bug: unescaped output, unsafe HTML
injection, unsafe markdown rendering, scriptable uploads, or trusting input too
early.

The cloud layer should reduce blast radius with a baseline Content Security
Policy:

```http
Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

For existing apps, deploy CSP in report-only mode first, review violations, then
enforce it.

Cloudflare Managed WAF rules can help catch common payloads. Custom WAF rules
are useful for routes that process HTML, markdown, templates, redirects, or
query-heavy user input. WAF rules are a backstop, not a replacement for escaping
and sanitization in tenant code.

## Prevent Storage Poisoning

`localStorage`, `sessionStorage`, and IndexedDB are scoped to the browser origin.
That means these are separate:

```text
https://acme.w7s.cloud
https://example.w7s.cloud
```

The risk is not ordinary cross-tenant storage sharing. The risk is letting
untrusted code run on the same tenant origin, or trusting browser storage as if
it were server-authenticated data.

Use these rules:

- Do not host multiple GitHub organizations on the same tenant hostname.
- Do not store long-lived auth tokens in browser storage.
- Validate and version anything loaded from browser storage.
- Treat storage values as user-controlled input.
- Serve scriptable uploaded content from a separate content domain when possible.

If uploaded content must be served from a tenant origin, use a restrictive CSP,
avoid auth cookies on content responses, force downloads for risky MIME types,
and send `X-Content-Type-Options: nosniff`.

## Check Origins on Mutating Requests

When browser cookies are involved, state-changing requests should validate the
request origin.

At the edge or in application middleware:

```text
If method is POST, PUT, PATCH, or DELETE
and Origin is present
and Origin does not exactly match the tenant origin
then block.
```

Do not use "same parent domain" as an allow rule. In W7S Cloud, sibling
subdomains are different tenants.

For automation APIs, prefer bearer tokens or signed requests instead of browser
cookies.

## What W7S Enforces at the Edge

W7S Cloud removes `Set-Cookie` headers that try to scope cookies to the
configured base domain:

```http
Domain=.w7s.cloud
Domain=w7s.cloud
```

That protects against future tenant responses accidentally creating shared
parent-domain cookies. Tenants should still set their own cookies correctly with
host-only scope and the `__Host-` prefix for sensitive browser state.

## Operational Signals

Log and alert on:

- blocked parent-domain `Set-Cookie` attempts;
- large `Cookie` headers;
- excessive cookie counts;
- CSP violations;
- WAF XSS matches;
- state-changing requests with unexpected origins;
- tenant upload or content responses attempting to set cookies.

These events are useful because the platform security model depends on exact
tenant isolation. A tenant should not be able to affect authentication, storage,
routing, or request handling for another tenant.

## The Short Version

For `*.w7s.cloud`, assume every sibling subdomain is hostile.

Use host-only `__Host-` cookies, block parent-domain cookies, reject oversized
cookie headers, enforce CSP, validate exact origins on mutating requests, and
keep scriptable uploaded content away from authenticated tenant origins.

That combination prevents the common cross-subdomain failure modes: cookie
leakage, XSS blast radius expansion, cookie bombing, and storage poisoning.
