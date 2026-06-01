---
title: "Create a Website With AI Without a Website Builder Subscription"
description: Use AI to generate the website, GitHub to own it, and W7S to deploy it without turning the first draft into a permanent website-builder subscription.
slug: create-website-with-ai-without-builder-subscription
tags: [ai, website-builders, pricing, github]
---

AI changes the website-builder decision.

Before AI, many people paid for a builder because they needed the builder to create the site.

Now the first version can come from a prompt.

That makes the next question more important:

> Do you need a permanent website-builder subscription, or do you need a clean way to deploy the code AI created?

<!-- truncate -->

## When the Subscription Is the Product

A website-builder subscription can be worth it when the dashboard is central:

- visual editing;
- built-in CMS;
- booking tools;
- ecommerce;
- templates;
- forms;
- team roles;
- support;
- one-click publishing.

If those are the features you need every week, the subscription may be the right choice.

## When the Subscription Is Just Hosting

Sometimes the builder subscription mainly becomes a place to host files.

That is a weaker tradeoff if:

- the site is mostly static;
- the code can be exported;
- a developer or AI agent will edit the files later;
- GitHub can hold the project;
- the deploy can run from CI.

In that case, the builder helped create the first version, but it does not need to own the future of the site.

## The Repo-First Alternative

The repo-first workflow is:

1. create the site with AI;
2. export or copy the files;
3. put them in GitHub;
4. deploy from GitHub Actions;
5. keep improving the repository.

W7S is built for that deployment step.

It keeps the release path in a workflow file instead of a website-builder dashboard:

```yaml title=".github/workflows/deploy.yml"
- uses: actions/checkout@v5
- uses: w7s-io/w7s-cloud@v1
  with:
    token: ${{ github.token }}
```

## What You Keep

With the repo-first path, you keep:

- source code;
- commit history;
- deploy history;
- portability;
- a path to custom domains;
- a path to backend routes;
- a path to storage and queues later.

That matters because successful websites rarely stay exactly as generated.

## What Happens After the Deploy

W7S uses the GitHub repository to decide the default public URL.

If your repo is:

```text
github.com/acme/ai-made-site
```

then a production deploy from `main` or `master` is served at:

```text
https://acme.w7s.cloud/ai-made-site/
```

Branches get their own deploy environments. For example, a branch named `draft/new-services-page` becomes:

```text
https://draft-new-services-page--acme.w7s.cloud/ai-made-site/
```

If the repository has the same name as the owner, such as `github.com/acme/acme`, it can serve:

```text
https://acme.w7s.cloud/
```

So the repo-first path gives you a live URL without creating a separate hosting account or app project. See [Deploy From GitHub](/docs/deploy-from-github/) for the workflow and [URLs And Routing](/docs/urls-and-routing/) for the exact URL rules.

## Moving From w7s.cloud to Your Own Domain

You can keep the W7S deployment workflow and still use a normal business domain.

Add a `CNAME` file to the deployed output:

```text title="CNAME"
www.example.com
```

Then create a DNS CNAME that points to W7S:

```text
Type: CNAME
Name: www
Target: w7w.cloud
Proxy: enabled
```

W7S reads `CNAME` from the root and common output folders, including `dist/`, `build/`, `out/`, and frontend variants. If multiple repositories could claim the same hostname, use a TXT allowlist:

```text
Type: TXT
Name: _w7s.example.com
Value: acme/ai-made-site
```

That lets the custom domain stay attached to the repository you control. The complete instructions are in [Custom Domains](/docs/custom-domains/).

If the project needs more later, the repo-first path still works. W7S can serve static output first, then add JavaScript or TypeScript backend routes, runtime values, storage bindings, queues, schedules, workflows, logs, usage checks, and custom domains from the same repository model.

## What You Give Up

You may give up:

- a visual dashboard editor;
- built-in CMS tools;
- native booking or ecommerce features;
- bundled support;
- product-managed templates.

That is why the decision should be honest. A restaurant booking site may want a specialized builder. A simple service business site may not need one.

## Recommendation

Use AI for the first draft.

Use a builder subscription only if its ongoing features are worth paying for.

If what you really need is hosting and a repeatable deploy path, put the site in GitHub and deploy it with W7S.

## Sources

- [Deploy From GitHub](/docs/deploy-from-github/)
- [URLs And Routing](/docs/urls-and-routing/)
- [Custom Domains](/docs/custom-domains/)
- [Project Layouts](/docs/project-layouts/)
- [Observability](/docs/observability/)
- [W7S pricing](/docs/pricing/)
- [W7S Build](https://build.w7s.io/)
- [Lovable](https://lovable.dev/)
- [Bolt.new](https://bolt.new/)
- [Emergent](https://emergent.sh/)
