---
id: security
title: Security
description: Security best practices for apps deployed on W7S, including tenant isolation, cookies, XSS, browser storage, uploads, and GitHub workflows.
---

This page is for developers deploying frontend and backend applications on W7S.

W7S Cloud serves organization deployments from `*.w7s.cloud`.

Each subdomain is a separate organization tenant. Tenants are mutually untrusted,
even though they share the same parent domain.

```text
w7s.cloud        marketing/root
<org>.w7s.cloud  organization tenant
```

Do not treat sibling subdomains as trusted. `acme.w7s.cloud` and
`example.w7s.cloud` belong to different GitHub organizations and must be handled
as separate security boundaries.

## Tenant isolation

Use the exact origin as the trust boundary:

```text
https://<org>.w7s.cloud
```

Avoid designs that rely on the shared parent domain:

- Do not use parent-domain cookies for auth.
- Do not trust requests because they came from another `*.w7s.cloud` subdomain.
- Do not share browser storage assumptions across tenants.
- Do not build authorization logic that accepts every `*.w7s.cloud` origin.
- Do not mix unrelated applications with different trust levels on the same
  tenant hostname unless they are designed to share the same users and storage.

If your application needs admin pages, API routes, previews, or uploads, prefer
tenant-owned paths:

```text
https://<org>.w7s.cloud/admin/
https://<org>.w7s.cloud/api/
```

For scriptable uploaded content, use a separate content domain when possible.

## Cookie leakage

Cookie leakage can happen when a cookie is scoped to the shared parent domain.

Avoid:

```http
Set-Cookie: session=...; Domain=.w7s.cloud; Path=/
Set-Cookie: session=...; Domain=w7s.cloud; Path=/
```

Those cookies can be sent to sibling tenant subdomains.

Use host-only cookies:

```http
Set-Cookie: session=...; Path=/; Secure; HttpOnly; SameSite=Lax
```

For session cookies and other sensitive browser state, prefer the `__Host-`
prefix:

```http
Set-Cookie: __Host-session=...; Path=/; Secure; HttpOnly; SameSite=Lax
```

`__Host-` cookies must be secure, must use `Path=/`, and must not include a
`Domain` attribute. That makes them bound to the exact tenant hostname.

## Cookie bombing

Cookie bombing happens when a browser sends too many or too-large cookies,
causing requests to exceed header limits or break your backend routes.

Best practices:

- Never set cookies for `.w7s.cloud`.
- Keep cookie values small.
- Reject oversized `Cookie` headers in your backend before doing expensive work.
- Keep an allowlist of expected cookie names when your app controls them.
- Log and investigate unusually large cookie headers or cookie counts.

Recommended backend check:

```js
const cookie = request.headers.get("cookie") || "";

if (cookie.length > 8 * 1024) {
  return new Response("Cookie header too large", { status: 431 });
}
```

If you can allowlist cookies, keep it small:

```text
__Host-session
__Host-csrf
tenant_pref
```

## XSS

Cross-site scripting usually comes from application code, not the hosting
platform. Treat all user input as untrusted.

Best practices:

- Escape output by default.
- Avoid direct HTML injection APIs.
- Sanitize user-provided HTML with a real sanitizer.
- Avoid scriptable uploads on authenticated app origins.
- Keep dependencies current.
- Review AI-generated code for unsafe HTML, markdown, redirects, and scripts.

Use a baseline Content Security Policy:

```http
Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

For existing apps, start with CSP report-only mode, review violations, then
enforce the policy.

If your backend returns HTML, set these headers from your backend response. If
your frontend is static, configure your framework or build output to send the
headers where supported.

## Storage poisoning

Browser storage is scoped to the exact origin, so these are separate:

```text
https://acme.w7s.cloud
https://example.w7s.cloud
```

The main risk is trusting browser storage too much or letting untrusted code run
on the same tenant origin.

Best practices:

- Treat `localStorage`, `sessionStorage`, and IndexedDB as user-controlled input.
- Validate and version stored values before using them.
- Do not store long-lived auth tokens in browser storage.
- Do not host mutually untrusted apps on the same tenant hostname.
- Clear or migrate old storage keys when changing auth or tenant behavior.

Prefer HttpOnly cookies for sessions:

```http
Set-Cookie: __Host-session=...; Path=/; Secure; HttpOnly; SameSite=Lax
```

## Origin and CSRF checks

If your app uses browser cookies, state-changing requests should validate the
request origin and CSRF token.

For mutating methods in your backend:

```js
const mutates = ["POST", "PUT", "PATCH", "DELETE"].includes(request.method);
const origin = request.headers.get("origin");
const expectedOrigin = new URL(request.url).origin;

if (mutates && origin && origin !== expectedOrigin) {
  return new Response("Invalid origin", { status: 403 });
}
```

Do not allow requests just because the origin ends in `.w7s.cloud`.

For automation APIs, prefer bearer tokens or signed requests instead of browser
cookies.

## Uploaded content

Uploaded files are risky when they can execute scripts or be interpreted as
HTML, SVG, JavaScript, or other active content.

Best practices:

- Serve untrusted uploaded content from a separate content domain when possible.
- Do not attach auth cookies to uploaded-content responses.
- Force downloads for risky MIME types.
- Use `X-Content-Type-Options: nosniff`.
- Use a restrictive CSP for content responses.
- Do not render user uploads inside privileged app pages unless sanitized.

## Secrets and GitHub workflows

W7S deploys from GitHub Actions, so repository and workflow security matter.

Best practices:

- Keep GitHub repository permissions tight.
- Use the least permissions needed in workflow `permissions`.
- Rotate exposed credentials immediately.
- Do not commit API keys, tokens, private keys, or production secrets.
- Review pull requests before deploying them to trusted environments.
- Keep dependency lockfiles and build scripts reviewable.

Minimal deploy permissions:

```yaml
permissions:
  contents: read
```

Only add broader permissions when a workflow needs them.

## Monitoring

Log security-relevant events from your application:

- attempts to set or use parent-domain cookies
- oversized `Cookie` headers
- excessive cookie counts
- CSP violations
- rejected XSS, injection, or unsafe upload attempts
- mutating requests with unexpected origins
- uploaded-content responses attempting to set cookies
- repeated auth failures
- unusual traffic spikes

These signals help detect tenant isolation problems, application bugs, abuse,
and misconfiguration before they become larger incidents.

## Checklist

Before treating a deployment as production-ready:

- Use host-only `__Host-` cookies for sessions.
- Do not set `Domain=.w7s.cloud` or `Domain=w7s.cloud`.
- Reject oversized cookie headers in backend routes.
- Add a CSP and `nosniff`.
- Validate exact origins on mutating browser requests.
- Use CSRF protection when browser cookies authorize writes.
- Keep auth tokens out of browser storage.
- Treat browser storage as untrusted.
- Isolate scriptable uploaded content.
- Review GitHub Actions permissions and secrets.
- Monitor security and abuse signals.
