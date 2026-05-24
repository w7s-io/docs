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

## Deployment

This documentation site is deployed by the same W7S GitHub Actions workflow shown in the docs. The workflow installs dependencies, builds Docusaurus, then deploys the repo with `w7s-io/w7s-cloud@v1`.

The custom domain is declared in `static/CNAME`:

```text
community.w7s.io
```
