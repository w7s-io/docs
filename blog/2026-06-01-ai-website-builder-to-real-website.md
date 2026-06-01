---
title: "AI Website Builder: Turn an AI-Generated Site Into a Real Website"
description: AI website builders can generate the first draft. The next step is owning the code, putting it in GitHub, deploying it repeatably, and attaching the real-world pieces a business site needs.
slug: ai-website-builder-to-real-website
tags: [ai, website-builders, github, deploys]
---

AI website builders are good at the first draft.

That first draft is not the whole website.

The practical question is what happens after the AI creates the files:

- where does the code live?
- can you edit it later?
- can you deploy it again?
- can you add a custom domain?
- can you add a backend route, form handler, database, or storage later?
- can you move away from the builder if the project grows?

> AI can help create the site. The deployment workflow decides whether it becomes a real project.

<!-- truncate -->

## The New Website Workflow

The old small-business website workflow was usually:

1. choose a hosted website builder;
2. pick a template;
3. edit pages in the dashboard;
4. pay monthly for hosting, forms, domains, analytics, and add-ons.

The AI workflow is different:

1. describe the site;
2. let an AI builder generate the first version;
3. refine the copy, design, pages, and calls to action;
4. export or sync the code;
5. keep it in GitHub;
6. deploy it from the repository.

That last step matters. A website is easier to trust when the code, deploy process, and future edits are not trapped inside one product session.

## The Vibe-Coding Tools in This Space

There are several ways to generate the first version:

