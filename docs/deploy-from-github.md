---
id: deploy-from-github
title: Deploy From GitHub
description: Deploy a repository to W7S with GitHub Actions.
---

W7S deploys are authorized with GitHub Actions OIDC. If the workflow can request an OIDC token for the repository, it can deploy that repository to W7S without a separate W7S API key.

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
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - uses: w7s-io/w7s-cloud@v1
```

The action packages the repository, sends it to `https://w7s.cloud/api/v1/deploy`, and includes the repository, branch, and commit metadata.
Push and manual runs deploy the repo. For a separate daily workflow that checks quota and free-tier limits without deploying, see [Recommendations](./recommendations.md).

By default, pushes from `main` and `master` deploy to the `production` environment. Pushes from other branches deploy to a branch environment and are served from `https://<branch-environment>--<owner>.w7s.cloud/<repo>/`. W7S lowercases the branch name, replaces runs of characters outside `a-z`, `0-9`, and `-` with `-`, collapses repeated hyphens, trims leading/trailing hyphens, and caps the result at 63 characters. For example, `feature/API.v2_test` becomes `feature-api-v2-test`.

If the repo contains `w7s.json`, the action also collects declared `vars` and `secrets` from the workflow environment and passes them as backend bindings.

After a successful deploy, the action checks that repo's W7S usage for the deployed day. If any daily limits are near or over the effective policy, or W7S has suspended the app after hourly platform usage sync, it adds a warning section to the GitHub Actions summary and opens or updates a single GitHub issue for that repo/environment. Requests that would exceed a daily limit return HTTP `429`.

`issues: write` is only used for W7S usage warning issues. If you want summary-only warnings, remove that permission and set:

```yaml
- uses: w7s-io/w7s-cloud@v1
  with:
    usage-warnings-issue: false
```

## Telegram notifications

The W7S Telegram bot can tell you the `telegram-chat-id` to add to the deploy action. Start a chat with the bot and send `/start`; it replies with copyable code blocks for the chat id and a complete workflow example.

The reply looks like this:

````text
W7S Telegram notifications

Use this chat id in your GitHub Actions workflow:

```
telegram-chat-id: "123456789"
```

Example:

```
name: Deploy
on:
  push:
  workflow_dispatch:
permissions:
  id-token: write
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: w7s-io/w7s-cloud@v1
        with:
          telegram-chat-id: "123456789"
          telegram-events: deploy_success,deploy_warning,deploy_error,app_suspended,payment_request
```
````

Add that chat id to the deploy step:

```yaml
- uses: w7s-io/w7s-cloud@v1
  with:
    telegram-chat-id: "123456789"
    telegram-events: deploy_success,deploy_warning,deploy_error,app_suspended,payment_request
```

W7S links the chat id to the repo/environment after a successful authenticated deploy. That lets W7S send deploy notifications, app suspension alerts, and future payment-request notifications for that repo.

## Build before deploy

W7S does not run your app build for you. Build in GitHub Actions before calling the W7S action.

Example for a frontend that builds to `dist/`:

```yaml
steps:
  - uses: actions/checkout@v5
  - uses: actions/setup-node@v6
    with:
      node-version: 22
      cache: npm
  - run: npm ci
  - run: npm run build
  - uses: w7s-io/w7s-cloud@v1
```

## Deploy a subdirectory

If your deployable output lives in a staging directory, use `working-directory`:

```yaml
- uses: w7s-io/w7s-cloud@v1
  with:
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
```

W7S exposes those names on the backend `env` object:

```ts title="backend/index.ts"
type Env = {
  PUBLIC_API_KEY?: string;
  PRIVATE_API_KEY?: string;
};

export default {
  async fetch(_request: Request, env: Env): Promise<Response> {
    const response = await fetch("https://api.example.com/data", {
      headers: {
        "x-api-key": env.PRIVATE_API_KEY ?? ""
      }
    });

    return Response.json({
      publicApiKeyConfigured: Boolean(env.PUBLIC_API_KEY),
      privateApiKeyConfigured: Boolean(env.PRIVATE_API_KEY),
      upstreamOk: response.ok
    });
  }
};
```

The property names match the entries in `vars` and `secrets`. Secrets are available to backend code, but should not be returned to browsers or logs.
