# W7S Docs

Public documentation for W7S, the open source platform that powers `w7s.cloud`.

## Development

```sh
npm install
npm run start
```

## Build

```sh
npm run check
```

The build output is deployed through W7S from the `build/` directory. The site is available at:

- `https://w7s-io.w7s.cloud/docs/`
- `https://community.w7s.io/docs/`
- `https://w7s.io/` redirects to `https://community.w7s.io/docs/`
- `https://www.w7s.io/` redirects to `https://community.w7s.io/docs/`

## Deployment

This documentation site is deployed by the same W7S GitHub Actions workflow shown in the docs. The workflow installs dependencies, builds Docusaurus, then deploys the repo with `w7s-io/w7s-cloud@v1`. The docs also describe W7S storage bindings for KV, R2, D1, vars, and secrets.

The custom domains are declared in `static/CNAME`:

```text
community.w7s.io
w7s.io
www.w7s.io
```

The small backend in `backend/index.ts` redirects the apex `w7s.io` hosts to the canonical community docs URL while the generated static docs continue to serve from `community.w7s.io/docs/`.
