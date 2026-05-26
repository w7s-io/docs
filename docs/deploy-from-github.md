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

on:
  push:
    branches:
      - main
  workflow_dispatch:

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
Push and manual runs deploy the repo. For a separate daily workflow that checks quota and free-tier limits without deploying, see [Recommendations](./recommendations.md).

If the repo contains `w7s.json`, the action also collects declared `vars` and `secrets` from the workflow environment and passes them as Worker bindings.

After a successful deploy, the action checks that repo's W7S usage for the deployed day. If any daily soft limits are near or over the effective policy, it adds a warning section to the GitHub Actions summary and opens or updates a single GitHub issue for that repo/environment. These warnings are advisory; W7S does not block traffic from them today.

`issues: write` is only used for W7S usage warning issues. If you want summary-only warnings, remove that permission and set:

```yaml
- uses: w7s-io/w7s-cloud@v1
  with:
    token: ${{ github.token }}
    usage-warnings-issue: false
```

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

## Pass runtime values

Declare values in `w7s.json`:

```json
{
  "vars": ["PUBLIC_API_KEY"],
  "secrets": ["PRIVATE_API_KEY"]
}
```

Then expose them to the deploy step:

```yaml
- uses: w7s-io/w7s-cloud@v1
  env:
    PUBLIC_API_KEY: ${{ vars.PUBLIC_API_KEY }}
    PRIVATE_API_KEY: ${{ secrets.PRIVATE_API_KEY }}
  with:
    token: ${{ github.token }}
```
