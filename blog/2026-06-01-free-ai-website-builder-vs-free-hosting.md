---
title: "Free AI Website Builder vs Free Hosting: What Actually Stays Free?"
description: Free AI website builders can create a prototype quickly, but hosting, domains, exports, forms, databases, and future changes decide what the site really costs.
slug: free-ai-website-builder-vs-free-hosting
tags: [ai, pricing, website-builders, hosting]
---

"Free AI website builder" is an attractive search because the promise sounds complete:

> describe the website, get the website, publish the website.

The real cost usually appears after the first draft.

<!-- truncate -->

## The Free Part

The free part is often generation or experimentation:

- prompt a first version;
- edit a few screens;
- preview the result;
- test whether the idea is worth continuing.

That is valuable. It lets a business owner or solo builder get unstuck without hiring a designer first.

But the first draft is not the full cost of ownership.

## The Parts That May Not Stay Free

Before committing to a builder, check:

- custom domains;
- hosting limits;
- bandwidth limits;
- form submissions;
- file storage;
- databases;
- authentication;
- code export;
- team access;
- analytics;
- commercial usage;
- removing platform branding;
- whether the site can be redeployed from GitHub.

The cheapest launch can become expensive if the project cannot move later.

## Free Hosting Is a Different Question

Hosting is about serving the final website.

W7S Cloud lets projects deploy from GitHub Actions without a W7S account, credit card, or separate cloud setup for the hosted starter path. That is different from a free AI builder trial.

The workflow is:

1. generate or write the site;
2. put it in GitHub;
3. deploy with the W7S GitHub Action;
4. keep future changes in the repository.

The free value is not only price. It is that the deployment path is visible.

## When a Builder Subscription Is Worth It

Pay for a builder when it keeps solving real problems:

- visual editing matters;
- nontechnical teammates need dashboard access;
- the built-in CMS is important;
- the platform handles payments, bookings, or ecommerce well;
- the team wants one product to own hosting and editing.

That is a valid tradeoff.

Just make the tradeoff intentionally.

## When Repo-First Hosting Is Better

Use GitHub plus W7S when:

- the site was generated as code;
- you want a public URL quickly;
- you want commits and rollback history;
- you expect developer edits later;
- you do not want hosting tied to the builder that generated the first draft;
- you may add backend routes or storage later.

AI generation can be temporary. The repository should be durable.

## What the Free W7S URL Looks Like

When W7S deploys from GitHub, it does not ask you to invent a separate app name first. The URL is based on the GitHub owner and repository.

For example:

```text
github.com/acme/free-ai-site
```

deploys from `main` or `master` to:

```text
https://acme.w7s.cloud/free-ai-site/
```

If you push a branch named `test/new-copy`, W7S serves that branch environment at:

```text
https://test-new-copy--acme.w7s.cloud/free-ai-site/
```

If your repository is named the same as the owner, such as `github.com/acme/acme`, it can serve the owner root:

```text
https://acme.w7s.cloud/
```

Those routing rules are covered in [URLs And Routing](/docs/urls-and-routing/). The deployment workflow itself is covered in [Deploy From GitHub](/docs/deploy-from-github/).

## What If You Do Not Want a w7s.cloud Domain?

Use a custom domain when the site is ready for customers.

Add a `CNAME` file to the deployed files:

```text title="CNAME"
www.example.com
```

Then add DNS for that hostname:

```text
Type: CNAME
Name: www
Target: w7w.cloud
Proxy: enabled
```

W7S reads `CNAME` from the root or common build output folders like `dist/`, `build/`, `out/`, `frontend/dist/`, `frontend/build/`, and `frontend/out/`. Add a TXT allowlist if you want to restrict future claims to your GitHub owner or exact repository:

```text
Type: TXT
Name: _w7s.example.com
Value: acme/free-ai-site
```

See [Custom Domains](/docs/custom-domains/) for the DNS details. Custom domains are also part of the free-tier shape limits listed in [Deploy API](/docs/deploy-api/#free-tier-shape-caps), so check the current limits when planning multiple hostnames.

If the site grows, the same repository can add more W7S features instead of starting over: backend routes, runtime values, key-value or database bindings, queues, schedules, workflows, logs, usage warnings, and custom domains. Start with the static deploy, then add only the pieces the site actually needs.

## Recommendation

Use a free AI website builder to explore.

Use GitHub to keep the project.

Use W7S to deploy it when the site should become more than a one-time prototype.

## Sources

- [W7S pricing](/docs/pricing/)
- [Usage Accounting](/docs/usage-accounting/)
- [Deploy From GitHub](/docs/deploy-from-github/)
- [URLs And Routing](/docs/urls-and-routing/)
- [Custom Domains](/docs/custom-domains/)
- [Deploy API](/docs/deploy-api/#free-tier-shape-caps)
- [Project Layouts](/docs/project-layouts/)
- [Observability](/docs/observability/)
- [W7S Build](https://build.w7s.io/)
- [Lovable pricing](https://lovable.dev/pricing)
- [Bolt pricing](https://bolt.new/pricing)
- [Emergent pricing](https://emergent.sh/)
