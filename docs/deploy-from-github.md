---
id: deploy-from-github
title: Deploy From GitHub
description: Deploy a repository to W7S with GitHub Actions.
---

W7S deploys are authorized with the repository's GitHub token. If the workflow token can read the repository, it can deploy that repository to W7S.

## Add the workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on: push

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - uses: w7s-io/w7s-cloud@v1
        with:
          token: ${{ github.token }}
```

The action packages the repository, sends it to `https://w7s.cloud/api/v1/deploy`, and includes the repository, branch, and commit metadata.

## Build before deploy

W7S does not run your app build for you. Build in GitHub Actions before calling the W7S action.

Example for a frontend that builds to `dist/`:

```yaml
steps:
  - uses: actions/checkout@v5
  - uses: actions/setup-node@v4
    with:
      node-version: 22
      cache: npm
  - run: npm ci
  - run: npm run build
  - uses: w7s-io/w7s-cloud@v1
    with:
      token: ${{ github.token }}
```

## Deploy a subdirectory

If your deployable output lives in a staging directory, use `working-directory`:

```yaml
- uses: w7s-io/w7s-cloud@v1
  with:
    token: ${{ github.token }}
    working-directory: build
```

This is useful for static documentation sites and other generated artifacts.
