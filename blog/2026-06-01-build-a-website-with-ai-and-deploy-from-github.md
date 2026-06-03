---
title: "How to Build a Website With AI and Deploy It From GitHub"
description: A practical workflow for using AI to create a website, putting the files in GitHub, and deploying the result with W7S.
slug: build-a-website-with-ai-and-deploy-from-github
tags: [ai, github, deploys, tutorials]
---

AI can create the first version of a website.

GitHub can keep the project.

W7S can deploy it.

That three-part workflow is simple enough for a first site and durable enough to grow into a real app.

<!-- truncate -->

## Step 1: Generate the First Version

Start with the tool that matches how you work:

- use Lovable, Bolt.new, Emergent, Cloudflare Build, or W7S Build for prompt-to-site creation;
- use Cursor if you want to work inside an editor;
- use Claude Code if you want an agent to modify an existing folder;
- use Replit Agent if you want an AI-assisted cloud IDE.

Ask for a small site first:

```text
Create a clean five-page website for a local bookkeeping business.
Pages: Home, Services, Pricing, About, Contact.
Use plain HTML, CSS, and JavaScript. Keep the files simple and easy to edit.
```

The first version should be boring on purpose. A simple site is easier to deploy and improve.

## Step 2: Check the Files

Before deployment, confirm the project has a clear shape:

```text
index.html
style.css
script.js
assets/
```

For a framework project, confirm the build command and output directory:

```text
package.json
src/
dist/
```

If the AI generated secrets, fake API keys, or private data, remove them before committing.

## Step 3: Put It in GitHub

Create a repository and commit the files.

The repository is the handoff from AI-generated output to maintainable project.

Once it is in GitHub:

- every change has history;
- another person can review it;
- the deploy workflow is visible;
- the project can move between tools.

## Step 4: Deploy With W7S

Now add the deploy file. This is the part that is easy to miss if you are new to GitHub.

In the root of the repository, create this folder path:

```text
.github/workflows/
```

Then create this file inside it:

```text
deploy.yml
```

The final path should look like this:

```text
your-repo/
  .github/
    workflows/
      deploy.yml
```

GitHub Actions automatically looks inside `.github/workflows/` for automation files. W7S documents this setup in [Deploy From GitHub](/docs/deploy-from-github/). Paste this into `.github/workflows/deploy.yml`:

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

Commit the file and push to `main`. GitHub will open an Actions run, check out your repository, and call W7S. You can also run it manually from the GitHub Actions tab because the workflow includes `workflow_dispatch`.

For a Node or framework build, add install and build steps before the deploy action. W7S does not guess your build command; GitHub Actions should build the site first. See [Build before deploy](/docs/deploy-from-github/#build-before-deploy) and [Project Layouts](/docs/project-layouts/) for the output folders W7S can deploy.

```yaml title=".github/workflows/deploy.yml"
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

## Step 5: Open the W7S URL

After the workflow succeeds, W7S serves the website from a URL based on the GitHub repo.

If your repository is:

```text
github.com/acme/bookkeeping
```

and you deploy from `main` or `master`, the live site is:

```text
https://acme.w7s.cloud/bookkeeping/
```

If you deploy from a branch, W7S creates a branch environment. A branch named `feature/contact-form` becomes `feature-contact-form`, so the branch URL is:

```text
https://feature-contact-form--acme.w7s.cloud/bookkeeping/
```

If your GitHub owner and repo have the same name, such as `github.com/acme/acme`, the repo can serve the owner root:

```text
https://acme.w7s.cloud/
```

The full mapping is in [URLs And Routing](/docs/urls-and-routing/). If the deploy fails because W7S cannot find a deployable frontend, check [Project Layouts](/docs/project-layouts/) and make sure the built site is in a supported output folder such as `dist/`, `build/`, or `out/`.

## Step 6: Add Your Own Domain

The `w7s.cloud` URL is enough to test and share the site. For a production business site, use your own hostname.

Add a [`CNAME`](https://w7s.io/docs/custom-domains/) file to the site output:

```text title="CNAME"
www.example.com
```

If your framework builds into `dist/`, the file can be `dist/CNAME`. If it builds into `build/`, it can be `build/CNAME`. W7S also checks the repository root and common frontend output folders.

Then create DNS:

```text
Type: CNAME
Name: www
Target: w7w.cloud
Proxy: enabled
```

For a safer long-term setup, add a TXT allowlist that says which GitHub owner or repository can claim the hostname:

```text
Type: TXT
Name: _w7s.example.com
Value: acme/bookkeeping
```

Follow [Custom Domains](/docs/custom-domains/) for the complete DNS setup.

This is also the point where the project can grow. A first AI site may only need static files, but the same GitHub-first workflow can later deploy JavaScript or TypeScript backend routes, runtime values, storage bindings, queues, schedules, workflows, logs, usage checks, and custom domains. Use [Project Layouts](/docs/project-layouts/) when the file structure changes.

## Step 7: Improve for SEO

After the first deploy, improve the parts search engines and customers actually read:

- unique title and description for every page;
- service-specific pages;
- local landing pages where appropriate;
- real contact information;
- fast-loading images;
- internal links;
- FAQs;
- testimonials or proof;
- schema markup when useful.

AI can help draft these improvements, but the repository should keep the final version.

## Recommendation

The best workflow is not "AI does everything."

The best workflow is:

1. AI creates momentum;
2. GitHub creates ownership;
3. W7S creates a repeatable deploy path.

That is how an AI-generated site becomes a website you can keep.

## Sources

- [W7S Build](https://build.w7s.io/)
- [Deploy From GitHub](/docs/deploy-from-github/)
- [URLs And Routing](/docs/urls-and-routing/)
- [Custom Domains](/docs/custom-domains/)
- [Project Layouts](/docs/project-layouts/)
- [Observability](/docs/observability/)
- [Lovable](https://lovable.dev/)
- [Bolt.new](https://bolt.new/)
- [Emergent](https://emergent.sh/)
- [Replit Agent](https://docs.replit.com/core-concepts/agent/)
- [Claude Code](https://www.anthropic.com/product/claude-code)
