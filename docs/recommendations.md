---
id: recommendations
title: Recommendations
description: Recommended operational workflows for W7S apps.
---

## Daily quota check

Add a separate GitHub Actions workflow that runs once per day to check W7S usage limits without deploying the app.

Create `.github/workflows/w7s-usage-check.yml`:

```yaml
name: W7S Usage Check

on:
  workflow_dispatch:
  schedule:
    - cron: "17 9 * * *"

permissions:
  id-token: write
  contents: read
  issues: write

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: w7s-io/w7s-cloud@v1
        with:
          usage-check-only: true
```

This workflow does not check out the repo, install dependencies, build, package, or deploy. It only asks W7S for the current day's usage for the repository, including hourly platform-synced direct resource usage when available.

If the app is near or over a quota or free-tier limit, or W7S has suspended the app until the next UTC day, `w7s-io/w7s-cloud@v1` writes a GitHub Actions summary and opens or updates one GitHub issue for the repo/environment.

`issues: write` is only needed so the workflow can create or update that warning issue.

For non-production environments, pass the W7S environment explicitly:

```yaml
- uses: w7s-io/w7s-cloud@v1
  with:
    usage-check-only: true
    environment: staging
```

Explicit environment values use the same DNS-safe normalization as branch deployments.

See [Usage Accounting](./usage-accounting.md) for the tracked metrics, current limits, and hard enforcement behavior.

## Best practices

Keep deploy workflows simple: check out the repository before `w7s-io/w7s-cloud@v1` so push and manual runs always upload the current app archive.

For scheduled quota checks, use a separate workflow with `usage-check-only: true` and omit `actions/checkout`. That workflow does not package or deploy the repo, so it does not need source files and should not include `if: github.event_name != 'schedule'` in the main deploy workflow.
