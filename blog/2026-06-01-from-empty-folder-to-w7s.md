---
title: From Empty Folder to W7S Deploy
description: Start from scratch with a tiny website, put it in GitHub, and deploy it to W7S with GitHub Actions.
slug: from-empty-folder-to-w7s
tags: [beginners, github, deploys]
---

This is the smallest useful path from nothing to a W7S deploy.

You will create a tiny site, put it in GitHub, and let GitHub Actions deploy it.

<!-- truncate -->

## Create the Project

Make a new folder named `hello-w7s`.

Inside it, create `index.html`:

```html title="index.html"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hello W7S</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <main>
      <h1>Hello W7S</h1>
      <p>This page deploys from GitHub Actions.</p>
    </main>
  </body>
</html>
```

Create `style.css`:

```css title="style.css"
:root {
  color-scheme: dark;
  font-family: system-ui, sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0a0a0a;
  color: #fafafa;
}

main {
  max-width: 42rem;
  padding: 2rem;
}
```

Open `index.html` in a browser. If it looks right locally, it is ready to put in GitHub.

## Put It in GitHub

Create a new repository named `hello-w7s`.

If you are using the GitHub website, upload both files and commit them to `main`.

If you are using the command line:

```bash
git init
git add index.html style.css
git commit -m "Create first page"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/hello-w7s.git
git push -u origin main
```

Replace `YOUR_NAME` with your GitHub username or organization.

## Add the Deploy Workflow

Create `.github/workflows/deploy.yml`:

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

Commit and push that file.

GitHub Actions runs the deploy. W7S receives the repository archive and publishes the app.

## Keep Going

After the first deploy, the daily workflow is simple:

1. Edit files.
2. Commit the change.
3. Push to `main`.
4. Let GitHub Actions deploy.

That loop is more useful than a one-time folder upload because every deploy comes from a saved checkpoint.

## Next Steps

Once the static page works, you can add:

- a frontend build step;
- a backend route in `backend/index.ts`;
- a custom domain with [`CNAME`](https://w7s.io/docs/custom-domains/);
- storage bindings with `w7s.json`;
- branch deploys for experiments.

The first deploy should stay small. The point is to get the repository, workflow, and W7S URL working before adding complexity.

## Sources

- [GitHub quickstart](https://docs.github.com/en/get-started/start-your-journey/hello-world)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Deploy From GitHub](/docs/deploy-from-github/)
- [Project Layouts](/docs/project-layouts/)
