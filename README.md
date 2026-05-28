# W7S Docs

Public documentation for W7S, the open source platform that powers `w7s.cloud`.

## Development

```sh
npm install
npm install --prefix landing --no-package-lock --legacy-peer-deps
npm run start
```

## Build

```sh
npm run check
```

The build output is deployed through W7S from the `build/` directory. The site is available at:

- `https://w7s-io.w7s.cloud/docs/`
- `https://www.w7s.io/`
- `https://www.w7s.io/docs/`
- `https://w7s.io/` redirects to `https://www.w7s.io/`

## Deployment

This site is deployed by the same W7S GitHub Actions workflow shown in the docs. The workflow installs dependencies, builds Docusaurus under `/docs/`, builds the landing frontend from `landing/` for `/`, then deploys the repo with `w7s-io/w7s-cloud@v1`. The docs also describe self-hosting W7S, W7S storage bindings, stateful objects, managed Postgres bindings, vars, secrets, backend-to-backend RPC, backend queues, backend schedules, usage accounting, platform event analytics, and backend logs.

The custom domains are declared in `static/CNAME`:

```text
www.w7s.io
w7s.io
```

The small backend in `backend/index.ts` redirects the apex `w7s.io` host to `www.w7s.io`. Requests for `www.w7s.io` return 404 from the backend so W7S can serve the generated static frontend at `/` and the docs at `/docs/`.