| Tool | Best first use | Deployment question |
| --- | --- | --- |
| [Lovable](https://lovable.dev/) | Chat an app or website into existence | Can the code and deploy path stay portable? |
| [Bolt.new](https://bolt.new/) | Browser-based full-stack prototyping | Does the project leave the builder cleanly? |
| [Emergent](https://emergent.sh/) | Conversational app generation | Where does long-term ownership live? |
| [Cloudflare Build](https://build.cloudflare.dev/) | Cloudflare-native generation | Is the app tied to one provider account model? |
| [W7S Build](https://build.w7s.io/) | Prompt to app, push to GitHub | Does the generated app land directly in a repo? |
| [Replit Agent](https://docs.replit.com/core-concepts/agent/) | Cloud IDE plus agent workflow | Is the deployment coupled to Replit? |
| [Cursor](https://docs.cursor.com/) | AI coding inside an editor | You still choose hosting and deployment. |
| [Claude Code](https://www.anthropic.com/product/claude-code) | Agentic edits in an existing codebase | You still need a release path. |

They are not all the same category. Some are app builders, some are editors, some are coding agents, and some are hosting environments. But they all create the same downstream need: the generated work has to become a durable project.

## What Makes an AI-Generated Site Real

For a business site, "real" usually means:

- the source files are recoverable;
- edits are tracked;
- deployment is repeatable;
- the site has a public URL;
- custom domains are supported;
- forms, search, uploads, or backend routes can be added later;
- another developer can understand how the site ships.

GitHub is the cleanest handoff point. Once the project is a repository, the website stops being a one-time artifact and becomes something the owner can maintain.

## Where W7S Fits

W7S is not trying to replace every AI website builder.

The better pattern is:

1. use an AI builder or coding agent to create the site;
2. put the project in GitHub;
3. deploy it with W7S from GitHub Actions;
4. add backend routes and bindings only when the site needs them.

For a new user, the deploy step is just a file in the repository. In the root of the GitHub project, create this folder path:

```text
.github/workflows/
```

Inside that folder, create this file:

```text
deploy.yml
```

The full file path should be:

```text
.github/workflows/deploy.yml
```

GitHub Actions reads YAML files from `.github/workflows/`. When you push to `main`, GitHub runs this workflow. The workflow checks out the repository and hands it to the official W7S deploy action. The complete W7S reference is [Deploy From GitHub](/docs/deploy-from-github/), and supported app folders are listed in [Project Layouts](/docs/project-layouts/).

Paste this into `.github/workflows/deploy.yml`:

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

Commit that file and push it to GitHub. If the site is plain HTML, CSS, and JavaScript, this can be enough. If the AI generated a React, Vite, Astro, Docusaurus, or other framework project, build it in GitHub Actions before the W7S step; [Deploy From GitHub](/docs/deploy-from-github/#build-before-deploy) shows the build-before-deploy pattern.

That gives the project a repeatable release path without adding a separate dashboard project first.

## What Happens After It Deploys

After the GitHub Action finishes, W7S serves the site from a URL based on the GitHub repository name.

If the repository is:

```text
github.com/acme/bookkeeping-site
```

then the production deployment from `main` or `master` is served at:

```text
https://acme.w7s.cloud/bookkeeping-site/
```

If you deploy a branch, W7S creates a branch environment. A branch named `feature/new-homepage` becomes `feature-new-homepage`, so the branch deploy is served at:

```text
https://feature-new-homepage--acme.w7s.cloud/bookkeeping-site/
```

There is one special case: if the repository has the same name as the GitHub owner, such as `github.com/acme/acme`, it can serve the owner root:

```text
https://acme.w7s.cloud/
```

That means a beginner does not need to choose a platform project name first. The GitHub owner and repository already define the default W7S URL. See [URLs And Routing](/docs/urls-and-routing/) for the full mapping rules and [Deploy From GitHub](/docs/deploy-from-github/) for the workflow.

## Adding Your Own Domain

The default `w7s.cloud` URL is useful immediately, but most business websites eventually use their own domain.

To serve the same deployment from a non-`w7s.cloud` hostname, add a `CNAME` file to the deployed files:

```text title="CNAME"
www.example.com
```

W7S looks for `CNAME` in common deploy output locations, including the repository root, `dist/`, `build/`, `out/`, `frontend/dist/`, `frontend/build/`, and `frontend/out/`.

Then create DNS for that hostname and point it at W7S:

```text
Type: CNAME
Name: www
Target: w7w.cloud
Proxy: enabled
```

W7S can claim the first custom domain without TXT verification, but the safer long-term setup is to add a TXT allowlist so only your GitHub owner or exact repository can claim it later:

```text
Type: TXT
Name: _w7s.example.com
Value: acme/bookkeeping-site
```

Use [Custom Domains](/docs/custom-domains/) for the exact DNS shape and [Project Layouts](/docs/project-layouts/) to confirm where your built files should live before deployment.

From there, the same repository can stay static or grow into more of an app. W7S supports static frontends, JavaScript or TypeScript backend routes, runtime values, storage bindings, queues, schedules, workflows, logs, usage checks, and custom domains. Start with [Deploy From GitHub](/docs/deploy-from-github/), then use [Project Layouts](/docs/project-layouts/) and the backend docs when the site needs more than static pages.

## The SEO Angle

If you are using AI to create a business website, do not stop at the homepage.

Build the pages people actually search for:

- homepage;
- service pages;
- location pages;
- pricing or packages;
- contact page;
- about page;
- FAQs;
- comparison pages;
- blog posts that answer customer questions.

AI can draft these pages quickly, but the repository should still own the final output. That makes SEO improvements reviewable and repeatable instead of hidden in a builder session.

## Recommendation

Use an AI website builder for speed.

Use GitHub for ownership.

Use W7S when you want the deploy path to stay close to the repository.

That is the practical path from "AI generated a site" to "this is a real website I can keep improving."

## Sources

- [Lovable](https://lovable.dev/)
- [Bolt.new](https://bolt.new/)
- [Emergent](https://emergent.sh/)
- [Cloudflare Build](https://build.cloudflare.dev/)
- [W7S Build](https://build.w7s.io/)
- [Replit Agent](https://docs.replit.com/core-concepts/agent/)
- [Cursor docs](https://docs.cursor.com/)
- [Claude Code](https://www.anthropic.com/product/claude-code)
- [Deploy From GitHub](/docs/deploy-from-github/)
- [URLs And Routing](/docs/urls-and-routing/)
- [Custom Domains](/docs/custom-domains/)
- [Project Layouts](/docs/project-layouts/)
- [Observability](/docs/observability/)
