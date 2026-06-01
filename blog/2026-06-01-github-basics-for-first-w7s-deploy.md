---
title: GitHub Basics for Your First W7S Deploy
description: A beginner-friendly path from no GitHub experience to a repository that can deploy with W7S.
slug: github-basics-for-first-w7s-deploy
tags: [beginners, github, workflow]
---

You do not need to become a Git expert before deploying to W7S.

You do need one basic idea: GitHub should become the home of the project, not just a place you visit after the project is finished.

Once the project is in GitHub, W7S can deploy it from GitHub Actions.

<!-- truncate -->

## The Pieces

There are only a few concepts to learn first:

| Word | Meaning |
| --- | --- |
| Repository | The project folder on GitHub |
| Commit | A saved checkpoint |
| Branch | A line of work, usually starting with `main` |
| Push | Sending local commits to GitHub |
| GitHub Actions | Automation that runs from the repository |
| Workflow | A YAML file that tells GitHub Actions what to do |

W7S uses those pieces instead of asking you to recreate the project in a separate dashboard.

## Start With the Web UI

If the command line is still unfamiliar, start in the GitHub website:

1. Create a GitHub account.
2. Create a new repository.
3. Choose a short repository name, such as `portfolio` or `landing-page`.
4. Upload your `index.html`, CSS, JavaScript, images, and other files.
5. Commit the upload to the `main` branch.

At this point, the project has a permanent home and a first checkpoint.

## Add a W7S Workflow

In the repository, create this file:

```text title=".github/workflows/deploy.yml"
.github/
  workflows/
    deploy.yml
```

Paste this workflow:

```yaml title=".github/workflows/deploy.yml"
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

Commit the file.

The next push to `main` runs the workflow. You can also run it manually with `workflow_dispatch` from the Actions tab.

## If Your Project Has a Build Step

Some projects are not plain HTML. React, Vite, Astro, Docusaurus, and similar tools usually need dependencies installed and a build command run first.

The workflow becomes:

```yaml title=".github/workflows/deploy.yml"
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
      - uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: w7s-io/w7s-cloud@v1
        with:
          token: ${{ github.token }}
```

This says: check out the code, install Node, install dependencies, build the project, then deploy.

## What You Learn

This path teaches enough GitHub to be productive:

- where the project lives;
- how to save a change;
- where deploy automation runs;
- how to see whether a deploy failed;
- how to change the build later.

That is the ramp. You can learn branches, pull requests, issues, and command-line Git after the first successful deploy.

## Sources

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [GitHub quickstart](https://docs.github.com/en/get-started/start-your-journey/hello-world)
- [Deploy From GitHub](/docs/deploy-from-github/)
